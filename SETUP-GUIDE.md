# Infinite Architects — Quick Setup Guide

> **For:** Setting up the website from scratch or adding missing integrations
> **Time:** 15-30 minutes for full setup

---

## Prerequisites

- Node.js 18+
- npm
- Git
- Vercel account (free)

---

## 1. Clone & Install

```bash
git clone https://github.com/VerdictUK/infinite-architects-website.git
cd infinite-architects-website
npm install
```

---

## 2. Get API Keys

### Required (Pick at least one AI)

| Service | Get Key From | Free Tier |
|---------|--------------|-----------|
| **Anthropic (Claude)** | https://console.anthropic.com | $5 credit |
| OpenAI (GPT-4) | https://platform.openai.com | Pay-as-you-go |
| Google (Gemini) | https://makersuite.google.com | Free |

### Recommended

| Service | Get Key From | Free Tier |
|---------|--------------|-----------|
| **Algolia** | https://dashboard.algolia.com | 10K searches/month |
| **ElevenLabs** | https://elevenlabs.io | 10K chars/month |
| **NASA** | https://api.nasa.gov | Unlimited |

### Optional Enhancements

| Service | Get Key From | Free Tier |
|---------|--------------|-----------|
| Perplexity | https://perplexity.ai | Limited |
| DeepSeek | https://deepseek.com | Pay-as-you-go |
| xAI (Grok) | https://x.ai | Limited |
| Groq | https://groq.com | Free tier |
| Pusher | https://pusher.com | 200K msgs/day |
| Resend | https://resend.com | 3K emails/month |

---

## 3. Algolia Setup (Full Book Search)

### 3.1 Create Account & Application

1. Go to https://dashboard.algolia.com
2. Create account (free)
3. Create Application: "Infinite Architects"
4. Region: EU (Frankfurt) for UK

### 3.2 Get Your Keys

Settings → API Keys:
- **Application ID:** `DESJUGVNU9` (yours will differ)
- **Search API Key:** `f43aa593...`
- **Admin API Key:** `26002140...` (keep secret!)

### 3.3 Sync the Full Book

```bash
ALGOLIA_APP_ID=YOUR_APP_ID \
ALGOLIA_ADMIN_KEY=YOUR_ADMIN_KEY \
ALGOLIA_INDEX_NAME=infinite_architects_1 \
node scripts/sync-full-book.js
```

Expected output:
```
📚 Extracting EPUB...
📖 Processing 42 content files...
  ✓ Chapter 1: The Seeds of Creation: 6512 words → 19 chunks
  ...
📊 Total: 113,390 words → 342 searchable chunks
✅ SUCCESS! Indexed 399 records to Algolia.
```

---

## 4. Add Environment Variables to Vercel

### 4.1 Go to Vercel Dashboard

Project → Settings → Environment Variables

### 4.2 Add These Variables

```bash
# AI Models (at least ANTHROPIC required)
ANTHROPIC_API_KEY=sk-ant-...

# Optional AI models for council mode
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=pplx-...
DEEPSEEK_API_KEY=sk-...
XAI_API_KEY=xai-...
GROQ_API_KEY=gsk_...

# Search (highly recommended)
ALGOLIA_APP_ID=DESJUGVNU9
ALGOLIA_SEARCH_KEY=f43aa593c48e43acbc9272bfb6a259d1
ALGOLIA_INDEX_NAME=infinite_architects_1

# Voice narration
ELEVENLABS_API_KEY=...

# Cosmic insight
NASA_API_KEY=...

# Email
RESEND_API_KEY=re_...

# Live counter
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=eu
```

### 4.3 For Each Variable

1. Click "Add New"
2. Enter name exactly as shown
3. Paste value
4. Select: Production, Preview, Development (all three)
5. Click Save

---

## 5. Deploy

```bash
npx vercel --prod
```

---

## 6. Verify Setup

### Check Health Endpoint

```bash
curl https://your-domain.com/api/health-check
```

Should show which services are configured.

### Test Ask the Book

1. Go to your website
2. Click "Ask the Book" button
3. Ask: "What is the Eden Protocol?"
4. Should get AI response with book quotes

### Test Cosmic Insight

1. Click the 🌌 button (bottom left)
2. Should show NASA APOD with book connection
3. Click "Discover Another" for random historical image

---

## 7. Tracking Pixels (Already Configured)

These are already in `index.html`:

| Pixel | ID | Dashboard |
|-------|-----|-----------|
| Google Analytics 4 | `G-V4FDJHP4R4` | analytics.google.com |
| Google Ads | `AW-17876453606` | ads.google.com |
| Meta/Facebook | `1951047602453657` | business.facebook.com |
| LinkedIn | `8470874` | linkedin.com/campaignmanager |
| Microsoft Clarity | `v2la0ovmkx` | clarity.microsoft.com |

No action needed — just verify they're firing using browser extensions.

---

## Troubleshooting

### "Ask the Book" not working

1. Check at least one AI API key is set
2. Verify in Vercel environment variables
3. Redeploy: `npx vercel --prod`

### Algolia search not working

1. Verify ALGOLIA_APP_ID and ALGOLIA_SEARCH_KEY are set
2. Check index exists in Algolia dashboard
3. Run sync script if index is empty

### Voice not working

1. Verify ELEVENLABS_API_KEY is set
2. Check ElevenLabs account has credits
3. Listen buttons should be visible on sections

### NASA cosmic not loading

1. Falls back to curated images automatically
2. If you want live APOD, add NASA_API_KEY
3. Works without key using DEMO_KEY (rate limited)

---

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Link to project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run locally
vercel dev
```

---

## Updating the Book

If you publish a new version:

1. Replace the EPUB file:
   ```bash
   cp /path/to/new-book.epub ./Infinite-Architects-Generic-2026-01-17.epub
   ```

2. Re-sync to Algolia:
   ```bash
   ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx node scripts/sync-full-book.js
   ```

3. Deploy:
   ```bash
   npx vercel --prod
   ```

---

## Support

- **Issues:** https://github.com/VerdictUK/infinite-architects-website/issues
- **Email:** michael@michaeldariuseastwood.com

---

*Setup Guide v1.0 — 2026-01-17*
