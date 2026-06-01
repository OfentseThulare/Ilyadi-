const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, org, email, phone, service, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, and message are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // --- EMAIL 1: Auto-reply to the enquirer ---
  const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank you for your enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2b7a2b;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
                Iyadi Planning Solutions
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#222222;">
                Dear ${name},
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#444444;line-height:1.6;">
                Thank you for reaching out to Iyadi Planning Solutions. We have successfully received your enquiry and appreciate you taking the time to get in touch with us.
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#444444;line-height:1.6;">
                A member of our team will review your message and get back to you within <strong style="color:#2b7a2b;">2 business days</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:16px;color:#444444;line-height:1.6;">
                If your matter is urgent, please do not hesitate to call us directly on <a href="tel:0360040024" style="color:#2b7a2b;text-decoration:none;font-weight:600;">036 004 0024</a>.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e8e8e8;margin:0 0 32px;" />

              <p style="margin:0 0 8px;font-size:15px;color:#444444;line-height:1.6;">
                Warm regards,
              </p>
              <p style="margin:0;font-size:15px;color:#2b7a2b;font-weight:700;">
                The Iyadi Team
              </p>
              <p style="margin:4px 0 0;font-size:14px;color:#888888;">
                Iyadi Planning Solutions
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f0f8f0;padding:20px 40px;text-align:center;border-top:1px solid #e0ede0;">
              <p style="margin:0;font-size:12px;color:#888888;line-height:1.6;">
                This is an automated confirmation. Please do not reply directly to this email.<br />
                &copy; ${new Date().getFullYear()} Iyadi Planning Solutions. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // --- EMAIL 2: Internal notification to Iyadi ---
  const serviceDisplay = service || 'Not specified';
  const orgDisplay = org || 'Not provided';
  const phoneDisplay = phone || 'Not provided';

  const internalNotificationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Website Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2b7a2b;padding:24px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
                New Website Enquiry
              </h1>
              <p style="margin:6px 0 0;color:#c8e6c8;font-size:13px;">
                Received via iyadi.co.za contact form
              </p>
            </td>
          </tr>

          <!-- Enquiry Details -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:#222222;font-weight:600;">
                Enquiry Details
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">

                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:40%;vertical-align:top;">
                    Full Name
                  </td>
                  <td style="padding:12px 0;font-size:15px;color:#222222;vertical-align:top;">
                    ${name}
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">
                    Company / Org
                  </td>
                  <td style="padding:12px 0;font-size:15px;color:#222222;vertical-align:top;">
                    ${orgDisplay}
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">
                    Email Address
                  </td>
                  <td style="padding:12px 0;font-size:15px;vertical-align:top;">
                    <a href="mailto:${email}" style="color:#2b7a2b;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">
                    Phone Number
                  </td>
                  <td style="padding:12px 0;font-size:15px;color:#222222;vertical-align:top;">
                    ${phoneDisplay}
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">
                    Service Interest
                  </td>
                  <td style="padding:12px 0;font-size:15px;color:#222222;vertical-align:top;">
                    ${serviceDisplay}
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 16px 12px 0;font-size:13px;color:#888888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">
                    Message
                  </td>
                  <td style="padding:12px 0;font-size:15px;color:#222222;vertical-align:top;line-height:1.6;">
                    ${message.replace(/\n/g, '<br />')}
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;">
              <a href="mailto:${email}?subject=Re: Your enquiry to Iyadi Planning Solutions"
                 style="display:inline-block;background-color:#2b7a2b;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:4px;font-size:14px;font-weight:600;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f0f8f0;padding:16px 40px;text-align:center;border-top:1px solid #e0ede0;">
              <p style="margin:0;font-size:12px;color:#888888;">
                Sent automatically by the Iyadi Planning Solutions website contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    // Send auto-reply to enquirer
    await resend.emails.send({
      from: 'Iyadi Planning Solutions <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for your enquiry — Iyadi Planning Solutions',
      html: autoReplyHtml,
    });

    // Send internal notification to admin
    // Set ADMIN_EMAIL in Vercel environment variables — e.g. mongezishabangu@gmail.com
    await resend.emails.send({
      from: 'Iyadi Website <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New enquiry from ${name} — ${serviceDisplay}`,
      html: internalNotificationHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
