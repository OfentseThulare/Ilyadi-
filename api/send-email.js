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

  // Brand colours — bgcolor attributes are required for mobile email clients
  // (Gmail Android/iOS ignores CSS background-color on <td> without bgcolor)
  const G_DEEP   = '#020a02';   // near-black green
  const G_MID    = '#071407';   // very deep forest
  const G_BRIGHT = '#0d2e0d';   // rich dark green
  const GOLD     = '#c9a327';
  const GOLD_LT  = '#e3c265';
  const PAPER    = '#fafaf7';
  const WARM     = '#f0ede6';
  const INK      = '#0d0d0d';
  const INK_SOFT = '#44504a';
  const LOGO     = 'https://www.iyadiplanningsolutions.com/brand/iyadi-logo.png';

  const serviceDisplay = service || 'General enquiry';
  const orgDisplay     = org     || '—';
  const phoneDisplay   = phone   || '—';
  const year           = new Date().getFullYear();

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL 1 — Client thank-you
  // Every dark <td> has BOTH style="background-color:X" AND bgcolor="X"
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
<body style="margin:0;padding:0;background-color:${G_DEEP}" bgcolor="${G_DEEP}">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:${G_DEEP}" bgcolor="${G_DEEP}">
<tr>
  <td align="center" style="background-color:${G_DEEP}" bgcolor="${G_DEEP}">

    <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">

      <!-- TOP GOLD BAR -->
      <tr>
        <td height="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
      </tr>

      <!-- HERO -->
      <tr>
        <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:0">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <!-- Left gold strip -->
              <td width="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <!-- Hero body -->
              <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:52px 44px 0 44px">

                <!-- Logo container -->
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td bgcolor="#ffffff14" style="background-color:rgba(255,255,255,0.08);border-radius:10px;padding:12px 18px">
                      <img src="${LOGO}" width="44" height="44" alt="Iyadi Planning Solutions" style="height:44px;width:auto"/>
                    </td>
                  </tr>
                </table>

                <!-- Eyebrow -->
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;
                           letter-spacing:0.3em;text-transform:uppercase;color:${GOLD};
                           margin:32px 0 0;font-weight:500">
                  Town Planning &nbsp;·&nbsp; Architecture &nbsp;·&nbsp; Construction
                </p>

                <!-- Headline -->
                <p style="font-family:'Playfair Display',Georgia,'Times New Roman',serif;
                           font-size:52px;font-weight:900;line-height:1.02;color:#ffffff;
                           margin:16px 0 0;letter-spacing:-0.02em">
                  We&rsquo;ve got<br/>
                  <span style="color:${GOLD_LT};font-style:italic">your message.</span>
                </p>

                <!-- Sub -->
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;
                           color:rgba(255,255,255,0.65);line-height:1.7;margin:20px 0 0;font-weight:300">
                  Thank you, <strong style="color:#fff;font-weight:600">${name}</strong>.
                  Your enquiry has been received and is in the right hands.
                </p>

              </td>
            </tr>
          </table>

          <!-- Gold line accent -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:32px 44px 0 44px">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="48" height="1" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
                    <td width="12">&nbsp;</td>
                    <td width="24" height="1" bgcolor="${G_BRIGHT}" style="background-color:${G_BRIGHT};font-size:0;line-height:0">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Stats -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:28px 44px 52px 44px">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding-right:36px;border-right:1px solid rgba(255,255,255,0.12)">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin:0">2021</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin:5px 0 0">Founded</p>
                    </td>
                    <td style="padding:0 36px;border-right:1px solid rgba(255,255,255,0.12)">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:#fff;line-height:1;margin:0">11</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin:5px 0 0">Specialists</p>
                    </td>
                    <td style="padding-left:36px">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:800;color:${GOLD_LT};line-height:1;margin:0">L1</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin:5px 0 0">B-BBEE</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- PROMISE BAND -->
      <tr>
        <td bgcolor="${GOLD}" style="background-color:${GOLD};padding:18px 48px">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:12px;
                     letter-spacing:0.18em;text-transform:uppercase;color:${G_DEEP};
                     font-weight:700;margin:0">
            We respond within 2 business days
          </p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td bgcolor="${PAPER}" style="background-color:${PAPER};padding:52px 48px 44px">

          <p style="font-family:'Playfair Display',Georgia,serif;font-size:26px;
                     font-weight:800;color:${G_MID};line-height:1.15;margin:0 0 24px">
            What happens next?
          </p>

          <!-- Step 01 -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border-bottom:1px solid rgba(13,13,13,0.08)">
            <tr>
              <td style="padding:16px 0">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="36" valign="top">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:800;color:${GOLD};line-height:1;margin:0">01</p>
                    </td>
                    <td style="padding-left:16px">
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">Your enquiry is reviewed</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_SOFT};line-height:1.6;margin:0">A registered specialist reads your message and assesses the best path forward.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Step 02 -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
            style="border-bottom:1px solid rgba(13,13,13,0.08)">
            <tr>
              <td style="padding:16px 0">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="36" valign="top">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:800;color:${GOLD};line-height:1;margin:0">02</p>
                    </td>
                    <td style="padding-left:16px">
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">We reach out directly</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_SOFT};line-height:1.6;margin:0">Expect a call or email within 2 business days with a clear next step.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Step 03 -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding:16px 0">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="36" valign="top">
                      <p style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:800;color:${GOLD};line-height:1;margin:0">03</p>
                    </td>
                    <td style="padding-left:16px">
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">Your project gets moving</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_SOFT};line-height:1.6;margin:0">From land-use approval to construction completion, one accountable team handles it all.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Urgent contact box -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:36px">
            <tr>
              <td bgcolor="${G_DEEP}" style="background-color:${G_DEEP};border-radius:8px;padding:20px 24px">
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;
                           letter-spacing:0.14em;text-transform:uppercase;color:${GOLD};
                           margin:0 0 8px;font-weight:600">
                  Need to reach us now?
                </p>
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;color:#fff;font-weight:500;margin:0">
                  <a href="tel:0360040024" style="color:${GOLD_LT};text-decoration:none;font-weight:700">036 004 0024</a>
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  <a href="mailto:info@iyadiplanningsolutions.com" style="color:rgba(255,255,255,0.55);font-size:13px;text-decoration:none">info@iyadiplanningsolutions.com</a>
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- SIGN-OFF -->
      <tr>
        <td bgcolor="${WARM}" style="background-color:${WARM};padding:32px 48px;border-top:3px solid ${GOLD}">
          <p style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${G_MID};margin:0">The Iyadi Team</p>
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};margin:6px 0 0">Reaching New Heights</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td bgcolor="${G_DEEP}" style="background-color:${G_DEEP};padding:24px 48px;text-align:center">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.8;letter-spacing:0.04em;margin:0">
            45 Queen Street, Office No. 6 &nbsp;·&nbsp; Ladysmith, 3370 &nbsp;·&nbsp; KwaZulu-Natal<br/>
            <a href="https://www.iyadiplanningsolutions.com" style="color:${GOLD};text-decoration:none">iyadiplanningsolutions.com</a>
            &nbsp;&nbsp;|&nbsp;&nbsp; Reg 2021/652941/07 &nbsp;·&nbsp; B-BBEE Level 1
          </p>
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.2);margin:12px 0 0">
            &copy; ${year} Iyadi Planning Solutions (Pty) Ltd. Automated confirmation &mdash; do not reply.
          </p>
        </td>
      </tr>

      <!-- BOTTOM GOLD BAR -->
      <tr>
        <td height="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
      </tr>

    </table>

  </td>
