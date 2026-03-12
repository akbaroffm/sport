import { defineStore } from "pinia";
import { ref, computed } from "vue";

import gyms from "../data/gyms.json";
import pools from "../data/pools.json";
import yogaStudios from "../data/yogaStudios.json";
import football from "../data/football.json";
import tennis from "../data/tennis.json";
import badminton from "../data/badminton.json";
import cycling from "../data/cycling.json";
import climbing from "../data/climbing.json";
import martialArts from "../data/martialArts.json";
import aerobics from "../data/aerobics.json";

const defaultFacilities = [
  ...gyms,
  ...pools,
  ...yogaStudios,
  ...football,
  ...tennis,
  ...badminton,
  ...cycling,
  ...climbing,
  ...martialArts,
  ...aerobics,
];

// Load admin-added data from localStorage
function loadAdminFacilities() {
  try {
    return JSON.parse(localStorage.getItem("admin_facilities") || "[]");
  } catch {
    return [];
  }
}
function loadAdminCategories() {
  try {
    return JSON.parse(localStorage.getItem("admin_categories") || "[]");
  } catch {
    return [];
  }
}
function loadDeletedFacilityIds() {
  try {
    return JSON.parse(localStorage.getItem("deleted_facility_ids") || "[]");
  } catch {
    return [];
  }
}
function loadFacilityUserRatings() {
  try {
    return JSON.parse(localStorage.getItem("facility_user_ratings") || "{}");
  } catch {
    return {};
  }
}

