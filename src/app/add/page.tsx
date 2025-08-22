'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import PhotoSubmissionForm from '@/components/PhotoSubmissionForm'

type Hours = { day: 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'; open?: string; close?: string }
type FarmForm = {
  name: string
  address: string
  county: string
  postcode: string
  lat?: string
  lng?: string
  website?: string
  email?: string
  phone?: string
  offerings?: string
  story?: string
}

const DAYS: Hours['day'][] = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function AddFarmPage() {
  const [form, setForm] = useState<FarmForm>({ name: '', address: '', county: '', postcode: '' })
  const [hours, setHours] = useState<Hours[]>(DAYS.map(d => ({ day: d })))
  const [touched, setTouched] = useState(false)
  // Hydration-safe flags/values
  const [draftId, setDraftId] = useState<string | null>(null)
  const [updatedAtClient, setUpdatedAtClient] = useState<string | null>(null)
  // Anti-spam
  const [hp, setHp] = useState('')                  // honeypot input (should stay empty)
  const startedAtRef = useRef<number | null>(null)  // when the user opened the page
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function onChange<K extends keyof FarmForm>(key: K) {
    return (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  function onHoursChange(day: Hours['day'], key: 'open'|'close') {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setHours(prev => prev.map(h => h.day === day ? { ...h, [key]: e.target.value } : h))
  }

  const slug = useMemo(() => slugify(form.name), [form.name])

  useEffect(() => {
    setDraftId(genId())
    setUpdatedAtClient(new Date().toISOString())
    // record start time (used to block instant bot submissions)
    if (typeof performance !== 'undefined') startedAtRef.current = performance.now()
  }, [])

  const json = useMemo(() => {
    // Use stable placeholders during SSR/first client render.
    const id = draftId ?? 'farm_pending0000'
    const lat = toNum(form.lat)
    const lng = toNum(form.lng)
    const offerings = csvToArray(form.offerings)
    const now = updatedAtClient ?? '1970-01-01T00:00:00.000Z'

    const hoursClean = hours
      .filter(h => (h.open && h.close))
      .map(h => ({ day: h.day, open: h.open!, close: h.close! }))

    const obj = {
      id,
      name: form.name.trim(),
      slug,
      location: {
        lat: isFiniteNum(lat) ? lat : 54.5,      // UK fallback centre
        lng: isFiniteNum(lng) ? lng : -2.5,
        address: form.address.trim(),
        county: form.county.trim(),
        postcode: form.postcode.trim()
      },
      contact: {
        website: urlish(form.website),
        email: emailish(form.email),
        phone: form.phone?.trim() || undefined
      },
      hours: hoursClean,
      offerings,
      story: (form.story || '').trim() || undefined,
      images: [],
      verified: false,
              verification: { method: 'owner_claim', timestamp: now },
        seasonal: [],
        updatedAt: now
    }

    // Remove undefineds for cleanliness
    return JSON.parse(JSON.stringify(obj))
  }, [form, hours, slug, draftId, updatedAtClient])

  const valid = useMemo(() => {
    // simple requireds; full AJV validation will happen server-side later
    return Boolean(form.name && form.address && form.county && form.postcode)
  }, [form])

  function handleDownload() {
    setTouched(true)
    setErrorMsg(null)

    // 1) Honeypot — bots often fill every field; humans never see this
    if (hp.trim() !== '') {
      setErrorMsg('Submission blocked.')
      return
    }
    // 2) Time gate — require at least 5s on page before download
    const now = typeof performance !== 'undefined' ? performance.now() : 0
    const elapsed = startedAtRef.current ? now - startedAtRef.current : 0
    if (elapsed < 5000) {
      setErrorMsg('Please take a few seconds to fill in the form before downloading.')
      return
    }
    if (!valid) return
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${slug || 'farm-shop'}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Add a Farm Shop</h1>
      <p className="mt-2 text-gray-700 dark:text-[#E4E2DD]/80">
        Fill in the essentials. You can download your listing as JSON and send it to us, or we’ll add a submit button later.
      </p>

      <section className="mt-8 grid gap-6">
        {/* Honeypot (hidden from real users & assistive tech) */}
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label>
            If you are human, leave this field empty
            <input
              tabIndex={-1}
              autoComplete="off"
              className="border px-2 py-1"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </label>
        </div>
        <div className="grid gap-3">
          <label className="block text-sm font-medium">Farm shop name *</label>
          <input className="w-full rounded border px-3 py-2" value={form.name} onChange={onChange('name')} />
          {touched && !form.name && <p className="text-sm text-red-600">Name is required.</p>}
        </div>

        <div className="grid gap-3">
          <label className="block text-sm font-medium">Address *</label>
          <input className="w-full rounded border px-3 py-2" value={form.address} onChange={onChange('address')} />
          {touched && !form.address && <p className="text-sm text-red-600">Address is required.</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="block text-sm font-medium">County *</label>
            <input className="w-full rounded border px-3 py-2" value={form.county} onChange={onChange('county')} />
            {touched && !form.county && <p className="text-sm text-red-600">County is required.</p>}
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Postcode *</label>
            <input className="w-full rounded border px-3 py-2" value={form.postcode} onChange={onChange('postcode')} />
            {touched && !form.postcode && <p className="text-sm text-red-600">Postcode is required.</p>}
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Slug (auto)</label>
            <input className="w-full rounded border px-3 py-2 bg-gray-50 dark:bg-[#1E1F23]" value={slug} readOnly />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Latitude (optional)</label>
            <input className="w-full rounded border px-3 py-2" value={form.lat || ''} onChange={onChange('lat')} placeholder="e.g. 51.507" />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Longitude (optional)</label>
            <input className="w-full rounded border px-3 py-2" value={form.lng || ''} onChange={onChange('lng')} placeholder="-0.127" />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Offerings (comma-separated)</label>
            <input className="w-full rounded border px-3 py-2" value={form.offerings || ''} onChange={onChange('offerings')} placeholder="Apples, Cheese, Eggs" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Website</label>
            <input className="w-full rounded border px-3 py-2" value={form.website || ''} onChange={onChange('website')} placeholder="https://…" />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Email</label>
            <input className="w-full rounded border px-3 py-2" value={form.email || ''} onChange={onChange('email')} placeholder="hello@example.org" />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium">Phone</label>
            <input className="w-full rounded border px-3 py-2" value={form.phone || ''} onChange={onChange('phone')} placeholder="+44 …" />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="block text-sm font-medium">Opening Hours (24h, optional)</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {hours.map(h => (
              <div key={h.day} className="flex items-center gap-2">
                <span className="w-10 text-sm">{h.day}</span>
                <input className="w-24 rounded border px-2 py-1" placeholder="09:00" value={h.open || ''} onChange={onHoursChange(h.day, 'open')} />
                <span className="text-sm">–</span>
                <input className="w-24 rounded border px-2 py-1" placeholder="17:00" value={h.close || ''} onChange={onHoursChange(h.day, 'close')} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="block text-sm font-medium">Farm story (optional)</label>
          <textarea className="min-h-[100px] w-full rounded border px-3 py-2" value={form.story || ''} onChange={onChange('story')} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setTouched(true)}
            className="rounded border px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1E1F23]"
          >
            Preview JSON
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded bg-[#00C2B2] px-4 py-2 font-medium text-[#121D2B] hover:brightness-95
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4FF4F]"
          >
            Download JSON
          </button>
          {errorMsg && <span className="text-sm text-red-600">{errorMsg}</span>}
          {!valid && touched && (
            <span className="text-sm text-red-600">Please complete all required fields marked *</span>
          )}
        </div>

        {/* Live JSON preview */}
        <details className="rounded-lg border bg-gray-50 p-4 dark:bg-[#1E1F23]">
          <summary className="cursor-pointer select-none text-sm font-medium">Preview</summary>
          <pre className="mt-3 overflow-auto text-xs leading-relaxed">
{JSON.stringify(json, null, 2)}
          </pre>
        </details>

        <p className="text-xs text-gray-600 dark:text-[#E4E2DD]/70">
          By submitting, you confirm the details are accurate and you have permission to share them.
        </p>
      </section>

      {/* Photo Submission Section */}
      {form.name && (
        <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold mb-4">Add Photos (Optional)</h2>
          <p className="text-gray-700 dark:text-[#E4E2DD]/80 mb-6">
            Help showcase your farm shop by adding photos. These will be reviewed before being added to your listing.
          </p>
          <PhotoSubmissionForm 
            farmSlug={slug}
            farmName={form.name}
            onSuccess={() => {
              // Show success message or update form state
              console.log('Photo submitted successfully for new farm shop')
            }}
          />
        </section>
      )}
    </main>
  )
}

/* -------- helpers (inline so it’s beginner-friendly) -------- */

function genId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random()*chars.length)]
  return 'farm_' + s
}

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'')
}

function toNum(s?: string) {
  if (!s) return NaN
  const n = Number(s)
  return Number.isFinite(n) ? n : NaN
}

function isFiniteNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

function csvToArray(s?: string) {
  if (!s) return []
  return s.split(',').map(x => x.trim()).filter(Boolean)
}

function urlish(s?: string) {
  if (!s) return undefined
  const v = s.trim()
  if (!v) return undefined
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

function emailish(s?: string) {
  if (!s) return undefined
  const v = s.trim()
  if (!v) return undefined
  return /.+@.+\..+/.test(v) ? v : undefined
}
