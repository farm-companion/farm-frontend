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
      <header className="sticky top-0 z-40 border-b border-border-default bg-background-canvas/95 backdrop-blur-sm sm:backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Logo/Brand - Mobile First */}
          <Link 
            href="/" 
            className="font-bold text-lg sm:text-xl text-text-heading touch-target flex items-center"
          >
            Farm Companion
          </Link>
          
          {/* Desktop Navigation - Hidden on Mobile */}
          <ul className="hidden lg:flex items-center gap-6 text-sm">
            <li>
              <Link 
                href="/map" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
              >
                Map
              </Link>
            </li>
            <li>
              <Link 
                href="/seasonal" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
              >
                Seasonal
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link
                href="/add"
                className="btn-primary touch-target text-sm px-4 py-2"
              >
                Add a Farm Shop
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button - Always visible for easy access */}
          <MobileMenuButton onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}
