# Infinite Architects — API Reference

> **Base URL:** `https://www.michaeldariuseastwood.com`
> **All endpoints are Vercel Serverless Functions**

---

## Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ask-book` | POST | AI chat with 7-model council |
| `/api/nasa-cosmic` | GET | NASA Astronomy Picture of the Day |
| `/api/text-to-speech` | POST | ElevenLabs voice synthesis |
| `/api/subscribe` | POST | Newsletter signup |
| `/api/presence` | POST | Live visitor tracking |
| `/api/search` | GET | Instant search |
| `/api/health-check` | GET | Service status |

---

## 1. Ask the Book (`/api/ask-book`)

### Request

```http
POST /api/ask-book
Content-Type: application/json
```

```json
{
  "question": "What is the Eden Protocol?",
  "mode": "fast",
  "sessionId": "optional-session-id"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | string | Yes | User's question about the book |
| `mode` | string | No | `"fast"` (Claude only) or `"council"` (all 7 models) |
| `sessionId` | string | No | For conversation continuity |

### Response

```json
{
  "success": true,
  "answer": "The Eden Protocol is a comprehensive framework...",
  "sources": [
    { "type": "concept", "name": "Eden Protocol", "chapter": 5 },
    { "type": "book_passage", "title": "Chapter 5", "text": "..." }
  ],
  "model": "claude-3-5-sonnet",
  "mode": "fast",
  "confidence": 0.92
}
```

### Council Mode Response (Additional Fields)

```json
{
  "council": {
    "claude": { "answer": "...", "confidence": 0.95 },
    "gpt4": { "answer": "...", "confidence": 0.88 },
    "gemini": { "answer": "...", "confidence": 0.91 },
    "perplexity": { "answer": "...", "confidence": 0.85 },
    "deepseek": { "answer": "...", "confidence": 0.87 },
    "grok": { "answer": "...", "confidence": 0.83 },
    "groq": { "answer": "...", "confidence": 0.80 }
  },
  "synthesis": "Combined analysis from all models...",
  "consensus": 0.89
}
```

### Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid question |
| 429 | Rate limit exceeded |
| 500 | AI service error |
| 503 | No AI APIs configured |

---

## 2. NASA Cosmic Insight (`/api/nasa-cosmic`)

### Request

```http
GET /api/nasa-cosmic
GET /api/nasa-cosmic?random=true
GET /api/nasa-cosmic?date=2024-12-25
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `random` | boolean | No | Get random historical APOD |
| `date` | string | No | Specific date (YYYY-MM-DD) |

### Response

```json
{
  "date": "2026-01-17",
  "title": "The Carina Nebula",
  "explanation": "A detailed description from NASA...",
  "url": "https://apod.nasa.gov/image.jpg",
  "hdurl": "https://apod.nasa.gov/image_hd.jpg",
  "media_type": "image",
  "copyright": "NASA/ESA",

  "concept": "From cosmic chaos, order emerges...",
  "quote": "\"From cosmic clouds, stars are born...\"",
  "chapter": "Chapter 5: The Eden Protocol",
  "confidence": 0.72,
  "matchedKeywords": ["nebula", "carina", "stellar nursery"],

  "fallback": false
}
```

### Theme Matching

The API automatically matches cosmic imagery to book themes:

| If NASA shows... | Returns connection to... |
|------------------|--------------------------|
| Black hole | Ch. 8: Information Paradox |
| Galaxy | Ch. 3: Intelligence Recognising Itself |
| Nebula | Ch. 5: Eden Protocol |
| Quantum | Ch. 1: The Willow Threshold |
| Deep field | Ch. 10: HRIH |

### Caching

- Today's APOD: Cached 6 hours
- Random/date: Not cached
- Header `X-Cache: HIT` or `MISS`

---

## 3. Text-to-Speech (`/api/text-to-speech`)

### Request

```http
POST /api/text-to-speech
Content-Type: application/json
```

```json
{
  "text": "The cosmos is not out there. It is in here, observing itself through you.",
  "voice": "adam"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to convert (max 2,500 chars) |
| `voice` | string | No | Voice ID: `adam`, `daniel`, `charlie`, `george` |

### Response

- Content-Type: `audio/mpeg`
- Binary audio data (MP3)
- Cached for 24 hours

### Voice Options

| Voice | Style | Best For |
|-------|-------|----------|
| `adam` | Natural British male | Default, general use |
| `daniel` | Authoritative British | Formal passages |
| `charlie` | Conversational | Casual content |
| `george` | Warm British | Emotional passages |

### Rate Limits

- 10 requests per minute per IP
- 2,500 characters per request
- Returns 429 if exceeded

---

## 4. Newsletter Subscribe (`/api/subscribe`)

### Request

```http
POST /api/subscribe
Content-Type: application/json
```

```json
{
  "email": "reader@example.com",
  "source": "footer-form"
}
```

### Response

```json
{
  "success": true,
  "message": "Welcome to the Infinite Architects community!"
}
```

### Error Responses

```json
{
  "success": false,
  "error": "Invalid email address"
}
```

---

## 5. Live Presence (`/api/presence`)

### Request

```http
POST /api/presence
Content-Type: application/json
```

```json
{
  "action": "join",
  "visitorId": "unique-visitor-id"
}
```

### Actions

| Action | Description |
|--------|-------------|
| `join` | Visitor arrived |
| `leave` | Visitor left |
| `heartbeat` | Keep connection alive |

### Response

```json
{
  "success": true,
  "count": 42,
  "channel": "infinite-architects-presence"
}
```

---

## 6. Instant Search (`/api/search`)

### Request

```http
GET /api/search?q=eden%20protocol
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `limit` | number | No | Max results (default: 10) |
| `type` | string | No | Filter: `concept`, `quote`, `chapter` |

### Response

```json
{
  "results": [
    {
      "type": "concept",
      "name": "The Eden Protocol",
      "description": "A governance framework for AI...",
      "chapter": 5,
      "score": 0.95
    }
  ],
  "total": 3,
  "query": "eden protocol",
  "source": "algolia"
}
```

### Fallback

If Algolia unavailable, searches local JSON knowledge base.

---

## 7. Health Check (`/api/health-check`)

### Request

```http
GET /api/health-check
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T12:00:00Z",
  "services": {
    "anthropic": "configured",
    "openai": "configured",
    "google": "configured",
    "perplexity": "configured",
    "deepseek": "configured",
    "xai": "configured",
    "groq": "configured",
    "algolia": "configured",
    "elevenlabs": "configured",
    "nasa": "configured",
    "pusher": "configured",
    "resend": "configured"
  },
  "knowledgeBase": {
    "concepts": 37,
    "chapters": 12,
    "quotes": 20,
    "faqs": 16
  }
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/ask-book` | 20 requests | per minute |
| `/api/text-to-speech` | 10 requests | per minute |
| `/api/subscribe` | 5 requests | per minute |
| `/api/nasa-cosmic` | 30 requests | per minute |
| `/api/search` | 60 requests | per minute |

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Please wait before making another request",
  "retryAfter": 60
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error type",
  "message": "Human-readable description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `INVALID_REQUEST` | 400 | Missing or malformed parameters |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVICE_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | External API unavailable |

---

## CORS

All endpoints allow cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Caching

| Endpoint | Cache Duration | Cache-Control |
|----------|----------------|---------------|
| `/api/nasa-cosmic` | 6 hours | `public, max-age=21600` |
| `/api/text-to-speech` | 24 hours | `public, max-age=86400` |
| `/api/search` | 5 minutes | `public, max-age=300` |
| Others | No cache | `no-cache` |

---

*API Reference v1.0 — 2026-01-17*
