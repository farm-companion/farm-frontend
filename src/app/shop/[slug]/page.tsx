import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { FarmShop } from '@/types/farm'
import { ObfuscatedEmail, ObfuscatedPhone } from '@/components/ObfuscatedContact'

async function readFarms(): Promise<FarmShop[]> {
  const file = path.join(process.cwd(), 'public', 'data', 'farms.uk.json')
  const raw = await fs.readFile(file, 'utf8')
  return JSON.parse(raw) as FarmShop[]
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const farms = await readFarms()
  const shop = farms.find((f) => f.slug === params.slug)
  if (!shop) return { title: 'Farm shop not found' }
  return {
    title: `${shop.name} · Farm Companion`,
    description: `${shop.location.address}, ${shop.location.county} ${shop.location.postcode}`,
  }
}

export default async function ShopPage({ params }: { params: { slug: string } }) {
  const farms = await readFarms()
  const shop = farms.find((f) => f.slug === params.slug)
  if (!shop) notFound()

  const { name, location, contact, offerings, verified } = shop
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat},${location.lng}`

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <a href="/map" className="text-sm underline hover:no-underline">← Back to map</a>

      <header className="mt-3 flex items-start justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        {verified ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
            Verified
          </span>
        ) : null}
      </header>

      <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
        {location.address}, {location.county} {location.postcode}
      </p>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contact?.phone && <ObfuscatedPhone phone={contact.phone} />}
        {contact?.email && <ObfuscatedEmail email={contact.email} />}
        {contact?.website && (
          <a
            className="rounded border px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1E1F23]"
            href={contact.website}
            target="_blank"
            rel="nofollow ugc noopener noreferrer"
          >
            🌐 Website
          </a>
        )}
        <a
          className="rounded bg-[#00C2B2] px-4 py-2 text-[#121D2B] font-medium hover:brightness-95
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4FF4F]"
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
        >
          🧭 Directions (OpenStreetMap)
        </a>
      </section>

      {offerings && offerings.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">What they offer</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {offerings.map((o) => (
              <li key={o} className="rounded-full border px-3 py-1 text-sm">
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
