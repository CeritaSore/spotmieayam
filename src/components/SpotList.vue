<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MieAyamSpot } from '@/types/mieAyam'
import { formatDistance } from '@/utils/distance'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import { Search, MapPin, Compass, ExternalLink, UtensilsCrossed, Sparkles, Star, Tag } from 'lucide-vue-next'

const props = defineProps<{
  spots: MieAyamSpot[]
  selectedSpotId?: string | null
}>()

const emit = defineEmits<{
  (e: 'selectSpot', spotId: string): void
}>()

type FilterType = 'semua' | 'rating' | 'jarak'
type PriceFilterType = 'semua' | 'termurah' | 'under15k' | '15k-25k' | 'over25k'

const filterBy = ref<FilterType>('semua')
const priceFilter = ref<PriceFilterType>('semua')
const searchQuery = ref('')

const processedSpots = computed(() => {
  let list = [...props.spots]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter((s) => s.name.toLowerCase().includes(q))
  }

  // Filter by price range
  if (priceFilter.value === 'under15k') {
    list = list.filter((s) => (s.price ?? 0) < 15000)
  } else if (priceFilter.value === '15k-25k') {
    list = list.filter((s) => (s.price ?? 0) >= 15000 && (s.price ?? 0) <= 25000)
  } else if (priceFilter.value === 'over25k') {
    list = list.filter((s) => (s.price ?? 0) > 25000)
  }

  // Sort by filter or price
  if (filterBy.value === 'rating') {
    list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  } else if (filterBy.value === 'jarak') {
    list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  } else if (priceFilter.value === 'termurah') {
    list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  }

  return list
})
</script>

<template>
  <div class="space-y-3">
    <!-- Header with Search, filter:dropdown & harga:dropdown -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h3 class="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
          <span>Daftar Warung</span>
          <Badge variant="secondary" class="font-normal text-xs">
            {{ processedSpots.length }} ditemukan
          </Badge>
        </h3>
      </div>

      <!-- Controls: filter:dropdown, harga:dropdown and search input -->
      <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <!-- filter:dropdown -->
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <label for="filter-select" class="font-medium whitespace-nowrap">filter:</label>
          <select
            id="filter-select"
            v-model="filterBy"
            class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer shadow-2xs font-medium"
          >
            <option value="semua">semua</option>
            <option value="rating">rating</option>
            <option value="jarak">jarak</option>
          </select>
        </div>

        <!-- harga:dropdown -->
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <label for="price-select" class="font-medium whitespace-nowrap">harga:</label>
          <select
            id="price-select"
            v-model="priceFilter"
            class="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer shadow-2xs font-medium"
          >
            <option value="semua">semua</option>
            <option value="termurah">termurah</option>
            <option value="under15k">&lt; 15rb</option>
            <option value="15k-25k">15rb - 25rb</option>
            <option value="over25k">&gt; 25rb</option>
          </select>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-40">
          <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Cari warung..."
            class="pl-8 h-8 text-xs"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <Card
      v-if="processedSpots.length === 0"
      class="text-center py-10 px-4 border-dashed"
    >
      <UtensilsCrossed class="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
      <h4 class="text-sm font-medium text-foreground">Tidak ada hasil ditemukan</h4>
      <p class="text-xs text-muted-foreground mt-1">
        Coba gunakan filter harga atau kata kunci pencarian yang lain.
      </p>
    </Card>

    <!-- Cards List -->
    <div v-else class="space-y-2.5">
      <Card
        v-for="(spot, index) in processedSpots"
        :key="spot.id"
        class="p-4 cursor-pointer transition-all duration-150 hover:border-primary/40"
        :class="
          selectedSpotId === spot.id
            ? 'border-primary ring-1 ring-primary/40 bg-accent/30'
            : index === 0 && filterBy === 'jarak'
              ? 'border-primary/30 bg-primary/[0.02]'
              : ''
        "
        @click="emit('selectSpot', spot.id)"
      >
        <div class="flex items-start justify-between gap-3">
          <!-- Rank & Details -->
          <div class="space-y-1.5 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <Badge
                :variant="index === 0 && filterBy === 'jarak' ? 'default' : 'secondary'"
                class="text-[11px] font-mono px-1.5 py-0"
              >
                #{{ index + 1 }}
              </Badge>

              <h4 class="font-semibold text-sm text-foreground truncate">
                {{ spot.name }}
              </h4>

              <Badge
                v-if="index === 0 && filterBy === 'jarak'"
                variant="success"
                class="text-[10px] gap-1 py-0"
              >
                <Sparkles class="h-2.5 w-2.5" />
                <span>Terdekat</span>
              </Badge>
            </div>

            <!-- Rating, Price & Coordinates -->
            <div class="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <!-- Rating -->
              <div v-if="spot.rating" class="flex items-center gap-1 text-amber-500 font-semibold">
                <Star class="h-3 w-3 fill-amber-400 text-amber-400" />
                <span class="text-foreground">{{ spot.rating.toFixed(1) }}</span>
              </div>

              <!-- Price Range -->
              <div v-if="spot.priceRange" class="flex items-center gap-1 text-muted-foreground font-medium text-[11px]">
                <Tag class="h-3 w-3 text-muted-foreground" />
                <span>{{ spot.priceRange }}</span>
              </div>

              <!-- Coordinates -->
              <p class="font-mono flex items-center gap-1 text-[11px]">
                <MapPin class="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{{ spot.latitude.toFixed(4) }}, {{ spot.longitude.toFixed(4) }}</span>
              </p>
            </div>
          </div>

          <!-- Distance Badge -->
          <div v-if="spot.distanceKm !== undefined" class="shrink-0 text-right">
            <Badge variant="outline" class="font-mono text-xs px-2 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
              {{ formatDistance(spot.distanceKm) }}
            </Badge>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-3 pt-3 border-t border-border/50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="h-8 text-xs text-muted-foreground hover:text-foreground"
            @click.stop="emit('selectSpot', spot.id)"
          >
            <Compass class="h-3.5 w-3.5" />
            <span>Fokus Peta</span>
          </Button>

          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
            class="no-underline"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              class="h-8 text-xs gap-1.5"
            >
              <span>Rute</span>
              <ExternalLink class="h-3 w-3" />
            </Button>
          </a>
        </div>
      </Card>
    </div>
  </div>
</template>
