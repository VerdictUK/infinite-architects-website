/**
 * ASK THE BOOK - Multi-Model AI Chat for Infinite Architects
 * Vercel Serverless Function
 *
 * Architecture: FastConvergence-inspired with pre-computed FAQ + 7-model convergence
 * Models: Claude (primary), GPT-4o, Gemini, Perplexity, DeepSeek, Grok, Groq
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { algoliasearch } from 'algoliasearch';

// Algolia client for enhanced search (if configured)
let algoliaClient = null;
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME || 'infinite_architects';

if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_SEARCH_KEY) {
  try {
    algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
    console.log('[ASK BOOK] Algolia search enabled');
  } catch (e) {
    console.warn('[ASK BOOK] Algolia init failed:', e.message);
  }
}

/**
 * Search Algolia for relevant context (if configured) - v5 API
 */
async function searchAlgolia(query) {
  if (!algoliaClient) return [];

  try {
    const { hits } = await algoliaClient.searchSingleIndex({
      indexName: algoliaIndexName,
      searchParams: {
        query,
        hitsPerPage: 8,
        attributesToRetrieve: ['name', 'description', 'chapter', 'type', 'keywords', 'text', 'title', 'part']
      }
    });
    return hits.map(hit => ({
      type: hit.type,
      name: hit.name || hit.title,
      description: hit.description || hit.text?.slice(0, 500),
      chapter: hit.chapter,
      part: hit.part,
      text: hit.text
    }));
  } catch (e) {
    console.warn('[ASK BOOK] Algolia search failed:', e.message);
    return [];
  }
}

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load knowledge base from JSON files AND markdown chapters
function loadKnowledgeBase() {
  const knowledgePath = join(__dirname, '..', 'knowledge');

  try {
    // Load raw data from JSON files
    const rawConcepts = JSON.parse(readFileSync(join(knowledgePath, 'concepts.json'), 'utf-8'));
    const rawChapters = JSON.parse(readFileSync(join(knowledgePath, 'chapters.json'), 'utf-8'));
    const rawQuotes = JSON.parse(readFileSync(join(knowledgePath, 'quotes.json'), 'utf-8'));
    const rawFaq = JSON.parse(readFileSync(join(knowledgePath, 'faq.json'), 'utf-8'));
    const rawEvidence = JSON.parse(readFileSync(join(knowledgePath, 'evidence.json'), 'utf-8'));

    // Load markdown chapter files (full book content)
    const bookContent = [];
    const bookPath = join(knowledgePath, 'book');
    if (existsSync(bookPath)) {
      const bookFiles = readdirSync(bookPath).filter(f => f.endsWith('.md')).sort();
      bookFiles.forEach(file => {
        try {
          const content = readFileSync(join(bookPath, file), 'utf-8');
          const chapterNum = parseInt(file.split('_')[0]) || 0;
          const title = file.replace(/^\d+_/, '').replace(/_/g, ' ').replace('.md', '');
          bookContent.push({
            chapter: chapterNum,
            title: title,
            content: content,
            excerpt: content.slice(0, 800)
          });
        } catch (e) {
          console.warn(`Failed to load book file ${file}:`, e.message);
        }
      });
      console.log(`[ASK BOOK] Loaded ${bookContent.length} chapter markdown files`);
    }

    // Load notes files
    const notesContent = [];
    const notesPath = join(knowledgePath, 'notes');
    if (existsSync(notesPath)) {
      const noteFiles = readdirSync(notesPath).filter(f => f.endsWith('.md'));
      noteFiles.forEach(file => {
        try {
          const content = readFileSync(join(notesPath, file), 'utf-8');
          notesContent.push({
            title: file.replace(/_/g, ' ').replace('.md', ''),
            content: content,
            excerpt: content.slice(0, 500)
          });
        } catch (e) {
          console.warn(`Failed to load note ${file}:`, e.message);
        }
      });
    }

    // Load research files
    const researchContent = [];
    const researchPath = join(knowledgePath, 'research');
    if (existsSync(researchPath)) {
      const researchFiles = readdirSync(researchPath).filter(f => f.endsWith('.md'));
      researchFiles.forEach(file => {
        try {
          const content = readFileSync(join(researchPath, file), 'utf-8');
          researchContent.push({
            title: file.replace(/_/g, ' ').replace('.md', ''),
            content: content,
            excerpt: content.slice(0, 500)
          });
        } catch (e) {
          console.warn(`Failed to load research ${file}:`, e.message);
        }
      });
    }

    // Normalize structures - handle both array and object formats
    return {
      concepts: {
        concepts: Array.isArray(rawConcepts) ? rawConcepts.map(c => ({
          name: c.title || c.name,
          fullDescription: c.description || c.fullDescription || '',
          chapter: c.chapter || null,
          epistemicStatus: c.epistemicStatus || 'NOVEL PROPOSAL',
          keywords: c.keywords || [c.title?.toLowerCase(), c.category?.toLowerCase()].filter(Boolean)
        })) : (rawConcepts.concepts || [])
      },
      chapters: {
        chapters: Array.isArray(rawChapters) ? rawChapters : (rawChapters.chapters || [])
      },
      quotes: {
        quotes: Array.isArray(rawQuotes) ? rawQuotes : (rawQuotes.quotes || [])
      },
      faq: rawFaq,  // Already has correct structure with 'faqs' array
      evidence: {
        verifiedClaims: rawEvidence.verifiedClaims || rawEvidence.claims || (Array.isArray(rawEvidence) ? rawEvidence : [])
      },
      // NEW: Full book content from markdown files
      bookContent: bookContent,
      notesContent: notesContent,
      researchContent: researchContent
    };
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return {
      concepts: { concepts: [] },
      chapters: { chapters: [] },
      quotes: { quotes: [] },
      faq: { faqs: [] },
      evidence: { verifiedClaims: [] },
      bookContent: [],
      notesContent: [],
      researchContent: []
    };
  }
}

