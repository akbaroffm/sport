<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-end mb-2">
      <button
        @click="showAddForm = true"
        class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
      >
        <Plus :size="18" />
        <span class="hidden sm:inline">Qo'shish</span>
      </button>
    </div>

    <!-- Add Category Form -->
    <div
      v-if="showAddForm"
      class="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 mb-6"
    >
      <h3 class="text-sm font-bold text-slate-900 mb-4">Yangi kategoriya</h3>
      <form @submit.prevent="handleAdd" class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <input
            v-model="newCat.key"
            placeholder="Kalit (masalan: boxing)"
            required
            class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div class="flex-1">
          <input
            v-model="newCat.label"
            placeholder="Nomi (masalan: Boks)"
            required
            class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div class="flex-1">
          <select
            v-model="newCat.icon"
            class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option v-for="icon in iconOptions" :key="icon" :value="icon">
              {{ icon }}
            </option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Qo'shish
          </button>
          <button
            type="button"
            @click="showAddForm = false"
            class="px-4 py-2.5 border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Bekor
          </button>
        </div>
      </form>
    </div>

    <!-- Categories List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="cat in allCategories"
        :key="cat.key"
        class="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="isAdminCategory(cat.key) ? 'bg-purple-50' : 'bg-blue-50'"
          >
            <component
              :is="getIcon(cat.icon)"
              :size="20"
              :class="
                isAdminCategory(cat.key) ? 'text-purple-600' : 'text-blue-600'
              "
            />
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900">{{ cat.label }}</p>
            <p class="text-xs text-slate-400">
              {{ cat.key }} · {{ facilitiesCount(cat.key) }} obyekt
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="!isAdminCategory(cat.key)"
            class="text-xs text-slate-300 font-medium"
            >Tizim</span
          >
          <button
            v-if="isAdminCategory(cat.key)"
            @click="confirmDelete(cat)"
            class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      @click.self="deleteTarget = null"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-slate-900 mb-2">
          O'chirishni tasdiqlang
        </h3>
        <p class="text-sm text-slate-500 mb-6">
          <strong>{{ deleteTarget.label }}</strong> kategoriyasini
          o'chirmoqchimisiz?
        </p>
        <div class="flex gap-3">
          <button
            @click="deleteTarget = null"
            class="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Bekor
          </button>
          <button
            @click="handleDelete"
            class="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSearchStore } from "../../stores/searchStore";
import {
  Plus,
  Trash2,
  LayoutGrid,
  Dumbbell,
  Waves,
  Flower2,
  Goal,
  CircleDot,
  Feather,
  Bike,
  Mountain,
  Swords,
  Music,
  Tag,
} from "lucide-vue-next";

const searchStore = useSearchStore();

const showAddForm = ref(false);
const deleteTarget = ref(null);

const newCat = ref({ key: "", label: "", icon: "Tag" });

const iconOptions = [
  "Tag",
  "Dumbbell",
  "Waves",
  "Flower2",
  "Goal",
  "CircleDot",
  "Feather",
  "Bike",
  "Mountain",
  "Swords",
  "Music",
  "LayoutGrid",
];

const iconMap = {
  LayoutGrid,
  Dumbbell,
  Waves,
  Flower2,
  Goal,
  CircleDot,
  Feather,
  Bike,
  Mountain,
  Swords,
  Music,
  Tag,
};

function getIcon(name) {
  return iconMap[name] || Tag;
}

const adminCategoryKeys = computed(
  () => new Set(searchStore.adminCategories.map((c) => c.key)),
);

function isAdminCategory(key) {
  return adminCategoryKeys.value.has(key);
}

const allCategories = computed(() =>
  searchStore.categories.filter((c) => c.key !== "all"),
);

function facilitiesCount(key) {
  return searchStore.facilities.filter((f) => f.type === key).length;
}

function handleAdd() {
  if (!newCat.value.key.trim() || !newCat.value.label.trim()) return;
  searchStore.addCategory({ ...newCat.value });
  newCat.value = { key: "", label: "", icon: "Tag" };
  showAddForm.value = false;
}

function confirmDelete(cat) {
  deleteTarget.value = cat;
}

function handleDelete() {
  if (deleteTarget.value) {
    searchStore.removeCategory(deleteTarget.value.key);
    deleteTarget.value = null;
  }
}
</script>
