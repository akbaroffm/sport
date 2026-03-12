<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-100">
        <div
          class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3"
        >
          <Building2 :size="20" class="text-blue-600" />
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ totalFacilities }}</p>
        <p class="text-xs text-slate-400 font-medium mt-0.5">Jami obyektlar</p>
      </div>
      <div class="bg-white rounded-2xl p-4 border border-slate-100">
        <div
          class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3"
        >
          <FolderOpen :size="20" class="text-green-600" />
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ totalCategories }}</p>
        <p class="text-xs text-slate-400 font-medium mt-0.5">Kategoriyalar</p>
      </div>
      <div class="bg-white rounded-2xl p-4 border border-slate-100">
        <div
          class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3"
        >
          <MapPin :size="20" class="text-amber-600" />
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ totalCities }}</p>
        <p class="text-xs text-slate-400 font-medium mt-0.5">Shaharlar</p>
      </div>
      <div class="bg-white rounded-2xl p-4 border border-slate-100">
        <div
          class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3"
        >
          <PlusCircle :size="20" class="text-purple-600" />
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ adminAddedCount }}</p>
        <p class="text-xs text-slate-400 font-medium mt-0.5">Admin qo'shgan</p>
      </div>
    </div>

    <!-- Category Distribution -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 mb-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">
        Kategoriyalar bo'yicha
      </h2>
      <div class="space-y-3">
        <div
          v-for="cat in categoryStats"
          :key="cat.key"
          class="flex items-center gap-3"
        >
          <span class="text-sm font-medium text-slate-700 w-28 shrink-0">{{
            cat.label
          }}</span>
          <div class="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-500"
              :style="{ width: cat.percent + '%' }"
            />
          </div>
          <span class="text-sm font-bold text-slate-900 w-8 text-right">{{
            cat.count
          }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Admin Facilities -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-slate-900">
          Admin qo'shgan obyektlar
        </h2>
        <router-link
          to="/admin/facilities"
          class="text-sm text-blue-600 font-semibold"
        >
          Barchasi →
        </router-link>
      </div>
      <div
        v-if="recentAdminFacilities.length === 0"
        class="text-center py-8 text-slate-400 text-sm"
      >
        Hali obyekt qo'shilmagan
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="f in recentAdminFacilities"
          :key="f.id"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div
            class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0"
          >
            <Building2 :size="18" class="text-blue-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-900 truncate">
              {{ f.name }}
            </p>
            <p class="text-xs text-slate-400">{{ f.city }} · {{ f.type }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSearchStore } from "../../stores/searchStore";
import { Building2, FolderOpen, MapPin, PlusCircle } from "lucide-vue-next";

const searchStore = useSearchStore();

const totalFacilities = computed(() => searchStore.facilities.length);
const totalCategories = computed(
  () => searchStore.categories.filter((c) => c.key !== "all").length,
);
const totalCities = computed(() => searchStore.cities.length);
const adminAddedCount = computed(() => searchStore.adminFacilities.length);

const categoryStats = computed(() => {
  const cats = searchStore.categories.filter((c) => c.key !== "all");
  const max = Math.max(
    ...cats.map(
      (c) => searchStore.facilities.filter((f) => f.type === c.key).length,
    ),
    1,
  );
  return cats.map((c) => {
    const count = searchStore.facilities.filter((f) => f.type === c.key).length;
    return { key: c.key, label: c.label, count, percent: (count / max) * 100 };
  });
});

const recentAdminFacilities = computed(() =>
  searchStore.adminFacilities.slice(-5).reverse(),
);
</script>
