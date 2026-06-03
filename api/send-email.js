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
  const GREEN   = '#174d17';   // header / accents (matches hero images)
  const GREEN_D = '#0d3b0d';   // deepest green
  const GOLD    = '#c9a327';
  const PAPER   = '#fafaf7';
  const WARM    = '#f0ede6';
  const INK     = '#0d0d0d';
  const INK_2   = '#44504a';
  const year    = new Date().getFullYear();

  // Baked hero images — Gmail dark mode cannot recolour images, so the
  // cinematic green look is identical on every client, light or dark.
  const HERO_CLIENT = 'https://www.iyadiplanningsolutions.com/brand/email/hero-client.png';
  const HERO_ADMIN  = 'https://www.iyadiplanningsolutions.com/brand/email/hero-admin.png';

  const svc  = service || 'General enquiry';
  const org2 = org     || '—';
  const ph   = phone   || '—';

  const head = (title) => `
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="color-scheme" content="light"/>
<meta name="supported-color-schemes" content="light"/>
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet"/>
<style>
  body,table,td,p,a,div{ -webkit-text-size-adjust:100%; }
  body{ margin:0; padding:0; background-color:${WARM}; }
  img{ border:0; outline:none; text-decoration:none; display:block; }
  a{ text-decoration:none; }
  .hero-img{ width:100%; max-width:600px; height:auto; display:block; }
</style>`;

  // ══════════════════════════════════════════════════════════════════════════
  // EMAIL 1 — Client thank-you  (image hero + light-bg body)
  // ══════════════════════════════════════════════════════════════════════════
  const autoReplyHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>${head('Thank you — Iyadi Planning Solutions')}</head>
<body style="margin:0;padding:0;background-color:${WARM}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${WARM}" style="background-color:${WARM}">
<tr><td align="center" style="padding:0">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">

    <!-- ── IMAGE HERO (baked, dark-mode-proof) ── -->
    <tr><td style="padding:0;font-size:0;line-height:0">
      <img src="${HERO_CLIENT}" alt="We've got your message — Iyadi Planning Solutions"
        class="hero-img" width="600" style="width:100%;max-width:600px;height:auto;display:block"/>
    </td></tr>

    <!-- ── GOLD PROMISE BAND ── -->
    <tr><td bgcolor="${GOLD}" style="background-color:${GOLD};padding:16px 44px;text-align:center">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;
         letter-spacing:0.2em;text-transform:uppercase;color:${GREEN_D};font-weight:700;margin:0">
        We respond within 2 business days
      </p>
    </td></tr>

    <!-- ── BODY (light bg, dark text) ── -->
    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:44px 44px 8px">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:16px;color:${INK_2};line-height:1.7;margin:0 0 8px">
        Thank you, <strong style="color:${INK}">${name}</strong>. Your enquiry has been received and is in the right hands.
      </p>
    </td></tr>

    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:24px 44px 40px">
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:800;color:${GREEN};margin:0 0 22px">
        What happens next?
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-bottom:1px solid #e6e2d8">
        <tr><td style="padding:14px 0">
          <table cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td width="40" valign="top"><p style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};margin:0;line-height:1">01</p></td>
            <td style="padding-left:14px">
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:700;color:${INK};margin:0 0 4px">Your enquiry is reviewed</p>
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">A registered specialist reads your message and assesses the best path forward.</p>
            </td>
          </tr></table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-bottom:1px solid #e6e2d8">
        <tr><td style="padding:14px 0">
          <table cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td width="40" valign="top"><p style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};margin:0;line-height:1">02</p></td>
            <td style="padding-left:14px">
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:700;color:${INK};margin:0 0 4px">We reach out directly</p>
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">Expect a call or email within 2 business days with a clear next step.</p>
            </td>
          </tr></table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr><td style="padding:14px 0">
          <table cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td width="40" valign="top"><p style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:800;color:${GOLD};margin:0;line-height:1">03</p></td>
            <td style="padding-left:14px">
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:700;color:${INK};margin:0 0 4px">Your project gets moving</p>
              <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:13px;color:${INK_2};line-height:1.6;margin:0">From land-use approval to construction completion, one accountable team handles it all.</p>
            </td>
          </tr></table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:30px">
        <tr><td bgcolor="${WARM}" style="background-color:${WARM};border:1px solid ${GOLD};border-radius:8px;padding:18px 22px">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};font-weight:700;margin:0 0 8px">Need to reach us now?</p>
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;color:${INK};font-weight:600;margin:0">
            <a href="tel:0360040024" style="color:${GREEN};font-weight:700;text-decoration:none">036 004 0024</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:info@iyadiplanningsolutions.com" style="color:${INK_2};font-size:13px;text-decoration:none">info@iyadiplanningsolutions.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>

    <!-- ── SIGN-OFF ── -->
    <tr><td bgcolor="${WARM}" style="background-color:${WARM};padding:28px 44px;border-top:3px solid ${GOLD}">
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:19px;font-weight:800;color:${GREEN};margin:0">The Iyadi Team</p>
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:${GOLD};margin:6px 0 0">Reaching New Heights</p>
    </td></tr>

    <!-- ── FOOTER ── -->
    <tr><td bgcolor="${GREEN}" style="background-color:${GREEN};padding:22px 44px;text-align:center">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:#c5d4c5;line-height:1.8;margin:0">
        45 Queen Street, Office No.&nbsp;6 &middot; Ladysmith, 3370 &middot; KwaZulu-Natal<br/>
        <a href="https://www.iyadiplanningsolutions.com" style="color:${GOLD};text-decoration:none">iyadiplanningsolutions.com</a>
        &nbsp;&middot;&nbsp; Reg 2021/652941/07 &nbsp;&middot;&nbsp; B-BBEE Level 1
      </p>
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:#8aa68a;margin:10px 0 0">
        &copy; ${year} Iyadi Planning Solutions (Pty) Ltd. Automated confirmation &mdash; do not reply.
      </p>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

  // ══════════════════════════════════════════════════════════════════════════
  // EMAIL 2 — Internal admin notification  (image hero + light body)
  // ══════════════════════════════════════════════════════════════════════════
  const rows = [
    ['Full Name',        name],
    ['Company / Org',    org2],
    ['Email',            `<a href="mailto:${email}" style="color:${GREEN};font-weight:700;text-decoration:none">${email}</a>`],
    ['Phone',            ph],
    ['Service Interest', svc],
  ];

  const internalHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>${head(`New enquiry — ${name}`)}</head>
