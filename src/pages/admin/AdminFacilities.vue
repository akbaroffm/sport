<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <!-- Filter Tabs -->
    <div class="flex items-center justify-between gap-2 overflow-x-auto pb-2">
      <div class="flex items-center gap-2">
        <button
          @click="filterType = 'admin'"
          class="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          :class="
            filterType === 'admin'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          "
        >
          Admin qo'shgan ({{ searchStore.adminFacilities.length }})
        </button>
        <button
          @click="filterType = 'all'"
          class="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          :class="
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          "
        >
          Barchasi ({{ searchStore.facilities.length }})
        </button>
      </div>

      <div>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus :size="18" />
          <span class="hidden sm:inline">Qo'shish</span>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mb-2">
      <Search
        :size="16"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Obyekt qidirish..."
        class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
      />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left py-3 px-4 font-semibold text-slate-500">
                Nomi
              </th>
              <th
                class="text-left py-3 px-4 font-semibold text-slate-500 hidden sm:table-cell"
              >
                Turi
              </th>
              <th
                class="text-left py-3 px-4 font-semibold text-slate-500 hidden md:table-cell"
              >
                Tuman
              </th>
              <th
                class="text-left py-3 px-4 font-semibold text-slate-500 hidden lg:table-cell"
              >
                Narx
              </th>
              <th class="text-right py-3 px-4 font-semibold text-slate-500">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in paginatedFacilities"
              :key="f.id"
              class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div
                    class="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-blue-50 flex items-center justify-center"
                  >
                    <img
                      v-if="f.images?.[0]"
                      :src="f.images[0]"
                      class="w-full h-full object-cover"
                    />
                    <Building2 v-else :size="14" class="text-blue-600" />
                  </div>
                  <div class="min-w-0">
                    <p
                      class="font-semibold text-slate-900 truncate max-w-[180px]"
                    >
                      {{ f.name }}
                    </p>
                    <p class="text-xs text-slate-400 sm:hidden">{{ f.city }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 hidden sm:table-cell">
                <span
                  class="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-medium text-slate-600"
                  >{{ getCategoryLabel(f.type) }}</span
                >
              </td>
              <td class="py-3 px-4 text-slate-600 hidden md:table-cell">
                {{ f.city }}
              </td>
              <td class="py-3 px-4 text-slate-600 hidden lg:table-cell">
                {{ formatPrice(f.monthlyPrice) }}
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openEditModal(f)"
                    class="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Tahrirlash"
                  >
                    <Pencil :size="14" />
                  </button>
                  <button
                    @click="confirmDelete(f)"
                    class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="filteredList.length === 0"
        class="text-center py-12 text-slate-400 text-sm"
      >
        Obyekt topilmadi
      </div>
      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-4 py-3 border-t border-slate-100"
      >
        <span class="text-xs text-slate-400">
          {{ (currentPage - 1) * perPage + 1 }}–{{
            Math.min(currentPage * perPage, filteredList.length)
          }}
          / {{ filteredList.length }}
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft :size="16" />
          </button>
          <template v-for="p in paginationRange" :key="p">
            <button
              v-if="p !== '...'"
              @click="currentPage = p"
              class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
              :class="
                p === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              "
            >
              {{ p }}
            </button>
            <span v-else class="text-slate-300 text-sm px-1">...</span>
          </template>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-colors"
          >
            <ChevronRight :size="16" />
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
          <strong>{{ deleteTarget.name }}</strong> obyektini o'chirmoqchimisiz?
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

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 py-6 overflow-y-auto"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-2xl p-5 sm:p-6 max-w-2xl w-full my-4">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-slate-900">
            {{
              editingFacility ? "Obyektni tahrirlash" : "Yangi obyekt qo'shish"
            }}
          </h3>
          <button
            @click="showModal = false"
            class="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X :size="18" class="text-slate-400" />
          </button>
        </div>
        <form @submit.prevent="handleSave" class="space-y-5">
          <!-- Step 1: Asosiy -->
          <div class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >1</span
              >
              Asosiy ma'lumotlar
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Nomi *</label
                >
                <input
                  v-model="form.name"
                  required
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Turi *</label
                >
                <select
                  v-model="form.type"
                  required
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                >
                  <option value="" disabled>Tanlang</option>
                  <option
                    v-for="cat in availableCategories"
                    :key="cat.key"
                    :value="cat.key"
                  >
                    {{ cat.label }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Tavsif</label
                >
                <textarea
                  v-model="form.description"
                  rows="2"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 resize-none border border-transparent focus:border-blue-200"
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Joylashuv -->
          <div class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >2</span
              >
              Joylashuv
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Viloyat *</label
                >
                <select
                  v-model="form.region"
                  required
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                >
                  <option value="" disabled>Viloyatni tanlang</option>
                  <option v-for="r in regionNames" :key="r" :value="r">
                    {{ r }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Tuman *</label
                >
                <select
                  v-model="form.district"
                  required
                  :disabled="!form.region"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200 disabled:opacity-50"
                >
                  <option value="" disabled>Tumanni tanlang</option>
                  <option v-for="d in availableDistricts" :key="d" :value="d">
                    {{ d }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Manzil (ko'cha, uy)</label
                >
                <input
                  v-model="form.address"
                  placeholder="Amir Temur ko'chasi, 15-uy"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                />
              </div>
            </div>
            <!-- Map -->
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-2"
                >Xaritadan joylashuvni tanlang *</label
              >
              <div
                class="rounded-xl overflow-hidden border border-slate-200 h-56 sm:h-64 relative"
              >
                <div ref="mapContainer" class="w-full h-full"></div>
                <div
                  v-if="form.lat && form.lng"
                  class="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm z-[500]"
                >
                  {{ form.lat.toFixed(4) }}, {{ form.lng.toFixed(4) }}
                </div>
              </div>
              <p class="text-xs text-slate-400 mt-1.5">
                Xaritani bosib joylashuvni belgilang
              </p>
            </div>
          </div>

          <!-- Step 3: Narx va vaqt -->
          <div class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >3</span
              >
              Narx va ish vaqti
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Oylik narx (so'm)</label
                >
                <input
                  v-model.number="form.monthlyPrice"
                  type="number"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                />
                <p
                  v-if="form.monthlyPrice"
                  class="text-xs mt-1 font-medium"
                  :class="
                    computedPriceRange === '$'
                      ? 'text-green-500'
                      : computedPriceRange === '$$'
                        ? 'text-amber-500'
                        : 'text-red-500'
                  "
                >
                  Narx darajasi: {{ computedPriceRange }} —
                  {{ computedPriceLabel }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Telefon</label
                >
                <input
                  v-model="form.phone"
                  placeholder="+998 90 123 45 67"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Hafta kunlari *</label
                >
                <div class="flex flex-wrap gap-2 mb-2">
                  <label
                    v-for="(day, idx) in weekDays"
                    :key="day.key"
                    class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border cursor-pointer text-xs font-medium select-none"
                    :class="
                      form.openDays?.includes(day.key)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-500'
                    "
                  >
                    <input
                      type="checkbox"
                      class="sr-only"
                      :value="day.key"
                      v-model="form.openDays"
                    />
                    <span>{{ day.label }}</span>
                  </label>
                  <label
                    class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border cursor-pointer text-xs font-medium select-none"
                    :class="
                      form.noWeekends
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-500'
                    "
                  >
                    <input
                      type="checkbox"
                      class="sr-only"
                      v-model="form.noWeekends"
                    />
                    <span>Dam olish kunlarisiz</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Ish kunlari vaqti</label
                >
                <input
                  v-model="form.weekdayHours"
                  placeholder="06:00 - 23:00"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Dam olish kunlari vaqti</label
                >
                <input
                  v-model="form.weekendHours"
                  :disabled="form.noWeekends"
                  placeholder="08:00 - 22:00"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent focus:border-blue-200 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Xizmatlar -->
          <div v-if="form.type" class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >4</span
              >
              Xizmatlar
              <span class="text-xs text-slate-400 font-normal ml-1"
                >({{ form.services.length }} tanlangan)</span
              >
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="srv in currentServices"
                :key="srv"
                class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all select-none"
                :class="
                  form.services.includes(srv)
                    ? 'border-blue-300 bg-blue-50 shadow-sm shadow-blue-100'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                "
              >
                <div class="relative shrink-0">
                  <input
                    type="checkbox"
                    :value="srv"
                    v-model="form.services"
                    class="sr-only"
                  />
                  <div
                    class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all"
                    :class="
                      form.services.includes(srv)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300'
                    "
                  >
                    <Check
                      v-if="form.services.includes(srv)"
                      :size="12"
                      class="text-white"
                    />
                  </div>
                </div>
                <span
                  class="text-xs font-medium leading-tight"
                  :class="
                    form.services.includes(srv)
                      ? 'text-blue-700'
                      : 'text-slate-600'
                  "
                  >{{ srv }}</span
                >
              </label>
            </div>
          </div>

          <!-- Step 5: Qulayliklar -->
          <div v-if="form.type" class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >5</span
              >
              Qulayliklar
              <span class="text-xs text-slate-400 font-normal ml-1"
                >({{ form.amenities.length }} tanlangan)</span
              >
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="am in currentAmenities"
                :key="am"
                class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all select-none"
                :class="
                  form.amenities.includes(am)
                    ? 'border-green-300 bg-green-50 shadow-sm shadow-green-100'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                "
              >
                <div class="relative shrink-0">
                  <input
                    type="checkbox"
                    :value="am"
                    v-model="form.amenities"
                    class="sr-only"
                  />
                  <div
                    class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all"
                    :class="
                      form.amenities.includes(am)
                        ? 'bg-green-600 border-green-600'
                        : 'border-slate-300'
                    "
                  >
                    <Check
                      v-if="form.amenities.includes(am)"
                      :size="12"
                      class="text-white"
                    />
                  </div>
                </div>
                <span
                  class="text-xs font-medium leading-tight"
                  :class="
                    form.amenities.includes(am)
                      ? 'text-green-700'
                      : 'text-slate-600'
                  "
                  >{{ am }}</span
                >
              </label>
            </div>
          </div>

          <!-- Step 6: Rasmlar -->
          <div class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >6</span
              >
              Rasmlar
            </h4>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(img, idx) in form.images"
                :key="idx"
                class="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group"
              >
                <img :src="img" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeImage(idx)"
                  class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 :size="16" class="text-white" />
                </button>
              </div>
              <label
                class="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <ImagePlus :size="20" class="text-slate-400" />
                <span class="text-[10px] text-slate-400 mt-0.5">Yuklash</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="hidden"
                />
              </label>
            </div>
          </div>

          <!-- Step 7: Qo'shimcha -->
          <div class="space-y-4">
            <h4
              class="text-sm font-bold text-slate-700 flex items-center gap-2"
            >
              <span
                class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                >7</span
              >
              Qo'shimcha
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Sig'im (maksimal odam)</label
                >
                <input
                  v-model.number="form.maxCapacity"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Tashkil etilgan yil</label
                >
                <input
                  v-model.number="form.established"
                  type="number"
                  min="1900"
                  max="2100"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Telegram</label
                >
                <input
                  v-model="form.telegram"
                  placeholder="@username"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1"
                  >Instagram</label
                >
                <input
                  v-model="form.instagram"
                  placeholder="@username"
                  class="w-full px-3 py-2.5 bg-slate-50 rounded-xl text-sm outline-none border border-transparent focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div class="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                <label
                  class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all select-none"
                  :class="
                    form.isNew
                      ? 'border-blue-300 bg-blue-50 shadow-sm shadow-blue-100'
                      : 'border-slate-100 hover:border-slate-200'
                  "
                >
                  <div class="relative shrink-0">
                    <input
                      type="checkbox"
                      v-model="form.isNew"
                      class="sr-only"
                    />
                    <div
                      class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all"
                      :class="
                        form.isNew
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-slate-300'
                      "
                    >
                      <Check v-if="form.isNew" :size="12" class="text-white" />
                    </div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="form.isNew ? 'text-blue-700' : 'text-slate-600'"
                    >Yangi</span
                  >
                </label>
                <label
                  class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all select-none"
                  :class="
                    form.isVerified
                      ? 'border-green-300 bg-green-50 shadow-sm shadow-green-100'
                      : 'border-slate-100 hover:border-slate-200'
                  "
                >
                  <div class="relative shrink-0">
                    <input
                      type="checkbox"
                      v-model="form.isVerified"
                      class="sr-only"
                    />
                    <div
                      class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all"
                      :class="
                        form.isVerified
                          ? 'bg-green-600 border-green-600'
                          : 'border-slate-300'
                      "
                    >
                      <Check
                        v-if="form.isVerified"
                        :size="12"
                        class="text-white"
                      />
                    </div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="
                      form.isVerified ? 'text-green-700' : 'text-slate-600'
                    "
                    >Tasdiqlangan</span
                  >
                </label>
                <label
                  class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all select-none"
                  :class="
                    form.isFeatured
                      ? 'border-amber-300 bg-amber-50 shadow-sm shadow-amber-100'
                      : 'border-slate-100 hover:border-slate-200'
                  "
                >
                  <div class="relative shrink-0">
                    <input
                      type="checkbox"
                      v-model="form.isFeatured"
                      class="sr-only"
                    />
                    <div
                      class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all"
                      :class="
                        form.isFeatured
                          ? 'bg-amber-600 border-amber-600'
                          : 'border-slate-300'
                      "
                    >
                      <Check
                        v-if="form.isFeatured"
                        :size="12"
                        class="text-white"
                      />
                    </div>
                  </div>
                  <span
                    class="text-sm font-medium"
                    :class="
                      form.isFeatured ? 'text-amber-700' : 'text-slate-600'
                    "
                    >Featured</span
                  >
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Bekor
            </button>
            <button
              type="submit"
              class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              {{ editingFacility ? "Saqlash" : "Qo'shish" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";
import { useSearchStore } from "../../stores/searchStore";
import { regions, servicesByType, amenitiesByType } from "../../data/adminData";
import L from "leaflet";
import {
  Plus,
  Search,
  Building2,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ImagePlus,
} from "lucide-vue-next";

const searchStore = useSearchStore();
const weekDays = [
  { key: "mon", label: "Du" },
  { key: "tue", label: "Se" },
  { key: "wed", label: "Ch" },
  { key: "thu", label: "Pa" },
  { key: "fri", label: "Ju" },
  { key: "sat", label: "Sh" },
  { key: "sun", label: "Ya" },
];
const defaultForm = () => ({
  name: "",
  type: "",
  description: "",
  region: "",
  district: "",
  address: "",
  lat: null,
  lng: null,
  monthlyPrice: null,
  phone: "",
  weekdayHours: "",
  weekendHours: "",
  openDays: ["mon", "tue", "wed", "thu", "fri"],
  noWeekends: false,
  services: [],
  amenities: [],
  images: [],
  isNew: true,
  isVerified: false,
  isFeatured: false,
  maxCapacity: null,
  established: new Date().getFullYear(),
  telegram: "",
  instagram: "",
});
const form = ref(defaultForm());

// --- List & Filter ---
const filterType = ref("admin");
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 10;
const deleteTarget = ref(null);
const showModal = ref(false);
const editingFacility = ref(null);
const isPopulatingForm = ref(false);

const availableCategories = computed(() =>
  searchStore.categories.filter((c) => c.key !== "all"),
);
const adminFacilityIds = computed(
  () => new Set(searchStore.adminFacilities.map((f) => f.id)),
);

function isAdminFacility(id) {
  return adminFacilityIds.value.has(id);
}

const filteredList = computed(() => {
  let list =
    filterType.value === "admin"
      ? [...searchStore.adminFacilities]
      : [...searchStore.facilities];
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q),
    );
  }
  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredList.value.length / perPage)),
);
const paginatedFacilities = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredList.value.slice(start, start + perPage);
});

const paginationRange = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

watch([filterType, searchQuery], () => {
  currentPage.value = 1;
});

function getCategoryLabel(type) {
  const cat = searchStore.categories.find((c) => c.key === type);
  return cat ? cat.label : type;
}

function formatPrice(price) {
  if (!price) return "—";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

// --- Regions ---
const regionNames = Object.keys(regions);
const availableDistricts = computed(() =>
  form.value.region ? regions[form.value.region] || [] : [],
);

// --- Services & Amenities ---
const currentServices = computed(() =>
  form.value.type ? servicesByType[form.value.type] || [] : [],
);
const currentAmenities = computed(() =>
  form.value.type ? amenitiesByType[form.value.type] || [] : [],
);

watch(
  () => form.value.type,
  (newType, oldType) => {
    if (isPopulatingForm.value) return;
    if (oldType && newType !== oldType) {
      form.value.services = [];
      form.value.amenities = [];
    }
  },
);

// --- Price range auto ---
const computedPriceRange = computed(() => {
  const p = form.value.monthlyPrice;
  if (!p || p <= 0) return "$";
  if (p < 300000) return "$";
  if (p < 700000) return "$$";
  return "$$$";
});

const computedPriceLabel = computed(() => {
  const r = computedPriceRange.value;
  if (r === "$") return "Arzon";
  if (r === "$$") return "O'rtacha";
  return "Qimmat";
});

// --- Image upload ---
function handleImageUpload(e) {
  const files = e.target.files;
  if (!files) return;
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) continue; // skip >5MB
    const reader = new FileReader();
    reader.onload = (ev) => {
      form.value.images.push(ev.target.result);
    };
    reader.readAsDataURL(file);
  }
  e.target.value = "";
}

function removeImage(idx) {
  form.value.images.splice(idx, 1);
}

// --- Map ---
const mapContainer = ref(null);
let map = null;
let marker = null;

function initMap() {
  if (!mapContainer.value || map) return;
  const lat = form.value.lat || 41.2995;
  const lng = form.value.lng || 69.2401;
  const zoom = form.value.lat ? 14 : 6;

  map = L.map(mapContainer.value, { attributionControl: false }).setView(
    [lat, lng],
    zoom,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  if (form.value.lat && form.value.lng) {
    marker = L.marker([form.value.lat, form.value.lng]).addTo(map);
  }

  map.on("click", (e) => {
    form.value.lat = e.latlng.lat;
    form.value.lng = e.latlng.lng;
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng).addTo(map);
    }
    // Reverse geocode to fill address
    reverseGeocode(e.latlng.lat, e.latlng.lng);
  });
}

let addressSearchTimeout = null;
const isReverseGeocoding = ref(false);

function reverseGeocode(lat, lng) {
  isReverseGeocoding.value = true;
  fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=uz&addressdetails=1`,
  )
    .then((r) => r.json())
    .then((data) => {
      if (data?.address) {
        const parts = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.house_number) parts.push(data.address.house_number);
        if (!parts.length && data.address.neighbourhood)
          parts.push(data.address.neighbourhood);
        if (!parts.length && data.address.suburb)
          parts.push(data.address.suburb);
        if (parts.length) {
          form.value.address = parts.join(", ");
        }
      }
    })
    .catch(() => {})
    .finally(() => {
      isReverseGeocoding.value = false;
    });
}

function forwardGeocode(query) {
  if (!query || query.length < 3) return;
  const region = form.value.region || "";
  const district = form.value.district || "";
  const fullQuery = [query, district, region, "Uzbekistan"]
    .filter(Boolean)
    .join(", ");
  fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=1&countrycodes=uz`,
  )
    .then((r) => r.json())
    .then((results) => {
      if (results?.length > 0) {
        const { lat, lon } = results[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        form.value.lat = newLat;
        form.value.lng = newLng;
        if (map) {
          map.setView([newLat, newLng], 15);
          if (marker) {
            marker.setLatLng([newLat, newLng]);
          } else {
            marker = L.marker([newLat, newLng]).addTo(map);
          }
        }
      }
    })
    .catch(() => {});
}

watch(
  () => form.value.address,
  (newAddr) => {
    if (isReverseGeocoding.value) return;
    clearTimeout(addressSearchTimeout);
    addressSearchTimeout = setTimeout(() => {
      forwardGeocode(newAddr);
    }, 800);
  },
);

function destroyMap() {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }
}

