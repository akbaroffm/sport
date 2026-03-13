<template>
  <div class="min-h-screen bg-white">
    <div v-if="!facility" class="flex items-center justify-center h-64">
      <p class="text-slate-400 font-bold text-lg">Topilmadi</p>
    </div>

    <template v-else>
      <!-- Sticky top bar (transparent over gallery, solid on scroll) -->
      <div
        class="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between bg-white/90 backdrop-blur-md max-w-5xl mx-auto w-full"
      >
        <button
          @click="$router.back()"
          class="w-8.25 h-8.25 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-600"
        >
          <ArrowLeft :size="18" />
        </button>
        <div class="flex items-center gap-1.5">
          <button
            @click="shareFacility"
            class="w-8.25 h-8.25 flex items-center justify-center rounded-full bg-slate-100/80 text-slate-500"
          >
            <Share2 :size="16" />
          </button>
          <button
            @click="toggleCompare"
            class="w-8.25 h-8.25 flex items-center justify-center rounded-full bg-slate-100/80"
            :class="isInComparison ? 'text-blue-600' : 'text-slate-500'"
          >
            <GitCompareArrows :size="16" />
          </button>
          <FavoriteButton :id="facility.id" />
        </div>
      </div>

      <!-- Gallery (full-width) -->
      <div class="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <FacilityGallery :images="facility.gallery" />
      </div>

      <!-- Content wrapper -->
      <div class="max-w-5xl mx-auto">
        <!-- Header section -->
        <div class="px-4 sm:px-6 lg:px-8 pt-2">
          <!-- Badges row -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              class="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold"
              >{{ typeLabel }}</span
            >
            <span
              v-if="facility.audience === 'male' || facility.audience === 'female'"
              class="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold"
              :class="
                facility.audience === 'male'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-pink-50 text-pink-700'
              "
            >
              <component
                :is="facility.audience === 'male' ? Mars : Venus"
                :size="12"
              />
              <span>
                {{
                  facility.audience === "male"
                    ? "Faqat erkaklar uchun"
                    : "Faqat ayollar uchun"
                }}
              </span>
            </span>

            <span
              v-if="facility.isNew"
              class="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-[11px] font-bold"
              >Yangi</span
            >
          </div>

          <!-- Title -->

          <!-- Rating & Reviews -->
          <div class="flex items-center justify-between gap-2 mt-3">
            <h1 class="text-[22px] font-extrabold text-slate-900 leading-tight">
              {{ facility.name }}
            </h1>
            <div
              class="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg"
            >
              <Star :size="13" class="text-amber-500" fill="currentColor" />
              <span class="font-extrabold text-sm text-amber-700">{{
                facility.rating
              }}</span>
            </div>
            <!-- <span class="text-xs text-slate-400 font-medium"
              >{{ facility.reviewCount }} ta baho</span
            > -->
          </div>

          <!-- Location -->
          <div class="flex items-center gap-1.5 mt-2.5 text-sm text-slate-500">
            <MapPin :size="14" class="text-blue-500 shrink-0" />
            <span>{{ facility.city }}, {{ facility.address }}</span>
          </div>

          <!-- Working Hours & Rest Days (Styled like other cards) -->
        </div>

        <!-- Description -->
        <div class="px-4 sm:px-6 lg:px-8 pt-2">
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ facility.description }}
          </p>
        </div>

        <!-- Working Hours & Rest Days Card -->
        <div class="px-4 sm:px-6 lg:px-8 pt-4">
          <!-- <h2 class="text-[15px] font-bold text-slate-900 mb-2.5 flex items-center gap-2">
            <Clock :size="16" class="text-blue-500" /> Ish vaqti va Dam olish
          </h2> -->
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
              <Clock :size="16" class="text-blue-600 shrink-0" />
              <div class="flex flex-col">
                <span class="text-[11px] text-slate-400 font-medium leading-none mb-1">Ish vaqti</span>
                <div class="flex items-center gap-2">
                  <span class="text-[13px] text-slate-700 font-bold leading-none">{{ facility.weekdayHours || facility.openingHours }}</span>
                  <!-- <span 
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide leading-none"
                    :class="isOpenNow ? 'bg-emerald-100/50 text-emerald-600' : 'bg-rose-100/50 text-rose-600'"
                  >
                    {{ isOpenNow ? 'Ochiq' : 'Yopiq' }}
                  </span> -->
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
              <Calendar :size="16" class="text-rose-500 shrink-0" />
              <div class="flex flex-col">
                <span class="text-[11px] text-slate-400 font-medium leading-none mb-1">Dam olish kunlari</span>
                <span class="text-[13px] font-bold leading-none" :class="restDaysLabel ? 'text-rose-600' : 'text-black'">
                  {{ restDaysLabel || "Har kuni" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="px-4 sm:px-6 lg:px-8 pt-2">
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ facility.description }}
          </p>
        </div>

        <!-- Quick actions -->
        <div class="px-4 sm:px-6 lg:px-8 pt-4 flex gap-2">
          <a
            :href="'tel:' + facility.phone"
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-2xl"
          >
            <Phone :size="18" class="text-emerald-600" />
            <span class="text-xs font-bold text-emerald-700">Qo'ng'iroq</span>
          </a>
          <a
            v-if="facility.socialMedia?.telegram"
            :href="'https://t.me/' + facility.socialMedia.telegram"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 rounded-2xl"
          >
            <Send :size="18" class="text-blue-600" />
            <span class="text-xs font-bold text-blue-700">Telegram</span>
          </a>
          <div
            v-else
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl opacity-40"
          >
            <Send :size="18" class="text-slate-400" />
            <span class="text-xs font-bold text-slate-400">Telegram</span>
          </div>
          <button
            @click="shareFacility"
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-50 rounded-2xl"
          >
            <Share2 :size="18" class="text-violet-600" />
            <span class="text-xs font-bold text-violet-700">Ulashish</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="mx-4 sm:mx-6 lg:mx-8 mt-5 h-px bg-slate-100"></div>



        <!-- Amenities with icons -->
        <div class="px-4 sm:px-6 lg:px-8 pt-4">
          <h2
            class="text-[15px] font-bold text-slate-900 mb-3 flex items-center gap-2"
          >
            <Sparkles :size="16" class="text-blue-500" /> Qulayliklar
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <div
              v-for="a in facility.amenities"
              :key="a"
              class="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5"
            >
              <component
                :is="getAmenityIcon(a)"
                :size="16"
                class="text-blue-600 shrink-0"
              />
              <span class="text-[13px] text-slate-700 font-medium">{{
                a
              }}</span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="mx-4 sm:mx-6 lg:mx-8 mt-5 h-px bg-slate-100"></div>

        <!-- Services -->
        <div class="px-4 sm:px-6 lg:px-8 pt-4">
          <h2
            class="text-[15px] font-bold text-slate-900 mb-2.5 flex items-center gap-2"
          >
            <Layers :size="16" class="text-blue-500" /> Xizmatlar
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="s in facility.services"
              :key="s"
              class="px-3 py-1.5 bg-slate-50 rounded-full text-xs font-semibold text-slate-600"
            >
              {{ s }}
            </span>
          </div>
        </div>

        <!-- Features -->
        <div v-if="facility.features?.length" class="px-4 sm:px-6 lg:px-8 pt-4">
          <h2
            class="text-[15px] font-bold text-slate-900 mb-2.5 flex items-center gap-2"
          >
            <CheckCircle :size="16" class="text-emerald-500" /> Xususiyatlar
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div
              v-for="feat in facility.features"
              :key="feat"
              class="flex items-center gap-2 text-sm text-slate-600"
            >
              <CheckCircle :size="13" class="text-emerald-400 shrink-0" />
              {{ feat }}
            </div>
          </div>
        </div>

        <!-- Tags -->
        <!-- <div v-if="facility.tags?.length" class="px-4 sm:px-6 lg:px-8 pt-4">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in facility.tags"
              :key="tag"
              class="px-2.5 py-1 bg-slate-100 rounded-full text-[11px] font-medium text-slate-500"
            >
              #{{ tag }}
            </span>
          </div>
        </div> -->

        <!-- Divider -->
        <div class="mx-4 sm:mx-6 lg:mx-8 mt-5 h-px bg-slate-100"></div>

        <!-- Social media -->
        <div v-if="facility.socialMedia" class="px-4 sm:px-6 lg:px-8 pt-4">
          <h2
            class="text-[15px] font-bold text-slate-900 mb-2.5 flex items-center gap-2"
          >
            <Globe :size="16" class="text-blue-500" /> Ijtimoiy tarmoqlar
          </h2>
          <div class="flex gap-2.5">
            <a
              v-if="facility.socialMedia.instagram"
              :href="'https://instagram.com/' + facility.socialMedia.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl text-xs font-semibold text-purple-700"
            >
              <Instagram :size="16" /> {{ facility.socialMedia.instagram }}
            </a>
            <a
              v-if="facility.socialMedia.telegram"
              :href="'https://t.me/' + facility.socialMedia.telegram"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-xl text-xs font-semibold text-blue-700"
            >
              <Send :size="16" /> {{ facility.socialMedia.telegram }}
            </a>
          </div>
        </div>

        <!-- Divider -->
        <div class="mx-4 sm:mx-6 lg:mx-8 mt-5 h-px bg-slate-100"></div>

        <!-- Map -->
        <div class="px-4 sm:px-6 lg:px-8 pt-4">
          <h2
            class="text-[15px] font-bold text-slate-900 mb-2.5 flex items-center gap-2"
          >
            <MapPin :size="16" class="text-blue-500" /> Joylashuv
          </h2>
          <div
            class="h-48 sm:h-64 lg:h-72 rounded-2xl overflow-hidden relative z-0"
          >
            <MapView
              :facilities="[facility]"
              :center="[facility.lat, facility.lng]"
              :zoom="15"
              :single-mode="true"
            />
          </div>
          <a
            :href="`https://www.google.com/maps?q=${facility.lat},${facility.lng}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-1.5 mt-2.5 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600"
          >
            <ExternalLink :size="13" /> Google Maps'da ochish
          </a>
        </div>

        <div class="px-4 sm:px-6 lg:px-8 pt-4">
          <div class="bg-slate-50 rounded-2xl p-3.5">
            <p class="text-xs text-slate-400 mb-2">Sizning bahoyingiz</p>
            <div
              v-if="userStore.isAuthenticated"
              class="flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-1.5">
                <button
                  v-for="n in [1, 2, 3, 4, 5]"
                  :key="n"
                  @click="submitRating(n)"
                  class="p-1 rounded-md transition-colors"
                  :class="
                    n <= userRating
                      ? 'text-amber-500'
                      : 'text-slate-300 hover:text-amber-400'
                  "
                  :title="`${n} yulduz`"
                >
                  <Star
                    :size="18"
                    :fill="n <= userRating ? 'currentColor' : 'none'"
                  />
                </button>
              </div>
              <p class="text-xs font-semibold text-slate-500">
                {{ userRating > 0 ? `${userRating}/5` : "Baholanmagan" }}
              </p>
            </div>
            <div v-else class="text-xs text-slate-500">
              Reyting qoldirish uchun ro'yxatdan o'ting yoki tizimga kiring.
              <router-link
                :to="{ name: 'Login', query: { redirect: $route.fullPath } }"
                class="text-blue-600 font-semibold ml-1"
              >
                Kirish
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- /Content wrapper -->

      <!-- Similar -->
      <div
        v-if="similar.length"
        class="px-4 sm:px-6 lg:px-8 pt-6 max-w-5xl mx-auto"
      >
        <h2 class="text-[15px] font-bold text-slate-900 mb-3">
          O'xshash joylar
        </h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <FacilityCard v-for="f in similar" :key="f.id" :facility="f" />
        </div>
      </div>

      <!-- Nearby -->
      <div
        v-if="nearby.length"
        class="px-4 sm:px-6 lg:px-8 pt-5 pb-32 lg:pb-8 max-w-5xl mx-auto"
      >
        <h2 class="text-[15px] font-bold text-slate-900 mb-3">
          {{ facility.city }}dagi yaqin joylar
        </h2>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <FacilityCard v-for="f in nearby" :key="f.id" :facility="f" />
        </div>
      </div>
      <div v-else class="pb-32 lg:pb-8"></div>

      <ToastNotification :message="shareToast" :type="shareToastType" />

      <!-- Sticky bottom CTA bar -->
      <div
        class="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-slate-100"
      >
        <div class="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <p class="text-[11px] text-slate-400 font-medium">Oylik narx</p>
            <p class="text-lg font-extrabold text-slate-900">
              {{ formatPrice(facility.monthlyPrice) }}
            </p>
          </div>
          <a
            :href="'tel:' + facility.phone"
            class="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform"
          >
            <Phone :size="16" />
            Bog'lanish
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, markRaw, ref } from "vue";
import { useRoute } from "vue-router";
import { useSearchStore } from "../stores/searchStore";
import { useComparisonStore } from "../stores/comparisonStore";
import { useUserStore } from "../stores/userStore";
import FacilityGallery from "../components/FacilityGallery.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import MapView from "../components/MapView.vue";
import FacilityCard from "../components/FacilityCard.vue";
import ToastNotification from "../components/ToastNotification.vue";
import {
  ArrowLeft,
  MapPin,

  Clock,
  Users,
  Phone,
  Ruler,
  Calendar,
  CheckCircle,
  Instagram,
  Send,
  GitCompareArrows,
  Share2,
  ExternalLink,
  CircleDot,
  Star,
  Info,
  Layers,
  Globe,
  ShowerHead,
  Wifi,
  Car,
  Flame,
  Coffee,
  Lock,
  Wind,
  Sparkles,
  Dumbbell,
  Cross,
  Baby,
  Speaker,
  Droplets,
  Bike,
  ShoppingBag,
  Armchair,
  Waves,
  ThermometerSun,
  TreePine,
  BookOpen,
  Mountain,
  Eye,
  Lightbulb,
  Package,
  Wrench,
  SquareParking,
  Mars,
  Venus,
} from "lucide-vue-next";

