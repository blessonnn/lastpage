import emailjs from '@emailjs/browser';

// ========================================================
// EmailJS Configuration
// ========================================================
// You need to set these up at https://www.emailjs.com/
//
// 1. Create a free account at emailjs.com
// 2. Go to "Email Services" → Add Gmail service → connect your Gmail
// 3. Go to "Email Templates" → Create a template with these variables:
//    - {{user_name}}   → the friend's name
//    - {{message}}     → the notification message
//    - {{to_email}}    → your email (jeyk7402@gmail.com)
//
//    Example template:
//    Subject: 🔔 New Memory on Lastpage!
//    Body:
//      Hey! {{user_name}} just added a new memory to your Lastpage.
//      {{message}}
//      Go check it out!
//
// 4. Go to "Account" → copy your Public Key
// 5. Fill in the IDs below:
// ========================================================

const EMAILJS_SERVICE_ID = 'service_rgiauyl';     // e.g., 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_w154yh3';   // e.g., 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'Lj1wiI814OpecT8df';      // e.g., 'AbCdEfGhIjKlMn'

const ADMIN_EMAIL = 'jeyk7402@gmail.com';

/**
 * Send an email notification when a new memory is added.
 * This runs silently — it won't block or break the submission if it fails.
 */
export const sendNewMemoryNotification = async (userName) => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: ADMIN_EMAIL,
        user_name: userName || 'Someone',
        message: `${userName || 'Someone'} added a new memory to your Lastpage. Check it out!`,
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log('📧 Notification email sent successfully');
  } catch (error) {
    // Silently fail — don't interrupt the user's experience
    console.warn('Email notification failed (non-critical):', error);
  }
};
