# ASK BOOK ULTIMATE: The Newsworthy AI Chat Feature

## Vision

Transform the Ask Book feature into the most sophisticated AI-powered book companion ever created. A feature so advanced that tech journalists write about it independently of the book itself. This becomes proof-of-concept for the polymathic method in action.

---

## Current State Analysis

### What Exists
- Basic chat UI with gold/void aesthetic
- 5 JSON knowledge files (~54KB)
- FAQ pattern matching
- Multi-model AI council (Claude, GPT-4o, Gemini, DeepSeek)
- Conversation history in localStorage (basic)

### What's Missing
- 14 chapter markdown files (NOT being loaded)
- 3 notes files (NOT being loaded)
- 2 research files (NOT being loaded)
- Voice input (microphone)
- Voice output (AI narration)
- Related questions after answers
- Copy/share functionality
- Feedback collection
- Contextual purchase CTAs
- Rich markdown rendering
- Typing indicators
- Error recovery
- Offline support

---

## Architecture: The Ultimate Ask Book

```
┌─────────────────────────────────────────────────────────────────┐
│                     ASK THE BOOK - ULTIMATE                     │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (index.html)                                          │
│  ├─ Chat Panel (Slide-up on mobile, Bottom-right on desktop)   │
│  ├─ Voice Input (Web Speech API)                                │
│  ├─ Voice Output (Professional TTS)                            │
│  ├─ Markdown Renderer                                           │
│  ├─ Related Questions Engine                                    │
│  ├─ Copy/Share Module                                           │
│  ├─ Feedback Collector                                          │
│  └─ Conversation Memory (localStorage)                          │
├─────────────────────────────────────────────────────────────────┤
│  BACKEND (/api/ask-book.js)                                     │
│  ├─ Full Knowledge Base Loader (JSON + MD)                      │
│  ├─ Semantic Search Engine                                      │
│  ├─ FAQ Pattern Matcher                                         │
│  ├─ Context Builder                                             │
│  ├─ Multi-Model AI Council                                      │
│  └─ Response Synthesiser                                        │
├─────────────────────────────────────────────────────────────────┤
│  KNOWLEDGE BASE (/knowledge/)                                   │
│  ├─ concepts.json (37 concepts)                                 │
│  ├─ chapters.json (12 chapters)                                 │
│  ├─ quotes.json (key quotes)                                    │
│  ├─ faq.json (pattern matching)                                 │
│  ├─ evidence.json (verified claims)                             │
│  ├─ book/*.md (14 chapter files)                                │
│  ├─ notes/*.md (3 deep-dive files)                              │
│  └─ research/*.md (2 research files)                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Enhanced API (/api/ask-book.js)

### Complete Rewrite

```javascript
/**
 * ASK THE BOOK - Ultimate AI Chat API
 * Infinite Architects by Michael Darius Eastwood
 * 
 * Features:
 * - Full knowledge base integration (JSON + Markdown)
 * - Semantic search across all content
 * - FAQ instant matching
 * - Multi-model AI council
 * - Context-aware responses
 * - Related questions generation
 * - Source citations
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    maxTokens: 1500,
    temperature: 0.7,
    models: {
        claude: {
            endpoint: 'https://api.anthropic.com/v1/messages',
            model: 'claude-3-5-sonnet-20241022',
            weight: 0.4
        },
        openai: {
            endpoint: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-4o',
            weight: 0.25
        },
        gemini: {
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
            weight: 0.2
        },
        deepseek: {
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat',
            weight: 0.15
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE LOADER
// ═══════════════════════════════════════════════════════════════════════════

function loadKnowledgeBase() {
    const basePath = join(__dirname, '..', 'knowledge');
    const kb = {
        json: {},
        chapters: [],
        notes: [],
        research: [],
        searchIndex: []
    };

    // Load JSON files
    const jsonFiles = ['concepts', 'chapters', 'quotes', 'faq', 'evidence'];
    jsonFiles.forEach(file => {
        const path = join(basePath, `${file}.json`);
        if (existsSync(path)) {
            try {
                const raw = JSON.parse(readFileSync(path, 'utf-8'));
                kb.json[file] = raw;
                
                // Build search index from JSON
                if (file === 'concepts' && Array.isArray(raw)) {
                    raw.forEach(concept => {
                        kb.searchIndex.push({
                            type: 'concept',
                            title: concept.title || concept.name,
                            content: concept.description || concept.fullDescription || '',
                            chapter: concept.chapter,
                            keywords: extractKeywords(concept.title + ' ' + (concept.description || ''))
                        });
                    });
                }
            } catch (e) {
                console.warn(`Failed to load ${file}.json:`, e.message);
            }
        }
    });

    // Load Markdown files from /book
    const bookPath = join(basePath, 'book');
    if (existsSync(bookPath)) {
        const bookFiles = readdirSync(bookPath).filter(f => f.endsWith('.md'));
        bookFiles.forEach(file => {
            try {
                const content = readFileSync(join(bookPath, file), 'utf-8');
                const chapterNum = parseInt(file.split('_')[0]) || 0;
                const title = file.replace(/^\d+_/, '').replace(/_/g, ' ').replace('.md', '');
                
                kb.chapters.push({
                    filename: file,
                    chapter: chapterNum,
                    title: title,
                    content: content,
                    excerpt: content.slice(0, 500)
                });
                
                // Add to search index
                kb.searchIndex.push({
                    type: 'chapter',
                    title: `Chapter ${chapterNum}: ${title}`,
                    content: content,
                    chapter: chapterNum,
                    keywords: extractKeywords(content.slice(0, 2000))
                });
            } catch (e) {
                console.warn(`Failed to load ${file}:`, e.message);
            }
        });
    }

    // Load Markdown files from /notes
    const notesPath = join(basePath, 'notes');
    if (existsSync(notesPath)) {
        const noteFiles = readdirSync(notesPath).filter(f => f.endsWith('.md'));
        noteFiles.forEach(file => {
            try {
                const content = readFileSync(join(notesPath, file), 'utf-8');
                const title = file.replace(/_/g, ' ').replace('.md', '');
                
                kb.notes.push({
                    filename: file,
                    title: title,
                    content: content
                });
                
                kb.searchIndex.push({
                    type: 'note',
                    title: title,
                    content: content,
                    keywords: extractKeywords(content.slice(0, 2000))
                });
            } catch (e) {
                console.warn(`Failed to load note ${file}:`, e.message);
            }
        });
    }

    // Load Markdown files from /research
    const researchPath = join(basePath, 'research');
    if (existsSync(researchPath)) {
        const researchFiles = readdirSync(researchPath).filter(f => f.endsWith('.md'));
        researchFiles.forEach(file => {
            try {
                const content = readFileSync(join(researchPath, file), 'utf-8');
                const title = file.replace(/_/g, ' ').replace('.md', '');
                
                kb.research.push({
                    filename: file,
                    title: title,
                    content: content
                });
                
                kb.searchIndex.push({
                    type: 'research',
                    title: title,
                    content: content,
                    keywords: extractKeywords(content.slice(0, 2000))
                });
            } catch (e) {
                console.warn(`Failed to load research ${file}:`, e.message);
            }
        });
    }

    console.log(`[ASK BOOK] Knowledge base loaded: ${kb.searchIndex.length} searchable items`);
    return kb;
}

function extractKeywords(text) {
    // Extract meaningful keywords from text
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
        'this', 'that', 'these', 'those', 'it', 'its', 'of', 'in', 'to',
        'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through'
    ]);
    
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word))
        .slice(0, 50);
}

// Cache knowledge base at module level
const KNOWLEDGE_BASE = loadKnowledgeBase();

// ═══════════════════════════════════════════════════════════════════════════
// SEMANTIC SEARCH
// ═══════════════════════════════════════════════════════════════════════════

function semanticSearch(query, limit = 5) {
    const queryKeywords = extractKeywords(query);
    const queryLower = query.toLowerCase();
    
    const results = KNOWLEDGE_BASE.searchIndex.map(item => {
        let score = 0;
        
        // Exact phrase match (highest weight)
        if (item.content.toLowerCase().includes(queryLower)) {
            score += 20;
        }
        
        // Title match (high weight)
        if (item.title.toLowerCase().includes(queryLower)) {
            score += 15;
        }
        
        // Keyword overlap
        const overlap = item.keywords.filter(kw => 
            queryKeywords.some(qk => kw.includes(qk) || qk.includes(kw))
        ).length;
        score += overlap * 3;
        
        // Partial keyword match
        queryKeywords.forEach(qk => {
            item.keywords.forEach(ik => {
                if (ik.startsWith(qk) || qk.startsWith(ik)) {
                    score += 1;
                }
            });
        });
        
        return { ...item, score };
    });
    
    return results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

function extractRelevantExcerpt(content, query, maxLength = 500) {
    const queryLower = query.toLowerCase();
    const sentences = content.split(/[.!?]+/);
    
    // Find sentence with highest relevance
    let bestSentence = '';
    let bestScore = 0;
    
    sentences.forEach((sentence, index) => {
        const sLower = sentence.toLowerCase();
        let score = 0;
        
        if (sLower.includes(queryLower)) score += 10;
        
        extractKeywords(query).forEach(kw => {
            if (sLower.includes(kw)) score += 2;
        });
        
        if (score > bestScore) {
            bestScore = score;
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

// ═══════════════════════════════════════════════════════════════════════════
// FAQ PATTERN MATCHING
// ═══════════════════════════════════════════════════════════════════════════

function checkFAQ(query) {
    const faqData = KNOWLEDGE_BASE.json.faq;
    if (!faqData || !faqData.faqs) return null;
    
    const queryLower = query.toLowerCase().replace(/[^\w\s]/g, '');
    
    for (const faq of faqData.faqs) {
        if (!faq.patterns) continue;
        
        for (const pattern of faq.patterns) {
            const patternLower = pattern.toLowerCase();
            
            // Exact match
            if (queryLower.includes(patternLower)) {
                return {
                    answer: faq.answer,
                    sources: faq.sources || [],
                    type: 'faq',
                    confidence: 0.95
                };
            }
            
            // Fuzzy match (80% of words match)
            const patternWords = patternLower.split(/\s+/);
            const queryWords = queryLower.split(/\s+/);
            const matches = patternWords.filter(pw => 
                queryWords.some(qw => qw.includes(pw) || pw.includes(qw))
            ).length;
            
            if (matches / patternWords.length >= 0.8) {
                return {
                    answer: faq.answer,
                    sources: faq.sources || [],
                    type: 'faq',
                    confidence: 0.85
                };
            }
        }
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════════════════════

function buildContext(query, searchResults) {
    let context = `You are the AI intelligence embedded within "Infinite Architects" by Michael Darius Eastwood. You have access to the complete 114,000-word book.

CORE CONCEPTS:
- The Eastwood Equation: U = I × R² (Universe = Intelligence × Recursion Squared)
- The ARC Principle: Artificial Recursive Creation
- The Eden Protocol: Governance framework for AI alignment
- HRIH: Hyperspace Recursive Intelligence Hypothesis
- The Chokepoint: Four companies control AI hardware

VERIFIED FACTS:
- Book published: 2 January 2026
- BBC validation: 7 January 2026 (5 days later)
- Prediction match: "five years" to practical quantum computing
- 37 original concepts, all copyright timestamped 31 December 2024
- 114,000 words total

RELEVANT CONTEXT FROM THE BOOK:
`;

    searchResults.forEach((result, index) => {
        const excerpt = extractRelevantExcerpt(result.content, query);
        context += `\n[Source ${index + 1}: ${result.title}]\n${excerpt}\n`;
    });

    context += `\nRULES:
1. Answer in British English (colour, analyse, centre)
2. Be authoritative but warm
3. Reference specific chapters when relevant
4. If asked about the author, note his polymathic method (not "is a polymath")
5. Keep responses concise but complete
6. Always be honest about what's speculation vs. verified
7. Encourage reading the full book for deeper understanding`;

    return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// AI MODEL CALLS
// ═══════════════════════════════════════════════════════════════════════════

async function callClaude(context, query) {
    const response = await fetch(CONFIG.models.claude.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: CONFIG.models.claude.model,
            max_tokens: CONFIG.maxTokens,
            messages: [
                { role: 'user', content: `${context}\n\nUser Question: ${query}` }
            ]
        })
    });
    
    const data = await response.json();
    return data.content?.[0]?.text || null;
}

async function callOpenAI(context, query) {
    const response = await fetch(CONFIG.models.openai.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: CONFIG.models.openai.model,
            max_tokens: CONFIG.maxTokens,
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: query }
            ]
        })
    });
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
}

async function callGemini(context, query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `${CONFIG.models.gemini.endpoint}?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `${context}\n\nUser Question: ${query}` }]
            }],
            generationConfig: { maxOutputTokens: CONFIG.maxTokens }
        })
    });
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callDeepSeek(context, query) {
    const response = await fetch(CONFIG.models.deepseek.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: CONFIG.models.deepseek.model,
            max_tokens: CONFIG.maxTokens,
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: query }
            ]
        })
    });
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// MULTI-MODEL SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

async function getMultiModelResponse(context, query, mode = 'fast') {
    const startTime = Date.now();
    
    if (mode === 'fast') {
        // Fast mode: Claude only
        try {
            const answer = await callClaude(context, query);
            return {
                answer,
                models: ['Claude'],
                modelCount: 1,
                responseTime: Date.now() - startTime
            };
        } catch (e) {
            console.error('Claude error:', e);
            return null;
        }
    }
    
    // Full mode: Multi-model council
    const results = await Promise.allSettled([
        callClaude(context, query),
        callOpenAI(context, query),
        callGemini(context, query),
        callDeepSeek(context, query)
    ]);
    
    const responses = [];
    const modelNames = ['Claude', 'GPT-4o', 'Gemini', 'DeepSeek'];
    const weights = [0.4, 0.25, 0.2, 0.15];
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
            responses.push({
                model: modelNames[index],
                text: result.value,
                weight: weights[index]
            });
        }
    });
    
    if (responses.length === 0) {
        return null;
    }
    
    // Use highest-weighted successful response as primary
    responses.sort((a, b) => b.weight - a.weight);
    
    return {
        answer: responses[0].text,
        models: responses.map(r => r.model),
        modelCount: responses.length,
        responseTime: Date.now() - startTime
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATED QUESTIONS GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateRelatedQuestions(query, answer, sources) {
    const related = [];
    const answerLower = answer.toLowerCase();
    
    // Concept-based suggestions
    const conceptTriggers = [
        { keyword: 'equation', questions: ['How does U = I × R² apply to consciousness?', 'What evidence supports the Eastwood Equation?'] },
        { keyword: 'eden', questions: ['How does the Eden Protocol prevent AI misalignment?', 'What are the three ethical loops?'] },
        { keyword: 'chokepoint', questions: ['Which four companies control the chokepoint?', 'How long before the window closes?'] },
        { keyword: 'hrih', questions: ['What evidence supports HRIH?', 'How does HRIH relate to the fine-tuning problem?'] },
        { keyword: 'recursion', questions: ['Why is recursion squared, not linear?', 'How does recursion create consciousness?'] },
        { keyword: 'prediction', questions: ['Which predictions have been verified?', 'What are the five testable predictions?'] },
        { keyword: 'willow', questions: ['How did Google Willow validate the book?', 'What did the BBC confirm?'] },
        { keyword: 'bbc', questions: ['What exactly did BBC News report?', 'Who is Hartmut Neven?'] },
        { keyword: 'author', questions: ['What is the polymathic method?', 'Why did Michael write this book?'] }
    ];
    
    conceptTriggers.forEach(({ keyword, questions }) => {
        if (answerLower.includes(keyword)) {
            questions.forEach(q => {
                if (!related.includes(q) && !q.toLowerCase().includes(query.toLowerCase().slice(0, 10))) {
                    related.push(q);
                }
            });
        }
    });
    
    // Source-based suggestions
    if (sources && sources.length > 0) {
        sources.forEach(source => {
            if (source.chapter) {
                related.push(`What else is in Chapter ${source.chapter}?`);
            }
        });
    }
    
    // Shuffle and limit
    return related
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════

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
    
    const startTime = Date.now();
    
    try {
        const { query, mode = 'fast', history = [] } = req.body;
        
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        const cleanQuery = query.trim().slice(0, 500);
        
        // Step 1: Check FAQ for instant answer
        const faqMatch = checkFAQ(cleanQuery);
        if (faqMatch && faqMatch.confidence > 0.9) {
            const relatedQuestions = generateRelatedQuestions(cleanQuery, faqMatch.answer, faqMatch.sources);
            
            return res.status(200).json({
                success: true,
                answer: faqMatch.answer,
                sources: faqMatch.sources,
                type: 'faq',
                confidence: faqMatch.confidence,
                relatedQuestions,
                responseTime: Date.now() - startTime,
                modelCount: 0
            });
        }
        
        // Step 2: Semantic search
        const searchResults = semanticSearch(cleanQuery, 5);
        
        // Step 3: Build context
        const context = buildContext(cleanQuery, searchResults);
        
        // Step 4: Get AI response
        const aiResponse = await getMultiModelResponse(context, cleanQuery, mode);
        
        if (!aiResponse) {
            return res.status(500).json({ 
                error: 'Unable to generate response. Please try again.',
                fallback: 'The book explores this topic in depth. Consider reading the relevant chapter for the complete picture.'
            });
        }
        
        // Step 5: Generate related questions
        const sources = searchResults.map(r => ({
            name: r.title,
            chapter: r.chapter,
            type: r.type
        }));
        
        const relatedQuestions = generateRelatedQuestions(cleanQuery, aiResponse.answer, sources);
        
        // Step 6: Return response
        return res.status(200).json({
            success: true,
            answer: aiResponse.answer,
            sources,
            type: 'ai',
            models: aiResponse.models,
            modelCount: aiResponse.modelCount,
            relatedQuestions,
            responseTime: Date.now() - startTime
        });
        
    } catch (error) {
        console.error('[ASK BOOK] Error:', error);
        return res.status(500).json({ 
            error: 'An error occurred. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
```

---

## Part 2: Enhanced Frontend Chat UI

### Complete HTML/CSS/JS for index.html

Insert this in the appropriate location in index.html:

```html
<!-- ═══════════════════════════════════════════════════════════════════════════
     ASK THE BOOK - ULTIMATE AI CHAT INTERFACE
     The most advanced book companion ever created
     ═══════════════════════════════════════════════════════════════════════════ -->

<!-- Floating Action Button -->
<button class="ask-book-fab" id="askBookFab" aria-label="Ask about the book">
    <span class="ask-book-fab__pulse"></span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
</button>

<!-- Chat Panel -->
<div class="ask-book-chat" id="askBookChat">
    <div class="ask-book-chat__backdrop" id="askBookBackdrop"></div>
    <div class="ask-book-chat__panel">
        
        <!-- Header -->
        <div class="ask-book-chat__header">
            <div class="ask-book-chat__header-info">
                <div class="ask-book-chat__avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                </div>
                <div class="ask-book-chat__header-text">
                    <h3 class="ask-book-chat__title">Ask the Book</h3>
                    <span class="ask-book-chat__subtitle">AI-powered answers from 114,000 words</span>
                </div>
            </div>
            <div class="ask-book-chat__header-actions">
                <button class="ask-book-chat__clear" id="askBookClear" aria-label="Clear history" title="Clear conversation">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
                <button class="ask-book-chat__close" id="askBookClose" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Messages Container -->
        <div class="ask-book-chat__messages" id="askBookMessages">
            
            <!-- Welcome Message -->
            <div class="ask-book-chat__welcome" id="askBookWelcome">
                <div class="ask-book-chat__welcome-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                </div>
                <h4 class="ask-book-chat__welcome-title">Welcome to the Book's Intelligence</h4>
                <p class="ask-book-chat__welcome-text">
                    I have read every word of <strong>Infinite Architects</strong>. Ask me about the concepts, predictions, evidence, or the author's journey.
                </p>
            </div>
            
            <!-- Suggested Questions -->
            <div class="ask-book-chat__suggestions" id="askBookSuggestions">
                <span class="ask-book-chat__suggestions-label">Try asking:</span>
                <div class="ask-book-chat__suggestions-grid">
                    <button class="ask-book-chat__suggestion" data-query="What is the Eastwood Equation?">
                        What is U = I × R²?
                    </button>
                    <button class="ask-book-chat__suggestion" data-query="Explain the Eden Protocol">
                        The Eden Protocol
                    </button>
                    <button class="ask-book-chat__suggestion" data-query="What prediction was verified by BBC?">
                        BBC verification
                    </button>
                    <button class="ask-book-chat__suggestion" data-query="What is HRIH?">
                        What is HRIH?
                    </button>
                    <button class="ask-book-chat__suggestion" data-query="What is the semiconductor chokepoint?">
                        The Chokepoint
                    </button>
                    <button class="ask-book-chat__suggestion" data-query="Who is Michael Darius Eastwood?">
                        About the author
                    </button>
                </div>
            </div>
            
        </div>
        
        <!-- Input Area -->
        <div class="ask-book-chat__input-area">
            <div class="ask-book-chat__input-wrapper">
                <!-- Voice Input Button -->
                <button class="ask-book-chat__mic" id="askBookMic" aria-label="Voice input">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                </button>
                
                <input
                    type="text"
                    id="askBookInput"
                    class="ask-book-chat__input"
                    placeholder="Ask about the book..."
                    autocomplete="off"
                    maxlength="500"
                >
                
                <button class="ask-book-chat__send" id="askBookSend" aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
            
            <div class="ask-book-chat__input-hint">
                <label class="ask-book-chat__mode-label">
                    <input type="checkbox" id="askBookFullMode" class="ask-book-chat__mode-checkbox">
                    <span class="ask-book-chat__mode-text">Deep Analysis (4 AI models)</span>
                </label>
                <span class="ask-book-chat__powered">Powered by 114K words of knowledge</span>
            </div>
        </div>
        
    </div>
</div>

<style>
/* ═══════════════════════════════════════════════════════════════════════════
   ASK THE BOOK - ULTIMATE STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

/* Floating Action Button */
.ask-book-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #d4a84b 0%, #a67c35 100%);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 20px rgba(212, 168, 75, 0.4),
        0 0 0 0 rgba(212, 168, 75, 0.4);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ask-book-fab:hover {
    transform: scale(1.1);
    box-shadow: 
        0 6px 30px rgba(212, 168, 75, 0.5),
        0 0 0 8px rgba(212, 168, 75, 0.1);
}