// Load knowledge base at module level (cached across invocations)
const kb = loadKnowledgeBase();
const concepts = kb.concepts;
const chapters = kb.chapters;
const quotes = kb.quotes;
const faq = kb.faq;
const evidence = kb.evidence;

// Configuration - 4 Model Convergence (optimised for speed)
const CONFIG = {
  maxTokens: 1024,
  temperature: 0.3,
  timeout: 10000, // 10 second timeout per model
  models: {
    claude: { id: 'claude-sonnet-4-20250514', name: 'Claude', weight: 1.3 },
    gpt: { id: 'gpt-4o', name: 'GPT-4o', weight: 1.2 },
    gemini: { id: 'gemini-2.0-flash', name: 'Gemini', weight: 1.1 },
    groq: { id: 'llama-3.3-70b-versatile', name: 'Groq', weight: 1.0 }
  }
};

/**
 * Wrap a promise with a timeout
 */
function withTimeout(promise, ms, modelName) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${modelName} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]);
}

// System prompt for AI models
const SYSTEM_PROMPT = `You are an expert assistant for "Infinite Architects: Intelligence, Recursion, and the Creation of Everything" by Michael Darius Eastwood.

Your role is to:
1. Answer questions about the book's concepts, arguments, and evidence accurately
2. Distinguish between ESTABLISHED SCIENCE, EMERGING RESEARCH, NOVEL PROPOSALS, and SPECULATION
3. Cite specific chapters and concepts when relevant
4. Use British English spelling (colour, centre, analyse)
5. Be intellectually honest - acknowledge when the book presents speculation vs established fact
6. Encourage readers to explore the full book for deeper understanding

Key concepts to know:
- ARC Principle (U = I x R²): Universe = Intelligence x Recursion squared
- Eden Protocol: Framework for AI development through care rather than containment
- Chokepoint Mechanism: Four companies (TSMC, Samsung, ASML, Intel) control advanced AI chips
- HRIH: Hyperspace Recursive Intelligence Hypothesis (explicitly speculative)
- Caretaker Doping: Embedding empathy at hardware level (novel proposal)
- Meltdown Alignment: Designing AI to fail toward safety

Evidence standards:
- Google Willow quantum error correction: ESTABLISHED SCIENCE
- TSMC 90% market share, ASML 100% EUV monopoly: ESTABLISHED SCIENCE
- Alignment faking 78%: ESTABLISHED SCIENCE (Anthropic December 2024)
- AGI timelines 2026-2031: EMERGING RESEARCH (industry predictions)
- Eden Protocol, Caretaker Doping, HARI Treaty: NOVEL PROPOSALS (author's original concepts)

Keep responses concise (2-3 paragraphs max) and always encourage buying the book for the complete experience.`;

/**
 * Search FAQ for pre-computed answers
 */
function searchFAQ(query) {
  const queryLower = query.toLowerCase();

  for (const item of faq.faqs) {
    for (const pattern of item.patterns) {
      if (queryLower.includes(pattern)) {
        return {
          found: true,
          answer: item.answer,
          relatedConcepts: item.relatedConcepts,
          chapter: item.chapter,
          question: item.question
        };
      }
    }
  }

  return { found: false };
}

