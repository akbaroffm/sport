<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white rounded-2xl overflow-hidden"
    >
      <div class="aspect-[4/3] bg-slate-200 skeleton-shimmer"></div>
      <div class="p-3 space-y-2.5">
        <div class="h-4 bg-slate-200 rounded-lg w-3/4 skeleton-shimmer"></div>
        <div class="h-3 bg-slate-200 rounded-lg w-full skeleton-shimmer"></div>
        <div class="h-3 bg-slate-200 rounded-lg w-1/2 skeleton-shimmer"></div>
        <div
          class="h-4 bg-slate-200 rounded-lg w-2/5 skeleton-shimmer mt-1"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ count: { type: Number, default: 4 } });
</script>
