// Test Email API Endpoint
// For debugging email functionality

import { NextRequest, NextResponse } from 'next/server'
import { testEmailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing email service via API...')
    
    const success = await testEmailService()
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check your email and server logs.'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email. Check server logs for details.'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Test email API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error during email test',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint. Use POST to test email functionality.',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyLength: process.env.RESEND_API_KEY?.length || 0
    }
  })
}
