import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background-canvas">
      {/* Skip Link for Accessibility */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      
      <main id="main" className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl font-bold text-text-heading mb-6">
            Farm Companion
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            The UK&apos;s premium guide to real food, real people, and real places. 
            Discover authentic farm shops across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/map" className="btn-primary">
              Explore Farm Shops
            </Link>
            <Link href="/seasonal" className="btn-secondary">
              What&apos;s in Season
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 py-16">
          <div className="card text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-heading mb-2">Find Local Farms</h3>
            <p className="text-text-muted">
              Discover farm shops near you with our interactive map. 
              Find fresh, local produce and authentic farm experiences.
            </p>
          </div>

          <div className="card text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-heading mb-2">Seasonal Guide</h3>
            <p className="text-text-muted">
              Know what&apos;s in season and when to visit. 
              Get the best produce at the perfect time of year.
            </p>
          </div>

          <div className="card text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-heading mb-2">Community Driven</h3>
            <p className="text-text-muted">
              Farm owners can claim their listings and add photos. 
              Help us build the most comprehensive farm shop directory.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-background-surface rounded-lg">
          <h2 className="text-3xl font-bold text-text-heading mb-4">
            Ready to Explore?
          </h2>
          <p className="text-text-muted mb-8 max-w-xl mx-auto">
            Start your journey to discover authentic farm shops and fresh local produce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/map" className="btn-primary">
              Browse by Map
            </Link>
            <Link href="/counties" className="btn-secondary">
              Browse by County
            </Link>
          </div>
        </section>

        {/* About Preview */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-heading mb-4">
                About Farm Companion
              </h2>
              <p className="text-text-muted mb-6">
                We&apos;re passionate about connecting people with authentic farm experiences. 
                Our platform helps you discover the best farm shops across the UK, 
                supporting local farmers and sustainable food production.
              </p>
              <Link href="/about" className="link">
                Learn more about our mission →
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video bg-background-surface rounded-lg flex items-center justify-center">
                <span className="text-text-muted">Farm Shop Image</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
