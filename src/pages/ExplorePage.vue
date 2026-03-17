<template>
  <div class="min-h-screen pb-30 lg:pb-8">
    <!-- Sticky Header: Search + Location + Filter -->
    <div class="sticky top-0 md:top-15 z-30 backdrop-blur-md bg-white/80">
      <div class="px-4 sm:px-6 lg:px-8 pt-2 pb-1.5 max-w-7xl mx-auto">
        <!-- Top row: Location + Title (mobile) -->
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <button
            @click="detectLocation"
            class="flex items-center gap-1.5 min-w-0"
          >
            <div
              class="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0"
            >
              <LocateFixed :size="14" class="text-blue-600" />
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-semibold text-slate-700 truncate max-w-[180px] sm:max-w-xs leading-tight"
              >
                {{
                  locationLoading
                    ? "Aniqlanmoqda..."
                    : detectedAddress || "Aniqlash"
                }}
              </p>
            </div>
            <ChevronDown :size="14" class="text-slate-400 shrink-0" />
          </button>
          <img src="../../public/spotr.png" class="w-24 h-8 object-cover" />
        </div>

        <!-- Search row with filter button -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <Search
              :size="16"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              v-model="searchStore.searchTerm"
              type="text"
              placeholder="Qidirish..."
              class="w-full pl-9 pr-9 py-2 bg-slate-100 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button
              v-if="searchStore.searchTerm"
              @click="searchStore.searchTerm = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X :size="16" class="text-slate-400" />
            </button>
          </div>
          <button
            @click="showFilterPanel = !showFilterPanel"
            :class="[
              'relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0',
              showFilterPanel || activeFilterCount > 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600',
            ]"
          >
            <SlidersHorizontal :size="18" />
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >{{ activeFilterCount }}</span
            >
          </button>
        </div>
      </div>

      <!-- Categories: horizontal scroll, always visible in sticky -->
      <div
        class="px-4 sm:px-6 lg:px-8 pt-1.5 pb-2 max-w-7xl mx-auto overflow-x-auto scrollbar-hide"
      >
        <div class="flex gap-1.5">
          <button
            v-for="cat in searchStore.categories"
            :key="cat.key"
            @click="searchStore.setCategory(cat.key)"
            :class="[
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all whitespace-nowrap',
              searchStore.activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50',
            ]"
          >
            <component :is="iconMap[cat.icon]" :size="14" :stroke-width="2.2" />
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>
    <!-- /Sticky Header -->

    <!-- Filter panel (slide-down sheet) -->
    <transition name="slide-down">
      <div
        v-if="showFilterPanel"
        class="px-4 sm:px-6 lg:px-8 pb-3 max-w-7xl mx-auto"
      >
        <div
          class="bg-white rounded-2xl p-4 space-y-4 border border-slate-100 shadow-lg shadow-slate-200/50"
        >
          <!-- City filter -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">Shahar</p>
            <div class="flex gap-1.5 flex-wrap">
              <button
                @click="searchStore.cityFilter = 'all'"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.cityFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                Hammasi
              </button>
              <button
                v-for="c in cities"
                :key="c"
                @click="
                  searchStore.cityFilter =
                    searchStore.cityFilter === c ? 'all' : c
                "
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.cityFilter === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <!-- Price range -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">
              Narx oralig'i
            </p>
            <div class="flex gap-2 mb-2">
              <input
                v-model="priceFromInput"
                type="text"
                placeholder="dan"
                class="flex-1 bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-xl outline-none placeholder-slate-400"
              />
              <input
                v-model="priceToInput"
                type="text"
                placeholder="gacha"
                class="flex-1 bg-slate-50 text-xs text-slate-700 px-3 py-2 rounded-xl outline-none placeholder-slate-400"
              />
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="p in pricePresets"
                :key="p.label"
                @click="
                  searchStore.priceFilter =
                    searchStore.priceFilter === p.value ? 'all' : p.value
                "
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.priceFilter === p.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ p.label }}
              </button>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">Saralash</p>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="s in sortOptions"
                :key="s.value"
                @click="searchStore.sortBy = s.value"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.sortBy === s.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ s.label }}
              </button>
            </div>
          </div>

          <!-- Rating -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">Min reyting</p>
            <div class="flex gap-1.5">
              <button
                v-for="r in [0, 3, 3.5, 4, 4.5]"
                :key="r"
                @click="searchStore.ratingFilter = r"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.ratingFilter === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ r === 0 ? "Hammasi" : r + "+" }}
              </button>
            </div>
          </div>

          <!-- Gender / audience -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">
              Kimlar uchun
            </p>
            <div class="flex gap-1.5 flex-wrap">
              <button
                @click="searchStore.genderFilter = 'all'"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.genderFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                Hammasi
              </button>
              <button
                @click="searchStore.genderFilter = 'male'"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.genderFilter === 'male'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                Faqat erkaklar
              </button>
              <button
                @click="searchStore.genderFilter = 'female'"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  searchStore.genderFilter === 'female'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                Faqat ayollar
              </button>
            </div>
          </div>

          <!-- Amenities filter -->
          <div>
            <p class="text-xs font-semibold text-slate-500 mb-2">
              Xususiyatlar
            </p>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="a in amenityFilterOptions"
                :key="a"
                @click="toggleAmenityFilter(a)"
                :class="[
                  'px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors',
                  selectedAmenities.includes(a)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ a }}
              </button>
            </div>
          </div>

          <!-- Actions row -->
          <div class="flex items-center justify-between pt-1">
            <button
              @click="resetAllFilters"
              class="text-sm font-semibold text-red-500"
            >
              Tozalash
            </button>
            <button
              @click="showFilterPanel = false"
              class="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
            >
              Qo'llash
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Active filter chips (when panel closed) -->
    <div
      v-if="activeFilterCount > 0 && !showFilterPanel"
      class="px-4 sm:px-6 lg:px-8 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide max-w-7xl mx-auto"
    >
      <span
        v-if="searchStore.cityFilter !== 'all'"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      >
        {{ searchStore.cityFilter }}
        <button @click="searchStore.cityFilter = 'all'">
          <X :size="12" />
        </button>
      </span>
      <span
        v-if="searchStore.priceFilter !== 'all'"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      >
        {{ searchStore.priceFilter }}
        <button @click="searchStore.priceFilter = 'all'">
          <X :size="12" />
        </button>
      </span>
      <span
        v-if="searchStore.ratingFilter > 0"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      >
        {{ searchStore.ratingFilter }}+
        <button @click="searchStore.ratingFilter = 0"><X :size="12" /></button>
      </span>
      <span
        v-if="searchStore.genderFilter !== 'all'"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      >
        {{
          searchStore.genderFilter === "male"
            ? "Faqat erkaklar"
            : "Faqat ayollar"
        }}
        <button @click="searchStore.genderFilter = 'all'">
          <X :size="12" />
        </button>
      </span>
      <span
        v-for="a in selectedAmenities"
        :key="a"
        class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      >
        {{ a }}
        <button @click="toggleAmenityFilter(a)"><X :size="12" /></button>
      </span>
    </div>

    <!-- VIEW ALL section -->
    <div
      v-if="searchStore.viewAllSection"
      class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button
            @click="searchStore.viewAllSection = null"
            class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100"
          >
            <ArrowLeft :size="16" class="text-slate-600" />
          </button>
          <h2 class="text-base font-bold text-slate-900">{{ viewAllTitle }}</h2>
        </div>
        <p class="text-xs text-slate-400 font-medium">
          {{ viewAllList.length }} ta
        </p>
      </div>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <FacilityCard v-for="f in viewAllList" :key="f.id" :facility="f" />
      </div>
    </div>

    <!-- Search active: show filtered grid -->
    <div
      v-else-if="isSearchActive"
      class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div class="flex items-center justify-between mb-3">
        <p class="text-sm font-bold text-slate-700">
          {{ displayedFilteredFacilities.length }} natija
        </p>
        <button
          @click="resetAllFilters"
          class="text-xs font-semibold text-blue-600"
        >
          Tozalash
        </button>
      </div>
      <div
        v-if="displayedFilteredFacilities.length === 0"
        class="text-center py-16"
      >
        <SearchX :size="48" class="mx-auto mb-3 text-slate-300" />
        <p class="text-lg font-bold text-slate-400">Natija topilmadi</p>
        <p class="text-sm text-slate-400 mt-1">
          Qidiruv yoki filtrlarni o'zgartiring
        </p>
        <button
          @click="resetAllFilters"
          class="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-2xl text-sm"
        >
          Filtrlarni tiklash
        </button>
      </div>
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <FacilityCard
          v-for="facility in visibleFacilities"
          :key="facility.id"
          :facility="facility"
        />
      </div>
      <div v-if="hasMore" class="flex justify-center py-5">
        <button
          @click="loadMore"
          class="px-6 py-2 bg-slate-100 text-slate-600 font-semibold rounded-full text-sm"
        >
          Ko'proq ko'rsatish
        </button>
      </div>
    </div>

    <!-- Default: curated sections -->
    <template v-else>
      <div v-if="loading" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SkeletonLoader :count="4" />
      </div>

      <template v-else>
        <!-- Nearest facilities -->
        <section v-if="nearestFacilities.length" class="mt-1 max-w-7xl mx-auto">
          <div
            class="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2"
          >
            <h2
              class="text-base font-bold text-slate-900 flex items-center gap-1.5"
            >
              <Navigation :size="14" class="text-blue-600" /> Sizga yaqin
            </h2>
          </div>
          <div class="px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
            <div class="flex gap-3 sm:gap-4" style="width: max-content">
              <div
                v-for="f in nearestFacilities"
                :key="f.id"
                class="w-46 lg:w-56 shrink-0"
              >
                <FacilityCard :facility="f" :compact="true" />
              </div>
            </div>
          </div>
        </section>

        <!-- New facilities -->
        <section v-if="newFacilities.length" class="mt-4 max-w-7xl mx-auto">
          <div
            class="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2"
          >
            <h2
              class="text-base font-bold text-slate-900 flex items-center gap-1.5"
            >
              <Sparkles :size="14" class="text-blue-600" /> Yangi e'lonlar
            </h2>
            <button
              @click="searchStore.viewAllSection = 'new'"
              class="text-xs font-semibold text-blue-600 flex items-center gap-0.5"
            >
              Barchasi <ChevronRight :size="14" />
            </button>
          </div>
          <div
            class="px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <FacilityCard
              v-for="f in newFacilities"
              :key="f.id"
              :facility="f"
            />
          </div>
        </section>

        <!-- Top rated -->
        <section class="mt-6 max-w-7xl mx-auto">
          <div
            class="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2"
          >
            <h2
              class="text-base font-bold text-slate-900 flex items-center gap-1.5"
            >
              <Star :size="14" class="text-amber-500" /> Top reyting
            </h2>
            <button
              @click="searchStore.viewAllSection = 'top'"
              class="text-xs font-semibold text-blue-600 flex items-center gap-0.5"
            >
              Barchasi <ChevronRight :size="14" />
            </button>
          </div>
          <div
            class="px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <FacilityCard v-for="f in topRated" :key="f.id" :facility="f" />
          </div>
        </section>

        <!-- Popular -->
        <section class="mt-6 max-w-7xl mx-auto">
          <div
            class="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2"
          >
            <h2
              class="text-base font-bold text-slate-900 flex items-center gap-1.5"
            >
              <TrendingUp :size="14" class="text-orange-500" /> Mashhur joylar
            </h2>
            <button
              @click="searchStore.viewAllSection = 'popular'"
              class="text-xs font-semibold text-blue-600 flex items-center gap-0.5"
            >
              Barchasi <ChevronRight :size="14" />
            </button>
          </div>
          <div
            class="px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <FacilityCard
              v-for="f in popularFacilities"
              :key="f.id"
              :facility="f"
            />
          </div>
        </section>

        <!-- Affordable -->
        <section class="mt-6 mb-4 max-w-7xl mx-auto">
          <div
            class="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-2"
          >
            <h2
              class="text-base font-bold text-slate-900 flex items-center gap-1.5"
            >
              <Wallet :size="14" class="text-emerald-500" /> Qulay narxlar
            </h2>
            <button
              @click="searchStore.viewAllSection = 'affordable'"
              class="text-xs font-semibold text-blue-600 flex items-center gap-0.5"
            >
              Barchasi <ChevronRight :size="14" />
            </button>
          </div>
          <div
            class="px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <FacilityCard
              v-for="f in affordableFacilities"
              :key="f.id"
              :facility="f"
            />
          </div>
        </section>
      </template>
    </template>

    <!-- Floating map button -->
    <router-link
      to="/map"
      class="fixed bottom-18 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full active:scale-95 transition-transform"
    >
      <MapIcon :size="16" />
      <span class="text-sm font-semibold">Xaritada ko'rish</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "../stores/searchStore";
