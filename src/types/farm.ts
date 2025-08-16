export type FarmShop = {
  id: string
  name: string
  slug: string
  location: {
    lat: number
    lng: number
    address: string
    county: string
    postcode: string
  }
  offerings?: string[]
  verified: boolean
}
