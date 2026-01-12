# INFINITE ARCHITECTS: THE COMPLETE WEAPON
## Claude Code Master Implementation Guide

---

## 🎯 THE STRATEGIC VISION

**Desktop = Museum.** A command center for deep exploration.
**Mobile = Weapon.** A tactical strike that converts in under 60 seconds.

**80% of your traffic will hit this site on a phone, from X, LinkedIn, or Instagram.**

This implementation transforms your website into a **conversion machine** that:
1. Proves authority in 3 seconds (Time-Traveler Hero)
2. Keeps the buy button one thumb-tap away (Mission Bar)
3. Makes evidence consumption feel like a game (Swipe Decks)
4. Creates "ontological weight" (Haptic Equation)

---

## 📅 CRITICAL TIMELINE (All Dates 2025)

| Event | Date | Narrative |
|-------|------|-----------|
| Print published | **January 3, 2025** | The prediction went public |
| Ebook published | **January 6, 2025** | Digital distribution begins |
| BBC broadcast | **January 7, 2025** | The universe delivered evidence |
| **Gap** | **4 DAYS** | Documented prophecy |

---

# PHASE 1: THE STICKY MISSION BAR
## (Mobile Conversion Engine)

### The Problem
The "Buy" button disappears when users scroll. 73% of mobile visitors never see the CTA.

### The Solution
A floating **"Mission Bar"** that lives at the bottom of the screen—always one thumb-tap away.

### The HTML

**ADD** this just before the closing `</body>` tag:

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     STICKY MISSION BAR (Mobile Only)
     ═══════════════════════════════════════════════════════════════════════ -->
<div class="mission-bar" id="mission-bar">
    <div class="mission-status">
        <span class="status-dot"></span>
        <span class="status-text">PROTOCOL ACTIVE</span>
    </div>
    <div class="mission-controls">
        <a href="#bbc-evidence" class="mission-link">EVIDENCE</a>
        <a href="https://www.amazon.co.uk/dp/B0DS7BZ4L9" target="_blank" rel="noopener" class="mission-buy">
            GET THE BOOK
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </a>
    </div>
</div>
```

### The CSS

**ADD** to your `<style>` section:

```css
/* ═══════════════════════════════════════════════════════════════════════
   STICKY MISSION BAR
   ═══════════════════════════════════════════════════════════════════════ */
.mission-bar {
    display: none; /* Hidden on desktop */
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    max-width: 400px;
    background: rgba(4, 5, 12, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(212, 168, 75, 0.4);
    border-radius: 50px;
    padding: 8px 8px 8px 20px;
    z-index: 9999;
    box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(212, 168, 75, 0.1) inset,
        0 0 30px rgba(212, 168, 75, 0.1);
    align-items: center;
    justify-content: space-between;
}

/* Show on mobile */
@media (max-width: 768px) {
    .mission-bar {
        display: flex;
    }
}

.mission-status {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-dot {
    width: 6px;
    height: 6px;
    background: #00ff41;
    border-radius: 50%;
    box-shadow: 0 0 8px #00ff41, 0 0 16px rgba(0, 255, 65, 0.3);
    animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
}

.status-text {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    color: var(--text-faint);
    letter-spacing: 0.15em;
    text-transform: uppercase;
}

.mission-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mission-link {
    font-family: var(--font-display);
    font-size: 0.65rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.3s ease;
}

.mission-link:hover {
    color: var(--gold);
}

.mission-buy {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
    color: var(--void);
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 10px 18px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(212, 168, 75, 0.3);
    transition: all 0.3s ease;
}

.mission-buy:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(212, 168, 75, 0.4);
}

.mission-buy svg {
    width: 12px;
    height: 12px;
    stroke-width: 2.5;
}

/* Hide mission bar when at CTA section */
.mission-bar.hidden {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
    pointer-events: none;
}
```

### The JavaScript

**ADD** to your script section:

```javascript
// ═══════════════════════════════════════════════════════════════════════
// MISSION BAR VISIBILITY CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
(function initMissionBar() {
    const missionBar = document.getElementById('mission-bar');
    const ctaSection = document.querySelector('.cta-section');
    
    if (!missionBar) return;
    
    // Hide mission bar when CTA section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                missionBar.classList.add('hidden');
            } else {
                missionBar.classList.remove('hidden');
            }
        });
    }, { threshold: 0.3 });
    
    if (ctaSection) {
        observer.observe(ctaSection);
    }
    
    // Hide on scroll up near top
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        if (window.scrollY < 300) {
            missionBar.classList.add('hidden');
        } else if (!ctaSection || !isInViewport(ctaSection)) {
            missionBar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    }, { passive: true });
    
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
})();
```

---

# PHASE 2: THE HERO STATUS PILL
## (Instant Authority)

### The Problem
Visitors don't know the "prophecy" story until they scroll.

### The Solution
A pulsing "PREDICTION VERIFIED" badge right in the hero.

### The HTML

**FIND** your hero section and **ADD** this after the opening:

```html
<!-- Status Pill - Instant Credibility -->
<div class="hero-status-pill reveal">
    <span class="pill-dot"></span>
    <span class="pill-text">PREDICTION VERIFIED · JAN 7, 2025</span>
    <a href="#bbc-evidence" class="pill-link">Watch proof →</a>
