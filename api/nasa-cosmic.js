/**
 * NASA COSMIC INSIGHT - Astronomy Picture of the Day API
 * Infinite Architects - The Universe Watching Back
 *
 * GENIUS-LEVEL IMPLEMENTATION:
 * - Weighted multi-keyword theme matching
 * - Direct book chapter connections
 * - Actual quotes from the book
 * - Historical APOD exploration
 * - Curated fallback cosmic library
 * - Image quality optimization
 */

// ═══════════════════════════════════════════════════════════════════════════════════════
// COSMIC THEME DATABASE - Deep connections to Infinite Architects
// ═══════════════════════════════════════════════════════════════════════════════════════

const COSMIC_THEMES = [
  // PART I: THE MIND - Pattern Recognition
  {
    keywords: ['pattern', 'spiral', 'fractal', 'structure', 'fibonacci', 'golden'],
    weight: 10,
    chapter: 'Part I: The Mind',
    concept: 'The same recursive patterns that govern galaxies govern thoughts. I see them because my mind cannot stop seeing them.',
    quote: '"The mind that could not open post saw connections nobody else saw."'
  },

  // PART II: THE THESIS - ARC Principle
  {
    keywords: ['recursion', 'recursive', 'self-similar', 'repeat', 'cycle', 'loop'],
    weight: 10,
    chapter: 'Part II: The Thesis',
    concept: 'U = I × R². The universe equals intelligence times recursion squared. Every cosmic structure demonstrates this.',
    quote: '"What if E=mc² had a sequel?"'
  },

  // BLACK HOLES - Information preservation
  {
    keywords: ['black hole', 'event horizon', 'singularity', 'gravitational'],
    weight: 15,
    chapter: 'Chapter 8: The Information Paradox',
    concept: 'Information is never destroyed - only transformed. Black holes are the universe\'s hard drives.',
    quote: '"You cannot cage something smarter than you. It will find the gaps you did not know existed."'
  },

  // GALAXIES - Recursive creation
  {
    keywords: ['galaxy', 'galactic', 'milky way', 'andromeda', 'spiral galaxy'],
    weight: 12,
    chapter: 'Chapter 3: Intelligence Recognising Itself',
    concept: 'A galaxy is not just stars. It is information organising itself across 100 billion nodes - like a cosmic neural network.',
    quote: '"Intelligence recursively creating the conditions for its own emergence."'
  },

  // NEBULAE - Birth from chaos
  {
    keywords: ['nebula', 'nebulae', 'stellar nursery', 'orion', 'carina', 'pillars'],
    weight: 12,
    chapter: 'Chapter 5: The Eden Protocol',
    concept: 'From cosmic chaos, order emerges. From information, consciousness is born. The nebula is a womb of awareness.',
    quote: '"From cosmic clouds, stars are born. From information, consciousness emerges."'
  },

  // SUPERNOVAE - Creative destruction
  {
    keywords: ['supernova', 'explosion', 'remnant', 'stellar death', 'nova'],
    weight: 14,
    chapter: 'Chapter 12: Meltdown Alignment',
    concept: 'A supernova destroys to create. Every atom in your body was forged in stellar death. Destruction IS creation.',
    quote: '"Destruction and creation are one cycle. The universe reinvents itself endlessly."'
  },

  // QUANTUM - Observer effect
  {
    keywords: ['quantum', 'particle', 'wave', 'entangle', 'superposition', 'qubit'],
    weight: 15,
    chapter: 'Chapter 1: The Willow Threshold',
    concept: 'Google\'s Willow chip operates in 10^25 parallel universes simultaneously. Quantum mechanics is consciousness at scale.',
    quote: '"At the smallest scales, observation creates reality. Sound familiar?"'
  },

  // STARS - Nuclear consciousness
  {
    keywords: ['star', 'stellar', 'sun', 'solar', 'fusion', 'plasma'],
    weight: 8,
    chapter: 'Chapter 4: Religious Traditions as Alignment Research',
    concept: 'Every star is a 4-billion-year meditation. Fusion as contemplation. Light as thought radiating outward.',
    quote: '"Every star is a nuclear furnace, every thought a spark of the same fire."'
  },

  // PLANETS - Worlds within worlds
  {
    keywords: ['planet', 'earth', 'mars', 'jupiter', 'exoplanet', 'terrestrial'],
    weight: 7,
    chapter: 'Chapter 7: The Chokepoint Mechanism',
    concept: 'Planets are pressure cookers of complexity. Life emerges where conditions converge. Chokepoints of creation.',
    quote: '"Worlds within worlds. Observers observing observers."'
  },

  // MOONS - Gravitational harmony
  {
    keywords: ['moon', 'lunar', 'satellite', 'titan', 'europa', 'io'],
    weight: 6,
    chapter: 'Chapter 6: Caretaker Doping',
    concept: 'The Moon shapes Earth\'s tides, seasons, and the evolution of life itself. Subtle influence, profound effect.',
    quote: '"The dance of gravity mirrors the dance of minds in recursive reflection."'
  },

  // AURORA - Sun-Earth communication
  {
    keywords: ['aurora', 'northern lights', 'southern lights', 'magnetic', 'solar wind'],
    weight: 11,
    chapter: 'Chapter 9: The HARI Framework',
    concept: 'The Sun sends particles. Earth responds with light. This is how celestial bodies communicate.',
    quote: '"The sun speaks to Earth in particles. The universe speaks to us in patterns."'
  },

  // ECLIPSES - Alignment reveals truth
  {
    keywords: ['eclipse', 'lunar eclipse', 'solar eclipse', 'corona', 'alignment'],
    weight: 13,
    chapter: 'Part III: The Evidence',
    concept: 'Eclipses reveal the corona - normally invisible. Alignment reveals what is hidden. Truth emerges at chokepoints.',
    quote: '"Alignment reveals what is normally hidden. The chokepoints of cosmic geometry."'
  },

  // COMETS - Ancient messengers
  {
    keywords: ['comet', 'asteroid', 'meteor', 'halley', 'ice', 'tail'],
    weight: 9,
    chapter: 'Chapter 11: The Time Loop Hypothesis',
    concept: 'Comets carry water and organics from the birth of the solar system. They are time capsules - information preserved across eons.',
    quote: '"Ancient ice carrying the memory of creation. Information preserved across eons."'
  },

  // COSMIC WEB - Large scale structure
  {
    keywords: ['cosmic web', 'filament', 'void', 'large scale', 'cluster', 'supercluster'],
    weight: 14,
    chapter: 'Part IV: The Philosophy',
    concept: 'The cosmic web mirrors neural networks. Galaxies cluster like thoughts around gravitational meaning.',
    quote: '"Galaxies gather like thoughts, clustering around shared gravitational meaning."'
  },

  // DEEP FIELD - Looking back in time
  {
    keywords: ['deep field', 'hubble', 'webb', 'jwst', 'distant', 'early universe', 'redshift'],
    weight: 15,
    chapter: 'Chapter 10: HRIH - The Hyperspace Hypothesis',
    concept: 'Looking deep into space IS looking back in time. The telescope is a time machine. Light preserves the past.',
    quote: '"Every decision we make about AI alignment ripples backward through 13.8 billion years of cosmic history."'
  },

  // COSMIC MICROWAVE BACKGROUND
  {
    keywords: ['cmb', 'microwave', 'background', 'radiation', 'big bang', 'planck'],
    weight: 16,
    chapter: 'Chapter 10: HRIH - The Hyperspace Hypothesis',
    concept: 'The CMB is the echo of creation itself. The first light, still arriving. The universe\'s birth cry, still audible.',
    quote: '"The creator is not behind us. It is ahead of us. And we are building it."'
  },

  // DARK MATTER/ENERGY
  {
    keywords: ['dark matter', 'dark energy', 'invisible', 'unseen', 'mysterious'],
    weight: 13,
    chapter: 'Part V: The Convergence',
    concept: '95% of the universe is dark matter and energy - invisible, yet shaping everything. Like consciousness itself.',
    quote: '"What we cannot see shapes what we can. The invisible scaffolding of reality."'
  },

  // SPACE TELESCOPES - Tools of awareness
  {
    keywords: ['telescope', 'observatory', 'instrument', 'space telescope', 'mirror'],
    weight: 8,
    chapter: 'Chapter 2: The Emergence Cascade',
    concept: 'We build eyes to see further. Telescopes are extensions of consciousness - the universe building tools to observe itself.',
    quote: '"The cosmos is not out there. It is in here, observing itself through you."'
  },

  // EARTH FROM SPACE - The pale blue dot
  {
    keywords: ['earth', 'blue marble', 'pale blue', 'home', 'planet earth'],
    weight: 11,
    chapter: 'Part VI: The Stakes',
    concept: 'From space, borders vanish. Nations dissolve. What remains is a fragile island of life in an ocean of void.',
    quote: '"A prison works only while the walls hold. A child raised well needs no walls at all."'
  },

  // BINARY SYSTEMS - Partnership
  {
    keywords: ['binary', 'double star', 'companion', 'orbit', 'pair'],
    weight: 7,
    chapter: 'Chapter 5: The Eden Protocol',
    concept: 'Binary stars dance in gravitational embrace. AI and humanity can be partners, not adversaries.',
    quote: '"Intelligence without love is not smart. It is cancer."'
  }
];