const route = useRoute();
const searchStore = useSearchStore();
const comparisonStore = useComparisonStore();
const userStore = useUserStore();

const facility = computed(() => searchStore.getFacilityById(route.params.id));
const nearby = computed(() =>
  facility.value ? searchStore.getNearbyFacilities(route.params.id, 4) : [],
);
const similar = computed(() =>
  facility.value ? searchStore.getSimilarFacilities(route.params.id, 4) : [],
);
const isInComparison = computed(() =>
  facility.value ? comparisonStore.isInComparison(facility.value.id) : false,
);

const shareToast = ref("");
const shareToastType = ref("success");
const userRating = computed(() => {
  if (!facility.value || !userStore.user?.id) return 0;
  return searchStore.getUserRatingForFacility(
    facility.value.id,
    userStore.user.id,
  );
});

const typeLabels = {
  gym: "Zal",
  pool: "Basseyn",
  yoga: "Yoga",
  football: "Futbol",
  tennis: "Tennis",
  badminton: "Badminton",
  cycling: "Velosiped",
  climbing: "Alpinizm",
  "martial-arts": "Jang san'ati",
  aerobics: "Aerobika",
};
const typeLabel = computed(() =>
  facility.value ? typeLabels[facility.value.type] || facility.value.type : "",
);

