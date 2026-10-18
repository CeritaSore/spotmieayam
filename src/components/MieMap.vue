<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MieAyamSpot } from '@/types/mieAyam'
import { formatDistance } from '@/utils/distance'
import Button from '@/components/ui/Button.vue'
import { Maximize2, MousePointerClick } from 'lucide-vue-next'

const props = defineProps<{
  referenceLocation: {
    name: string
    latitude: number
    longitude: number
  }
  spots: MieAyamSpot[]
  selectedSpotId?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:referenceCoordinate', coord: { latitude: number; longitude: number }): void
  (e: 'selectSpot', spotId: string): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let userMarker: L.Marker | null = null
let spotMarkersLayer: L.LayerGroup | null = null

// Custom modern DivIcon for user's reference point
function createUserIcon() {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 -translate-x-1/2 -translate-y-1/2">
        <span class="absolute inline-flex h-full w-full rounded-full bg-blue-500/40 animate-ping"></span>
        <span class="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-blue-600 text-white shadow-md border-2 border-white text-[11px] font-bold">
          📍
        </span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// Custom DivIcon for Mie Ayam spot
function createSpotIcon(isNearest: boolean, isSelected: boolean) {
  const bgClass = isSelected
    ? 'bg-primary ring-4 ring-primary/30 scale-125 z-50'
    : isNearest
      ? 'bg-primary ring-2 ring-primary/40'
      : 'bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 hover:scale-110'

  return L.divIcon({
    className: 'custom-spot-marker',
    html: `
      <div class="transition-transform duration-200 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="flex items-center justify-center rounded-full h-6 w-6 ${bgClass} text-white shadow-xs border-2 border-white dark:border-zinc-900 text-[10px]">
          🍜
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function initMap() {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([props.referenceLocation.latitude, props.referenceLocation.longitude], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    emit('update:referenceCoordinate', {
      latitude: Number(e.latlng.lat.toFixed(5)),
      longitude: Number(e.latlng.lng.toFixed(5)),
    })
  })

  userMarker = L.marker(
    [props.referenceLocation.latitude, props.referenceLocation.longitude],
    {
      icon: createUserIcon(),
      zIndexOffset: 1000,
    }
  ).addTo(map)

  userMarker.bindPopup(`
    <div class="text-xs p-1">
      <div class="font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Lokasi Acuan</div>
      <div class="font-medium text-foreground">${props.referenceLocation.name}</div>
      <div class="text-muted-foreground font-mono mt-1 text-[10px]">(${props.referenceLocation.latitude.toFixed(4)}, ${props.referenceLocation.longitude.toFixed(4)})</div>
    </div>
  `)

  spotMarkersLayer = L.layerGroup().addTo(map)
  renderSpotMarkers()
}

function renderSpotMarkers() {
  if (!map || !spotMarkersLayer) return
  spotMarkersLayer.clearLayers()

  props.spots.forEach((spot, index) => {
    const isNearest = index === 0
    const isSelected = props.selectedSpotId === spot.id

    const marker = L.marker([spot.latitude, spot.longitude], {
      icon: createSpotIcon(isNearest, isSelected),
      zIndexOffset: isSelected ? 500 : 100,
    })

    const distanceText = spot.distanceKm !== undefined ? formatDistance(spot.distanceKm) : ''
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`

    marker.bindPopup(`
      <div class="p-1.5 font-sans text-xs min-w-[170px]">
        <div class="font-semibold text-foreground mb-1 leading-snug">${spot.name}</div>
        ${distanceText ? `<div class="text-primary font-medium text-[11px] mb-1.5 flex items-center gap-1"><span>📍 Jarak:</span> <span class="font-bold">${distanceText}</span></div>` : ''}
        <div class="text-[10px] text-muted-foreground mb-2 font-mono">
          ${spot.latitude.toFixed(4)}, ${spot.longitude.toFixed(4)}
        </div>
        <a 
          href="${gmapsUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-flex items-center justify-center w-full px-2.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-[11px] font-medium no-underline shadow-xs transition-colors"
        >
          Buka Google Maps ↗
        </a>
      </div>
    `)

    marker.on('click', () => {
      emit('selectSpot', spot.id)
    })

    spotMarkersLayer?.addLayer(marker)
  })
}

watch(
  () => props.referenceLocation,
  (newLoc) => {
    if (userMarker) {
      userMarker.setLatLng([newLoc.latitude, newLoc.longitude])
      userMarker.setPopupContent(`
        <div class="text-xs p-1">
          <div class="font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Lokasi Acuan</div>
          <div class="font-medium text-foreground">${newLoc.name}</div>
          <div class="text-muted-foreground font-mono mt-1 text-[10px]">(${newLoc.latitude.toFixed(4)}, ${newLoc.longitude.toFixed(4)})</div>
        </div>
      `)
    }
  },
  { deep: true }
)

watch(
  () => [props.spots, props.selectedSpotId],
  () => {
    renderSpotMarkers()
  },
  { deep: true }
)

watch(
  () => props.selectedSpotId,
  (id) => {
    if (!id || !map) return
    const spot = props.spots.find((s) => s.id === id)
    if (spot) {
      map.flyTo([spot.latitude, spot.longitude], 16, { duration: 0.8 })
    }
  }
)

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

function fitAll() {
  if (!map || props.spots.length === 0) return
  const bounds = L.latLngBounds([
    [props.referenceLocation.latitude, props.referenceLocation.longitude],
    ...props.spots.map((s) => [s.latitude, s.longitude] as [number, number]),
  ])
  map.fitBounds(bounds, { padding: [40, 40] })
}

defineExpose({
  fitAll,
  focusSpot: (lat: number, lng: number) => {
    map?.flyTo([lat, lng], 16, { duration: 0.8 })
  },
})
</script>

<template>
  <div class="relative w-full h-[360px] md:h-[500px] rounded-xl overflow-hidden border border-border bg-card shadow-xs">
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <!-- Floating Map Control Buttons -->
    <div class="absolute top-3 right-3 z-[400]">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        class="h-8 shadow-sm text-xs gap-1.5 bg-background/90 backdrop-blur border border-border"
        @click="fitAll"
        title="Lihat semua spot"
      >
        <Maximize2 class="h-3.5 w-3.5" />
        <span>Lihat Semua</span>
      </Button>
    </div>

    <!-- Map Info Helper Badge -->
    <div class="absolute bottom-3 left-3 z-[400] bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-border text-[11px] text-muted-foreground shadow-xs flex items-center gap-1.5">
      <MousePointerClick class="h-3 w-3 text-primary" />
      <span>Klik peta untuk pindahkan titik acuan</span>
    </div>
  </div>
</template>

<style>
.leaflet-container {
  font-family: inherit;
}
.custom-user-marker,
.custom-spot-marker {
  background: transparent !important;
  border: none !important;
}
.leaflet-popup-content-wrapper {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
}
.leaflet-popup-tip {
  background: hsl(var(--card));
}
</style>
