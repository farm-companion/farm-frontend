import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock } from 'lucide-react'
import type { FarmShop } from '@/types/farm'
import { cleanDescription } from '@/lib/seo-utils'
import { getFarmData } from '@/lib/farm-data'

export const metadata: Metadata = {
  title: 'UK Farm Shops Directory',
  description: 'Discover 1,300+ authentic UK farm shops with fresh local produce. Find farm shops near you with verified information, opening hours, and contact details.',
  openGraph: {
    title: 'UK Farm Shops Directory — Farm Companion',
    description: 'Find trusted farm shops near you with the freshest local produce. Browse our comprehensive directory of UK farm shops.',
  },
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
  const farms = await getFarmData()
  
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
      {/* Hero Section - PuredgeOS 3.0 Compliant */}
      <section className="relative overflow-hidden bg-background-surface">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-serum/5 via-transparent to-solar/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,194,178,0.03),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-text-heading">
            UK Farm Shops Directory
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-8">
            Discover {farms.length}+ authentic farm shops across the UK. 
            Find fresh local produce, seasonal delights, and farm-fresh goodness near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/map"
              className="bg-serum text-black px-8 py-4 rounded-lg font-semibold hover:bg-serum/90 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Explore Interactive Map
            </Link>
            <Link
              href="/seasonal"
              className="border-2 border-serum text-serum px-8 py-4 rounded-lg font-semibold hover:bg-serum hover:text-black transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              What&apos;s in Season
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background-canvas border-b border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-heading font-bold text-serum mb-2">{farms.length}+</div>
              <div className="text-text-muted">Farm Shops</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold text-serum mb-2">{counties.length}</div>
              <div className="text-text-muted">Counties</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold text-serum mb-2">100%</div>
              <div className="text-text-muted">Verified Farms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Directory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-heading mb-4">
              Browse by County
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Find farm shops in your area with our comprehensive county-by-county directory.
            </p>
          </div>

          <div className="space-y-12">
            {counties.map((county) => (
              <div key={county} className="border-b border-border-default pb-8 last:border-b-0">
                <h3 className="text-2xl font-heading font-semibold text-text-heading mb-6">
                  {county}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmsByCounty[county].map((farm) => (
                    <FarmCard key={farm.id} farm={farm} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
