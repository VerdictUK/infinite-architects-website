# HERO REVOLUTION: Making the First 5 Seconds Unforgettable

## The Problem

The current hero is *good*. But "good" won't make headlines. We need **extraordinary**.

### Current Issues Identified from Screenshots:

1. **"ENABLE MOTION EFFECTS" button** - Creates friction. Auto-detect instead.
2. **"MOTION" indicator on mobile** - Competes with credibility markers. Remove.
3. **"THE RECEIPTS" section** - Good but could be MORE impactful.
4. **Prediction verification** - Not dramatic enough. This is the killer feature.
5. **Scroll incentive** - "EXPLORE" is weak. Make it irresistible.

---

## Part 1: Remove "Enable Motion Effects" Button (Auto-Detect)

### Strategy
Don't ask permission. Detect capability. Enable silently.

### JavaScript Implementation

```javascript
/**
 * INTELLIGENT MOTION AUTO-ENABLE
 * Detects device capability and enables motion automatically
 * No friction. No permission prompts. Just magic.
 */
(function initAutoMotion() {
    'use strict';
    
    // Check if motion should be enabled
    function shouldEnableMotion() {
        // Check for reduced motion preference (accessibility)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return false;
        
        // Check connection quality (if available)
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            const slowConnection = connection.effectiveType === 'slow-2g' || 
                                   connection.effectiveType === '2g' ||
                                   connection.saveData === true;
            if (slowConnection) return false;
        }
        
        // Check device memory (if available)
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            // Less than 4GB RAM - might struggle with particles
            return false;
        }
        
        // Check for low-power mode indicators
        const isLowPower = navigator.getBattery && navigator.getBattery().then(battery => {
            return battery.level < 0.2 && !battery.charging;
        });
        
        // Default: enable motion for capable devices
        return true;
    }
    
    // Enable motion effects
    function enableMotion() {
        document.body.classList.add('motion-enabled');
        
        // Trigger any particle systems
        if (window.particleSystem && typeof window.particleSystem.start === 'function') {
            window.particleSystem.start();
        }
        
        // Enable CSS-based animations
        document.documentElement.style.setProperty('--motion-enabled', '1');
        
        // Store preference
        try {
            localStorage.setItem('ia_motion_enabled', 'true');
        } catch (e) {}
        
        console.log('[MOTION] Auto-enabled based on device capability');
    }
    
    // Disable motion effects
    function disableMotion() {
        document.body.classList.remove('motion-enabled');
        document.body.classList.add('motion-reduced');
        
        if (window.particleSystem && typeof window.particleSystem.stop === 'function') {
            window.particleSystem.stop();
        }
        
        document.documentElement.style.setProperty('--motion-enabled', '0');
        
        console.log('[MOTION] Disabled - device prefers reduced motion');
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        if (shouldEnableMotion()) {
            enableMotion();
        } else {
            disableMotion();
        }
        
        // Listen for preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                disableMotion();
            } else {
                enableMotion();
            }
        });
    }
})();
```

### CSS to Hide Motion Button

```css
/* ═══════════════════════════════════════════════════════════════════════════
   HIDE MOTION EFFECTS BUTTON
   Motion is now auto-detected - no need for user permission
   ═══════════════════════════════════════════════════════════════════════════ */

.enable-motion-button,
#enableMotionEffects,
.motion-permission-prompt,
.motion-enable-container,
[class*="enable-motion"],
button[onclick*="enableMotion"],
.motion-toggle-btn {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

/* Hide MOTION indicator on mobile only */
@media (max-width: 768px) {
    .motion-indicator,
    .motion-status,
    [class*="motion-indicator"],
    [class*="motion-status"],
    span:contains("MOTION") {
        display: none !important;
    }
}

/* CSS variable for conditional animations */
:root {
    --motion-enabled: 0;
}

.motion-enabled {
    --motion-enabled: 1;
}

/* Only animate if motion is enabled */
.animated-element {
    animation-play-state: var(--motion-enabled) ? running : paused;
}
```

---

## Part 2: Enhanced Hero Section

### The Hook Formula
**Credibility + Intrigue + Stakes + Proof = Irresistible**

### Enhanced HTML Structure

