import Link from 'next/link'
import fs from 'fs/promises'
import path from 'path'
import Image from 'next/image'

interface PhotoSubmission {
  id?: string
  farmSlug: string
  farmName: string
  submitterName: string
  submitterEmail: string
  photoDescription: string
  photoData: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
}

async function loadPhotoSubmissions(): Promise<PhotoSubmission[]> {
  try {
    const submissionsDir = path.join(process.cwd(), 'data', 'photo-submissions')
    
    // Check if directory exists
    try {
      await fs.access(submissionsDir)
    } catch {
      // Directory doesn't exist, return empty array
      return []
    }
    
    const files = await fs.readdir(submissionsDir)
    
    const submissions = []
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = await fs.readFile(path.join(submissionsDir, file), 'utf-8')
          const submission = JSON.parse(content)
          submission.id = file.replace('.json', '')
          submissions.push(submission)
        } catch (fileError) {
          console.error(`Error reading submission file ${file}:`, fileError)
          // Continue with other files
        }
      }
    }
    
    // Sort by submission date (newest first)
    return submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  } catch (error) {
    console.error('Error loading photo submissions:', error)
    return []
  }
}

export default async function AdminPhotosPage() {
  const submissions = await loadPhotoSubmissions()
  
  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const approvedSubmissions = submissions.filter(s => s.status === 'approved')
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected')

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading">Photo Submissions</h1>
        <p className="mt-2 text-text-muted">
          Review and manage user-submitted photos for farm shops
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-primary mb-1">
            {pendingSubmissions.length}
          </div>
          <div className="text-text-muted">Pending Review</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {approvedSubmissions.length}
          </div>
          <div className="text-text-muted">Approved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {rejectedSubmissions.length}
          </div>
          <div className="text-text-muted">Rejected</div>
        </div>
      </div>

      {/* Pending Submissions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-heading mb-6">
          Pending Review ({pendingSubmissions.length})
        </h2>
        
        {pendingSubmissions.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-text-muted">
              <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No photos pending review</p>
              <p className="text-sm">New photo submissions will appear here</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="card">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Photo Preview */}
                  <div>
                    <h3 className="font-semibold text-text-heading mb-2">Photo Preview</h3>
                    <div className="relative aspect-video bg-background-surface rounded-lg overflow-hidden">
                      <Image
                        src={submission.photoData}
                        alt={submission.photoDescription}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Submission Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-text-heading mb-2">Submission Details</h3>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="font-medium text-text-muted">Farm:</dt>
                          <dd className="text-text-heading">
                            <Link href={`/shop/${submission.farmSlug}`} className="link">
                              {submission.farmName}
                            </Link>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-text-muted">Submitted by:</dt>
                          <dd className="text-text-heading">{submission.submitterName}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-text-muted">Email:</dt>
                          <dd className="text-text-heading">
                            <a href={`mailto:${submission.submitterEmail}`} className="link">
                              {submission.submitterEmail}
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-text-muted">Submitted:</dt>
                          <dd className="text-text-heading">
                            {new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-text-muted">Description:</dt>
                          <dd className="text-text-heading">{submission.photoDescription}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          // TODO: Implement approve functionality
                          console.log('Approve submission:', submission.id)
                        }}
                      >
                        Approve Photo
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          // TODO: Implement reject functionality
                          console.log('Reject submission:', submission.id)
                        }}
                      >
                        Reject Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved Submissions */}
      {approvedSubmissions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-heading mb-6">
            Recently Approved ({approvedSubmissions.length})
          </h2>
          <div className="grid gap-4">
            {approvedSubmissions.slice(0, 5).map((submission) => (
              <div key={submission.id} className="card">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-background-surface rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={submission.photoData}
                      alt={submission.photoDescription}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-heading truncate">
                      {submission.farmName}
                    </h3>
                    <p className="text-sm text-text-muted truncate">
                      {submission.photoDescription}
                    </p>
                    <p className="text-xs text-text-muted">
                      By {submission.submitterName} • {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <Link href="/admin" className="btn-secondary">
          ← Back to Admin
        </Link>
        <Link href="/admin/claims" className="btn-secondary">
          View Claims →
        </Link>
      </div>
    </main>
  )
}