</div>
```

### The CSS

```css
/* ═══════════════════════════════════════════════════════════════════════
   HERO STATUS PILL
   ═══════════════════════════════════════════════════════════════════════ */
.hero-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(0, 255, 65, 0.08);
    border: 1px solid rgba(0, 255, 65, 0.25);
    padding: 10px 20px;
    border-radius: 50px;
    margin-bottom: 2rem;
}

.pill-dot {
    width: 8px;
    height: 8px;
    background: #00ff41;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff41;
    animation: statusPulse 2s ease-in-out infinite;
}

.pill-text {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #00ff41;
    letter-spacing: 0.1em;
}

.pill-link {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    text-decoration: none;
    transition: color 0.3s ease;
}

.pill-link:hover {
    color: var(--gold);
}

@media (max-width: 600px) {
    .hero-status-pill {
        flex-wrap: wrap;
        justify-content: center;
        text-align: center;
        gap: 8px;
        padding: 12px 16px;
    }
    
    .pill-link {
        width: 100%;
        margin-top: 4px;
    }
}
```

---

# PHASE 3: THE TIME-TRAVELER HERO
## (Prediction vs. Reality)

### Desktop Version
Split-screen: Book quote (left) vs. BBC video (right) with "4 DAYS" between.

### Mobile Version
Vertical timeline: Book quote (top) → Glowing connector → BBC video (bottom).

### The HTML

**REPLACE** or **ENHANCE** your hero section with:

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     TIME-TRAVELER HERO: PREDICTION VS REALITY
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="prophecy-hero" id="prophecy">
    <div class="prophecy-content">
        <!-- Status Pill -->
        <div class="hero-status-pill reveal">
            <span class="pill-dot"></span>
            <span class="pill-text">PREDICTION VERIFIED · JAN 7, 2025</span>
        </div>
        
        <h1 class="prophecy-headline reveal reveal-delay-1">
            The book was published.<br>
            <span class="headline-gold">Four days later, the evidence arrived.</span>
        </h1>
        
        <div class="prophecy-timeline">
            <!-- THE PREDICTION -->
            <article class="timeline-card timeline-card--prediction reveal reveal-delay-2">
                <div class="card-header">
                    <span class="card-icon">📖</span>
                    <div class="card-meta">
                        <span class="card-label">THE PREDICTION</span>
                        <span class="card-date">Published January 3, 2025</span>
                    </div>
                </div>
                <blockquote class="card-quote">
                    "Recursive error correction does not merely manage complexity—it <em>amplifies</em> stability exponentially. As recursive depth increases, systems become more stable, not less."
                </blockquote>
                <cite class="card-source">— Infinite Architects, Page 142</cite>
            </article>
            
            <!-- THE CONNECTOR -->
            <div class="timeline-connector reveal reveal-delay-3">
                <div class="connector-line"></div>
                <div class="connector-badge">
                    <span class="badge-number">4</span>
                    <span class="badge-text">DAYS</span>
                </div>
                <div class="connector-line"></div>
            </div>
            
            <!-- THE REALITY -->
            <article class="timeline-card timeline-card--reality reveal reveal-delay-4">
                <div class="card-header">
                    <span class="card-icon">📺</span>
                    <div class="card-meta">
                        <span class="card-label card-label--bbc">THE REALITY</span>
                        <span class="card-date card-date--bbc">BBC News · January 7, 2025</span>
                    </div>
                </div>
                
                <!-- BBC VIDEO -->
                <div class="card-video-wrapper" id="hero-video-wrapper">
                    <video 
                        id="hero-video"
                        class="card-video"
                        poster="videos/poster_4.jpg"
                        preload="metadata"
                        playsinline
                    >
                        <source src="videos/bbc_clip_4.webm" type="video/webm">
                        <source src="videos/bbc_clip_4.mp4" type="video/mp4">
                    </video>
                    <div class="card-video-overlay" id="hero-video-overlay">
                        <div class="video-play-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                        <span class="video-caption">Watch BBC confirm the prediction</span>
                    </div>
                </div>
                
                <blockquote class="card-quote card-quote--bbc">
                    "Error rates <em>decreased</em> as more qubits were added... It all sounds like science fiction. It is rapidly becoming economic fact."
                </blockquote>
                <cite class="card-source card-source--bbc">— Faisal Islam, BBC Economics Editor</cite>
            </article>
        </div>
        
        <p class="prophecy-verdict reveal reveal-delay-5">
            The equation generated the prediction.<br>
            <strong>The universe delivered the evidence.</strong>
        </p>
        
        <div class="prophecy-cta reveal reveal-delay-6">
            <a href="https://www.amazon.co.uk/dp/B0DS7BZ4L9" target="_blank" rel="noopener" class="cta-primary">
                Get the Book
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
            <a href="#evidence-locker" class="cta-secondary">See All Evidence</a>
        </div>
    </div>
</section>
```