watch(showModal, async (val) => {
  if (val) {
    await nextTick();
    setTimeout(() => initMap(), 150);
  } else {
    destroyMap();
  }
});

onBeforeUnmount(() => destroyMap());

// --- Form ---

function findRegionForCity(city) {
  for (const [region, districts] of Object.entries(regions)) {
    if (districts.includes(city)) return region;
  }
  return "";
}

function openAddModal() {
  editingFacility.value = null;
  form.value = defaultForm();
  showModal.value = true;
}

function openEditModal(facility) {
  editingFacility.value = facility;
  isPopulatingForm.value = true;
  const region = findRegionForCity(facility.city);
  form.value = {
    name: facility.name,
    type: facility.type,
    description: facility.description || "",
    region,
    district: facility.city || "",
    address: facility.address || "",
    lat: facility.lat,
    lng: facility.lng,
    monthlyPrice: facility.monthlyPrice,
    phone: facility.phone || "",
    weekdayHours: facility.weekdayHours || facility.openingHours || "",
    weekendHours: facility.weekendHours || "",
    openDays: Array.isArray(facility.openDays)
      ? [...facility.openDays]
      : ["mon", "tue", "wed", "thu", "fri"],
    noWeekends: !!facility.noWeekends,
    services: [...(facility.services || [])],
    amenities: [...(facility.amenities || [])],
    images: [...(facility.images || [])],
    isNew: facility.isNew || false,
    isVerified: facility.isVerified || false,
    isFeatured: facility.isFeatured || false,
    maxCapacity: facility.maxCapacity ?? null,
    established: facility.established ?? new Date().getFullYear(),
    telegram: facility.telegram || (facility.socialMedia?.telegram ?? ""),
    instagram: facility.instagram || (facility.socialMedia?.instagram ?? ""),
  };
  nextTick(() => {
    isPopulatingForm.value = false;
  });
  showModal.value = true;
}

