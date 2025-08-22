import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PRODUCE } from '@/data/produce'
import Link from 'next/link'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import ProduceAnalytics from '@/components/ProduceAnalytics'

// Revalidate daily
export const revalidate = 86400

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export async function generateStaticParams() {
  return PRODUCE.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = PRODUCE.find(x => x.slug === slug)
  if (!p) return {}
  const img = p.images[0]?.src
  const title = `${p.name} — Seasonal Guide`
  const desc = `When ${p.name} is in season, how to choose, store, and cook it.`
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: img ? [{ url: img, width: 1200, height: 630 }] : undefined },
    twitter: { card: 'summary_large_image', title, description: desc, images: img ? [img] : undefined },
  }
}

export default async function ProducePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = PRODUCE.find(x => x.slug === slug)
  if (!p) notFound()

  const now = new Date()
  const m = now.getMonth() + 1
  const inSeason = p.monthsInSeason.includes(m)
  const isPeak = p.peakMonths?.includes(m)

  // JSON-LD (Product/Food with nutrition + season)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',              // or "Food"
    name: p.name,
    image: p.images.map(i => i.src),
    description: `Seasonal guide for ${p.name}.`,
    additionalProperty: [{
      '@type': 'PropertyValue',
      name: 'Seasonality',
      value: `In season: ${p.monthsInSeason.map(n => monthNames[n-1]).join(', ')}`
    }],
    nutrition: p.nutritionPer100g ? {
      '@type': 'NutritionInformation',
      servingSize: '100 g',
      calories: `${p.nutritionPer100g.kcal} kcal`,
      proteinContent: `${p.nutritionPer100g.protein} g`,
      carbohydrateContent: `${p.nutritionPer100g.carbs} g`,
      sugarContent: p.nutritionPer100g.sugars ? `${p.nutritionPer100g.sugars} g` : undefined,
      fiberContent: p.nutritionPer100g.fiber ? `${p.nutritionPer100g.fiber} g` : undefined,
      fatContent: p.nutritionPer100g.fat ? `${p.nutritionPer100g.fat} g` : undefined,
    } : undefined
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProduceAnalytics slug={p.slug} name={p.name} />

      {/* HERO */}
      <section className="rounded-3xl overflow-hidden relative border border-border-default/30 shadow-sm">
        <div className="relative h-64 sm:h-80">
          <Image
            src={p.images[0]?.src ?? '/images/placeholder.jpg'}
            alt={p.images[0]?.alt ?? `${p.name} hero image`}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4">
            <h1 className="text-white text-3xl font-semibold">{p.name}</h1>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${inSeason ? 'bg-emerald-200/90 text-emerald-900' : 'bg-gray-200/90 text-gray-800'}`}>
                {inSeason ? 'In Season Now' : 'Out of Season'}
              </span>
              {isPeak && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-200/90 text-amber-900 animate-pulse">
                  Best This Month
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href={`/map?q=${encodeURIComponent(p.name)}`}
          className="flex items-center justify-center gap-2 rounded-xl border bg-white py-3 shadow-sm hover:shadow-md transition motion-reduce:transition-none"
        >
          <MapPin className="w-4 h-4" /> Find at farm shops
        </Link>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(p.name + ' recipes')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white py-3 shadow-sm hover:shadow-md transition motion-reduce:transition-none"
        >
          <ExternalLink className="w-4 h-4" /> Recipes
        </a>
        <a
          href={`https://www.google.com/search?q=how+to+store+${encodeURIComponent(p.name)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border bg-white py-3 shadow-sm hover:shadow-md transition motion-reduce:transition-none"
        >
          <Clock className="w-4 h-4" /> Storage & shelf life
        </a>
      </section>

      {/* SEASONALITY BAR */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Seasonality</h2>
        <div className="mt-3 grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const month = i + 1
            const active = p.monthsInSeason.includes(month)
            const peak = p.peakMonths?.includes(month)
            const now = month === m
            return (
              <div key={month} className="text-center">
                <div
                  className={[
                    'h-8 rounded-lg border text-xs flex items-center justify-center',
                    active ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-500',
                    peak ? 'ring-2 ring-emerald-400' : '',
                    now ? 'outline outline-2 outline-offset-2 outline-brand-primary/60' : '',
                  ].join(' ')}
                  aria-label={`${monthNames[i]} ${active ? 'in season' : 'out of season'}${peak ? ', peak' : ''}${now ? ', current month' : ''}`}
                >
                  {monthNames[i]}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* IMAGE GRID */}
      {p.images.slice(1).length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {p.images.slice(1).map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-xl border">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INFO STRIPS */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {p.selectionTips?.length ? (
          <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition motion-reduce:transition-none">
            <h3 className="font-semibold">How to Choose</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
              {p.selectionTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        ) : null}

        {p.storageTips?.length ? (
          <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition motion-reduce:transition-none">
            <h3 className="font-semibold">Storage Tips</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
              {p.storageTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        ) : null}

        {p.prepIdeas?.length ? (
          <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition motion-reduce:transition-none">
            <h3 className="font-semibold">Prep & Use</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
              {p.prepIdeas.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        ) : null}
      </section>

      {/* NUTRITION */}
      {p.nutritionPer100g && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Nutrition (per 100g)</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[420px] w-full text-sm border rounded-xl overflow-hidden">
              <tbody>
                {Object.entries(p.nutritionPer100g).map(([k,v]) => (
                  <tr key={k} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-medium capitalize bg-gray-50">{k.replace(/([A-Z])/g,' $1')}</td>
                    <td className="px-3 py-2">{v}{k==='kcal' ? '' : k==='protein'||k==='carbs'||k==='fiber'||k==='fat'||k==='sugars' ? ' g' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RECIPE CHIPS */}
      {p.recipeChips && p.recipeChips.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recipe Inspiration</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {p.recipeChips.map((recipe, index) => (
              <a
                key={index}
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition motion-reduce:transition-none group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">External recipe</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-10">
        <Link
          href={`/map?q=${encodeURIComponent(p.name)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary text-white px-5 py-3 font-semibold hover:bg-brand-primary/90 transition motion-reduce:transition-none"
        >
          <MapPin className="w-4 h-4" /> Find {p.name.toLowerCase()} near you
        </Link>
      </section>

      <div className="h-12" />
    </main>
  )
}
