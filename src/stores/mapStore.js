import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore("map", () => {
  const userLat = ref(null);
  const userLng = ref(null);
  const selectedMarkerId = ref(null);
  const hasLocation = ref(false);

  function requestLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        hasLocation.value = true;
      },
      () => {
        // Default to Tashkent center
        userLat.value = 41.2995;
        userLng.value = 69.2401;
        hasLocation.value = true;
      },
    );
  }

  function selectMarker(id) {
    selectedMarkerId.value = id;
  }

  function clearSelection() {
    selectedMarkerId.value = null;
  }

  return {
    userLat,
    userLng,
    selectedMarkerId,
    hasLocation,
    requestLocation,
    selectMarker,
    clearSelection,
  };
});