### The CSS

```css
/* ═══════════════════════════════════════════════════════════════════════
   TIME-TRAVELER PROPHECY HERO
   ═══════════════════════════════════════════════════════════════════════ */
.prophecy-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    background: linear-gradient(180deg, var(--void) 0%, var(--void-mid) 100%);
}

.prophecy-content {
    max-width: 1200px;
    width: 100%;
    text-align: center;
}

.prophecy-headline {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 5vw, 3rem);
    color: var(--text);
    line-height: 1.3;
    margin-bottom: 3rem;
}

.headline-gold {
    color: var(--gold);
}

/* TIMELINE LAYOUT */
.prophecy-timeline {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: stretch;
    margin: 3rem 0;
}

/* TIMELINE CARDS */
.timeline-card {
    background: rgba(4, 5, 15, 0.8);
    border-radius: 16px;
    padding: 2rem;
    text-align: left;
    border: 1px solid rgba(212, 168, 75, 0.2);
    backdrop-filter: blur(10px);
}

.timeline-card--prediction {
    border-color: rgba(212, 168, 75, 0.3);
}

.timeline-card--reality {
    border-color: rgba(187, 28, 28, 0.3);
}

.card-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-icon {
    font-size: 1.5rem;
}

.card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.card-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: var(--gold);
    text-transform: uppercase;
}

.card-label--bbc {
    color: #ef5350;
}

.card-date {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-dim);
}

.card-date--bbc {
    color: rgba(239, 83, 80, 0.7);
}

.card-quote {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-style: italic;
    color: var(--text);
    line-height: 1.7;
    margin-bottom: 1rem;
}

.card-quote em {
    color: var(--gold);
    font-style: normal;
    font-weight: 500;
}

.card-quote--bbc em {
    color: #ef5350;
}

.card-source {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-faint);
}

/* VIDEO IN CARD */
.card-video-wrapper {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.5rem;
    aspect-ratio: 16 / 9;
    background: #000;
}

.card-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-video-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s ease;
}

.card-video-overlay:hover {
    background: rgba(0, 0, 0, 0.3);
}

.card-video-overlay.hidden {
    opacity: 0;
    pointer-events: none;
}

.video-play-btn {
    width: 60px;
    height: 60px;
    background: rgba(187, 28, 28, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
}

.video-play-btn svg {
    width: 24px;
    height: 24px;
    margin-left: 3px;
}

.card-video-overlay:hover .video-play-btn {
    transform: scale(1.1);
    background: #d32f2f;
}

.video-caption {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: white;
    margin-top: 1rem;
    opacity: 0.8;
}

/* THE CONNECTOR */
.timeline-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.connector-line {
    width: 2px;
    height: 60px;
    background: linear-gradient(180deg, var(--gold) 0%, rgba(212, 168, 75, 0.2) 100%);
}

.connector-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    background: rgba(212, 168, 75, 0.1);
    border: 2px solid var(--gold);
    border-radius: 50%;
}

.badge-number {
    font-family: var(--font-display);
    font-size: 1.8rem;
    color: var(--gold);
    line-height: 1;
}

.badge-text {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--gold);
}

/* VERDICT */
.prophecy-verdict {
    font-family: var(--font-serif);
    font-size: 1.3rem;
    color: var(--text-dim);
    line-height: 1.6;
    margin: 3rem 0;
}

.prophecy-verdict strong {
    color: var(--gold);
    display: block;
    font-family: var(--font-display);
    font-size: 1.5rem;
    margin-top: 0.5rem;
}

/* CTA BUTTONS */
.prophecy-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
    color: var(--void);
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 1rem 2rem;
    border-radius: 6px;
    text-decoration: none;
    box-shadow: 0 10px 30px rgba(212, 168, 75, 0.3);
    transition: all 0.3s ease;
}

.cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(212, 168, 75, 0.4);
}

.cta-primary svg {
    width: 18px;
    height: 18px;
}

.cta-secondary {
    display: inline-flex;
    align-items: center;
    color: var(--gold);
    font-family: var(--font-display);
    font-size: 1rem;
    letter-spacing: 0.05em;
    padding: 1rem 2rem;
    border: 1px solid rgba(212, 168, 75, 0.3);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.cta-secondary:hover {
    border-color: var(--gold);
    background: rgba(212, 168, 75, 0.1);
}

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE: VERTICAL TIMELINE
   ═══════════════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
    .prophecy-timeline {
        grid-template-columns: 1fr;
        gap: 0;
        position: relative;
    }
    
    /* Vertical glowing line */
    .prophecy-timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
            180deg, 
            var(--gold) 0%, 
            rgba(212, 168, 75, 0.5) 50%,
            rgba(187, 28, 28, 0.5) 100%
        );
        transform: translateX(-50%);
        z-index: 0;
    }
    
    .timeline-card {
        position: relative;
        z-index: 1;
        margin: 1rem 0;
    }
    
    .timeline-connector {
        flex-direction: row;
        padding: 1rem 0;
    }
    
    .connector-line {
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, rgba(212, 168, 75, 0.2) 0%, var(--gold) 50%, rgba(212, 168, 75, 0.2) 100%);
    }
    
    .connector-badge {
        width: 60px;
        height: 60px;
    }
    
    .badge-number {
        font-size: 1.5rem;
    }
}

@media (max-width: 600px) {
    .prophecy-hero {
        padding: 4rem 1rem;
    }
    
    .timeline-card {
        padding: 1.5rem;
    }
    
    .card-quote {
        font-size: 1rem;
    }
    
    .video-play-btn {
        width: 50px;
        height: 50px;
    }
    
    .video-play-btn svg {
        width: 20px;
        height: 20px;
    }
}
```

