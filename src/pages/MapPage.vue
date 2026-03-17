<template>
  <div class="h-screen flex flex-col relative">
    <!-- Map Controls (top overlay) -->
    <div class="absolute top-4 left-4 right-16 z-[1000] flex gap-2">
      <!-- Back button -->
      <router-link to="/" class="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl">
        <ArrowLeft :size="18" class="text-slate-700" />
      </router-link>

      <select
        v-model="filterCategory"
        class="flex-1 bg-white/95 backdrop-blur-sm text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl outline-none"
      >
        <option value="all">Barcha turlar</option>
        <option v-for="c in categories" :key="c.key" :value="c.key">
          {{ c.label }}
        </option>
      </select>
    </div>

    <div class="absolute bottom-8 right-4 z-[1000] flex gap-2">
      <button
        @click="locateMe"
        class="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl"
      >
        <LocateFixed :size="18" class="text-blue-600" />
      </button>
    </div>

    <!-- Map -->
    <div class="flex-1">
      <MapView
        :facilities="mapFacilities"
        :selectedId="selectedFacility?.id"
        @select="onMarkerSelect"
      />
    </div>

    <!-- Sticky preview card -->
    <transition name="slide-up">
      <div
        v-if="selectedFacility"
        class="absolute bottom-10 left-0 right-0 z-[1000] p-4 pb-6"
      >
        <div class="bg-white rounded-2xl overflow-hidden">
          <div class="flex gap-3 p-3">
            <!-- Image -->
            <router-link
              :to="`/facility/${selectedFacility.id}`"
              class="shrink-0"
            >
              <img
                :src="selectedFacility.images[0]"
                :alt="selectedFacility.name"
                class="w-24 h-24 rounded-xl object-cover"
              />
            </router-link>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-1">
                <h3 class="text-sm font-bold text-slate-900 line-clamp-1">
                  {{ selectedFacility.name }}
                </h3>
                <button @click="selectedFacility = null" class="shrink-0 p-0.5">
                  <X :size="16" class="text-slate-400" />
                </button>
              </div>

              <div class="flex items-center gap-1 mt-0.5 text-slate-500">
                <MapPin :size="11" />
                <span class="text-[11px] truncate"
                  >{{ selectedFacility.city }},
                  {{ selectedFacility.address }}</span
                >
              </div>

              <div class="flex items-center gap-2 mt-1.5">
                <span
                  class="flex items-center gap-0.5 text-xs font-bold text-amber-500"
                >
                  <Star :size="12" fill="currentColor" />
                  {{ selectedFacility.rating }}
                </span>
                <span class="text-[11px] text-slate-400"
                  >({{ selectedFacility.reviewCount }})</span
                >
              </div>

              <!-- Price + action -->
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm font-extrabold text-blue-600">{{
                  formatPrice(selectedFacility.monthlyPrice)
                }}</span>
                <router-link
                  :to="`/facility/${selectedFacility.id}`"
                  class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Batafsil <ChevronRight :size="14" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSearchStore } from "../stores/searchStore";
import { useMapStore } from "../stores/mapStore";
import MapView from "../components/MapView.vue";
import {
  LocateFixed,
  ArrowLeft,
  X,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-vue-next";

const searchStore = useSearchStore();
const mapStore = useMapStore();
const filterCategory = ref("all");
const selectedFacility = ref(null);

const categories = searchStore.categories.filter((c) => c.key !== "all");

const mapFacilities = computed(() => {
  const all = searchStore.allFacilities();
  if (filterCategory.value === "all") return all;
  return all.filter((f) => f.type === filterCategory.value);
});

function onMarkerSelect(facility) {
  selectedFacility.value = facility;
}

function locateMe() {
  mapStore.requestLocation();
}

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
