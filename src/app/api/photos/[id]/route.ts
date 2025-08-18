import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// PuredgeOS 3.0 Photo Serving API
// Serves approved user-submitted photos with security and performance optimizations

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id
    
    // Validate photo ID format
    if (!photoId || !photoId.startsWith('photo_')) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      )
    }
    
    // Check if photo is approved
    const submissionsDir = path.join(process.cwd(), 'data', 'photo-submissions')
    const submissionPath = path.join(submissionsDir, `${photoId}.json`)
    
    try {
      const submissionContent = await fs.readFile(submissionPath, 'utf-8')
      const submission = JSON.parse(submissionContent)
      
      if (submission.status !== 'approved') {
        return NextResponse.json(
          { error: 'Photo not approved' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }
    
    // Serve the photo file
    const photosDir = path.join(process.cwd(), 'data', 'photos')
    const photoPath = path.join(photosDir, `${photoId}.jpg`)
    
    try {
      const photoBuffer = await fs.readFile(photoPath)
      
      return new NextResponse(photoBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      })
    } catch {
      return NextResponse.json(
        { error: 'Photo file not found' },
        { status: 404 }
      )
    }
    
  } catch (error) {
    console.error('❌ Error serving photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
