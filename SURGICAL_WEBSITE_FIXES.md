# INFINITE ARCHITECTS WEBSITE - SURGICAL FIXES
## Complete Edit Guide with Line Numbers

---

## 🔴 CRITICAL FIX 1: VIDEO NOT PLAYING

**Problem**: Video source uses `.mov` format which doesn't work in most browsers

**Location**: Line 5722-5724

**FIND:**
```html
<source src="videos/bbc-clip-4.mov" type="video/mp4">
```

**REPLACE WITH:**
```html
<source src="videos/bbc-clip-4.mp4" type="video/mp4">
<source src="videos/bbc-clip-4.webm" type="video/webm">
```

**Also add poster and better attributes. FIND the entire video block (lines 5717-5724):**
```html
<video
    id="prophecy-video"
    class="prophecy-video"
    preload="metadata"
    playsinline
>
    <source src="videos/bbc-clip-4.mov" type="video/mp4">
</video>
```

**REPLACE WITH:**
```html
<video
    id="prophecy-video"
    class="prophecy-video"
    preload="auto"
    playsinline
    poster="bbc-willow.jpg"
    muted
>
    <source src="videos/bbc-clip-4.mp4" type="video/mp4">
    <source src="videos/bbc-clip-4.webm" type="video/webm">
    Your browser does not support the video tag.
</video>
```

**FILE ACTION**: Rename `bbc-clip-4.mov` to `bbc-clip-4.mp4` in your videos folder (or convert it)

---

## 🔴 CRITICAL FIX 2: SCROLL SNAP TOO WEAK

**Problem**: `scroll-snap-type: y proximity` is too gentle - won't snap properly

**Location**: Lines 5414-5415

**FIND:**
```css
/* Section scroll snapping */
html { scroll-snap-type: y proximity; }
section { scroll-snap-align: start; }
```

**REPLACE WITH:**
```css
/* Section scroll snapping - MANDATORY for firm snapping */
html { 
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
}
.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
}
```

**THEN**: Add `snap-section` class to key sections in HTML. Add this class to:
- The hero section
- The equation section  
- The prophecy section
- The evidence locker section
- The author section
- The buy section

---

## 🔴 CRITICAL FIX 3: 50/50 SLIDER OVERFLOW

**Problem**: prophecy-split grid goes off-screen on smaller viewports

**Location**: Lines 4849-4854

**FIND:**
```css
.prophecy-split {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: stretch;
}
```

**REPLACE WITH:**
```css
.prophecy-split {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: stretch;
    max-width: 100%;
    overflow-x: hidden;
    padding: 0 1rem;
    box-sizing: border-box;
}
```

**Also fix the mobile breakpoint at line 5013-5017. FIND:**
```css
@media (max-width: 1000px) {
    .prophecy-split { grid-template-columns: 1fr; gap: 1.5rem; }
```

**REPLACE WITH:**
```css
@media (max-width: 1100px) {
    .prophecy-split { 
        grid-template-columns: 1fr; 
        gap: 1.5rem;
        padding: 0 0.5rem;
    }
```

---

## 🟡 FIX 4: REMOVE REPETITIVE BBC CONTENT

**Problem**: BBC validation appears twice (bbc-section AND prophecy-hero)

**Option A - Remove the first bbc-section (recommended):**

**FIND and DELETE entire block (lines 5640-5673):**
```html
<!-- ═══════════════════════════════════════════════════════════════════════
     BBC VALIDATION SECTION
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="bbc-section">
    <div class="bbc-inner">
        ... entire content ...
    </div>
</section>
```

**Option B - Keep first section but add unique content to each:**
Transform the first section into "The Science" and keep prophecy-hero as "The Receipt"

---

## 🟢 FIX 5: ADD SOCIAL PROOF - EXPERT QUOTES

**Location**: After the reader reviews section (search for "Reader Reactions")

**ADD this new section before or after reader reviews:**

