'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map, Marker } from 'maplibre-gl'
import type { FarmShop } from '@/types/farm'

const styleUrl =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])

  // 1) Start the map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [-2.5, 54.5], // UK-ish
      zoom: 5
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

    mapRef.current = map
    return () => map.remove()
  }, [])

  // 2) Fetch farms and add markers
  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch('/data/farms.uk.json', { cache: 'no-store' })
      const farms: FarmShop[] = await res.json()
      if (cancelled || !mapRef.current) return

      // clear any existing markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      for (const f of farms) {
        // simple round marker with accessible title
        const el = document.createElement('button')
        el.className =
          'group size-4 rounded-full bg-[#00C2B2] ring-2 ring-white shadow hover:scale-110 transition'
        el.title = f.name

        const popup = new maplibregl.Popup({ offset: 12 })
          .setHTML(`
            <div style="font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
              <strong style="font-size:14px;">${escapeHtml(f.name)}</strong><br/>
              <span style="color:#555">${escapeHtml(f.location.address)}</span><br/>
              <small>${escapeHtml(f.location.county)} • ${escapeHtml(f.location.postcode)}</small><br/>
            </div>
          `)

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([f.location.lng, f.location.lat])
          .setPopup(popup)
          .addTo(mapRef.current)

        markersRef.current.push(marker)
      }
    }
    load()
    return () => {
      cancelled = true
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
    }
  }, [])

  return (
    <main className="w-screen h-[100vh]">
      <div ref={mapContainer} className="w-full h-full" />
    </main>
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
