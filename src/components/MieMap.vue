<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MieAyamSpot } from '@/types/mieAyam'
import { formatDistance } from '@/utils/distance'

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
      <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
        <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
        <span class="relative inline-flex items-center justify-center rounded-full h-7 w-7 bg-blue-600 text-white shadow-lg border-2 border-white text-xs font-bold">
          📍
        </span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Custom DivIcon for Mie Ayam spot
function createSpotIcon(isNearest: boolean, isSelected: boolean) {
  const bgClass = isSelected
    ? 'bg-red-600 ring-4 ring-red-300 scale-125 z-50'
    : isNearest
      ? 'bg-amber-500 ring-2 ring-amber-300'
      : 'bg-orange-500 hover:scale-110'

  return L.divIcon({
    className: 'custom-spot-marker',
    html: `
      <div class="transition-transform duration-200 flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="flex items-center justify-center rounded-full h-7 w-7 ${bgClass} text-white shadow-md border-2 border-white text-xs">
          🍜
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function initMap() {
  if (!mapContainer.value) return

  // Center on Cinere
  map = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView([props.referenceLocation.latitude, props.referenceLocation.longitude], 14)

  // OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  // Klik di peta untuk memindahkan titik acuan di Cinere
  map.on('click', (e: L.LeafletMouseEvent) => {
    emit('update:referenceCoordinate', {
      latitude: Number(e.latlng.lat.toFixed(5)),
      longitude: Number(e.latlng.lng.toFixed(5)),
    })
  })

  // User Marker
  userMarker = L.marker(
    [props.referenceLocation.latitude, props.referenceLocation.longitude],
    {
      icon: createUserIcon(),
      zIndexOffset: 1000,
    }
  ).addTo(map)

  userMarker.bindPopup(`
    <div class="text-xs font-sans p-1">
      <strong class="text-blue-600 block mb-0.5">Lokasi Pilihan</strong>
      <span>${props.referenceLocation.name}</span>
      <div class="text-slate-400 mt-1 text-[10px]">(${props.referenceLocation.latitude.toFixed(4)}, ${props.referenceLocation.longitude.toFixed(4)})</div>
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
      <div class="p-1 font-sans text-xs min-w-[160px]">
        <div class="flex items-center justify-between gap-1 mb-1">
          <span class="font-bold text-slate-900">${spot.name}</span>
        </div>
        ${distanceText ? `<div class="text-amber-600 font-semibold mb-1">📍 Jarak: ${distanceText}</div>` : ''}
        <div class="text-[10px] text-slate-500 mb-2 font-mono">
          Lat: ${spot.latitude.toFixed(4)}, Lng: ${spot.longitude.toFixed(4)}
        </div>
        <a 
          href="${gmapsUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-block text-center w-full px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-medium no-underline"
        >
          Buka di Google Maps ↗
        </a>
      </div>
    `)

    marker.on('click', () => {
      emit('selectSpot', spot.id)
    })

    spotMarkersLayer?.addLayer(marker)
  })
}

// Watch changes to reference location
watch(
  () => props.referenceLocation,
  (newLoc) => {
    if (userMarker) {
      userMarker.setLatLng([newLoc.latitude, newLoc.longitude])
      userMarker.setPopupContent(`
        <div class="text-xs font-sans p-1">
          <strong class="text-blue-600 block mb-0.5">Lokasi Pilihan</strong>
          <span>${newLoc.name}</span>
          <div class="text-slate-400 mt-1 text-[10px]">(${newLoc.latitude.toFixed(4)}, ${newLoc.longitude.toFixed(4)})</div>
        </div>
      `)
    }
  },
  { deep: true }
)

// Watch spots list or selected spot
watch(
  () => [props.spots, props.selectedSpotId],
  () => {
    renderSpotMarkers()
  },
  { deep: true }
)

// Focus to selected spot if passed
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
  <div class="relative w-full h-[380px] md:h-[540px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <!-- Floating Map Control Buttons -->
    <div class="absolute top-3 right-3 z-[400] flex flex-col gap-2">
      <button
        type="button"
        @click="fitAll"
        class="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 transition-all"
        title="Lihat semua spot dan lokasi pilihan"
      >
        <span>🎯</span>
        <span>Lihat Semua</span>
      </button>
    </div>

    <!-- Map Info Helper Badge -->
    <div class="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 shadow-sm flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
      <span>Klik peta untuk memilih titik lokasi</span>
    </div>
  </div>
</template>

<style>
/* Leaflet container fixes */
.leaflet-container {
  font-family: inherit;
}
.custom-user-marker,
.custom-spot-marker {
  background: transparent !important;
  border: none !important;
}
</style>