// Amenity icon mapping
const amenityIconMap = {
  Showers: markRaw(ShowerHead),
  "Wi-Fi": markRaw(Wifi),
  Parking: markRaw(SquareParking),
  Sauna: markRaw(Flame),
  Cafe: markRaw(Coffee),
  "Juice Bar": markRaw(Coffee),
  "Protein Bar": markRaw(Coffee),
  "Snack Bar": markRaw(Coffee),
  "Locker Rooms": markRaw(Lock),
  Lockers: markRaw(Lock),
  "Towel Service": markRaw(Package),
  Towels: markRaw(Package),
  "Towel Rental": markRaw(Package),
  "Steam Room": markRaw(Wind),
  Spa: markRaw(Sparkles),
  "Hair Dryers": markRaw(Wind),
  "Heated Water": markRaw(ThermometerSun),
  "Heated Pool": markRaw(ThermometerSun),
  "Heated Rooms": markRaw(ThermometerSun),
  "Heated Changing Rooms": markRaw(ThermometerSun),
  Gym: markRaw(Dumbbell),
  "First Aid": markRaw(Cross),
  "Childcare Room": markRaw(Baby),
  "Sound System": markRaw(Speaker),
  Water: markRaw(Droplets),
  "Water Cooler": markRaw(Droplets),
  "Water Stations": markRaw(Droplets),
  "Water Fountains": markRaw(Droplets),
  "Bike Storage": markRaw(Bike),
  "Bike Rental": markRaw(Bike),
  "Equipment Shop": markRaw(ShoppingBag),
  "Pro Shop": markRaw(ShoppingBag),
  "Repair Shop": markRaw(Wrench),
  "Repair Station": markRaw(Wrench),
  Lounge: markRaw(Armchair),
  "Lounge Chairs": markRaw(Armchair),
  "VIP Lounge": markRaw(Armchair),
  "Mat Rental": markRaw(Package),
  "Rental Gear": markRaw(Package),
  "Full Gear Rental": markRaw(Package),
  "Rental Shoes": markRaw(Package),
  "Tea Lounge": markRaw(Coffee),
  Tea: markRaw(Coffee),
  Garden: markRaw(TreePine),
  "Outdoor Garden": markRaw(TreePine),
  "Rooftop Terrace": markRaw(Mountain),
  Library: markRaw(BookOpen),
  Floodlights: markRaw(Lightbulb),
  "Pro Lighting": markRaw(Lightbulb),
  "Changing Rooms": markRaw(Lock),
  "Spectator Gallery": markRaw(Eye),
  Stands: markRaw(Eye),
  "Warm-up Pool": markRaw(Waves),
  "Vending Machines": markRaw(Coffee),
  Chalk: markRaw(Package),
  "Chalk Bar": markRaw(Package),
  "Crash Pads": markRaw(Package),
  Snacks: markRaw(Coffee),
  Restrooms: markRaw(Lock),
  "Mirrored Studio": markRaw(Eye),
  Studio: markRaw(Eye),
  "Training Mats": markRaw(Package),
  Mats: markRaw(Package),
  "Heavy Bags": markRaw(Dumbbell),
  "Boxing Ring": markRaw(Dumbbell),
  "Speed Bags": markRaw(Dumbbell),
  Weights: markRaw(Dumbbell),
  "Training Hall": markRaw(Dumbbell),
  Octagon: markRaw(Dumbbell),
  "Training Zone": markRaw(Dumbbell),
  "Video Room": markRaw(Eye),
  "Video Analysis Room": markRaw(Eye),
  Velodrome: markRaw(Bike),
  Helmets: markRaw(Package),
  Guide: markRaw(MapPin),
  Transport: markRaw(Car),
  "Organic Cafe": markRaw(Coffee),
  "Sports Bar": markRaw(Coffee),
  "Peloton Bikes": markRaw(Bike),
};

