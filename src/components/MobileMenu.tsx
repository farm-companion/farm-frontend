'use client'

import { useEffect, useCallback } from 'react'
import { 
  Home, 
  Map, 
  Leaf, 
  Info, 
  Plus, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  User, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
    primary: true
  },
  {
    title: 'Explore Map',
    href: '/map',
    icon: Map,
    primary: true
  },
  {
    title: 'Seasonal Guide',
    href: '/seasonal',
    icon: Leaf,
    primary: true
  },
  {
    title: 'About Us',
    href: '/about',
    icon: Info,
    primary: true
  },
  {
    title: 'Add Your Farm',
    href: '/add',
    icon: Plus,
    primary: true
  },
  {
    title: 'Feedback',
    href: '/contact',
    icon: MessageCircle,
    primary: true
  }
]

const secondaryItems = [
  {
    title: 'Find Nearest Farm',
    href: '/map',
    icon: MapPin,
    description: 'Discover farms close to you'
  },
  {
    title: "What's in Season",
    href: '/seasonal',
    icon: Calendar,
    description: 'Fresh produce available now'
  },
  {
    title: 'Featured Farms',
    href: '/map?featured=true',
    icon: Star,
    description: 'Handpicked farm recommendations'
  },
  {
    title: 'Farm Stories',
    href: '/about',
    icon: BookOpen,
    description: 'Meet the people behind the farms'
  }
]

const userItems = [
  {
    title: 'Account',
    href: '/admin',
    icon: User,
    description: 'Manage your account'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Customize your experience'
  },
  {
    title: 'Contact Support',
    href: '/contact',
    icon: HelpCircle,
    description: 'Get help and support'
  }
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Handle swipe to close
  useEffect(() => {
    let startX = 0
    let currentX = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const diff = startX - currentX
      if (diff > 50 && isOpen) { // Swipe left to close
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('touchstart', handleTouchStart)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isOpen, onClose])

  // Handle link click
  const handleLinkClick = useCallback((href: string) => {
    // Close menu immediately
    onClose()
    // Navigate after a small delay to ensure menu closes smoothly
    setTimeout(() => {
      window.location.href = href
    }, 150)
  }, [onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Mobile-optimized Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Mobile-optimized Menu Container */}
      <div className="fixed inset-y-0 right-0 w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-obsidian shadow-2xl z-[9999] animate-slide-up">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-serum to-solar flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">FC</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-text-heading">
              Farm Companion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-full hover:bg-background-surface focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-text-body" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-6">
          {/* Primary Navigation */}
          <div className="px-4 sm:px-6 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full touch-target flex items-center gap-3 px-3 py-3 text-left text-text-body hover:text-text-heading hover:bg-background-surface rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Features */}
          <div className="px-4 sm:px-6 mb-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {secondaryItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full touch-target flex items-start gap-3 p-3 text-left hover:bg-background-surface rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-text-heading">{item.title}</div>
                    <div className="text-xs sm:text-sm text-text-muted mt-0.5">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="px-4 sm:px-6">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              Account
            </h3>
            <div className="space-y-2">
              {userItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="w-full touch-target flex items-start gap-3 p-3 text-left hover:bg-background-surface rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-text-heading">{item.title}</div>
                    <div className="text-xs sm:text-sm text-text-muted mt-0.5">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="border-t border-border-default p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            The UK&apos;s premium guide to real food, real people, and real places.
          </p>
        </div>
      </div>
    </>
  )
}

// Apple-style Hamburger Button Component
export function MobileMenuButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-3 rounded-full bg-obsidian/10 hover:bg-obsidian/20 border border-obsidian/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-serum relative z-[9997]"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-6">
        <span
          className={`absolute top-1 left-0 w-6 h-0.5 bg-obsidian transition-all duration-300 ease-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`absolute top-3 left-0 w-6 h-0.5 bg-obsidian transition-all duration-300 ease-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`absolute top-5 left-0 w-6 h-0.5 bg-obsidian transition-all duration-300 ease-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  )
}
