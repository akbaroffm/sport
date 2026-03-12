import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useFavoritesStore = defineStore("favorites", () => {
  const favoriteIds = ref(
    JSON.parse(localStorage.getItem("sportuz_favorites") || "[]"),
  );

  const count = computed(() => favoriteIds.value.length);

  function isFavorite(id) {
    return favoriteIds.value.includes(id);
  }

  function toggle(id) {
    if (isFavorite(id)) {
      favoriteIds.value = favoriteIds.value.filter((fid) => fid !== id);
    } else {
      favoriteIds.value = [...favoriteIds.value, id];
    }
    localStorage.setItem(
      "sportuz_favorites",
      JSON.stringify(favoriteIds.value),
    );
  }

  function clear() {
    favoriteIds.value = [];
    localStorage.setItem("sportuz_favorites", "[]");
  }

  return { favoriteIds, count, isFavorite, toggle, clear };
});