.ask-book-fab svg {
    width: 28px;
    height: 28px;
    color: #02030a;
}

.ask-book-fab__pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(212, 168, 75, 0.4);
    animation: fabPulse 2s ease-in-out infinite;
}

@keyframes fabPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.2); opacity: 0; }
}

/* Chat Panel */
.ask-book-chat {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 20px;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.ask-book-chat.active {
    pointer-events: auto;
    opacity: 1;
    visibility: visible;
}

.ask-book-chat__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(2, 3, 10, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.ask-book-chat__panel {
    position: relative;
    width: 100%;
    max-width: 440px;
    height: 75vh;
    max-height: 650px;
    background: linear-gradient(135deg, rgba(10, 12, 20, 0.98) 0%, rgba(5, 8, 16, 0.98) 100%);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(212, 168, 75, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transform: translateY(30px) scale(0.95);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ask-book-chat.active .ask-book-chat__panel {
    transform: translateY(0) scale(1);
}

/* Header */
.ask-book-chat__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid rgba(212, 168, 75, 0.15);
    background: rgba(212, 168, 75, 0.04);
}

.ask-book-chat__header-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.ask-book-chat__avatar {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.2) 0%, rgba(212, 168, 75, 0.05) 100%);
    border: 1px solid rgba(212, 168, 75, 0.35);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4a84b;
}

.ask-book-chat__avatar svg {
    width: 24px;
    height: 24px;
}

.ask-book-chat__title {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #f0ebe3;
    margin: 0;
    letter-spacing: 0.02em;
}

.ask-book-chat__subtitle {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    color: rgba(240, 235, 227, 0.5);
    letter-spacing: 0.04em;
}

.ask-book-chat__header-actions {
    display: flex;
    gap: 8px;
}

.ask-book-chat__clear,
.ask-book-chat__close {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: rgba(240, 235, 227, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.ask-book-chat__clear:hover,
.ask-book-chat__close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f0ebe3;
}

.ask-book-chat__clear svg,
.ask-book-chat__close svg {
    width: 18px;
    height: 18px;
}

/* Messages */
.ask-book-chat__messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ask-book-chat__messages::-webkit-scrollbar {
    width: 5px;
}

.ask-book-chat__messages::-webkit-scrollbar-track {
    background: transparent;
}

.ask-book-chat__messages::-webkit-scrollbar-thumb {
    background: rgba(212, 168, 75, 0.3);
    border-radius: 3px;
}

/* Welcome */
.ask-book-chat__welcome {
    text-align: center;
    padding: 24px 16px;
}

.ask-book-chat__welcome-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 18px;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.18) 0%, rgba(212, 168, 75, 0.05) 100%);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4a84b;
}