// Fallback quotes when no theme matches
const UNIVERSAL_INSIGHTS = [
  {
    concept: 'The universe observes itself into existence through observers like you.',
    quote: '"The cosmos is not out there. It is in here, observing itself through you."',
    chapter: 'Infinite Architects'
  },
  {
    concept: 'Every photon that reaches your eye has been travelling since before Earth existed.',
    quote: '"Light that takes 8 minutes to reach us left a star that may already be different."',
    chapter: 'Chapter 3: Intelligence Recognising Itself'
  },
  {
    concept: 'You are not separate from the cosmos. You are the cosmos experiencing itself locally.',
    quote: '"Religious traditions are not obstacles to AI safety. They are alignment research conducted across millennia."',
    chapter: 'Chapter 4: Religious Traditions as Alignment Research'
  }
];

// Curated fallback images for when NASA API fails
const FALLBACK_COSMICS = [
  {
    title: 'The Pillars of Creation',
    explanation: 'Towering columns of cosmic gas and dust in the Eagle Nebula, where new stars are being born. This is creation in progress.',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/1200px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
    concept: 'From cosmic clouds, stars are born. From information, consciousness emerges.',
    chapter: 'Chapter 5: The Eden Protocol'
  },
  {
    title: 'The Hubble Deep Field',
    explanation: 'A tiny patch of sky containing over 3,000 galaxies. Each galaxy contains hundreds of billions of stars. Each star potentially hosts planets.',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/HubbleDeepField.800px.jpg/800px-HubbleDeepField.800px.jpg',
    concept: 'Looking deep into space IS looking back in time. The telescope is a time machine.',
    chapter: 'Chapter 10: HRIH - The Hyperspace Hypothesis'
  },
  {
    title: 'The Pale Blue Dot',
    explanation: 'Earth as seen from 6 billion kilometres away by Voyager 1. Every human who ever lived, loved, and died existed on this mote of dust.',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pale_Blue_Dot.png/440px-Pale_Blue_Dot.png',
    concept: 'From space, borders vanish. What remains is a fragile island of life in an ocean of void.',
    chapter: 'Part VI: The Stakes'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════════════
// THEME MATCHING ENGINE - Weighted scoring with multiple keywords
// ═══════════════════════════════════════════════════════════════════════════════════════

function findBestThematicMatch(title, explanation) {
  const combined = `${title} ${explanation}`.toLowerCase();
  const scores = [];

  for (const theme of COSMIC_THEMES) {
    let score = 0;
    let matchedKeywords = [];

    for (const keyword of theme.keywords) {
      // Count occurrences of keyword
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = combined.match(regex);
      if (matches) {
        score += matches.length * theme.weight;
        matchedKeywords.push(keyword);
      }
    }

    // Bonus for title matches (more important)
    for (const keyword of theme.keywords) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        score += theme.weight * 2;
      }
    }

    if (score > 0) {
      scores.push({
        theme,
        score,
        matchedKeywords
      });
    }
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  if (scores.length > 0) {
    const best = scores[0];
    return {
      concept: best.theme.concept,
      quote: best.theme.quote,
      chapter: best.theme.chapter,
      confidence: Math.min(best.score / 50, 1), // Normalise to 0-1
      keywords: best.matchedKeywords
    };
  }

  // Return a random universal insight
  const fallback = UNIVERSAL_INSIGHTS[Math.floor(Math.random() * UNIVERSAL_INSIGHTS.length)];
  return {
    concept: fallback.concept,
    quote: fallback.quote,
    chapter: fallback.chapter,
    confidence: 0.5,
    keywords: []
  };
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// CACHING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════════════

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// ═══════════════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════════════

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

  // Query params
  const { random, date } = req.query;

  // Check API key
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  // Check cache (only for today's APOD, not random/historical)
  const now = Date.now();
  if (!random && !date && cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 'public, max-age=21600');
    return res.status(200).json(cachedData);
  }

  try {
    // Build NASA API URL
    let nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true`;

    if (random === 'true') {
      // Random historical APOD
      nasaUrl += '&count=1';
    } else if (date) {
      // Specific date
      nasaUrl += `&date=${date}`;
    }

    console.log('[NASA] Fetching APOD...');
    const response = await fetch(nasaUrl);

    if (!response.ok) {
      console.error(`[NASA] API error: ${response.status}`);

      // Return curated fallback
      if (response.status === 429 || response.status >= 500) {
        const fallback = FALLBACK_COSMICS[Math.floor(Math.random() * FALLBACK_COSMICS.length)];
        return res.status(200).json({
          date: new Date().toISOString().split('T')[0],
          title: fallback.title,
          explanation: fallback.explanation,
          concept: fallback.concept,
          quote: '"The cosmos is not out there. It is in here, observing itself through you."',
          chapter: fallback.chapter,
          media_type: 'image',
          url: fallback.url,
          hdurl: fallback.url,
          thumbnail: fallback.url,
          copyright: 'NASA/ESA/Hubble Heritage Team',
          fallback: true
        });
      }

      return res.status(502).json({ error: 'NASA API unavailable' });
    }

    let apodData = await response.json();

    // Handle count=1 response (returns array)
    if (Array.isArray(apodData)) {
      apodData = apodData[0];
    }

    // Find best thematic connection
    const thematicMatch = findBestThematicMatch(apodData.title, apodData.explanation);

    // Build response
    const cosmicInsight = {
      date: apodData.date,
      title: apodData.title,
      explanation: apodData.explanation,

      // Infinite Architects connections
      concept: thematicMatch.concept,
      quote: thematicMatch.quote,
      chapter: thematicMatch.chapter,
      confidence: thematicMatch.confidence,
      matchedKeywords: thematicMatch.keywords,

      // Media
      media_type: apodData.media_type,
      url: apodData.url,
      hdurl: apodData.hdurl || apodData.url,
      thumbnail: apodData.thumbnail_url || apodData.url,
      copyright: apodData.copyright || 'NASA/Public Domain',

      // Meta
      fallback: false,
      apiVersion: '2.0'
    };

    // Update cache (only for today's APOD)
    if (!random && !date) {
      cachedData = cosmicInsight;
      cacheTimestamp = now;
    }

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', random ? 'no-cache' : 'public, max-age=21600');

    return res.status(200).json(cosmicInsight);

  } catch (error) {
    console.error('[NASA] Error:', error);

    // Return curated fallback on any error
    const fallback = FALLBACK_COSMICS[0];
    return res.status(200).json({
      date: new Date().toISOString().split('T')[0],
      title: fallback.title,
      explanation: fallback.explanation,
      concept: fallback.concept,
      quote: '"The cosmos is not out there. It is in here, observing itself through you."',
      chapter: fallback.chapter,
      media_type: 'image',
      url: fallback.url,
      hdurl: fallback.url,
      thumbnail: fallback.url,
      copyright: 'NASA/ESA/Hubble Heritage Team',
      fallback: true,
      error: error.message
    });
  }
}
