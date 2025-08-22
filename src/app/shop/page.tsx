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
      {/* Hero Section - Mobile First */}
      <section className="bg-gradient-to-br from-serum/10 to-solar/5 dark:from-serum/20 dark:to-solar/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-obsidian dark:text-sandstone leading-tight">
              Farm Shops Directory
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Discover {totalFarms} authentic farm shops across {counties} counties in the UK. 
              Find fresh, local produce and connect with real farmers.
            </p>
            
            {/* Quick stats for clarity - Mobile optimized */}
            <div className="flex justify-center gap-6 sm:gap-8 pt-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-serum">{totalFarms}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Farm Shops</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-serum">{counties}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Counties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation and Search - Mobile First */}
      <section className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-midnight">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link 
                href="/map" 
                className="w-full sm:w-auto touch-target inline-flex items-center justify-center gap-2 px-4 py-3 bg-serum text-black font-medium rounded-md hover:bg-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                View on Map
              </Link>
              <Link 
                href="/counties" 
                className="w-full sm:w-auto touch-target inline-flex items-center justify-center gap-2 px-4 py-3 bg-sandstone text-obsidian font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Browse by County
              </Link>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Showing all {totalFarms} farm shops
            </div>
          </div>
        </div>
      </section>

      {/* Farm Shops List - Mobile First */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {Object.entries(groupedFarms).map(([county, countyFarms]) => (
          <div key={county} className="mb-8 sm:mb-12">
            {/* County Header - Mobile optimized */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-obsidian dark:text-sandstone mb-1 sm:mb-2 leading-tight">
                {county}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {countyFarms.length} farm shop{countyFarms.length !== 1 ? 's' : ''} in {county}
              </p>
            </div>

            {/* Farm Cards Grid - Mobile first responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {countyFarms.map((farm) => (
                <article 
                  key={farm.id}
                  className="bg-white dark:bg-midnight rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-solar focus-within:ring-offset-2"
                >
                  {/* Farm Content - Mobile optimized */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-obsidian dark:text-sandstone mb-2 leading-tight">
                      <Link 
                        href={`/shop/${farm.slug}`}
                        className="hover:text-serum transition-colors focus:outline-none focus:text-serum touch-target block"
                      >
                        {farm.name}
                      </Link>
                    </h3>

                    {/* Location Info - Mobile optimized */}
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      {farm.location && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <div>{farm.location.address}</div>
                            {farm.location.county && (
                              <div className="text-xs text-gray-500">{farm.location.county}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description - Apple-style Professional Formatting */}
                    {farm.description && (
                      <div className="mb-3 sm:mb-4">
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-700/20 rounded-lg p-3 border border-gray-100 dark:border-gray-600/30">
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed font-medium">
                            {farm.description.split('\n\n')[0]} {/* Show first paragraph only */}
                          </p>
                          {farm.description.split('\n\n').length > 1 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600/30">
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Read more on the farm page...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button - Mobile optimized */}
                    <Link 
                      href={`/shop/${farm.slug}`}
                      className="touch-target inline-flex items-center justify-center w-full px-4 py-2 bg-serum text-black font-medium rounded-md hover:bg-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2 text-sm sm:text-base"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action - Mobile First */}
      <section className="bg-white dark:bg-midnight border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-obsidian dark:text-sandstone leading-tight">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Help us grow our directory by adding your local farm shop or suggesting new locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link 
                href="/add" 
                className="touch-target w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-serum text-black font-medium rounded-md hover:bg-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2 text-sm sm:text-base"
              >
                Add a Farm Shop
              </Link>
              <Link 
                href="/contact" 
                className="touch-target w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sandstone text-obsidian font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-solar focus:ring-offset-2 text-sm sm:text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