import FacilityCard from "../components/FacilityCard.vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import {
  ChevronRight,
  ChevronDown,
  Map as MapIcon,
  SearchX,
  Search,
  X,
  SlidersHorizontal,
  Navigation,
  ArrowLeft,
  LocateFixed,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
  LayoutGrid,
  Dumbbell,
  Waves,
  Flower2,
  Goal,
  CircleDot,
  Feather,
  Bike,
  Mountain,
  Swords,
  Music,
} from "lucide-vue-next";

const searchStore = useSearchStore();
const {
  filteredFacilities,
  cities,
  newFacilities,
  topRated,
  popularFacilities,
  affordableFacilities,
  nearestFacilities,
  allNewFacilities,
  allTopRated,
  allPopularFacilities,
  allAffordableFacilities,
} = storeToRefs(searchStore);

const loading = ref(true);
const perPage = 12;
const currentPage = ref(1);
const showFilterPanel = ref(false);
const detectedAddress = ref("");
const locationLoading = ref(false);
const priceFromInput = ref("");
const priceToInput = ref("");
const selectedAmenities = ref([]);

const iconMap = {
  LayoutGrid,
  Dumbbell,
  Waves,
  Flower2,
  Goal,
  CircleDot,
  Feather,
  Bike,
  Mountain,
  Swords,
  Music,
};

