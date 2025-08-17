import type { FarmShop } from '@/types/farm'
import { notFound } from 'next/navigation'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
export const revalidate = 3600

export default async function CountyPage({ params }: { params: { slug: string } }) {
  const farms = await readFarms()
  const countyName = unslugify(params.slug, farms)
  if (!countyName) return notFound()
  const list = farms
    .filter(f => f.location?.county && slugify(f.location.county) === params.slug)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <a href="/counties" className="text-sm underline hover:no-underline">← All counties</a>
      <h1 className="mt-2 text-3xl font-semibold">{countyName}</h1>
      <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
        {list.length} farm shop{list.length === 1 ? '' : 's'} listed.
      </p>

      <ul className="mt-6 divide-y rounded border dark:divide-gray-700 dark:border-gray-700">
        {list.map(f => (
          <li key={f.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-4">
              <a className="font-medium hover:underline" href={`/shop/${f.slug}`}>{f.name}</a>
              <span className="text-xs text-gray-600 dark:text-[#E4E2DD]/70">{f.location.postcode}</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-[#E4E2DD]/80">{f.location.address}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export async function generateStaticParams() {
  const farms = await readFarms()
  const slugs = Array.from(new Set(
    farms
      .filter(f => f.location?.county)
      .map(f => slugify(f.location.county))
  ))
  return slugs.map(slug => ({ slug }))
}

async function readFarms(): Promise<FarmShop[]> {
  const res = await fetch(`${site}/data/farms.uk.json`, { next: { revalidate } })
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

function unslugify(slug: string, farms: FarmShop[]) {
  const match = farms.find(f => f.location?.county && slugify(f.location.county) === slug)
  return match?.location?.county ?? null
}
