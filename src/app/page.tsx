import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, ArrowRight, CheckCircle, Leaf, Calendar, Heart } from 'lucide-react'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Farm Companion — UK Farm Shops Directory',
  description: 'Discover 1,300+ authentic UK farm shops with fresh local produce, seasonal guides, and verified farm information. Find farm shops near you with our interactive map.',
  keywords: ['farm shops', 'UK farm shops', 'local produce', 'fresh food', 'farm directory', 'farm shop near me', 'local farms', 'seasonal produce', 'farm fresh', 'UK farms', 'farm shop directory', 'local food', 'farm to table'],
  openGraph: {
    title: 'Farm Companion — UK Farm Shops Directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    url: 'https://farmcompanion.co.uk',
    siteName: 'Farm Companion',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Farm Companion - UK farm shops directory',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Companion — UK Farm Shops Directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    images: ['/og.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

// Server-side data for stats
async function getStats() {
  try {
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
    const counties = new Set(farms.map((farm: any) => farm.county).filter(Boolean))
    
    return {
      farmCount: farms.length,
      countyCount: counties.size
    }
  } catch (error) {
    console.warn('Error fetching farms data for stats:', error)
    return { farmCount: 1300, countyCount: 45 }
  }
}

export default async function HomePage() {
  const { farmCount, countyCount } = await getStats()

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section - PuredgeOS 3.0 Compliant */}
      <section className="relative overflow-hidden bg-background-surface">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-serum/5 via-transparent to-solar/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,194,178,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,255,79,0.02),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-text-heading">
              Find Fresh Local
              <span className="block text-serum">Farm Shops</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-8 leading-relaxed">
              Discover {farmCount}+ authentic UK farm shops with the freshest local produce, 
              seasonal delights, and farm-fresh goodness near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="bg-serum text-black px-8 py-4 rounded-lg font-semibold hover:bg-serum/90 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <MapPin className="w-5 h-5" />
                Explore Farm Map
              </Link>
              <Link
                href="/seasonal"
                className="border-2 border-serum text-serum px-8 py-4 rounded-lg font-semibold hover:bg-serum hover:text-black transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                What&apos;s in Season
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background-canvas border-b border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-4xl font-heading font-bold text-serum mb-2">{farmCount}+</div>
              <div className="text-text-muted">Farm Shops</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-bold text-serum mb-2">{countyCount}</div>
              <div className="text-text-muted">Counties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background-surface py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-heading mb-4">
              Why Choose Farm Shops?
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Experience the difference of truly fresh, local produce from family-run farms across the UK.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-background-canvas border border-border-default">
              <div className="w-16 h-16 bg-serum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-serum" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-heading mb-2">Fresh & Local</h3>
              <p className="text-text-muted">Direct from farm to table, ensuring maximum freshness and flavor.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-background-canvas border border-border-default">
              <div className="w-16 h-16 bg-serum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-serum" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-heading mb-2">Seasonal Selection</h3>
              <p className="text-text-muted">Discover what&apos;s in season and at its peak flavor throughout the year.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-background-canvas border border-border-default">
              <div className="w-16 h-16 bg-serum/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-serum" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-heading mb-2">Family Values</h3>
              <p className="text-text-muted">Support local families and sustainable farming practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-serum text-black py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Explore?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start your journey to discover amazing local farm shops today.
          </p>
          <Link
            href="/map"
            className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-black/90 transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            Find Farms Near You
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <NewsletterSignup />
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              UK Farm Shops Directory
            </h2>
            <p className="text-gray-600 mb-6">
              Welcome to Farm Companion, your comprehensive guide to UK farm shops. We&apos;ve curated 
              a directory of over {farmCount} authentic farm shops across {countyCount} counties, 
              helping you discover the freshest local produce and connect with real farmers.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Find Farm Shops Near You
            </h3>
            <p className="text-gray-600 mb-6">
              Whether you&apos;re looking for fresh vegetables, organic meat, artisanal cheese, or 
              homemade preserves, our interactive map makes it easy to find farm shops in your area. 
              Each listing includes verified contact information, opening hours, and details about 
              what each farm offers.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Seasonal Produce Guides
            </h3>
            <p className="text-gray-600 mb-6">
              Eating seasonally means enjoying produce at its peak flavour and nutritional value. 
              Our seasonal guides help you understand what&apos;s in season throughout the year, 
              with tips on selection, storage, and preparation for the freshest ingredients.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Support Local Farmers
            </h3>
            <p className="text-gray-600">
              By choosing to shop at local farm shops, you&apos;re supporting British farmers and 
              contributing to sustainable, local food systems. You&apos;ll enjoy fresher produce, 
              reduce food miles, and help maintain the UK&apos;s rich agricultural heritage.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
