import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">About Farm Companion</h1>
        <p className="text-lg text-gray-700">
          The UK&apos;s premium guide to real food, real people, and real places.
        </p>
        <p className="text-gray-600">
          We help you find trusted farm shops near you—fast, clear, and without the clutter.
        </p>
      </header>

      {/* What we do */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">What we do</h2>
        <p>
          Farm Companion makes it easy to discover farm shops that sell fresh, seasonal food.
          Search by place, browse a clean map, and open beautiful, simple profiles with the
          essentials: address, opening hours, what they sell, and how to get there.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Map-first:</strong> see nearby shops at a glance.</li>
          <li><strong>Seasonal focus:</strong> check what&apos;s in season and who sells it.</li>
          <li><strong>Real stories:</strong> meet the people behind the produce.</li>
        </ul>
      </section>

      {/* How we differ */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">How we&apos;re different</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Made for farm food:</strong> everything is tailored to farm shops, not generic businesses.</li>
          <li><strong>Clean and fast:</strong> no endless lists; just a clear map and concise cards.</li>
          <li><strong>Honest ranking:</strong> we prioritise verified, complete listings—not ad spend.</li>
          <li><strong>Open maps:</strong> we use open, privacy-friendly maps (no Google tracking).</li>
        </ul>
      </section>

      {/* Trust & verification */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">Trust & verification</h2>
        <p>Every shop shows a simple trust status:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Owner-confirmed:</strong> the owner reviewed and confirmed the details.</li>
          <li><strong>Publicly verified:</strong> cross-checked against reputable public sources.</li>
          <li><strong>Under review:</strong> we&apos;re checking; basic details are available meanwhile.</li>
        </ul>
        <p className="text-sm text-gray-600">
          See something wrong? Use the &ldquo;Suggest an update&rdquo; link on any shop page.
        </p>
      </section>

      {/* Seasonal */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">Seasonal food, simply</h2>
        <p>
          Use our seasonal calendar to see what&apos;s great right now—then filter the map to find
          shops that stock it. Planning a weekend? Build a short list and print your &ldquo;farm run&rdquo;.
        </p>
        <div className="mt-2 flex gap-3">
          <Link href="/seasonal" className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50">
            What&apos;s in season?
          </Link>
          <Link href="/map" className="inline-flex items-center rounded-lg bg-[#00C2B2] px-4 py-2 text-white hover:opacity-90">
            Open the map
          </Link>
        </div>
      </section>

      {/* How to add a shop */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">Own a farm shop?</h2>
        <p>
          You can claim or add your listing for free. Highlight what makes you special and keep
          your details fresh. We also offer a premium highlight option for extra visibility.
        </p>
        <Link href="/add" className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50">
          Add a Farm Shop
        </Link>
      </section>

      {/* Privacy & ads */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">Privacy & ads</h2>
        <p>
          We show <strong>light, respectful ads</strong> to cover costs. Ads only load after you give consent.
          We don&apos;t sell personal data. You can change your cookie choices any time.
        </p>
        <p className="text-sm text-gray-600">
          Read our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms</Link>.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium">Is Farm Companion free?</summary>
          <p className="mt-2 text-gray-700">Yes. Browsing and adding a basic listing are free.</p>
        </details>
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium">Do you take commissions?</summary>
          <p className="mt-2 text-gray-700">No. We&apos;re an independent directory. Shops sell directly to you.</p>
        </details>
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium">How current is the data?</summary>
          <p className="mt-2 text-gray-700">
            We review listings regularly and rely on owners and customers to flag changes. Look for the
            &ldquo;Updated&rdquo; date on each profile.
          </p>
        </details>
      </section>

      {/* Contact */}
      <section className="mt-10 space-y-2">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Suggestions or corrections? Email <a className="underline" href="mailto:hello@farmcompanion.co.uk">hello@farmcompanion.co.uk</a>.
        </p>
      </section>

      {/* CTA */}
      <footer className="mt-12 flex flex-wrap gap-3">
        <Link href="/map" className="inline-flex items-center rounded-lg bg-[#00C2B2] px-4 py-2 text-white hover:opacity-90">
          Find farm shops near me
        </Link>
        <Link href="/add" className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-50">
          Add a Farm Shop
        </Link>
      </footer>

      {/* Support the project — respectful, consented ad */}
      <div className="mt-10">
        <AdSlot />
      </div>
    </main>
  )
}
