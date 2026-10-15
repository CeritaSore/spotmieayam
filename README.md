# 🚀 Template Vue 3 Enterprise & Offline-First

Template starter Vue 3 modern, fleksibel, dan **100% Offline-Ready** yang dilengkapi dengan ekosistem terlengkap untuk mempercepat pengembangan aplikasi web skala kecil hingga enterprise tanpa ketergantungan koneksi internet.

---

## 🛠️ Stack & Teknologi Utama

- **Framework Core**: [Vue 3.5+](./vueGuide.md) (Composition API, `<script setup>`, TypeScript 5.x)
- **Routing**: [Vue Router 4](./vueRouter.md) (Dynamic Routes, Navigation Guards)
- **State Management**: [Pinia + PersistedState](./vuePinia.md) (LocalStorage Auto-Sync)
- **REST API Client**: [Axios pre-configured](./axiosGuide.md) (Interceptors, Auth Tokens, Error Handling)
- **Environment Variables**: [Vite Env](./envGuide.md) (`.env`, `.env.example`, TypeScript autocomplete)
- **Styling & UI**: [Tailwind CSS v4 + Shadcn UI](./shadcnGuide2026.md) (Design tokens, reusable components)

---

## 📚 Pusat Dokumentasi Offline (Bahasa Indonesia)

Template ini menyediakan panduan eksplisit, *to the point*, dan komprehensif yang disimpan langsung di direktori root project. Ideal untuk pengembangan offline (tanpa koneksi internet):

1. ⚡ **[Vue 3 Composition API Guide (`vueGuide.md`)](./vueGuide.md)** - Reaktivitas, Ref vs Reactive, Computed, Watchers, Props & Emits.
2. 🗺️ **[Vue Router 4 Guide (`vueRouter.md`)](./vueRouter.md)** - Navigasi Halaman, Parameters, Nested Routes, Meta Guards.
3. 🍍 **[Pinia State Management Guide (`vuePinia.md`)](./vuePinia.md)** - Setup Store, Actions, Getters, dan `pinia-plugin-persistedstate`.
4. 🌐 **[Axios REST API Client Guide (`axiosGuide.md`)](./axiosGuide.md)** - Custom Instance, Request/Response Interceptors, File Upload/Download.
5. ⚙️ **[Vite Environment Variables Guide (`envGuide.md`)](./envGuide.md)** - Konfigurasi `.env`, prefix `VITE_`, type safety `env.d.ts`.
6. 🎨 **[Tailwind CSS v4 & Shadcn UI Guide (`shadcnGuide2026.md`)](./shadcnGuide2026.md)** - Utility classes, CSS variables, dan komponen Button, Card, Badge, Input.

---

## 📂 Struktur Direktori Proyek

```text
templatevuejs/
├── .env.example             # Template variabel lingkungan
├── .env                     # Variabel lingkungan aktif
├── components.json          # Konfigurasi Shadcn UI
├── env.d.ts                 # TypeScript type safety untuk import.meta.env
├── src/
│   ├── assets/
│   │   └── main.css         # Import Tailwind CSS v4 & Shadcn theme tokens
│   ├── components/
│   │   └── ui/              # Komponen reusable Shadcn UI (Button, Card, Badge, Input)
│   ├── lib/
│   │   └── utils.ts         # Helper cn() untuk penggabungan kelas Tailwind
│   ├── plugins/
│   │   └── axios.ts         # Custom Axios client dengan interceptors
│   ├── router/
│   │   └── index.ts         # Konfigurasi Vue Router 4
│   ├── stores/
│   │   └── counter.ts       # Example Pinia store dengan persistence
│   ├── views/
│   │   ├── HomeView.vue     # Warm Greeting Page & Demo Interaktif
│   │   └── DocsView.vue     # Offline Documentation Viewer
│   ├── App.vue              # Layout utama & Navigation Bar
│   └── main.ts              # Entry point aplikasi (Pinia + Router + Styles)
└── [Panduan-Panduan Markdown Offline (*.md)]
```

---

## ⚡ Panduan Cepat Memulai

### 1. Instalasi Dependency
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 4. Type Check & Build Production
```bash
# Type check TypeScript
npm run type-check

# Build bundle production
npm run build
```
