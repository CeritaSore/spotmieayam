<script setup lang="ts">
import { computed } from 'vue'
import { CINERE_AREAS } from '@/data/cinereData'

const props = defineProps<{
  modelValue: {
    name: string
    latitude: number
    longitude: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { name: string; latitude: number; longitude: number }): void
}>()

const selectedAreaId = computed({
  get: () => {
    const found = CINERE_AREAS.find(
      (a) =>
        Math.abs(a.latitude - props.modelValue.latitude) < 0.001 &&
        Math.abs(a.longitude - props.modelValue.longitude) < 0.001
    )
    return found ? found.id : 'custom'
  },
  set: (val: string) => {
    if (val === 'custom') return
    const area = CINERE_AREAS.find((a) => a.id === val)
    if (area) {
      emit('update:modelValue', {
        name: area.name,
        latitude: area.latitude,
        longitude: area.longitude,
      })
    }
  },
})
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Title & Explanation -->
      <div class="space-y-0.5">
        <label for="area-select" class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>📍</span>
          <span>Pilih Daerah:</span>
        </label>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Pilih daerah atau klik titik di peta untuk menemukan spot mie ayam terdekat.
        </p>
      </div>

      <!-- Compact Dropdown Selector -->
      <div class="w-full sm:w-72">
        <select
          id="area-select"
          v-model="selectedAreaId"
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer shadow-xs"
        >
          <option value="custom" v-if="selectedAreaId === 'custom'">
            📌 Titik Kustom Peta ({{ modelValue.latitude.toFixed(4) }}, {{ modelValue.longitude.toFixed(4) }})
          </option>
          <option v-for="area in CINERE_AREAS" :key="area.id" :value="area.id">
            {{ area.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
