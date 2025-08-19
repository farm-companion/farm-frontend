// Farm Photos API - Individual Photo Endpoint
// PuredgeOS 3.0 Compliant Photo Management

import { NextRequest, NextResponse } from 'next/server'

import { getFarmPhotosApiUrl } from '@/config/farm-photos'

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
    
    // Forward the request to the farm-photos system
    const response = await fetch(getFarmPhotosApiUrl(`api/photos/${photoId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: response.status }
      )
    }
    
    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
    
  } catch (error) {
    console.error('Error serving photo:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