function getAmenityIcon(amenity) {
  return amenityIconMap[amenity] || markRaw(CheckCircle);
}

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // JS Date.getDay() format
const dayNamesUz = {
  mon: "Dushanba",
  tue: "Seshanba",
  wed: "Chorshanba",
  thu: "Payshanba",
  fri: "Juma",
  sat: "Shanba",
  sun: "Yakshanba",
};

const workingDaysLabel = computed(() => {
  if (!facility.value?.openDays) return "Har kuni";
  if (facility.value.openDays.length === 7) return "Har kuni";
  if (facility.value.openDays.length === 0) return "";
  
  // Simple range detection (e.g., Du-Ju)
  const days = facility.value.openDays;
  if (days.length === 5 && !days.includes('sat') && !days.includes('sun')) return "Du - Ju";
  
  return days.map(d => dayNamesUz[d].slice(0, 2)).join(", ");
});

const restDaysLabel = computed(() => {
  if (!facility.value?.openDays) return "";
  const all = Object.keys(dayNamesUz);
  const rest = all.filter(d => !facility.value.openDays.includes(d));
  if (rest.length === 0) return "";
  return rest.map(d => dayNamesUz[d]).join(", ");
});

// Open/closed status check
const isOpenNow = computed(() => {
  if (!facility.value) return false;
  const now = new Date();
  const dayKey = dayKeys[now.getDay()];
  
  // Check if today is a rest day
  if (facility.value.openDays && !facility.value.openDays.includes(dayKey)) {
    return false;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutesNow = hours * 60 + minutes;

  const hoursStr = facility.value.weekdayHours || facility.value.openingHours || "";
  const match = hoursStr.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  
  if (!match) return true;
  
  const openH = parseInt(match[1]);
  const openM = parseInt(match[2]);
  const closeH = parseInt(match[3]);
  const closeM = parseInt(match[4]);
  
  const totalOpenMin = openH * 60 + openM;
  let totalCloseMin = closeH * 60 + closeM;
  
  // Handle closing times past midnight (e.g., 23:00 - 02:00)
  if (totalCloseMin <= totalOpenMin) {
    totalCloseMin += 24 * 60;
  }
  
  return totalMinutesNow >= totalOpenMin && totalMinutesNow < totalCloseMin;
});

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

function toggleCompare() {
  if (facility.value) comparisonStore.toggle(facility.value.id);
}

function shareFacility() {
  if (!facility.value) return;
  const shareData = {
    title: facility.value.name,
    text: `${facility.value.name} - ${facility.value.city}`,
    url: window.location.href,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      copyToClipboard();
    });
  } else {
    copyToClipboard();
  }
}

function copyToClipboard() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showShareToast("Havola nusxalandi!");
      })
      .catch(() => {
        fallbackCopy(url);
      });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showShareToast("Havola nusxalandi!");
}

function showShareToast(msg) {
  shareToast.value = "";
  setTimeout(() => {
    shareToast.value = msg;
    shareToastType.value = "success";
  }, 10);
}

function submitRating(value) {
  if (!facility.value || !userStore.user?.id) return;
  const ok = searchStore.submitFacilityRating(
    facility.value.id,
    userStore.user.id,
    value,
  );
  if (ok) {
    showShareToast("Bahoyingiz saqlandi");
  }
}
</script>
