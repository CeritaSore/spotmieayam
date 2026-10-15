<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2.5 no-underline group">
        <span class="text-2xl group-hover:scale-110 transition-transform">🍜</span>
        <div>
          <span class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
            Spot Mie Ayam
          </span>
          <span class="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest block leading-none">
            Edisi Cinere
          </span>
        </div>
      </RouterLink>

      <div class="flex items-center gap-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span class="hidden sm:inline">Kecamatan</span> Cinere, Depok
        </div>
      </div>
    </div>
  </header>
</template>
