const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, org, email, phone, service, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // ── Brand tokens ──────────────────────────────────────────────────────────
  // NOT near-black: iOS Mail smart-inverts colours close to #000.
  // #0a1f0a is unmistakably dark-green, never confused with "black".
  const G_DEEP  = '#0a1f0a';   // very dark green  — hero / footer bg
  const G_MID   = '#132b13';   // dark forest green — header panels
  const G_PILL  = '#1a4d1a';   // rich green        — pill badge bg
  const GOLD    = '#c9a327';
  const GOLD_LT = '#e3c265';
  const PAPER   = '#fafaf7';
  const WARM    = '#f0ede6';
  const INK     = '#0d0d0d';
  const INK_2   = '#44504a';
  const LOGO    = 'https://www.iyadiplanningsolutions.com/brand/iyadi-logo.png';
  const year    = new Date().getFullYear();

  const svc  = service || 'General enquiry';
  const org2 = org     || '—';
  const ph   = phone   || '—';

  // ── Shared head fragment ──────────────────────────────────────────────────
  // color-scheme:light + !important overrides stop iOS Mail smart-inverting
  const headCSS = (title) => `
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet"/>
<style>
  :root{ color-scheme:light !important; }
  body,table,td,div,p,span,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  body{ margin:0; padding:0; background-color:${G_DEEP} !important; }
  img{ border:0; outline:none; text-decoration:none; display:block; }
  a{ text-decoration:none; }
  /* Force light rendering on iOS Mail / Apple Mail dark mode */
  @media (prefers-color-scheme:dark){
    .dark-hero    { background-color:${G_DEEP}  !important; }
    .dark-panel   { background-color:${G_MID}   !important; }
    .dark-gold    { background-color:${GOLD}    !important; }
    .dark-paper   { background-color:${PAPER}   !important; }
    .dark-warm    { background-color:${WARM}    !important; }
    .white-text   { color:#ffffff !important; }
    .gold-text    { color:${GOLD_LT} !important; }
    .ink-text     { color:${INK}    !important; }
    .ink2-text    { color:${INK_2}  !important; }
  }
</style>`;

  // ══════════════════════════════════════════════════════════════════════════
  // EMAIL 1 — Client thank-you
  // ══════════════════════════════════════════════════════════════════════════
  const autoReplyHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>${headCSS('Thank you — Iyadi Planning Solutions')}</head>