```html
<!-- ═══════════════════════════════════════════════════════════════════════════
     HERO SECTION - THE OPENING STATEMENT
     First impression. Make it count.
     ═══════════════════════════════════════════════════════════════════════════ -->

<section class="hero" id="hero">
    
    <!-- Credibility Badge - Above the Fold -->
    <div class="hero__credibility-banner">
        <div class="hero__verified-badge">
            <span class="verified-pulse"></span>
            <span class="verified-icon">✓</span>
            <span class="verified-text">PREDICTION VERIFIED</span>
            <span class="verified-date">JAN 7, 2026 · BBC NEWS</span>
        </div>
    </div>
    
    <!-- Main Hero Content -->
    <div class="hero__content">
        
        <!-- Book Cover with Particle Effect -->
        <div class="hero__book-container">
            <div class="hero__book-glow"></div>
            <img 
                src="/images/book-cover.webp" 
                alt="Infinite Architects by Michael Darius Eastwood"
                class="hero__book-cover"
                loading="eager"
                fetchpriority="high"
            >
            <div class="hero__book-reflection"></div>
        </div>
        
        <!-- Title Block -->
        <div class="hero__title-block">
            <h1 class="hero__title">
                <span class="hero__title-line hero__title-line--1">INFINITE</span>
                <span class="hero__title-line hero__title-line--2">ARCHITECTS</span>
            </h1>
            <p class="hero__subtitle">Intelligence, Recursion, and the Creation of Everything</p>
            <p class="hero__author">
                <span class="hero__author-by">by</span>
                <span class="hero__author-name">Michael Darius Eastwood</span>
            </p>
        </div>
        
    </div>
    
    <!-- THE RECEIPTS - The Killer Feature -->
    <div class="hero__receipts" id="theReceipts">
        <h2 class="hero__receipts-title">THE RECEIPTS</h2>
        
        <div class="hero__receipts-comparison">
            
            <!-- Book Quote -->
            <div class="hero__receipt hero__receipt--book">
                <div class="hero__receipt-source">
                    <span class="hero__receipt-icon">📖</span>
                    <span class="hero__receipt-label">Book · Jan 2, 2026</span>
                </div>
                <blockquote class="hero__receipt-quote">
                    "...practical quantum computing within approximately <strong class="highlight-gold">five years</strong>"
                </blockquote>
            </div>
            
            <!-- Timeline Connector -->
            <div class="hero__timeline-connector">
                <span class="hero__timeline-days">5</span>
                <span class="hero__timeline-label">DAYS</span>
            </div>
            
            <!-- BBC Quote -->
            <div class="hero__receipt hero__receipt--bbc">
                <div class="hero__receipt-source">
                    <span class="hero__receipt-icon">📺</span>
                    <span class="hero__receipt-label">BBC · Jan 7, 2026</span>
                </div>
                <blockquote class="hero__receipt-quote">
                    "Within the next <strong class="highlight-gold">five years</strong> we could see..."
                </blockquote>
            </div>
            
        </div>
        
        <div class="hero__verified-badge-large">
            <span class="verified-checkmark">✓</span>
            <span class="verified-text">VERIFIED BY BBC NEWS</span>
        </div>
        
    </div>
    
    <!-- CTA Section -->
    <div class="hero__cta-section">
        <a href="#get-book" class="hero__cta-primary">
            <span class="hero__cta-text">Get Your Copy</span>
            <span class="hero__cta-arrow">→</span>
        </a>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="hero__scroll-indicator">
        <span class="hero__scroll-text">EXPLORE THE FRAMEWORK</span>
        <div class="hero__scroll-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"/>
            </svg>
        </div>
    </div>
    
</section>
```

### Enhanced Hero CSS

