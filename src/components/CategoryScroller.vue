<template>
  <div class="overflow-x-auto scrollbar-hide -mx-4 px-4">
    <div class="flex gap-2 pb-1">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="setCategory(cat.key)"
        class="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap"
        :class="
          activeCategory === cat.key
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:text-blue-600'
        "
      >
        <component :is="iconMap[cat.icon]" :size="16" :stroke-width="2" />
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSearchStore } from "../stores/searchStore";
import {
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
const { activeCategory, categories } = storeToRefs(searchStore);
const { setCategory } = searchStore;

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
</script>
