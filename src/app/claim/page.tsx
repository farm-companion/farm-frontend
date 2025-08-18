import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { FarmShop } from '@/types/farm'

async function readFarms(): Promise<FarmShop[]> {
  const file = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
  const raw = await fs.readFile(file, 'utf8')
  return JSON.parse(raw) as FarmShop[]
}

export const metadata: Metadata = {
  title: 'Claim Your Farm Shop Listing · Farm Companion',
  description: 'Claim ownership of your farm shop listing to update information, add photos, and manage your presence on Farm Companion.',
}

export default async function ClaimPage() {
  const farms = await readFarms()
  
  // Group farms by county for better organization
  const farmsByCounty = farms.reduce((acc, farm) => {
    const county = farm.location.county || 'Unknown County'
    if (!acc[county]) {
      acc[county] = []
    }
    acc[county].push(farm)
    return acc
  }, {} as Record<string, FarmShop[]>)

  // Sort counties alphabetically
  const sortedCounties = Object.keys(farmsByCounty).sort()

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">Claim Your Farm Shop Listing</h1>
        <p className="text-gray-700 dark:text-[#E4E2DD]/80 text-lg">
          Find your farm shop below and claim ownership to update information, add photos, and manage your listing.
        </p>
      </div>

      {/* Search and filter section */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Claim Your Listing</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-[#E4E2DD]/80">
          <li>Find your farm shop in the list below (organized by county)</li>
          <li>Click &quot;Claim This Shop&quot; next to your listing</li>
          <li>Fill out the claim form with your contact information</li>
          <li>We&apos;ll verify your ownership and grant you access to manage your listing</li>
        </ol>
      </div>

      {/* Farms by county */}
      <div className="space-y-8">
        {sortedCounties.map((county) => (
          <section key={county} className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold mb-4">{county}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {farmsByCounty[county].map((farm) => (
                <div 
                  key={farm.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{farm.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {farm.location.address}, {farm.location.postcode}
                  </p>
                  {farm.verified && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                        ✓ Verified
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={`/shop/${farm.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link
                      href={`/claim/${farm.slug}`}
                      className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                    >
                      Claim This Shop
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Add new farm section */}
      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold mb-2">Don&apos;t See Your Farm Shop?</h2>
        <p className="text-gray-700 dark:text-[#E4E2DD]/80 mb-4">
          If your farm shop isn&apos;t listed above, you can add it to our directory.
        </p>
        <Link
          href="/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Your Farm Shop
        </Link>
      </div>
    </main>
  )
}
