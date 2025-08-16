'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map, Marker } from 'maplibre-gl'
import type { FarmShop } from '@/types/farm'

// Ensure this route is always rendered client-side
export const dynamic = 'force-dynamic'

const styleUrl =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty'

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const rafRef = useRef<number | null>(null)
  const roRef = useRef<ResizeObserver | null>(null)
  const markersRef = useRef<Marker[]>([])

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
      // "Near me" — ask for permission and pan to the user's location
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
          showUserLocation: true,
          fitBoundsOptions: { maxZoom: 13 }
        }),
        'top-right'
      )

      // When style/tiles are ready, resize and add markers
      map.once('load', async () => {
        map.resize()

        // clear any existing markers (safety)
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        // fetch farms and add markers
        try {
          const res = await fetch('/data/farms.uk.json', { cache: 'no-store' })
          const farms: FarmShop[] = await res.json()

          for (const f of farms) {
            const el = document.createElement('button')
            el.className =
              'group size-4 rounded-full bg-[#00C2B2] ring-2 ring-white shadow hover:scale-110 transition'
            el.title = f.name

            const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
              <div style="font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
                <strong style="font-size:14px;">${escapeHtml(f.name)}</strong><br/>
                <span style="color:#555">${escapeHtml(f.location.address)}</span><br/>
                <small>${escapeHtml(f.location.county)} • ${escapeHtml(f.location.postcode)}</small><br/>
              </div>
            `)

            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([f.location.lng, f.location.lat])
              .setPopup(popup)
              .addTo(map)

            markersRef.current.push(marker)
          }
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
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    // Give the map a guaranteed height; subtract header so it isn’t hidden
    <main className="w-screen h-[calc(100vh-56px)] mt-14">
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
