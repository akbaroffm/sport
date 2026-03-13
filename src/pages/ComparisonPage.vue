<template>
  <div class="min-h-screen pb-24 lg:pb-8">
    <div class="px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-slate-900">Solishtirish</h1>
      <p class="text-xs text-slate-500 mt-0.5">
        {{ comparisonFacilities.length }}/3 tanlangan
      </p>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
      <div v-if="comparisonFacilities.length === 0" class="text-center py-16">
        <GitCompareArrows :size="48" class="mx-auto mb-3 text-slate-300" />
        <p class="text-lg font-bold text-slate-400">
          Solishtirish uchun joy yo'q
        </p>
        <p class="text-sm text-slate-400 mt-1">
          Tafsilot sahifasidan 3 tagacha joy qo'shing
        </p>
        <router-link
          to="/"
          class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-2xl text-sm"
        >
          Ko'rish
        </router-link>
      </div>

      <template v-else>
        <!-- Selected chips -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div
            v-for="f in comparisonFacilities"
            :key="f.id"
            class="flex items-center gap-2 bg-white rounded-xl px-3 py-2"
          >
            <span class="text-xs font-bold text-slate-700">{{ f.name }}</span>
            <button
              @click="comparisonStore.remove(f.id)"
              class="text-slate-400 hover:text-red-500"
            >
              <XIcon :size="14" />
            </button>
          </div>
          <button
            @click="comparisonStore.clear()"
            class="text-[11px] font-bold text-red-400 hover:text-red-600 px-3 py-2"
          >
            Tozalash
          </button>
        </div>

        <!-- AI Recommendation -->
        <div
          v-if="recommendation"
          class="mb-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4"
        >
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"
            >
              <Sparkles :size="16" class="text-white" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Tavsiya</h3>
              <p class="text-[11px] text-slate-500">Avtomatik tahlil asosida</p>
            </div>
          </div>
          <div class="bg-white/80 rounded-xl p-3 mt-1">
            <p class="text-sm font-bold text-blue-700 mb-1.5">
              🏆 {{ recommendation.name }}
            </p>
            <div class="space-y-1">
              <div
                v-for="(reason, i) in recommendation.reasons"
                :key="i"
                class="flex items-center gap-1.5 text-xs text-slate-600"
              >
                <CheckCircle :size="12" class="text-emerald-500 shrink-0" />
                {{ reason }}
              </div>
            </div>
            <router-link
              :to="`/facility/${recommendation.facilityId}`"
              class="inline-flex items-center gap-1 mt-2.5 text-xs font-bold text-blue-600"
            >
              Batafsil ko'rish <ChevronRight :size="14" />
            </router-link>
          </div>
        </div>

        <!-- Comparison table -->
        <div class="overflow-x-auto bg-white rounded-2xl">
          <table class="w-full text-xs">
            <thead>
              <tr>
                <th
                  class="text-left p-3 font-semibold text-slate-400 w-24"
                ></th>
                <th
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center min-w-[140px]"
                >
                  <router-link :to="`/facility/${f.id}`" class="block">
                    <div class="relative">
                      <img
                        :src="f.images[0]"
                        class="w-full h-24 object-cover rounded-xl mb-1.5"
                      />
                      <div
                        v-if="
                          recommendation && recommendation.facilityId === f.id
                        "
                        class="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                      >
                        <Trophy :size="12" class="text-white" />
                      </div>
                    </div>
                    <p
                      class="font-bold text-slate-900 hover:text-blue-600 text-sm"
                    >
                      {{ f.name }}
                    </p>
                  </router-link>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-3 font-semibold text-slate-400">Tur</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center capitalize"
                >
                  {{ f.type }}
                </td>
              </tr>
              <tr class="bg-slate-50/50">
                <td class="p-3 font-semibold text-slate-400">Reyting</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center font-bold"
                  :class="
                    isBest(f, 'rating') ? 'text-blue-600' : 'text-slate-600'
                  "
                >
                  <Star
                    :size="12"
                    class="inline text-yellow-400 mr-0.5"
                    fill="currentColor"
                  />
                  {{ f.rating }}
                  <span
                    v-if="isBest(f, 'rating')"
                    class="block text-[9px] text-emerald-500 font-bold mt-0.5"
                    >ENG YUQORI</span
                  >
                </td>
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-400">Sharhlar</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center"
                  :class="isBest(f, 'reviews') ? 'font-bold text-blue-600' : ''"
                >
                  {{ f.reviewCount }}
                  <span
                    v-if="isBest(f, 'reviews')"
                    class="block text-[9px] text-emerald-500 font-bold mt-0.5"
                    >ENG KO'P</span
                  >
                </td>
              </tr>
              <tr class="bg-slate-50/50">
                <td class="p-3 font-semibold text-slate-400">Narx</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center font-bold"
                  :class="
                    isBest(f, 'price') ? 'text-emerald-600' : 'text-blue-600'
                  "
                >
                  {{ formatPrice(f.monthlyPrice) }}
                  <span
                    v-if="isBest(f, 'price')"
                    class="block text-[9px] text-emerald-500 font-bold mt-0.5"
                    >ENG ARZON</span
                  >
                </td>
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-400">Ish vaqti</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center"
                >
                  {{ f.weekdayHours || f.openingHours }}
                </td>
              </tr>
              <tr class="bg-slate-50/50">
                <td class="p-3 font-semibold text-slate-400">Shahar</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center"
                >
                  {{ f.city }}
                </td>
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-400">Qulayliklar</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center"
                  :class="
                    isBest(f, 'amenities') ? 'font-bold text-blue-600' : ''
                  "
                >
                  {{ f.amenities?.length || 0 }} ta
                </td>
              </tr>
              <tr class="bg-slate-50/50">
                <td class="p-3 font-semibold text-slate-400">Xizmatlar</td>
                <td
                  v-for="f in comparisonFacilities"
                  :key="f.id"
                  class="p-3 text-center"
                >
                  <div class="flex flex-wrap gap-1 justify-center">
                    <span
                      v-for="s in f.services.slice(0, 3)"
                      :key="s"
                      class="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]"
                      >{{ s }}</span
                    >
                    <span
                      v-if="f.services.length > 3"
                      class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]"
                      >+{{ f.services.length - 3 }}</span
                    >
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useComparisonStore } from "../stores/comparisonStore";
import { useSearchStore } from "../stores/searchStore";
import {
  GitCompareArrows,
  X as XIcon,
  Star,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Trophy,
} from "lucide-vue-next";

const comparisonStore = useComparisonStore();
const searchStore = useSearchStore();

const comparisonFacilities = computed(() =>
  comparisonStore.comparisonIds
    .map((id) => searchStore.getFacilityById(id))
    .filter(Boolean),
);

const recommendation = computed(() => {
  if (comparisonFacilities.value.length < 2) return null;
  return searchStore.getComparisonRecommendation(comparisonStore.comparisonIds);
});

function isBest(facility, metric) {
  const list = comparisonFacilities.value;
  if (list.length < 2) return false;
  if (metric === "rating")
    return facility.rating === Math.max(...list.map((f) => f.rating));
  if (metric === "reviews")
    return facility.reviewCount === Math.max(...list.map((f) => f.reviewCount));
  if (metric === "price")
    return (
      facility.monthlyPrice === Math.min(...list.map((f) => f.monthlyPrice))
    );
  if (metric === "amenities")
    return (
      (facility.amenities?.length || 0) ===
      Math.max(...list.map((f) => f.amenities?.length || 0))
    );
  return false;
}

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}
</script>
