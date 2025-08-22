import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react'
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/data/farms.uk.json`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      return { farmCount: 1300, countyCount: 45 }
    }
    
    const farms = await response.json()
    const counties = new Set(farms.map((farm: any) => farm.county).filter(Boolean))
    
    return {
      farmCount: farms.length,
      countyCount: counties.size
    }
  } catch (error) {
    return { farmCount: 1300, countyCount: 45 }
  }
}

export default async function HomePage() {
  const { farmCount, countyCount } = await getStats()

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Fresh Local
              <span className="block text-green-300">Farm Shops</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              Discover {farmCount}+ authentic UK farm shops with the freshest local produce, 
              seasonal delights, and farm-fresh goodness near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Explore Farm Map
              </Link>
              <Link
                href="/seasonal"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center gap-2"
              >
                What&apos;s in Season
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-primary mb-2">{farmCount}+</div>
              <div className="text-gray-600">Farm Shops</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-primary mb-2">{countyCount}</div>
              <div className="text-gray-600">Counties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-primary mb-2">24/7</div>
              <div className="text-gray-600">Updated Directory</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-primary mb-2">100%</div>
              <div className="text-gray-600">Verified Farms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Farm Companion?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with authentic, local farm shops that offer the freshest produce 
              and the best farm-to-table experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600">
                Find farm shops near you with our Google-level interactive map. 
                Search, filter, and discover local farms with ease.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seasonal Guides</h3>
              <p className="text-gray-600">
                Know what&apos;s in season with our comprehensive produce guides. 
                Get recipe inspiration and storage tips for fresh ingredients.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Information</h3>
              <p className="text-gray-600">
                All farm shops are verified with accurate contact details, 
                opening hours, and up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 border-t border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Discover Local Farm Shops?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start exploring our comprehensive directory of UK farm shops. 
              Find fresh, local produce and support your local farmers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Start Exploring
              </Link>
              <Link
                href="/shop"
                className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl font-semibold hover:bg-brand-primary hover:text-white transition-colors"
              >
                Browse Directory
              </Link>
            </div>
          </div>
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
