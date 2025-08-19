// Farm Photos API - Local Storage Implementation
// PuredgeOS 3.0 Compliant Photo Management

import { NextRequest, NextResponse } from 'next/server'
import { 
  savePhotoSubmission, 
  getFarmPhotos,
  getPendingPhotos
} from '@/lib/photo-storage'

// POST - Submit New Photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.farmSlug || !body.farmName || !body.submitterName || 
        !body.submitterEmail || !body.photoData || (!body.description && !body.photoDescription)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Normalize field names
    const submissionData = {
      ...body,
      description: body.description || body.photoDescription
    }
    
    // Save photo submission
    const result = await savePhotoSubmission(submissionData)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        submissionId: result.submissionId,
        message: 'Photo submitted successfully! It will be reviewed by our team.'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Photo submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get Photos for a Farm or All Pending Photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmSlug = searchParams.get('farmSlug')
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | undefined
    
    // If no farm slug but status is pending, get all pending photos for admin
    if (!farmSlug && status === 'pending') {
      const pendingPhotos = await getPendingPhotos()
      return NextResponse.json({
        photos: pendingPhotos,
        total: pendingPhotos.length,
        status: 'pending'
      })
    }
    
    // Farm slug is required for other queries
    if (!farmSlug) {
      return NextResponse.json(
        { error: 'Farm slug is required' },
        { status: 400 }
      )
    }
    
    // Get photos for the farm
    const photos = await getFarmPhotos(farmSlug, status)
    
    return NextResponse.json({
      photos,
      total: photos.length,
      farmSlug,
      status: status || 'all'
    })
    
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
