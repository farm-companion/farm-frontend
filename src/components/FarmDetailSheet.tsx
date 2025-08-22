'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { X, Phone, MapPin, Star, Clock, Share2, Heart, ExternalLink, Navigation } from 'lucide-react'
import { FarmShop } from '@/types/farm'
import { hapticFeedback } from '@/lib/haptics'
import { createSwipeToClose } from '@/lib/gestures'

interface FarmDetailSheetProps {
  farm: FarmShop | null
  isOpen: boolean
  onClose: () => void
  userLocation?: { lat: number; lng: number } | null
  allFarms?: FarmShop[] | null
}

// Check if image is a placeholder (Unsplash or generic)
const isPlaceholderImage = (imageUrl: string): boolean => {
  return imageUrl.includes('unsplash.com') || 
         imageUrl.includes('picsum.photos') ||
         imageUrl.includes('placeholder') ||
         imageUrl.includes('demo')
}

// Get real farm images only
const getRealFarmImages = (images: string[] | undefined): string[] => {
  if (!images || images.length === 0) return []
  return images.filter(img => !isPlaceholderImage(img))
}

export const FarmDetailSheet: React.FC<FarmDetailSheetProps> = ({
  farm,
  isOpen,
  onClose,
  userLocation,
  allFarms
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Get real farm images only
  const realImages = useMemo(() => getRealFarmImages(farm?.images), [farm?.images])
  const hasRealImages = realImages.length > 0

  // Calculate distance if user location is available
  const distance = userLocation && farm?.location
    ? Math.round(haversineMi(userLocation.lat, userLocation.lng, farm.location.lat, farm.location.lng))
    : null

  // Find nearby farms (within 5 miles)
  const nearbyFarms = useMemo(() => {
    if (!farm || !allFarms || !farm.location) return []
    
    return allFarms
      .filter(otherFarm => otherFarm.id !== farm.id && otherFarm.location)
      .map(otherFarm => ({
        ...otherFarm,
        distance: haversineMi(
          farm.location.lat, farm.location.lng,
          otherFarm.location.lat, otherFarm.location.lng
        )
      }))
      .filter(farmWithDistance => farmWithDistance.distance <= 5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) // Show top 3 nearby farms
  }, [farm, allFarms])

  // Get seasonal highlights based on current month
  const seasonalHighlights = useMemo(() => {
    if (!farm) return []
    
    const currentMonth = new Date().getMonth() + 1 // 1-12
    const highlights = []
    
    // Spring (March-May)
    if (currentMonth >= 3 && currentMonth <= 5) {
      highlights.push('🌱 Spring planting season')
      highlights.push('🌸 Cherry blossoms and flowers')
    }
    // Summer (June-August)
    else if (currentMonth >= 6 && currentMonth <= 8) {
      highlights.push('☀️ Peak growing season')
      highlights.push('🍓 Fresh berries available')
    }
    // Autumn (September-November)
    else if (currentMonth >= 9 && currentMonth <= 11) {
      highlights.push('🍎 Apple picking season')
      highlights.push('🎃 Pumpkin patches open')
    }
    // Winter (December-February)
    else {
      highlights.push('❄️ Winter farm activities')
      highlights.push('🕯️ Holiday farm events')
    }
    
    return highlights
  }, [farm])

  // Haversine formula for accurate distance calculation
  function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (d: number) => (d * Math.PI) / 180
    const R = 3958.7613 // Earth radius in miles
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      hapticFeedback.buttonPress()
      onClose()
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        hapticFeedback.buttonPress()
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Setup swipe-to-close gesture
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const recognizer = createSwipeToClose(sheetRef.current, () => {
        hapticFeedback.buttonPress()
        onClose()
      })
      return () => {
        recognizer.stop()
      }
    }
  }, [isOpen, onClose])

  // Reset image loaded state when farm changes
  useEffect(() => {
    setImageLoaded(false)
  }, [farm?.id])

  if (!farm) return null

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${isDragging ? 'transition-none' : ''}`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-white/60 backdrop-blur-sm rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-white/20 max-h-[90vh] overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            {hasRealImages ? (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={realImages[0]}
                  alt={farm.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {/* Loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 animate-pulse" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">{farm.name}</p>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                hapticFeedback.buttonPress()
                onClose()
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Farm Name Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{farm.name}</h1>
              <div className="flex items-center gap-3 text-white/90">
                {distance && (
                  <span className="text-sm bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    {distance} miles away
                  </span>
                )}
                {farm.verified && (
                  <span className="text-sm bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="text-green-300">✓</span> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-8">
            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-brand-primary text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-brand-primary/90 transition-all active:scale-95">
                <Navigation className="w-5 h-5" />
                Get Directions
              </button>
              {farm.contact?.phone && (
                <button className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95">
                  <Phone className="w-5 h-5" />
                  Call
                </button>
              )}
              <button className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
              <button className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-primary" />
                Location
              </h2>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-900 font-medium">{farm.location.address}</p>
                <p className="text-gray-600">{farm.location.city}, {farm.location.county}</p>
                <p className="text-gray-500 font-mono">{farm.location.postcode}</p>
              </div>
            </div>

            {/* Hours */}
            {farm.hours && farm.hours.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-primary" />
                  Opening Hours
                </h2>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  {farm.hours.map((hour, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize font-medium text-gray-900">{hour.day}</span>
                      <span className="text-gray-600 font-mono">{hour.open} - {hour.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offerings */}
            {farm.offerings && farm.offerings.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900">What&apos;s Available</h2>
                <div className="flex flex-wrap gap-2">
                  {farm.offerings.map((offering, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
                    >
                      {offering}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {farm.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900">About</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{farm.description}</p>
              </div>
            )}

            {/* Seasonal Highlights */}
            {seasonalHighlights.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900">Seasonal Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {seasonalHighlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Website */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">Contact</h2>
              <div className="space-y-3">
                {farm.contact?.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <Phone className="w-5 h-5 text-brand-primary" />
                    <span className="text-gray-900 font-medium">{farm.contact.phone}</span>
                  </div>
                )}
                {farm.contact?.website && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <ExternalLink className="w-5 h-5 text-brand-primary" />
                    <span className="text-gray-900 font-medium">Visit Website</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Farms */}
            {nearbyFarms.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-900">Nearby Farms</h2>
                <div className="space-y-3">
                  {nearbyFarms.map((nearbyFarm) => (
                    <div key={nearbyFarm.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{nearbyFarm.name}</h3>
                        <p className="text-sm text-gray-600">{nearbyFarm.location.county}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {nearbyFarm.distance.toFixed(1)} mi
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Safe Area */}
          <div className="h-8" />
        </div>
      </div>
    </>
  )
}