function handleSave() {
  const sanitizedTelegram = (form.value.telegram || "")
    .replace(/^@/, "")
    .trim();
  const sanitizedInstagram = (form.value.instagram || "")
    .replace(/^@/, "")
    .trim();
  const openDays = Array.isArray(form.value.openDays)
    ? [...form.value.openDays]
    : ["mon", "tue", "wed", "thu", "fri"];

  const data = {
    name: form.value.name,
    type: form.value.type,
    description: form.value.description || form.value.name,
    address: form.value.address || form.value.district,
    city: form.value.district,
    lat: form.value.lat || 41.2995,
    lng: form.value.lng || 69.2401,
    monthlyPrice: form.value.monthlyPrice || 0,
    priceRange: computedPriceRange.value,
    rating: editingFacility.value?.rating || 0,
    reviewCount: editingFacility.value?.reviewCount || 0,
    phone: form.value.phone || "",
    openingHours: form.value.weekdayHours || "06:00 - 23:00",
    services: form.value.services,
    amenities: form.value.amenities,
    images: form.value.images.length
      ? form.value.images
      : ["https://placehold.co/600x400?text=Sport"],
    gallery: form.value.images.length
      ? form.value.images
      : ["https://placehold.co/600x400?text=Sport"],
    isNew: form.value.isNew,
    isVerified: form.value.isVerified,
    isFeatured: form.value.isFeatured,
    area: 0,
    trainerCount: 0,
    established: form.value.established || new Date().getFullYear(),
    tags: [form.value.type],
    maxCapacity: form.value.maxCapacity || 0,
    languages: ["uz", "ru"],
    socialMedia: { instagram: sanitizedInstagram, telegram: sanitizedTelegram },
    telegram: sanitizedTelegram,
    instagram: sanitizedInstagram,
    openDays,
    noWeekends: !!form.value.noWeekends,
    weekdayHours: form.value.weekdayHours || "06:00 - 23:00",
    weekendHours: form.value.noWeekends
      ? ""
      : form.value.weekendHours || "08:00 - 22:00",
    features: [],
  };

  if (editingFacility.value) {
    searchStore.updateFacility(editingFacility.value.id, data);
  } else {
    data.id = "admin_" + Date.now();
    searchStore.addFacility(data);
  }

  showModal.value = false;
}

function confirmDelete(facility) {
  deleteTarget.value = facility;
}

function handleDelete() {
  if (deleteTarget.value) {
    searchStore.removeFacility(deleteTarget.value.id);
    deleteTarget.value = null;
  }
}
watch(
  () => form.value.region,
  () => {
    if (
      form.value.district &&
      !availableDistricts.value.includes(form.value.district)
    ) {
      form.value.district = "";
    }
  },
);

watch(
  () => form.value.noWeekends,
  (val) => {
    if (!val) return;
    form.value.weekendHours = "";
    form.value.openDays = (form.value.openDays || []).filter(
      (d) => d !== "sat" && d !== "sun",
    );
  },
);
</script>

<style scoped>
/* leaflet CSS is imported globally in main.js */
</style>
