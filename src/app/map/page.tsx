'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import type { FarmShop } from '@/types/farm'
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
  // No markers array needed with clustering
  const farmsRef = useRef<FarmShop[] | null>(null)
  const [farms, setFarms] = useState<FarmShop[] | null>(null)
  const [query, setQuery] = useState('')
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string>('') // '' = All

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    // Defer to the next frame so the container has a real size after navigation
    rafRef.current = requestAnimationFrame(() => {
      if (!mapContainer.current || mapRef.current) return

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [-2.5, 54.5], // UK
        zoom: 5
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')
      // "Near me" — ask for permission and pan to the user's location.
      const geo = new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
        showUserLocation: true,
        fitBoundsOptions: { maxZoom: 13 }
      })
      map.addControl(geo, 'top-right')
      geo.on('geolocate', (e: any) => {
        if (e && e.coords) {
          setUserLoc({ lat: e.coords.latitude, lng: e.coords.longitude })
        }
      })

      // When style/tiles are ready, resize and add a clustered GeoJSON source
      map.once('load', async () => {
        map.resize()
        try {
          const res = await fetch('/data/farms.uk.json', { cache: 'no-store' })
          const farms: FarmShop[] = await res.json()
          farmsRef.current = farms
          setFarms(farms)
          const features = toFeatures(farms)

          map.addSource('farms', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features } as any,
            cluster: true,
            clusterRadius: 50,
            clusterMaxZoom: 14,
          } as any)

          // Cluster circles
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'farms',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#00C2B2',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                12,   10, 16,
                30,   20
              ]
            }
          } as any)

          // Cluster count
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'farms',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': ['to-string', ['get', 'point_count']],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-size': 12
            },
            paint: { 'text-color': '#121D2B' }
          } as any)

          // Unclustered points
          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'farms',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#00C2B2',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 2,
              'circle-radius': 6
            }
          } as any)

          // Click cluster to zoom in
          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
            const clusterId = features[0].properties && (features[0].properties as any).cluster_id
            ;(map.getSource('farms') as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err) return
              const [lng, lat] = (features[0].geometry as any).coordinates
              map.easeTo({ center: [lng, lat], zoom })
            })
          })

          // Click unclustered point to show a popup with a details link
          map.on('click', 'unclustered-point', (e) => {
            const f = e.features && e.features[0]
            if (!f) return
            const p = f.properties as any
            const coords = (f.geometry as any).coordinates
            const html = `
              <div style="font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:260px;">
                <strong style="font-size:14px;display:block;margin-bottom:2px;">${escapeHtml(p.name)}</strong>
                <span style="color:#555;display:block;">${escapeHtml(p.address)}</span>
                <small style="color:#666;">${escapeHtml(p.county)} • ${escapeHtml(p.postcode)}</small>
                <div style="margin-top:8px;">
                  <a
                    href="/shop/${encodeURIComponent(p.slug)}"
                    style="display:inline-block;padding:6px 10px;border-radius:8px;background:#00C2B2;color:#121D2B;text-decoration:none;font-weight:600;"
                    aria-label="View details for ${escapeHtml(p.name)}"
                  >View details</a>
                </div>
              </div>
            `
            new maplibregl.Popup({ offset: 12 }).setLngLat(coords).setHTML(html).addTo(map)
          })

          // Pointer cursor on interactive layers
          map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer')
          map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '')
          map.on('mouseenter', 'unclustered-point', () => map.getCanvas().style.cursor = 'pointer')
          map.on('mouseleave', 'unclustered-point', () => map.getCanvas().style.cursor = '')
        } catch (e) {
          console.error('Failed to load farms.uk.json', e)
        }
      })

      // Watch container size; force map to recalc when it changes
      roRef.current = new ResizeObserver(() => map.resize())
      roRef.current.observe(mapContainer.current!)

      // Extra safety: when page becomes visible after nav, resize
      const handleShow = () => map.resize()
      window.addEventListener('pageshow', handleShow)
      document.addEventListener('visibilitychange', handleShow)

      mapRef.current = map

      // Cleanup
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

  // List of counties (alphabetical) for filter chips
  const counties = useMemo(() => {
    if (!farms) return []
    const s = new Set<string>()
    for (const f of farms) {
      if (f.location?.county) s.add(f.location.county)
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [farms])

  // Compute filtered farms for the list and for the data source
  const filteredFarms = useMemo(() => {
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
    // If we have user's location, sort by nearest first
    if (userLoc) {
      return [...base].sort((a, b) => {
        const da = haversineMi(userLoc.lat, userLoc.lng, a.location.lat, a.location.lng)
        const db = haversineMi(userLoc.lat, userLoc.lng, b.location.lat, b.location.lng)
        return da - db
      })
    }
    return base
  }, [farms, query, selectedCounty, userLoc])

  // Update the clustered source whenever the filtered list changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const src = map.getSource('farms') as any
    if (!src) return
    src.setData({ type: 'FeatureCollection', features: toFeatures(filteredFarms) })
  }, [filteredFarms])

  // Fly to a farm and open a popup
  function flyToFarm(f: FarmShop) {
    const map = mapRef.current
    if (!map) return
    const coords: [number, number] = [f.location.lng, f.location.lat]
    map.easeTo({ center: coords, zoom: Math.max(map.getZoom(), 12) })
    const html = `
      <div style="font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:260px;">
        <strong style="font-size:14px;display:block;margin-bottom:2px;">${escapeHtml(f.name)}</strong>
        <span style="color:#555;display:block;">${escapeHtml(f.location.address)}</span>
        <small style="color:#666;">${escapeHtml(f.location.county)} • ${escapeHtml(f.location.postcode)}</small>
        <div style="margin-top:8px;">
          <a
            href="/shop/${encodeURIComponent(f.slug)}"
            style="display:inline-block;padding:6px 10px;border-radius:8px;background:#00C2B2;color:#121D2B;text-decoration:none;font-weight:600;"
            aria-label="View details for ${escapeHtml(f.name)}"
          >View details</a>
        </div>
      </div>
    `
    new maplibregl.Popup({ offset: 12 }).setLngLat(coords).setHTML(html).addTo(map)
  }

  return (
    <>
      {/* Give the map a guaranteed height; subtract header so it isn't hidden */}
      <main className="relative w-screen h-[calc(100vh-56px)] mt-14">
        {/* Search overlay */}
        <div className="pointer-events-auto absolute left-3 top-3 z-50">
          <label className="sr-only" htmlFor="map-search">Search farm shops</label>
          <input
            id="map-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, postcode, county…"
            className="w-[260px] rounded-lg border border-gray-300 bg-white/95 px-3 py-2 text-sm shadow
                       backdrop-blur placeholder:text-gray-500
                       dark:border-gray-600 dark:bg-[#1E1F23]/95 dark:text-[#E4E2DD]"
          />
        </div>
        {/* County selector (typeahead) */}
        <div className="pointer-events-auto absolute left-3 top-14 z-50 mt-2 flex items-center gap-2">
          <label htmlFor="county-select" className="sr-only">Filter by county</label>
          <input
            id="county-select"
            list="county-list"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            placeholder="Filter by county…"
            className="w-[260px] rounded-lg border border-gray-300 bg-white/95 px-3 py-2 text-sm shadow
                       backdrop-blur placeholder:text-gray-500
                       dark:border-gray-600 dark:bg-[#1E1F23]/95 dark:text-[#E4E2DD]"
          />
          <datalist id="county-list">
            <option value=""></option>
            {counties.map((c) => <option key={c} value={c} />)}
          </datalist>
          {selectedCounty && (
            <button
              type="button"
              onClick={() => setSelectedCounty('')}
              className="rounded border px-2 py-1 text-xs hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-[#1E1F23]"
              aria-label="Clear county filter"
            >
              Clear
            </button>
          )}
        </div>
        {/* Results list (live, compact) */}
        <div
          className="pointer-events-auto absolute left-3 top-28 z-50 mt-2 max-h-[40vh] w-[300px] overflow-auto
                     rounded-lg border bg-white/95 text-sm shadow backdrop-blur
                     dark:border-gray-600 dark:bg-[#121D2B]/95 dark:text-[#E4E2DD]"
          role="region"
          aria-label="Search results"
        >
          {filteredFarms.length === 0 ? (
            <div className="px-3 py-2 text-gray-600 dark:text-[#E4E2DD]/70">No results</div>
          ) : (
            <ul className="divide-y dark:divide-gray-700">
              {filteredFarms.slice(0, 20).map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => flyToFarm(f)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#1E1F23]"
                  >
                    <div className="font-medium">{f.name}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#E4E2DD]/70">
                      <span>{f.location.county} · {f.location.postcode}</span>
                      {userLoc && (
                        <span className="rounded-full border px-2 py-[1px] text-[11px] dark:border-gray-700">
                          {haversineMi(userLoc.lat, userLoc.lng, f.location.lat, f.location.lng).toFixed(1)} mi
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
              {filteredFarms.length > 20 && (
                <li className="px-3 py-2 text-xs text-gray-600 dark:text-[#E4E2DD]/70">
                  Showing first 20 of {filteredFarms.length}. Narrow your search to see more.
                </li>
              )}
            </ul>
          )}
        </div>
        <div ref={mapContainer} className="w-full h-full" />
      </main>

      {/* Sponsored section JUST above the footer (consent-aware) */}
      <section
        aria-label="Sponsored content"
        className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-6"
      >
        <div className="rounded-lg border bg-white p-2 sm:p-3 text-xs sm:text-sm shadow-sm
                        dark:border-gray-700 dark:bg-[#121D2B] dark:text-[#E4E2DD]">
          <div className="mb-1 text-[10px] uppercase tracking-wide opacity-70">Sponsored</div>
          <AdSlot />
        </div>
      </section>
    </>
  )
}

// tiny HTML escape to keep popups safe
function escapeHtml(s: string) {
  return s
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;')
}

// Convert farms to GeoJSON features
function toFeatures(farms: FarmShop[]) {
  return farms.map((f) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.location.lng, f.location.lat] },
    properties: {
      name: f.name,
      slug: f.slug,
      address: f.location.address,
      county: f.location.county,
      postcode: f.location.postcode,
    }
  }))
}

// Haversine distance (miles)
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
