<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
    <Navbar />

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
      <RouterView />
    </main>

    <footer class="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Spot Mie Ayam &bull; Wilayah Cinere, Depok</p>
        <p class="text-[11px]">Dibuat dengan Vue 3 &amp; Tailwind CSS</p>
      </div>
    </footer>
  </div>
</template>