<body class="dark-hero" style="margin:0;padding:0;background-color:${G_DEEP}" bgcolor="${G_DEEP}">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  bgcolor="${G_DEEP}" style="background-color:${G_DEEP}">
<tr><td align="center" bgcolor="${G_DEEP}" style="background-color:${G_DEEP}">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
    style="max-width:600px;width:100%">

    <!-- top gold bar -->
    <tr><td height="4" bgcolor="${GOLD}" class="dark-gold"
      style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- ── HERO ── -->
    <tr><td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};padding:0">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="4" bgcolor="${GOLD}" class="dark-gold" style="background-color:${GOLD};font-size:0">&nbsp;</td>
          <td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};padding:48px 44px 0">

            <!-- logo -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr><td style="background-color:rgba(255,255,255,0.1);border-radius:10px;padding:12px 16px">
                <img src="${LOGO}" width="44" height="44" alt="Iyadi Planning Solutions" style="height:44px;width:auto"/>
              </td></tr>
            </table>

            <!-- eyebrow -->
            <p class="gold-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;
               letter-spacing:0.28em;text-transform:uppercase;color:${GOLD};
               margin:28px 0 0;font-weight:500">
              Town Planning &nbsp;&middot;&nbsp; Architecture &nbsp;&middot;&nbsp; Construction
            </p>

            <!-- headline -->
            <p class="white-text" style="font-family:'Playfair Display',Georgia,serif;font-size:50px;
               font-weight:900;line-height:1.02;color:#ffffff;margin:14px 0 0;letter-spacing:-0.02em">
              We&rsquo;ve got<br/>
              <span class="gold-text" style="color:${GOLD_LT};font-style:italic">your message.</span>
            </p>

            <!-- subline -->
            <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;
               color:rgba(255,255,255,0.65);line-height:1.7;margin:18px 0 0;font-weight:300">
              Thank you, <strong class="white-text" style="color:#fff;font-weight:600">${name}</strong>.
              Your enquiry has been received and is in the right hands.
            </p>

          </td>
        </tr>
      </table>

      <!-- gold accent line -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="4" bgcolor="${GOLD}" class="dark-gold" style="background-color:${GOLD};font-size:0">&nbsp;</td>
          <td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};padding:28px 44px 0">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td width="48" height="1" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td>
                <td width="10">&nbsp;</td>
                <td width="24" height="1" bgcolor="${G_PILL}" style="background-color:${G_PILL};font-size:0;line-height:0">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- stats -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="4" bgcolor="${GOLD}" class="dark-gold" style="background-color:${GOLD};font-size:0">&nbsp;</td>
          <td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};padding:24px 44px 48px">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="padding-right:32px;border-right:1px solid rgba(255,255,255,0.14)">
                  <p class="white-text" style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:800;color:#fff;line-height:1;margin:0">2021</p>
                  <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:5px 0 0">Founded</p>
                </td>
                <td style="padding:0 32px;border-right:1px solid rgba(255,255,255,0.14)">
                  <p class="white-text" style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:800;color:#fff;line-height:1;margin:0">11</p>
                  <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:5px 0 0">Specialists</p>
                </td>
                <td style="padding-left:32px">
                  <p class="gold-text" style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:800;color:${GOLD_LT};line-height:1;margin:0">L1</p>
                  <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:5px 0 0">B&#8209;BBEE</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- ── PROMISE BAND ── -->
    <tr><td bgcolor="${GOLD}" class="dark-gold" style="background-color:${GOLD};padding:16px 48px">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;
         letter-spacing:0.2em;text-transform:uppercase;color:${G_DEEP};font-weight:700;margin:0">
        We respond within 2 business days
      </p>
    </td></tr>

    <!-- ── BODY ── -->
    <tr><td bgcolor="${PAPER}" class="dark-paper" style="background-color:${PAPER};padding:48px 44px 40px">

      <p class="ink-text" style="font-family:'Playfair Display',Georgia,serif;font-size:24px;
         font-weight:800;color:${INK};line-height:1.2;margin:0 0 24px">
        What happens next?
      </p>

      <!-- steps -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:14px 0;border-bottom:1px solid rgba(13,13,13,0.08)">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="40" valign="top">
                <p class="gold-text" style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};line-height:1;margin:0">01</p>
              </td>
              <td style="padding-left:14px">
                <p class="ink-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">Your enquiry is reviewed</p>
                <p class="ink2-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">A registered specialist reads your message and assesses the best path forward.</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:14px 0;border-bottom:1px solid rgba(13,13,13,0.08)">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="40" valign="top">
                <p class="gold-text" style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};line-height:1;margin:0">02</p>
              </td>
              <td style="padding-left:14px">
                <p class="ink-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">We reach out directly</p>
                <p class="ink2-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">Expect a call or email within 2 business days with a clear next step.</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:14px 0">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="40" valign="top">
                <p class="gold-text" style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};line-height:1;margin:0">03</p>
              </td>
              <td style="padding-left:14px">
                <p class="ink-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};margin:0 0 4px">Your project gets moving</p>
                <p class="ink2-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">From land-use approval to construction completion, one accountable team handles it all.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>

      <!-- urgent contact -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px">
        <tr><td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};border-radius:8px;padding:18px 22px">
          <p class="gold-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};font-weight:700;margin:0 0 8px">Need to reach us now?</p>
          <p class="white-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;color:#fff;font-weight:500;margin:0">
            <a href="tel:0360040024" class="gold-text" style="color:${GOLD_LT};font-weight:700;text-decoration:none">036 004 0024</a>
            &nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <a href="mailto:info@iyadiplanningsolutions.com" style="color:rgba(255,255,255,0.55);font-size:13px;text-decoration:none">info@iyadiplanningsolutions.com</a>
          </p>
        </td></tr>
      </table>

    </td></tr>

    <!-- ── SIGN-OFF ── -->
    <tr><td bgcolor="${WARM}" class="dark-warm" style="background-color:${WARM};padding:28px 44px;border-top:3px solid ${GOLD}">
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:19px;font-weight:800;color:${G_DEEP};margin:0">The Iyadi Team</p>
      <p class="gold-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:${GOLD};margin:6px 0 0">Reaching New Heights</p>
    </td></tr>

    <!-- ── FOOTER ── -->
    <tr><td bgcolor="${G_DEEP}" class="dark-hero" style="background-color:${G_DEEP};padding:22px 44px;text-align:center">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.8;margin:0">
        45 Queen Street, Office No.&nbsp;6 &middot; Ladysmith, 3370 &middot; KwaZulu-Natal<br/>
        <a href="https://www.iyadiplanningsolutions.com" class="gold-text" style="color:${GOLD};text-decoration:none">iyadiplanningsolutions.com</a>
        &nbsp;&middot;&nbsp; Reg 2021/652941/07 &nbsp;&middot;&nbsp; B&#8209;BBEE Level&nbsp;1
      </p>
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.2);margin:10px 0 0">
        &copy; ${year} Iyadi Planning Solutions (Pty) Ltd. Automated confirmation &mdash; do not reply.
      </p>
    </td></tr>

    <!-- bottom gold bar -->
    <tr><td height="4" bgcolor="${GOLD}" class="dark-gold"
      style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

  // ══════════════════════════════════════════════════════════════════════════
  // EMAIL 2 — Internal admin notification
  // Single outer column — ALL detail content in ONE nested table so Gmail
  // never sees mixed 1-col / 2-col rows at the same table level.
  // ══════════════════════════════════════════════════════════════════════════
  const rows = [
    ['Full Name',        name],
    ['Company / Org',    org2],
    ['Email',            `<a href="mailto:${email}" style="color:${G_PILL};font-weight:700;text-decoration:none">${email}</a>`],
    ['Phone',            ph],
    ['Service Interest', svc],
  ];

  const internalHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>${headCSS(`New enquiry — ${name}`)}</head>