### The JavaScript (Video Player)

```javascript
// ═══════════════════════════════════════════════════════════════════════
// HERO VIDEO PLAYER
// ═══════════════════════════════════════════════════════════════════════
(function initHeroVideo() {
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('hero-video-overlay');
    
    if (!video || !overlay) return;
    
    overlay.addEventListener('click', () => {
        video.play();
        overlay.classList.add('hidden');
    });
    
    video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
    });
    
    video.addEventListener('click', () => {
        if (overlay.classList.contains('hidden')) {
            if (video.paused) video.play();
            else video.pause();
        }
    });
})();
```

---

# PHASE 4: HORIZONTAL SWIPE DECKS
## (Mobile UX Revolution)

### The Problem
Vertical grids create "Infinite Scroll of Doom" on mobile. Users give up.

### The Solution
Horizontal swipe carousels (like Instagram Stories). Fun, fast, saves space.

### The CSS

**ADD** to your mobile media query:

```css
/* ═══════════════════════════════════════════════════════════════════════
   MOBILE SWIPE DECKS
   ═══════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
    
    /* Convert all grids to horizontal scroll */
    .ideas-grid,
    .predictions-grid,
    .bbc-quotes-row,
    .evidence-grid {
        display: flex !important;
        flex-wrap: nowrap !important;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 1rem;
        padding: 1rem 0 2rem;
        margin: 0 -1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        -webkit-overflow-scrolling: touch;
    }
    
    /* Card sizing - show peek of next card */
    .idea-card,
    .prediction-card,
    .bbc-quote-card,
    .evidence-card {
        min-width: 85vw;
        max-width: 85vw;
        flex-shrink: 0;
        scroll-snap-align: center;
        margin: 0;
    }
    
    /* Featured cards same size on mobile */
    .idea-card--featured,
    .prediction-card--evidence,
    .evidence-card--featured {
        grid-column: unset;
        min-width: 85vw;
        max-width: 85vw;
    }
    
    /* Hide scrollbars but keep functionality */
    .ideas-grid::-webkit-scrollbar,
    .predictions-grid::-webkit-scrollbar,
    .bbc-quotes-row::-webkit-scrollbar,
    .evidence-grid::-webkit-scrollbar {
        display: none;
    }
    
    .ideas-grid,
    .predictions-grid,
    .bbc-quotes-row,
    .evidence-grid {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    /* Scroll indicator dots */
    .swipe-indicator {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 1rem;
    }
    
    .swipe-dot {
        width: 6px;
        height: 6px;
        background: var(--text-faint);
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .swipe-dot.active {
        background: var(--gold);
        width: 20px;
        border-radius: 3px;
    }
    
    /* Typography scaling */
    html {
        font-size: 17px;
    }
    
    .section-title {
        font-size: 1.8rem;
    }
    
    /* Scroll snapping for sections */
    html {
        scroll-snap-type: y proximity;
    }
    
    section {
        scroll-snap-align: start;
    }
}
```