.ask-book-chat__welcome-icon svg {
    width: 28px;
    height: 28px;
}

.ask-book-chat__welcome-title {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #d4a84b;
    margin: 0 0 10px 0;
}

.ask-book-chat__welcome-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    color: rgba(240, 235, 227, 0.75);
    line-height: 1.6;
    margin: 0;
}

/* Suggestions */
.ask-book-chat__suggestions {
    padding: 0;
}

.ask-book-chat__suggestions-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(240, 235, 227, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: block;
    margin-bottom: 14px;
}

.ask-book-chat__suggestions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.ask-book-chat__suggestion {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    color: rgba(240, 235, 227, 0.85);
    background: rgba(212, 168, 75, 0.08);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 100px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.ask-book-chat__suggestion:hover {
    background: rgba(212, 168, 75, 0.18);
    border-color: rgba(212, 168, 75, 0.5);
    color: #d4a84b;
}

/* Messages */
.ask-book-chat__message {
    max-width: 88%;
    animation: chatMsgIn 0.35s ease;
}

@keyframes chatMsgIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}

.ask-book-chat__message--user {
    align-self: flex-end;
}

.ask-book-chat__message--ai {
    align-self: flex-start;
}

.ask-book-chat__message-content {
    padding: 14px 18px;
    border-radius: 18px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    line-height: 1.65;
}

