<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Soup, MapPin } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity">
        <div class="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <Soup class="h-4 w-4" />
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-bold text-sm sm:text-base tracking-tight text-foreground">
            Spot Mie Ayam
          </span>
          <span class="text-xs text-muted-foreground font-medium">
            Cinere
          </span>
        </div>
      </RouterLink>

      <div class="flex items-center gap-2">
        <Badge variant="outline" class="gap-1 font-normal text-xs py-1">
          <MapPin class="h-3 w-3 text-primary" />
          <span>Cinere, Depok</span>
        </Badge>
      </div>
    </div>
  </header>
</template>
