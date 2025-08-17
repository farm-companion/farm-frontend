import type { FarmShop } from '@/types/farm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClaimForm from '@/components/ClaimForm'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
export const dynamic = 'force-dynamic'

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const farms = await readFarms()
  const shop = farms.find((f) => f.slug === slug)
  
  if (!shop) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <Link href={`/shop/${slug}`} className="text-sm underline hover:no-underline">
        ← Back to {shop.name}
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">Claim {shop.name}</h1>
        <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
          {shop.location.address}, {shop.location.county} {shop.location.postcode}
        </p>
      </header>

      <div className="mt-8">
        <ClaimForm shop={shop} />
      </div>
    </main>
  )
}

async function readFarms(): Promise<FarmShop[]> {
  const res = await fetch(`${site}/data/farms.uk.json`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Failed to load farms.uk.json')
  return (await res.json()) as FarmShop[]
}