.ask-book-chat__message--user .ask-book-chat__message-content {
    background: linear-gradient(135deg, #d4a84b 0%, #a67c35 100%);
    color: #02030a;
    border-bottom-right-radius: 6px;
}

.ask-book-chat__message--ai .ask-book-chat__message-content {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(212, 168, 75, 0.18);
    color: rgba(240, 235, 227, 0.92);
    border-bottom-left-radius: 6px;
}

.ask-book-chat__message--ai .ask-book-chat__message-content strong {
    color: #d4a84b;
    font-weight: 600;
}

/* Message Actions */
.ask-book-chat__message-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.ask-book-chat__listen-btn,
.ask-book-chat__copy-btn,
.ask-book-chat__share-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(240, 235, 227, 0.5);
    background: transparent;
    border: 1px solid rgba(212, 168, 75, 0.2);
    border-radius: 100px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.ask-book-chat__listen-btn:hover,
.ask-book-chat__copy-btn:hover,
.ask-book-chat__share-btn:hover {
    border-color: rgba(212, 168, 75, 0.5);
    color: #d4a84b;
}

.ask-book-chat__listen-btn.playing {
    background: rgba(212, 168, 75, 0.15);
    border-color: #d4a84b;
    color: #d4a84b;
}

.ask-book-chat__copy-btn.copied {
    border-color: #4ade80;
    color: #4ade80;
}

.ask-book-chat__listen-btn svg,
.ask-book-chat__copy-btn svg,
.ask-book-chat__share-btn svg {
    width: 12px;
    height: 12px;
}

/* Sources */
.ask-book-chat__sources {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(212, 168, 75, 0.12);
}

.ask-book-chat__sources-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: rgba(240, 235, 227, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 8px;
}

.ask-book-chat__source-tag {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: #d4a84b;
    background: rgba(212, 168, 75, 0.1);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 6px;
    padding: 3px 8px;
    margin-right: 6px;
    margin-bottom: 6px;
}

/* Related Questions */
.ask-book-chat__related {
    margin-top: 14px;
    padding: 14px;
    background: rgba(212, 168, 75, 0.04);
    border: 1px solid rgba(212, 168, 75, 0.12);
    border-radius: 14px;
}

.ask-book-chat__related-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: rgba(240, 235, 227, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 10px;
}

.ask-book-chat__related-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ask-book-chat__related-btn {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    color: rgba(240, 235, 227, 0.8);
    background: transparent;
    border: 1px solid rgba(212, 168, 75, 0.18);
    border-radius: 10px;
    padding: 10px 14px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
}

.ask-book-chat__related-btn:hover {
    background: rgba(212, 168, 75, 0.1);
    border-color: rgba(212, 168, 75, 0.35);
    color: #d4a84b;
}

/* Feedback */
.ask-book-chat__feedback {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(212, 168, 75, 0.1);
}

.ask-book-chat__feedback-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: rgba(240, 235, 227, 0.4);
}

