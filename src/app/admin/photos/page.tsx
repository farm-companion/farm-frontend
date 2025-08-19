import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PhotoViewer from '@/components/PhotoViewer'

import { getFarmPhotosApiUrl } from '@/config/farm-photos'

interface PhotoSubmission {
  id: string
  farmSlug: string
  farmName: string
  submitterName: string
  submitterEmail: string
  photoUrl: string
  thumbnailUrl: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  qualityScore: number
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  aiAnalysis?: {
    qualityScore: number
    isAppropriate: boolean
    tags: string[]
  }
  fileSize: number
  contentType: string
  dimensions: {
    width: number
    height: number
  }
}

// Load photo submissions from farm-photos system
async function loadPhotoSubmissions(): Promise<PhotoSubmission[]> {
  try {
    const response = await fetch(`${getFarmPhotosApiUrl('api/photos')}?status=pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      console.error('Failed to fetch photo submissions:', response.status)
      return []
    }
    
    const result = await response.json()
    return result.photos || []
    
  } catch (error) {
    console.error('Error loading photo submissions:', error)
    return []
  }
}

// Approve or reject a photo submission
async function updatePhotoStatus(photoId: string, status: 'approved' | 'rejected', rejectionReason?: string) {
  try {
    const response = await fetch(getFarmPhotosApiUrl(`api/photos/${photoId}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        rejectionReason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin' // In a real app, this would be the actual admin user
      })
    })
    
    return response.ok
  } catch (error) {
    console.error('Error updating photo status:', error)
    return false
  }
}

export const metadata: Metadata = {
  title: 'Photo Submissions - Farm Companion Admin',
  description: 'Review and manage user-submitted photos for farm shops',
}

export default async function AdminPhotosPage() {
  const submissions = await loadPhotoSubmissions()
  const pendingSubmissions = submissions.filter(s => s.status === 'pending')

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading">Photo Submissions</h1>
        <p className="text-text-muted mt-2">
          Review and manage user-submitted photos for farm shops
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-heading">Pending Review</h3>
          <p className="text-3xl font-bold text-brand-primary">{pendingSubmissions.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-text-heading">Total Submissions</h3>
          <p className="text-3xl font-bold text-text-heading">{submissions.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-text-heading">Approved Today</h3>
          <p className="text-3xl font-bold text-emerald-600">
            {submissions.filter(s => 
              s.status === 'approved' && 
              new Date(s.reviewedAt || '').toDateString() === new Date().toDateString()
            ).length}
          </p>
        </div>
      </div>

      {/* Submissions List */}
      {pendingSubmissions.length === 0 ? (
        <div className="card text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-heading mb-2">No Pending Submissions</h3>
          <p className="text-text-muted">
            All photo submissions have been reviewed. Check back later for new submissions.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingSubmissions.map((submission) => (
            <div key={submission.id} className="card">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo Preview */}
                <div>
                  <h3 className="font-semibold text-text-heading mb-2">Photo Preview</h3>
                  <div className="relative aspect-video bg-background-surface rounded-lg overflow-hidden">
                    <Image
                      src={submission.photoUrl}
                      alt={submission.description}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* AI Analysis */}
                  {submission.aiAnalysis && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-text-heading mb-2">AI Analysis</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Quality Score:</span>
                          <span className="font-medium">{submission.aiAnalysis.qualityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Appropriate:</span>
                          <span className={`font-medium ${submission.aiAnalysis.isAppropriate ? 'text-emerald-600' : 'text-red-600'}`}>
                            {submission.aiAnalysis.isAppropriate ? 'Yes' : 'No'}
                          </span>
                        </div>
                        {submission.aiAnalysis.tags && submission.aiAnalysis.tags.length > 0 && (
                          <div>
                            <span>Tags:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {submission.aiAnalysis.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Submission Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-heading mb-2">Submission Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Farm:</span>
                        <Link href={`/shop/${submission.farmSlug}`} className="ml-2 text-brand-primary hover:underline">
                          {submission.farmName}
                        </Link>
                      </div>
                      <div>
                        <span className="font-medium">Submitted by:</span>
                        <span className="ml-2">{submission.submitterName}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{submission.submitterEmail}</span>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-2">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">File size:</span>
                        <span className="ml-2">{(submission.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div>
                        <span className="font-medium">Dimensions:</span>
                        <span className="ml-2">{submission.dimensions.width} × {submission.dimensions.height}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-text-heading mb-2">Description</h4>
                    <p className="text-sm text-text-muted bg-background-surface p-3 rounded">
                      {submission.description}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <form action={async () => {
                      'use server'
                      await updatePhotoStatus(submission.id, 'approved')
                    }}>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                    </form>
                    
                    <form action={async (formData: FormData) => {
                      'use server'
                      const reason = formData.get('reason') as string
                      await updatePhotoStatus(submission.id, 'rejected', reason)
                    }}>
                      <input
                        type="text"
                        name="reason"
                        placeholder="Rejection reason (optional)"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