const pricePresets = [
  { label: "200K gacha", value: "$" },
  { label: "200-500K", value: "$$" },
  { label: "500K+", value: "$$$" },
];

const sortOptions = [
  { label: "Top reyting", value: "rating" },
  { label: "Sharhlar", value: "reviews" },
  { label: "Arzon", value: "price-low" },
  { label: "Qimmat", value: "price-high" },
  { label: "Nomi", value: "name" },
];

const amenityFilterOptions = [
  "Wi-Fi",
  "Parking",
  "Showers",
  "Sauna",
  "Spa",
  "Cafe",
  "Locker Rooms",
  "Towel Service",
  "Steam Room",
  "Childcare Room",
];

function toggleAmenityFilter(a) {
  const idx = selectedAmenities.value.indexOf(a);
  if (idx >= 0) selectedAmenities.value.splice(idx, 1);
  else selectedAmenities.value.push(a);
}

const isSearchActive = computed(
  () =>
    searchStore.searchTerm.trim() !== "" ||
    searchStore.activeCategory !== "all" ||
    searchStore.cityFilter !== "all" ||
    searchStore.priceFilter !== "all" ||
    searchStore.ratingFilter > 0 ||
    searchStore.genderFilter !== "all" ||
    selectedAmenities.value.length > 0,
);

