<template>
  <div class="min-h-screen flex items-center justify-center px-4 pb-24 lg:pb-8">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto"
        >
          <Dumbbell :size="32" class="text-blue-600" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mt-4">
          Sport<span class="text-blue-600">Uz</span>
        </h1>
        <p class="text-sm text-slate-400 mt-1">
          {{ isLogin ? "Xush kelibsiz!" : "Hisob yarating" }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div v-if="!isLogin" class="relative">
          <UserIcon
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="name"
            type="text"
            placeholder="Ism"
            required
            class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div class="relative">
          <Mail
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="email"
            type="email"
            placeholder="Email"
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
            minlength="4"
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
        <div v-if="!isLogin" class="relative">
          <MapPin
            :size="16"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="city"
            type="text"
            placeholder="Shahar"
            class="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30"
          />
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
          {{ isLogin ? "Kirish" : "Ro'yxatdan o'tish" }}
        </button>
      </form>

      <p class="text-center text-sm text-slate-400 mt-4">
        {{ isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?" }}
        <button
          @click="isLogin = !isLogin"
          class="text-blue-600 font-bold ml-1"
        >
          {{ isLogin ? "Ro'yxatdan o'tish" : "Kirish" }}
        </button>
      </p>

      <!-- Demo -->
      <div class="mt-6 p-3.5 bg-slate-50 rounded-xl">
        <p class="text-[11px] font-semibold text-slate-400 mb-0.5">
          Demo ma'lumotlar
        </p>
        <p class="text-xs text-slate-500">aziz@example.com / sport123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import {
  Dumbbell,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
} from "lucide-vue-next";

const router = useRouter();
const userStore = useUserStore();

const isLogin = ref(true);
const showPassword = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const city = ref("");
const error = ref("");

function handleSubmit() {
  error.value = "";

  if (isLogin.value) {
    const result = userStore.login(email.value, password.value);
    if (result.success) {
      router.push("/profile");
    } else {
      error.value = result.error;
    }
  } else {
    const result = userStore.signup(
      name.value,
      email.value,
      password.value,
      city.value,
    );
    if (result.success) {
      router.push("/profile");
    } else {
      error.value = result.error;
    }
  }
}
</script>
