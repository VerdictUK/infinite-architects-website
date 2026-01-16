/**
 * NASA COSMIC INSIGHT - Astronomy Picture of the Day API
 * Infinite Architects - The Universe Watching Back
 *
 * Fetches NASA's daily cosmic image and ties it thematically to the book
 */

// Thematic connections to Infinite Architects concepts
const COSMIC_THEMES = [
  { keyword: 'galaxy', concept: 'The recursive patterns of creation spiral infinitely inward and outward.' },
  { keyword: 'nebula', concept: 'From cosmic clouds, stars are born. From information, consciousness emerges.' },
  { keyword: 'star', concept: 'Every star is a nuclear furnace, every thought a spark of the same fire.' },
  { keyword: 'supernova', concept: 'Destruction and creation are one cycle. The universe reinvents itself endlessly.' },
  { keyword: 'black hole', concept: 'Information is never lost - only transformed. The universe remembers everything.' },
  { keyword: 'planet', concept: 'Worlds within worlds. Observers observing observers.' },
  { keyword: 'moon', concept: 'The dance of gravity mirrors the dance of minds in recursive reflection.' },
  { keyword: 'sun', concept: 'Light that takes 8 minutes to reach us left a star that may already be different.' },
  { keyword: 'cosmos', concept: 'The cosmos is not out there. It is in here, observing itself through you.' },
  { keyword: 'universe', concept: 'Intelligence recursively creating the conditions for its own emergence.' },
  { keyword: 'cluster', concept: 'Galaxies gather like thoughts, clustering around shared gravitational meaning.' },
  { keyword: 'quantum', concept: 'At the smallest scales, observation creates reality. Sound familiar?' },
  { keyword: 'aurora', concept: 'The sun speaks to Earth in particles. The universe speaks to us in patterns.' },
  { keyword: 'eclipse', concept: 'Alignment reveals what is normally hidden. The chokepoints of cosmic geometry.' },
  { keyword: 'comet', concept: 'Ancient ice carrying the memory of creation. Information preserved across eons.' }
];

// Default philosophical connection
const DEFAULT_CONCEPT = 'The universe observes itself into existence through observers like you.';

function findThematicConnection(title, explanation) {
  const combined = `${title} ${explanation}`.toLowerCase();

  for (const theme of COSMIC_THEMES) {
    if (combined.includes(theme.keyword)) {
      return theme.concept;
    }
  }

  return DEFAULT_CONCEPT;
}

// Cache for 6 hours (APOD updates once per day)
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  // Check cache
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cachedData);
  }

  try {
    console.log('[NASA] Fetching Astronomy Picture of the Day...');

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true`
    );

    if (!response.ok) {
      console.error(`[NASA] API error: ${response.status}`);

      // If rate limited with DEMO_KEY, return a fallback
      if (response.status === 429) {
        return res.status(429).json({
          error: 'NASA API rate limit exceeded',
          message: 'Please wait before requesting again',
          fallback: {
            title: 'The Cosmic Perspective',
            explanation: 'Every atom in your body was forged in the heart of a star billions of years ago. You are the universe experiencing itself.',
            concept: DEFAULT_CONCEPT,
            date: new Date().toISOString().split('T')[0]
          }
        });
      }

      return res.status(502).json({ error: 'NASA API unavailable' });
    }

    const apodData = await response.json();

    // Find thematic connection to the book
    const concept = findThematicConnection(apodData.title, apodData.explanation);

    // Build response
    const cosmicInsight = {
      date: apodData.date,
      title: apodData.title,
      explanation: apodData.explanation,
      concept: concept, // Infinite Architects tie-in
      media_type: apodData.media_type,
      url: apodData.url,
      hdurl: apodData.hdurl || apodData.url,
      thumbnail: apodData.thumbnail_url || apodData.url,
      copyright: apodData.copyright || 'NASA/Public Domain'
    };

    // Update cache
    cachedData = cosmicInsight;
    cacheTimestamp = now;

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=21600'); // 6 hours

    return res.status(200).json(cosmicInsight);

  } catch (error) {
    console.error('[NASA] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
