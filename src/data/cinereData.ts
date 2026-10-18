import type { MieAyamSpot, CinereArea } from '@/types/mieAyam'

export interface DistrictOption {
  id: string
  name: string
  latitude: number
  longitude: number
  disabled?: boolean
  badge?: string
}

export interface CityOption {
  id: string
  name: string
  disabled?: boolean
  badge?: string
  districts: DistrictOption[]
}

export const REGION_HIERARCHY: CityOption[] = [
  {
    id: 'depok',
    name: 'Depok',
    districts: [
      {
        id: 'cinere',
        name: 'Cinere',
        latitude: -6.3214,
        longitude: 106.782,
        disabled: false,
      },
      {
        id: 'beji',
        name: 'Beji',
        latitude: -6.3725,
        longitude: 106.8225,
        disabled: true,
        badge: 'Segera Hadir',
      },
      {
        id: 'pancoran-mas',
        name: 'Pancoran Mas',
        latitude: -6.3975,
        longitude: 106.8045,
        disabled: true,
        badge: 'Segera Hadir',
      },
      {
        id: 'sawangan',
        name: 'Sawangan',
        latitude: -6.402,
        longitude: 106.758,
        disabled: true,
        badge: 'Segera Hadir',
      },
      {
        id: 'sukmajaya',
        name: 'Sukmajaya',
        latitude: -6.4012,
        longitude: 106.842,
        disabled: true,
        badge: 'Segera Hadir',
      },
    ],
  },
  {
    id: 'jakarta-selatan',
    name: 'Jakarta Selatan',
    disabled: true,
    badge: 'Segera Hadir',
    districts: [],
  },
]

export const MIE_AYAM_SPOTS: MieAyamSpot[] = [
  {
    id: 'berkat-cinere',
    name: 'Mie Ayam Berkat Cinere',
    latitude: -6.3251,
    longitude: 106.7834,
    rating: 4.8,
    price: 18000,
    priceRange: 'Rp 18.000 - Rp 25.000',
  },
  {
    id: 'titoti-gandul',
    name: 'Mie Ayam & Bakso Titoti Wonogiri (Gandul)',
    latitude: -6.3378,
    longitude: 106.7975,
    rating: 4.7,
    price: 20000,
    priceRange: 'Rp 20.000 - Rp 30.000',
  },
  {
    id: 'mas-no-cinere',
    name: 'Mie Ayam Jamur Mas No Cinere',
    latitude: -6.3272,
    longitude: 106.7815,
    rating: 4.6,
    price: 15000,
    priceRange: 'Rp 15.000 - Rp 22.000',
  },
  {
    id: 'bangka-asan',
    name: 'Mie Bangka Asan Cinere',
    latitude: -6.3218,
    longitude: 106.7827,
    rating: 4.7,
    price: 22000,
    priceRange: 'Rp 22.000 - Rp 35.000',
  },
  {
    id: 'mas-joko-pangkalan-jati',
    name: 'Mie Ayam Wonogiri Mas Joko Pangkalan Jati',
    latitude: -6.3152,
    longitude: 106.7988,
    rating: 4.5,
    price: 14000,
    priceRange: 'Rp 14.000 - Rp 20.000',
  },
  {
    id: 'mas-tri-bukit-cinere',
    name: 'Mie Ayam Mas Tri Bukit Cinere',
    latitude: -6.3312,
    longitude: 106.7794,
    rating: 4.5,
    price: 13000,
    priceRange: 'Rp 13.000 - Rp 18.000',
  },
  {
    id: 'bakmi-gm-cinere',
    name: 'Bakmi GM Mall Cinere',
    latitude: -6.3214,
    longitude: 106.782,
    rating: 4.6,
    price: 32000,
    priceRange: 'Rp 32.000 - Rp 50.000',
  },
  {
    id: 'pak-dhe-gandul',
    name: 'Mie Ayam Bakso Pak Dhe Gandul',
    latitude: -6.341,
    longitude: 106.7962,
    rating: 4.4,
    price: 14000,
    priceRange: 'Rp 14.000 - Rp 20.000',
  },
  {
    id: 'putra-solo-pangkalan-jati',
    name: 'Mie Ayam Pangsit Putra Solo Pangkalan Jati Baru',
    latitude: -6.3125,
    longitude: 106.801,
    rating: 4.5,
    price: 15000,
    priceRange: 'Rp 15.000 - Rp 22.000',
  },
  {
    id: 'ceker-barokah-cinere',
    name: 'Mie Ayam Ceker Barokah Cinere',
    latitude: -6.3289,
    longitude: 106.785,
    rating: 4.4,
    price: 13000,
    priceRange: 'Rp 13.000 - Rp 18.000',
  },
  {
    id: 'mas-kumis-cinere',
    name: 'Mie Ayam & Bakso Mas Kumis Cinere Raya',
    latitude: -6.3298,
    longitude: 106.7801,
    rating: 4.6,
    price: 16000,
    priceRange: 'Rp 16.000 - Rp 25.000',
  },
  {
    id: 'bang-bedo-cinere',
    name: 'Mie Ayam Bang Bedo Cinere',
    latitude: -6.334,
    longitude: 106.775,
    rating: 4.5,
    price: 15000,
    priceRange: 'Rp 15.000 - Rp 22.000',
  },
]

export const CINERE_AREAS: CinereArea[] = [
  {
    id: 'cinere',
    name: 'Cinere',
    latitude: -6.3214,
    longitude: 106.782,
    description: 'Cinere, Depok',
  },
]
