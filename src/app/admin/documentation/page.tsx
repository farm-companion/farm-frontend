import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Documentation - Farm Companion',
  description: 'Comprehensive guide for Farm Companion administrators',
}

export default function AdminDocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Farm Companion Admin Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Complete guide for managing the Farm Companion platform
            </p>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/admin"
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Admin Dashboard</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Main admin control panel</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/photos"
                className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-900 dark:text-green-100">Photo Management</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Review and manage farm photos</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/claims"
                className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Claims Management</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Handle farm ownership claims</p>
                </div>
              </Link>
              
              <Link 
                href="/admin/login"
                className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">Admin Login</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Secure admin authentication</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-8">
            {/* Authentication & Security */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🔐 Authentication & Security
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Admin Login</h3>
                <ul>
                  <li><strong>URL:</strong> <code>/admin/login</code></li>
                  <li><strong>Email:</strong> <code>hello@farmcompanion.co.uk</code></li>
                  <li><strong>Password:</strong> <code>mifxa2-ziwdyc-vEbkov</code></li>
                  <li><strong>Session Duration:</strong> 24 hours</li>
                  <li><strong>Security:</strong> HTTP-only cookies, secure session management</li>
                </ul>
                
                <h3>Security Features</h3>
                <ul>
                  <li>Environment variable-based credentials</li>
                  <li>Automatic session expiration</li>
                  <li>Secure cookie handling</li>
                  <li>CSRF protection</li>
                  <li>Rate limiting on login attempts</li>
                </ul>
              </div>
            </section>

            {/* Photo Management */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                📸 Photo Management System
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Photo Review Process</h3>
                <ol>
                  <li><strong>Submission:</strong> Users submit photos via the main site</li>
                  <li><strong>Pending Review:</strong> Photos appear in admin panel under &quot;Pending&quot;</li>
                  <li><strong>Approval:</strong> Admins can approve, reject, or request changes</li>
                  <li><strong>Publication:</strong> Approved photos appear on the farm&apos;s page</li>
                </ol>

                <h3>Photo Actions</h3>
                <ul>
                  <li><strong>Approve:</strong> Accept photo for publication</li>
                  <li><strong>Reject:</strong> Decline photo with reason</li>
                  <li><strong>Request Changes:</strong> Ask user to modify photo</li>
                  <li><strong>Delete:</strong> Remove photo permanently (with 4-hour recovery window)</li>
                </ul>

                <h3>Deletion System</h3>
                <ul>
                  <li><strong>Soft Delete:</strong> Photos are marked as deleted but not immediately removed</li>
                  <li><strong>Recovery Window:</strong> 4 hours to recover accidentally deleted photos</li>
                  <li><strong>Permanent Deletion:</strong> After 4 hours, photos are permanently removed</li>
                  <li><strong>Deletion Requests:</strong> Users can request photo removal with reason</li>
                </ul>

                <h3>Email Notifications</h3>
                <ul>
                  <li>Photo approval notifications to users</li>
                  <li>Photo rejection notifications with feedback</li>
                  <li>Deletion request notifications to admins</li>
                  <li>Recovery window expiration reminders</li>
                </ul>
              </div>
            </section>

            {/* Claims Management */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🏪 Claims Management System
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Farm Ownership Claims</h3>
                <p>Users can claim ownership of farm listings that don&apos;t have verified owners.</p>
                
                <h3>Claim Process</h3>
                <ol>
                  <li><strong>Submission:</strong> User submits claim with proof of ownership</li>
                  <li><strong>Review:</strong> Admin reviews claim and supporting documents</li>
                  <li><strong>Verification:</strong> Admin verifies ownership through provided evidence</li>
                  <li><strong>Approval/Rejection:</strong> Claim is approved or rejected with feedback</li>
                </ol>

                <h3>Required Documentation</h3>
                <ul>
                  <li>Proof of business ownership</li>
                  <li>Business registration documents</li>
                  <li>Address verification</li>
                  <li>Contact information verification</li>
                </ul>

                <h3>Admin Actions</h3>
                <ul>
                  <li><strong>Approve Claim:</strong> Grant ownership to claimant</li>
                  <li><strong>Reject Claim:</strong> Decline with specific reasons</li>
                  <li><strong>Request More Info:</strong> Ask for additional documentation</li>
                  <li><strong>Contact Claimant:</strong> Direct communication for clarification</li>
                </ul>
              </div>
            </section>

            {/* Dashboard Overview */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                📊 Admin Dashboard
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Overview Statistics</h3>
                <ul>
                  <li><strong>Total Photos:</strong> Count of all photos in the system</li>
                  <li><strong>Pending Reviews:</strong> Photos awaiting admin approval</li>
                  <li><strong>Pending Claims:</strong> Ownership claims awaiting review</li>
                  <li><strong>Recent Activity:</strong> Latest admin actions and user submissions</li>
                </ul>

                <h3>Quick Actions</h3>
                <ul>
                  <li>Review pending photos</li>
                  <li>Process ownership claims</li>
                  <li>View system statistics</li>
                  <li>Access admin settings</li>
                </ul>

                <h3>Navigation</h3>
                <ul>
                  <li><strong>Dashboard:</strong> Main overview and statistics</li>
                  <li><strong>Photos:</strong> Photo management and review</li>
                  <li><strong>Claims:</strong> Ownership claim processing</li>
                  <li><strong>Settings:</strong> Admin configuration (future)</li>
                </ul>
              </div>
            </section>

            {/* Technical Details */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Technical Implementation
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Technology Stack</h3>
                <ul>
                  <li><strong>Framework:</strong> Next.js 15.4.6 with React 19.1.0</li>
                  <li><strong>Styling:</strong> Tailwind CSS v4</li>
                  <li><strong>Language:</strong> TypeScript</li>
                  <li><strong>Database:</strong> Supabase (PostgreSQL)</li>
                  <li><strong>Authentication:</strong> Custom session-based auth</li>
                  <li><strong>Email:</strong> Resend API</li>
                  <li><strong>Deployment:</strong> Vercel</li>
                </ul>

                <h3>Security Implementation</h3>
                <ul>
                  <li>Environment variable-based credentials</li>
                  <li>HTTP-only session cookies</li>
                  <li>CSRF protection</li>
                  <li>Input validation and sanitization</li>
                  <li>Rate limiting on sensitive endpoints</li>
                </ul>

                <h3>API Endpoints</h3>
                <ul>
                  <li><code>/api/admin/login</code> - Admin authentication</li>
                  <li><code>/api/admin/logout</code> - Admin logout</li>
                  <li><code>/api/photos</code> - Photo management</li>
                  <li><code>/api/photos/[id]</code> - Individual photo operations</li>
                  <li><code>/api/photos/deletion-requests</code> - Deletion request handling</li>
                  <li><code>/api/claims</code> - Claims management</li>
                </ul>

                <h3>Environment Variables</h3>
                <ul>
                  <li><code>ADMIN_EMAIL</code> - Admin login email</li>
                  <li><code>ADMIN_PASSWORD</code> - Admin login password</li>
                  <li><code>RESEND_API_KEY</code> - Email service API key</li>
                  <li><code>SUPABASE_URL</code> - Database connection URL</li>
                  <li><code>SUPABASE_ANON_KEY</code> - Database API key</li>
                </ul>
              </div>
            </section>

            {/* Best Practices */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                ✅ Best Practices & Guidelines
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Photo Review Guidelines</h3>
                <ul>
                  <li>Review photos within 24 hours of submission</li>
                  <li>Provide constructive feedback for rejected photos</li>
                  <li>Ensure photos meet quality and content standards</li>
                  <li>Check for inappropriate or copyrighted content</li>
                  <li>Verify photos are relevant to the farm listing</li>
                </ul>

                <h3>Claims Processing</h3>
                <ul>
                  <li>Verify all submitted documentation thoroughly</li>
                  <li>Contact claimants if additional information is needed</li>
                  <li>Process claims within 48 hours when possible</li>
                  <li>Provide clear reasoning for rejected claims</li>
                  <li>Maintain records of all claim decisions</li>
                </ul>

                <h3>Security Best Practices</h3>
                <ul>
                  <li>Never share admin credentials</li>
                  <li>Log out after each session</li>
                  <li>Use secure networks when accessing admin panel</li>
                  <li>Regularly review admin activity logs</li>
                  <li>Report any suspicious activity immediately</li>
                </ul>

                <h3>Communication Guidelines</h3>
                <ul>
                  <li>Be professional and courteous in all communications</li>
                  <li>Provide clear, actionable feedback</li>
                  <li>Respond to user inquiries promptly</li>
                  <li>Maintain consistency in decision-making</li>
                  <li>Document all significant interactions</li>
                </ul>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                🔧 Troubleshooting
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <h3>Common Issues</h3>
                
                <h4>Login Problems</h4>
                <ul>
                  <li><strong>Invalid credentials:</strong> Verify email and password are correct</li>
                  <li><strong>Session expired:</strong> Re-login to refresh session</li>
                  <li><strong>Browser issues:</strong> Clear cookies and cache</li>
                </ul>

                <h4>Photo Management Issues</h4>
                <ul>
                  <li><strong>Photos not loading:</strong> Check internet connection and refresh page</li>
                  <li><strong>Actions not working:</strong> Ensure you&apos;re logged in and have proper permissions</li>
                  <li><strong>Email notifications:</strong> Verify email service is configured correctly</li>
                </ul>

                <h4>System Performance</h4>
                <ul>
                  <li><strong>Slow loading:</strong> Check system resources and database performance</li>
                  <li><strong>Timeout errors:</strong> Contact technical support for investigation</li>
                  <li><strong>Data inconsistencies:</strong> Refresh page and verify with database</li>
                </ul>

                <h3>Support Contacts</h3>
                <ul>
                  <li><strong>Technical Issues:</strong> Contact development team</li>
                  <li><strong>Content Questions:</strong> Contact content management team</li>
                  <li><strong>Security Concerns:</strong> Contact security team immediately</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()} | 
              Version: 1.0.0 | 
              <Link href="/admin" className="text-brand-primary hover:text-brand-primary/80 ml-2">
                Back to Admin Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