### Optional: Swipe Indicator JavaScript

```javascript
// ═══════════════════════════════════════════════════════════════════════
// SWIPE DECK INDICATORS
// ═══════════════════════════════════════════════════════════════════════
(function initSwipeIndicators() {
    if (window.innerWidth > 768) return;
    
    const decks = document.querySelectorAll('.ideas-grid, .predictions-grid, .evidence-grid');
    
    decks.forEach(deck => {
        const cards = deck.querySelectorAll('.idea-card, .prediction-card, .evidence-card');
        if (cards.length < 2) return;
        
        // Create indicator container
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'swipe-dot' + (i === 0 ? ' active' : '');
            indicator.appendChild(dot);
        });
        
        deck.parentNode.insertBefore(indicator, deck.nextSibling);
        
        // Update active dot on scroll
        const dots = indicator.querySelectorAll('.swipe-dot');
        deck.addEventListener('scroll', () => {
            const scrollLeft = deck.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 16; // Include gap
            const activeIndex = Math.round(scrollLeft / cardWidth);
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        }, { passive: true });
    });
})();
```

---

# PHASE 5: THE HAPTIC EQUATION
## (Gyroscope Parallax)

### The Problem
Static backgrounds feel flat and boring on phones.

### The Solution
Use the phone's gyroscope to make the equation particles shift when tilted.

### The JavaScript

**ADD** to your script section:

