/**
 * INSTANT SEARCH - Algolia Integration for Infinite Architects
 * Vercel Serverless Function
 *
 * Provides instant search across book concepts, chapters, and quotes
 * Free tier: 10K searches/month, 10K records
 */

import algoliasearch from 'algoliasearch';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fallback local search if Algolia not configured
function localSearch(query, data) {
  const queryLower = query.toLowerCase();
  const results = [];

  // Search concepts
  if (data.concepts?.concepts) {
    for (const concept of data.concepts.concepts) {
      const score = calculateRelevance(concept, queryLower);
      if (score > 0) {
        results.push({
          type: 'concept',
          name: concept.name || concept.title,
          description: concept.fullDescription || concept.description,
          chapter: concept.chapter,
          score
        });
      }
    }
  }

  // Search chapters
  if (data.chapters?.chapters) {
    for (const chapter of data.chapters.chapters) {
      const score = calculateRelevance(chapter, queryLower);
      if (score > 0) {
        results.push({
          type: 'chapter',
          name: `Chapter ${chapter.number}: ${chapter.title}`,
          description: chapter.summary,
          chapter: chapter.number,
          score
        });
      }
    }
  }

  // Search quotes
  if (data.quotes?.quotes) {
    for (const quote of data.quotes.quotes) {
      if (quote.text?.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'quote',
          name: quote.text.slice(0, 80) + (quote.text.length > 80 ? '...' : ''),
          description: `Chapter ${quote.chapter}`,
          chapter: quote.chapter,
          score: 5
        });
      }
    }
  }

  // Sort by relevance and limit
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

function calculateRelevance(item, query) {
  let score = 0;
  const name = (item.name || item.title || '').toLowerCase();
  const desc = (item.fullDescription || item.description || item.summary || '').toLowerCase();
  const keywords = item.keywords || [];

  if (name.includes(query)) score += 10;
  if (name.startsWith(query)) score += 5;
  if (desc.includes(query)) score += 3;
  keywords.forEach(k => {
    if (k.toLowerCase().includes(query)) score += 2;
  });

  return score;
}

// Load knowledge base
function loadKnowledgeBase() {
  try {
    const knowledgePath = join(__dirname, '..', 'knowledge');
    return {
      concepts: JSON.parse(readFileSync(join(knowledgePath, 'concepts.json'), 'utf-8')),
      chapters: JSON.parse(readFileSync(join(knowledgePath, 'chapters.json'), 'utf-8')),
      quotes: JSON.parse(readFileSync(join(knowledgePath, 'quotes.json'), 'utf-8'))
    };
  } catch (error) {
    console.error('[SEARCH] Failed to load knowledge base:', error);
    return { concepts: { concepts: [] }, chapters: { chapters: [] }, quotes: { quotes: [] } };
  }
}

const knowledgeBase = loadKnowledgeBase();

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q: query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const startTime = Date.now();

  try {
    // Use Algolia if configured
    if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_SEARCH_KEY) {
      const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
      const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || 'infinite_architects');

      const { hits } = await index.search(query, {
        hitsPerPage: 10,
        attributesToRetrieve: ['name', 'description', 'type', 'chapter'],
        attributesToHighlight: ['name', 'description']
      });

      return res.status(200).json({
        success: true,
        source: 'algolia',
        results: hits.map(hit => ({
          type: hit.type,
          name: hit._highlightResult?.name?.value || hit.name,
          description: hit._highlightResult?.description?.value || hit.description,
          chapter: hit.chapter
        })),
        responseTime: Date.now() - startTime
      });
    }

    // Fallback to local search
    const results = localSearch(query, knowledgeBase);

    return res.status(200).json({
      success: true,
      source: 'local',
      results,
      responseTime: Date.now() - startTime
    });

  } catch (error) {
    console.error('[SEARCH] Error:', error);

    // Fallback to local search on Algolia error
    const results = localSearch(query, knowledgeBase);

    return res.status(200).json({
      success: true,
      source: 'local-fallback',
      results,
      responseTime: Date.now() - startTime
    });
  }
}
