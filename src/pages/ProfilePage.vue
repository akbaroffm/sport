<template>
  <div class="min-h-screen pb-24 lg:pb-8 bg-white">
    <!-- Profile header -->
    <div class="bg-blue-600 px-4 sm:px-6 lg:px-8 pt-6 pb-12 rounded-b-[2rem]">
      <div class="flex items-center gap-4 max-w-3xl mx-auto">
        <div
          class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
        >
          <UserIcon :size="30" class="text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-extrabold text-white truncate">
            {{ user.name }}
          </h2>
          <p class="text-sm text-blue-200 truncate">{{ user.email }}</p>
          <div class="flex items-center gap-1 mt-1 text-xs text-blue-200">
            <MapPin :size="11" />
            <span>{{ user.city || "Shahar belgilanmagan" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats cards (pulled up over header) -->
    <div class="px-4 sm:px-6 lg:px-8 -mt-8 max-w-3xl mx-auto">
      <div class="grid grid-cols-3 gap-2.5">
        <div class="bg-white rounded-2xl p-3.5 text-center">
          <Heart :size="18" class="text-red-500 mx-auto mb-1.5" />
          <p class="text-xl font-extrabold text-slate-900">{{ favCount }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-0.5">
            Sevimlilar
          </p>
        </div>
        <div class="bg-white rounded-2xl p-3.5 text-center">
          <GitCompareArrows :size="18" class="text-blue-600 mx-auto mb-1.5" />
          <p class="text-xl font-extrabold text-slate-900">{{ compCount }}</p>
          <p class="text-[10px] font-semibold text-slate-400 mt-0.5">
            Solishtirish
          </p>
        </div>
        <div class="bg-white rounded-2xl p-3.5 text-center">
          <CalendarDays :size="18" class="text-emerald-600 mx-auto mb-1.5" />
          <p class="text-xl font-extrabold text-slate-900">
            {{ daysAsMember }}
          </p>
          <p class="text-[10px] font-semibold text-slate-400 mt-0.5">Kunlar</p>
        </div>
      </div>
    </div>

    <!-- Menu items -->
    <div class="px-4 sm:px-6 lg:px-8 pt-5 max-w-3xl mx-auto">
      <div class="space-y-1">
        <router-link
          to="/favorites"
          class="flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-2xl"
        >
          <Heart :size="18" class="text-red-500" />
          <span class="flex-1 text-sm font-semibold text-slate-700"
            >Sevimlilar</span
          >
          <ChevronRight :size="16" class="text-slate-400" />
        </router-link>
        <router-link
          to="/compare"
          class="flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-2xl"
        >
          <GitCompareArrows :size="18" class="text-blue-600" />
          <span class="flex-1 text-sm font-semibold text-slate-700"
            >Solishtirish</span
          >
          <ChevronRight :size="16" class="text-slate-400" />
        </router-link>
        <router-link
          to="/map"
          class="flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-2xl"
        >
          <MapIcon :size="18" class="text-emerald-600" />
          <span class="flex-1 text-sm font-semibold text-slate-700"
            >Xarita</span
          >
          <ChevronRight :size="16" class="text-slate-400" />
        </router-link>
      </div>
    </div>

    <!-- Edit Profile -->
    <div class="px-4 sm:px-6 lg:px-8 pt-5 max-w-3xl mx-auto">
      <h2
        class="text-[15px] font-bold text-slate-900 mb-3 flex items-center gap-2"
      >
        <Settings :size="16" class="text-slate-400" /> Profilni tahrirlash
      </h2>
      <div class="space-y-2.5">
        <div class="relative">
          <UserIcon
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="editName"
            type="text"
            placeholder="Ism"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div class="relative">
          <MapPin
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="editCity"
            type="text"
            placeholder="Shahar"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <button
          @click="saveProfile"
          class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          Saqlash
        </button>
      </div>
    </div>

    <!-- Logout -->
    <div class="px-4 sm:px-6 lg:px-8 pt-2 max-w-3xl mx-auto">
      <button
        @click="handleLogout"
        class="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <LogOut :size="16" />
        Chiqish
      </button>
    </div>

    <!-- App version -->
    <div class="px-4 sm:px-6 lg:px-8 pt-6 pb-4 text-center max-w-3xl mx-auto">
      <p class="text-[11px] text-slate-300 font-medium">
        Sport & Fitness UZ v1.0
      </p>
    </div>

    <ToastNotification :message="toast" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useComparisonStore } from "../stores/comparisonStore";
import ToastNotification from "../components/ToastNotification.vue";
import {
  Heart,
  GitCompareArrows,
  CalendarDays,
  User as UserIcon,
  MapPin,
  LogOut,
  ChevronRight,
  Map as MapIcon,
  Settings,
} from "lucide-vue-next";

const router = useRouter();
const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const comparisonStore = useComparisonStore();

const user = computed(() => userStore.user);
const favCount = computed(() => favoritesStore.count);
const compCount = computed(() => comparisonStore.count);

const editName = ref(user.value?.name || "");
const editCity = ref(user.value?.city || "");
const toast = ref("");
const toastType = ref("success");

const daysAsMember = computed(() => {
  if (!user.value?.memberSince) return 0;
  const diff = Date.now() - new Date(user.value.memberSince).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

function saveProfile() {
  userStore.updateProfile({ name: editName.value, city: editCity.value });
  toast.value = "";
  setTimeout(() => {
    toast.value = "Profil yangilandi!";
    toastType.value = "success";
  }, 10);
}

function handleLogout() {
  userStore.logout();
  router.push("/login");
}
</script>
