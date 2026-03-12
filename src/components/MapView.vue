<template>
  <div
    ref="mapContainer"
    class="w-full h-full rounded-3xl overflow-hidden"
    style="min-height: 300px"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import L from "leaflet";
import { useMapStore } from "../stores/mapStore";

const props = defineProps({
  facilities: { type: Array, default: () => [] },
  center: { type: Array, default: () => [41.2995, 69.2401] },
  zoom: { type: Number, default: 12 },
  singleMode: { type: Boolean, default: false },
  selectedId: { type: String, default: null },
});

const emit = defineEmits(["select"]);

const mapStore = useMapStore();
const mapContainer = ref(null);
let map = null;
let markers = [];
let activeMarkerId = null;

const categoryColors = {
  gym: "#2563eb",
  pool: "#06b6d4",
  yoga: "#8b5cf6",
  football: "#16a34a",
  tennis: "#eab308",
  badminton: "#f97316",
  cycling: "#ec4899",
  climbing: "#78716c",
  "martial-arts": "#dc2626",
  aerobics: "#a855f7",
};

const categoryIcons = {
  gym: "🏋️",
  pool: "🏊",
  yoga: "🧘",
  football: "⚽",
  tennis: "🎾",
  badminton: "🏸",
  cycling: "🚴",
  climbing: "🧗",
  "martial-arts": "🥋",
  aerobics: "💃",
};

function formatPrice(price) {
  if (price >= 1000000) return (price / 1000000).toFixed(1) + "M";
  if (price >= 1000) return Math.round(price / 1000) + "K";
  return price;
}

function markerHtml(f, active) {
  const color = categoryColors[f.type] || "#1e293b";
  const icon = categoryIcons[f.type] || "📍";
  const price = formatPrice(f.monthlyPrice);
  const scale = active ? "transform: scale(1.2);" : "";
  const shadow = active
    ? "box-shadow: 0 0 0 4px rgba(37,99,235,0.3), 0 4px 12px rgba(0,0,0,0.25);"
    : "box-shadow: 0 2px 8px rgba(0,0,0,0.2);";

  return `
    <div style="display:flex;flex-direction:column;align-items:center;${scale}transition:transform 0.2s ease;">
      <div style="background:${active ? "#2563eb" : color};color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:700;white-space:nowrap;${shadow}display:flex;align-items:center;gap:3px;">
        <span style="font-size:13px;line-height:1">${icon}</span>
        ${price}
      </div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid ${active ? "#2563eb" : color};margin-top:-1px;"></div>
    </div>
  `;
}

function createIcon(f, active = false) {
  return L.divIcon({
    html: markerHtml(f, active),
    iconSize: [80, 46],
    iconAnchor: [40, 46],
    className: "custom-marker",
  });
}

function initMap() {
  if (!mapContainer.value || map) return;

  map = L.map(mapContainer.value, { zoomControl: false }).setView(
    props.center,
    props.zoom,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  L.control.zoom({ position: "topright" }).addTo(map);

  updateMarkers();
}

function updateMarkers() {
  if (!map) return;

  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  const data = props.facilities.length ? props.facilities : [];

  data.forEach((f) => {
    const marker = L.marker([f.lat, f.lng], {
      icon: createIcon(f, f.id === activeMarkerId),
    }).addTo(map);

    marker._facilityId = f.id;

    marker.on("click", () => {
      // Update all markers to deselect, then select clicked
      activeMarkerId = f.id;
      mapStore.selectMarker(f.id);
      markers.forEach((m) => {
        const mf = data.find((x) => x.id === m._facilityId);
        if (mf) m.setIcon(createIcon(mf, mf.id === f.id));
      });
      emit("select", f);
    });

    markers.push(marker);
  });

  if (data.length > 1 && !props.singleMode) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

// When selectedId changes from parent
watch(
  () => props.selectedId,
  (id) => {
    if (!id) {
      activeMarkerId = null;
      const data = props.facilities;
      markers.forEach((m) => {
        const mf = data.find((x) => x.id === m._facilityId);
        if (mf) m.setIcon(createIcon(mf, false));
      });
    }
  },
  { immediate: false },
);

watch(() => props.facilities, updateMarkers, { deep: true });

onMounted(() => {
  setTimeout(initMap, 100);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style>
.custom-marker {
  background: none !important;
  border: none !important;
}
</style>
