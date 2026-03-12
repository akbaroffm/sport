<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Top Navbar -->
    <header
      class="sticky top-0 z-50 bg-white border-b border-slate-100 h-14 shrink-0"
    >
      <div
        class="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <router-link to="/admin" class="flex items-center gap-2">
          <ShieldCheck :size="24" class="text-blue-600" />
          <span class="text-lg font-bold text-slate-900"
            >Admin<span class="text-blue-600">Panel</span></span
          >
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden sm:flex items-center gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            "
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="flex items-center gap-3">
          <router-link
            to="/"
            class="text-xs text-slate-400 hover:text-blue-600 transition-colors hidden sm:block"
          >
            Saytga o'tish →
          </router-link>
          <button
            @click="handleLogout"
            class="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <LogOut :size="16" />
            <span class="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Bottom Nav -->
    <nav
      class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100"
    >
      <div class="flex items-center justify-around h-14">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center gap-0.5 w-full h-full text-[10px] font-medium transition-colors"
          :class="isActive(item.path) ? 'text-blue-600' : 'text-slate-400'"
        >
          <component :is="item.icon" :size="20" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Content -->
    <main class="flex-1 pb-16 sm:pb-4 overflow-y-auto">
      <router-view v-slot="{ Component }">
        <transition name="admin-fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAdminStore } from "../../stores/adminStore";
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  FolderOpen,
  LogOut,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const adminStore = useAdminStore();

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/facilities", label: "Obyektlar", icon: Building2 },
  { path: "/admin/categories", label: "Kategoriyalar", icon: FolderOpen },
];

function isActive(path) {
  if (path === "/admin") return route.path === "/admin";
  return route.path.startsWith(path);
}

function handleLogout() {
  adminStore.logout();
  router.push("/admin/login");
}
</script>

<style scoped>
.admin-fade-enter-active,
.admin-fade-leave-active {
  transition: opacity 0.15s ease;
}
.admin-fade-enter-from,
.admin-fade-leave-to {
  opacity: 0;
}
</style>
