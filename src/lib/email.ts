// Email Service for Farm Frontend
// Resend Integration for Photo Submissions

import { Resend } from 'resend'

// Initialize Resend only when API key is available
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  console.log('🔑 Resend API Key available:', apiKey ? 'YES' : 'NO')
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found in environment variables')
    return null
  }
  return new Resend(apiKey)
}

// Email Configuration
const EMAIL_CONFIG = {
  from: 'Farm Companion <photos@farmcompanion.co.uk>',
  replyTo: 'hello@farmcompanion.co.uk',
  // Update this to your actual admin email address
  adminEmail: process.env.ADMIN_EMAIL || 'hello@farmcompanion.co.uk'
} as const

interface PhotoSubmissionData {
  submissionId: string
  farmSlug: string
  farmName: string
  submitterName: string
  submitterEmail: string
  description: string
  submittedAt: string
}

// Test email function for debugging
export async function testEmailService(): Promise<boolean> {
  try {
    console.log('🧪 Testing email service...')
    
    const resend = getResend()
    if (!resend) {
      console.log('❌ Cannot test email service - no Resend API key')
      return false
    }
    
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: ['test@example.com'],
      subject: 'Test Email - Farm Companion',
      html: '<p>This is a test email from Farm Companion</p>',
      replyTo: EMAIL_CONFIG.replyTo
    })
    
    console.log('✅ Test email sent successfully:', result.data?.id)
    return true
    
  } catch (error) {
    console.error('❌ Test email failed:', error)
    return false
  }
}

