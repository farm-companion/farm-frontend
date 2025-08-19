// Farm Photos API - Individual Photo Endpoint
// PuredgeOS 3.0 Compliant Photo Management

import { NextRequest, NextResponse } from 'next/server'
import { 
  getPhotoSubmission, 
  updatePhotoStatus 
} from '@/lib/photo-storage'

// GET - Get Photo Details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: photoId } = await params
    
    // Validate photo ID format
    if (!photoId || !photoId.startsWith('photo_')) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      )
    }
    
    // Get photo submission
    const submission = await getPhotoSubmission(photoId)
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(submission)
    
  } catch (error) {
    console.error('Error fetching photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update Photo Status (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: photoId } = await params
    const body = await request.json()
    
    // Validate photo ID format
    if (!photoId || !photoId.startsWith('photo_')) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    if (!body.status || !['approved', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }
    
    if (!body.reviewedBy) {
      return NextResponse.json(
        { error: 'Reviewer information is required' },
        { status: 400 }
      )
    }
    
    // Update photo status
    const success = await updatePhotoStatus(
      photoId,
      body.status,
      body.reviewedBy,
      body.rejectionReason
    )
    
    if (!success) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Photo ${body.status} successfully`
    })
    
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