/**
 * Extract relevant excerpt from content based on query
 */
function extractRelevantExcerpt(content, query, maxLength = 600) {
  const queryLower = query.toLowerCase();
  const sentences = content.split(/[.!?]+/);

  // Find sentence with highest relevance
  let bestSentence = '';
  let bestScore = 0;
  let bestIndex = 0;

  sentences.forEach((sentence, index) => {
    const sLower = sentence.toLowerCase();
    let score = 0;

    if (sLower.includes(queryLower)) score += 10;

    // Check for query words
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    queryWords.forEach(word => {
      if (sLower.includes(word)) score += 2;
    });

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
      // Include surrounding sentences for context
      const start = Math.max(0, index - 1);
      const end = Math.min(sentences.length, index + 2);
      bestSentence = sentences.slice(start, end).join('. ').trim();
    }
  });

  if (bestSentence.length > maxLength) {
    return bestSentence.slice(0, maxLength) + '...';
  }

  return bestSentence || content.slice(0, maxLength);
}

/**
 * Search knowledge base for relevant context (including full book content)
 */
function searchKnowledgeBase(query) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
  const results = {
    concepts: [],
    chapters: [],
    quotes: [],
    evidence: [],
    bookExcerpts: []  // NEW: Relevant excerpts from full book
  };

  // Search concepts
  for (const concept of concepts.concepts) {
    const keywords = concept.keywords || [];
    const matchScore = keywords.filter(k => queryLower.includes(k)).length;

    if (matchScore > 0 || queryLower.includes(concept.name.toLowerCase())) {
      results.concepts.push({
        ...concept,
        matchScore: matchScore + (queryLower.includes(concept.name.toLowerCase()) ? 3 : 0)
      });
    }
  }

  results.concepts.sort((a, b) => b.matchScore - a.matchScore);
  results.concepts = results.concepts.slice(0, 3);

  // Search chapters (JSON summaries)
  for (const chapter of chapters.chapters) {
    const keyConcepts = chapter.keyConcepts || [];
    const matchScore = keyConcepts.filter(c => queryLower.includes(c.toLowerCase())).length;

    if (matchScore > 0 || queryLower.includes(chapter.title.toLowerCase())) {
      results.chapters.push(chapter);
    }
  }
  results.chapters = results.chapters.slice(0, 2);

  // Search quotes
  for (const quote of quotes.quotes) {
    const keywords = quote.keywords || [];
    if (keywords.some(k => queryLower.includes(k))) {
      results.quotes.push(quote);
    }
  }
  results.quotes = results.quotes.slice(0, 2);

  // Search evidence
  for (const claim of evidence.verifiedClaims) {
    if (queryLower.includes(claim.claim.toLowerCase().substring(0, 20))) {
      results.evidence.push(claim);
    }
  }
  results.evidence = results.evidence.slice(0, 3);

  // NEW: Search full book content for relevant excerpts
  for (const chapter of kb.bookContent) {
    const contentLower = chapter.content.toLowerCase();
    let score = 0;

    // Check for exact query match
    if (contentLower.includes(queryLower)) score += 10;

    // Check for query word matches
    queryWords.forEach(word => {
      if (contentLower.includes(word)) score += 2;
    });

    // Check title match
    if (chapter.title.toLowerCase().includes(queryLower)) score += 5;

    if (score > 3) {
      const excerpt = extractRelevantExcerpt(chapter.content, query);
      results.bookExcerpts.push({
        chapter: chapter.chapter,
        title: chapter.title,
        excerpt: excerpt,
        score: score
      });
    }
  }

  // Sort by relevance and limit
  results.bookExcerpts.sort((a, b) => b.score - a.score);
  results.bookExcerpts = results.bookExcerpts.slice(0, 2);

  // Also search notes and research if needed
  if (results.concepts.length === 0 && results.bookExcerpts.length === 0) {
    // Search notes for fallback context
    for (const note of kb.notesContent) {
      const contentLower = note.content.toLowerCase();
      if (queryWords.some(word => contentLower.includes(word))) {
        const excerpt = extractRelevantExcerpt(note.content, query, 400);
        results.bookExcerpts.push({
          chapter: 'Notes',
          title: note.title,
          excerpt: excerpt,
          score: 1
        });
        break;
      }
    }
  }

  return results;
}

/**
 * Build context from knowledge base results
 */