const activeFilterCount = computed(() => {
  let c = 0;
  if (searchStore.cityFilter !== "all") c++;
  if (searchStore.priceFilter !== "all") c++;
  if (searchStore.ratingFilter > 0) c++;
  if (searchStore.sortBy !== "rating") c++;
  if (searchStore.genderFilter !== "all") c++;
  c += selectedAmenities.value.length;
  return c;
});

const displayedFilteredFacilities = computed(() => {
  let list = filteredFacilities.value;
  if (selectedAmenities.value.length > 0) {
    list = list.filter((f) =>
      selectedAmenities.value.every((a) => f.amenities?.includes(a)),
    );
  }
  return list;
});

const visibleFacilities = computed(() =>
  displayedFilteredFacilities.value.slice(0, currentPage.value * perPage),
);

const hasMore = computed(
  () =>
    visibleFacilities.value.length < displayedFilteredFacilities.value.length,
);

function loadMore() {
  currentPage.value++;
}

function resetAllFilters() {
  searchStore.resetFilters();
  selectedAmenities.value = [];
  showFilterPanel.value = false;
}

// View all data
const viewAllTitle = computed(() => {
  const m = {
    new: "Yangi e'lonlar",
    top: "Top reyting",
    popular: "Mashhur joylar",
    affordable: "Qulay narxlar",
  };
  return m[searchStore.viewAllSection] || "";
});

