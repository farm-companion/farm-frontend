'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  photoUrl: string
  thumbnailUrl: string
  description: string
  submitterName: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  qualityScore?: number
}

interface PhotoViewerProps {
  photos: Photo[]
  title?: string
  showStatus?: boolean
  className?: string
}

export default function PhotoViewer({ 
  photos, 
  title = "Farm Photos", 
  showStatus = false,
  className = "" 
}: PhotoViewerProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPhoto(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Rejected'
      case 'pending':
        return 'Pending Review'
      default:
        return 'Unknown'
    }
  }

  if (photos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm">Be the first to share a photo of this farm!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-xl font-semibold text-text-heading mb-4">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => openModal(photo)}
          >
            {/* Photo */}
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={photo.thumbnailUrl}
                alt={photo.description}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Status badge */}
              {showStatus && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(photo.status)}`}>
                  {getStatusText(photo.status)}
                </div>
              )}
              
              {/* Quality score */}
              {photo.qualityScore && (
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                  ⭐ {photo.qualityScore}/10
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Photo info */}
            <div className="p-3">
              <p className="text-sm text-text-body line-clamp-2 mb-2">
                {photo.description}
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>By {photo.submitterName}</span>
                <span>{new Date(photo.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full-size photo */}
      {isModalOpen && selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Photo */}
            <div className="relative">
              <Image
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.description}
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
              />
            </div>
            
            {/* Photo details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-heading mb-2">
                    {selectedPhoto.description}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-text-muted">
                    <span>By {selectedPhoto.submitterName}</span>
                    <span>•</span>
                    <span>{new Date(selectedPhoto.submittedAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    {selectedPhoto.qualityScore && (
                      <>
                        <span>•</span>
                        <span>Quality: {selectedPhoto.qualityScore}/10</span>
                      </>
                    )}
                  </div>
                </div>
                
                {showStatus && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPhoto.status)}`}>
                    {getStatusText(selectedPhoto.status)}
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = selectedPhoto.photoUrl
                    link.download = `farm-photo-${selectedPhoto.id}.jpg`
                    link.click()
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download</span>
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPhoto.photoUrl)
                    // You could add a toast notification here
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
