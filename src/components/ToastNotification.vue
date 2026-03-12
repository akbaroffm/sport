<template>
  <Teleport to="body">
    <transition name="toast">
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-[200] max-w-sm bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-3"
        role="alert"
      >
        <CheckCircle
          v-if="type === 'success'"
          :size="20"
          class="text-emerald-400 shrink-0"
        />
        <XCircle
          v-else-if="type === 'error'"
          :size="20"
          class="text-red-400 shrink-0"
        />
        <Info v-else :size="20" class="text-blue-400 shrink-0" />
        <span class="text-sm font-semibold">{{ message }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { CheckCircle, XCircle, Info } from "lucide-vue-next";

const props = defineProps({
  message: { type: String, default: "" },
  type: { type: String, default: "info" },
  duration: { type: Number, default: 3000 },
});

const visible = ref(false);
let timer = null;

watch(
  () => props.message,
  (msg) => {
    if (msg) {
      visible.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  },
);
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