const viewAllList = computed(() => {
  const m = {
    new: allNewFacilities,
    top: allTopRated,
    popular: allPopularFacilities,
    affordable: allAffordableFacilities,
  };
  const r = m[searchStore.viewAllSection];
  return r ? r.value : [];
});

// Location - real GPS detection with reverse geocoding + IP fallback
function detectLocation() {
  locationLoading.value = true;

  // Try restoring from localStorage first
  const savedLat = localStorage.getItem("sport_user_lat");
  const savedLng = localStorage.getItem("sport_user_lng");
  const savedAddr = localStorage.getItem("sport_user_address");
  if (savedAddr && savedLat) {
    detectedAddress.value = savedAddr;
  }

  if (!navigator.geolocation) {
    // No geolocation support — use IP-based fallback
    ipFallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      handleCoords(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      // GPS denied/failed — try IP-based
      ipFallback();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
  );
}

function ipFallback() {
  // Default to Tashkent center if nothing else works
  const defaultLat = 41.2995;
  const defaultLng = 69.2401;
  handleCoords(defaultLat, defaultLng, true);
}

function handleCoords(lat, lng, isApprox = false) {
  searchStore.setUserLocation("", lat, lng);

  // Pick closest city
  let closest = "";
  let minDist = Infinity;
  for (const c of cities.value) {
    const cc = searchStore.getCityCoords(c);
    if (!cc) continue;
    const d = Math.hypot(cc[0] - lat, cc[1] - lng);
    if (d < minDist) {
      minDist = d;
      closest = c;
    }
  }
  if (closest) {
    searchStore.setUserLocation(closest, lat, lng);
  }

  // Reverse geocode via Nominatim
  fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uz`,
  )
    .then((r) => r.json())
    .then((data) => {
      let addr = "";
      if (data?.display_name) {
        const parts = data.display_name
          .split(",")
          .slice(0, 3)
          .map((s) => s.trim());
        addr = parts.join(", ");
      } else {
        addr = closest || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      if (isApprox) addr = addr + " (taxminiy)";
      detectedAddress.value = addr;
      localStorage.setItem("sport_user_address", addr);
      locationLoading.value = false;
    })
    .catch(() => {
      const addr = closest || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      detectedAddress.value = isApprox ? addr + " (taxminiy)" : addr;
      localStorage.setItem("sport_user_address", detectedAddress.value);
      locationLoading.value = false;
    });
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
  // Auto-detect location on mount
  detectLocation();
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