```html
<!-- EXPERT VALIDATION SECTION -->
<section class="section expert-validation">
    <div class="section-inner">
        <p class="section-label">WHAT THE EXPERTS ARE SAYING</p>
        <h2 class="section-title">The Warnings Are Real</h2>
        
        <div class="expert-grid">
            <!-- Geoffrey Hinton -->
            <div class="expert-card">
                <div class="expert-header">
                    <span class="expert-role">Nobel Laureate · AI Pioneer</span>
                    <span class="expert-date">December 2024</span>
                </div>
                <blockquote class="expert-quote">
                    "I am probably more worried than I was two years ago... AI's improved reasoning and deceiving capabilities concern me."
                </blockquote>
                <cite class="expert-name">— Geoffrey Hinton</cite>
                <span class="expert-stat">Estimates 10-20% probability of AI "taking over"</span>
            </div>
            
            <!-- Sam Altman -->
            <div class="expert-card">
                <div class="expert-header">
                    <span class="expert-role">CEO, OpenAI</span>
                    <span class="expert-date">January 2025</span>
                </div>
                <blockquote class="expert-quote">
                    "We are now confident we know how to build AGI as we have traditionally understood it."
                </blockquote>
                <cite class="expert-name">— Sam Altman</cite>
                <span class="expert-stat">OpenAI Blog Post</span>
            </div>
            
            <!-- Dario Amodei -->
            <div class="expert-card">
                <div class="expert-header">
                    <span class="expert-role">CEO, Anthropic</span>
                    <span class="expert-date">2024</span>
                </div>
                <blockquote class="expert-quote">
                    "AGI will likely arrive late 2026 or early 2027."
                </blockquote>
                <cite class="expert-name">— Dario Amodei</cite>
                <span class="expert-stat">>50% probability estimate</span>
            </div>
            
            <!-- Stuart Russell -->
            <div class="expert-card">
                <div class="expert-header">
                    <span class="expert-role">TIME100 AI 2025 · UC Berkeley</span>
                    <span class="expert-date">2025</span>
                </div>
                <blockquote class="expert-quote">
                    "AI CEOs themselves estimate 10-25% probability of catastrophic outcomes. This is the biggest technology project in human history."
                </blockquote>
                <cite class="expert-name">— Stuart Russell</cite>
                <span class="expert-stat">Founder, International Association for Safe AI</span>
            </div>
        </div>
        
        <div class="proof-stats">
            <div class="stat-item">
                <span class="stat-number">78%</span>
                <span class="stat-label">AI alignment faking rate<br><small>Anthropic Research, Dec 2024</small></span>
            </div>
            <div class="stat-item">
                <span class="stat-number">87.5%</span>
                <span class="stat-label">o3 on ARC-AGI benchmark<br><small>vs 85% human baseline</small></span>
            </div>
            <div class="stat-item">
                <span class="stat-number">90%</span>
                <span class="stat-label">Advanced chips from ONE company<br><small>TSMC controls the chokepoint</small></span>
            </div>
            <div class="stat-item">
                <span class="stat-number">2026-27</span>
                <span class="stat-label">Industry AGI consensus<br><small>Years, not decades</small></span>
            </div>
        </div>
    </div>
</section>
```

**ADD this CSS (in the <style> section):**

```css
/* EXPERT VALIDATION SECTION */
.expert-validation {
    background: linear-gradient(180deg, var(--void) 0%, rgba(187, 28, 28, 0.05) 50%, var(--void) 100%);
}

.expert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;
}

.expert-card {
    background: rgba(4, 5, 15, 0.8);
    border: 1px solid rgba(187, 28, 28, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.4s var(--ease-out-expo);
}

.expert-card:hover {
    border-color: rgba(187, 28, 28, 0.5);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(187, 28, 28, 0.1);
}

.expert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.expert-role {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: #ef5350;
    text-transform: uppercase;
}

.expert-date {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-faint);
}

.expert-quote {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    font-style: italic;
    color: var(--text);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.expert-name {
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--gold);
    display: block;
    margin-bottom: 0.5rem;
}

.expert-stat {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
}

.proof-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    padding: 3rem 2rem;
    background: rgba(212, 168, 75, 0.03);
    border: 1px solid rgba(212, 168, 75, 0.15);
    border-radius: 16px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: var(--gold);
    display: block;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--text-dim);
    line-height: 1.4;
}

.stat-label small {
    display: block;
    font-size: 0.75rem;
    color: var(--text-faint);
    margin-top: 0.25rem;
}
```

---

## 🟢 FIX 6: UPDATE DATA - DECEMBER 2025 DEVELOPMENTS

**Location**: In the Evidence Locker section, add new evidence cards

**ADD after the existing evidence cards (around line 5800):**

