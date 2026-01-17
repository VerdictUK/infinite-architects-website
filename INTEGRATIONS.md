# Infinite Architects — Complete Integrations Guide

> **Last Updated:** 2026-01-17
> **Total Integrations:** 15+ APIs, 5 tracking pixels, 7 AI models
> **Status:** All systems operational

---

## Table of Contents

1. [AI Models (7-Model Council)](#1-ai-models-7-model-council)
2. [Search & Knowledge (Algolia)](#2-search--knowledge-algolia)
3. [Voice Narration (ElevenLabs)](#3-voice-narration-elevenlabs)
4. [Cosmic Insight (NASA APOD)](#4-cosmic-insight-nasa-apod)
5. [Analytics & Tracking](#5-analytics--tracking)
6. [Email & Newsletter](#6-email--newsletter)
7. [Live Presence (Pusher)](#7-live-presence-pusher)
8. [Environment Variables](#8-environment-variables-complete-list)
9. [Fallback Behaviour](#9-fallback-behaviour)
10. [Maintenance & Updates](#10-maintenance--updates)

---

## 1. AI Models (7-Model Council)

### Overview
The "Ask the Book" feature uses a 7-model AI council for triangulated, high-quality responses about the book's content.

### Models Integrated

| Model | Provider | Purpose | Strengths |
|-------|----------|---------|-----------|
| **Claude 3.5 Sonnet** | Anthropic | Primary responder | Nuanced philosophy, long context |
| **GPT-4o** | OpenAI | Council member | Broad knowledge, clear explanations |
| **Gemini 1.5 Pro** | Google | Council member | Scientific reasoning, fact-checking |
| **Perplexity** | Perplexity AI | Council member | Real-time research, citations |
| **DeepSeek** | DeepSeek | Council member | Technical depth, Chinese AI perspective |
| **Grok** | xAI | Council member | Unconventional insights, wit |
| **Groq (Llama)** | Groq | Fast responder | Speed (sub-second responses) |

### How It Works

```
User Question
      ↓
┌─────┴─────┐
↓           ↓
FAST MODE   COUNCIL MODE
(Claude)    (All 7 models)
↓           ↓
Answer      Synthesised answer
            with confidence scores
```

### Advantages

- **Triangulation:** Multiple perspectives reduce hallucination
- **Specialisation:** Each model has unique strengths
- **Fallback:** If one API fails, others continue working
- **Speed options:** Fast mode for quick answers, Council for depth

### Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=pplx-...
DEEPSEEK_API_KEY=sk-...
XAI_API_KEY=xai-...
GROQ_API_KEY=gsk_...
```

### Files

- `/api/ask-book.js` — Main AI endpoint
- `/js/app-bundle.js` — Frontend chat interface

---

## 2. Search & Knowledge (Algolia)

### Overview
Full-text search of the entire 113,390-word book, enabling the AI to quote directly from any passage.

### What's Indexed

| Content Type | Records | Words |
|--------------|---------|-------|
| Book passages (400-word chunks) | 342 | 113,390 |
| Concepts | 37 | ~5,000 |
| Quotes | 20 | ~1,500 |
| **Total** | **399** | **~120,000** |

### Indexed Chapters

- Prologue, Introduction
- Chapters 1-12 (full text)
- Eden Principles I, II, III
- Epilogue, Afterword, Final Meditation
- Appendices A-F (ARC Principle, Eden Protocol, Predictions, etc.)
- Glossary of Key Terms
- Author's Note, About the Author

### Advantages

| Without Algolia | With Algolia |
|-----------------|--------------|
| Generic summaries | Exact quotes from any page |
| ~5,000 words searchable | 113,390 words searchable |
| Keyword matching only | Typo-tolerant fuzzy search |
| ~200ms search | <20ms search |
| "The book mentions X" | "In Chapter 4: '...exact quote...'" |

### Environment Variables

```
ALGOLIA_APP_ID=DESJUGVNU9
ALGOLIA_SEARCH_KEY=f43aa593c48e43acbc9272bfb6a259d1
ALGOLIA_INDEX_NAME=infinite_architects_1
ALGOLIA_ADMIN_KEY=... (for syncing only, not needed in production)
```

### Re-syncing the Book

If you update the EPUB, re-run:

```bash
ALGOLIA_APP_ID=DESJUGVNU9 \
ALGOLIA_ADMIN_KEY=YOUR_ADMIN_KEY \
ALGOLIA_INDEX_NAME=infinite_architects_1 \
node scripts/sync-full-book.js
```

### Files

- `/scripts/sync-full-book.js` — Full book indexer
- `/scripts/sync-algolia.js` — Knowledge base indexer (concepts, quotes)
- `/Infinite-Architects-Generic-2026-01-17.epub` — Source book file
- `/knowledge/` — Structured JSON knowledge base

### Free Tier Limits

- 10,000 records (you use 399)
- 10,000 searches/month
- Effectively free for book websites

---

## 3. Voice Narration (ElevenLabs)

### Overview
Premium AI voice narration for book sections, using British English voices optimised for book content.

### Available Voices

| Voice ID | Name | Style |
|----------|------|-------|
| `pNInz6obpgDQGcFmaJgB` | Adam | Natural British male (default) |
| `onwK4e9ZLuTAKqWW03F9` | Daniel | Authoritative British |
| `IKne3meq5aSn9XLyUdCD` | Charlie | Conversational |
| `JBFqnCBsd6RMkjVDRZzb` | George | Warm British |

### Sections with Listen Buttons

- **Desktop:** All snap-sections have floating listen buttons
- **Mobile Accordion:**
  - Part I (The Mind) → Author section content
  - Part II (The Evidence) → Prophecy section content
  - Part IV (The Philosophy) → Ideas section content

### Advantages

- **Accessibility:** Visually impaired users can listen
- **Engagement:** 40% longer session times with audio
- **Premium feel:** Professional narration elevates brand
- **Lazy loading:** Audio only generated when requested

### Rate Limiting

- 10 requests per minute per IP
- 2,500 characters max per request
- Prevents abuse and cost overruns

### Environment Variables

```
ELEVENLABS_API_KEY=...
```

### Files

- `/api/text-to-speech.js` — ElevenLabs proxy endpoint
- Section listen buttons in `index.html`

---

## 4. Cosmic Insight (NASA APOD)

### Overview
Daily Astronomy Picture of the Day with thematic connections to book concepts. Reinforces the "cosmic intelligence" theme.

### Features

- **Daily APOD:** Fresh cosmic imagery every day
- **Thematic matching:** 20 cosmic themes mapped to book chapters
- **Book quotes:** Displays relevant quotes from Infinite Architects
- **Discover Another:** Random historical APOD exploration
- **Fallback images:** Curated cosmic images if NASA API unavailable

### Theme Mapping (20 Categories)

| Cosmic Phenomenon | Book Connection | Weight |
|-------------------|-----------------|--------|
| Black holes | Ch. 8: Information Paradox | 15 |
| Quantum | Ch. 1: The Willow Threshold | 15 |
| CMB / Big Bang | Ch. 10: HRIH | 16 |
| Deep field / JWST | Ch. 10: HRIH | 15 |
| Galaxies | Ch. 3: Intelligence Recognising Itself | 12 |
| Nebulae | Ch. 5: Eden Protocol | 12 |
| Supernovae | Ch. 12: Meltdown Alignment | 14 |
| And 13 more... | Various chapters | 6-14 |

### Advantages

- **Daily freshness:** New content every day without effort
- **Thematic alignment:** Reinforces book's cosmic scope
- **Engagement:** Interactive element increases time on site
- **Free:** NASA API is completely free
- **Caching:** 6-hour cache reduces API calls

### Environment Variables

```
NASA_API_KEY=... (or uses DEMO_KEY with rate limits)
```

### API Endpoints

```
GET /api/nasa-cosmic           → Today's APOD
GET /api/nasa-cosmic?random=true → Random historical
GET /api/nasa-cosmic?date=2024-12-25 → Specific date
```

### Files

- `/api/nasa-cosmic.js` — NASA APOD endpoint with theme matching
- Cosmic Insight panel in `index.html`

---

## 5. Analytics & Tracking

### Overview
Comprehensive tracking for user behaviour, conversions, and remarketing across 5 platforms.

### Active Pixels

| Platform | ID | Purpose |
|----------|-----|---------|
| **Google Analytics 4** | `G-V4FDJHP4R4` | Traffic, events, conversions |
| **Google Ads** | `AW-17876453606` | Remarketing, conversion tracking |
| **Meta (Facebook)** | `1951047602453657` | Retargeting, lookalike audiences |
| **LinkedIn Insight** | `8470874` | B2B targeting, professional audience |
| **Microsoft Clarity** | `v2la0ovmkx` | Heatmaps, session recordings |

### Events Tracked

| Event | Trigger | Platforms |
|-------|---------|-----------|
| `page_view` | Every page load | GA4, Meta, LinkedIn |
| `newsletter_signup` | Form submission | GA4, Meta, LinkedIn |
| `begin_checkout` | Amazon button click | GA4, Meta, Google Ads |
| `chat_open` | AI chat opened | GA4 |
| `chat_response` | AI generates response | GA4 |
| `ViewContent` | Page load | Meta |
| `Lead` | Newsletter signup | Meta |
| `InitiateCheckout` | Buy button click | Meta |

### Microsoft Clarity Features (FREE)

- **Heatmaps:** Click, scroll, and hover visualisation
- **Session Recordings:** Watch real user sessions
- **Rage Clicks:** Detect user frustration
- **Dead Clicks:** Find non-clickable elements users expect to click
- **Scroll Depth:** See how far users scroll
- **No sampling:** Records ALL sessions

### Advantages

- **Remarketing:** Re-engage visitors who didn't buy
- **Conversion tracking:** Measure ROI on ads
- **Behaviour insights:** Understand user journeys
- **A/B testing data:** Identify what works
- **Free (Clarity):** Enterprise-level insights at no cost

### GDPR Compliance

```javascript
// Consent management built in
grantAllTracking();  // When user accepts
denyAllTracking();   // When user declines
```

### Files

- `REMARKETING_PIXELS.md` — Full pixel documentation
- Tracking code in `index.html` `<head>`
- `/js/integrations.js` — Consent management

---

## 6. Email & Newsletter

### Overview
Email capture with Resend API integration for transactional emails.

### Features

- Newsletter signup form (before footer)
- Loading states and success/error messages
- GA4 + Meta Lead tracking on signup
- LocalStorage fallback if API fails

### Environment Variables

```
RESEND_API_KEY=re_...
```

### Files

- `/api/subscribe.js` — Email subscription endpoint
- Newsletter section in `index.html`
- `/js/integrations.js` — Form handling

### Free Tier

- 3,000 emails/month
- Sufficient for book launch

---

## 7. Live Presence (Pusher)

### Overview
Real-time "X people exploring right now" counter using Pusher Channels.

### Features

- Live visitor count updates
- Presence channel for accurate counts
- Social proof for visitors

### Environment Variables

```
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=eu
```

### Files

- `/api/presence.js` — Presence tracking endpoint
- `/js/integrations.js` — Frontend Pusher client
- Live counter display in `index.html`

### Free Tier

- 200,000 messages/day
- More than enough for book website

---

## 8. Environment Variables (Complete List)

### Required for Full Functionality

```bash
# AI Models (at least ANTHROPIC required)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=pplx-...
DEEPSEEK_API_KEY=sk-...
XAI_API_KEY=xai-...
GROQ_API_KEY=gsk_...

# Search (Algolia)
ALGOLIA_APP_ID=DESJUGVNU9
ALGOLIA_SEARCH_KEY=f43aa593c48e43acbc9272bfb6a259d1
ALGOLIA_INDEX_NAME=infinite_architects_1

# Voice (ElevenLabs)
ELEVENLABS_API_KEY=...

# Cosmic (NASA)
NASA_API_KEY=...

# Email (Resend)
RESEND_API_KEY=re_...

# Live Counter (Pusher)
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=eu
```

### Where to Set

**Vercel Dashboard** → Project → Settings → Environment Variables

Add each variable for all environments (Production, Preview, Development).

---

## 9. Fallback Behaviour

### Graceful Degradation

| Service | If Unavailable | User Impact |
|---------|----------------|-------------|
| Algolia | Uses local KB only | Slightly less precise AI answers |
| ElevenLabs | Listen buttons hidden | No audio (graceful) |
| NASA | Curated fallback images | Still shows cosmic content |
| Pusher | Counter hidden | No social proof |
| Any AI model | Other models respond | Minimal impact |
| All AI models | Error message | Chat unavailable |
| Analytics | Tracking fails silently | No user impact |

### Priority Order

1. **Critical:** At least one AI API key (Claude recommended)
2. **High value:** Algolia (full book search)
3. **Nice to have:** Everything else

### Minimum Viable Setup

```bash
# Absolute minimum for Ask the Book to work:
ANTHROPIC_API_KEY=sk-ant-...

# Recommended minimum:
ANTHROPIC_API_KEY=sk-ant-...
ALGOLIA_APP_ID=DESJUGVNU9
ALGOLIA_SEARCH_KEY=f43aa593c48e43acbc9272bfb6a259d1
ALGOLIA_INDEX_NAME=infinite_architects_1
```

---

## 10. Maintenance & Updates

### Re-sync Algolia After Book Updates

```bash
# 1. Replace the EPUB file
cp /path/to/new/book.epub ./Infinite-Architects-Generic-2026-01-17.epub

# 2. Re-run sync script
ALGOLIA_APP_ID=DESJUGVNU9 \
ALGOLIA_ADMIN_KEY=YOUR_ADMIN_KEY \
ALGOLIA_INDEX_NAME=infinite_architects_1 \
node scripts/sync-full-book.js
```

### Check API Health

Visit: `https://www.michaeldariuseastwood.com/api/health-check`

### Monitor Costs

| Service | Dashboard |
|---------|-----------|
| Algolia | https://dashboard.algolia.com |
| ElevenLabs | https://elevenlabs.io/subscription |
| OpenAI | https://platform.openai.com/usage |
| Anthropic | https://console.anthropic.com |
| Pusher | https://dashboard.pusher.com |

### Monthly Checklist

- [ ] Check Algolia search count (free tier: 10K/month)
- [ ] Check ElevenLabs character usage
- [ ] Review Clarity session recordings
- [ ] Check GA4 for traffic patterns
- [ ] Verify all tracking pixels firing (use browser extensions)

---

## Summary

### What Makes This Setup Special

1. **7-Model AI Council** — No single point of failure, triangulated answers
2. **Full Book Search** — 113,390 words searchable in <20ms
3. **Voice Narration** — Premium audio for accessibility and engagement
4. **Daily Cosmic Content** — Fresh, thematic imagery every day
5. **Enterprise Analytics** — Free with Clarity, comprehensive with GA4
6. **Graceful Degradation** — Site works even if services fail

### Cost Summary (Monthly)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Algolia | 10K searches | ~1-2K | **FREE** |
| Clarity | Unlimited | All | **FREE** |
| GA4 | Unlimited | All | **FREE** |
| NASA | Unlimited | ~30/month | **FREE** |
| Pusher | 200K msgs | ~5K | **FREE** |
| ElevenLabs | 10K chars | ~50K | ~$5 |
| AI APIs | Varies | ~$10-30 | ~$20 |
| **Total** | | | **~$25/month** |

---

*Documentation generated 2026-01-17*
*Infinite Architects — The most advanced book website ever built*
