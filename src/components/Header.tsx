'use client'

import { useState } from 'react'
import Link from 'next/link'
import MobileMenu, { MobileMenuButton } from './MobileMenu'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-default bg-background-canvas/90 backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold text-text-heading">
            Farm Companion
          </Link>
          
                      {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-4 text-sm">
              <li><Link href="/map" className="text-text-body hover:text-text-heading transition-colors">Map</Link></li>
              <li><Link href="/seasonal" className="text-text-body hover:text-text-heading transition-colors">Seasonal</Link></li>
              <li><Link href="/about" className="text-text-body hover:text-text-heading transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-text-body hover:text-text-heading transition-colors">Feedback</Link></li>
              <li>
                <Link
                  href="/add"
                  className="btn-primary"
                >
                  Add a Farm Shop
                </Link>
              </li>
            </ul>

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}
