<template>
  <div class="flex items-center gap-0.5">
    <template v-for="i in 5" :key="i">
      <Star
        :size="size"
        :fill="
          i <= Math.floor(rating)
            ? '#facc15'
            : i - 0.5 <= rating
              ? '#facc15'
              : '#e2e8f0'
        "
        :stroke="i <= Math.round(rating) ? '#facc15' : '#e2e8f0'"
        :stroke-width="0"
      />
    </template>
  </div>
</template>

<script setup>
import { Star } from "lucide-vue-next";

defineProps({
  rating: { type: Number, required: true },
  size: { type: Number, default: 14 },
});
</script>