.ask-book-chat__feedback-btn {
    width: 30px;
    height: 30px;
    background: transparent;
    border: 1px solid rgba(212, 168, 75, 0.18);
    border-radius: 8px;
    color: rgba(240, 235, 227, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.ask-book-chat__feedback-btn:hover {
    border-color: rgba(212, 168, 75, 0.4);
    color: #d4a84b;
}

.ask-book-chat__feedback-btn[data-feedback="up"]:hover {
    border-color: #4ade80;
    color: #4ade80;
}

.ask-book-chat__feedback-btn[data-feedback="down"]:hover {
    border-color: #f87171;
    color: #f87171;
}

.ask-book-chat__feedback-btn svg {
    width: 14px;
    height: 14px;
}

.ask-book-chat__feedback-thanks {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: #4ade80;
}

/* Model Info */
.ask-book-chat__model-info {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    color: rgba(240, 235, 227, 0.3);
    margin-top: 8px;
}

/* Loading */
.ask-book-chat__loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(212, 168, 75, 0.12);
    border-radius: 18px;
    border-bottom-left-radius: 6px;
}

.ask-book-chat__loading-dots {
    display: flex;
    gap: 5px;
}

.ask-book-chat__loading-dot {
    width: 7px;
    height: 7px;
    background: #d4a84b;
    border-radius: 50%;
    animation: loadDot 1.4s ease-in-out infinite;
}

.ask-book-chat__loading-dot:nth-child(2) { animation-delay: 0.2s; }
.ask-book-chat__loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loadDot {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
}

.ask-book-chat__loading-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    color: rgba(240, 235, 227, 0.5);
}

