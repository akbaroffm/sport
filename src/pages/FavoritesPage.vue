<template>
  <div class="min-h-screen pb-24 lg:pb-8">
    <div class="px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
      <h1 class="text-xl md:text-2xl font-bold text-slate-900">Sevimlilar</h1>
      <p class="text-xs text-slate-500 mt-0.5">
        {{ favoritesList.length }} ta saqlangan joy
      </p>
    </div>

    <div class="px-4 sm:px-6 lg:px-8 pt-4 max-w-7xl mx-auto">
      <div v-if="favoritesList.length === 0" class="text-center py-16">
        <Heart :size="48" class="mx-auto mb-3 text-slate-300" />
        <p class="text-lg font-bold text-slate-400">Sevimlilar yo'q</p>
        <p class="text-sm text-slate-400 mt-1">Yurak belgisini bosib saqlang</p>
        <router-link
          to="/"
          class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-2xl text-sm"
        >
          Ko'rish
        </router-link>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <FacilityCard v-for="f in favoritesList" :key="f.id" :facility="f" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useSearchStore } from "../stores/searchStore";
import FacilityCard from "../components/FacilityCard.vue";
import { Heart } from "lucide-vue-next";

const favoritesStore = useFavoritesStore();
const searchStore = useSearchStore();

const favoritesList = computed(() =>
  favoritesStore.favoriteIds
    .map((id) => searchStore.getFacilityById(id))
    .filter(Boolean),
);
</script>
