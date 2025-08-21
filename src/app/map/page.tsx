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
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://demotiles.maplibre.org/style.json'

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
  const [dataQuality, setDataQuality] = useState<{ total: number; valid: number; invalid: number } | null>(null)
  
  // Error handling state
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Google-style UI state
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedFarm, setSelectedFarm] = useState<FarmShop | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  // Load farm data function with comprehensive validation and error handling
  const loadFarmData = useCallback(async (isRetry = false) => {
    console.log('🚀 loadFarmData called with isRetry:', isRetry)
    
    if (isRetry) {
      setIsRetrying(true)
      setRetryCount(prev => prev + 1)
    } else {
      setIsLoading(true)
      setError(null)
    }
    
    try {
      console.log('📡 Fetching farm data from /data/farms.uk.json...')
      const res = await fetch('/data/farms.uk.json', { 
        cache: 'no-store',
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })
      
      console.log('📡 Fetch response status:', res.status, res.statusText)
      
      if (!res.ok) {
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
        
        // Check for valid number types
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          console.warn(`Farm ${farm.id} has invalid coordinate types: lat=${typeof lat}, lng=${typeof lng}`)
          return false
        }
        
        // Check for valid coordinate ranges
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Farm ${farm.id} has out-of-range coordinates: lat=${lat}, lng=${lng}`)
          return false
        }
        
        // Check for zero coordinates (likely invalid)
        if (lat === 0 && lng === 0) {
          console.warn(`Farm ${farm.id} has zero coordinates (likely invalid): lat=${lat}, lng=${lng}`)
          return false
        }
        
        return true
      })
      
      console.log(`Validated ${validFarms.length} farms with valid coordinates (filtered out ${allFarms.length - validFarms.length} invalid farms)`)
      
      // Set data quality metrics
      setDataQuality({
        total: allFarms.length,
        valid: validFarms.length,
        invalid: allFarms.length - validFarms.length
      })
      
      farmsRef.current = validFarms
      setFarms(validFarms)
      
      // Update map source with validated farm data
      console.log('🗺️ Updating map source with validated farm data...')
      const map = mapRef.current
      if (map) {
        console.log('🗺️ Map reference exists')
        const src = map.getSource(sourceId) as any
        if (src) {
          console.log('🗺️ Map source found, preparing to update data')
          const features = validFarms.map((f) => ({
            type: 'Feature' as const,
            geometry: { 
              type: 'Point' as const, 
              coordinates: [f.location.lng, f.location.lat] 
            },
            properties: {
              id: f.id,
              name: f.name,
              slug: f.slug,
              county: f.location.county || '',
              postcode: f.location.postcode || '',
              address: f.location.address || ''
            }
          }))
          
          console.log(`🗺️ Setting map data with ${features.length} validated features`)
          console.log('🗺️ Sample valid feature:', features[0])
          console.log('🗺️ Map layers available:', map.getStyle().layers?.map(l => l.id))
          console.log('🗺️ Map source data before update:', src._data)
          
          console.log('🗺️ Calling src.setData()...')
          src.setData({ type: 'FeatureCollection', features })
          console.log('🗺️ src.setData() completed')
          
          // Verify data was set
          setTimeout(() => {
            console.log('🗺️ Verifying data was set correctly...')
            console.log('🗺️ Map source data after update:', src._data)
            console.log('🗺️ Features count after update:', src._data?.features?.length || 0)
          }, 100)
          
          // Force a style refresh to ensure markers appear
          setTimeout(() => {
            if (map.getLayer(unclusteredLayerId)) {
              console.log('Unclustered layer exists, checking visibility')
              const layer = map.getLayer(unclusteredLayerId)
              console.log('Layer paint properties:', layer)
              
              // Force layer visibility
              map.setLayoutProperty(unclusteredLayerId, 'visibility', 'visible')
              map.setPaintProperty(unclusteredLayerId, 'circle-radius', 10)
              map.setPaintProperty(unclusteredLayerId, 'circle-color', '#FF0000') // Red for debugging
              map.setPaintProperty(unclusteredLayerId, 'circle-stroke-width', 2)
              map.setPaintProperty(unclusteredLayerId, 'circle-stroke-color', '#FFFFFF')
            }
          }, 1000)
        }
      }
      
      // Clear any previous errors on success
      setError(null)
      setRetryCount(0)
      hapticFeedback.success()
      
    } catch (e: any) {
      console.error('Failed to load farms.uk.json', e)
      
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
  
  // Map configuration
  const sourceId = 'farms-src'
  const clusterLayerId = 'clusters'
  const clusterCountLayerId = 'cluster-count'
  const unclusteredLayerId = 'unclustered-point'

  // Initialize map with performance optimizations
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
        // Note: MapLibre GL JS doesn't support some performance options that Mapbox GL JS has
      })
      mapRef.current = map

      // Mobile-optimized map controls
      map.addControl(new maplibregl.NavigationControl({ 
        showCompass: true,
        showZoom: true,
        visualizePitch: false
      }), 'top-right')
      
      // Add mobile-specific map configuration
      map.dragRotate.disable() // Disable drag rotation on mobile for better UX
      map.touchZoomRotate.disableRotation() // Disable rotation on touch for better mobile experience
      
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
        console.log('Map loaded, setting up layers...')
        // Ensure source is added only once
        if (!map.getSource(sourceId)) {
          console.log('Adding map source...')
          try {
            map.addSource(sourceId, {
              type: 'geojson',
              data: { type: 'FeatureCollection', features: [] },
              cluster: true,
              clusterRadius: 60, // Google-style clustering
              clusterMaxZoom: 16,
              clusterMinPoints: 3
            })
            console.log('✅ Map source added successfully')
          } catch (error) {
            console.error('❌ Failed to add map source:', error)
          }
        } else {
          console.log('⚠️ Map source already exists')
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
          console.log('Adding point-heat layer...')
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
          console.log('point-heat layer added')
        }

        if (!map.getLayer(unclusteredLayerId)) {
          console.log('Adding unclustered layer...')
          try {
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
            console.log('✅ unclustered layer added successfully')
          } catch (error) {
            console.error('❌ Failed to add unclustered layer:', error)
          }
        } else {
          console.log('⚠️ unclustered layer already exists')
        }

        // Verify all layers were added
        setTimeout(() => {
          const allLayers = map.getStyle().layers?.map(l => l.id) || []
          console.log('🔍 VERIFICATION - All map layers:', allLayers)
          console.log('🔍 VERIFICATION - Expected farm layers:', [clusterLayerId, clusterCountLayerId, unclusteredLayerId])
          console.log('🔍 VERIFICATION - Farm layers found:', allLayers.filter(id => [clusterLayerId, clusterCountLayerId, unclusteredLayerId].includes(id)))
          
          // Check if our layers exist
          const hasClusters = map.getLayer(clusterLayerId)
          const hasClusterCount = map.getLayer(clusterCountLayerId)
          const hasUnclustered = map.getLayer(unclusteredLayerId)
          
          console.log('🔍 VERIFICATION - Layer existence check:')
          console.log('  - clusters layer exists:', !!hasClusters)
          console.log('  - cluster-count layer exists:', !!hasClusterCount)
          console.log('  - unclustered-point layer exists:', !!hasUnclustered)
          
          if (!hasUnclustered) {
            console.error('❌ CRITICAL: unclustered-point layer is missing!')
          }
        }, 500)

        // Load farm data immediately after layers are set up
        console.log('🎯 About to call loadFarmData()...')
        loadFarmData()
        console.log('🎯 loadFarmData() call completed')
      })



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

  // Fallback: Load farm data if not loaded after map initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔄 Fallback: Checking if farm data needs to be loaded...')
      const map = mapRef.current
      if (map && farms && farms.length === 0) {
        console.log('🔄 Fallback: No farms loaded, calling loadFarmData()...')
        loadFarmData()
      }
    }, 2000) // Wait 2 seconds after map initialization

    return () => clearTimeout(timer)
  }, [loadFarmData, farms?.length || 0])

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
    if (!farms) return []
    console.log(`🔍 filteredFarmsBase starting with ${farms.length} farms`)
    const q = query.trim().toLowerCase()
    let base = !q ? farms : farms.filter(f => {
      const inName = f.name.toLowerCase().includes(q)
      const inPostcode = f.location.postcode.toLowerCase().includes(q)
      const inCounty = f.location.county.toLowerCase().includes(q)
      return inName || inPostcode || inCounty
    })
    if (selectedCounty) {
      base = base.filter(f => f.location.county === selectedCounty)
      console.log(`🔍 After county filtering: ${base.length} farms (selectedCounty: "${selectedCounty}")`)
    }
    console.log(`🔍 filteredFarmsBase: ${base.length} farms (query: "${q}", selectedCounty: "${selectedCounty}")`)
    return base
  }, [farms, query, selectedCounty])

  const filteredFarms = useMemo(() => {
    let list = filteredFarmsBase
    
    console.log(`🔍 filteredFarms starting with ${list.length} farms from filteredFarmsBase`)
    
    // Performance optimization: Limit results for better performance
    const maxResults = 500 // Limit to prevent performance issues
    
    // Temporarily disable inViewOnly filtering to show all farms initially
    if (inViewOnly && bounds) {
      console.log(`🔍 Bounds filtering would filter to viewport only, but showing all farms for debugging`)
      // list = list.filter(f => {
      //   const { lat, lng } = f.location
      //   return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east
      // })
      // console.log(`🔍 After bounds filtering: ${list.length} farms`)
    } else {
      console.log(`🔍 No bounds filtering applied (inViewOnly: ${inViewOnly}, bounds: ${!!bounds})`)
    }
    
    // Performance optimization: Limit results and sort by relevance
    if (list.length > maxResults) {
      // If we have too many results, prioritize by distance if user location is available
      if (userLoc) {
        list = list
          .map(f => ({
            ...f,
            distance: haversineMi(userLoc.lat, userLoc.lng, f.location.lat, f.location.lng)
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
        const da = haversineMi(userLoc.lat, userLoc.lng, a.location.lat, a.location.lng)
        const db = haversineMi(userLoc.lat, userLoc.lng, b.location.lat, b.location.lng)
        return da - db
      })
    }
    
    console.log(`🔍 filteredFarms final result: ${list.length} farms`)
    return list
  }, [filteredFarmsBase, inViewOnly, bounds, userLoc])

  // Update map markers with validation and performance optimization
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) {
      console.log('Map not ready for update:', { map: !!map, styleLoaded: map?.isStyleLoaded() })
      return
    }
    const src = map.getSource(sourceId) as any
    if (!src) {
      console.warn('Map source not found, retrying...')
      return
    }
    
    // Apply the same validation to filtered farms
    console.log(`🗺️ Map update: filteredFarms has ${filteredFarms?.length || 0} farms`)
    const validFilteredFarms = (filteredFarms || []).filter((f) => {
      if (!f.location) return false
      const { lat, lng } = f.location
      return lat !== null && lng !== null && 
             typeof lat === 'number' && typeof lng === 'number' &&
             lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 &&
             !(lat === 0 && lng === 0)
    })
    
    // Performance optimization: Only update if data actually changed
    const currentFeatures = src._data?.features || []
    const newFeatures = validFilteredFarms.map((f) => ({
      type: 'Feature' as const,
      geometry: { 
        type: 'Point' as const, 
        coordinates: [f.location.lng, f.location.lat] 
      },
      properties: {
        id: f.id,
        name: f.name,
        slug: f.slug,
        county: f.location.county || '',
        postcode: f.location.postcode || '',
        address: f.location.address || ''
      }
    }))
    
    // Check if data has actually changed to avoid unnecessary updates
    const hasChanged = currentFeatures.length !== newFeatures.length || 
                      JSON.stringify(currentFeatures.map((f: any) => f.properties.id).sort()) !== 
                      JSON.stringify(newFeatures.map((f: any) => f.properties.id).sort())
    
    if (hasChanged) {
      console.log(`Updating map with ${newFeatures.length} validated features from filtered farms (filtered out ${(filteredFarms || []).length - validFilteredFarms.length} invalid farms)`)
      if (newFeatures.length > 0) {
        console.log('Sample valid filtered feature:', newFeatures[0])
      }
      src.setData({ type: 'FeatureCollection', features: newFeatures })
      
      // Debug marker visibility
      setTimeout(() => {
        console.log('Checking marker visibility after update...')
        console.log('Source data features count:', src._data?.features?.length || 0)
        console.log('Map zoom level:', map.getZoom())
        console.log('Map center:', map.getCenter())
        
        // Force red markers for debugging
        if (map.getLayer(unclusteredLayerId)) {
          map.setPaintProperty(unclusteredLayerId, 'circle-color', '#FF0000')
          map.setPaintProperty(unclusteredLayerId, 'circle-radius', 15)
          console.log('Applied red debug styling to markers')
        }
      }, 500)
    } else {
      console.log('Map data unchanged, skipping update for performance')
    }
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

  // Performance-optimized search handlers with debouncing
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true)
    setShowSearchSuggestions(true)
  }, [])

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false)
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSearchSuggestions(false), 200)
  }, [])

  // Debounced search for better performance
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value)
      setShowSearchSuggestions(true)
    }, 300), // 300ms debounce
    []
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Update input immediately for responsive feel
    e.target.value = value
    // Debounce the actual search
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

        {/* Mobile-First Search Bar - Responsive Design */}
        <div className="absolute top-4 left-4 right-4 z-40">
          <div className="relative max-w-sm sm:max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                value={query}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search farms, postcodes, counties..."
                className="w-full bg-background-canvas/95 backdrop-blur-sm border border-border-default/20 rounded-full px-12 py-4 sm:py-3 text-text-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary shadow-lg text-base sm:text-sm touch-manipulation"
                autoComplete="off"
                style={{ minHeight: '48px' }} // iOS-friendly touch target
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

                         {/* Mobile-Optimized Search Suggestions */}
             {showSearchSuggestions && (query || selectedCounty) && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-background-canvas/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border-default/20 overflow-hidden z-50 max-h-[60vh] sm:max-h-64">
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

                         {/* Debug Button for Marker Visibility */}
        <button
          onClick={() => {
            const map = mapRef.current
            if (map) {
              console.log('=== DEBUGGING MARKERS ===')
              console.log('Map loaded:', map.loaded())
              console.log('Style loaded:', map.isStyleLoaded())
              console.log('Available layers:', map.getStyle().layers?.map(l => l.id))
              
              const src = map.getSource(sourceId) as any
              if (src) {
                console.log('Source data:', src._data)
                console.log('Features count:', src._data?.features?.length || 0)
                
                        // Force marker visibility with aggressive styling
        if (map.getLayer(unclusteredLayerId)) {
          map.setPaintProperty(unclusteredLayerId, 'circle-color', '#FF0000')
          map.setPaintProperty(unclusteredLayerId, 'circle-radius', 30)
          map.setPaintProperty(unclusteredLayerId, 'circle-opacity', 1)
          map.setPaintProperty(unclusteredLayerId, 'circle-stroke-width', 5)
          map.setPaintProperty(unclusteredLayerId, 'circle-stroke-color', '#FFFFFF')
          map.setLayoutProperty(unclusteredLayerId, 'visibility', 'visible')
          console.log('✅ Applied aggressive debug styling to force marker visibility')
          console.log('🔍 Markers should now be bright red circles with white borders')
        } else {
          console.log('❌ Unclustered layer not found!')
          console.log('🔍 Available layers:', map.getStyle().layers?.map(l => l.id))
        }
              } else {
                console.log('Map source not found!')
              }
              console.log('=== END DEBUG ===')
            }
          }}
          className="absolute bottom-24 right-6 z-40 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 focus:outline-none text-xs font-bold"
        >
          DEBUG
        </button>

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

        {/* Mobile-Optimized Selected Farm Card */}
        {selectedFarm && !showResults && (
          <div className="absolute bottom-4 left-4 right-4 z-40 bg-background-canvas/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border-default/20 p-4 sm:p-4 animate-slide-in-up">
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
