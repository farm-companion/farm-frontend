'use client'

import { useState } from 'react'

interface PhotoDeletionRequestProps {
  photoId: string
  farmName: string
  photoDescription: string
  submitterEmail?: string
  userRole: 'admin' | 'shop_owner' | 'submitter'
  onRequestSubmitted?: () => void
  onCancel?: () => void
}

export default function PhotoDeletionRequest({
  photoId,
  farmName,
  photoDescription,
  submitterEmail = '',
  userRole,
  onRequestSubmitted,
  onCancel
}: PhotoDeletionRequestProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('Please provide a reason for deletion')
      return
    }

    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_deletion',
          requestedBy: userRole === 'admin' ? 'Admin' : userRole === 'shop_owner' ? 'Shop Owner' : 'Photo Submitter',
          requesterEmail: submitterEmail,
          requesterRole: userRole,
          reason: reason.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        onRequestSubmitted?.()
      } else {
        setError(result.error || 'Failed to submit deletion request')
      }
    } catch (_error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Deletion Request Submitted
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Your request to delete this photo has been submitted and will be reviewed by our team within 24 hours.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-heading mb-2">
          Request Photo Deletion
        </h3>
        <p className="text-sm text-text-muted">
          You are requesting to delete a photo from <strong>{farmName}</strong>. 
          This request will be reviewed by our team.
        </p>
      </div>

      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-text-heading mb-2">Photo Details</h4>
        <p className="text-sm text-text-muted">{photoDescription}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-text-heading mb-2">
            Reason for Deletion *
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:text-white"
            placeholder="Please explain why you want to delete this photo..."
            required
          />
          <p className="mt-1 text-xs text-text-muted">
            Minimum 10 characters. Be specific about your reason.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Important:</strong> Deletion requests are reviewed by our team. 
                If approved, photos are removed from public view but can be recovered within 4 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Deletion Request'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
