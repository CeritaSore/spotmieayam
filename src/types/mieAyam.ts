export interface MieAyamSpot {
  id: string
  name: string
  latitude: number
  longitude: number
  distanceKm?: number
  rating?: number
  price?: number
  priceRange?: string
}

export interface CinereArea {
  id: string
  name: string
  latitude: number
  longitude: number
  description?: string
}
