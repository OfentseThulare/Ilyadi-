const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, org, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, and message are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const LOGO = 'https://www.iyadiplanningsolutions.com/brand/iyadi-logo.png';
  const GREEN = '#1a4d1a';
  const GREEN_MID = '#2b7a2b';
  const GOLD = '#c9a327';
  const GOLD_LIGHT = '#e3c265';
  const PAPER = '#fafaf7';
  const INK = '#0d0d0d';
  const INK_SOFT = '#44504a';

  const serviceDisplay = service || 'Not specified';
  const orgDisplay = org || '—';
  const phoneDisplay = phone || '—';

  // ─── EMAIL 1: Thank-you auto-reply to the client ─────────────────────────
  const autoReplyHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Thank you — Iyadi Planning Solutions</title>
  <!--[if mso]><style>td,th,div,p,a{font-family:Georgia,serif!important}</style><![endif]-->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
    body{margin:0;padding:0;background-color:#f0ede6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    a{color:${GREEN_MID};text-decoration:none}
    a:hover{text-decoration:underline}
    .font-display{font-family:'Playfair Display',Georgia,'Times New Roman',serif}
    .font-sans{font-family:'Plus Jakarta Sans',Arial,Helvetica,sans-serif}
    @media only screen and (max-width:620px){
      .wrap{width:100%!important}
      .pad{padding:32px 24px!important}
      .hero-pad{padding:36px 24px!important}
    }
  </style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:#f0ede6;padding:40px 0">
  <tr><td align="center">

    <!-- Outer card -->
    <table class="wrap" width="600" cellpadding="0" cellspacing="0" role="presentation"
      style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;
             box-shadow:0 4px 24px rgba(0,0,0,0.10)">

      <!-- ── Header bar ── -->
      <tr>
        <td style="background-color:${GREEN};padding:0">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <!-- Gold left accent strip -->
              <td width="6" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td class="hero-pad" style="padding:36px 40px;text-align:center">
                <!-- Logo -->
                <img src="${LOGO}" width="52" height="auto" alt="Iyadi Planning Solutions"
                  style="display:block;margin:0 auto 16px;height:52px;width:auto"/>
                <!-- Wordmark -->
                <div class="font-display"
                  style="font-family:'Playfair Display',Georgia,serif;
                         font-weight:800;font-size:26px;letter-spacing:0.02em;
                         color:#ffffff;line-height:1.1">
                  IYADI
                </div>
                <div class="font-sans"
                  style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                         font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
                         color:${GOLD_LIGHT};margin-top:4px">
                  Planning Solutions
                </div>
              </td>
              <!-- Gold right accent strip -->
              <td width="6" style="background-color:${GOLD};font-size:0">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Gold divider line ── -->
      <tr>
        <td height="3" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
      </tr>

      <!-- ── Body ── -->
      <tr>
        <td class="pad" style="background-color:${PAPER};padding:48px 48px 40px">

          <!-- Greeting -->
          <div class="font-display"
            style="font-family:'Playfair Display',Georgia,serif;
                   font-weight:700;font-size:22px;color:${GREEN};
                   line-height:1.2;margin-bottom:20px">
            Thank you, ${name}.
          </div>

          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:15px;color:${INK_SOFT};line-height:1.75;margin-bottom:16px">
            We have received your enquiry and appreciate you reaching out to
            <strong style="color:${INK}">Iyadi Planning Solutions</strong>.
          </div>

          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:15px;color:${INK_SOFT};line-height:1.75;margin-bottom:24px">
            A member of our team will review your message and be in touch within
            <strong style="color:${GREEN}">2 business days</strong>.
          </div>

          <!-- Highlight box -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border-left:3px solid ${GOLD};background-color:#f5f0e0;
                   border-radius:0 8px 8px 0;margin-bottom:32px">
            <tr>
              <td style="padding:18px 22px">
                <div class="font-sans"
                  style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                         font-size:13px;letter-spacing:0.12em;text-transform:uppercase;
                         color:${GOLD};font-weight:600;margin-bottom:6px">
                  Your enquiry summary
                </div>
                <div class="font-sans"
                  style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                         font-size:14px;color:${INK_SOFT};line-height:1.6">
                  <strong style="color:${INK}">Service:</strong> ${serviceDisplay}
                </div>
              </td>
            </tr>
          </table>

          <!-- Urgent contact line -->
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:14px;color:${INK_SOFT};line-height:1.7;margin-bottom:36px">
            If your matter is urgent, call us directly on
            <a href="tel:0360040024"
              style="color:${GREEN_MID};font-weight:600;text-decoration:none">
              036 004 0024
            </a>.
          </div>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td height="1" style="background:linear-gradient(to right,${GOLD},transparent);
                                    border-top:1px solid ${GOLD_LIGHT};font-size:0">&nbsp;</td>
            </tr>
          </table>

          <!-- Sign-off -->
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:14px;color:${INK_SOFT};margin-top:28px;line-height:1.6">
            Warm regards,
          </div>
          <div class="font-display"
            style="font-family:'Playfair Display',Georgia,serif;
                   font-weight:700;font-size:18px;color:${GREEN};margin-top:6px">
            The Iyadi Team
          </div>
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:12px;color:#888;margin-top:4px;letter-spacing:0.06em;
                   text-transform:uppercase">
            Reaching New Heights
          </div>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="background-color:${GREEN};padding:22px 40px;text-align:center">
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:12px;color:rgba(255,255,255,0.55);line-height:1.6">
            45 Queen Street, Office No. 6, Ladysmith, 3370, KwaZulu-Natal
            &nbsp;&bull;&nbsp;
            <a href="https://www.iyadiplanningsolutions.com"
              style="color:${GOLD_LIGHT};text-decoration:none">
              iyadiplanningsolutions.com
            </a>
          </div>
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:11px;color:rgba(255,255,255,0.35);margin-top:8px">
            &copy; ${new Date().getFullYear()} Iyadi Planning Solutions (Pty) Ltd &nbsp;&bull;&nbsp;
            B-BBEE Level 1 &nbsp;&bull;&nbsp; Reg 2021/652941/07
          </div>
          <div class="font-sans"
            style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-size:11px;color:rgba(255,255,255,0.25);margin-top:10px">
            This is an automated confirmation — please do not reply to this email.
          </div>
        </td>
      </tr>

    </table>
    <!-- End outer card -->

  </td></tr>
</table>
</body>
</html>`;

  // ─── EMAIL 2: Internal notification to the Iyadi team ────────────────────
  const internalHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New website enquiry — Iyadi</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Mono&display=swap" rel="stylesheet" type="text/css"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Mono&display=swap');
    body{margin:0;padding:0;background-color:#f0ede6}
    @media only screen and (max-width:620px){
      .wrap{width:100%!important}
      .pad{padding:28px 20px!important}
      .field-row{display:block!important;padding:10px 0!important}
      .field-label,.field-value{display:block!important;width:100%!important;padding:0!important}
    }
  </style>
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:#f0ede6;padding:40px 0">
  <tr><td align="center">

    <table class="wrap" width="600" cellpadding="0" cellspacing="0" role="presentation"
      style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;
             box-shadow:0 4px 24px rgba(0,0,0,0.10)">

      <!-- ── Header ── -->
      <tr>
        <td style="background-color:${GREEN};padding:0">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="6" style="background-color:${GOLD}">&nbsp;</td>
              <td style="padding:28px 36px">
                <img src="${LOGO}" width="40" height="auto" alt="Iyadi"
                  style="height:40px;width:auto;display:inline-block;vertical-align:middle;margin-right:14px"/>
                <span style="font-family:'Playfair Display',Georgia,serif;
                             font-weight:800;font-size:20px;color:#fff;
                             vertical-align:middle;letter-spacing:0.02em">
                  New Enquiry
                </span>
                <div style="font-family:'Space Mono',monospace,Arial;
                            font-size:11px;letter-spacing:0.18em;text-transform:uppercase;
                            color:${GOLD_LIGHT};margin-top:6px;margin-left:54px">
                  Via iyadiplanningsolutions.com
                </div>
              </td>
              <td width="6" style="background-color:${GOLD}">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Gold line -->
      <tr>
        <td height="3" style="background-color:${GOLD};font-size:0">&nbsp;</td>
      </tr>

      <!-- ── Intro ── -->
      <tr>
        <td class="pad" style="background-color:${PAPER};padding:36px 44px 28px">
          <div style="font-family:'Playfair Display',Georgia,serif;
                      font-weight:700;font-size:19px;color:${GREEN};margin-bottom:10px">
            ${name} has sent an enquiry.
          </div>
          <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                      font-size:14px;color:${INK_SOFT};line-height:1.7">
            Use the button at the bottom of this email to reply directly.
          </div>
        </td>
      </tr>

      <!-- ── Details table ── -->
      <tr>
        <td style="background-color:${PAPER};padding:0 44px 36px">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border:1px solid #ddd9ce;border-radius:8px;overflow:hidden">

            ${[
              ['Full Name',        name],
              ['Company / Org',    orgDisplay],
              ['Email Address',    `<a href="mailto:${email}" style="color:${GREEN_MID};font-weight:600;text-decoration:none">${email}</a>`],
              ['Phone Number',     phoneDisplay],
              ['Service Interest', serviceDisplay],
            ].map(([ label, val ], i) => `
            <tr style="background-color:${i % 2 === 0 ? PAPER : '#f3f0e8'}">
              <td class="field-label"
                style="padding:14px 18px;font-family:'Space Mono',monospace,Arial;
                       font-size:10px;letter-spacing:0.14em;text-transform:uppercase;
                       color:#888;vertical-align:top;width:38%;border-right:1px solid #ddd9ce">
                ${label}
              </td>
              <td class="field-value"
                style="padding:14px 18px;font-family:'Plus Jakarta Sans',Arial,sans-serif;
                       font-size:14px;color:${INK};font-weight:600;vertical-align:top">
                ${val}
              </td>
            </tr>`).join('')}

            <!-- Message row — full width -->
            <tr style="background-color:#f3f0e8">
              <td colspan="2" style="padding:0">
                <div style="padding:12px 18px 6px;font-family:'Space Mono',monospace,Arial;
                            font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#888">
                  Message
                </div>
                <div style="padding:0 18px 18px;font-family:'Plus Jakarta Sans',Arial,sans-serif;
                            font-size:14px;color:${INK};line-height:1.75;white-space:pre-wrap">
${message}
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- ── Reply CTA ── -->
      <tr>
        <td style="background-color:${PAPER};padding:0 44px 44px;text-align:center">
          <a href="mailto:${email}?subject=Re%3A%20Your%20Iyadi%20Planning%20Solutions%20Enquiry&body=Dear%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20reaching%20out.%20"
            style="display:inline-block;background-color:${GREEN};color:#ffffff;
                   font-family:'Plus Jakarta Sans',Arial,sans-serif;
                   font-weight:700;font-size:14px;letter-spacing:0.04em;
                   padding:16px 36px;border-radius:100px;text-decoration:none;
                   border:2px solid ${GREEN}">
            Reply to ${name} &rarr;
          </a>
          <div style="margin-top:12px;font-family:'Plus Jakarta Sans',Arial,sans-serif;
                      font-size:12px;color:#aaa">
            Replying to: ${email}
          </div>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="background-color:${GREEN};padding:20px 36px;text-align:center">
          <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                      font-size:11px;color:rgba(255,255,255,0.5);line-height:1.6">
            Iyadi Planning Solutions (Pty) Ltd &nbsp;&bull;&nbsp;
            45 Queen Street, Ladysmith &nbsp;&bull;&nbsp;
            <a href="https://www.iyadiplanningsolutions.com"
              style="color:${GOLD_LIGHT};text-decoration:none">
              iyadiplanningsolutions.com
            </a>
          </div>
          <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                      font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px">
            Internal notification — sent automatically from the website contact form.
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  try {
    // Email 1 — auto-reply to client
    await resend.emails.send({
      from: 'Iyadi Planning Solutions <info@iyadiplanningsolutions.com>',
      to: email,
      subject: 'Thank you for your enquiry — Iyadi Planning Solutions',
      html: autoReplyHtml,
    });

    // Email 2 — internal notification to Iyadi team
    // Set ADMIN_EMAIL in Vercel env vars
    await resend.emails.send({
      from: 'Iyadi Website <noreply@iyadiplanningsolutions.com>',
      to: process.env.ADMIN_EMAIL,
      reply_to: email,
      subject: `New enquiry: ${name} — ${serviceDisplay}`,
      html: internalHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
