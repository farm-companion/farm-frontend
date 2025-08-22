'use client'

import { useEffect } from 'react'
import { trackProduceView } from '@/lib/analytics'

interface ProduceAnalyticsProps {
  slug: string
  name: string
}

export default function ProduceAnalytics({ slug, name }: ProduceAnalyticsProps) {
  useEffect(() => {
    // Track produce page view on mount
    trackProduceView(slug, name)
  }, [slug, name])

  // This component doesn't render anything
  return null
}
