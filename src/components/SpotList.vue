<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MieAyamSpot } from '@/types/mieAyam'
import { formatDistance } from '@/utils/distance'

const props = defineProps<{
  spots: MieAyamSpot[]
  selectedSpotId?: string | null
}>()

const emit = defineEmits<{
  (e: 'selectSpot', spotId: string): void
}>()

const searchQuery = ref('')

const filteredSpots = computed(() => {
  if (!searchQuery.value.trim()) return props.spots
  const q = searchQuery.value.toLowerCase()
  return props.spots.filter((s) => s.name.toLowerCase().includes(q))
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header & Search Input -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
      <div>
        <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🍜 Daftar Spot Mie Ayam</span>
          <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            {{ filteredSpots.length }} Warung
          </span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Diurutkan otomatis dari yang paling dekat dengan daerah pilihan Anda
        </p>
      </div>

      <!-- Quick Search Box -->
      <div class="relative w-full sm:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama mie ayam..."
          class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        <span class="absolute left-3 top-2.5 text-slate-400 text-sm">
          🔍
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredSpots.length === 0"
      class="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6"
    >
      <span class="text-4xl block mb-2">🥢</span>
      <h4 class="font-bold text-slate-800 dark:text-slate-200">Tidak ada mie ayam yang cocok</h4>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Coba ubah kata kunci pencarian Anda.
      </p>
    </div>

    <!-- Spot Cards List -->
    <div v-else class="space-y-3">
      <div
        v-for="(spot, index) in filteredSpots"
        :key="spot.id"
        class="group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-4 hover:shadow-md cursor-pointer"
        :class="
          selectedSpotId === spot.id
            ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
            : index === 0
              ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
              : 'border-slate-200 dark:border-slate-800'
        "
        @click="emit('selectSpot', spot.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <!-- Rank / Distance Icon -->
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
              :class="
                index === 0
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              "
            >
              #{{ index + 1 }}
            </div>

            <!-- Main Info (Nama, Koordinat, Jarak) -->
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {{ spot.name }}
                </h4>
                <span
                  v-if="index === 0"
                  class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px] border border-amber-500/20"
                >
                  ⭐ Paling Dekat
                </span>
              </div>

              <!-- Coordinates & Distance -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Lat: {{ spot.latitude.toFixed(4) }}</span>
                <span>Lng: {{ spot.longitude.toFixed(4) }}</span>
              </div>
            </div>
          </div>

          <!-- Distance Badge -->
          <div class="text-right shrink-0">
            <div
              v-if="spot.distanceKm !== undefined"
              class="inline-flex flex-col items-end"
            >
              <span class="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Jarak
              </span>
              <span class="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                {{ formatDistance(spot.distanceKm) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            @click.stop="emit('selectSpot', spot.id)"
            class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            🗺️ Fokus di Peta
          </button>
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
            class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors no-underline inline-flex items-center gap-1 shadow-xs"
          >
            <span>Buka Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