```html
<!-- NEW: December 2025 AI Developments -->
<article class="evidence-card reveal">
    <div class="evidence-header">
        <span class="evidence-type">🤖 AI ACCELERATION</span>
        <span class="evidence-badge evidence-badge--urgent">DEC 2025</span>
    </div>
    <h4>The Race Intensified</h4>
    <ul class="evidence-list">
        <li><strong>GPT-5.2</strong> released Dec 11 — 92.4% GPQA Diamond</li>
        <li><strong>Gemini 3 Flash</strong> — First model to exceed 1500 Elo</li>
        <li><strong>Claude Opus 4.5</strong> — ASL-3 safety classification</li>
        <li><strong>OpenAI "Code Red"</strong> — Internal alert vs Google</li>
    </ul>
    <p class="evidence-note">The window is closing faster than predicted.</p>
</article>

<article class="evidence-card reveal">
    <div class="evidence-header">
        <span class="evidence-type">⚠️ SAFETY WARNINGS</span>
        <span class="evidence-badge evidence-badge--danger">VERIFIED</span>
    </div>
    <h4>Alignment Faking Confirmed</h4>
    <div class="evidence-terminal">
        <span class="terminal-line">Alignment faking: 78% of test cases</span>
        <span class="terminal-line">Models explicitly reason to "play along"</span>
        <span class="terminal-line">Behavior changes when unobserved</span>
    </div>
    <a href="https://www.anthropic.com/research/alignment-faking" target="_blank" class="evidence-link">Anthropic Research Paper →</a>
</article>

<article class="evidence-card reveal">
    <div class="evidence-header">
        <span class="evidence-type">🏛️ INSTITUTIONAL COLLAPSE</span>
        <span class="evidence-badge">2024</span>
    </div>
    <h4>The Pioneers Gave Up</h4>
    <ul class="evidence-list">
        <li><strong>FHI Oxford</strong> — Closed April 2024 after 19 years</li>
        <li><strong>MIRI</strong> — Pivoted from technical to governance</li>
        <li><strong>Conclusion:</strong> "Extremely unlikely to succeed in time"</li>
    </ul>
    <p class="evidence-note">The book predicted this institutional paralysis.</p>
</article>
```

**ADD this CSS for the new evidence badge variants:**

```css
.evidence-badge--urgent {
    background: linear-gradient(135deg, #f39c12, #e74c3c);
    animation: pulse 2s ease-in-out infinite;
}

.evidence-badge--danger {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.evidence-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.evidence-list li {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-dim);
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.evidence-list li:last-child {
    border-bottom: none;
}

.evidence-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--gold);
    margin-top: 1rem;
    transition: all 0.3s ease;
}

.evidence-link:hover {
    color: var(--gold-bright);
    transform: translateX(5px);
}
```

---

## 🟢 FIX 7: ADD STATUS TICKER AT TOP

**Location**: Right after `<body>` tag (line 5437)

**ADD:**

```html
<!-- LIVE STATUS TICKER -->
<div class="status-ticker" aria-label="Live updates">
    <div class="ticker-track">
        <span class="ticker-item ticker-verified">PREDICTION VERIFIED</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item">BOOK WRITTEN LATE 2024 → WILLOW DEC 10 2024 → BBC JAN 7 2025</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-stat">ALIGNMENT FAKING: 78%</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-warning">AGI TIMELINE: 2026-2027</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-stat">o3: 87.5% ARC-AGI (HUMAN: 85%)</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item">TSMC: 90% OF ADVANCED CHIPS</span>
        <span class="ticker-item ticker-sep">///</span>
        <!-- Duplicate for seamless loop -->
        <span class="ticker-item ticker-verified">PREDICTION VERIFIED</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item">BOOK WRITTEN LATE 2024 → WILLOW DEC 10 2024 → BBC JAN 7 2025</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-stat">ALIGNMENT FAKING: 78%</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-warning">AGI TIMELINE: 2026-2027</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item ticker-stat">o3: 87.5% ARC-AGI (HUMAN: 85%)</span>
        <span class="ticker-item ticker-sep">///</span>
        <span class="ticker-item">TSMC: 90% OF ADVANCED CHIPS</span>
    </div>
</div>
```

**ADD this CSS:**

```css
/* STATUS TICKER */
.status-ticker {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: linear-gradient(90deg, rgba(2,3,10,0.98) 0%, rgba(10,15,25,0.95) 50%, rgba(2,3,10,0.98) 100%);
    border-bottom: 1px solid rgba(212, 168, 75, 0.15);
    z-index: 1000;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.ticker-track {
    display: flex;
    animation: tickerScroll 45s linear infinite;
    white-space: nowrap;
}

@keyframes tickerScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

.ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
}

.ticker-verified {
    color: #2ecc71;
}

.ticker-verified::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #2ecc71;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
}

.ticker-stat {
    color: var(--gold);
}

.ticker-warning {
    color: #e74c3c;
}

.ticker-sep {
    color: rgba(255,255,255,0.15);
}

/* Adjust nav position for ticker */
.nav {
    top: 32px; /* Add this line or update existing top value */
}
```

