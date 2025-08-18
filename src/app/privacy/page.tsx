export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-gray-700">
        We respect your privacy. This page explains what we collect and why.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Who we are</h2>
        <p>
          Farm Companion helps people find farm shops across the UK. You can contact us at
          <a className="underline ml-1" href="mailto:hello@farmcompanion.co.uk">hello@farmcompanion.co.uk</a>.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Essential data:</strong> basic logs to keep the site running (e.g. error logs).</li>
          <li><strong>Consent-based data:</strong> if you accept cookies, we may load Google AdSense and basic analytics.</li>
          <li><strong>Shop submissions:</strong> if you add a listing, we store the details you provide.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Cookies & consent</h2>
        <p>
          We ask for your consent before loading non-essential cookies (ads/analytics). You can change your choice at any time via the cookie link in the footer.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Advertising (AdSense)</h2>
        <p>
          We use Google AdSense to show light, respectful adverts. AdSense may use cookies to measure performance and, with your consent, personalise ads. If you do not consent, ads will not load.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Data retention</h2>
        <p>We keep data only as long as necessary for the purpose we collected it for.</p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Your rights</h2>
        <p>
          You can request access, correction, or deletion of your personal data by emailing
          <a className="underline ml-1" href="mailto:hello@farmcompanion.co.uk">hello@farmcompanion.co.uk</a>.
        </p>
      </section>

      <p className="mt-10 text-sm text-gray-600">
        Effective date: {new Date().toLocaleDateString('en-GB')}
      </p>
    </main>
  )
}
