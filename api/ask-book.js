/**
 * ASK THE BOOK - Multi-Model AI Chat for Infinite Architects
 * Vercel Serverless Function
 *
 * Architecture: FastCouncil-inspired with pre-computed FAQ + 4-model triangulation
 * Models: Claude (primary), GPT-4o, Gemini, DeepSeek
 */

// Import knowledge base (these will be bundled by Vercel)
import concepts from '../knowledge/concepts.json' with { type: 'json' };
import chapters from '../knowledge/chapters.json' with { type: 'json' };
import quotes from '../knowledge/quotes.json' with { type: 'json' };
import faq from '../knowledge/faq.json' with { type: 'json' };
import evidence from '../knowledge/evidence.json' with { type: 'json' };

// Configuration - 4 Model Council
const CONFIG = {
  maxTokens: 1024,
  temperature: 0.3,
  models: {
    claude: { id: 'claude-sonnet-4-20250514', name: 'Claude', weight: 1.3 },
    gpt: { id: 'gpt-4o', name: 'GPT-4o', weight: 1.2 },
    gemini: { id: 'gemini-1.5-flash', name: 'Gemini', weight: 1.1 },
    deepseek: { id: 'deepseek-chat', name: 'DeepSeek', weight: 1.0 }
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
  if (!process.env.GOOGLE_API_KEY) {
    return { success: false, model: 'Gemini', error: 'API key not configured' };
  }

  const userMessage = context
    ? `${SYSTEM_PROMPT}\n\nContext from the book:\n${context}\n\nUser question: ${query}`
    : `${SYSTEM_PROMPT}\n\nUser question: ${query}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.models.gemini.id}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
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

/**
 * Call DeepSeek API
 */
async function callDeepSeek(query, context) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return { success: false, model: 'DeepSeek', error: 'API key not configured' };
  }

  const userMessage = context
    ? `Using the following context from the book:\n${context}\n\nUser question: ${query}`
    : query;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.models.deepseek.id,
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
        model: 'DeepSeek',
        weight: CONFIG.models.deepseek.weight,
        content: data.choices[0].message.content
      };
    }

    return { success: false, model: 'DeepSeek', error: data.error?.message || 'Invalid response' };
  } catch (error) {
    return { success: false, model: 'DeepSeek', error: error.message };
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
        modelCount: 1,
        responseTime: Date.now() - startTime
      });
    } else {
      // Full mode: All 4 models for triangulation
      const [claudeResult, gptResult, geminiResult, deepseekResult] = await Promise.all([
        callClaude(query, context),
        callGPT(query, context),
        callGemini(query, context),
        callDeepSeek(query, context)
      ]);

      const synthesis = synthesiseResponses(
        [claudeResult, gptResult, geminiResult, deepseekResult],
        kbResults
      );

      return res.status(200).json({
        success: true,
        type: 'ai-council',
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
