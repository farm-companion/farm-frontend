import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login - Farm Companion',
  description: 'Secure admin access for Farm Companion',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  // Redirect if already authenticated
  if (await isAuthenticated()) {
    redirect('/admin')
  }

  const params = await searchParams
  const errorMessage = params.error ? {
    'missing-credentials': 'Please enter both email and password.',
    'invalid-credentials': 'Invalid email or password. Please try again.',
    'server-error': 'Server error. Please try again later.',
  }[params.error] || 'An error occurred. Please try again.' : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-brand-primary rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the Farm Companion admin panel
          </p>
        </div>
        
        <AdminLoginForm errorMessage={errorMessage} />
        
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            ← Back to Farm Companion
          </Link>
        </div>
      </div>
    </div>
  )
}
