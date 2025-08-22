'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Produce } from '@/data/produce'

export default function ProduceCard({ p, badge }: { p: Pick<Produce,'slug'|'name'>, badge?: string }) {
  return (
    <Link
      href={`/seasonal/${p.slug}`}
      className="group block rounded-2xl border border-border-default/30 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      aria-label={`Open seasonal guide for ${p.name}`}
    >
      <div className="p-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-heading">{p.name}</h3>
          <p className="text-sm text-text-muted mt-1">Peak season for flavour and nutrition</p>
          <span className="inline-flex mt-3 items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1">
            {badge ?? 'In Season'}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-primary transition-colors" />
      </div>
    </Link>
  )
}
