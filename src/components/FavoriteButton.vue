<template>
  <button
    @click.prevent.stop="toggle(id)"
    class="p-2 rounded-full bg-white backdrop-blur-sm transition-all active:scale-90 cursor-pointer border border-slate-200"
    :class="{ 'heart-pop': isFav }"
    :aria-label="isFav ? 'Sevimlilardan oʻchirish' : 'Sevimlilarga qoʻshish'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="15"
      height="15"
      :class="isFav ? '' : 'stroke-black'"
      class="transition-all duration-300"
    >
      <path
        :fill="isFav ? '#ef4444' : 'none'"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
           4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
           14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
           11.54L12 21.35z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useFavoritesStore } from "../stores/favoritesStore";

const props = defineProps({ id: { type: String, required: true } });
const store = useFavoritesStore();
const isFav = computed(() => store.isFavorite(props.id));
const { toggle } = store;
</script>
