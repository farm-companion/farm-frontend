'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import type { FarmShop } from '@/types/farm'
import { Search, MapPin, Filter, X, ChevronUp, Navigation, Star, Clock, Users } from 'lucide-react'
import { hapticFeedback } from '@/lib/haptics'
import AdSlot from '@/components/AdSlot'

// Ensure this route is always rendered client-side
export const dynamic = 'force-dynamic'

const styleUrl =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const rafRef = useRef<number | null>(null)
  const roRef = useRef<ResizeObserver | null>(null)
  const farmsRef = useRef<FarmShop[] | null>(null)
  
  // Core state management
  const [farms, setFarms] = useState<FarmShop[] | null>(null)
  const [query, setQuery] = useState('')
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [bounds, setBounds] = useState<{ west:number; south:number; east:number; north:number } | null>(null)
  const [inViewOnly, setInViewOnly] = useState<boolean>(true)
  
  // Google-style UI state
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedFarm, setSelectedFarm] = useState<FarmShop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  
  // Map configuration
  const sourceId = 'farms-src'
  const clusterLayerId = 'clusters'
  const clusterCountLayerId = 'cluster-count'
  const unclusteredLayerId = 'unclustered-point'

  // Initialize map with Google-level performance
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    // Defer to next frame for proper sizing
    rafRef.current = requestAnimationFrame(() => {
      if (!mapContainer.current || mapRef.current) return

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [-3.5, 54.5],
        zoom: 5,
        maxZoom: 18,
        minZoom: 4,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: true
      })
      mapRef.current = map

      // Google-style minimal controls
      map.addControl(new maplibregl.NavigationControl({ 
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }), 'top-right')
      
      map.addControl(new maplibregl.ScaleControl({ 
        unit: 'metric',
        maxWidth: 80
      }), 'bottom-left')

      // Enhanced geolocation
      const geo = new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showUserLocation: true,
        fitBoundsOptions: { maxZoom: 13 },
        showAccuracyCircle: true
      })
      map.addControl(geo, 'top-right')
      
      geo.on('geolocate', (e: any) => {
        if (e && e.coords) {
          hapticFeedback.success()
          setUserLoc({ lat: e.coords.latitude, lng: e.coords.longitude })
        }
      })

      // Google-level map layers
      map.on('load', () => {
        // Ensure source is added only once
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
            cluster: true,
            clusterRadius: 60, // Google-style clustering
            clusterMaxZoom: 16,
            clusterMinPoints: 3
          })
        }

        // Google-style heat visualization
        if (!map.getLayer('cluster-heat')) {
          map.addLayer({
            id: 'cluster-heat',
            type: 'circle',
            source: sourceId,
            filter: ['has', 'point_count'],
            paint: {
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                25, 3,
                35, 10,
                45, 20,
                55
              ],
              'circle-color': [
                'step',
                ['get', 'point_count'],
                'rgba(0, 194, 178, 0.15)', 3,
                'rgba(0, 194, 178, 0.25)', 10,
                'rgba(0, 194, 178, 0.35)', 20,
                'rgba(0, 194, 178, 0.45)'
              ],
              'circle-opacity': 0.8,
              'circle-stroke-width': 0
            }
          })
        }

        // Google-style cluster markers
        if (!map.getLayer(clusterLayerId)) {
          map.addLayer({
            id: clusterLayerId,
            type: 'circle',
            source: sourceId,
            filter: ['has', 'point_count'],
            paint: {
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                16, 3,
                20, 10,
                24, 20,
                28
              ],
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00C2B2', 3,
                '#00C2B2', 10,
                '#00C2B2', 20,
                '#D4FF4F'
              ],
              'circle-opacity': 0.95,
              'circle-stroke-width': 3,
              'circle-stroke-color': '#FFFFFF'
            }
          })
        }

        // Google-style cluster labels
        if (!map.getLayer(clusterCountLayerId)) {
          map.addLayer({
            id: clusterCountLayerId,
            type: 'symbol',
            source: sourceId,
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['get', 'point_count_abbreviated'],
              'text-font': ['Inter', 'Open Sans Regular', 'Arial Unicode MS Regular'],
              'text-size': 12,
              'text-allow-overlap': true
            },
            paint: {
              'text-color': '#1E1F23',
              'text-halo-color': '#FFFFFF',
              'text-halo-width': 2
            }
          })
        }

        // Google-style individual markers
        if (!map.getLayer('point-heat')) {
          map.addLayer({
            id: 'point-heat',
            type: 'circle',
            source: sourceId,
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-radius': 12,
              'circle-color': 'rgba(0, 194, 178, 0.2)',
              'circle-opacity': 0.6,
              'circle-stroke-width': 0
            }
          })
        }

        if (!map.getLayer(unclusteredLayerId)) {
          map.addLayer({
            id: unclusteredLayerId,
            type: 'circle',
            source: sourceId,
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-radius': 8,
              'circle-color': '#00C2B2',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#FFFFFF'
            }
          })
        }

        // Load farm data immediately after layers are set up
        loadFarmData()
      })

      // Load farm data function
      const loadFarmData = async () => {
        map.resize()
        setIsLoading(true)
        try {
          const res = await fetch('/data/farms.uk.json', { cache: 'no-store' })
          if (!res.ok) {
            throw new Error(`Failed to fetch farms data: ${res.status}`)
          }
          const farms: FarmShop[] = await res.json()
          console.log(`Loaded ${farms.length} farms`)
          farmsRef.current = farms
          setFarms(farms)
          hapticFeedback.success()
        } catch (e) {
          console.error('Failed to load farms.uk.json', e)
          hapticFeedback.error()
        } finally {
          setIsLoading(false)
        }
      }

      // Google-level interactions
      map.on('click', clusterLayerId, (e: any) => {
        hapticFeedback.buttonPress()
        const features = map.queryRenderedFeatures(e.point, { layers: [clusterLayerId] })
        const clusterId = features[0]?.properties?.cluster_id
        const src = map.getSource(sourceId) as any
        if (!src || clusterId == null) return
        src.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return
          map.easeTo({ 
            center: (features[0].geometry as any).coordinates, 
            zoom,
            duration: 500
          })
        })
      })

      map.on('click', unclusteredLayerId, (e: any) => {
        hapticFeedback.buttonPress()
        const f = e.features && e.features[0]
        if (!f) return
        const p = f.properties as any
        
        // Find the farm data
        const farm = farmsRef.current?.find(farm => farm.id === p.id)
        if (farm) {
          setSelectedFarm(farm)
          setShowResults(true)
        }
      })

      // Enhanced cursor states
      map.on('mouseenter', clusterLayerId, () => { 
        map.getCanvas().style.cursor = 'pointer' 
      })
      map.on('mouseleave', clusterLayerId, () => { 
        map.getCanvas().style.cursor = '' 
      })
      map.on('mouseenter', unclusteredLayerId, () => map.getCanvas().style.cursor = 'pointer')
      map.on('mouseleave', unclusteredLayerId, () => map.getCanvas().style.cursor = '')

      // Track bounds for filtering
      const updateBounds = () => {
        const b = map.getBounds()
        setBounds({ west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() })
      }
      map.on('load', updateBounds)
      map.on('moveend', updateBounds)



      // Responsive handling
      roRef.current = new ResizeObserver(() => map.resize())
      roRef.current.observe(mapContainer.current!)

      const handleShow = () => map.resize()
      window.addEventListener('pageshow', handleShow)
      document.addEventListener('visibilitychange', handleShow)

      mapRef.current = map

      return () => {
        window.removeEventListener('pageshow', handleShow)
        document.removeEventListener('visibilitychange', handleShow)
      }
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      roRef.current?.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Counties for filtering
  const counties = useMemo(() => {
    if (!farms) return []
    const s = new Set<string>()
    for (const f of farms) {
      if (f.location?.county) s.add(f.location.county)
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [farms])

  // Filtered farms computation
  const filteredFarmsBase = useMemo(() => {
    if (!farms) return []
    const q = query.trim().toLowerCase()
    let base = !q ? farms : farms.filter(f => {
      const inName = f.name.toLowerCase().includes(q)
      const inPostcode = f.location.postcode.toLowerCase().includes(q)
      const inCounty = f.location.county.toLowerCase().includes(q)
      return inName || inPostcode || inCounty
    })
    if (selectedCounty) {
      base = base.filter(f => f.location.county === selectedCounty)
    }
    return base
  }, [farms, query, selectedCounty])

  const filteredFarms = useMemo(() => {
    let list = filteredFarmsBase
    if (inViewOnly && bounds) {
      list = list.filter(f => {
        const { lat, lng } = f.location
        return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east
      })
    }
    if (userLoc) {
      list = [...list].sort((a, b) => {
        const da = haversineMi(userLoc.lat, userLoc.lng, a.location.lat, a.location.lng)
        const db = haversineMi(userLoc.lat, userLoc.lng, b.location.lat, b.location.lng)
        return da - db
      })
    }
    return list
  }, [filteredFarmsBase, inViewOnly, bounds, userLoc])

  // Update map markers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const src = map.getSource(sourceId) as any
    if (!src) {
      console.warn('Map source not found, retrying...')
      return
    }
    
    const features = (filteredFarmsBase || []).map((f) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [f.location.lng, f.location.lat] },
      properties: {
        id: f.id,
        name: f.name,
        slug: f.slug,
        county: f.location.county,
        postcode: f.location.postcode,
        address: f.location.address
      }
    }))
    
    console.log(`Updating map with ${features.length} features`)
    src.setData({ type: 'FeatureCollection', features })
  }, [filteredFarmsBase])

  // Google-style fly to farm
  const flyToFarm = useCallback((f: FarmShop) => {
    const map = mapRef.current
    if (!map) return
    hapticFeedback.buttonPress()
    
    const coords: [number, number] = [f.location.lng, f.location.lat]
    map.easeTo({ 
      center: coords, 
      zoom: Math.max(map.getZoom(), 12),
      duration: 1000
    })
    
    setSelectedFarm(f)
    setShowResults(true)
  }, [])

  // Google-style search handlers
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true)
    setShowSearchSuggestions(true)
  }, [])

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false)
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSearchSuggestions(false), 200)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowSearchSuggestions(true)
  }, [])

  const handleFarmSelect = useCallback((farm: FarmShop) => {
    hapticFeedback.buttonPress()
    flyToFarm(farm)
    setShowSearchSuggestions(false)
    setIsSearchFocused(false)
  }, [flyToFarm])

  const handleClearSearch = useCallback(() => {
    setQuery('')
    setSelectedCounty('')
    setShowSearchSuggestions(false)
    setIsSearchFocused(false)
  }, [])

  return (
    <>
      {/* Google-style Map Layout - Maximum Map Visibility */}
      <main className="relative w-screen h-[calc(100vh-56px)] mt-14 bg-background-canvas">
        {/* Map Container - 95%+ visible */}
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background-canvas/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-text-body font-medium">Loading farm locations...</p>
            </div>
          </div>
        )}

        {/* Google-style Search Bar - Minimal, at top */}
        <div className="absolute top-4 left-4 right-4 z-40">
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                value={query}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search farms, postcodes, counties..."
                className="w-full bg-background-canvas/95 backdrop-blur-sm border border-border-default/20 rounded-full px-12 py-3 text-text-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-lg"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-background-surface flex items-center justify-center hover:bg-background-surface/80 transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              )}
            </div>

            {/* Google-style Search Suggestions */}
            {showSearchSuggestions && (query || selectedCounty) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background-canvas/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border-default/20 overflow-hidden z-50">
                {/* Active Filters */}
                {(selectedCounty || inViewOnly) && (
                  <div className="px-4 py-3 border-b border-border-default/20">
                    <div className="flex flex-wrap gap-2">
                      {selectedCounty && (
                        <span className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm">
                          {selectedCounty}
                          <button
                            onClick={() => setSelectedCounty('')}
                            className="w-4 h-4 rounded-full bg-brand-primary/20 flex items-center justify-center hover:bg-brand-primary/30 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {inViewOnly && (
                        <span className="inline-flex items-center gap-2 bg-background-surface text-text-muted px-3 py-1 rounded-full text-sm">
                          In view only
                          <button
                            onClick={() => setInViewOnly(false)}
                            className="w-4 h-4 rounded-full bg-background-surface/50 flex items-center justify-center hover:bg-background-surface/70 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Search Results */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredFarms.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <MapPin className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-text-muted">No farms found</p>
                      <p className="text-sm text-text-muted mt-1">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredFarms.slice(0, 8).map((farm) => (
                        <button
                          key={farm.id}
                          onClick={() => handleFarmSelect(farm)}
                          className="w-full text-left px-4 py-3 hover:bg-background-surface/50 transition-colors focus:outline-none focus:bg-background-surface/50"
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
                                    {haversineMi(userLoc.lat, userLoc.lng, farm.location.lat, farm.location.lng).toFixed(1)} mi
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
              </div>
            )}
          </div>
        </div>

        {/* Google-style Floating Action Button */}
        <button
          onClick={() => setShowResults(true)}
          className="absolute bottom-6 right-6 z-40 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          aria-label="Show farm list"
        >
          <MapPin className="w-6 h-6 mx-auto" />
          {filteredFarms.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-background-canvas text-brand-primary text-xs rounded-full flex items-center justify-center font-bold border-2 border-brand-primary">
              {Math.min(filteredFarms.length, 99)}
            </span>
          )}
        </button>

        {/* Google-style Bottom Sheet Results */}
        {showResults && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-background-canvas/95 backdrop-blur-sm rounded-t-3xl shadow-2xl border-t border-border-default/20 animate-slide-in-up">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-border-default rounded-full" />
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
            <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
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
                      className="w-full text-left bg-background-surface rounded-xl p-4 hover:bg-background-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-text-heading truncate">{farm.name}</h4>
                          <p className="text-sm text-text-muted mt-1">{farm.location.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">
                              {farm.location.county}
                            </span>
                            {userLoc && (
                              <span className="text-xs bg-background-canvas text-text-muted px-2 py-1 rounded-full">
                                {haversineMi(userLoc.lat, userLoc.lng, farm.location.lat, farm.location.lng).toFixed(1)} mi
                              </span>
                            )}
                          </div>
                        </div>
                        <Navigation className="w-5 h-5 text-text-muted flex-shrink-0 ml-3" />
                      </div>
                    </button>
                  ))}
                  
                  {filteredFarms.length > 20 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-text-muted">
                        Showing 20 of {filteredFarms.length} farms
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Google-style Selected Farm Card */}
        {selectedFarm && !showResults && (
          <div className="absolute bottom-4 left-4 right-4 z-40 bg-background-canvas/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border-default/20 p-4 animate-slide-in-up">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-heading">{selectedFarm.name}</h3>
                <p className="text-sm text-text-muted mt-1">{selectedFarm.location.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">
                    {selectedFarm.location.county}
                  </span>
                  {userLoc && (
                    <span className="text-xs bg-background-surface text-text-muted px-2 py-1 rounded-full">
                      {haversineMi(userLoc.lat, userLoc.lng, selectedFarm.location.lat, selectedFarm.location.lng).toFixed(1)} mi
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <a
                  href={`/shop/${selectedFarm.slug}`}
                  className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary/90 transition-colors"
                  aria-label={`View details for ${selectedFarm.name}`}
                >
                  <ChevronUp className="w-4 h-4 text-white" />
                </a>
                <button
                  onClick={() => setSelectedFarm(null)}
                  className="w-8 h-8 bg-background-surface rounded-full flex items-center justify-center hover:bg-background-surface/80 transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sponsored section */}
      <section
        aria-label="Sponsored content"
        className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-6"
      >
        <div className="rounded-lg border bg-background-canvas p-2 sm:p-3 text-xs sm:text-sm shadow-sm border-border-default">
          <div className="mb-1 text-[10px] uppercase tracking-wide opacity-70">Sponsored</div>
          <AdSlot />
        </div>
      </section>
    </>
  )
}

// Utility functions
function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 3958.7613 // Earth radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
