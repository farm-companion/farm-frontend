'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
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
        <nav aria-label="Primary navigation" className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Logo/Brand - Mobile First */}
          <Link 
            href="/" 
            className="font-bold text-lg sm:text-xl text-text-heading touch-target flex items-center"
            aria-label="Farm Companion - Home"
          >
            Farm Companion
          </Link>
          
          {/* Desktop Navigation - Hidden on Mobile */}
          <ul className="hidden lg:flex items-center gap-6 text-sm" role="menubar">
            <li role="none">
              <Link 
                href="/map" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
                role="menuitem"
              >
                Map
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/seasonal" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
                role="menuitem"
              >
                Seasonal
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/about" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
                role="menuitem"
              >
                About
              </Link>
            </li>
            <li role="none">
              <Link 
                href="/contact" 
                className="text-text-body hover:text-text-heading transition-colors touch-target px-3 py-2"
                role="menuitem"
              >
                Feedback
              </Link>
            </li>
            <li role="none">
              <Button
                asChild
                variant="primary"
                size="md"
              >
                <Link href="/add">
                  Add a Farm Shop
                </Link>
              </Button>
            </li>
          </ul>

          {/* Mobile Menu Button - Visible on mobile and tablet */}
          <div className="lg:hidden">
            <MobileMenuButton 
              onClick={toggleMobileMenu} 
              isOpen={isMobileMenuOpen}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            />
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu}
      />
    </>
  )
}