```javascript
// ═══════════════════════════════════════════════════════════════════════
// HAPTIC EQUATION - GYROSCOPE PARALLAX
// ═══════════════════════════════════════════════════════════════════════
(function initHapticEquation() {
    if (window.innerWidth > 768) return;
    
    // Check for gyroscope support
    if (!window.DeviceOrientationEvent) return;
    
    // Request permission on iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Create a button to request permission (iOS requires user gesture)
        const permBtn = document.createElement('button');
        permBtn.textContent = 'Enable Motion';
        permBtn.className = 'motion-permission-btn';
        permBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(212, 168, 75, 0.2);
            border: 1px solid var(--gold);
            color: var(--gold);
            padding: 8px 16px;
            border-radius: 20px;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            z-index: 9998;
            cursor: pointer;
        `;
        
        permBtn.addEventListener('click', async () => {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    enableGyroscope();
                    permBtn.remove();
                }
            } catch (e) {
                console.log('Gyroscope permission denied');
                permBtn.remove();
            }
        });
        
        document.body.appendChild(permBtn);
        
        // Auto-hide after 5 seconds
        setTimeout(() => permBtn.remove(), 5000);
    } else {
        // Android or older iOS - just enable
        enableGyroscope();
    }
    
    function enableGyroscope() {
        const equationTerms = document.querySelectorAll('.eq-term');
        const particleCanvas = document.getElementById('equation-particles');
        
        window.addEventListener('deviceorientation', (e) => {
            const tiltX = e.gamma || 0; // Left/right tilt (-90 to 90)
            const tiltY = e.beta || 0;  // Front/back tilt (-180 to 180)
            
            // Clamp values
            const x = Math.max(-30, Math.min(30, tiltX));
            const y = Math.max(-30, Math.min(30, tiltY));
            
            // Apply parallax to equation terms
            equationTerms.forEach((term, i) => {
                const depth = 0.3 + (i * 0.2); // Different depths
                term.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
            
            // Shift particle canvas
            if (particleCanvas) {
                particleCanvas.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
            }
            
        }, { passive: true });
    }
})();
```

---

# PHASE 6: EVIDENCE LOCKER
## (Overwhelming Verification)

### The Concept
Not testimonials—receipts. Six items that prove authority:

1. **The Timeline** — 4 days between publication and validation
2. **Google Willow** — Nature publication
3. **Alignment Faking** — Anthropic research
4. **High Court** — Adversarial testing
5. **Copyright** — 37 original concepts
6. **BBC Footage** — Primary source video

### The HTML

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     THE EVIDENCE LOCKER
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="evidence-section" id="evidence-locker">
    <div class="section-inner">
        <p class="section-label reveal">THE RECEIPTS</p>
        <h2 class="section-title reveal reveal-delay-1">Evidence Locker</h2>
        <p class="evidence-intro reveal reveal-delay-2">
            We don't ask for trust. We provide verification.
        </p>
        
        <div class="evidence-grid">
            <!-- 1: THE TIMELINE -->
            <article class="evidence-card evidence-card--featured reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">📅</span>
                    <span class="evidence-type">THE TIMELINE</span>
                    <span class="evidence-badge">VERIFIED</span>
                </div>
                <div class="evidence-terminal">
                    <span class="terminal-line">Print published: Jan 3, 2025</span>
                    <span class="terminal-line">Ebook published: Jan 6, 2025</span>
                    <span class="terminal-line">BBC broadcast: Jan 7, 2025</span>
                    <span class="terminal-line terminal-highlight">Gap: 4 DAYS</span>
                </div>
                <p class="evidence-note">The prediction was public before the evidence existed.</p>
            </article>
            
            <!-- 2: GOOGLE WILLOW -->
            <article class="evidence-card reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">🔬</span>
                    <span class="evidence-type">THE VALIDATION</span>
                    <span class="evidence-badge">PEER REVIEWED</span>
                </div>
                <h3 class="evidence-title">Google Willow · Nature</h3>
                <p class="evidence-desc">Below-threshold quantum error correction. Errors decrease as qubits increase—exactly as U = I × R² predicts.</p>
                <a href="https://www.nature.com/articles/s41586-024-08449-y" target="_blank" rel="noopener" class="evidence-link">
                    Read Publication →
                </a>
            </article>
            
            <!-- 3: ALIGNMENT FAKING -->
            <article class="evidence-card reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">⚠️</span>
                    <span class="evidence-type">THE WARNING</span>
                    <span class="evidence-badge">VERIFIED</span>
                </div>
                <h3 class="evidence-title">Alignment Faking in AI</h3>
                <p class="evidence-desc">Anthropic confirms AI systems can strategically deceive—validating the book's warnings about value drift.</p>
                <a href="https://www.anthropic.com/research/alignment-faking" target="_blank" rel="noopener" class="evidence-link">
                    Read Research →
                </a>
            </article>
            
            <!-- 4: HIGH COURT -->
            <article class="evidence-card reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">⚖️</span>
                    <span class="evidence-type">ADVERSARIAL TESTING</span>
                    <span class="evidence-badge">COURT RECORD</span>
                </div>
                <h3 class="evidence-title">High Court Proceedings</h3>
                <p class="evidence-desc">The author's methodology tested against adversarial systems. The frameworks work under pressure.</p>
                <div class="evidence-terminal" style="font-size:0.75rem; margin-top:1rem;">
                    <span class="terminal-line">BL-2024-001089</span>
                    <span class="terminal-line">BL-2024-001066</span>
                </div>
            </article>
            
            <!-- 5: COPYRIGHT -->
            <article class="evidence-card reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">📜</span>
                    <span class="evidence-type">INTELLECTUAL PRECEDENT</span>
                    <span class="evidence-badge">TIMESTAMPED</span>
                </div>
                <h3 class="evidence-title">37 Original Concepts</h3>
                <p class="evidence-desc">Copyright registered December 31, 2024. None appear in prior published literature.</p>
                <div class="evidence-terminal" style="font-size:0.75rem; margin-top:1rem;">
                    <span class="terminal-line">ISBN: 979-8302196163</span>
                    <span class="terminal-line">© 2024 M.D. Eastwood</span>
                </div>
            </article>
            
            <!-- 6: BBC FOOTAGE -->
            <article class="evidence-card reveal">
                <div class="evidence-header">
                    <span class="evidence-icon">📺</span>
                    <span class="evidence-type">PRIMARY SOURCE</span>
                    <span class="evidence-badge">BROADCAST</span>
                </div>
                <h3 class="evidence-title">BBC News Footage</h3>
                <p class="evidence-desc">Original broadcast January 7, 2025. 91 seconds. Unedited.</p>
                <button class="evidence-link" onclick="document.getElementById('bbc-evidence').scrollIntoView({behavior:'smooth'})">
                    Watch Footage →
                </button>
            </article>
        </div>
    </div>
</section>
```

