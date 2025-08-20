import Link from 'next/link'
import { Button, Card } from '@/components/ui'

export default function Home() {
  return (
    <div className="min-h-screen bg-background-canvas">
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Hero Section - Mobile First */}
        <section className="text-center py-8 sm:py-12 lg:py-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-heading mb-4 sm:mb-6 leading-tight">
            Farm Companion
          </h1>
          <p className="text-lg sm:text-xl text-text-muted mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            The UK&apos;s premium guide to real food, real people, and real places. 
            Discover authentic farm shops across the country.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/map">
                Explore Farm Shops
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/seasonal">
                What&apos;s in Season
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid - Mobile First */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-12 sm:py-16">
          <Card className="text-center p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-4 sm:mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-heading mb-2 sm:mb-3">Find Local Farms</h3>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Discover farm shops near you with our interactive map. 
              Find fresh, local produce and authentic farm experiences.
            </p>
          </Card>

          <Card className="text-center p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 sm:mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-heading mb-2 sm:mb-3">Seasonal Guide</h3>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Know what&apos;s in season and when to visit. 
              Get the best produce at the perfect time of year.
            </p>
          </Card>

          <Card className="text-center p-6 sm:p-8 sm:col-span-2 lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-4 sm:mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-heading mb-2 sm:mb-3">Community Driven</h3>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Farm owners can claim their listings and add photos. 
              Help us build the most comprehensive farm shop directory.
            </p>
          </Card>
        </section>

        {/* Call to Action - Mobile First */}
        <section className="text-center py-8 sm:py-12 lg:py-16 bg-background-surface rounded-lg px-4 sm:px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-heading mb-3 sm:mb-4 leading-tight">
            Ready to Explore?
          </h2>
          <p className="text-base sm:text-lg text-text-muted mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            Start your journey to discover authentic farm shops and fresh local produce.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/map">
                Browse by Map
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/counties">
                Browse by County
              </Link>
            </Button>
          </div>
        </section>

        {/* About Preview - Mobile First */}
        <section className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-heading mb-3 sm:mb-4 leading-tight">
                About Farm Companion
              </h2>
              <p className="text-sm sm:text-base text-text-muted mb-4 sm:mb-6 leading-relaxed">
                We&apos;re passionate about connecting people with authentic farm experiences. 
                Our mission is to make it easy to find and support local farmers while 
                enjoying the freshest, most delicious produce available.
              </p>
              <p className="text-sm sm:text-base text-text-muted mb-6 sm:mb-8 leading-relaxed">
                Every farm shop in our directory is carefully verified to ensure you get 
                the real deal - no supermarkets, no mass-produced goods, just genuine 
                farm-to-table experiences.
              </p>
              <Button asChild variant="tertiary" size="md">
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="bg-background-surface rounded-lg p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary mb-4">
                  500+
                </div>
                <p className="text-lg sm:text-xl text-text-heading font-semibold mb-2">
                  Verified Farm Shops
                </p>
                <p className="text-sm sm:text-base text-text-muted">
                  Across the United Kingdom
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup - Mobile First */}
        <section className="py-12 sm:py-16 bg-background-surface rounded-lg px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-heading mb-3 sm:mb-4 leading-tight">
            Stay Updated
          </h2>
          <p className="text-base sm:text-lg text-text-muted mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            Get seasonal updates, new farm shop discoveries, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border-default rounded-md bg-background-canvas text-text-body placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              aria-label="Email address for newsletter"
            />
            <Button variant="primary" size="md">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-text-muted mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </section>
      </main>
    </div>
  )
}