<body class="dark-hero" style="margin:0;padding:0;background-color:${G_DEEP}" bgcolor="${G_DEEP}">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
  bgcolor="${G_DEEP}" style="background-color:${G_DEEP}">
<tr><td align="center" bgcolor="${G_DEEP}" style="background-color:${G_DEEP}">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation"
    style="max-width:600px;width:100%">

    <!-- top gold bar -->
    <tr><td height="4" bgcolor="${GOLD}" class="dark-gold"
      style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- ── HEADER ── -->
    <tr><td bgcolor="${G_MID}" class="dark-panel" style="background-color:${G_MID};padding:0">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="4" bgcolor="${GOLD}" class="dark-gold" style="background-color:${GOLD};font-size:0">&nbsp;</td>
          <td bgcolor="${G_MID}" class="dark-panel" style="background-color:${G_MID};padding:34px 44px">

            <!-- logo + label -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="background-color:rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px">
                  <img src="${LOGO}" width="34" height="34" alt="Iyadi" style="height:34px;width:auto;display:inline-block;vertical-align:middle"/>
                </td>
                <td style="padding-left:14px;vertical-align:middle">
                  <p class="gold-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.26em;text-transform:uppercase;color:${GOLD};font-weight:600;margin:0">Internal notification</p>
                  <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:4px 0 0">iyadiplanningsolutions.com</p>
                </td>
              </tr>
            </table>

            <!-- headline -->
            <p class="white-text" style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:900;color:#fff;line-height:1.05;margin:24px 0 0;letter-spacing:-0.02em">
              New Enquiry<br/>
              <span class="gold-text" style="color:${GOLD_LT};font-style:italic">${name}</span>
            </p>

            <!-- service pill -->
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:16px">
              <tr><td bgcolor="${G_PILL}" style="background-color:${G_PILL};border:1px solid ${GOLD};border-radius:100px;padding:6px 18px">
                <span class="gold-text" style="font-family:'Space Mono',monospace,Arial;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${GOLD_LT};font-weight:700">${svc}</span>
              </td></tr>
            </table>

          </td>
        </tr>
      </table>
    </td></tr>

    <!-- ── DETAILS — single <td>, one nested table, consistent 2-col structure ── -->
    <tr><td bgcolor="${PAPER}" class="dark-paper" style="background-color:${PAPER};padding:0">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

        <!-- section label -->
        <tr><td colspan="2" bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:32px 44px 18px">
          <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
             text-transform:uppercase;color:${G_PILL};font-weight:700;
             border-bottom:2px solid ${GOLD};padding-bottom:6px;display:inline-block;margin:0">
            Contact details
          </p>
        </td></tr>

        <!-- detail rows — consistent 2-col throughout -->
        ${rows.map(([label, val], i) => {
          const bg = i % 2 === 0 ? PAPER : '#f3f0e8';
          return `<tr>
          <td width="150" bgcolor="${bg}" valign="top"
            style="background-color:${bg};padding:13px 12px 13px 44px;
                   border-top:1px solid rgba(13,13,13,0.06)">
            <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.16em;
               text-transform:uppercase;color:#999;margin:0">${label}</p>
          </td>
          <td bgcolor="${bg}" valign="top"
            style="background-color:${bg};padding:13px 44px 13px 16px;
                   border-top:1px solid rgba(13,13,13,0.06)">
            <p class="ink-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};line-height:1.5;margin:0">${val}</p>
          </td>
        </tr>`;
        }).join('')}

        <!-- message label -->
        <tr><td colspan="2" bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:24px 44px 12px;border-top:1px solid rgba(13,13,13,0.06)">
          <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
             text-transform:uppercase;color:${G_PILL};font-weight:700;
             border-bottom:2px solid ${GOLD};padding-bottom:6px;display:inline-block;margin:0">
            Message
          </p>
        </td></tr>

        <!-- message content with gold left border -->
        <tr><td colspan="2" bgcolor="${PAPER}" class="dark-paper"
          style="background-color:${PAPER};padding:0 44px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td width="3" bgcolor="${GOLD}" class="dark-gold"
                style="background-color:${GOLD};font-size:0">&nbsp;</td>
              <td style="padding:4px 0 4px 18px">
                <p class="ink2-text" style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;color:${INK_2};line-height:1.85;margin:0;white-space:pre-wrap">${message}</p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>

    <!-- ── CTA ── -->
    <tr><td bgcolor="${WARM}" class="dark-warm"
      style="background-color:${WARM};padding:28px 44px;text-align:center;border-top:3px solid ${GOLD}">
      <a href="mailto:${email}?subject=Re%3A%20Your%20Iyadi%20Planning%20Solutions%20Enquiry&body=Dear%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest."
        style="display:inline-block;background-color:${G_MID};color:#fff;
               font-family:'Plus Jakarta Sans',Arial,sans-serif;font-weight:700;
               font-size:13px;letter-spacing:0.08em;text-transform:uppercase;
               padding:16px 40px;border-radius:100px;text-decoration:none">
        Reply to ${name} &rarr;
      </a>
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:#999;margin:10px 0 0">${email}</p>
    </td></tr>

    <!-- ── FOOTER ── -->
    <tr><td bgcolor="${G_DEEP}" class="dark-hero"
      style="background-color:${G_DEEP};padding:22px 44px;text-align:center">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.3);line-height:1.8;margin:0">
        Iyadi Planning Solutions (Pty) Ltd &nbsp;&middot;&nbsp; Ladysmith, KwaZulu-Natal<br/>
        Reg 2021/652941/07 &nbsp;&middot;&nbsp; B&#8209;BBEE Level 1<br/>
        <span style="color:rgba(255,255,255,0.18)">Automated internal notification.</span>
      </p>
    </td></tr>

    <!-- bottom gold bar -->
    <tr><td height="4" bgcolor="${GOLD}" class="dark-gold"
      style="background-color:${GOLD};font-size:0;line-height:0">&nbsp;</td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Iyadi Planning Solutions <info@iyadiplanningsolutions.com>',
      to: email,
      subject: "We've received your enquiry — Iyadi Planning Solutions",
      html: autoReplyHtml,
    });

    await resend.emails.send({
      from: 'Iyadi Website <noreply@iyadiplanningsolutions.com>',
      to: process.env.ADMIN_EMAIL,
      reply_to: email,
      subject: `New enquiry: ${name} — ${svc}`,
      html: internalHtml,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
