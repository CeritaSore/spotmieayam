<script setup lang="ts">
import { ref, computed } from 'vue'
import AreaSelector from '@/components/AreaSelector.vue'
import MieMap from '@/components/MieMap.vue'
import SpotList from '@/components/SpotList.vue'
import { MIE_AYAM_SPOTS, CINERE_AREAS } from '@/data/cinereData'
import { calculateDistanceKm } from '@/utils/distance'
import type { MieAyamSpot } from '@/types/mieAyam'

// Default location (Cinere)
const defaultArea = CINERE_AREAS[0] ?? {
  id: 'cinere',
  name: 'Cinere',
  latitude: -6.3214,
  longitude: 106.782,
}

const referenceLocation = ref({
  name: defaultArea.name,
  latitude: defaultArea.latitude,
  longitude: defaultArea.longitude,
})

const selectedSpotId = ref<string | null>(null)
const mobileTab = ref<'list' | 'map'>('list')
const mapRef = ref<InstanceType<typeof MieMap> | null>(null)

// Calculate distance from reference location and sort nearest first
const sortedSpots = computed<MieAyamSpot[]>(() => {
  const list = MIE_AYAM_SPOTS.map((spot) => {
    const dist = calculateDistanceKm(
      referenceLocation.value.latitude,
      referenceLocation.value.longitude,
      spot.latitude,
      spot.longitude
    )
    return {
      ...spot,
      distanceKm: dist,
    }
  })

  // Sort ascending by distance
  return list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
})

// Handle map click to update reference location
function handleUpdateCoordinate(coord: { latitude: number; longitude: number }) {
  // Check if it matches any preset
  const matched = CINERE_AREAS.find(
    (a) =>
      Math.abs(a.latitude - coord.latitude) < 0.001 &&
      Math.abs(a.longitude - coord.longitude) < 0.001
  )

  referenceLocation.value = {
    name: matched ? matched.name : `Titik Pilihan Peta (${coord.latitude.toFixed(4)}, ${coord.longitude.toFixed(4)})`,
    latitude: coord.latitude,
    longitude: coord.longitude,
  }
}

function handleSelectSpot(spotId: string) {
  selectedSpotId.value = spotId
  // In mobile, switch to map if clicked from list
  const spot = sortedSpots.value.find((s) => s.id === spotId)
  if (spot && mapRef.value) {
    mapRef.value.focusSpot(spot.latitude, spot.longitude)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Hero Banner -->
    <header class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 md:p-8 text-white shadow-lg">
      <div class="relative z-10 max-w-3xl space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
          <span>🍜 Khusus Wilayah Cinere & Sekitarnya</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Cari Spot Mie Ayam Terdekat
        </h1>
        <p class="text-amber-100 text-sm sm:text-base leading-relaxed">
          Pilih area Anda di wilayah Cinere untuk mengetahui warung mie ayam yang paling dekat dari lokasi Anda secara instan dan akurat.
        </p>
      </div>

      <!-- Decorative subtle glow -->
      <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    </header>

    <!-- Area Selector (Input Daerah Cinere) -->
    <AreaSelector v-model="referenceLocation" />

    <!-- Mobile View Tabs Switcher (Visible only on small screens) -->
    <div class="flex lg:hidden rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        @click="mobileTab = 'list'"
        class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
        :class="
          mobileTab === 'list'
            ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400'
        "
      >
        <span>📋</span>
        <span>Daftar Terdekat ({{ sortedSpots.length }})</span>
      </button>
      <button
        type="button"
        @click="mobileTab = 'map'"
        class="flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
        :class="
          mobileTab === 'map'
            ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400'
        "
      >
        <span>🗺️</span>
        <span>Peta Interaktif</span>
      </button>
    </div>

    <!-- Main Content Area: Responsive Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Spots List (Sorted Nearest) -->
      <div
        class="lg:col-span-7 space-y-4"
        :class="{ 'hidden lg:block': mobileTab === 'map' }"
      >
        <SpotList
          :spots="sortedSpots"
          :selected-spot-id="selectedSpotId"
          @select-spot="handleSelectSpot"
        />
      </div>

      <!-- Right Column: Interactive Map (Sticky on Desktop) -->
      <div
        class="lg:col-span-5 lg:sticky lg:top-6 space-y-3"
        :class="{ 'hidden lg:block': mobileTab === 'list' }"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🗺️ Peta Spot Cinere</span>
          </h3>
          <span class="text-xs text-slate-500 font-mono">
            {{ sortedSpots.length }} pin ditampilkan
          </span>
        </div>

        <MieMap
          ref="mapRef"
          :reference-location="referenceLocation"
          :spots="sortedSpots"
          :selected-spot-id="selectedSpotId"
          @update:reference-coordinate="handleUpdateCoordinate"
          @select-spot="handleSelectSpot"
        />
      </div>
    </div>
  </div>
</template>
