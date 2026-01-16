/**
 * TEXT-TO-SPEECH - ElevenLabs Proxy for Infinite Architects
 * Vercel Serverless Function
 *
 * Securely proxies requests to ElevenLabs API without exposing API key
 */

// Available voices optimised for British English book narration
const VOICES = {
  adam: 'pNInz6obpgDQGcFmaJgB',      // Adam - natural British male
  daniel: 'onwK4e9ZLuTAKqWW03F9',    // Daniel - authoritative British
  charlie: 'IKne3meq5aSn9XLyUdCD',   // Charlie - conversational
  george: 'JBFqnCBsd6RMkjVDRZzb',    // George - warm British
  default: 'pNInz6obpgDQGcFmaJgB'    // Default to Adam
};

// Rate limiting (simple in-memory, resets on cold start)
const rateLimits = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > userLimits.resetAt) {
    userLimits.count = 0;
    userLimits.resetAt = now + RATE_WINDOW;
  }

  if (userLimits.count >= RATE_LIMIT) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(ip, userLimits);
  return true;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(503).json({
      error: 'Text-to-speech service not configured',
      message: 'ELEVENLABS_API_KEY not set in environment'
    });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Please wait before requesting more audio'
    });
  }

  const { text, voice = 'default' } = req.body;

  // Validate text
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  // Limit text length to prevent abuse (ElevenLabs charges per character)
  const MAX_CHARS = 2500;
  const sanitisedText = text.trim().slice(0, MAX_CHARS);

  if (sanitisedText.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  // Get voice ID
  const voiceId = VOICES[voice] || VOICES.default;

  try {
    console.log(`[TTS] Generating speech: ${sanitisedText.slice(0, 50)}... (${sanitisedText.length} chars)`);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: sanitisedText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TTS] ElevenLabs error: ${response.status} - ${errorText}`);

      if (response.status === 401) {
        return res.status(503).json({ error: 'Voice service authentication failed' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Voice service rate limit exceeded' });
      }

      return res.status(502).json({ error: 'Voice service unavailable' });
    }

    // Stream the audio back
    const audioBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('[TTS] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