<body style="margin:0;padding:0;background-color:${WARM}">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="${WARM}" style="background-color:${WARM}">
<tr><td align="center" style="padding:0">

  <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%">

    <!-- ── IMAGE HERO ── -->
    <tr><td style="padding:0;font-size:0;line-height:0">
      <img src="${HERO_ADMIN}" alt="New website enquiry — Iyadi Planning Solutions"
        class="hero-img" width="600" style="width:100%;max-width:600px;height:auto;display:block"/>
    </td></tr>

    <!-- ── WHO + SERVICE ── -->
    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:34px 44px 0">
      <p style="font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:800;color:${GREEN};margin:0 0 14px">
        ${name}
      </p>
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr><td bgcolor="${GREEN}" style="background-color:${GREEN};border-radius:100px;padding:7px 18px">
          <span style="font-family:'Space Mono',monospace,Arial;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#e3c265;font-weight:700">${svc}</span>
        </td></tr>
      </table>
    </td></tr>

    <!-- ── DETAILS ── -->
    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:30px 44px 0">
      <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
         text-transform:uppercase;color:${GREEN};font-weight:700;border-bottom:2px solid ${GOLD};
         padding-bottom:6px;display:inline-block;margin:0">Contact details</p>
    </td></tr>

    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:0 44px">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${rows.map(([label, val], i) => {
          const rbg = i % 2 === 0 ? PAPER : '#f3f0e8';
          return `<tr>
          <td width="150" bgcolor="${rbg}" valign="top" style="background-color:${rbg};padding:13px 12px 13px 0;border-top:1px solid #e6e2d8">
            <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#888;margin:0">${label}</p>
          </td>
          <td bgcolor="${rbg}" valign="top" style="background-color:${rbg};padding:13px 0 13px 16px;border-top:1px solid #e6e2d8">
            <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};line-height:1.5;margin:0">${val}</p>
          </td>
        </tr>`;
        }).join('')}
      </table>
    </td></tr>

    <!-- message -->
    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:26px 44px 0">
      <p style="font-family:'Space Mono',monospace,Arial;font-size:9px;letter-spacing:0.28em;
         text-transform:uppercase;color:${GREEN};font-weight:700;border-bottom:2px solid ${GOLD};
         padding-bottom:6px;display:inline-block;margin:0">Message</p>
    </td></tr>
    <tr><td bgcolor="${PAPER}" style="background-color:${PAPER};padding:14px 44px 40px">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
        <td width="3" bgcolor="${GOLD}" style="background-color:${GOLD};font-size:0">&nbsp;</td>
        <td style="padding-left:18px">
          <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:15px;color:${INK_2};line-height:1.8;margin:0;white-space:pre-wrap">${message}</p>
        </td>
      </tr></table>
    </td></tr>

    <!-- ── CTA ── -->
    <tr><td bgcolor="${WARM}" style="background-color:${WARM};padding:28px 44px;text-align:center;border-top:3px solid ${GOLD}">
      <a href="mailto:${email}?subject=Re%3A%20Your%20Iyadi%20Planning%20Solutions%20Enquiry&body=Dear%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest."
        style="display:inline-block;background-color:${GREEN};color:#ffffff;
               font-family:'Plus Jakarta Sans',Arial,sans-serif;font-weight:700;
               font-size:13px;letter-spacing:0.08em;text-transform:uppercase;
               padding:16px 40px;border-radius:100px;text-decoration:none">
        Reply to ${name} &rarr;
      </a>
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:11px;color:#999;margin:10px 0 0">${email}</p>
    </td></tr>

    <!-- ── FOOTER ── -->
    <tr><td bgcolor="${GREEN}" style="background-color:${GREEN};padding:22px 44px;text-align:center">
      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif;font-size:10px;color:#c5d4c5;line-height:1.8;margin:0">
        Iyadi Planning Solutions (Pty) Ltd &nbsp;&middot;&nbsp; Ladysmith, KwaZulu-Natal<br/>
        Reg 2021/652941/07 &nbsp;&middot;&nbsp; B-BBEE Level 1
      </p>
    </td></tr>

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

    // ADMIN_EMAIL may hold one address or several, comma-separated.
    // e.g. "mongezishabangu@gmail.com, info@iyadiplanningsolutions.com"
    const adminRecipients = (process.env.ADMIN_EMAIL || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    await resend.emails.send({
      from: 'Iyadi Website <noreply@iyadiplanningsolutions.com>',
      to: adminRecipients,
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