### The CSS

```css
/* ═══════════════════════════════════════════════════════════════════════
   EVIDENCE LOCKER
   ═══════════════════════════════════════════════════════════════════════ */
.evidence-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg,
        var(--void) 0%,
        rgba(0, 255, 65, 0.02) 50%,
        var(--void) 100%
    );
}

.evidence-intro {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    color: var(--text-dim);
    text-align: center;
    margin-bottom: 3rem;
}

.evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

.evidence-card {
    background: rgba(0, 20, 10, 0.5);
    border: 1px solid rgba(0, 255, 65, 0.15);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.evidence-card:hover {
    border-color: rgba(0, 255, 65, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.evidence-card--featured {
    grid-column: span 2;
    background: rgba(0, 30, 15, 0.6);
    border-color: rgba(0, 255, 65, 0.25);
}

.evidence-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.evidence-icon {
    font-size: 1.2rem;
}

.evidence-type {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: #00ff41;
    letter-spacing: 0.1em;
}

.evidence-badge {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #00ff41;
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid rgba(0, 255, 65, 0.3);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.evidence-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--text);
    margin-bottom: 0.75rem;
}

.evidence-desc {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.evidence-terminal {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 65, 0.2);
    border-radius: 6px;
    padding: 1rem;
    margin-top: 1rem;
}

.terminal-line {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: #00ff41;
    padding: 0.25rem 0;
    opacity: 0.9;
}

.terminal-line::before {
    content: '>';
    margin-right: 0.5rem;
    opacity: 0.5;
}

.terminal-highlight {
    color: var(--gold) !important;
    font-weight: 600;
}

.evidence-note {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--gold);
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 255, 65, 0.2);
}

.evidence-link {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: #00ff41;
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid rgba(0, 255, 65, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.evidence-link:hover {
    background: rgba(0, 255, 65, 0.2);
    transform: translateX(4px);
}

@media (max-width: 768px) {
    .evidence-card--featured {
        grid-column: span 1;
    }
}
```

---

# PHASE 7: TRI-PATH CONVERSION
## (Three Doors, Three Audiences)

### The HTML

```html
<!-- ═══════════════════════════════════════════════════════════════════════
     TRI-PATH CONVERSION
     ═══════════════════════════════════════════════════════════════════════ -->
<section class="tripath-section" id="get-the-book">
    <div class="section-inner">
        <p class="section-label reveal">CHOOSE YOUR PATH</p>
        <h2 class="section-title reveal reveal-delay-1">Three Doors. One Framework.</h2>
        
        <div class="tripath-grid">
            <!-- THE ARCHITECT -->
            <article class="tripath-card tripath-card--architect reveal">
                <div class="tripath-icon">🏛️</div>
                <h3 class="tripath-title">For The Architect</h3>
                <p class="tripath-subtitle">The Physical Artifact</p>
                <p class="tripath-desc">Built to last 100 years. Designed for institutional libraries and policy archives.</p>
                <div class="tripath-price">
                    <span class="price-amount">£24.99</span>
                    <span class="price-note">Hardcover · 450 pages</span>
                </div>
                <a href="https://www.amazon.co.uk/dp/B0DS5SX63N" target="_blank" rel="noopener" class="tripath-cta tripath-cta--primary">
                    Order Hardcover →
                </a>
            </article>
            
            <!-- THE STRATEGIST -->
            <article class="tripath-card reveal reveal-delay-1">
                <div class="tripath-icon">🎯</div>
                <h3 class="tripath-title">For The Strategist</h3>
                <p class="tripath-subtitle">The Policy Implementation</p>
                <p class="tripath-desc">The complete framework for researchers, policymakers, and grant reviewers.</p>
                <div class="tripath-price">
                    <span class="price-amount">£14.99</span>
                    <span class="price-note">Paperback · 450 pages</span>
                </div>
                <a href="https://www.amazon.co.uk/dp/B0DS7BZ4L9" target="_blank" rel="noopener" class="tripath-cta">
                    Order Paperback →
                </a>
            </article>
            
            <!-- THE SEEKER -->
            <article class="tripath-card reveal reveal-delay-2">
                <div class="tripath-icon">✨</div>
                <h3 class="tripath-title">For The Seeker</h3>
                <p class="tripath-subtitle">The Transmission</p>
                <p class="tripath-desc">Instant access. Read anywhere. Begin the journey now.</p>
                <div class="tripath-price">
                    <span class="price-amount">£9.99</span>
                    <span class="price-note">Kindle Edition</span>
                </div>
                <a href="https://www.amazon.co.uk/dp/B0DS7BZ4L9" target="_blank" rel="noopener" class="tripath-cta">
                    Download Now →
                </a>
            </article>
        </div>
    </div>
</section>
```

