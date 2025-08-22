'use client'

import Image from 'next/image'
import { useState } from 'react'
import { 
  getOptimizedImageUrl, 
  getFallbackImage, 
  getImagePriority, 
  getImageSizes,
  type ImageSource 
} from '@/lib/image-utils'

interface ProduceImageProps {
  image: ImageSource
  produceName: string
  index: number
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
  alt?: string
}

export default function ProduceImage({
  image,
  produceName,
  index,
  className = '',
  sizes,
  priority,
  fill = false,
  width,
  height,
  alt
}: ProduceImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Use optimized URL
  const optimizedSrc = getOptimizedImageUrl(image.src)
  
  // Use fallback if image fails to load
  const displaySrc = imageError ? getFallbackImage(produceName) : optimizedSrc
  
  // Use provided alt or fallback to image alt
  const displayAlt = alt || image.alt || `${produceName} image`
  
  // Determine priority (hero images get priority)
  const displayPriority = priority ?? getImagePriority(index)
  
  // Determine sizes
  const displaySizes = sizes ?? getImageSizes()

  const handleImageError = () => {
    console.warn(`Image failed to load: ${image.src} for ${produceName}`)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  // Show loading state
  if (imageLoading) {
    return (
      <div className={`relative bg-gray-100 animate-pulse ${className}`}>
        {fill ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  // Show error state with fallback
  if (imageError) {
    return (
      <div className={`relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 ${className}`}>
        {fill ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{produceName}</p>
              <p className="text-xs text-gray-500 mt-1">Image unavailable</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{produceName}</p>
              <p className="text-xs text-gray-500 mt-1">Image unavailable</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render the image
  return (
    <Image
      src={displaySrc}
      alt={displayAlt}
      className={className}
      sizes={displaySizes}
      priority={displayPriority}
      fill={fill}
      width={width}
      height={height}
      onError={handleImageError}
      onLoad={handleImageLoad}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  )
}

// Gallery component for multiple images
interface ProduceGalleryProps {
  images: ImageSource[]
  produceName: string
  className?: string
}

export function ProduceGallery({ images, produceName, className = '' }: ProduceGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        <div className="aspect-video bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{produceName}</p>
            <p className="text-xs text-gray-500 mt-1">No images available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
          <ProduceImage
            image={image}
            produceName={produceName}
            index={index}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
