// Simple Photo Storage for Farm Frontend
// This provides basic photo functionality until the full farm-photos system is deployed

import { 
  sendPhotoSubmissionConfirmation, 
  sendAdminPhotoNotification,
  sendApprovalNotification,
  sendRejectionNotification
} from './email'

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
  fileSize: number
  contentType: string
  dimensions: {
    width: number
    height: number
  }
}

// In-memory storage for development
// In production, this would be replaced with a database
const photoSubmissions = new Map<string, PhotoSubmission>()
const farmPhotoCounts = new Map<string, number>()

// Generate unique submission ID
function generateSubmissionId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `photo_${timestamp}_${random}`
}

// Create a thumbnail from base64 image data
function createThumbnail(base64Data: string, maxWidth: number = 400, maxHeight: number = 400): string {
  return new Promise<string>((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        resolve(base64Data) // Fallback to original
        return
      }
      
      // Calculate new dimensions
      let { width, height } = img
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to base64
      const thumbnailData = canvas.toDataURL('image/jpeg', 0.8)
      resolve(thumbnailData)
    }
    
    img.onerror = () => {
      resolve(base64Data) // Fallback to original
    }
    
    img.src = base64Data
  })
}

// Save photo submission
export async function savePhotoSubmission(data: {
  farmSlug: string
  farmName: string
  submitterName: string
  submitterEmail: string
  photoData: string
  description: string
}): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  try {
    const submissionId = generateSubmissionId()
    
    // Validate photo data
    if (!data.photoData.startsWith('data:image/')) {
      return {
        success: false,
        error: 'Invalid photo data format'
      }
    }
    
    // Check file size (base64 is ~33% larger than binary)
    const base64Size = data.photoData.length
    const estimatedBinarySize = (base64Size * 3) / 4
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (estimatedBinarySize > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size: 5MB'
      }
    }
    
    // For now, use the same image for both full and thumbnail
    // In production, you'd generate a proper thumbnail
    const photoUrl = data.photoData
    const thumbnailUrl = data.photoData // Same as full image for now
    
    // Create submission
    const submission: PhotoSubmission = {
      id: submissionId,
      farmSlug: data.farmSlug,
      farmName: data.farmName,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      photoUrl: photoUrl,
      thumbnailUrl: thumbnailUrl,
      description: data.description,
      status: 'pending',
      qualityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      submittedAt: new Date().toISOString(),
      fileSize: estimatedBinarySize,
      contentType: data.photoData.match(/^data:([^;]+);/)?.[1] || 'image/jpeg',
      dimensions: {
        width: 1920,
        height: 1080
      }
    }
    
    // Save to storage
    photoSubmissions.set(submissionId, submission)
    
    // Update farm photo count
    const currentCount = farmPhotoCounts.get(data.farmSlug) || 0
    farmPhotoCounts.set(data.farmSlug, currentCount + 1)
    
    console.log(`💾 Saved photo submission: ${submissionId}`)
    
    // Send confirmation email to submitter
    try {
      await sendPhotoSubmissionConfirmation({
        submissionId,
        farmSlug: data.farmSlug,
        farmName: data.farmName,
        submitterName: data.submitterName,
        submitterEmail: data.submitterEmail,
        description: data.description,
        submittedAt: submission.submittedAt
      })
      console.log(`📧 Confirmation email sent to ${data.submitterEmail}`)
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }
    
    // Send admin notification
    try {
      await sendAdminPhotoNotification({
        submissionId,
        farmSlug: data.farmSlug,
        farmName: data.farmName,
        submitterName: data.submitterName,
        submitterEmail: data.submitterEmail,
        description: data.description,
        submittedAt: submission.submittedAt
      })
      console.log(`📧 Admin notification sent`)
    } catch (error) {
      console.error('Failed to send admin notification:', error)
    }
    
    return {
      success: true,
      submissionId
    }
  } catch (error) {
    console.error('Failed to save photo submission:', error)
    return {
      success: false,
      error: 'Failed to save photo submission'
    }
  }
}

// Get photos for a farm
export async function getFarmPhotos(
  farmSlug: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<PhotoSubmission[]> {
  try {
    const photos = Array.from(photoSubmissions.values())
      .filter(photo => photo.farmSlug === farmSlug)
    
    if (status) {
      return photos.filter(photo => photo.status === status)
    }
    
    return photos
  } catch (error) {
    console.error('Failed to get farm photos:', error)
    return []
  }
}

// Get farm photo count
export async function getFarmPhotoCount(farmSlug: string): Promise<number> {
  try {
    return farmPhotoCounts.get(farmSlug) || 0
  } catch (error) {
    console.error('Failed to get farm photo count:', error)
    return 0
  }
}

// Get photo submission by ID
export async function getPhotoSubmission(submissionId: string): Promise<PhotoSubmission | null> {
  try {
    return photoSubmissions.get(submissionId) || null
  } catch (error) {
    console.error('Failed to get photo submission:', error)
    return null
  }
}

// Update photo status
export async function updatePhotoStatus(
  submissionId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  rejectionReason?: string
): Promise<boolean> {
  try {
    const submission = photoSubmissions.get(submissionId)
    if (!submission) {
      return false
    }
    
    submission.status = status
    submission.reviewedAt = new Date().toISOString()
    submission.reviewedBy = reviewedBy
    
    if (status === 'rejected' && rejectionReason) {
      submission.rejectionReason = rejectionReason
    }
    
    photoSubmissions.set(submissionId, submission)
    console.log(`📝 Updated photo status: ${submissionId} -> ${status}`)
    
    // Send notification email based on status
    try {
      const submissionData = {
        submissionId,
        farmSlug: submission.farmSlug,
        farmName: submission.farmName,
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
        description: submission.description,
        submittedAt: submission.submittedAt
      }
      
      if (status === 'approved') {
        await sendApprovalNotification(submissionData)
        console.log(`📧 Approval notification sent to ${submission.submitterEmail}`)
      } else if (status === 'rejected') {
        await sendRejectionNotification(submissionData, rejectionReason || 'Photo does not meet our guidelines')
        console.log(`📧 Rejection notification sent to ${submission.submitterEmail}`)
      }
    } catch (error) {
      console.error('Failed to send status notification email:', error)
    }
    
    return true
  } catch (error) {
    console.error('Failed to update photo status:', error)
    return false
  }
}

// Get all pending photos for admin review
export async function getPendingPhotos(): Promise<PhotoSubmission[]> {
  try {
    return Array.from(photoSubmissions.values())
      .filter(photo => photo.status === 'pending')
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  } catch (error) {
    console.error('Failed to get pending photos:', error)
    return []
  }
}
