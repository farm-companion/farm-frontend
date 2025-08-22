import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock } from 'lucide-react'
import type { FarmShop } from '@/types/farm'
import { cleanDescription } from '@/lib/seo-utils'

export const metadata: Metadata = {
  title: 'UK Farm Shops Directory',
  description: 'Discover 1,300+ authentic UK farm shops with fresh local produce. Find farm shops near you with verified information, opening hours, and contact details.',
  openGraph: {
    title: 'UK Farm Shops Directory — Farm Companion',
    description: 'Find trusted farm shops near you with the freshest local produce. Browse our comprehensive directory of UK farm shops.',
  },
}

// Server-side data fetching
async function getFarms(): Promise<FarmShop[]> {
  try {
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
    return farms.filter((farm: FarmShop) => farm.name && farm.location?.address) // Filter out invalid entries
  } catch (error) {
    console.warn('Error fetching farms data:', error)
    return []
  }
}

// Server-side farm card component
function FarmCard({ farm }: { farm: FarmShop }) {
  const description = cleanDescription(farm.description || '')
  const previewText = description.length > 150 ? description.substring(0, 150) + '...' : description

  return (
    <article className="bg-white rounded-2xl border border-border-default/30 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-text-heading mb-2">
              <Link 
                href={`/shop/${farm.slug}`}
                className="hover:text-brand-primary transition-colors"
              >
                {farm.name}
              </Link>
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
              <MapPin className="w-4 h-4" />
              <span>{farm.location.address}</span>
              {farm.location.county && (
                <>
                  <span>•</span>
                  <span>{farm.location.county}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {previewText && (
          <p className="text-text-body text-sm leading-relaxed mb-4">
            {previewText}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-muted">
            {farm.contact?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{farm.contact.phone}</span>
              </div>
            )}
            {farm.hours && farm.hours.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Open</span>
              </div>
            )}
          </div>
          
          <Link
            href={`/shop/${farm.slug}`}
            className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function ShopPage() {
  const farms = await getFarms()
  
  // Group farms by county for better organization
  const farmsByCounty = farms.reduce((acc, farm) => {
    const county = farm.location.county || 'Other'
    if (!acc[county]) {
      acc[county] = []
    }
    acc[county].push(farm)
    return acc
  }, {} as Record<string, FarmShop[]>)

  const counties = Object.keys(farmsByCounty).sort()

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            UK Farm Shops Directory
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Discover {farms.length}+ authentic farm shops across the UK. 
            Find fresh local produce, seasonal delights, and farm-fresh goodness near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/map"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Interactive Map
            </Link>
            <Link
              href="/seasonal"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              What&apos;s in Season
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-2">{farms.length}+</div>
              <div className="text-gray-600">Farm Shops</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-2">{counties.length}</div>
              <div className="text-gray-600">Counties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-2">24/7</div>
              <div className="text-gray-600">Updated Directory</div>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Listings by County */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {counties.map((county) => (
            <div key={county}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-brand-primary" />
                {county} ({farmsByCounty[county].length} farm{farmsByCounty[county].length !== 1 ? 's' : ''})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmsByCounty[county].map((farm) => (
                  <FarmCard key={farm.slug} farm={farm} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can&apos;t Find Your Farm Shop?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Know a great farm shop that&apos;s not listed? Help us grow our directory 
            by adding your local farm shop to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add"
              className="bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              Add a Farm Shop
            </Link>
            <Link
              href="/contact"
              className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl font-semibold hover:bg-brand-primary hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
