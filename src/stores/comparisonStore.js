import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useComparisonStore = defineStore("comparison", () => {
  const comparisonIds = ref([]);
  const MAX = 3;

  const count = computed(() => comparisonIds.value.length);
  const isFull = computed(() => comparisonIds.value.length >= MAX);

  function isInComparison(id) {
    return comparisonIds.value.includes(id);
  }

  function toggle(id) {
    if (isInComparison(id)) {
      comparisonIds.value = comparisonIds.value.filter((cid) => cid !== id);
    } else if (!isFull.value) {
      comparisonIds.value = [...comparisonIds.value, id];
    }
  }

  function remove(id) {
    comparisonIds.value = comparisonIds.value.filter((cid) => cid !== id);
  }

  function clear() {
    comparisonIds.value = [];
  }

  return {
    comparisonIds,
    count,
    isFull,
    isInComparison,
    toggle,
    remove,
    clear,
  };
});
