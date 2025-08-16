import './globals.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Farm Companion',
  description: 'The UK’s premium guide to real food, real people, and real places.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 rounded bg-black px-3 py-2 text-white"
        >
          Skip to content
        </a>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold">
              Farm Companion
            </Link>
            <ul className="flex gap-4 text-sm">
              <li><Link href="/map" className="hover:underline">Map</Link></li>
              <li><Link href="/seasonal" className="hover:underline">Seasonal</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/add" className="rounded bg-[#00C2B2] px-3 py-1.5 text-white hover:opacity-90">Add a Farm Shop</Link></li>
            </ul>
          </nav>
        </header>

        {/* Page content */}
        <main id="main">{children}</main>

        {/* Simple footer */}
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
            © {new Date().getFullYear()} Farm Companion · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
