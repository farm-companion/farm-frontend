import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import ClientMonthSelector from '@/components/ClientMonthSelector'
import { getProduceInSeason, getProduceAtPeak } from '@/data/produce'

export const metadata: Metadata = {
  title: 'Seasonal Produce Guide',
  description: 'Discover what\'s in season now with our comprehensive UK seasonal produce guide. Find the freshest local fruits and vegetables.',
  openGraph: {
    title: 'Seasonal Produce Guide — Farm Companion',
    description: 'What\'s in season now? Find the freshest local produce with our comprehensive UK seasonal guide.',
  },
}

// Server-side data fetching
async function getSeasonalData() {
  const now = new Date()
  const month = now.getMonth() + 1
  
  return {
    month,
    inSeasonProduce: getProduceInSeason(month),
    atPeakProduce: getProduceAtPeak(month),
    monthName: new Date(now.getFullYear(), month - 1).toLocaleString('en-GB', { month: 'long' })
  }
}

// Server-side seasonal content
function SeasonalContent({ month, inSeasonProduce, atPeakProduce, monthName }: {
  month: number
  inSeasonProduce: any[]
  atPeakProduce: any[]
  monthName: string
}) {
  // Combine and deduplicate
  const allInSeason = [...new Set([...inSeasonProduce, ...atPeakProduce])]

  return (
    <div className="space-y-8">
      {/* Seasonal Wisdom */}
      <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          What&apos;s in Season in {monthName}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Eating seasonally means enjoying produce at its peak flavour and nutritional value. 
          This month, look for these fresh, local delights at your nearest farm shop.
        </p>
      </section>

      {/* Produce Gallery */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          What&apos;s in Season Now
        </h3>

        {/* Enhanced Produce Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allInSeason.map((produce, index) => (
            <div
              key={produce.slug}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link
                href={`/seasonal/${produce.slug}`}
                className="group block rounded-2xl border border-border-default/30 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Open seasonal guide for ${produce.name}`}
              >
                <div className="p-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading">{produce.name}</h3>
                    <p className="text-sm text-text-muted mt-1">Peak season for flavour and nutrition</p>
                    <span className="inline-flex mt-3 items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1">
                      {atPeakProduce.find(p => p.slug === produce.slug) ? 'Peak Season' : 'In Season'}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-brand-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {allInSeason.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No seasonal produce data available for this month.</p>
            <p className="text-sm text-gray-500">Check back later for updated seasonal information.</p>
          </div>
        )}
      </section>

      {/* Seasonal Tips */}
      <section className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Seasonal Shopping Tips</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Why Shop Seasonally?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Better flavour and nutritional value</li>
              <li>• Lower environmental impact</li>
              <li>• Support local farmers</li>
              <li>• More affordable prices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Storage Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Store most produce in the fridge</li>
              <li>• Keep tomatoes at room temperature</li>
              <li>• Use within 3-5 days for best quality</li>
              <li>• Freeze excess for later use</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Source Attribution */}
      <section className="text-center text-sm text-gray-500 border-t pt-6">
        <p>
          Seasonal data sourced from UK farming calendars and agricultural research. 
          Actual availability may vary by region and weather conditions.
        </p>
      </section>
    </div>
  )
}

export default async function SeasonalPage() {
  const { month, inSeasonProduce, atPeakProduce, monthName } = await getSeasonalData()

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Seasonal Produce Guide
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Discover what&apos;s fresh and in season right now. 
            Find the best local produce at farm shops near you.
          </p>
        </div>
      </section>

      {/* Month Selector - Client Component */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Suspense fallback={<div className="h-12 bg-gray-100 rounded animate-pulse" />}>
            <ClientMonthSelector currentMonth={month} />
          </Suspense>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={
          <div className="space-y-8">
            <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <SeasonalContent 
            month={month}
            inSeasonProduce={inSeasonProduce}
            atPeakProduce={atPeakProduce}
            monthName={monthName}
          />
        </Suspense>
      </div>

      {/* Call to Action */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find Farm Shops Near You
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover local farm shops with the freshest seasonal produce. 
            Use our interactive map to find trusted farms in your area.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Explore Farm Map
          </Link>
        </div>
      </section>

      {/* Ad Slot */}
      <AdSlot />
    </main>
  )
}
