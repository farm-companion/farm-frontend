'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { FarmShop } from '@/types/farm'
import { Search, MapPin, X, Navigation } from 'lucide-react'
import { hapticFeedback } from '@/lib/haptics'
import AdSlot from '@/components/AdSlot'
import { FarmDetailSheet } from '@/components/FarmDetailSheet'
import MapComponent from '@/components/MapComponent'

// Ensure this route is always rendered client-side
export const dynamic = 'force-dynamic'

// Loading skeleton for map
function MapLoadingSkeleton() {
  return (
    <div className="relative w-screen h-[calc(100vh-56px)] mt-14 bg-background-canvas">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-body font-medium">Loading interactive map...</p>
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  // Core state management
  const [farms, setFarms] = useState<FarmShop[] | null>(null)
  const [query, setQuery] = useState('')
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [bounds, setBounds] = useState<{ west:number; south:number; east:number; north:number } | null>(null)
  const [inViewOnly, setInViewOnly] = useState<boolean>(true)
  const [dataQuality, setDataQuality] = useState<{ total: number; valid: number; invalid: number } | null>(null)
  
  // Error handling state
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Google-style UI state
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedFarm, setSelectedFarm] = useState<FarmShop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  // Load farm data function with comprehensive validation and error handling
  const loadFarmData = useCallback(async (isRetry = false) => {
    if (isRetry) {
      setIsRetrying(true)
      setRetryCount(prev => prev + 1)
    } else {
      setIsLoading(true)
      setError(null)
    }
    
    let timeoutId: NodeJS.Timeout | undefined
    
    try {
      console.log('📡 Fetching farm data from /data/farms.uk.json...')
      
      // Create AbortController for cross-browser compatibility
      const controller = new AbortController()
      timeoutId = setTimeout(() => {
        controller.abort()
      }, 30000) // 30 second timeout
      
      const res = await fetch('/data/farms.uk.json', { 
        cache: 'no-store',
        signal: controller.signal
      })
      
      // Clear timeout since request completed
      clearTimeout(timeoutId)
      
      console.log('📡 Fetch response status:', res.status, res.statusText)
      
      if (!res.ok) {
        clearTimeout(timeoutId) // Clean up timeout
        throw new Error(`Failed to fetch farms data: ${res.status} ${res.statusText}`)
      }
      
      const allFarms: FarmShop[] = await res.json()
      console.log(`📡 Loaded ${allFarms.length} total farms from JSON`)
      console.log('📡 Sample farm data:', allFarms[0])
      
      // Validate and filter farms with valid coordinates
      const validFarms = allFarms.filter((farm) => {
        // Check if location exists and has valid coordinates
        if (!farm.location) {
          console.warn(`Farm ${farm.id} has no location data`)
          return false
        }
        
        const { lat, lng } = farm.location
        
        // Check for null/undefined coordinates
        if (lat === null || lng === null || lat === undefined || lng === undefined) {
          console.warn(`Farm ${farm.id} has null/undefined coordinates: lat=${lat}, lng=${lng}`)
          return false
        }
        
        // Check for non-numeric coordinates
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          console.warn(`Farm ${farm.id} has non-numeric coordinates: lat=${lat}, lng=${lng}`)
          return false
        }
        
        // Check for out-of-range coordinates
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Farm ${farm.id} has out-of-range coordinates: lat=${lat}, lng=${lng}`)
          return false
        }
        
        // Check for zero coordinates (likely placeholder)
        if (lat === 0 && lng === 0) {
          console.warn(`Farm ${farm.id} has zero coordinates (likely placeholder): lat=${lat}, lng=${lng}`)
          return false
        }
        
        return true
      })
      
      console.log(`✅ Validated ${validFarms.length} farms with valid coordinates`)
      console.log(`❌ Filtered out ${allFarms.length - validFarms.length} farms with invalid coordinates`)
      
      // Update data quality state
      setDataQuality({
        total: allFarms.length,
        valid: validFarms.length,
        invalid: allFarms.length - validFarms.length
      })
      
      setFarms(validFarms)
      farmsRef.current = validFarms
      
      // Clear any previous errors on success
      setError(null)
      setRetryCount(0)
      hapticFeedback.success()
      
    } catch (e: any) {
      console.error('Failed to load farms.uk.json', e)
      
      // Clean up timeout in case of error
      if (typeof timeoutId !== 'undefined') {
        clearTimeout(timeoutId)
      }
      
      let errorMessage = 'Failed to load farm data'
      if (e.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection.'
      } else if (e.message.includes('404')) {
        errorMessage = 'Farm data not found. Please try again later.'
      } else if (e.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.'
      } else if (e.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
      hapticFeedback.error()
      
      // Auto-retry logic (max 3 attempts)
      if (!isRetry && retryCount < 2) {
        console.log(`Auto-retrying in 3 seconds... (attempt ${retryCount + 1}/3)`)
        setTimeout(() => {
          loadFarmData(true)
        }, 3000)
      }
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }, [retryCount])
  
  const farmsRef = useRef<FarmShop[] | null>(null)

  // Counties for filtering
  const counties = useMemo(() => {
    if (!farms) return []
    const s = new Set<string>()
    for (const f of farms) {
      if (f.location?.county) s.add(f.location.county)
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [farms])

  // Filtered farms computation with performance optimizations
  const filteredFarmsBase = useMemo(() => {
    if (!farms || farms.length === 0) return []
    
    const q = query.trim().toLowerCase()
    let base = !q ? farms : farms.filter(f => {
      const inName = f.name.toLowerCase().includes(q)
      const inPostcode = f.location.postcode.toLowerCase().includes(q)
      const inCounty = f.location.county.toLowerCase().includes(q)
      return inName || inPostcode || inCounty
    })
    
    if (selectedCounty) {
      base = base.filter(f => f.location.county.toLowerCase() === selectedCounty.toLowerCase())
    }
    
    return base
  }, [farms, query, selectedCounty])

  const filteredFarms = useMemo(() => {
    let list = filteredFarmsBase
    
    // Performance optimization: Limit results for better performance
    const maxResults = 500 // Limit to prevent performance issues
    
    // Apply viewport filtering for performance
    if (inViewOnly && bounds) {
      list = list.filter(f => {
        const { lat, lng } = f.location
        return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east
      })
    }
    
    // Performance optimization: Limit results and sort by relevance
    if (list.length > maxResults) {
      // If we have too many results, prioritize by distance if user location is available
      if (userLoc) {
        list = list
          .map(f => ({
            ...f,
            distance: haversineKm(userLoc.lat, userLoc.lng, f.location.lat, f.location.lng)
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, maxResults)
          .map(({ distance, ...f }) => f) // Remove distance property
      } else {
        // Otherwise just take the first maxResults
        list = list.slice(0, maxResults)
      }
    } else if (userLoc) {
      // If we have fewer results, still sort by distance
      list = [...list].sort((a, b) => {
        const da = haversineKm(userLoc.lat, userLoc.lng, a.location.lat, a.location.lng)
        const db = haversineKm(userLoc.lat, userLoc.lng, b.location.lat, b.location.lng)
        return da - db
      })
    }
    
    return list
  }, [filteredFarmsBase, inViewOnly, bounds, userLoc, farms])

  // Distance calculation function
  function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Initialize query from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const queryParam = urlParams.get('q')
      if (queryParam) {
        setQuery(queryParam)
      }
    }
  }, [])

  // Debounced search query
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value)
      // Update URL parameter when query changes
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        if (value) {
          url.searchParams.set('q', value)
        } else {
          url.searchParams.delete('q')
        }
        window.history.replaceState({}, '', url.toString())
      }
    }, 300),
    []
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Debounce the search for performance
    debouncedSetQuery(value)
  }, [debouncedSetQuery])

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const handleFarmSelect = useCallback((farm: FarmShop) => {
    hapticFeedback.buttonPress()
    setSelectedFarm(farm) // Set the selected farm
    setShowResults(false) // Hide the search results list
    setShowSearchSuggestions(false)
  }, [])

  const handleClearSearch = useCallback(() => {
    setQuery('')
    setSelectedCounty('')
    setShowSearchSuggestions(false)
  }, [])

  return (
    <>
      {/* Google-style Map Layout - Maximum Map Visibility */}
      <main className="relative w-screen h-[calc(100vh-56px)] mt-14 bg-background-canvas">
        {/* Map Container - 95%+ visible */}
        <MapComponent
          farms={farms}
          filteredFarms={filteredFarms}
          userLoc={userLoc}
          setUserLoc={setUserLoc}
          bounds={bounds}
          setBounds={setBounds}
          selectedFarm={selectedFarm}
          setSelectedFarm={setSelectedFarm}
          loadFarmData={loadFarmData}
          isLoading={isLoading}
          error={error}
          retryCount={retryCount}
          isRetrying={isRetrying}
          dataQuality={dataQuality}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background-canvas/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-body font-medium">
                {isRetrying ? `Retrying... (${retryCount}/3)` : 'Loading farm locations...'}
              </p>
              {isRetrying && (
                <p className="text-sm text-text-muted">Please wait while we try again</p>
              )}
            </div>
          </div>
        )}

        {/* Data Quality Indicator */}
        {dataQuality && dataQuality.invalid > 0 && (
          <div className="absolute top-20 left-4 right-4 z-30 bg-yellow-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-yellow-600/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <p className="text-sm text-yellow-900 font-medium">
                  Data Quality: {dataQuality.valid} of {dataQuality.total} farms have valid locations
                </p>
              </div>
              <button 
                onClick={() => setDataQuality(null)}
                className="text-yellow-900 hover:text-yellow-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-20 left-4 right-4 z-30 bg-red-500/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-red-600/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-900 font-medium mb-1">
                    {error}
                  </p>
                  {retryCount > 0 && (
                    <p className="text-xs text-red-800">
                      Retry attempt {retryCount}/3
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {retryCount < 2 && (
                  <button 
                    onClick={() => loadFarmData(true)}
                    disabled={isRetrying}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRetrying ? 'Retrying...' : 'Retry'}
                  </button>
                )}
                <button 
                  onClick={() => setError(null)}
                  className="text-red-900 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google-style Search Bar - Minimal & Floating */}
        <div className="absolute top-4 left-4 right-4 z-40">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search farm shops, postcodes, or counties..."
                value={query}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 bg-background-canvas/95 backdrop-blur-sm border border-border-default/50 rounded-xl shadow-lg text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-text-muted hover:text-text-heading transition-colors" />
                </button>
              )}
            </div>
            
            {/* Search Suggestions */}
            {showSearchSuggestions && (query || selectedCounty) && (
              <div className="mt-2 bg-background-canvas/95 backdrop-blur-sm border border-border-default/50 rounded-xl shadow-lg overflow-hidden">
                {/* Quick Filters */}
                {(selectedCounty || inViewOnly) && (
                  <div className="p-3 border-b border-border-default/20">
                    <div className="flex flex-wrap gap-2">
                      {selectedCounty && (
                        <button
                          onClick={() => setSelectedCounty('')}
                          className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full hover:bg-brand-primary/90 transition-colors"
                        >
                          {selectedCounty} ×
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Search Results Preview */}
                {filteredFarms.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {filteredFarms.slice(0, 8).map((farm) => (
                      <button
                        key={farm.id}
                        onClick={() => handleFarmSelect(farm)}
                        className="w-full text-left px-4 py-4 sm:py-3 hover:bg-background-surface/50 transition-colors focus:outline-none focus:bg-background-surface/50 touch-manipulation"
                        style={{ minHeight: '56px' }} // Mobile-friendly touch target
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-text-heading truncate">{farm.name}</h4>
                            <p className="text-sm text-text-muted truncate">{farm.location.address}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-background-surface text-text-muted px-2 py-0.5 rounded-full">
                                {farm.location.county}
                              </span>
                              {userLoc && (
                                <span className="text-xs bg-background-surface text-text-muted px-2 py-0.5 rounded-full">
                                  {haversineKm(userLoc.lat, userLoc.lng, farm.location.lat, farm.location.lng).toFixed(1)} km
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    
                    {filteredFarms.length > 8 && (
                      <div className="px-4 py-3 border-t border-border-default/20">
                        <button
                          onClick={() => setShowResults(true)}
                          className="w-full text-center text-brand-primary font-medium hover:bg-background-surface/50 py-2 rounded-lg transition-colors"
                        >
                          View all {filteredFarms.length} farms
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Optimized Floating Action Button */}
        <button
          onClick={() => setShowResults(true)}
          className="absolute bottom-6 right-6 z-40 w-16 h-16 sm:w-14 sm:h-14 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 touch-manipulation"
          aria-label="Show farm list"
          style={{ minHeight: '64px', minWidth: '64px' }} // Mobile-friendly touch target
        >
          <MapPin className="w-7 h-7 sm:w-6 sm:h-6 mx-auto" />
          {filteredFarms.length > 0 && (
            <span className="absolute -top-1 -right-1 w-7 h-7 sm:w-6 sm:h-6 bg-background-canvas text-brand-primary text-xs rounded-full flex items-center justify-center font-bold border-2 border-brand-primary">
              {Math.min(filteredFarms.length, 99)}
            </span>
          )}
        </button>

        {/* Mobile-Optimized Bottom Sheet Results */}
        {showResults && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-background-canvas/95 backdrop-blur-sm rounded-t-3xl shadow-2xl border-t border-border-default/20 animate-slide-in-up max-h-[85vh] sm:max-h-[70vh]">
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-3 sm:pt-3 sm:pb-2">
              <div className="w-16 h-1.5 sm:w-12 sm:h-1 bg-border-default rounded-full" />
            </div>
           
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-heading">Farm Shops</h3>
                <p className="text-sm text-text-muted">{filteredFarms.length} farms found</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="w-8 h-8 rounded-full bg-background-surface flex items-center justify-center hover:bg-background-surface/80 transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] sm:max-h-[50vh] overflow-y-auto px-4 sm:px-6 pb-6">
              {filteredFarms.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">No farms found</p>
                  <p className="text-sm text-text-muted mt-1">Try adjusting your search or zoom out</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFarms.slice(0, 20).map((farm) => (
                    <button
                      key={farm.id}
                      onClick={() => handleFarmSelect(farm)}
                      className="w-full text-left bg-background-surface rounded-xl p-4 hover:bg-background-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary touch-manipulation"
                      style={{ minHeight: '72px' }} // Mobile-friendly touch target
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-text-heading truncate">{farm.name}</h4>
                          <p className="text-sm text-text-muted truncate">{farm.location.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-background-canvas text-text-muted px-2 py-0.5 rounded-full">
                              {farm.location.county}
                            </span>
                            {userLoc && (
                              <span className="text-xs bg-background-canvas text-text-muted px-2 py-0.5 rounded-full">
                                {haversineKm(userLoc.lat, userLoc.lng, farm.location.lat, farm.location.lng).toFixed(1)} km
                              </span>
                            )}
                          </div>
                        </div>
                        <Navigation className="w-5 h-5 text-text-muted flex-shrink-0 ml-3" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Farm Detail Sheet */}
        <FarmDetailSheet
          farm={selectedFarm}
          isOpen={!!selectedFarm}
          onClose={() => setSelectedFarm(null)}
          userLocation={userLoc}
          allFarms={farms || []}
        />

        {/* Ad Slot */}
        <AdSlot />
      </main>
    </>
  )
}
