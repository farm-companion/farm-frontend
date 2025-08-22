import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import ClientMonthSelector from '@/components/ClientMonthSelector'
import { getProduceInSeason, getProduceAtPeak } from '@/data/produce'
import { MapPin } from 'lucide-react'

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
      {/* Seasonal Wisdom - PuredgeOS 3.0 Compliant */}
      <section className="bg-background-surface rounded-3xl p-8 border border-border-default">
        <h2 className="text-2xl font-heading font-semibold text-text-heading mb-4">
          What&apos;s in Season in {monthName}
        </h2>
        <p className="text-text-muted leading-relaxed">
          Eating seasonally means enjoying produce at its peak flavour and nutritional value. 
          This month, look for these fresh, local delights at your nearest farm shop.
        </p>
      </section>

      {/* Produce Gallery */}
      <section>
        <h2 className="text-2xl font-heading font-semibold text-text-heading mb-6">
          Fresh & In Season
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allInSeason.map((produce) => (
            <Link
              key={produce.slug}
              href={`/seasonal/${produce.slug}`}
              className="group block bg-background-canvas rounded-xl border border-border-default p-6 hover:shadow-premium transition-all duration-200 hover-lift"
            >
              <div className="aspect-square bg-background-surface rounded-lg mb-4 overflow-hidden relative">
                <Image
                  src={produce.images[0].src}
                  alt={produce.images[0].alt}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="font-heading font-semibold text-text-heading mb-2 group-hover:text-serum transition-colors">
                {produce.name}
              </h3>
              <p className="text-sm text-text-muted">
                {produce.monthsInSeason?.includes(month) ? 'Peak season' : 'In season'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default async function SeasonalPage() {
  const { month, inSeasonProduce, atPeakProduce, monthName } = await getSeasonalData()

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section - PuredgeOS 3.0 Compliant */}
      <section className="bg-background-surface">
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-serum/5 via-transparent to-solar/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,194,178,0.03),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-text-heading">
            Seasonal Produce Guide
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto">
            Discover what&apos;s fresh and in season right now. 
            Find the best local produce at farm shops near you.
          </p>
        </div>
      </section>

      {/* Month Selector - Client Component */}
      <section className="border-b border-border-default bg-background-canvas">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Suspense fallback={<div className="h-12 bg-background-surface rounded animate-pulse" />}>
            <ClientMonthSelector currentMonth={month} />
          </Suspense>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={
          <div className="space-y-8">
            <div className="h-64 bg-background-surface rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-background-surface rounded-2xl animate-pulse" />
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
      <section className="bg-background-surface border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-heading mb-4">
            Find Fresh Seasonal Produce
          </h2>
          <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
            Visit local farm shops to get the freshest seasonal produce at its peak flavor.
          </p>
          <Link
            href="/map"
            className="bg-serum text-black px-8 py-4 rounded-lg font-semibold hover:bg-serum/90 transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Find Farm Shops Near You
          </Link>
        </div>
      </section>

      {/* Ad Slot */}
      
    </main>
  )
}
