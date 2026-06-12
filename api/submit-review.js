const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, rating, message } = req.body || {};

  if (!name || !email || !service || !rating || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

  if (!adminEmails.length) {
    return res.status(500).json({ error: 'No admin emails configured' });
  }

  const resend = new Resend(apiKey);
  const starCount = Math.min(5, Math.max(1, Number(rating)));
  const stars = '★'.repeat(starCount);
  const empty = '☆'.repeat(5 - starCount);
  const safeMsg = String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  const safeName = String(name).replace(/</g, '&lt;');
  const safeEmail = String(email).replace(/</g, '&lt;');
  const safeService = String(service).replace(/</g, '&lt;');

  try {
    const [adminResult, thankYouResult] = await Promise.all([
      resend.emails.send({
        from: 'Iyadi Website <noreply@iyadiplanningsolutions.co.za>',
        to: adminEmails,
        reply_to: email,
        subject: `New Review from ${safeName} — Iyadi Planning Solutions`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fafaf7;border-radius:8px;border:1px solid rgba(13,13,13,.1);">
            <div style="border-bottom:2px solid #2b7a2b;padding-bottom:16px;margin-bottom:24px;">
              <h2 style="color:#2b7a2b;margin:0;font-size:20px;">New Review Submitted</h2>
              <p style="color:#44504a;margin:6px 0 0;font-size:13px;">Via iyadiplanningsolutions.co.za — Portfolio page</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr>
                <td style="padding:8px 0;color:#44504a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:110px;vertical-align:top;">Name</td>
                <td style="padding:8px 0;color:#0d0d0d;font-weight:600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#44504a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;">Email</td>
                <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#2b7a2b;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#44504a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;">Service</td>
                <td style="padding:8px 0;color:#0d0d0d;">${safeService}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#44504a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;">Rating</td>
                <td style="padding:8px 0;font-size:20px;color:#c9a327;">${stars}<span style="color:#ddd;">${empty}</span></td>
              </tr>
            </table>
            <div style="background:#fff;border:1px solid rgba(13,13,13,.12);border-radius:8px;padding:20px 22px;margin-bottom:24px;">
              <p style="color:#44504a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px;">Review</p>
              <p style="color:#0d0d0d;font-size:15px;line-height:1.65;margin:0;">${safeMsg}</p>
            </div>
            <p style="color:#44504a;font-size:12px;margin:0;">You can reply directly to this email to respond to ${safeName}.</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: 'Iyadi Planning Solutions <noreply@iyadiplanningsolutions.co.za>',
        to: [email],
        subject: `Thank you for your review, ${safeName} — Iyadi Planning Solutions`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:0;background:#fafaf7;">
            <div style="background:linear-gradient(135deg,#1a4d1a 0%,#2b7a2b 100%);padding:40px 32px 36px;border-radius:8px 8px 0 0;text-align:center;">
              <p style="font-family:monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,163,39,.9);margin:0 0 14px;">Iyadi Planning Solutions</p>
              <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;line-height:1.15;">Thank you, ${safeName}.</h1>
              <p style="color:rgba(255,255,255,.75);margin:12px 0 0;font-size:15px;line-height:1.6;">Your review means a great deal to us.</p>
            </div>
            <div style="background:#fff;padding:36px 32px;border-left:1px solid rgba(13,13,13,.08);border-right:1px solid rgba(13,13,13,.08);">
              <p style="color:#0d0d0d;font-size:15px;line-height:1.72;margin:0 0 20px;">We've received your ${stars} rating for <strong>${safeService}</strong> and will share it on our portfolio shortly. Your feedback helps us grow and helps others make confident decisions about their projects.</p>
              <div style="background:#fafaf7;border-left:3px solid #c9a327;padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
                <p style="color:#44504a;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin:0 0 8px;">Your review</p>
                <p style="color:#0d0d0d;font-size:14px;line-height:1.65;margin:0;font-style:italic;">"${safeMsg}"</p>
              </div>
              <p style="color:#44504a;font-size:14px;line-height:1.72;margin:0 0 20px;">If you have any questions or need assistance with a new project, feel free to reply to this email — we would love to hear from you again.</p>
              <a href="https://iyadiplanningsolutions.co.za/services.html" style="display:inline-block;background:#2b7a2b;color:#fff;text-decoration:none;padding:13px 28px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:.04em;">Explore Our Services</a>
            </div>
            <div style="background:#f0f0ec;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid rgba(13,13,13,.08);border-top:none;text-align:center;">
              <p style="color:#44504a;font-size:12px;margin:0;line-height:1.6;">Iyadi Planning Solutions &nbsp;·&nbsp; KwaZulu-Natal, South Africa<br><a href="https://iyadiplanningsolutions.co.za" style="color:#2b7a2b;text-decoration:none;">iyadiplanningsolutions.co.za</a></p>
            </div>
          </div>
        `,
      }),
    ]);

    if (adminResult.error) console.error('Admin email error:', JSON.stringify(adminResult.error));
    if (thankYouResult.error) console.error('Thank-you email error:', JSON.stringify(thankYouResult.error));

    if (adminResult.error || thankYouResult.error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
