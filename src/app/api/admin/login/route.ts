import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate input
    if (!email || !password) {
      return NextResponse.redirect(new URL('/admin/login?error=missing-credentials', request.url))
    }

    // Authenticate user
    const result = await authenticateAdmin(email, password)

    if (result.success) {
      // Redirect to admin dashboard on success
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      // Redirect back to login with error
      return NextResponse.redirect(new URL(`/admin/login?error=invalid-credentials`, request.url))
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.redirect(new URL('/admin/login?error=server-error', request.url))
  }
}
