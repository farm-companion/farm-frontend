import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t bg-gray-50 dark:border-gray-700 dark:bg-[#1E1F23]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Farm Companion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The UK&apos;s premium guide to real food, real people, and real places.
            </p>
            <div className="flex space-x-4">
              {/* Add social media links here when available */}
              {/* <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a> */}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Farm Shop Map
                </Link>
              </li>
              <li>
                <Link href="/seasonal" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  What&apos;s in Season
                </Link>
              </li>
              <li>
                <Link href="/counties" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Browse by County
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farm Shops */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">For Farm Shops</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/add" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Add Your Shop
                </Link>
              </li>
              <li>
                <Link href="/claim" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Claim Your Listing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Leave Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/farm-companion/farm-frontend/issues/new?title=Data%20fix%3A%20%5Bfarm%20name%5D%20(%5Bslug%5D)%20%E2%80%94%20%5Burl%5D&labels=data%2Creport&template=data_fix.yml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 dark:text-gray-400 md:flex-row md:space-y-0">
            <div>
              © {currentYear} Farm Companion. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <span>Made with ❤️ for local food</span>
              <span>•</span>
              <span>Open source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
