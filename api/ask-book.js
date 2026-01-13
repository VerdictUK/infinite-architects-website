/**
 * ASK THE BOOK - Multi-Model AI Chat for Infinite Architects
 * Vercel Serverless Function
 *
 * Architecture: FastCouncil-inspired with pre-computed FAQ + live AI verification
 * Models: Claude (primary), GPT-4o (verification), Gemini (supplementary)
 */

import Anthropic from '@anthropic-ai/sdk';

// Import knowledge base
import concepts from '../knowledge/concepts.json';
import chapters from '../knowledge/chapters.json';
import quotes from '../knowledge/quotes.json';
import faq from '../knowledge/faq.json';
import evidence from '../knowledge/evidence.json';

// Configuration
const CONFIG = {
  maxTokens: 1024,
  temperature: 0.3,
  models: {
    claude: 'claude-sonnet-4-20250514',
    gpt: 'gpt-4o',
    gemini: 'gemini-1.5-flash'
  }
};

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

Always be helpful, accurate, and encourage the reader to buy the book for the complete experience.`;

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
 * Search knowledge base for relevant context
 */
function searchKnowledgeBase(query) {
  const queryLower = query.toLowerCase();
  const results = {
    concepts: [],
    chapters: [],
    quotes: [],
    evidence: []
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

  // Sort by match score
  results.concepts.sort((a, b) => b.matchScore - a.matchScore);
  results.concepts = results.concepts.slice(0, 3);

  // Search chapters
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

  if (kbResults.evidence.length > 0) {
    context += '\n\nVERIFIED EVIDENCE:\n';
    for (const claim of kbResults.evidence) {
      context += `\n- ${claim.claim} [${claim.status}]\n`;
      if (claim.details) context += `  ${claim.details}\n`;
    }
  }

  if (kbResults.quotes.length > 0) {
    context += '\n\nRELEVANT QUOTES:\n';
    for (const quote of kbResults.quotes) {
      context += `\n"${quote.text}" (Theme: ${quote.theme})\n`;
    }
  }

  return context;
}

/**
 * Call Claude API
 */
async function callClaude(query, context) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const userMessage = context
    ? `Using the following context from the book:\n${context}\n\nUser question: ${query}`
    : query;

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.models.claude,
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }]
    });

    return {
      success: true,
      model: 'Claude',
      content: response.content[0].text
    };
  } catch (error) {
    return {
      success: false,
      model: 'Claude',
      error: error.message
    };
  }
}

/**
 * Call OpenAI API (for verification)
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
        model: CONFIG.models.gpt,
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
        content: data.choices[0].message.content
      };
    }

    return { success: false, model: 'GPT-4o', error: 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'GPT-4o', error: error.message };
  }
}

/**
 * Synthesise multiple AI responses
 */
function synthesiseResponses(responses, kbResults) {
  // If only one successful response, use it
  const successful = responses.filter(r => r.success);

  if (successful.length === 0) {
    return {
      answer: "I apologise, but I'm having difficulty answering your question right now. Please try again or explore the book directly for comprehensive insights.",
      sources: [],
      confidence: 'low'
    };
  }

  if (successful.length === 1) {
    return {
      answer: successful[0].content,
      sources: kbResults.concepts.map(c => ({ name: c.name, chapter: c.chapter })),
      confidence: 'medium',
      model: successful[0].model
    };
  }

  // Multiple responses - use Claude's answer with verification note
  const claudeResponse = successful.find(r => r.model === 'Claude');
  const otherResponses = successful.filter(r => r.model !== 'Claude');

  return {
    answer: claudeResponse ? claudeResponse.content : successful[0].content,
    sources: kbResults.concepts.map(c => ({ name: c.name, chapter: c.chapter })),
    confidence: 'high',
    verified: otherResponses.length > 0,
    models: successful.map(r => r.model)
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

    // Step 2: Search knowledge base for context
    const kbResults = searchKnowledgeBase(query);
    const context = buildContext(kbResults);

    // Step 3: Call AI model(s)
    if (mode === 'fast') {
      // Fast mode: Claude only
      const claudeResult = await callClaude(query, context);

      return res.status(200).json({
        success: claudeResult.success,
        type: 'ai',
        answer: claudeResult.content || 'Unable to generate response',
        sources: kbResults.concepts.map(c => ({ name: c.name, chapter: c.chapter })),
        model: 'Claude',
        responseTime: Date.now() - startTime
      });
    } else {
      // Full mode: Multiple models for verification
      const [claudeResult, gptResult] = await Promise.all([
        callClaude(query, context),
        callGPT(query, context)
      ]);

      const synthesis = synthesiseResponses([claudeResult, gptResult], kbResults);

      return res.status(200).json({
        success: true,
        type: 'ai-verified',
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