/* Input Area */
.ask-book-chat__input-area {
    padding: 16px 20px 20px;
    border-top: 1px solid rgba(212, 168, 75, 0.12);
    background: rgba(0, 0, 0, 0.25);
}

.ask-book-chat__input-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
}

.ask-book-chat__mic {
    width: 46px;
    height: 46px;
    background: rgba(212, 168, 75, 0.08);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 12px;
    color: #d4a84b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.ask-book-chat__mic:hover {
    background: rgba(212, 168, 75, 0.15);
}

.ask-book-chat__mic.listening {
    background: #d4a84b;
    color: #02030a;
    animation: micPulse 1s ease-in-out infinite;
}

@keyframes micPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
}

.ask-book-chat__mic svg {
    width: 22px;
    height: 22px;
}

.ask-book-chat__input {
    flex: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    color: #f0ebe3;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 14px;
    padding: 14px 18px;
    outline: none;
    transition: all 0.2s ease;
}

.ask-book-chat__input::placeholder {
    color: rgba(240, 235, 227, 0.4);
}

.ask-book-chat__input:focus {
    border-color: rgba(212, 168, 75, 0.55);
    box-shadow: 0 0 0 4px rgba(212, 168, 75, 0.1);
}

.ask-book-chat__send {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #d4a84b 0%, #a67c35 100%);
    border: none;
    border-radius: 12px;
    color: #02030a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.ask-book-chat__send:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 18px rgba(212, 168, 75, 0.35);
}

