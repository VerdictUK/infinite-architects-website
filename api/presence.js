/**
 * LIVE PRESENCE - Pusher Integration for Infinite Architects
 * Vercel Serverless Function
 *
 * Tracks live visitors and broadcasts "X people reading now"
 * Free tier: 200K messages/day, 100 concurrent connections
 */

import Pusher from 'pusher';

// In-memory visitor tracking (resets on cold start, but that's fine for this use case)
const visitors = new Map();
const VISITOR_TIMEOUT = 60000; // 1 minute inactive = gone

// Clean up stale visitors
function cleanupVisitors() {
  const now = Date.now();
  for (const [id, data] of visitors.entries()) {
    if (now - data.lastSeen > VISITOR_TIMEOUT) {
      visitors.delete(id);
    }
  }
}

// Get Pusher instance
function getPusher() {
  if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY ||
      !process.env.PUSHER_SECRET || !process.env.PUSHER_CLUSTER) {
    return null;
  }

  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
  });
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  cleanupVisitors();

  const pusher = getPusher();

  if (req.method === 'GET') {
    // Return current visitor count (works even without Pusher)
    return res.status(200).json({
      success: true,
      count: visitors.size,
      pusherEnabled: !!pusher
    });
  }

  if (req.method === 'POST') {
    const { action, visitorId, page } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: 'visitorId required' });
    }

    const now = Date.now();

    switch (action) {
      case 'join':
        visitors.set(visitorId, {
          joinedAt: now,
          lastSeen: now,
          page: page || 'home'
        });
        break;

      case 'heartbeat':
        if (visitors.has(visitorId)) {
          visitors.get(visitorId).lastSeen = now;
          if (page) visitors.get(visitorId).page = page;
        } else {
          visitors.set(visitorId, {
            joinedAt: now,
            lastSeen: now,
            page: page || 'home'
          });
        }
        break;

      case 'leave':
        visitors.delete(visitorId);
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    const count = visitors.size;

    // Broadcast via Pusher if configured
    if (pusher) {
      try {
        await pusher.trigger('infinite-architects', 'presence-update', {
          count,
          timestamp: now
        });
      } catch (error) {
        console.error('[PRESENCE] Pusher error:', error);
      }
    }

    return res.status(200).json({
      success: true,
      count,
      pusherEnabled: !!pusher
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
