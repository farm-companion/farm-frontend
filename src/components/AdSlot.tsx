'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

type Props = {
  slot?: string
  className?: string
}

export default function AdSlot({ slot, className }: Props) {
  const elRef = useRef<HTMLModElement | null>(null)
  const [consented, setConsented] = useState(false)

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const slotId = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || '0000000000'
  const isTest = (process.env.NEXT_PUBLIC_ADSENSE_TEST || '').toLowerCase() === 'on'

  // Listen for stored consent and live updates
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fc_consent') : null
    if (saved === 'granted') setConsented(true)

    const onEvt = (e: Event) => {
      const detail = (e as CustomEvent<'granted' | 'denied'>).detail
      if (detail === 'granted') setConsented(true)
    }
    window.addEventListener('fc:consent', onEvt as EventListener)
    return () => window.removeEventListener('fc:consent', onEvt as EventListener)
  }, [])

  // Inject the AdSense script lazily if needed (on consent)
  useEffect(() => {
    if (!consented || !client) return
    const already = document.querySelector('script[data-adsbygoogle-client]')
    if (!already) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
      s.setAttribute('data-adsbygoogle-client', client)
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }
  }, [consented, client])

  // Ask AdSense to render the slot (after consent + script present)
  useEffect(() => {
    if (!consented || !client || !elRef.current) return
    // Wait a tick to ensure script has executed
    const id = window.setTimeout(() => {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }, 50)
    return () => window.clearTimeout(id)
  }, [consented, client])

  // Hide container entirely until consent so nothing reserves space
  if (!consented || !client) return null

  return (
    <ins
      ref={elRef as any}
      className={`adsbygoogle block ${className || ''}`}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...(isTest ? { 'data-adtest': 'on' } : {})}
    />
  )
}