```css
/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION - MAXIMUM IMPACT
   Every element serves the conversion goal
   ═══════════════════════════════════════════════════════════════════════════ */

.hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px 40px;
    position: relative;
    background: 
        radial-gradient(ellipse at center, rgba(212, 168, 75, 0.06) 0%, transparent 60%),
        var(--void);
}

/* Credibility Banner - Above the Fold */
.hero__credibility-banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 14px 20px;
    background: linear-gradient(180deg, rgba(0, 40, 20, 0.4) 0%, transparent 100%);
    display: flex;
    justify-content: center;
    z-index: 10;
}

.hero__verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(0, 50, 30, 0.6);
    border: 1px solid rgba(74, 222, 128, 0.4);
    border-radius: 100px;
    animation: badgePulse 3s ease-in-out infinite;
}

@keyframes badgePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.2); }
    50% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
}

.verified-pulse {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
}

.verified-icon {
    font-size: 1rem;
    color: #4ade80;
}

.verified-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem;
    color: #4ade80;
    letter-spacing: 0.12em;
    font-weight: 600;
}

.verified-date {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(74, 222, 128, 0.7);
    letter-spacing: 0.08em;
}

/* Book Container */
.hero__book-container {
    position: relative;
    margin: 30px 0;
}

.hero__book-glow {
    position: absolute;
    inset: -30px;
    background: radial-gradient(ellipse at center, rgba(212, 168, 75, 0.25) 0%, transparent 70%);
    filter: blur(40px);
    animation: bookGlow 4s ease-in-out infinite;
}

@keyframes bookGlow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
}

.hero__book-cover {
    width: 280px;
    max-width: 65vw;
    height: auto;
    border-radius: 6px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(212, 168, 75, 0.2);
    position: relative;
    z-index: 2;
}

/* Title Block */
.hero__title-block {
    text-align: center;
    margin: 20px 0;
}

.hero__title {
    font-family: 'Cinzel', serif;
    font-weight: 400;
    margin: 0;
}

.hero__title-line {
    display: block;
}

.hero__title-line--1 {
    font-size: clamp(2.2rem, 8vw, 4rem);
    color: var(--gold);
    letter-spacing: 0.25em;
}

.hero__title-line--2 {
    font-size: clamp(1.6rem, 6vw, 2.8rem);
    color: var(--cream);
    letter-spacing: 0.3em;
    margin-top: 5px;
}

.hero__subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 3.5vw, 1.35rem);
    font-style: italic;
    color: rgba(240, 235, 227, 0.7);
    margin: 18px 0 12px;
    line-height: 1.4;
}

.hero__author {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
}

.hero__author-by {
    color: rgba(240, 235, 227, 0.4);
}

.hero__author-name {
    color: var(--gold);
    font-weight: 600;
}

/* THE RECEIPTS - Make it DRAMATIC */
.hero__receipts {
    width: 100%;
    max-width: 600px;
    margin: 35px 0;
    padding: 28px 22px;
    background: linear-gradient(135deg, rgba(10, 15, 25, 0.9) 0%, rgba(5, 10, 18, 0.95) 100%);
    border: 1px solid rgba(212, 168, 75, 0.25);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
}

.hero__receipts::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.hero__receipts-title {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    color: rgba(240, 235, 227, 0.5);
    letter-spacing: 0.2em;
    text-align: center;
    margin: 0 0 22px;
}

.hero__receipts-comparison {
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: center;
}

.hero__receipt {
    width: 100%;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
}

.hero__receipt-source {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.hero__receipt-icon {
    font-size: 1.1rem;
}

.hero__receipt-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    color: rgba(240, 235, 227, 0.6);
    letter-spacing: 0.08em;
}

.hero__receipt-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-style: italic;
    color: rgba(240, 235, 227, 0.85);
    margin: 0;
    line-height: 1.5;
    padding-left: 14px;
    border-left: 2px solid rgba(212, 168, 75, 0.3);
}

.highlight-gold {
    color: var(--gold);
    font-weight: 600;
    font-style: normal;
}

/* Timeline Connector - THE DRAMATIC MOMENT */
.hero__timeline-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 18px 0;
    position: relative;
}

.hero__timeline-connector::before,
.hero__timeline-connector::after {
    content: '';
    width: 2px;
    height: 20px;
    background: linear-gradient(to bottom, rgba(212, 168, 75, 0.3), var(--gold), rgba(212, 168, 75, 0.3));
}

.hero__timeline-days {
    font-family: 'Cinzel', serif;
    font-size: 2.2rem;
    color: var(--gold);
    font-weight: 600;
    line-height: 1;
}

.hero__timeline-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(240, 235, 227, 0.5);
    letter-spacing: 0.15em;
    margin-top: 2px;
}

/* Verified Badge Large */
.hero__verified-badge-large {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    padding: 12px 24px;
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.35);
    border-radius: 100px;
}

.hero__verified-badge-large .verified-checkmark {
    color: #4ade80;
    font-size: 1rem;
}

.hero__verified-badge-large .verified-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    color: #4ade80;
    letter-spacing: 0.1em;
    font-weight: 600;
}

/* CTA Section */
.hero__cta-section {
    margin: 30px 0;
}

.hero__cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 40px;
    background: linear-gradient(135deg, #d4a84b 0%, #a67c35 100%);
    color: var(--void);
    font-family: 'Space Mono', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-decoration: none;
    border-radius: 100px;
    box-shadow:
        0 4px 20px rgba(212, 168, 75, 0.35),
        0 0 0 0 rgba(212, 168, 75, 0.3);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero__cta-primary:hover {
    transform: translateY(-3px);
    box-shadow:
        0 8px 30px rgba(212, 168, 75, 0.45),
        0 0 0 6px rgba(212, 168, 75, 0.1);
}

.hero__cta-arrow {
    transition: transform 0.3s ease;
}

.hero__cta-primary:hover .hero__cta-arrow {
    transform: translateX(4px);
}

/* Scroll Indicator - Compelling */
.hero__scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    animation: scrollBounce 2.5s ease-in-out infinite;
}

@keyframes scrollBounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
}

.hero__scroll-text {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    color: rgba(240, 235, 227, 0.4);
    letter-spacing: 0.15em;
}

.hero__scroll-arrow {
    width: 24px;
    height: 24px;
    color: var(--gold);
    opacity: 0.6;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
    .hero {
        padding: 50px 16px 60px;
        min-height: 100svh;
    }
    
    .hero__credibility-banner {
        padding: 10px 12px;
    }
    
    .hero__verified-badge {
        padding: 8px 14px;
        gap: 8px;
    }
    
    .verified-text {
        font-size: 0.65rem;
    }
    
    .verified-date {
        font-size: 0.6rem;
    }
    
    .hero__book-cover {
        width: 220px;
    }
    
    .hero__receipts {
        padding: 22px 16px;
        margin: 28px 0;
    }
    
    .hero__receipt {
        padding: 14px 12px;
    }
    
    .hero__receipt-quote {
        font-size: 0.98rem;
    }
    
    .hero__timeline-days {
        font-size: 1.8rem;
    }
    
    .hero__cta-primary {
        padding: 16px 32px;
        font-size: 0.8rem;
    }
    
    .hero__scroll-indicator {
        bottom: 20px;
    }
    
    .hero__scroll-text {
        font-size: 0.62rem;
    }
}

/* Small phones */
@media (max-width: 375px) {
    .hero__title-line--1 {
        font-size: 1.9rem;
    }
    
    .hero__title-line--2 {
        font-size: 1.4rem;
    }
    
    .hero__subtitle {
        font-size: 0.95rem;
    }
    
    .hero__book-cover {
        width: 200px;
    }
}
```

