/**
 * IMAGE PROXY - Proxies external images to avoid CORS/Service Worker issues
 * Specifically for NASA APOD images
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  // Only allow NASA domains for security
  const allowedDomains = [
    'apod.nasa.gov',
    'www.nasa.gov',
    'images.nasa.gov',
    'upload.wikimedia.org' // For fallback images
  ];

  try {
    const imageUrl = new URL(url);

    if (!allowedDomains.some(domain => imageUrl.hostname.includes(domain))) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    console.log('[IMAGE PROXY] Fetching:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'InfiniteArchitects/1.0 (https://michaeldariuseastwood.com)'
      }
    });

    if (!response.ok) {
      console.error('[IMAGE PROXY] Fetch failed:', response.status);
      return res.status(502).json({ error: 'Failed to fetch image' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24 hours
    res.setHeader('X-Proxied-From', imageUrl.hostname);

    return res.status(200).send(Buffer.from(buffer));

  } catch (error) {
    console.error('[IMAGE PROXY] Error:', error.message);
    return res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}
