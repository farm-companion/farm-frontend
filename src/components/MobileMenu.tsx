'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
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
      title: "What&apos;s in Season",
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

  if (!isOpen) return null

  return (
    <>
      {/* Apple-style Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-backdrop-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Apple-style Glass Menu Container */}
      <div className="fixed inset-y-0 right-0 w-80 max-w-[85vw] glass-primary z-50 animate-ios-spring-in rounded-l-3xl">
        {/* Glass Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Farm Companion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="glass-button p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-8">
          {/* Primary Navigation */}
          <div className="px-8 mb-10">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-6">
              Navigation
            </h3>
            <nav className="space-y-3">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl text-white group animate-item-fade-up"
                    style={{
                      animationDelay: `${(index + 1) * 0.1}s`
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg">{item.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Secondary Features */}
          <div className="px-8 mb-10">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-6">
              Discover
            </h3>
            <div className="space-y-4">
              {secondaryItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="glass-secondary flex items-start gap-4 p-5 rounded-2xl group animate-item-fade-up"
                    style={{
                      animationDelay: `${(index + navigationItems.length + 1) * 0.1}s`
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-all duration-200 mt-1">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-base mb-1">
                        {item.title}
                      </div>
                      <div className="text-white/70 text-sm leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Actions */}
          <div className="px-8 mb-8">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-6">
              Account
            </h3>
            <div className="space-y-3">
              {userItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl text-white group animate-item-fade-up"
                    style={{
                      animationDelay: `${(index + navigationItems.length + secondaryItems.length + 1) * 0.1}s`
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-base">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Glass Footer */}
        <div className="p-8 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-white/60 leading-relaxed">
              The UK&apos;s premium guide to real food, real people, and real places.
            </p>
          </div>
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
      className="md:hidden p-3 rounded-full bg-text-body/10 hover:bg-text-body/20 border border-text-body/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="relative w-6 h-6">
        <span
          className={`absolute top-1 left-0 w-6 h-0.5 bg-text-body transition-all duration-300 ease-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`absolute top-3 left-0 w-6 h-0.5 bg-text-body transition-all duration-300 ease-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`absolute top-5 left-0 w-6 h-0.5 bg-text-body transition-all duration-300 ease-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  )
}