export const useSearchStore = defineStore("search", () => {
  const adminFacilities = ref(loadAdminFacilities());
  const deletedFacilityIds = ref(loadDeletedFacilityIds());
  const facilityUserRatings = ref(loadFacilityUserRatings());
  const adminFacilityIds = computed(
    () => new Set(adminFacilities.value.map((f) => f.id)),
  );
  const facilities = computed(() => {
    const deletedSet = new Set(deletedFacilityIds.value);
    const base = defaultFacilities.filter(
      (f) => !deletedSet.has(f.id) && !adminFacilityIds.value.has(f.id),
    );
    return [...base, ...adminFacilities.value];
  });

  const searchTerm = ref("");
  const activeCategory = ref("all");
  const priceFilter = ref("all");
  const ratingFilter = ref(0);
  const cityFilter = ref("all");
  const sortBy = ref("rating");
  const viewAllSection = ref(null); // 'new' | 'top' | 'popular' | 'affordable' | null

  // User location for nearest
  const userCity = ref(localStorage.getItem("sport_user_city") || "");
  const userLat = ref(
    parseFloat(localStorage.getItem("sport_user_lat")) || null,
  );
  const userLng = ref(
    parseFloat(localStorage.getItem("sport_user_lng")) || null,
  );

  function setUserLocation(city, lat, lng) {
    userCity.value = city;
    userLat.value = lat;
    userLng.value = lng;
    localStorage.setItem("sport_user_city", city);
    if (lat) localStorage.setItem("sport_user_lat", String(lat));
    if (lng) localStorage.setItem("sport_user_lng", String(lng));
  }

  const defaultCategories = [
    { key: "all", label: "Barchasi", icon: "LayoutGrid" },
    { key: "gym", label: "Zallar", icon: "Dumbbell" },
    { key: "pool", label: "Basseyn", icon: "Waves" },
    { key: "yoga", label: "Yoga", icon: "Flower2" },
    { key: "football", label: "Futbol", icon: "Goal" },
    { key: "tennis", label: "Tennis", icon: "CircleDot" },
    { key: "badminton", label: "Badminton", icon: "Feather" },
    { key: "cycling", label: "Velosiped", icon: "Bike" },
    { key: "climbing", label: "Alpinizm", icon: "Mountain" },
    { key: "martial-arts", label: "Jang san'ati", icon: "Swords" },
    { key: "aerobics", label: "Aerobika", icon: "Music" },
  ];
  const adminCategories = ref(loadAdminCategories());
  const categories = computed(() => [
    ...defaultCategories,
    ...adminCategories.value,
  ]);

  // City -> approx coords map for Uzbekistan cities
  const cityCoords = {
    Toshkent: [41.2995, 69.2401],
    Samarqand: [39.6542, 66.9597],
    Buxoro: [39.7745, 64.4286],
    Namangan: [40.9983, 71.6726],
    Andijon: [40.7821, 72.3442],
    Nukus: [42.4628, 59.6003],
    "Farg'ona": [40.3834, 71.787],
    Qarshi: [38.861, 65.8008],
    Jizzax: [40.1158, 67.8422],
    Urganch: [41.553, 60.6317],
    Navoiy: [40.0984, 65.3791],
    Termiz: [37.2241, 67.2783],
    Guliston: [40.4874, 68.7843],
  };

  function getCityCoords(city) {
    return cityCoords[city] || null;
  }

  const cities = computed(() => {
    const set = new Set(facilities.value.map((f) => f.city));
    return Array.from(set).sort();
  });

  function distanceBetween(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Nearest facilities to user
  const nearestFacilities = computed(() => {
    if (!userLat.value || !userLng.value) return [];
    return [...facilities.value]
      .map((f) => ({
        ...f,
        _dist: distanceBetween(userLat.value, userLng.value, f.lat, f.lng),
      }))
      .sort((a, b) => a._dist - b._dist)
      .slice(0, 8);
  });

  const filteredFacilities = computed(() => {
    let results = [...facilities.value];

    if (activeCategory.value !== "all") {
      results = results.filter((f) => f.type === activeCategory.value);
    }

    if (searchTerm.value.trim()) {
      const q = searchTerm.value.toLowerCase();
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.services.some((s) => s.toLowerCase().includes(q)) ||
          f.amenities.some((a) => a.toLowerCase().includes(q)),
      );
    }

    if (priceFilter.value !== "all") {
      results = results.filter((f) => f.priceRange === priceFilter.value);
    }

    if (ratingFilter.value > 0) {
      results = results.filter((f) => f.rating >= ratingFilter.value);
    }

    if (cityFilter.value !== "all") {
      results = results.filter((f) => f.city === cityFilter.value);
    }

    if (sortBy.value === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy.value === "price-low") {
      results.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    } else if (sortBy.value === "price-high") {
      results.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
    } else if (sortBy.value === "reviews") {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy.value === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  });

  // Curated sections
  const newFacilities = computed(() =>
    [...facilities.value].filter((f) => f.isNew).slice(0, 6),
  );

  const topRated = computed(() =>
    [...facilities.value].sort((a, b) => b.rating - a.rating).slice(0, 6),
  );

  const popularFacilities = computed(() =>
    [...facilities.value]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6),
  );

  const affordableFacilities = computed(() =>
    [...facilities.value]
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)
      .slice(0, 6),
  );

  const premiumFacilities = computed(() =>
    [...facilities.value].filter((f) => f.priceRange === "$$$").slice(0, 6),
  );

  // "Barchasi" full lists
  const allNewFacilities = computed(() =>
    [...facilities.value].filter((f) => f.isNew),
  );
  const allTopRated = computed(() =>
    [...facilities.value].sort((a, b) => b.rating - a.rating),
  );
  const allPopularFacilities = computed(() =>
    [...facilities.value].sort((a, b) => b.reviewCount - a.reviewCount),
  );
  const allAffordableFacilities = computed(() =>
    [...facilities.value].sort((a, b) => a.monthlyPrice - b.monthlyPrice),
  );

  function getFacilityById(id) {
    return facilities.value.find((f) => f.id === id) || null;
  }

  function getNearbyFacilities(id, limit = 6) {
    const facility = getFacilityById(id);
    if (!facility) return [];
    return facilities.value
      .filter((f) => f.id !== id && f.city === facility.city)
      .sort((a, b) => {
        const distA = Math.hypot(a.lat - facility.lat, a.lng - facility.lng);
        const distB = Math.hypot(b.lat - facility.lat, b.lng - facility.lng);
        return distA - distB;
      })
      .slice(0, limit);
  }

  function getSimilarFacilities(id, limit = 4) {
    const facility = getFacilityById(id);
    if (!facility) return [];
    return facilities.value
      .filter((f) => f.id !== id && f.type === facility.type)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Comparison recommendation
  function getComparisonRecommendation(facilityIds) {
    if (facilityIds.length < 2) return null;
    const facilities = facilityIds
      .map((id) => getFacilityById(id))
      .filter(Boolean);
    if (facilities.length < 2) return null;

    let bestId = null;
    let bestScore = -1;
    const reasons = [];

    facilities.forEach((f) => {
      const score =
        (f.rating / 5) * 40 +
        (Math.min(f.reviewCount, 200) / 200) * 20 +
        (1 - Math.min(f.monthlyPrice, 1000000) / 1000000) * 25 +
        (f.isVerified ? 10 : 0) +
        (f.amenities?.length || 0) * 0.5;

      if (score > bestScore) {
        bestScore = score;
        bestId = f.id;
      }
    });

    const best = getFacilityById(bestId);
    const others = facilities.filter((f) => f.id !== bestId);

    if (best.rating > Math.max(...others.map((o) => o.rating))) {
      reasons.push(`Eng yuqori reyting: ${best.rating}`);
    }
    if (best.monthlyPrice <= Math.min(...others.map((o) => o.monthlyPrice))) {
      reasons.push(`Eng arzon narx: ${formatPriceStatic(best.monthlyPrice)}`);
    }
    if (best.reviewCount >= Math.max(...others.map((o) => o.reviewCount))) {
      reasons.push(`Eng ko'p sharhlar: ${best.reviewCount}`);
    }
    if (best.isVerified) {
      reasons.push("Tasdiqlangan joy");
    }
    if (
      (best.amenities?.length || 0) >
      Math.max(...others.map((o) => o.amenities?.length || 0))
    ) {
      reasons.push(`Ko'proq qulayliklar: ${best.amenities.length} ta`);
    }

    if (reasons.length === 0) {
      reasons.push("Umumiy ko'rsatkichlari yaxshiroq");
    }

    return { facilityId: bestId, name: best.name, reasons };
  }

  function formatPriceStatic(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  }

  function setCategory(cat) {
    activeCategory.value = cat;
    viewAllSection.value = null;
  }

  function setSearch(term) {
    searchTerm.value = term;
  }

  function resetFilters() {
    searchTerm.value = "";
    activeCategory.value = "all";
    priceFilter.value = "all";
    ratingFilter.value = 0;
    cityFilter.value = "all";
    sortBy.value = "rating";
    viewAllSection.value = null;
  }

  // --- Admin CRUD methods ---
  function addFacility(facility) {
    adminFacilities.value.push(facility);
    localStorage.setItem(
      "admin_facilities",
      JSON.stringify(adminFacilities.value),
    );
  }

  function updateFacility(id, updates) {
    const idx = adminFacilities.value.findIndex((f) => f.id === id);
    if (idx >= 0) {
      adminFacilities.value[idx] = {
        ...adminFacilities.value[idx],
        ...updates,
      };
    } else {
      // System facility — copy to admin with overrides
      const original = defaultFacilities.find((f) => f.id === id);
      if (original) {
        adminFacilities.value.push({ ...original, ...updates, id });
      }
    }
    localStorage.setItem(
      "admin_facilities",
      JSON.stringify(adminFacilities.value),
    );
  }

  function removeFacility(id) {
    const adminIdx = adminFacilities.value.findIndex((f) => f.id === id);
    if (adminIdx >= 0) {
      adminFacilities.value.splice(adminIdx, 1);
      localStorage.setItem(
        "admin_facilities",
        JSON.stringify(adminFacilities.value),
      );
    }
    // Also mark as deleted (covers system facilities and prevents re-appearing)
    if (defaultFacilities.some((f) => f.id === id)) {
      if (!deletedFacilityIds.value.includes(id)) {
        deletedFacilityIds.value.push(id);
        localStorage.setItem(
          "deleted_facility_ids",
          JSON.stringify(deletedFacilityIds.value),
        );
      }
    }
  }

  function addCategory(category) {
    adminCategories.value.push(category);
    localStorage.setItem(
      "admin_categories",
      JSON.stringify(adminCategories.value),
    );
  }

  function removeCategory(key) {
    adminCategories.value = adminCategories.value.filter((c) => c.key !== key);
    localStorage.setItem(
      "admin_categories",
      JSON.stringify(adminCategories.value),
    );
  }

  function saveFacilityUserRatings() {
    localStorage.setItem(
      "facility_user_ratings",
      JSON.stringify(facilityUserRatings.value),
    );
  }

  function getUserRatingForFacility(facilityId, userId) {
    if (!facilityId || !userId) return 0;
    return facilityUserRatings.value[facilityId]?.[userId] || 0;
  }

  function submitFacilityRating(facilityId, userId, value) {
    const facility = getFacilityById(facilityId);
    if (!facility || !userId) return false;

    const rating = Math.max(1, Math.min(5, Number(value)));
    if (!facilityUserRatings.value[facilityId]) {
      facilityUserRatings.value[facilityId] = {};
    }

    const prevUserRating =
      facilityUserRatings.value[facilityId][userId] || null;
    const prevAvg = Number(facility.rating || 0);
    const prevCount = Number(facility.reviewCount || 0);

    let nextAvg = prevAvg;
    let nextCount = prevCount;

    if (prevUserRating) {
      nextAvg =
        (prevAvg * prevCount - prevUserRating + rating) /
        Math.max(prevCount, 1);
    } else {
      nextCount = prevCount + 1;
      nextAvg = (prevAvg * prevCount + rating) / nextCount;
    }

    facilityUserRatings.value[facilityId][userId] = rating;
    saveFacilityUserRatings();

    updateFacility(facilityId, {
      rating: Number(nextAvg.toFixed(1)),
      reviewCount: nextCount,
    });

    return true;
  }

  return {
    searchTerm,
    activeCategory,
    priceFilter,
    ratingFilter,
    cityFilter,
    sortBy,
    viewAllSection,
    userCity,
    userLat,
    userLng,
    categories,
    cities,
    filteredFacilities,
    allFacilities: () => facilities.value,
    facilities,
    adminFacilities,
    adminCategories,
    newFacilities,
    topRated,
    popularFacilities,
    affordableFacilities,
    premiumFacilities,
    allNewFacilities,
    allTopRated,
    allPopularFacilities,
    allAffordableFacilities,
    nearestFacilities,
    getFacilityById,
    getNearbyFacilities,
    getSimilarFacilities,
    getComparisonRecommendation,
    getCityCoords,
    setCategory,
    setSearch,
    setUserLocation,
    resetFilters,
    addFacility,
    updateFacility,
    removeFacility,
    addCategory,
    removeCategory,
    submitFacilityRating,
    getUserRatingForFacility,
  };
});
