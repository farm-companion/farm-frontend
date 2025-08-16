import type { MetadataRoute } from 'next'
import fs from 'node:fs/promises'
import path from 'node:path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  // Core pages
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`,           changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/map`,        changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/seasonal`,   changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/about`,      changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/add`,        changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`,    changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms`,      changeFrequency: 'yearly',  priority: 0.2 },
  ]

  // Farm shops (read at build/request time)
  try {
    const file = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
    const raw = await fs.readFile(file, 'utf8')
    const farms: Array<{ slug: string; updatedAt?: string }> = JSON.parse(raw)
    for (const f of farms) {
      entries.push({
        url: `${base}/shop/${encodeURIComponent(f.slug)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastModified: f.updatedAt ? new Date(f.updatedAt) : undefined,
      })
    }
  } catch {
    // If data missing in dev, just return the core pages.
  }

  return entries
}
