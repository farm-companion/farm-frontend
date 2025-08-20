import Link from 'next/link'
import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic' // Make this dynamic to avoid build-time data fetching

interface County {
  name: string
  slug: string
  region: string
}

export default async function CountiesIndex() {
  const counties = await readCounties()
  const farmCounts = await getFarmCounts()
  
  // Merge county data with farm counts
  const countiesWithCounts = counties.map(county => ({
    ...county,
    count: farmCounts.get(county.name) || 0
  })).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Farm shops by county</h1>
      <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
        Browse all counties in England, Scotland, Wales and Northern Ireland.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {countiesWithCounts.map(c => (
          <li key={c.slug}>
            <Link
              href={`/counties/${c.slug}`}
              className="flex items-center justify-between rounded border px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1E1F23]"
            >
              <div>
                <span className="font-medium">{c.name}</span>
                <div className="text-xs text-gray-500 dark:text-[#E4E2DD]/60">{c.region}</div>
              </div>
              <span className="text-xs text-gray-600 dark:text-[#E4E2DD]/70">{c.count} farms</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

async function readCounties(): Promise<County[]> {
  const file = path.join(process.cwd(), 'public', 'data', 'counties.uk.json')
  const raw = await fs.readFile(file, 'utf8')
  return JSON.parse(raw) as County[]
}

async function getFarmCounts(): Promise<Map<string, number>> {
  const farms = await readFarms()
  const byCounty = new Map<string, number>()
  
  for (const farm of farms) {
    const county = farm.location?.county?.trim()
    if (county) {
      byCounty.set(county, (byCounty.get(county) || 0) + 1)
    }
  }
  
  return byCounty
}

async function readFarms(): Promise<any[]> {
  const file = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
  const raw = await fs.readFile(file, 'utf8')
  return JSON.parse(raw)
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
