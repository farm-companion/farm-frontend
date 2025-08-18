import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import { FarmShop } from '@/types/farm'

// Metadata for SEO and clarity
export const metadata = {
  title: 'Farm Shops Directory | Farm Companion',
  description: 'Discover local farm shops across the UK. Find fresh produce, local food, and authentic farm experiences near you.',
  keywords: 'farm shops, local food, fresh produce, UK farms, farm directory',
}

// Load farm data with error handling
async function getFarms(): Promise<FarmShop[]> {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
    const data = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading farm data:', error)
    return []
  }
}

// Sort farms by name for consistent navigation
function sortFarms(farms: FarmShop[]): FarmShop[] {
  return farms.sort((a, b) => a.name.localeCompare(b.name))
}

// Group farms by county for better organization
function groupFarmsByCounty(farms: FarmShop[]): Record<string, FarmShop[]> {
  const grouped: Record<string, FarmShop[]> = {}
  
  farms.forEach(farm => {
    const county = farm.location?.county || 'Other'
    if (!grouped[county]) {
      grouped[county] = []
    }
    grouped[county].push(farm)
  })
  
  // Sort counties alphabetically
  return Object.fromEntries(
    Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  )
}

export default async function ShopListingPage() {
  const farms = await getFarms()
  const sortedFarms = sortFarms(farms)
  const groupedFarms = groupFarmsByCounty(sortedFarms)
  
  const totalFarms = farms.length
  const counties = Object.keys(groupedFarms).length

  return (
    <div className="min-h-screen bg-sandstone dark:bg-obsidian">
      {/* Hero Section - Clear purpose and hierarchy */}
      <section className="bg-gradient-to-br from-serum/10 to-solar/5 dark:from-serum/20 dark:to-solar/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-obsidian dark:text-sandstone">
              Farm Shops Directory
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover {totalFarms} authentic farm shops across {counties} counties in the UK. 
              Find fresh, local produce and connect with real farmers.
            </p>
            
            {/* Quick stats for clarity */}
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-serum">{totalFarms}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Farm Shops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-serum">{counties}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Counties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation and Search - Supporting clarity pillar #6 */}
      <section className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-midnight">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/map" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-serum text-black font-medium rounded-md hover:bg-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                View on Map
              </Link>
              <Link 
                href="/counties" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-sandstone text-obsidian font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Browse by County
              </Link>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing all {totalFarms} farm shops
            </div>
          </div>
        </div>
      </section>

      {/* Farm Shops List - Main content with clear hierarchy */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {Object.entries(groupedFarms).map(([county, countyFarms]) => (
          <div key={county} className="mb-12">
            {/* County Header - Clear section organization */}
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-obsidian dark:text-sandstone mb-2">
                {county}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {countyFarms.length} farm shop{countyFarms.length !== 1 ? 's' : ''} in {county}
              </p>
            </div>

            {/* Farm Cards Grid - Responsive and accessible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countyFarms.map((farm) => (
                <article 
                  key={farm.id}
                  className="bg-white dark:bg-midnight rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-solar focus-within:ring-offset-2"
                >
                  {/* Farm Content - Clean information-focused layout */}
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-semibold text-obsidian dark:text-sandstone mb-2">
                      <Link 
                        href={`/shop/${farm.slug}`}
                        className="hover:text-serum transition-colors focus:outline-none focus:text-serum"
                      >
                        {farm.name}
                      </Link>
                    </h3>

                    {/* Location Info - Supporting clarity pillar #7 */}
                    <div className="space-y-2 mb-4">
                      {farm.location?.address && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{farm.location.address}</span>
                        </p>
                      )}
                      
                      {farm.location?.postcode && farm.location.postcode !== 'UK' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {farm.location.postcode}
                        </p>
                      )}
                    </div>

                    {/* Contact Info - Progressive disclosure */}
                    <div className="space-y-2 mb-4">
                      {farm.contact?.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a 
                            href={`tel:${farm.contact.phone}`}
                            className="hover:text-serum transition-colors"
                          >
                            {farm.contact.phone}
                          </a>
                        </p>
                      )}
                      
                      {farm.contact?.website && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <a 
                            href={farm.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-serum transition-colors truncate"
                          >
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>

                    {/* Offerings - Supporting clarity pillar #7 */}
                    {farm.offerings && farm.offerings.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Offers:</p>
                        <div className="flex flex-wrap gap-1">
                          {farm.offerings.slice(0, 3).map((offering, index) => (
                            <span 
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-serum/10 text-serum rounded-full"
                            >
                              {offering}
                            </span>
                          ))}
                          {farm.offerings.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                              +{farm.offerings.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons - Clear affordances */}
                    <div className="flex gap-2">
                      <Link
                        href={`/shop/${farm.slug}`}
                        className="flex-1 bg-serum text-black text-sm font-medium py-2 px-4 rounded-md hover:bg-teal-400 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/claim/${farm.slug}`}
                        className="bg-sandstone text-obsidian text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
                      >
                        Claim
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State - Supporting clarity pillar #1 */}
        {farms.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-heading font-semibold text-obsidian dark:text-sandstone mb-2">
                No Farm Shops Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn&apos;t load the farm shops directory at the moment. Please try again later.
              </p>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 bg-serum text-black font-medium py-2 px-4 rounded-md hover:bg-teal-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                View on Map
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Call to Action - Supporting clarity pillar #8 */}
      <section className="bg-gradient-to-br from-serum/10 to-solar/5 dark:from-serum/20 dark:to-solar/10 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-heading font-bold text-obsidian dark:text-sandstone mb-4">
            Can&apos;t Find Your Farm Shop?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            If you own or know of a farm shop that should be listed here, let us know! 
            We&apos;re always looking to expand our directory of authentic local food sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add"
              className="inline-flex items-center gap-2 bg-serum text-black font-medium py-3 px-6 rounded-md hover:bg-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add a Farm Shop
            </Link>
            <Link
              href="mailto:hello@farmcompanion.co.uk"
              className="inline-flex items-center gap-2 bg-sandstone text-obsidian font-medium py-3 px-6 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
