// Email Service for Farm Frontend
// Resend Integration for Photo Submissions

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email Configuration
const EMAIL_CONFIG = {
  from: 'Farm Companion <photos@farmcompanion.co.uk>',
  replyTo: 'hello@farmcompanion.co.uk',
  adminEmail: 'hello@farmcompanion.co.uk'
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

// Send confirmation email to photo submitter
export async function sendPhotoSubmissionConfirmation(
  submission: PhotoSubmissionData
): Promise<boolean> {
  try {
    console.log(`📧 Sending confirmation email to ${submission.submitterEmail}`)
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #00C2B2 0%, #00A896 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📸 Photo Submission Received</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello ${submission.submitterName},</p>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Thank you for submitting a photo for <strong style="color: #00C2B2;">${submission.farmName}</strong> to Farm Companion!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00C2B2;">
            <h3 style="margin-top: 0; color: #00C2B2;">Submission Details</h3>
            <p style="margin: 8px 0;"><strong>Farm:</strong> ${submission.farmName}</p>
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
          
          <h3 style="color: #00C2B2;">What happens next?</h3>
          <ol style="color: #333; line-height: 1.6;">
            <li>Our team will review your photo for quality and appropriateness</li>
            <li>High-quality photos may be automatically approved</li>
            <li>Others will be reviewed within 24-48 hours</li>
            <li>You'll receive an email notification of the decision</li>
          </ol>
          
          <p style="font-size: 16px; color: #333; margin: 20px 0;">
            If approved, your photo will appear on the farm's page for visitors to see!
          </p>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724;"><strong>Need to make changes?</strong> Reply to this email if you need to update your submission.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://farmcompanion.co.uk" style="background: #00C2B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Visit Farm Companion</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>The Farm Companion Team</strong><br>
            <a href="mailto:hello@farmcompanion.co.uk" style="color: #00C2B2;">hello@farmcompanion.co.uk</a>
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [submission.submitterEmail],
      subject: `Photo Submitted Successfully - ${submission.farmName}`,
      html: emailContent,
      reply_to: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Email sent successfully: ${result.id}`)
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
      reply_to: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Admin notification sent successfully: ${result.id}`)
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
      reply_to: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Approval notification sent successfully: ${result.id}`)
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
      reply_to: EMAIL_CONFIG.replyTo
    })

    console.log(`✅ Rejection notification sent successfully: ${result.id}`)
    return true

  } catch (error) {
    console.error('❌ Failed to send rejection notification:', error)
    return false
  }
}