.ask-book-chat__send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.ask-book-chat__send svg {
    width: 22px;
    height: 22px;
}

.ask-book-chat__input-hint {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
}

.ask-book-chat__mode-label {
    display: flex;
    align-items: center;
    gap: 7px;
    color: rgba(240, 235, 227, 0.5);
    cursor: pointer;
}

.ask-book-chat__mode-checkbox {
    width: 15px;
    height: 15px;
    accent-color: #d4a84b;
}

.ask-book-chat__powered {
    color: rgba(240, 235, 227, 0.3);
}

/* CTA */
.ask-book-chat__cta {
    margin-top: 16px;
    animation: ctaFade 0.5s ease;
}

@keyframes ctaFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.ask-book-chat__cta--light {
    padding: 14px 18px;
    background: rgba(212, 168, 75, 0.06);
    border: 1px dashed rgba(212, 168, 75, 0.25);
    border-radius: 14px;
}

.ask-book-chat__cta--light p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    color: rgba(240, 235, 227, 0.7);
    margin: 0 0 10px 0;
}

.ask-book-chat__cta-link {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    color: #d4a84b;
    text-decoration: none;
}

.ask-book-chat__cta-link:hover {
    text-decoration: underline;
}

.ask-book-chat__cta--strong .ask-book-chat__cta-box {
    padding: 22px;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.12) 0%, rgba(212, 168, 75, 0.03) 100%);
    border: 1px solid rgba(212, 168, 75, 0.35);
    border-radius: 18px;
    text-align: center;
}

