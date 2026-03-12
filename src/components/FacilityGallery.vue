<template>
  <div v-if="images.length" class="relative overflow-hidden rounded-2xl">
    <div
      class="flex transition-transform duration-500 ease-out"
      :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
    >
      <div v-for="(img, i) in images" :key="i" class="w-full shrink-0">
        <img
          :src="img"
          :alt="`Rasm ${i + 1}`"
          class="w-full h-64 sm:h-80 lg:h-96 object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Image count -->
    <div
      class="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full"
    >
      <ImageIcon :size="13" />
      {{ activeIndex + 1 }}/{{ images.length }}
    </div>

    <button
      v-if="images.length > 1"
      @click="prev"
      class="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
    >
      <ChevronLeft :size="18" />
    </button>
    <button
      v-if="images.length > 1"
      @click="next"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
    >
      <ChevronRight :size="18" />
    </button>

    <div
      v-if="images.length > 1"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
    >
      <button
        v-for="(_, i) in images"
        :key="i"
        @click="activeIndex = i"
        class="w-2 h-2 rounded-full transition-all"
        :class="i === activeIndex ? 'bg-white w-6' : 'bg-white/50'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-vue-next";

const props = defineProps({ images: { type: Array, default: () => [] } });
const activeIndex = ref(0);

function next() {
  activeIndex.value = (activeIndex.value + 1) % props.images.length;
}
function prev() {
  activeIndex.value =
    (activeIndex.value - 1 + props.images.length) % props.images.length;
}
</script>
