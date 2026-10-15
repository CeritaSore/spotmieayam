import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios'

// Membaca variabel lingkungan dari Vite Env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1'
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

/**
 * Instance Axios terkonfigurasi dengan default headers, interceptor token, dan error handling.
 */
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Inject Auth Token jika ada di LocalStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handling Error global & status HTTP
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (!window.navigator.onLine) {
      console.warn('[Axios] Koneksi internet terputus (Offline mode).')
    }

    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          console.error('[Axios 401] Sesi telah berakhir atau belum terautentikasi.')
          break
        case 403:
          console.error('[Axios 403] Akses ditolak.')
          break
        case 404:
          console.error('[Axios 404] Resource tidak ditemukan.')
          break
        case 500:
          console.error('[Axios 500] Server mengalami kendala internal.')
          break
      }
    }

    return Promise.reject(error)
  }
)

export default api
