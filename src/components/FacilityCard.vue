<template>
  <router-link
    :to="`/facility/${facility.id}`"
    class="block bg-white rounded-2xl overflow-hidden transition-all"
  >
    <!-- Image -->
    <div class="relative">
      <img
        :src="facility.images[0]"
        :alt="facility.name"
        class="w-full aspect-[4/3] object-cover"
        loading="lazy"
      />
      <!-- Image count badge -->

      <!-- Favorite -->
      <div class="absolute top-2.5 right-2.5">
        <FavoriteButton :id="facility.id" />
      </div>
      <!-- Gender badge -->
      <div
        v-if="facility.audience === 'male' || facility.audience === 'female'"
        class="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        :class="
          facility.audience === 'male'
            ? 'bg-blue-600 text-white'
            : 'bg-pink-500 text-white'
        "
      >
        <component
          :is="facility.audience === 'male' ? Mars : Venus"
          :size="12"
        />
        <span>
          {{ facility.audience === "male" ? "Erkaklar uchun" : "Ayollar uchun" }}
        </span>
      </div>

      <!-- New badge -->
      <div
        v-if="facility.isNew"
        class="absolute bottom-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
      >
        Yangi
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3 class="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
        {{ facility.name }}
      </h3>

      <div class="flex items-center gap-1 mt-1 text-slate-500">
        <MapPin :size="12" class="shrink-0" />
        <span class="text-xs truncate"
          >{{ facility.city }}, {{ facility.address }}</span
        >
      </div>

      <!-- Specs row -->
      <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
        <span class="flex items-center gap-0.5">
          <Star :size="12" class="text-yellow-400" fill="currentColor" />
          {{ facility.rating }}
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between mt-2.5 pt-2.5">
        <span class="text-sm font-extrabold text-blue-600">{{
          formatPrice(facility.monthlyPrice)
        }}</span>
        <span class="text-[11px] text-slate-400 font-medium">/oy</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import FavoriteButton from "./FavoriteButton.vue";
import {
  MapPin,
  Star,

  ImageIcon,
  Mars,
  Venus,
} from "lucide-vue-next";

defineProps({
  facility: { type: Object, required: true },
  compact: { type: Boolean, default: false },
});

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}
</script>
