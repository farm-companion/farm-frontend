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
    
    // Ensure photos directory exists
    const photosDir = path.join(process.cwd(), 'data', 'photos')
    try {
      await fs.access(photosDir)
    } catch {
      await fs.mkdir(photosDir, { recursive: true })
    }
    
    // Save photo file
    const photoFileName = `${submissionId}.jpg`
    const photoPath = path.join(photosDir, photoFileName)
    
    // Convert base64 to buffer and save
    const base64Data = body.photoData.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    await writeFile(photoPath, buffer)
    
    // Save submission metadata
    const submissionsDir = path.join(process.cwd(), 'data', 'photo-submissions')
    try {
      await fs.access(submissionsDir)
    } catch {
      await fs.mkdir(submissionsDir, { recursive: true })
    }
    
    const submissionPath = path.join(submissionsDir, `${submissionId}.json`)
    await fs.writeFile(submissionPath, JSON.stringify(submission, null, 2))
    
    // Log submission for admin review
    console.log('📸 PHOTO SUBMISSION:', {
      id: submissionId,
      farm: submission.farmName,
      submitter: submission.submitterName,
      email: submission.submitterEmail,
      description: submission.photoDescription,
      submittedAt: submission.submittedAt
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
    
    // Get approved photos for the farm
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
