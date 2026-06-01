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

  const LOGO     = 'https://www.iyadiplanningsolutions.com/brand/iyadi-logo.png';
  const G_DEEP   = '#020a02';   // almost-black green — cinematic dark base
  const G_MID    = '#071407';   // very deep forest green
  const G_BRIGHT = '#0d2e0d';   // rich dark green (was the base)
  const GOLD     = '#c9a327';
  const GOLD_LT  = '#e3c265';
  const PAPER    = '#fafaf7';
  const INK      = '#0d0d0d';
  const INK_SOFT = '#44504a';

  const serviceDisplay = service || 'General enquiry';
  const orgDisplay     = org     || '—';
  const phoneDisplay   = phone   || '—';
  const year           = new Date().getFullYear();

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL 1 — Client thank-you  (cinematic, Iyadi-branded)
  // taste-skill: VARIANCE 9 · soft-skill · high-end visual design
  // ─────────────────────────────────────────────────────────────────────────
  const autoReplyHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Thank you — Iyadi Planning Solutions</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  body,table,td{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  body{margin:0;padding:0;background-color:${G_DEEP}}
  img{border:0;outline:none;text-decoration:none;display:block}
  a{color:${GOLD_LT};text-decoration:none}
</style>
</head>
<body style="margin:0;padding:0;background-color:${G_DEEP}">

<!-- ░░░ OUTER WRAPPER ░░░ -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:${G_DEEP};padding:0">
<tr><td align="center">

  <!-- ░░░ CARD ░░░ -->
  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
    style="max-width:600px;width:100%">

    <!-- ══ CINEMATIC HERO ══ -->
    <!-- Tall dark-green hero — fullbleed, dramatic -->
    <tr>
      <td style="background-color:${G_MID};padding:0;position:relative">

        <!-- Top gold bar -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td height="4" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
          </tr>
        </table>

        <!-- Hero content -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <!-- Left gold accent column -->
            <td width="4" style="background-color:${GOLD};font-size:0">&nbsp;</td>
            <td style="padding:52px 52px 0">

              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:rgba(255,255,255,0.08);border-radius:10px;
                             padding:12px 18px;display:inline-block">
                    <img src="${LOGO}" width="44" height="44" alt="Iyadi Planning Solutions"
                      style="height:44px;width:auto"/>
                  </td>
                </tr>
              </table>

              <!-- Eyebrow -->
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:10px;letter-spacing:0.3em;text-transform:uppercase;
                          color:${GOLD};margin-top:32px;font-weight:500">
                Town Planning &nbsp;·&nbsp; Architecture &nbsp;·&nbsp; Construction
              </div>

              <!-- Giant serif headline -->
              <div style="font-family:'Playfair Display',Georgia,'Times New Roman',serif;
                          font-size:54px;font-weight:900;line-height:1.0;
                          color:#ffffff;margin-top:18px;letter-spacing:-0.02em">
                We've got<br/>
                <span style="color:${GOLD_LT};font-style:italic">your message.</span>
              </div>

              <!-- Subhead -->
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:15px;color:rgba(255,255,255,0.65);
                          line-height:1.7;margin-top:22px;font-weight:300;
                          max-width:400px">
                Thank you, <strong style="color:#fff;font-weight:600">${name}</strong>. Your enquiry has been received and is in the right hands.
              </div>

            </td>
          </tr>
        </table>

        <!-- Diagonal gold line decoration -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="4" style="background-color:${GOLD};font-size:0">&nbsp;</td>
            <td style="padding:36px 52px 0">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="48" height="1" style="background-color:${GOLD};font-size:0">&nbsp;</td>
                  <td width="12">&nbsp;</td>
                  <td width="24" height="1" style="background-color:rgba(201,163,39,0.4);font-size:0">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Stat band -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="4" style="background-color:${GOLD};font-size:0">&nbsp;</td>
            <td style="padding:28px 52px 48px">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding-right:40px;border-right:1px solid rgba(255,255,255,0.12)">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:28px;font-weight:800;color:#fff;line-height:1">2021</div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
                                color:rgba(255,255,255,0.45);margin-top:5px">Founded</div>
                  </td>
                  <td style="padding:0 40px;border-right:1px solid rgba(255,255,255,0.12)">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:28px;font-weight:800;color:#fff;line-height:1">11</div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
                                color:rgba(255,255,255,0.45);margin-top:5px">Specialists</div>
                  </td>
                  <td style="padding-left:40px">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:28px;font-weight:800;color:${GOLD_LT};line-height:1">L1</div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
                                color:rgba(255,255,255,0.45);margin-top:5px">B-BBEE</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- ══ PROMISE BAND ══ -->
    <tr>
      <td style="background-color:${GOLD};padding:18px 56px">
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:12px;letter-spacing:0.16em;text-transform:uppercase;
                    color:${G_DEEP};font-weight:700">
          We respond within 2 business days
        </div>
      </td>
    </tr>

    <!-- ══ BODY CONTENT ══ -->
    <tr>
      <td style="background-color:${PAPER};padding:52px 52px 44px">

        <!-- What happens next -->
        <div style="font-family:'Playfair Display',Georgia,serif;
                    font-size:26px;font-weight:800;color:${G_MID};
                    line-height:1.15;margin-bottom:18px">
          What happens next?
        </div>

        <!-- Steps -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding:16px 0;border-bottom:1px solid rgba(13,13,13,0.08)">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="36" valign="top">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:22px;font-weight:800;color:${GOLD};line-height:1">01</div>
                  </td>
                  <td style="padding-left:16px">
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:14px;font-weight:600;color:${INK};margin-bottom:3px">
                      Your enquiry is reviewed
                    </div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:13px;color:${INK_SOFT};line-height:1.6">
                      A registered specialist reads your message and assesses the best path forward.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0;border-bottom:1px solid rgba(13,13,13,0.08)">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="36" valign="top">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:22px;font-weight:800;color:${GOLD};line-height:1">02</div>
                  </td>
                  <td style="padding-left:16px">
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:14px;font-weight:600;color:${INK};margin-bottom:3px">
                      We reach out directly
                    </div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:13px;color:${INK_SOFT};line-height:1.6">
                      Expect a call or email within 2 business days with a clear next step — no vague follow-ups.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="36" valign="top">
                    <div style="font-family:'Playfair Display',Georgia,serif;
                                font-size:22px;font-weight:800;color:${GOLD};line-height:1">03</div>
                  </td>
                  <td style="padding-left:16px">
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:14px;font-weight:600;color:${INK};margin-bottom:3px">
                      Your project gets moving
                    </div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:13px;color:${INK_SOFT};line-height:1.6">
                      From land-use approval to construction completion, one accountable team handles it all.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Urgent line -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="margin-top:36px">
          <tr>
            <td style="background-color:${G_DEEP};border-radius:8px;padding:20px 24px">
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:12px;letter-spacing:0.14em;text-transform:uppercase;
                          color:${GOLD};margin-bottom:6px;font-weight:600">
                Need to reach us now?
              </div>
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:15px;color:#fff;font-weight:500">
                <a href="tel:0360040024"
                  style="color:${GOLD_LT};text-decoration:none;font-weight:700">036 004 0024</a>
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <a href="mailto:info@iyadiplanningsolutions.com"
                  style="color:rgba(255,255,255,0.6);font-size:13px;text-decoration:none">
                  info@iyadiplanningsolutions.com
                </a>
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- ══ SIGN-OFF ══ -->
    <tr>
      <td style="background-color:#f0ede6;padding:32px 52px;border-top:3px solid ${GOLD}">
        <div style="font-family:'Playfair Display',Georgia,serif;
                    font-size:20px;font-weight:800;color:${G_MID}">
          The Iyadi Team
        </div>
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
                    color:${GOLD};margin-top:4px">
          Reaching New Heights
        </div>
      </td>
    </tr>

    <!-- ══ FOOTER ══ -->
    <tr>
      <td style="background-color:${G_DEEP};padding:24px 52px;text-align:center">
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:11px;color:rgba(255,255,255,0.35);line-height:1.8;
                    letter-spacing:0.04em">
          45 Queen Street, Office No. 6 &nbsp;·&nbsp; Ladysmith, 3370 &nbsp;·&nbsp; KwaZulu-Natal<br/>
          <a href="https://www.iyadiplanningsolutions.com"
            style="color:${GOLD};text-decoration:none;letter-spacing:0.06em">
            iyadiplanningsolutions.com
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          Reg 2021/652941/07 &nbsp;·&nbsp; B-BBEE Level 1
        </div>
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:10px;color:rgba(255,255,255,0.2);margin-top:12px">
          &copy; ${year} Iyadi Planning Solutions (Pty) Ltd. Automated confirmation — do not reply.
        </div>
      </td>
    </tr>

    <!-- Bottom gold bar -->
    <tr>
      <td height="4" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
    </tr>

  </table>
  <!-- end card -->

</td></tr>
</table>

</body>
</html>`;

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL 2 — Internal notification to Iyadi team  (cinematic + scannable)
  // ─────────────────────────────────────────────────────────────────────────
  const internalHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>New enquiry — ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  body,table,td{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  body{margin:0;padding:0;background-color:${G_DEEP}}
  img{border:0;outline:none;text-decoration:none;display:block}
  a{color:${GOLD_LT};text-decoration:none}
</style>
</head>
<body style="margin:0;padding:0;background-color:${G_DEEP}">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:${G_DEEP};padding:0">
<tr><td align="center">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
    style="max-width:600px;width:100%">

    <!-- ══ TOP GOLD BAR ══ -->
    <tr>
      <td height="4" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
    </tr>

    <!-- ══ HEADER ══ -->
    <tr>
      <td style="background-color:${G_MID};padding:0">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="4" style="background-color:${GOLD};font-size:0">&nbsp;</td>
            <td style="padding:36px 44px 36px">

              <!-- Logo row -->
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color:rgba(255,255,255,0.08);border-radius:8px;padding:10px 14px">
                    <img src="${LOGO}" width="36" height="36" alt="Iyadi"
                      style="height:36px;width:auto;display:inline-block;vertical-align:middle"/>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle">
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:9px;letter-spacing:0.24em;text-transform:uppercase;
                                color:${GOLD};font-weight:600">
                      Internal notification
                    </div>
                    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                                font-size:11px;letter-spacing:0.1em;text-transform:uppercase;
                                color:rgba(255,255,255,0.5);margin-top:3px">
                      iyadiplanningsolutions.com
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Headline -->
              <div style="font-family:'Playfair Display',Georgia,serif;
                          font-size:42px;font-weight:900;color:#fff;
                          line-height:1.05;margin-top:28px;letter-spacing:-0.02em">
                New Enquiry<br/>
                <span style="color:${GOLD_LT};font-style:italic">${name}</span>
              </div>

              <!-- Service pill -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:18px">
                <tr>
                  <td style="background-color:rgba(201,163,39,0.15);border:1px solid ${GOLD};
                             border-radius:100px;padding:7px 18px">
                    <span style="font-family:'Space Mono',monospace,Arial;
                                 font-size:10px;letter-spacing:0.14em;text-transform:uppercase;
                                 color:${GOLD_LT};font-weight:700">
                      ${serviceDisplay}
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══ DETAILS CARD ══ -->
    <tr>
      <td style="background-color:${PAPER};padding:0">

        <!-- Section label -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding:36px 44px 20px">
              <div style="font-family:'Space Mono',monospace,Arial;
                          font-size:9px;letter-spacing:0.28em;text-transform:uppercase;
                          color:${G_BRIGHT};font-weight:700;display:inline-block;
                          border-bottom:2px solid ${GOLD};padding-bottom:6px">
                Contact details
              </div>
            </td>
          </tr>
        </table>

        <!-- Details grid -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="border-top:1px solid rgba(13,13,13,0.06)">

          ${[
            ['Full Name',        name,         false],
            ['Company / Org',    orgDisplay,   false],
            ['Email',            `<a href="mailto:${email}" style="color:${G_BRIGHT};font-weight:700;text-decoration:none">${email}</a>`, false],
            ['Phone',            phoneDisplay, false],
            ['Service Interest', serviceDisplay, false],
          ].map(([label, val, last], i) => `
          <tr>
            <td width="160"
              style="padding:16px 16px 16px 44px;
                     background-color:${i % 2 === 0 ? PAPER : '#f3f0e8'};
                     border-bottom:1px solid rgba(13,13,13,0.05);
                     vertical-align:top">
              <div style="font-family:'Space Mono',monospace,Arial;
                          font-size:9px;letter-spacing:0.16em;text-transform:uppercase;
                          color:#999;font-weight:400">
                ${label}
              </div>
            </td>
            <td style="padding:16px 44px 16px 20px;
                       background-color:${i % 2 === 0 ? PAPER : '#f3f0e8'};
                       border-bottom:1px solid rgba(13,13,13,0.05);
                       vertical-align:top">
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:14px;font-weight:600;color:${INK};line-height:1.5">
                ${val}
              </div>
            </td>
          </tr>`).join('')}

        </table>

        <!-- Message block -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding:0 44px 0;background-color:${PAPER}">
              <div style="font-family:'Space Mono',monospace,Arial;
                          font-size:9px;letter-spacing:0.28em;text-transform:uppercase;
                          color:${G_BRIGHT};font-weight:700;margin-top:28px;margin-bottom:14px;
                          padding-bottom:6px;border-bottom:2px solid ${GOLD};display:inline-block">
                Message
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 44px 44px;background-color:${PAPER}">
              <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                          font-size:15px;color:${INK_SOFT};line-height:1.85;
                          border-left:3px solid ${GOLD};padding-left:20px;
                          white-space:pre-wrap">
${message}
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- ══ CTA ══ -->
    <tr>
      <td style="background-color:#f0ede6;padding:32px 44px;text-align:center;
                 border-top:3px solid ${GOLD}">
        <a href="mailto:${email}?subject=Re%3A%20Your%20Iyadi%20Planning%20Solutions%20Enquiry&body=Dear%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest%20in%20Iyadi%20Planning%20Solutions."
          style="display:inline-block;background-color:${G_MID};color:#fff;
                 font-family:'Plus Jakarta Sans',Arial,sans-serif;
                 font-weight:700;font-size:13px;letter-spacing:0.08em;
                 text-transform:uppercase;padding:18px 44px;
                 border-radius:100px;text-decoration:none">
          Reply to ${name} &rarr;
        </a>
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:11px;color:#999;margin-top:10px">
          ${email}
        </div>
      </td>
    </tr>

    <!-- ══ FOOTER ══ -->
    <tr>
      <td style="background-color:${G_DEEP};padding:24px 44px;text-align:center">
        <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;
                    font-size:10px;color:rgba(255,255,255,0.3);
                    line-height:1.8;letter-spacing:0.06em">
          Iyadi Planning Solutions (Pty) Ltd &nbsp;·&nbsp; Ladysmith, KwaZulu-Natal<br/>
          Reg 2021/652941/07 &nbsp;·&nbsp; B-BBEE Level 1<br/>
          <span style="color:rgba(255,255,255,0.18)">
            Automated internal notification from website contact form.
          </span>
        </div>
      </td>
    </tr>

    <!-- Bottom gold bar -->
    <tr>
      <td height="4" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
    </tr>

  </table>

</td></tr>
</table>

</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Iyadi Planning Solutions <info@iyadiplanningsolutions.com>',
      to: email,
      subject: 'We\'ve received your enquiry — Iyadi Planning Solutions',
      html: autoReplyHtml,
    });

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
