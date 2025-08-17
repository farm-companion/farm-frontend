import type { MetadataRoute } from 'next'
import fs from 'node:fs/promises'
import path from 'node:path'

type FarmShop = {
  slug: string
  name: string
  location: { county: string }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/+$/, '')
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`,            changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/map`,         changeFrequency: 'daily',  priority: 0.9 },
    { url: `${base}/counties`,    changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/seasonal`,    changeFrequency: 'daily',  priority: 0.6 },
    { url: `${base}/about`,       changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`,     changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`,       changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Read farms JSON from /public so sitemap builds without external fetch
  let farms: FarmShop[] = []
  try {
    const file = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
    const raw = await fs.readFile(file, 'utf-8')
    farms = JSON.parse(raw) as FarmShop[]
  } catch {
    // ignore if missing in local dev
  }

  // Helper
  const slugify = (s: string) =>
    s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  // Add shop pages
  for (const f of farms) {
    if (f?.slug) {
      entries.push({
        url: `${base}/shop/${encodeURIComponent(f.slug)}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Add county pages
  const counties = new Set<string>()
  for (const f of farms) {
    const c = f?.location?.county
    if (c) counties.add(slugify(c))
  }
  for (const c of counties) {
    entries.push({
      url: `${base}/counties/${c}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  return entries
}
