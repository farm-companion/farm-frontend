export type FarmShop = {
  id: string
  name: string
  slug: string
  location: {
    lat: number
    lng: number
    address: string
    city: string
    county: string
    postcode: string
  }
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  hours?: Array<{
    day: string
    open: string
    close: string
  }>
  offerings?: string[]
  description?: string
  images?: string[]
  verified: boolean
  adsenseEligible?: boolean
  updatedAt?: string
}