---

## Part 3: Mobile "MOTION" Indicator Removal

### CSS to Remove MOTION Indicator on Mobile

```css
/* ═══════════════════════════════════════════════════════════════════════════
   REMOVE MOTION INDICATOR ON MOBILE
   The indicator competes with credibility markers above the fold
   Desktop can keep it - mobile removes it
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
    /* Target all possible variations of motion indicator */
    .motion-indicator,
    .motion-status,
    .motion-badge,
    [class*="motion-indicator"],
    [class*="motion-status"],
    .enable-motion-label,
    
    /* Right side floating indicators */
    .hero .motion-indicator,
    .accordion .motion-indicator,
    [class*="accordion"] .motion-indicator,
    
    /* Any element containing "MOTION" text in specific contexts */
    .indicator-text:contains('MOTION'),
    
    /* Gold dot + MOTION pattern */
    .motion-indicator-container,
    .motion-label-wrapper {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
    }
}

/* Keep desktop version visible but subtle */
@media (min-width: 769px) {
    .motion-indicator {
        position: fixed;
        bottom: 20px;
        left: 20px;
        font-family: 'Space Mono', monospace;
        font-size: 0.6rem;
        color: rgba(240, 235, 227, 0.3);
        letter-spacing: 0.12em;
        z-index: 50;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .motion-indicator::before {
        content: '';
        width: 6px;
        height: 6px;
        background: var(--gold);
        border-radius: 50%;
        opacity: 0.6;
    }
}
```