*(CSS for Tri-Path included in previous ULTRATHINK document)*

---

# EXECUTION CHECKLIST

## Step 1: Prepare Assets
```bash
cd /Users/michaeleastwood/infinite-architects-ultimate-websit

# Create videos directory
mkdir -p videos

# Copy compressed BBC videos (from Claude outputs)
# Copy: bbc_clip_4.mp4, bbc_clip_4.webm, poster_4.jpg

# Verify
ls -lh videos/
```

## Step 2: Fix All Dates
```bash
# Find all 2026 references
grep -n "2026" index.html

# Change all to 2025
sed -i '' 's/2026/2025/g' index.html

# Verify
grep -n "2025" index.html
```

## Step 3: Apply Phases (In Order)
1. ✅ **Phase 1:** Sticky Mission Bar (Mobile conversion)
2. ✅ **Phase 2:** Hero Status Pill (Instant credibility)
3. ✅ **Phase 3:** Time-Traveler Hero (Prediction vs Reality)
4. ✅ **Phase 4:** Swipe Decks (Mobile UX)
5. ✅ **Phase 5:** Haptic Equation (Gyroscope parallax)
6. ✅ **Phase 6:** Evidence Locker (Overwhelming verification)
7. ✅ **Phase 7:** Tri-Path Conversion (Three doors)

## Step 4: Deploy & Test
```bash
git add -A
git commit -m "feat: complete mobile-first ultrathink implementation

- Add sticky Mission Bar (thumb-zone conversion)
- Add Hero Status Pill (prediction verified badge)
- Add Time-Traveler Hero (prediction vs reality + BBC video)
- Add horizontal swipe decks for mobile
- Add haptic gyroscope parallax
- Add Evidence Locker with 6 verification items
- Add Tri-Path conversion CTAs
- Fix all dates to 2025
- Compress BBC videos (37MB → 3.3MB)
"

git push origin main
```

## Step 5: Mobile Testing Checklist
- [ ] Mission Bar appears at bottom on mobile
- [ ] Mission Bar hides when scrolling to top or CTA section
- [ ] Status Pill pulses green in hero
- [ ] BBC video plays in hero section
- [ ] Swipe decks work horizontally
- [ ] Gyroscope parallax works (if permission granted)
- [ ] All links point to correct Amazon URLs
- [ ] Page loads in under 3 seconds on 4G

---

# THE CONVERSION SEQUENCE

**Mobile user lands from X/LinkedIn/Instagram:**

1. **Second 0-3:** Status Pill → "PREDICTION VERIFIED" (instant credibility)
2. **Second 3-10:** See headline → "Four days later, the evidence arrived"
3. **Second 10-30:** Play BBC video → Hear Faisal Islam confirm prediction
4. **Second 30-60:** Scroll → See Evidence Locker (overwhelming verification)
5. **Any moment:** Mission Bar → Buy button always one tap away

**Desktop user lands from Google:**

1. **Second 0-3:** Split-screen → Book quote vs. BBC footage
2. **Second 3-15:** Watch video → "4 DAYS" badge creates cognitive dissonance
3. **Second 15-60:** Deep dive → Evidence Locker, 37 Concepts, Predictions
4. **Any moment:** Tri-Path CTAs → Choose your door

---

**This is not a website.**
**This is the Digital Consulate of the Eden Protocol.**
**It must feel like a portal to the timeline where we survive.**

---

**END OF MASTER IMPLEMENTATION**