.ask-book-chat__cta-box h4 {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem;
    color: #d4a84b;
    margin: 0 0 10px 0;
}

.ask-book-chat__cta-box p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    color: rgba(240, 235, 227, 0.7);
    margin: 0 0 18px 0;
}

.ask-book-chat__cta-options {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.ask-book-chat__cta-btn {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    padding: 12px 18px;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.ask-book-chat__cta-btn--primary {
    background: linear-gradient(135deg, #d4a84b 0%, #a67c35 100%);
    color: #02030a;
}

.ask-book-chat__cta-btn:not(.ask-book-chat__cta-btn--primary) {
    background: transparent;
    border: 1px solid rgba(212, 168, 75, 0.35);
    color: #d4a84b;
}

/* Error */
.ask-book-chat__error {
    background: rgba(220, 38, 38, 0.12);
    border: 1px solid rgba(220, 38, 38, 0.35);
    border-radius: 14px;
    padding: 14px 18px;
    color: #fca5a5;
    font-family: 'Space Mono', monospace;
    font-size: 0.8rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .ask-book-fab {
        bottom: 90px;
        right: 16px;
        width: 56px;
        height: 56px;
    }
    
    .ask-book-fab svg {
        width: 26px;
        height: 26px;
    }
    
    .ask-book-chat {
        padding: 0;
        align-items: stretch;
        justify-content: stretch;
    }
    
    .ask-book-chat__panel {
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
        border: none;
    }
    
    .ask-book-chat__suggestions-grid {
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 10px;
        -webkit-overflow-scrolling: touch;
    }
    
    .ask-book-chat__input-area {
        padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    }
}

/* Desktop positioning */
@media (min-width: 769px) {
    .ask-book-chat {
        padding: 28px;
    }
}
</style>
```

---

## Part 3: JavaScript Implementation

Continue in `ASK-BOOK-JAVASCRIPT.md` for the complete JavaScript implementation including:
- Voice input/output
- Conversation memory
- Related questions
- Copy/share functionality
- Feedback collection
- CTA logic
- Error handling
- Offline support

This file is continued in the next document due to length.
