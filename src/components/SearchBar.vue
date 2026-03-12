<template>
  <div class="relative">
    <div
      class="flex items-center bg-slate-100 rounded-2xl px-3.5 py-2.5 gap-2.5"
    >
      <Search :size="18" class="text-slate-400 shrink-0" />
      <input
        type="text"
        :value="searchTerm"
        @input="onInput"
        placeholder="Qayerdan qidirasiz?"
        class="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
      />
      <button
        v-if="searchTerm"
        @click="clearSearch"
        class="text-slate-400 hover:text-slate-600 shrink-0"
      >
        <X :size="16" />
      </button>
      <button
        v-else
        @click="$router.push('/map')"
        class="text-slate-400 hover:text-blue-600 shrink-0"
      >
        <SlidersHorizontal :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useSearchStore } from "../stores/searchStore";
import { Search, X, SlidersHorizontal } from "lucide-vue-next";

const searchStore = useSearchStore();
const { searchTerm } = storeToRefs(searchStore);

let debounceTimer = null;

function onInput(e) {
  const val = e.target.value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchStore.setSearch(val);
  }, 250);
}

function clearSearch() {
  searchStore.setSearch("");
}
</script>
