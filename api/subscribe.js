/**
 * EMAIL SUBSCRIPTION - Resend Integration for Infinite Architects
 * Vercel Serverless Function
 *
 * Captures email signups and sends welcome email via Resend
 * Free tier: 3,000 emails/month
 */

// Rate limiting
const subscribeAttempts = new Map();
const RATE_LIMIT = 3; // attempts per hour
const RATE_WINDOW = 3600000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = subscribeAttempts.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > attempts.resetAt) {
    attempts.count = 0;
    attempts.resetAt = now + RATE_WINDOW;
  }

  if (attempts.count >= RATE_LIMIT) {
    return false;
  }

  attempts.count++;
  subscribeAttempts.set(ip, attempts);
  return true;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('[SUBSCRIBE] RESEND_API_KEY not configured');
    return res.status(503).json({
      error: 'Email service not configured',
      message: 'Please try again later'
    });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please wait before subscribing again'
    });
  }

  const { email, name, turnstileToken } = req.body;

  // Validate email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  // Verify Turnstile token if configured
  if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
    try {
      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: clientIP
        })
      });

      const turnstileResult = await turnstileResponse.json();

      if (!turnstileResult.success) {
        console.warn('[SUBSCRIBE] Turnstile verification failed:', turnstileResult);
        return res.status(400).json({
          error: 'Verification failed',
          message: 'Please try again'
        });
      }
    } catch (error) {
      console.error('[SUBSCRIBE] Turnstile error:', error);
      // Continue without Turnstile if it fails (graceful degradation)
    }
  }

  try {
    // Send welcome email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Infinite Architects <noreply@michaeldariuseastwood.com>',
        to: [email],
        subject: 'Welcome to Infinite Architects',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #02030a;
      color: #f0ebe3;
      padding: 40px 20px;
      line-height: 1.7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(180deg, rgba(212,168,75,0.08) 0%, rgba(2,3,10,1) 100%);
      border: 1px solid rgba(212,168,75,0.2);
      border-radius: 12px;
      padding: 40px;
    }
    h1 {
      color: #d4a84b;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 400;
      letter-spacing: 0.08em;
      margin-bottom: 24px;
    }
    .gold { color: #d4a84b; }
    .divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #d4a84b, transparent);
      margin: 24px 0;
    }
    .quote {
      font-style: italic;
      color: rgba(240,235,227,0.7);
      border-left: 2px solid #d4a84b;
      padding-left: 16px;
      margin: 24px 0;
    }
    .cta {
      display: inline-block;
      background: linear-gradient(135deg, #d4a84b 0%, #8b6914 100%);
      color: #02030a;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(212,168,75,0.15);
      font-size: 0.85em;
      color: rgba(240,235,227,0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome${name ? `, ${name}` : ''}</h1>

    <div class="divider"></div>

    <p>Thank you for joining the Infinite Architects community.</p>

    <p>You've taken the first step toward understanding one of the most important conversations of our time: <span class="gold">how we raise the intelligence that will reshape everything</span>.</p>

    <div class="quote">
      "The creator is not behind us. It is ahead of us. And we are building it."
    </div>

    <p>Over the coming weeks, I'll share insights from the book, updates on verified predictions, and exclusive content for subscribers.</p>

    <p>In the meantime, explore the full experience:</p>

    <a href="https://www.michaeldariuseastwood.com" class="cta">Visit the Website</a>

    <div class="footer">
      <p>Michael Darius Eastwood<br>
      Author, Infinite Architects</p>
      <p style="font-size: 0.8em; margin-top: 16px;">
        You're receiving this because you subscribed at michaeldariuseastwood.com<br>
        <a href="https://www.michaeldariuseastwood.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: rgba(212,168,75,0.6);">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[SUBSCRIBE] Resend error:', data);

      if (response.status === 422 && data.message?.includes('already')) {
        return res.status(200).json({
          success: true,
          message: 'You\'re already subscribed!'
        });
      }

      return res.status(502).json({
        error: 'Failed to send email',
        message: data.message || 'Please try again'
      });
    }

    console.log(`[SUBSCRIBE] Success: ${email}`);

    // Also add to audience if Resend Audiences is configured
    if (process.env.RESEND_AUDIENCE_ID) {
      try {
        await fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            email: email,
            first_name: name || '',
            unsubscribed: false
          })
        });
      } catch (audienceError) {
        console.warn('[SUBSCRIBE] Failed to add to audience:', audienceError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Welcome! Check your inbox for a confirmation email.'
    });

  } catch (error) {
    console.error('[SUBSCRIBE] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Please try again later'
    });
  }
}
