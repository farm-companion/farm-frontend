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
  description: 'Discover 1,300+ authentic UK farm shops with fresh local produce, seasonal guides, and verified farm information. Find farm shops near you with our interactive map.',
  keywords: ['farm shops', 'UK farm shops', 'local produce', 'fresh food', 'farm directory', 'farm shop near me', 'local farms', 'seasonal produce', 'farm fresh', 'UK farms', 'farm shop directory', 'local food', 'farm to table'],
  authors: [{ name: 'Farm Companion' }],
  creator: 'Farm Companion',
  publisher: 'Farm Companion',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Farm Companion',
    title: 'Farm Companion — UK farm shops directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    images: [
      { 
        url: '/og.jpg', 
        width: 1200, 
        height: 630, 
        alt: 'Farm Companion - UK farm shops directory',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Companion — UK farm shops directory',
    description: 'Find trusted farm shops near you with verified information and the freshest local produce.',
    images: ['/og.jpg'],
    creator: '@farmcompanion',
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'theme-color': '#00C2B2',
    'color-scheme': 'light dark',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/satoshi-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Font declarations */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Theme detection script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Listen for system theme changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    if (!localStorage.getItem('theme')) {
                      if (e.matches) {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                    }
                  });
                } catch (e) {
                  console.warn('Theme detection failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background-canvas text-text-body antialiased">
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="skip-link"
        >
          Skip to main content
        </a>

        {/* Header */}
        <Header />

        {/* Page content */}
        <main id="main" className="flex-1">{children}</main>

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
