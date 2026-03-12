<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-auto"
        >
          <div
            class="sticky top-0 bg-white rounded-t-3xl p-4 flex items-center justify-between z-10"
          >
            <h2 class="text-xl font-black text-slate-900">
              Compare Facilities
            </h2>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-slate-100 rounded-xl"
            >
              <X :size="20" />
            </button>
          </div>

          <div
            v-if="facilities.length === 0"
            class="p-8 text-center text-slate-400"
          >
            <p class="text-lg font-bold">No facilities to compare</p>
            <p class="text-sm mt-1">Add facilities from the explore page</p>
          </div>

          <div v-else class="overflow-x-auto p-4">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="text-left p-3 font-bold text-slate-500 w-32"></th>
                  <th
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center min-w-[180px]"
                  >
                    <img
                      :src="f.images[0]"
                      class="w-full h-28 object-cover rounded-2xl mb-2"
                    />
                    <p class="font-black text-slate-900">{{ f.name }}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-100">
                  <td class="p-3 font-bold text-slate-500">Type</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center capitalize"
                  >
                    {{ f.type }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100 bg-slate-50/50">
                  <td class="p-3 font-bold text-slate-500">Rating</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center font-black text-blue-600"
                  >
                    ★ {{ f.rating }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100">
                  <td class="p-3 font-bold text-slate-500">Reviews</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center"
                  >
                    {{ f.reviewCount }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100 bg-slate-50/50">
                  <td class="p-3 font-bold text-slate-500">Monthly</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center font-bold"
                  >
                    {{ formatPrice(f.monthlyPrice) }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100">
                  <td class="p-3 font-bold text-slate-500">Hours</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center"
                  >
                    {{ f.openingHours }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100 bg-slate-50/50">
                  <td class="p-3 font-bold text-slate-500">City</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center"
                  >
                    {{ f.city }}
                  </td>
                </tr>
                <tr class="border-t border-slate-100">
                  <td class="p-3 font-bold text-slate-500">Services</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center"
                  >
                    <div class="flex flex-wrap gap-1 justify-center">
                      <span
                        v-for="s in f.services"
                        :key="s"
                        class="px-2 py-0.5 bg-slate-100 rounded-lg text-xs"
                        >{{ s }}</span
                      >
                    </div>
                  </td>
                </tr>
                <tr class="border-t border-slate-100 bg-slate-50/50">
                  <td class="p-3 font-bold text-slate-500">Amenities</td>
                  <td
                    v-for="f in facilities"
                    :key="f.id"
                    class="p-3 text-center"
                  >
                    <div class="flex flex-wrap gap-1 justify-center">
                      <span
                        v-for="a in f.amenities"
                        :key="a"
                        class="px-2 py-0.5 bg-blue-50 rounded-lg text-xs text-blue-700"
                        >{{ a }}</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { X } from "lucide-vue-next";

defineProps({
  show: Boolean,
  facilities: { type: Array, default: () => [] },
});
defineEmits(["close"]);

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
