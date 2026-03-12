<template>
  <div class="bg-white rounded-2xl p-5">
    <div class="flex items-center gap-4">
      <div
        class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"
      >
        <UserIcon :size="28" class="text-blue-600" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-bold text-slate-900 truncate">
          {{ user.name }}
        </h2>
        <p class="text-sm text-slate-500 truncate">{{ user.email }}</p>
        <div class="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
          <MapPin :size="11" />
          <span>{{ user.city }}</span>
          <span class="mx-1">·</span>
          <Calendar :size="11" />
          <span>{{ user.memberSince }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User as UserIcon, MapPin, Calendar } from "lucide-vue-next";

defineProps({ user: { type: Object, required: true } });
</script>
