'use client'

import { useEffect, useMemo, useState } from 'react'

type SeasonItem = { month: number; inSeason: string[]; notes: string }
type SeasonItemWithProv = SeasonItem & { source?: string; sourceName?: string; updatedAt?: string }

export default function SeasonalPage() {
  const [data, setData] = useState<SeasonItemWithProv[]>([])
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

  useEffect(() => {
    fetch('/data/seasons.uk.json', { cache: 'no-store' })
      .then(r => r.json())
      .then((json: SeasonItemWithProv[]) => setData(json))
      .catch(() => setData([]))
  }, [])

  const current = useMemo(
    () => data.find(d => d.month === month),
    [data, month]
  )

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">What’s in season</h1>
      <p className="mt-2 text-gray-700">Pick a month to see UK produce that’s at its best.</p>

      {/* Month selector */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="month" className="text-sm">Month</label>
        <select
          id="month"
          className="rounded border px-3 py-2"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
        >
          {months.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      <section className="mt-8">
        {!current ? (
          <p className="text-gray-600">Loading…</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">{current.notes}</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {current.inSeason.map(item => (
                <li key={item} className="rounded-lg border px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            {current.source && (
              <p className="mt-4 text-xs text-gray-600">
                Source: <a className="underline" href={current.source} target="_blank" rel="noreferrer">
                  {current.sourceName || current.source}
                </a>
                {current.updatedAt ? <> · Updated {new Date(current.updatedAt).toLocaleDateString('en-GB')}</> : null}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  )
}
