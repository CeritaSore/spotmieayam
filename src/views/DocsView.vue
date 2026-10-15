<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { cn } from '@/lib/utils'

const router = useRouter()

interface DocCategory {
  title: string
  file: string
  icon: string
  description: string
}

const docCategories: DocCategory[] = [
  {
    title: 'Vue 3 Composition API',
    file: 'vueGuide.md',
    icon: '⚡',
    description: 'Panduan reaktivitas Vue 3, Ref vs Reactive, Computed, Watchers, Lifecycle, dan Component Props.',
  },
  {
    title: 'Vue Router 4',
    file: 'vueRouter.md',
    icon: '🗺️',
    description: 'Panduan navigasi halaman, Dynamic Routes, Route Meta, Navigation Guards, dan Lazy Loading.',
  },
  {
    title: 'Pinia State Management',
    file: 'vuePinia.md',
    icon: '🍍',
    description: 'Panduan Pinia setup store, Actions, Getters, storeToRefs, dan Persistence LocalStorage.',
  },
  {
    title: 'Axios REST API Client',
    file: 'axiosGuide.md',
    icon: '🌐',
    description: 'Panduan HTTP client, Interceptors Token, Error Handling, File Upload/Download, dan Caching Offline.',
  },
  {
    title: 'Environment Variables (Vite Env)',
    file: 'envGuide.md',
    icon: '⚙️',
    description: 'Panduan penggunaan .env, prefix VITE_, type safety import.meta.env, dan keamanan secret key.',
  },
  {
    title: 'Tailwind CSS v4 + Shadcn UI',
    file: 'shadcnGuide2026.md',
    icon: '🎨',
    description: 'Panduan desain styling modern, CSS variables theme, komponen Button, Card, Badge, Input, dan Utility cn().',
  },
]

const selectedDoc = ref<DocCategory>(docCategories[0]!)
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-12">
    <div class="max-w-6xl mx-auto space-y-8">
      
      <!-- Top Navigation Header -->
      <div class="flex items-center justify-between border-b pb-6 border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>📚</span> Pusat Dokumentasi Offline Template
          </h1>
          <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Panduan lengkap Bahasa Indonesia siap pakai untuk pengembangan aplikasi tanpa akses internet.
          </p>
        </div>
        <Button variant="outline" @click="router.push('/')" class="gap-2">
          🏠 Kembali ke Beranda
        </Button>
      </div>

      <!-- Main Docs Index Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="doc in docCategories"
          :key="doc.file"
          :class="
            cn(
              'p-6 space-y-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]',
              selectedDoc.file === doc.file ? 'ring-2 ring-indigo-500 border-transparent shadow-lg bg-indigo-50/50 dark:bg-indigo-950/30' : ''
            )
          "
          @click="selectedDoc = doc"
        >
          <div class="flex items-center justify-between">
            <span class="text-3xl">{{ doc.icon }}</span>
            <Badge variant="outline" class="font-mono text-[10px]">{{ doc.file }}</Badge>
          </div>
          <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100">{{ doc.title }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ doc.description }}</p>
        </Card>
      </div>

      <!-- Preview Banner & File Location Info -->
      <Card class="p-6 bg-slate-900 text-slate-100 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
              Lokasi File fisik: ./{{ selectedDoc.file }}
            </div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span>{{ selectedDoc.icon }}</span> {{ selectedDoc.title }}
            </h2>
          </div>
          <Badge variant="success">Offline Ready</Badge>
        </div>

        <p class="text-slate-300 text-sm">
          Semua dokumen markdown disimpan langsung di dalam direktori root project ini. Anda dapat membukanya menggunakan Text Editor, VS Code, atau Markdown viewer favorit Anda tanpa memerlukan internet.
        </p>

        <div class="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2">
          <div class="text-xs text-slate-400 font-mono">Perintah Membuka File di Terminal:</div>
          <code class="block font-mono text-sm text-emerald-400 bg-slate-950 p-2.5 rounded">
            cat ./{{ selectedDoc.file }}
          </code>
        </div>
      </Card>

    </div>
  </div>
</template>
