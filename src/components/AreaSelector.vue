<script setup lang="ts">
import { ref, computed } from 'vue'
import { REGION_HIERARCHY } from '@/data/cinereData'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Search, MapPin, Navigation } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: {
    name: string
    latitude: number
    longitude: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { name: string; latitude: number; longitude: number }): void
  (e: 'search', value: { city: string; district: string; name: string; latitude: number; longitude: number }): void
}>()

const selectedCityId = ref('depok')
const selectedDistrictId = ref('cinere')

const availableDistricts = computed(() => {
  const city = REGION_HIERARCHY.find((c) => c.id === selectedCityId.value)
  return city ? city.districts : []
})

const isCustomLocation = computed(() => {
  const isPresetDistrict = availableDistricts.value.some(
    (d) =>
      !d.disabled &&
      Math.abs(d.latitude - props.modelValue.latitude) < 0.001 &&
      Math.abs(d.longitude - props.modelValue.longitude) < 0.001
  )
  return !isPresetDistrict
})

function onCityChange() {
  const firstActive = availableDistricts.value.find((d) => !d.disabled)
  if (firstActive) {
    selectedDistrictId.value = firstActive.id
  }
}

function handleSearch() {
  const city = REGION_HIERARCHY.find((c) => c.id === selectedCityId.value)
  const district = availableDistricts.value.find((d) => d.id === selectedDistrictId.value)

  if (district && !district.disabled) {
    const newLoc = {
      name: `${district.name}, ${city?.name || 'Depok'}`,
      latitude: district.latitude,
      longitude: district.longitude,
    }
    emit('update:modelValue', newLoc)
    emit('search', {
      city: city?.name || 'Depok',
      district: district.name,
      ...newLoc,
    })
  }
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3 sm:pb-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="space-y-1">
          <CardTitle class="text-base flex items-center gap-2">
            <Navigation class="h-4 w-4 text-primary" />
            <span>Pilih Lokasi Pencarian</span>
          </CardTitle>
          <CardDescription>
            Tentukan kota dan kecamatan, lalu klik cari untuk melihat spot mie ayam terdekat.
          </CardDescription>
        </div>

        <Badge
          v-if="isCustomLocation"
          variant="outline"
          class="gap-1.5 text-xs text-primary border-primary/30 py-1"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
          <span>Peta: {{ modelValue.latitude.toFixed(4) }}, {{ modelValue.longitude.toFixed(4) }}</span>
        </Badge>
      </div>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <!-- 1. Kota -->
        <div class="sm:col-span-5 space-y-1.5">
          <label for="city-select" class="text-xs font-medium text-muted-foreground block">
            1. Kota / Wilayah
          </label>
          <div class="relative">
            <select
              id="city-select"
              v-model="selectedCityId"
              @change="onCityChange"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground cursor-pointer font-medium"
            >
              <option
                v-for="city in REGION_HIERARCHY"
                :key="city.id"
                :value="city.id"
                :disabled="city.disabled"
                class="bg-background text-foreground"
              >
                {{ city.name }} {{ city.badge ? `(${city.badge})` : '' }}
              </option>
            </select>
          </div>
        </div>

        <!-- 2. Kecamatan -->
        <div class="sm:col-span-5 space-y-1.5">
          <label for="district-select" class="text-xs font-medium text-muted-foreground block">
            2. Kecamatan / Daerah
          </label>
          <div class="relative">
            <select
              id="district-select"
              v-model="selectedDistrictId"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground cursor-pointer font-medium"
            >
              <option
                v-for="district in availableDistricts"
                :key="district.id"
                :value="district.id"
                :disabled="district.disabled"
                class="bg-background text-foreground"
              >
                {{ district.name }} {{ district.badge ? `(${district.badge})` : '' }}
              </option>
            </select>
          </div>
        </div>

        <!-- 3. Tombol Cari -->
        <div class="sm:col-span-2">
          <Button type="submit" class="w-full">
            <Search class="h-4 w-4" />
            <span>Cari</span>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
