import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farm Shop Map - Find Local Farms Near You',
  description: 'Interactive map of 1,300+ UK farm shops. Find farm shops near you with fresh local produce, seasonal guides, and verified farm information. Search by location, county, or postcode.',
  keywords: ['farm shop map', 'farm shops near me', 'UK farm shop finder', 'local farm map', 'farm shop directory', 'farm shop locator', 'farm shops by county'],
  openGraph: {
    title: 'Farm Shop Map - Find Local Farms Near You',
    description: 'Interactive map of 1,300+ UK farm shops. Find farm shops near you with fresh local produce and verified farm information.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm Shop Map - Find Local Farms Near You',
    description: 'Interactive map of 1,300+ UK farm shops. Find farm shops near you with fresh local produce and verified farm information.',
  },
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SEO: LocalBusiness collection structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'UK Farm Shops Directory',
    description: 'Comprehensive directory of 1,300+ UK farm shops with interactive map',
    numberOfItems: 1300,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'GroceryStore',
          name: 'UK Farm Shops Directory',
          description: 'Find farm shops near you with fresh local produce',
          url: process.env.NEXT_PUBLIC_SITE_URL + '/map'
        }
      }
    ]
  }

  return (
    <>
      {/* SEO: LocalBusiness collection JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
