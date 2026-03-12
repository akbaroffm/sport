<script setup>
import { computed } from "vue";
import BottomNavigation from "./components/BottomNavigation.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
const showNav = computed(() => route.name !== "Map" && !isAdminRoute.value);
</script>

<template>
  <div class="min-h-screen font-sans antialiased flex">
    <!-- Sidebar nav for lg+ screens -->
    <BottomNavigation v-if="showNav" />

    <!-- Main content area -->
    <div
      class="w-full min-h-screen relative flex flex-col"
      :class="{ 'lg:pt-16': showNav }"
    >
      <main class="flex-1 flex flex-col">
        <router-view v-slot="{ Component, route: r }">
          <transition
            v-if="!isAdminRoute"
            :name="r.meta.transition || 'fade'"
            mode="out-in"
          >
            <component :is="Component" :key="r.path" />
          </transition>
          <component v-else :is="Component" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
