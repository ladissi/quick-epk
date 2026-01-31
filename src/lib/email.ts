import { Resend } from 'resend';

// Lazy initialization to avoid errors during build
let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface ViewNotificationData {
  artistName: string;
  epkSlug: string;
  viewerLocation: string | null;
  referrer: string | null;
  viewedAt: string;
}

export async function sendViewNotification(
  toEmail: string,
  data: ViewNotificationData
) {
  const client = getResendClient();
  if (!client) {
    console.log('RESEND_API_KEY not set, skipping email');
    return null;
  }

  const { artistName, epkSlug, viewerLocation, referrer, viewedAt } = data;

  const viewTime = new Date(viewedAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const locationText = viewerLocation || 'Unknown location';
  const referrerText = referrer
    ? `Found you via ${new URL(referrer).hostname}`
    : 'Direct visit';

  const epkUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${epkSlug}`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

  try {
    const { data: result, error } = await client.emails.send({
      from: 'QuickEPK <onboarding@resend.dev>',
      to: toEmail,
      subject: `Someone just viewed your EPK - ${artistName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Someone viewed your EPK!</h1>
            </div>

            <div style="padding: 32px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">
                Great news! A potential booker just checked out <strong>${artistName}</strong>.
              </p>

              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">When</span>
                  <p style="color: #111827; font-size: 14px; margin: 4px 0 0;">${viewTime}</p>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</span>
                  <p style="color: #111827; font-size: 14px; margin: 4px 0 0;">${locationText}</p>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Source</span>
                  <p style="color: #111827; font-size: 14px; margin: 4px 0 0;">${referrerText}</p>
                </div>
              </div>

              <a href="${dashboardUrl}" style="display: block; background: #7c3aed; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 14px;">
                View Full Analytics
              </a>
            </div>

            <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                <a href="${epkUrl}" style="color: #7c3aed; text-decoration: none;">View your EPK</a> ·
                <a href="${dashboardUrl}" style="color: #7c3aed; text-decoration: none;">Dashboard</a>
              </p>
            </div>

          </div>

          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
            You're receiving this because you have view notifications enabled.<br>
            <a href="${dashboardUrl}" style="color: #7c3aed;">Manage notification settings</a>
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}
