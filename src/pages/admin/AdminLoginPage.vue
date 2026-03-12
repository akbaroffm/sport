<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto"
        >
          <ShieldCheck :size="32" class="text-blue-600" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mt-4">
          Admin <span class="text-blue-600">Panel</span>
        </h1>
        <p class="text-sm text-slate-400 mt-1">Boshqaruv paneliga kirish</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-3">
        <div class="relative">
          <UserIcon
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="login"
            type="text"
            placeholder="Login"
            required
            class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div class="relative">
          <Lock
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Parol"
            required
            class="w-full pl-10 pr-10 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <component :is="showPassword ? EyeOff : Eye" :size="16" />
          </button>
        </div>

        <p
          v-if="error"
          class="text-red-500 text-sm font-semibold flex items-center gap-1"
        >
          <AlertCircle :size="14" /> {{ error }}
        </p>

        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          Kirish
        </button>
      </form>

      <div class="text-center mt-6">
        <router-link
          to="/"
          class="text-sm text-slate-400 hover:text-blue-600 transition-colors"
        >
          ← Asosiy saytga qaytish
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "../../stores/adminStore";
import {
  ShieldCheck,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-vue-next";

const router = useRouter();
const adminStore = useAdminStore();

const login = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

function handleLogin() {
  error.value = "";
  const result = adminStore.login(login.value, password.value);
  if (result.success) {
    router.push("/admin");
  } else {
    error.value = result.error;
  }
}
</script>