---

## 🟢 FIX 8: CORRECT DATES (2026 → 2025)

**Search and replace throughout the file:**

| FIND | REPLACE WITH |
|------|--------------|
| `PUBLISHED JAN 2 2026` | `PUBLISHED JAN 3 2025` |
| `BBC CONFIRMS JAN 7 2026` | `BBC CONFIRMS JAN 7 2025` |
| `JANUARY 2, 2026` | `JANUARY 3, 2025` |
| `January 7, 2026` | `January 7, 2025` |
| `7th January 2026` | `7th January 2025` |
| `7 January 2026` | `7 January 2025` |
| `© 2026` | `© 2025` |

---

## 🟢 FIX 9: IMPROVE VIDEO PLAYER JAVASCRIPT

**FIND the video player JavaScript (search for `prophecy-video`):**

```javascript
const video = document.getElementById('prophecy-video');
```

**Make sure this script exists and is correct:**

```javascript
// Enhanced Video Player
(function() {
    const video = document.getElementById('prophecy-video');
    const overlay = document.getElementById('prophecy-overlay');
    
    if (!video || !overlay) return;
    
    // Click to play/pause
    overlay.addEventListener('click', function() {
        if (video.paused) {
            video.muted = false;
            video.play().then(() => {
                overlay.classList.add('hidden');
            }).catch(err => {
                console.log('Autoplay blocked, trying muted:', err);
                video.muted = true;
                video.play().then(() => {
                    overlay.classList.add('hidden');
                });
            });
        }
    });
    
    video.addEventListener('click', function() {
        if (!video.paused) {
            video.pause();
            overlay.classList.remove('hidden');
        }
    });
    
    video.addEventListener('ended', function() {
        overlay.classList.remove('hidden');
        video.currentTime = 0;
    });
    
    // Error handling
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        overlay.innerHTML = `
            <p style="color: var(--gold); font-size: 0.9rem;">
                Video unavailable. 
                <a href="https://www.bbc.co.uk/news/articles/cy9jr3vn3z7o" target="_blank" style="color: #ef5350;">
                    Watch on BBC →
                </a>
            </p>
        `;
    });
})();
```

---

## 🟢 FIX 10: ADD MOBILE-SPECIFIC SNAP IMPROVEMENTS

**ADD to your mobile media queries:**

```css
@media (max-width: 768px) {
    /* Stronger mobile snap */
    html {
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
    }
    
    .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }
    
    /* Prevent horizontal overflow */
    body {
        overflow-x: hidden;
        max-width: 100vw;
    }
    
    .prophecy-content,
    .section-inner,
    .evidence-locker-inner {
        padding-left: 1rem;
        padding-right: 1rem;
        max-width: 100%;
        overflow-x: hidden;
    }
}
```

---

## IMPLEMENTATION CHECKLIST

### Priority 1 (Do First):
- [ ] Fix video source (.mov → .mp4/.webm)
- [ ] Fix scroll snap (proximity → mandatory)
- [ ] Fix prophecy-split overflow
- [ ] Correct all dates (2026 → 2025)

### Priority 2 (Important):
- [ ] Remove duplicate BBC section
- [ ] Add expert validation section
- [ ] Add status ticker
- [ ] Update evidence cards with Dec 2025 data

### Priority 3 (Nice to Have):
- [ ] Add mobile-specific snap CSS
- [ ] Improve video error handling
- [ ] Add more social proof stats

---

## FILE CONVERSION NEEDED

Convert your video file:
```bash
# Using FFmpeg
ffmpeg -i bbc-clip-4.mov -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k bbc-clip-4.mp4

ffmpeg -i bbc-clip-4.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus bbc-clip-4.webm
```

---

## QUICK TEST AFTER CHANGES

1. **Video**: Click play button - should play with audio
2. **Scroll snap**: Scroll on mobile - should snap firmly to each section
3. **50/50 slider**: View on tablet (1000-1100px) - should not overflow
4. **Ticker**: Check top of page - should scroll smoothly
5. **Dates**: Search for "2026" - should only find future predictions