// Send confirmation email to photo submitter
export async function sendPhotoSubmissionConfirmation(
  submission: PhotoSubmissionData
): Promise<boolean> {
  try {
    console.log(`📧 Sending confirmation email to ${submission.submitterEmail}`)
    
    const resend = getResend()
    if (!resend) {
      console.log('📧 Resend API key not configured, skipping email')
      return true
    }
    
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Photo Submission Confirmation - Farm Companion</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa; color: #1E1F23;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00C2B2 0%, #00A896 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">📸 Photo Submission Received</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Thank you for sharing your farm experience!</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; border: 1px solid #e0e0e0; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; color: #1E1F23; margin-bottom: 24px; line-height: 1.6;">Hello ${submission.submitterName},</p>
            
            <p style="font-size: 16px; color: #1E1F23; margin-bottom: 24px; line-height: 1.6;">
              Thank you for submitting a photo for <strong style="color: #00C2B2;">${submission.farmName}</strong> to Farm Companion! 
              We're excited to showcase your contribution to our community.
            </p>
            
            <!-- Submission Details Card -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 24px; border-radius: 12px; margin: 32px 0; border-left: 4px solid #00C2B2; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 16px 0; color: #00C2B2; font-size: 20px; font-weight: 600;">Submission Details</h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #1E1F23;">Farm:</span>
                  <span style="color: #1E1F23;">${submission.farmName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span style="font-weight: 600; color: #1E1F23;">Description:</span>
                  <span style="color: #1E1F23; text-align: right; max-width: 60%;">${submission.description}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #1E1F23;">Submission ID:</span>
                  <code style="background: #e9ecef; padding: 4px 8px; border-radius: 6px; font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; color: #1E1F23;">${submission.submissionId}</code>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #1E1F23;">Submitted:</span>
                  <span style="color: #1E1F23;">${new Date(submission.submittedAt).toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
            
            <!-- Next Steps -->
            <h3 style="color: #00C2B2; font-size: 20px; font-weight: 600; margin: 32px 0 16px 0;">What happens next?</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ol style="color: #1E1F23; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Our team will review your photo for quality and appropriateness</li>
                <li style="margin-bottom: 8px;">High-quality photos may be automatically approved</li>
                <li style="margin-bottom: 8px;">Others will be reviewed within 24-48 hours</li>
                <li style="margin-bottom: 0;">You'll receive an email notification of the decision</li>
              </ol>
            </div>
            
            <p style="font-size: 16px; color: #1E1F23; margin: 24px 0; line-height: 1.6;">
              If approved, your photo will appear on the farm's page for visitors to see and help others discover amazing farm experiences!
            </p>
            
            <!-- Action Card -->
            <div style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #28a745; box-shadow: 0 2px 8px rgba(40,167,69,0.1);">
              <p style="margin: 0; color: #155724; font-weight: 500;">
                <strong>Need to make changes?</strong> Reply to this email if you need to update your submission or have any questions.
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://farmcompanion.co.uk" style="background: linear-gradient(135deg, #00C2B2 0%, #00A896 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,194,178,0.3); transition: all 0.2s ease;">Visit Farm Companion</a>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">
                Best regards,<br>
                <strong>The Farm Companion Team</strong>
              </p>
              <a href="mailto:hello@farmcompanion.co.uk" style="color: #00C2B2; text-decoration: none; font-weight: 500;">hello@farmcompanion.co.uk</a>
            </div>
            
            <!-- Privacy & Legal Section -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 32px; border: 1px solid #e0e0e0;">
              <h4 style="color: #1E1F23; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Privacy & Legal Information</h4>
              <div style="font-size: 12px; color: #666; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;">
                  <strong>Data Protection:</strong> Your personal data is processed in accordance with our Privacy Policy and applicable data protection laws. 
                  We use your email address solely to communicate about your photo submission and provide service updates.
                </p>
                <p style="margin: 0 0 8px 0;">
                  <strong>Photo Usage:</strong> By submitting this photo, you grant Farm Companion a non-exclusive license to display the image on our platform. 
                  You retain ownership of your photo and can request removal at any time.
                </p>
                <p style="margin: 0 0 8px 0;">
                  <strong>Opt-out:</strong> You can unsubscribe from these notifications by replying with "UNSUBSCRIBE" or updating your preferences at 
                  <a href="https://farmcompanion.co.uk/privacy" style="color: #00C2B2;">farmcompanion.co.uk/privacy</a>.
                </p>
                <p style="margin: 0;">
                  <strong>Contact:</strong> For privacy concerns, contact our Data Protection Officer at 
                  <a href="mailto:privacy@farmcompanion.co.uk" style="color: #00C2B2;">privacy@farmcompanion.co.uk</a>.
                </p>
              </div>
            </div>
            
            <!-- Company Footer -->
            <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} Farm Companion. All rights reserved.<br>
                <a href="https://farmcompanion.co.uk/terms" style="color: #999;">Terms of Service</a> | 
                <a href="https://farmcompanion.co.uk/privacy" style="color: #999;">Privacy Policy</a> | 
                <a href="https://farmcompanion.co.uk/contact" style="color: #999;">Contact Us</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [submission.submitterEmail],
      subject: `Photo Submitted Successfully - ${submission.farmName}`,
      html: emailContent,
      replyTo: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Email sent successfully: ${result.data?.id || 'unknown'}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error)
    return false
  }
}

