<script setup lang="ts">
import { ref, computed } from 'vue'
import MieMap from '@/components/MieMap.vue'
import SpotList from '@/components/SpotList.vue'
import Badge from '@/components/ui/Badge.vue'
import { MIE_AYAM_SPOTS, CINERE_AREAS } from '@/data/cinereData'
import { calculateDistanceKm } from '@/utils/distance'
import type { MieAyamSpot } from '@/types/mieAyam'
import { ListOrdered, Map as MapIcon, Sparkles } from 'lucide-vue-next'

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

  // Sort ascending by distance by default
  return list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
})

// Handle map click to update reference location
function handleUpdateCoordinate(coord: { latitude: number; longitude: number }) {
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
  const spot = sortedSpots.value.find((s) => s.id === spotId)
  if (spot && mapRef.value) {
    mapRef.value.focusSpot(spot.latitude, spot.longitude)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Clean Minimalist Header -->
    <header class="space-y-2">
      <div class="flex items-center gap-2">
        <Badge variant="secondary" class="gap-1 font-medium text-xs">
          <Sparkles class="h-3 w-3 text-primary" />
          <span>Fokus Kecamatan Cinere, Depok</span>
        </Badge>
      </div>

      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
        Cari Spot Mie Ayam Terdekat
      </h1>
      <p class="text-sm text-muted-foreground max-w-2xl leading-relaxed">
        Temukan dan bandingkan spot mie ayam terbaik di kawasan Cinere berdasarkan jarak dan rating.
      </p>
    </header>

    <!-- Mobile View Tabs Switcher (shadcn style tabs) -->
    <div class="flex lg:hidden rounded-lg bg-muted p-1 border border-border">
      <button
        type="button"
        @click="mobileTab = 'list'"
        class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
        :class="
          mobileTab === 'list'
            ? 'bg-background text-foreground shadow-xs font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <ListOrdered class="h-3.5 w-3.5" />
        <span>Daftar ({{ sortedSpots.length }})</span>
      </button>
      <button
        type="button"
        @click="mobileTab = 'map'"
        class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
        :class="
          mobileTab === 'map'
            ? 'bg-background text-foreground shadow-xs font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <MapIcon class="h-3.5 w-3.5" />
        <span>Peta Interaktif</span>
      </button>
    </div>

    <!-- Main Content Area: Responsive Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Spots List (With filter:dropdown & cards) -->
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
        class="lg:col-span-5 lg:sticky lg:top-20 space-y-2"
        :class="{ 'hidden lg:block': mobileTab === 'list' }"
      >
        <div class="flex items-center justify-between px-0.5">
          <h3 class="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Peta Lokasi
          </h3>
          <span class="text-xs text-muted-foreground font-mono">
            {{ sortedSpots.length }} pin
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