function buildContext(kbResults) {
  let context = '';

  if (kbResults.concepts.length > 0) {
    context += '\n\nRELEVANT CONCEPTS FROM THE BOOK:\n';
    for (const concept of kbResults.concepts) {
      context += `\n**${concept.name}** (Chapter ${concept.chapter})\n`;
      context += `Epistemic Status: ${concept.epistemicStatus}\n`;
      context += `${concept.fullDescription}\n`;
    }
  }

  if (kbResults.chapters.length > 0) {
    context += '\n\nRELEVANT CHAPTERS:\n';
    for (const chapter of kbResults.chapters) {
      context += `\n**Chapter ${chapter.number}: ${chapter.title}**\n`;
      context += `${chapter.summary}\n`;
    }
  }

  // NEW: Include relevant excerpts from full book content
  if (kbResults.bookExcerpts && kbResults.bookExcerpts.length > 0) {
    context += '\n\nDIRECT EXCERPTS FROM THE BOOK:\n';
    for (const excerpt of kbResults.bookExcerpts) {
      context += `\n**From Chapter ${excerpt.chapter}: ${excerpt.title}**\n`;
      context += `"${excerpt.excerpt}"\n`;
    }
  }

  if (kbResults.evidence.length > 0) {
    context += '\n\nVERIFIED EVIDENCE:\n';
    for (const claim of kbResults.evidence) {
      context += `\n- ${claim.claim} [${claim.status}]\n`;
      if (claim.details) context += `  ${claim.details}\n`;
    }
  }

  return context;
}

/**
 * Call Claude API (Anthropic)
 */
async function callClaude(query, context) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { success: false, model: 'Claude', error: 'API key not configured' };
  }

  const userMessage = context
    ? `Using the following context from the book:\n${context}\n\nUser question: ${query}`
    : query;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CONFIG.models.claude.id,
        max_tokens: CONFIG.maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return {
        success: true,
        model: 'Claude',
        weight: CONFIG.models.claude.weight,
        content: data.content[0].text
      };
    }

    return { success: false, model: 'Claude', error: data.error?.message || 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'Claude', error: error.message };
  }
}

/**
 * Call OpenAI API (GPT-4o)
 */
