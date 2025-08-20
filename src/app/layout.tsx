import './globals.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import ConsentBanner from '@/components/ConsentBanner'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Farm Companion',
    template: '%s · Farm Companion',
  },
  description: 'UK farm shops directory — LibreMaps, not Google',
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Farm Companion',
    title: 'Farm Companion — UK farm shops directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    images: [
      { url: '/og.jpg', width: 1200, height: 630, alt: 'Farm Companion' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Companion — UK farm shops directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    images: ['/og.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background-canvas text-text-body">
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="skip-link"
        >
          Skip to content
        </a>

        {/* Header */}
        <Header />

        {/* Page content */}
        <main id="main">{children}</main>

        {/* Consent */}
        <ConsentBanner />

        {/* Footer */}
        <Footer />

        {/* Vercel Analytics */}
        <Analytics />

      </body>
    </html>
  )
}
