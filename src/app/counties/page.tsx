import type { FarmShop } from '@/types/farm'
import Link from 'next/link'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export const dynamic = 'force-dynamic' // Make this dynamic to avoid build-time data fetching

export default async function CountiesIndex() {
  const farms = await readFarms()
  const byCounty = new Map<string, number>()
  for (const f of farms) {
    const c = f.location?.county?.trim()
    if (!c) continue
    byCounty.set(c, (byCounty.get(c) || 0) + 1)
  }
  const counties = Array.from(byCounty.entries())
    .map(([name, count]) => ({ name, count, slug: slugify(name) }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Farm shops by county</h1>
      <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
        Browse all counties in England, Scotland, Wales and Northern Ireland.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {counties.map(c => (
          <li key={c.slug}>
            <Link
              href={`/counties/${c.slug}`}
              className="flex items-center justify-between rounded border px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1E1F23]"
            >
              <span>{c.name}</span>
              <span className="text-xs text-gray-600 dark:text-[#E4E2DD]/70">{c.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

async function readFarms(): Promise<FarmShop[]> {
  const res = await fetch(`${site}/data/farms.uk.json`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to load farms.uk.json')
  return (await res.json()) as FarmShop[]
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