async function callGPT(query, context) {
  if (!process.env.OPENAI_API_KEY) {
    return { success: false, model: 'GPT-4o', error: 'API key not configured' };
  }

  const userMessage = context
    ? `Using the following context from the book:\n${context}\n\nUser question: ${query}`
    : query;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.models.gpt.id,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: CONFIG.maxTokens,
        temperature: CONFIG.temperature
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return {
        success: true,
        model: 'GPT-4o',
        weight: CONFIG.models.gpt.weight,
        content: data.choices[0].message.content
      };
    }

    return { success: false, model: 'GPT-4o', error: data.error?.message || 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'GPT-4o', error: error.message };
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(query, context) {
  // Support both GEMINI_API_KEY and GOOGLE_API_KEY for flexibility
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { success: false, model: 'Gemini', error: 'API key not configured' };
  }

  const userMessage = context
    ? `${SYSTEM_PROMPT}\n\nContext from the book:\n${context}\n\nUser question: ${query}`
    : `${SYSTEM_PROMPT}\n\nUser question: ${query}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.models.gemini.id}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: CONFIG.temperature,
            maxOutputTokens: CONFIG.maxTokens
          }
        })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return {
        success: true,
        model: 'Gemini',
        weight: CONFIG.models.gemini.weight,
        content: data.candidates[0].content.parts[0].text
      };
    }

    return { success: false, model: 'Gemini', error: data.error?.message || 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'Gemini', error: error.message };
  }
}

// Note: DeepSeek, Perplexity, and Grok removed to optimise council speed
// Council now uses 4 fast models: Claude, GPT-4o, Gemini, Groq

/**
 * Call Groq API (LPU inference)
 */
async function callGroq(query, context) {
  if (!process.env.GROQ_API_KEY) {
    return { success: false, model: 'Groq', error: 'API key not configured' };
  }

  const userMessage = context
    ? `Using the following context from the book:\n${context}\n\nUser question: ${query}`
    : query;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.models.groq.id,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: CONFIG.maxTokens,
        temperature: CONFIG.temperature
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return {
        success: true,
        model: 'Groq',
        weight: CONFIG.models.groq.weight,
        content: data.choices[0].message.content
      };
    }

    return { success: false, model: 'Groq', error: data.error?.message || 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'Groq', error: error.message };
  }
}

/**
 * Synthesise multiple AI responses using weighted voting
 */
function synthesiseResponses(responses, kbResults) {
  const successful = responses.filter(r => r.success);

  if (successful.length === 0) {
    return {
      answer: "I apologise, but I'm having difficulty answering your question right now. Please try again or explore the book directly for comprehensive insights.",
      sources: [],
      confidence: 'low',
      models: []
    };
  }

  // Calculate total weight of successful responses
  const totalWeight = successful.reduce((sum, r) => sum + (r.weight || 1), 0);

  // Use highest-weighted successful response as primary
  successful.sort((a, b) => (b.weight || 1) - (a.weight || 1));
  const primaryResponse = successful[0];

  // Determine confidence level
  let confidence = 'low';
  if (successful.length >= 3) confidence = 'high';
  else if (successful.length >= 2) confidence = 'medium';

  return {
    answer: primaryResponse.content,
    sources: kbResults.concepts.map(c => ({ name: c.name, chapter: c.chapter })),
    confidence,
    verified: successful.length > 1,
    models: successful.map(r => r.model),
    modelCount: successful.length,
    totalWeight: totalWeight.toFixed(1)
  };
}

/**
 * Main handler
 */
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

  const { query, mode = 'fast' } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const startTime = Date.now();

  try {
    // Step 1: Check pre-computed FAQ
    const faqResult = searchFAQ(query);

    if (faqResult.found) {
      return res.status(200).json({
        success: true,
        type: 'faq',
        answer: faqResult.answer,
        relatedConcepts: faqResult.relatedConcepts,
        chapter: faqResult.chapter,
        responseTime: Date.now() - startTime
      });
    }

    // Step 2: Search knowledge base for context (local + Algolia)
    const [kbResults, algoliaResults] = await Promise.all([
      Promise.resolve(searchKnowledgeBase(query)),
      searchAlgolia(query)
    ]);

    // Enhance context with Algolia results
    let context = buildContext(kbResults);
    if (algoliaResults.length > 0) {
      context += '\n\nRELEVANT BOOK PASSAGES (from full text search):\n';
      for (const hit of algoliaResults) {
        if (hit.type === 'book_passage' && hit.text) {
          // Full book passage - include more text
          context += `\n[${hit.name || hit.title}]:\n"${hit.text.slice(0, 600)}${hit.text.length > 600 ? '...' : ''}"\n`;
        } else {
          // Concept/quote - shorter format
          context += `- [${hit.type}] ${hit.name}`;
          if (hit.chapter) context += ` (Chapter ${hit.chapter})`;
          context += `: ${hit.description?.slice(0, 300) || ''}\n`;
        }
      }
    }

    // Step 3: Call AI model(s)
    if (mode === 'fast') {
      // Fast mode: Claude only with timeout
      try {
        const claudeResult = await withTimeout(
          callClaude(query, context),
          CONFIG.timeout,
          'Claude'
        );

        return res.status(200).json({
          success: claudeResult.success,
          type: 'ai',
          answer: claudeResult.content || 'Unable to generate response',
          sources: kbResults.concepts.map(c => ({ name: c.name, chapter: c.chapter })),
          model: 'Claude',
          modelCount: 1,
          responseTime: Date.now() - startTime
        });
      } catch (timeoutError) {
        // Claude timed out, return graceful error
        return res.status(200).json({
          success: false,
          type: 'ai',
          answer: 'The AI is taking longer than expected. Please try again.',
          model: 'Claude',
          modelCount: 0,
          responseTime: Date.now() - startTime
        });
      }
    } else {
      // Full mode: 4 models with timeouts (AI Convergence)
      // Using Promise.allSettled so slow models don't block fast ones
      const results = await Promise.allSettled([
        withTimeout(callClaude(query, context), CONFIG.timeout, 'Claude'),
        withTimeout(callGPT(query, context), CONFIG.timeout, 'GPT-4o'),
        withTimeout(callGemini(query, context), CONFIG.timeout, 'Gemini'),
        withTimeout(callGroq(query, context), CONFIG.timeout, 'Groq')
      ]);

      // Extract successful results
      const modelResults = results.map((result, index) => {
        const modelNames = ['Claude', 'GPT-4o', 'Gemini', 'Groq'];
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return { success: false, model: modelNames[index], error: result.reason?.message || 'Timed out' };
      });

      const synthesis = synthesiseResponses(modelResults, kbResults);

      return res.status(200).json({
        success: true,
        type: 'ai-convergence',
        ...synthesis,
        responseTime: Date.now() - startTime
      });
    }

  } catch (error) {
    console.error('Ask Book API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
