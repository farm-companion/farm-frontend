import type { FarmShop } from '@/types/farm'

// Utility function to get farm data with proper build-time handling
export async function getFarmData(): Promise<FarmShop[]> {
  try {
    // During build time or when no site URL is available, return empty array
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      console.log('📡 Build time detected, using fallback for farm data')
      return []
    }
    
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farm-frontend-info-10016922-abdur-rahman-morris-projects.vercel.app'
    const response = await fetch(`${baseUrl}/data/farms.uk.json`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      console.warn('Failed to fetch farms data, using fallback')
      return []
    }
    
    const farms = await response.json()
    return farms.filter((farm: FarmShop) => farm.name && farm.location?.address)
  } catch (error) {
    console.warn('Error fetching farms data:', error)
    return []
  }
}

// Utility function to get farm stats
export async function getFarmStats() {
  try {
    // During build time, use static fallback
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return { farmCount: 1300, countyCount: 45 }
    }
    
    // Use absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farm-frontend-info-10016922-abdur-rahman-morris-projects.vercel.app'
    const response = await fetch(`${baseUrl}/data/farms.uk.json`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      console.warn('Failed to fetch farms data for stats, using fallback')
      return { farmCount: 1300, countyCount: 45 }
    }
    
    const farms = await response.json()
    const counties = new Set(farms.map((farm: any) => farm.location?.county).filter(Boolean))
    
    return {
      farmCount: farms.length,
      countyCount: counties.size
    }
  } catch (error) {
    console.warn('Error fetching farms data for stats:', error)
    return { farmCount: 1300, countyCount: 45 }
  }
}

// Client-side farm data fetching (for map page)
export async function fetchFarmDataClient(): Promise<FarmShop[]> {
  try {
    const response = await fetch('/data/farms.uk.json', { 
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch farms data: ${response.status} ${response.statusText}`)
    }
    
    const farms = await response.json()
    return farms.filter((farm: FarmShop) => {
      if (!farm.location) return false
      
      const { lat, lng } = farm.location
      
      // Validate coordinates
      if (lat === null || lng === null || lat === undefined || lng === undefined) return false
      if (typeof lat !== 'number' || typeof lng !== 'number') return false
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false
      if (lat === 0 && lng === 0) return false
      
      return true
    })
  } catch (error) {
    console.error('Failed to fetch farm data:', error)
    throw error
  }
}
