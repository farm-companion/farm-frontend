'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { X, Phone, MapPin, Star, Clock, Share2, Heart } from 'lucide-react'
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

  if (!farm) return null

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${isDragging ? 'transition-none' : ''}`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-gray-200/50 max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="relative p-6 pb-4">
            {/* Close Button */}
            <button
              onClick={() => {
                hapticFeedback.buttonPress()
                onClose()
              }}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Farm Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-green-100 to-blue-100">
              {farm.images && farm.images.length > 0 ? (
                <img
                  src={farm.images[0]}
                  alt={farm.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-gray-300" />
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Farm Name */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-1">{farm.name}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  {distance && (
                    <span className="text-sm opacity-75">{distance} miles away</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 bg-brand-primary text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-colors">
                <MapPin className="w-4 h-4" />
                Directions
              </button>
              {farm.contact?.phone && (
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              )}
              <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 pb-6 space-y-6">
            {/* Address */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">
                  <p>{farm.location.address}</p>
                  <p>{farm.location.city}, {farm.location.county}</p>
                  <p className="font-medium">{farm.location.postcode}</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            {farm.hours && farm.hours.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Opening Hours</h3>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-600">
                    {farm.hours.map((hour, index) => (
                      <div key={index} className="flex justify-between gap-4">
                        <span className="capitalize">{hour.day}</span>
                        <span>{hour.open} - {hour.close}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Offerings */}
            {farm.offerings && farm.offerings.length > 0 && (
              <div className="space-y-2">
                                 <h3 className="text-lg font-semibold text-gray-900">What&apos;s Available</h3>
                <div className="flex flex-wrap gap-2">
                  {farm.offerings.map((offering, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {offering}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {farm.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="text-gray-600 leading-relaxed">{farm.description}</p>
              </div>
            )}

            {/* Seasonal Highlights */}
            {seasonalHighlights.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Seasonal Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {seasonalHighlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Farms */}
            {nearbyFarms.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Nearby Farms</h3>
                <div className="space-y-2">
                  {nearbyFarms.map((nearbyFarm) => (
                    <div key={nearbyFarm.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{nearbyFarm.name}</h4>
                        <p className="text-sm text-gray-600">{nearbyFarm.location.county}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {nearbyFarm.distance.toFixed(1)} mi
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Badge */}
            {farm.verified && (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">Verified Farm</span>
              </div>
            )}
          </div>

          {/* Bottom Safe Area */}
          <div className="h-6" />
        </div>
      </div>
    </>
  )
}