</tr>
</table>

</body>
</html>`;

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL 2 — Internal notification
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
<body style="margin:0;padding:0;background-color:${G_DEEP}" bgcolor="${G_DEEP}">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  style="background-color:${G_DEEP}" bgcolor="${G_DEEP}">
<tr>
  <td align="center" bgcolor="${G_DEEP}" style="background-color:${G_DEEP}">

    <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">

      <!-- TOP GOLD BAR -->
      <tr>
        <td height="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
      </tr>

      <!-- HEADER -->
      <tr>
        <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:0">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td bgcolor="${G_MID}" style="background-color:${G_MID};padding:36px 44px">

                <!-- Logo row -->
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td bgcolor="#ffffff14" style="background-color:rgba(255,255,255,0.08);border-radius:8px;padding:10px 14px">
                      <img src="${LOGO}" width="36" height="36" alt="Iyadi" style="height:36px;width:auto;display:inline-block;vertical-align:middle"/>
                    </td>
                    <td style="padding-left:14px;vertical-align:middle">
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:${GOLD};font-weight:600;margin:0">Internal notification</p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin:4px 0 0">iyadiplanningsolutions.com</p>
                    </td>
                  </tr>
                </table>

                <!-- Headline -->
                <p style="font-family:'Playfair Display',Georgia,serif;font-size:40px;font-weight:900;
                           color:#fff;line-height:1.05;margin:28px 0 0;letter-spacing:-0.02em">
                  New Enquiry<br/>
                  <span style="color:${GOLD_LT};font-style:italic">${name}</span>
                </p>

                <!-- Service pill -->
                <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:18px">
                  <tr>
                    <td bgcolor="${G_BRIGHT}" style="background-color:${G_BRIGHT};border:1px solid ${GOLD};border-radius:100px;padding:7px 18px">
                      <span style="font-family:'Space Mono',monospace,Arial;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD_LT};font-weight:700">${serviceDisplay}</span>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- DETAILS CARD -->
      <tr>
        <td bgcolor="${PAPER}" style="background-color:${PAPER};padding:36px 44px 0">
          <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
                     text-transform:uppercase;color:${G_BRIGHT};font-weight:700;
                     border-bottom:2px solid ${GOLD};padding-bottom:6px;display:inline-block;margin:0">
            Contact details
          </p>
        </td>
      </tr>

      ${[
        ['Full Name',        name,         PAPER],
        ['Company / Org',    orgDisplay,   '#f3f0e8'],
        ['Email',            `<a href="mailto:${email}" style="color:${G_BRIGHT};font-weight:700;text-decoration:none">${email}</a>`, PAPER],
        ['Phone',            phoneDisplay, '#f3f0e8'],
        ['Service Interest', serviceDisplay, PAPER],
      ].map(([label, val, bg]) => `
      <tr>
        <td width="150" bgcolor="${bg}" valign="top"
          style="background-color:${bg};padding:14px 12px 14px 44px;border-bottom:1px solid rgba(13,13,13,0.05)">
          <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.16em;
                     text-transform:uppercase;color:#999;margin:0">${label}</p>
        </td>
        <td bgcolor="${bg}" valign="top"
          style="background-color:${bg};padding:14px 44px 14px 16px;border-bottom:1px solid rgba(13,13,13,0.05)">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};line-height:1.5;margin:0">${val}</p>
        </td>
      </tr>`).join('')}

      <!-- Message label -->
      <tr>
        <td colspan="2" bgcolor="${PAPER}" style="background-color:${PAPER};padding:28px 44px 0">
          <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
                     text-transform:uppercase;color:${G_BRIGHT};font-weight:700;
                     border-bottom:2px solid ${GOLD};padding-bottom:6px;display:inline-block;margin:0">
            Message
          </p>
        </td>
      </tr>

      <!-- Message content -->
      <tr>
        <td colspan="2" bgcolor="${PAPER}" style="background-color:${PAPER};padding:16px 44px 44px">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="3" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td style="padding-left:20px">
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;
                           color:${INK_SOFT};line-height:1.85;margin:0;white-space:pre-wrap">${message}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td colspan="2" bgcolor="${WARM}" style="background-color:${WARM};padding:32px 44px;text-align:center;border-top:3px solid ${GOLD}">
          <a href="mailto:${email}?subject=Re%3A%20Your%20Iyadi%20Planning%20Solutions%20Enquiry&body=Dear%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest%20in%20Iyadi%20Planning%20Solutions."
            style="display:inline-block;background-color:${G_MID};color:#fff;
                   font-family:'Plus Jakarta Sans',Arial,sans-serif;font-weight:700;
                   font-size:13px;letter-spacing:0.08em;text-transform:uppercase;
                   padding:18px 44px;border-radius:100px;text-decoration:none">
            Reply to ${name} &rarr;
          </a>
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:#999;margin:10px 0 0">${email}</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td colspan="2" bgcolor="${G_DEEP}" style="background-color:${G_DEEP};padding:24px 44px;text-align:center">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.3);line-height:1.8;letter-spacing:0.06em;margin:0">
            Iyadi Planning Solutions (Pty) Ltd &nbsp;·&nbsp; Ladysmith, KwaZulu-Natal<br/>
            Reg 2021/652941/07 &nbsp;·&nbsp; B-BBEE Level 1<br/>
            <span style="color:rgba(255,255,255,0.18)">Automated internal notification from website contact form.</span>
          </p>
        </td>
      </tr>

      <!-- BOTTOM GOLD BAR -->
      <tr>
        <td colspan="2" height="4" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
      </tr>

    </table>

  </td>
</tr>
</table>

</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Iyadi Planning Solutions <info@iyadiplanningsolutions.com>',
      to: email,
      subject: "We’ve received your enquiry — Iyadi Planning Solutions",
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
