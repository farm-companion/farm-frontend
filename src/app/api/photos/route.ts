// Farm Photos API - Connected to farm-photos system
// PuredgeOS 3.0 Compliant Photo Management

import { NextRequest, NextResponse } from 'next/server'

import { getFarmPhotosApiUrl } from '@/config/farm-photos'

// POST - Submit New Photo (Proxy to farm-photos system)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the farm-photos system
    const response = await fetch(getFarmPhotosApiUrl('api/photos'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const result = await response.json()
    
    return NextResponse.json(result, { status: response.status })
    
  } catch (error) {
    console.error('Photo submission error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process photo submission. Please try again.'
      },
      { status: 500 }
    )
  }
}

// GET - Get Photos for a Farm (Proxy to farm-photos system)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmSlug = searchParams.get('farmSlug')
    const status = searchParams.get('status')
    
    if (!farmSlug) {
      return NextResponse.json(
        { error: 'Farm slug is required' },
        { status: 400 }
      )
    }
    
    // Build query string
    const queryParams = new URLSearchParams({ farmSlug })
    if (status) {
      queryParams.append('status', status)
    }
    
    // Forward the request to the farm-photos system
    const response = await fetch(`${getFarmPhotosApiUrl('api/photos')}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const result = await response.json()
    
    return NextResponse.json(result, { status: response.status })
    
  } catch (error) {
    console.error('Error fetching photos:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