// Send admin notification for new photo submission
export async function sendAdminPhotoNotification(
  submission: PhotoSubmissionData
): Promise<boolean> {
  try {
    console.log(`📧 Sending admin notification for photo submission: ${submission.submissionId}`)
    
    const resend = getResend()
    if (!resend) {
      console.log('📧 Resend API key not configured, skipping admin notification')
      return true
    }
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📸 New Photo Submission</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            A new photo has been submitted and requires review.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="margin-top: 0; color: #dc3545;">Submission Details</h3>
            <p style="margin: 8px 0;"><strong>Farm:</strong> ${submission.farmName}</p>
            <p style="margin: 8px 0;"><strong>Submitter:</strong> ${submission.submitterName} (${submission.submitterEmail})</p>
            <p style="margin: 8px 0;"><strong>Description:</strong> ${submission.description}</p>
            <p style="margin: 8px 0;"><strong>Submission ID:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${submission.submissionId}</code></p>
            <p style="margin: 8px 0;"><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleDateString('en-GB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://farmcompanion.co.uk/admin/photos" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Review Submission</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; margin: 0;">
            This is an automated notification from the Farm Photos system.
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [EMAIL_CONFIG.adminEmail],
      subject: `[Farm Photos] New Submission: ${submission.farmName}`,
      html: emailContent,
      replyTo: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Admin notification sent successfully: ${result.data?.id || 'unknown'}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send admin notification:', error)
    return false
  }
}

// Send approval notification
export async function sendApprovalNotification(
  submission: PhotoSubmissionData
): Promise<boolean> {
  try {
    console.log(`📧 Sending approval notification to ${submission.submitterEmail}`)
    
    const resend = getResend()
    if (!resend) {
      console.log('📧 Resend API key not configured, skipping approval notification')
      return true
    }
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Photo Approved!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello ${submission.submitterName},</p>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Great news! Your photo for <strong style="color: #28a745;">${submission.farmName}</strong> has been approved and is now live on Farm Companion!
          </p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #28a745;">Approved Photo Details</h3>
            <p style="margin: 8px 0;"><strong>Farm:</strong> ${submission.farmName}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong> ${submission.description}</p>
            <p style="margin: 8px 0;"><strong>Submission ID:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${submission.submissionId}</code></p>
          </div>
          
          <p style="font-size: 16px; color: #333; margin: 20px 0;">
            Your photo is now visible to visitors on the farm's page. Thank you for contributing to our community!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://farmcompanion.co.uk/shop/${submission.farmSlug}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Farm Page</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>The Farm Companion Team</strong><br>
            <a href="mailto:hello@farmcompanion.co.uk" style="color: #28a745;">hello@farmcompanion.co.uk</a>
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [submission.submitterEmail],
      subject: `Photo Approved - ${submission.farmName}`,
      html: emailContent,
      replyTo: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Approval notification sent successfully: ${result.data?.id || 'unknown'}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send approval notification:', error)
    return false
  }
}

// Send rejection notification
export async function sendRejectionNotification(
  submission: PhotoSubmissionData,
  rejectionReason: string
): Promise<boolean> {
  try {
    console.log(`📧 Sending rejection notification to ${submission.submitterEmail}`)
    
    const resend = getResend()
    if (!resend) {
      console.log('📧 Resend API key not configured, skipping rejection notification')
      return true
    }
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">❌ Photo Not Approved</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello ${submission.submitterName},</p>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            We've reviewed your photo submission for <strong style="color: #dc3545;">${submission.farmName}</strong>, but unfortunately it doesn't meet our current guidelines.
          </p>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="margin-top: 0; color: #dc3545;">Feedback</h3>
            <p style="margin: 8px 0; color: #721c24;">${rejectionReason}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Submission Details</h3>
            <p style="margin: 8px 0;"><strong>Farm:</strong> ${submission.farmName}</p>
            <p style="margin: 8px 0;"><strong>Description:</strong> ${submission.description}</p>
            <p style="margin: 8px 0;"><strong>Submission ID:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${submission.submissionId}</code></p>
          </div>
          
          <p style="font-size: 16px; color: #333; margin: 20px 0;">
            You're welcome to submit a new photo that addresses the feedback above. We appreciate your contribution to Farm Companion!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://farmcompanion.co.uk/shop/${submission.farmSlug}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Submit New Photo</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>The Farm Companion Team</strong><br>
            <a href="mailto:hello@farmcompanion.co.uk" style="color: #dc3545;">hello@farmcompanion.co.uk</a>
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [submission.submitterEmail],
      subject: `Photo Not Approved - ${submission.farmName}`,
      html: emailContent,
      replyTo: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Rejection notification sent successfully: ${result.data?.id || 'unknown'}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send rejection notification:', error)
    return false
  }
}
