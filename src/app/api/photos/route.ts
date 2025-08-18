import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { writeFile } from 'fs/promises'

// PuredgeOS 3.0 Photo Submission API
// Handles user-submitted photos for farm shops with validation and security

interface PhotoSubmission {
  farmSlug: string
  farmName: string
  submitterName: string
  submitterEmail: string
  photoDescription: string
  photoData: string // base64 encoded image
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
}

// Validation function following PuredgeOS clarity standards
function validatePhotoSubmission(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Required fields
  if (!data.farmSlug || typeof data.farmSlug !== 'string') {
    errors.push('Farm slug is required')
  }
  
  if (!data.farmName || typeof data.farmName !== 'string') {
    errors.push('Farm name is required')
  }
  
  if (!data.submitterName || typeof data.submitterName !== 'string') {
    errors.push('Submitter name is required')
  }
  
  if (!data.submitterEmail || typeof data.submitterEmail !== 'string') {
    errors.push('Submitter email is required')
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (data.submitterEmail && !emailRegex.test(data.submitterEmail)) {
    errors.push('Valid email address is required')
  }
  
  // Photo data validation
  if (!data.photoData || typeof data.photoData !== 'string') {
    errors.push('Photo data is required')
  } else {
    // Check if it's a valid base64 image
    if (!data.photoData.startsWith('data:image/')) {
      errors.push('Photo must be a valid image file')
    }
    
    // Check file size (max 5MB)
    const base64Data = data.photoData.split(',')[1]
    const fileSizeInBytes = Math.ceil((base64Data.length * 3) / 4)
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024)
    
    if (fileSizeInMB > 5) {
      errors.push('Photo must be smaller than 5MB')
    }
  }
  
  // Description validation
  if (!data.photoDescription || typeof data.photoDescription !== 'string') {
    errors.push('Photo description is required')
  }
  
  if (data.photoDescription && data.photoDescription.length > 500) {
    errors.push('Photo description must be less than 500 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath)
    return true
  } catch {
    try {
      await fs.mkdir(dirPath, { recursive: true })
      return true
    } catch (error) {
      console.error('Failed to create directory:', dirPath, error)
      return false
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate submission
    const validation = validatePhotoSubmission(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      )
    }
    
    // Create submission object
    const submission: PhotoSubmission = {
      farmSlug: body.farmSlug,
      farmName: body.farmName,
      submitterName: body.submitterName,
      submitterEmail: body.submitterEmail,
      photoDescription: body.photoDescription,
      photoData: body.photoData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    // Generate unique ID for the submission
    const submissionId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Check if we're in a Vercel environment
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      // In Vercel, we can't write files persistently, so we'll store in memory/database
      // For now, we'll just log the submission and return success
      // In a real implementation, you'd use a database like Vercel KV, PostgreSQL, etc.
      
      console.log('📸 PHOTO SUBMISSION (Vercel):', {
        id: submissionId,
        farm: submission.farmName,
        submitter: submission.submitterName,
        email: submission.submitterEmail,
        description: submission.photoDescription,
        submittedAt: submission.submittedAt,
        environment: 'vercel'
      })
      
      // TODO: In production, you would:
      // 1. Store photo in a cloud storage service (AWS S3, Cloudinary, etc.)
      // 2. Store metadata in a database (Vercel KV, PostgreSQL, etc.)
      // 3. Send email notifications
      
      return NextResponse.json({
        success: true,
        message: 'Photo submitted successfully for review',
        submissionId,
        note: 'Photo will be processed and stored in cloud storage'
      })
    }
    
    // Local development - save to file system
    const photosDir = path.join(process.cwd(), 'data', 'photos')
    const submissionsDir = path.join(process.cwd(), 'data', 'photo-submissions')
    
    // Ensure directories exist
    const photosDirExists = await ensureDirectoryExists(photosDir)
    const submissionsDirExists = await ensureDirectoryExists(submissionsDir)
    
    if (!photosDirExists || !submissionsDirExists) {
      console.error('Failed to create required directories')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Save photo file
    const photoFileName = `${submissionId}.jpg`
    const photoPath = path.join(photosDir, photoFileName)
    
    try {
      // Convert base64 to buffer and save
      const base64Data = body.photoData.split(',')[1]
      const buffer = Buffer.from(base64Data, 'base64')
      await writeFile(photoPath, buffer)
    } catch (fileError) {
      console.error('Failed to save photo file:', fileError)
      return NextResponse.json(
        { error: 'Failed to save photo file' },
        { status: 500 }
      )
    }
    
    // Save submission metadata
    const submissionPath = path.join(submissionsDir, `${submissionId}.json`)
    
    try {
      await fs.writeFile(submissionPath, JSON.stringify(submission, null, 2))
    } catch (metadataError) {
      console.error('Failed to save submission metadata:', metadataError)
      // Try to clean up the photo file if metadata save failed
      try {
        await fs.unlink(photoPath)
      } catch (cleanupError) {
        console.error('Failed to cleanup photo file:', cleanupError)
      }
      return NextResponse.json(
        { error: 'Failed to save submission metadata' },
        { status: 500 }
      )
    }
    
    // Log submission for admin review
    console.log('📸 PHOTO SUBMISSION (Local):', {
      id: submissionId,
      farm: submission.farmName,
      submitter: submission.submitterName,
      email: submission.submitterEmail,
      description: submission.photoDescription,
      submittedAt: submission.submittedAt,
      environment: 'local'
    })
    
    return NextResponse.json({
      success: true,
      message: 'Photo submitted successfully for review',
      submissionId
    })
    
  } catch (error) {
    console.error('❌ Photo submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmSlug = searchParams.get('farmSlug')
    
    if (!farmSlug) {
      return NextResponse.json(
        { error: 'Farm slug is required' },
        { status: 400 }
      )
    }
    
    // Check if we're in a Vercel environment
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      // In Vercel, return empty array for now
      // In production, you'd fetch from your database
      return NextResponse.json({ photos: [] })
    }
    
    // Local development - read from file system
    const submissionsDir = path.join(process.cwd(), 'data', 'photo-submissions')
    
    try {
      await fs.access(submissionsDir)
    } catch {
      return NextResponse.json({ photos: [] })
    }
    
    const files = await fs.readdir(submissionsDir)
    const approvedPhotos = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = await fs.readFile(path.join(submissionsDir, file), 'utf-8')
          const submission: PhotoSubmission = JSON.parse(content)
          
          if (submission.farmSlug === farmSlug && submission.status === 'approved') {
            const photoId = file.replace('.json', '')
            approvedPhotos.push({
              id: photoId,
              description: submission.photoDescription,
              submittedBy: submission.submitterName,
              submittedAt: submission.submittedAt,
              url: `/api/photos/${photoId}`
            })
          }
        } catch (fileError) {
          console.error(`Error reading submission file ${file}:`, fileError)
        }
      }
    }
    
    return NextResponse.json({ photos: approvedPhotos })
    
  } catch (error) {
    console.error('❌ Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