---

## Part 4: Enhanced Scroll Incentive

### Replace "EXPLORE" with Compelling Alternative

```html
<!-- Option A: Question-based -->
<div class="hero__scroll-indicator">
    <span class="hero__scroll-text">WHAT IF THE CREATOR IS AHEAD OF US?</span>
    <div class="hero__scroll-arrow">↓</div>
</div>

<!-- Option B: Stakes-based -->
<div class="hero__scroll-indicator">
    <span class="hero__scroll-text">THE WINDOW CLOSES SOON</span>
    <div class="hero__scroll-arrow">↓</div>
</div>

<!-- Option C: Evidence-based (RECOMMENDED) -->
<div class="hero__scroll-indicator">
    <span class="hero__scroll-text">SEE THE FULL FRAMEWORK</span>
    <div class="hero__scroll-subtext">37 original concepts · 114K words</div>
    <div class="hero__scroll-arrow">↓</div>
</div>
```

### Supporting CSS for Option C

```css
.hero__scroll-subtext {
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem;
    color: rgba(212, 168, 75, 0.5);
    letter-spacing: 0.1em;
    margin-top: 4px;
}

@media (max-width: 768px) {
    .hero__scroll-subtext {
        font-size: 0.58rem;
    }
}
```

---

## Part 5: JavaScript to Find and Remove Motion Button

```javascript
/**
 * MOTION BUTTON REMOVAL SCRIPT
 * Runs immediately to prevent flash of unwanted content
 * Safe to run multiple times
 */
(function removeMotionButton() {
    'use strict';
    
    // Selectors to target
    const motionButtonSelectors = [
        '.enable-motion-button',
        '#enableMotionEffects',
        '.motion-permission-prompt',
        '.motion-enable-container',
        '[class*="enable-motion"]',
        'button[onclick*="enableMotion"]',
        'button[onclick*="motion"]',
        '.motion-toggle-btn',
        // Add any additional selectors found in the actual HTML
    ];
    
    // Selectors for mobile MOTION indicator
    const motionIndicatorSelectors = [
        '.motion-indicator',
        '.motion-status',
        '[class*="motion-indicator"]',
        '[class*="motion-status"]',
        '.motion-badge'
    ];
    
    function hideElements(selectors, onlyMobile = false) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (onlyMobile && window.innerWidth > 768) return;
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.setAttribute('aria-hidden', 'true');
            });
        });
    }
    
    // Run immediately
    hideElements(motionButtonSelectors);
    hideElements(motionIndicatorSelectors, true);
    
    // Run again after DOM content loaded (catches late-rendered elements)
    document.addEventListener('DOMContentLoaded', () => {
        hideElements(motionButtonSelectors);
        hideElements(motionIndicatorSelectors, true);
    });
    
    // Run once more after full page load
    window.addEventListener('load', () => {
        hideElements(motionButtonSelectors);
        hideElements(motionIndicatorSelectors, true);
    });
    
    // Use MutationObserver for dynamically added elements
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) shouldCheck = true;
        });
        if (shouldCheck) {
            hideElements(motionButtonSelectors);
            hideElements(motionIndicatorSelectors, true);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
```

---

## Implementation Checklist

### Critical (Do First)
- [ ] Add auto-motion detection script to head
- [ ] Add CSS to hide motion button globally
- [ ] Add CSS to hide MOTION indicator on mobile
- [ ] Run removal script to catch dynamically added elements

### High Priority
- [ ] Update hero HTML structure
- [ ] Add enhanced hero CSS
- [ ] Update scroll indicator text
- [ ] Test on mobile devices

### Verification
- [ ] Motion button no longer visible anywhere
- [ ] MOTION indicator hidden on mobile, visible on desktop
- [ ] Motion effects still work (auto-enabled)
- [ ] Hero looks premium and compelling
- [ ] Scroll indicator is more engaging
- [ ] No console errors
- [ ] Performance maintained

---

## Rollback

If any issues occur:

```css
/* Quick rollback - show motion button again */
.enable-motion-button,
#enableMotionEffects {
    display: block !important;
    visibility: visible !important;
}
```

Or revert the specific commits in git.
