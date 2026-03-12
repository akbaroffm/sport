<template>
  <!-- Mobile/Tablet: bottom bar -->
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-center lg:hidden"
  >
    <div
      class="w-full flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <router-link
        v-for="item in navItems"
        :key="item.route"
        :to="item.route"
        class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all min-w-[56px]"
        :class="
          isActive(item.route)
            ? 'text-blue-600'
            : 'text-slate-400 hover:text-slate-600'
        "
      >
        <component
          :is="item.icon"
          :size="22"
          :stroke-width="isActive(item.route) ? 2.5 : 1.8"
        />
        <span class="text-[10px] font-semibold leading-tight">{{
          item.label
        }}</span>
      </router-link>
    </div>
  </nav>

  <!-- Desktop: top header navbar -->
  <header
    class="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100"
  >
    <div class="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <h1 class="text-lg font-extrabold text-slate-900">
          Sport & Fitness <span class="text-blue-600">UZ</span>
        </h1>
      </router-link>

      <!-- Nav links -->
      <nav class="flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold"
          :class="
            isActive(item.route)
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          "
        >
          <component
            :is="item.icon"
            :size="18"
            :stroke-width="isActive(item.route) ? 2.5 : 1.8"
          />
          {{ item.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import { Home, Map, Heart, GitCompareArrows, User } from "lucide-vue-next";

const route = useRoute();

function isActive(path) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

const navItems = [
  { route: "/", label: "Bosh sahifa", icon: Home },
  { route: "/map", label: "Xarita", icon: Map },
  { route: "/favorites", label: "Sevimlilar", icon: Heart },
  { route: "/compare", label: "Solishtirish", icon: GitCompareArrows },
  { route: "/profile", label: "Profil", icon: User },
];
</script>
