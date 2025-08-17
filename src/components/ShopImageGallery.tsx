'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ShopImageGalleryProps {
  images?: string[]
  shopName: string
  shopSlug: string
}

export default function ShopImageGallery({ images, shopName, shopSlug }: ShopImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // If no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto mb-4 h-16 w-16 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No images yet</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We don&apos;t have photos of {shopName} yet. 
          <br />
          <span className="text-xs">
            Own this shop? <a href={`/claim/${shopSlug}`} className="underline hover:no-underline">Claim it</a> to add photos.
          </span>
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Main image gallery */}
      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Photos</h2>
        
        {/* Main large image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <Image
            src={images[selectedImage]}
            alt={`${shopName} - Photo ${selectedImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedImage === 0}
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer object-cover transition-transform hover:scale-105"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/10"
            aria-label="View full size image"
          >
            <svg className="h-8 w-8 text-white opacity-0 transition-opacity hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-[#00C2B2] dark:border-[#D4FF4F]'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                aria-label={`View photo ${index + 1} of ${images.length}`}
              >
                <Image
                  src={image}
                  alt={`${shopName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image count */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {images.length} photo{images.length !== 1 ? 's' : ''}
        </p>
      </section>

      {/* Full-screen modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-h-full max-w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close image viewer"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <Image
              src={images[selectedImage]}
              alt={`${shopName} - Photo ${selectedImage + 1}`}
              width={800}
              height={600}
              className="max-h-[80vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  aria-label="Previous photo"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  aria-label="Next photo"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {selectedImage + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
