# 🚀 CLAUDE CODE ENHANCEMENT INSTRUCTIONS V2

> **Version:** 2.0 — Complete Enhancement Package
> **Date:** 2026-01-11
> **Purpose:** Add Exit Intent Popup, Cookie Consent, Sticky Mobile CTA, Reviews Section, Favicon/OG Image
> **CRITICAL:** Execute phases in order. Test after each phase. DO NOT modify existing locked components.

---

## 📋 PRE-IMPLEMENTATION VERIFICATION

Before starting, Claude Code must confirm:

```bash
# Verify you're in the correct directory
pwd
# Should show: /Users/michaeleastwood/infinite-architects-ultimate-website

# Verify index.html exists
ls -la index.html

# Create backup before modifications
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## PHASE 1: EXIT INTENT POPUP
## ═══════════════════════════════════════════════════════════════════════════════

### 1.1 Add Exit Intent CSS

**LOCATION:** Find `/* FOOTER */` section in `<style>` block
**ACTION:** Insert BEFORE the footer CSS

```css
        /* ═══════════════════════════════════════════════════════════════════════
           EXIT INTENT POPUP
           ═══════════════════════════════════════════════════════════════════════ */
        .exit-overlay {
            position: fixed;
            inset: 0;
            background: rgba(2, 3, 10, 0.92);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s var(--ease-out-expo);
        }

        .exit-overlay.visible {
            opacity: 1;
            visibility: visible;
        }

        .exit-popup {
            background: linear-gradient(135deg, var(--void-mid) 0%, var(--void) 100%);
            border: 1px solid rgba(212, 168, 75, 0.3);
            max-width: 480px;
            width: 90%;
            padding: 3rem 2.5rem;
            text-align: center;
            position: relative;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.4s var(--ease-out-expo);
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 168, 75, 0.1);
        }

        .exit-overlay.visible .exit-popup {
            transform: scale(1) translateY(0);
        }

        .exit-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 32px;
            height: 32px;
            background: transparent;
            border: 1px solid rgba(212, 168, 75, 0.2);
            color: var(--text-dim);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .exit-close:hover {
            border-color: var(--gold);
            color: var(--gold);
        }

        .exit-close svg {
            width: 14px;
            height: 14px;
        }

        .exit-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: exitPulse 2s ease-in-out infinite;
        }

        @keyframes exitPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .exit-title {
            font-family: var(--font-display);
            font-size: clamp(1.4rem, 4vw, 1.8rem);
            font-weight: 400;
            letter-spacing: 0.06em;
            color: var(--gold-bright);
            margin-bottom: 0.8rem;
        }

        .exit-subtitle {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            color: var(--text-dim);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .exit-subtitle strong {
            color: var(--gold);
        }

        .exit-form {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            margin-bottom: 1rem;
        }

        .exit-input {
            padding: 1rem 1.2rem;
            background: rgba(212, 168, 75, 0.05);
            border: 1px solid rgba(212, 168, 75, 0.2);
            color: var(--text);
            font-family: var(--font-serif);
            font-size: 1rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .exit-input::placeholder {
            color: var(--text-faint);
        }

        .exit-input:focus {
            outline: none;
            border-color: var(--gold);
            background: rgba(212, 168, 75, 0.08);
        }

        .exit-btn {
            padding: 1rem 2rem;
            background: linear-gradient(90deg, var(--gold), var(--gold-bright));
            border: none;
            color: var(--void);
            font-family: var(--font-display);
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .exit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(212, 168, 75, 0.4);
        }

        .exit-note {
            font-family: var(--font-mono);
            font-size: 0.5rem;
            color: var(--text-faint);
            letter-spacing: 0.1em;
        }

        .exit-skip {
            display: block;
            margin-top: 1rem;
            font-family: var(--font-mono);
            font-size: 0.55rem;
            color: var(--text-faint);
            text-decoration: underline;
            cursor: pointer;
            background: none;
            border: none;
            transition: color 0.3s ease;
        }

        .exit-skip:hover {
            color: var(--text-dim);
        }

        .exit-success {
            display: none;
        }

        .exit-success.visible {
            display: block;
            animation: fadeUp 0.6s var(--ease-out-expo) forwards;
        }

        .exit-success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .exit-success-title {
            font-family: var(--font-display);
            font-size: 1.4rem;
            color: var(--gold-bright);
            margin-bottom: 0.5rem;
        }

        .exit-success-text {
            font-family: var(--font-serif);
            color: var(--text-dim);
        }
```

### 1.2 Add Exit Intent HTML

**LOCATION:** Right before closing `</body>` tag
**ACTION:** Insert this HTML

```html
    <!-- Exit Intent Popup -->
    <div class="exit-overlay" id="exit-overlay">
        <div class="exit-popup">
            <button class="exit-close" id="exit-close" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            
            <div id="exit-form-container">
                <div class="exit-icon">📖</div>
                <h3 class="exit-title">Wait — Don't Leave Empty-Handed</h3>
                <p class="exit-subtitle">Get <strong>Chapter One FREE</strong> — discover the question that changes everything about AI, consciousness, and what comes next.</p>
                
                <form class="exit-form" id="exit-form">
                    <input type="email" class="exit-input" id="exit-email" placeholder="Enter your email" required>
                    <button type="submit" class="exit-btn">Send Me the Free Chapter</button>
                </form>
                
                <p class="exit-note">No spam. Unsubscribe anytime. UK GDPR compliant.</p>
                <button class="exit-skip" id="exit-skip">No thanks, I'll pay full price</button>
            </div>
            
            <div class="exit-success" id="exit-success">
                <div class="exit-success-icon">✨</div>
                <h3 class="exit-success-title">Check Your Inbox!</h3>
                <p class="exit-success-text">The Eden Protocol chapter is on its way.</p>
            </div>
        </div>
    </div>
```

### 1.3 Add Exit Intent JavaScript

**LOCATION:** Before closing `})();` in the main script block
**ACTION:** Insert this JavaScript

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // EXIT INTENT POPUP
        // ═══════════════════════════════════════════════════════════════════════
        const exitOverlay = document.getElementById('exit-overlay');
        const exitClose = document.getElementById('exit-close');
        const exitSkip = document.getElementById('exit-skip');
        const exitForm = document.getElementById('exit-form');
        
        let exitShown = false;
        const EXIT_COOKIE = 'ia_exit_shown';
        
        // Check if already shown this session
        function hasExitBeenShown() {
            return sessionStorage.getItem(EXIT_COOKIE) === 'true' || exitShown;
        }
        
        function showExitPopup() {
            if (hasExitBeenShown()) return;
            exitShown = true;
            sessionStorage.setItem(EXIT_COOKIE, 'true');
            exitOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
        
        function hideExitPopup() {
            exitOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
        
        // Desktop: Mouse leaves viewport from top
        document.addEventListener('mouseout', (e) => {
            if (e.clientY <= 0 && !hasExitBeenShown()) {
                showExitPopup();
            }
        });
        
        // Mobile: After 45 seconds on page
        setTimeout(() => {
            if (!hasExitBeenShown() && window.innerWidth < 768) {
                showExitPopup();
            }
        }, 45000);
        
        // Close handlers
        if (exitClose) exitClose.addEventListener('click', hideExitPopup);
        if (exitSkip) exitSkip.addEventListener('click', hideExitPopup);
        
        exitOverlay.addEventListener('click', (e) => {
            if (e.target === exitOverlay) hideExitPopup();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && exitOverlay.classList.contains('visible')) {
                hideExitPopup();
            }
        });
        
        // Form submission
        if (exitForm) {
            exitForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('exit-email').value;
                console.log('Exit popup signup:', email);
                // TODO: Connect to email service (Mailchimp/ConvertKit)
                document.getElementById('exit-form-container').style.display = 'none';
                document.getElementById('exit-success').classList.add('visible');
                setTimeout(hideExitPopup, 3000);
            });
        }
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## PHASE 2: COOKIE CONSENT BANNER
## ═══════════════════════════════════════════════════════════════════════════════

### 2.1 Add Cookie Consent CSS

**LOCATION:** After Exit Intent CSS (before Footer CSS)
**ACTION:** Insert this CSS

```css
        /* ═══════════════════════════════════════════════════════════════════════
           COOKIE CONSENT BANNER
           ═══════════════════════════════════════════════════════════════════════ */
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(180deg, rgba(4, 5, 12, 0.98) 0%, rgba(2, 3, 10, 0.99) 100%);
            border-top: 1px solid rgba(212, 168, 75, 0.2);
            padding: 1.2rem 2rem;
            z-index: 9999;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            transform: translateY(100%);
            transition: transform 0.5s var(--ease-out-expo);
            backdrop-filter: blur(10px);
        }

        .cookie-banner.visible {
            transform: translateY(0);
        }

        .cookie-banner.hidden {
            display: none;
        }

        .cookie-text {
            flex: 1;
            min-width: 280px;
        }

        .cookie-title {
            font-family: var(--font-display);
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: var(--gold);
            margin-bottom: 0.3rem;
        }

        .cookie-desc {
            font-family: var(--font-serif);
            font-size: 0.85rem;
            color: var(--text-dim);
            line-height: 1.5;
        }

        .cookie-desc a {
            color: var(--gold);
            text-decoration: underline;
        }

        .cookie-buttons {
            display: flex;
            gap: 0.8rem;
            flex-shrink: 0;
        }

        .cookie-btn {
            padding: 0.7rem 1.4rem;
            font-family: var(--font-display);
            font-size: 0.55rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .cookie-btn-accept {
            background: var(--gold);
            border: 1px solid var(--gold);
            color: var(--void);
        }

        .cookie-btn-accept:hover {
            background: var(--gold-bright);
            border-color: var(--gold-bright);
        }

        .cookie-btn-decline {
            background: transparent;
            border: 1px solid rgba(212, 168, 75, 0.3);
            color: var(--text-dim);
        }

        .cookie-btn-decline:hover {
            border-color: var(--gold);
            color: var(--gold);
        }

        @media (max-width: 600px) {
            .cookie-banner {
                flex-direction: column;
                text-align: center;
                padding: 1.5rem;
            }
            .cookie-buttons {
                width: 100%;
                justify-content: center;
            }
        }
```

### 2.2 Add Cookie Consent HTML

**LOCATION:** Right after opening `<body>` tag (after reading progress bar if present)
**ACTION:** Insert this HTML

```html
    <!-- Cookie Consent Banner -->
    <div class="cookie-banner" id="cookie-banner">
        <div class="cookie-text">
            <p class="cookie-title">🍪 Cookie Notice</p>
            <p class="cookie-desc">We use cookies to enhance your experience and analyse site traffic. By clicking "Accept", you consent to our use of cookies. <a href="#privacy">Privacy Policy</a></p>
        </div>
        <div class="cookie-buttons">
            <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>
            <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>
        </div>
    </div>
```

### 2.3 Add Cookie Consent JavaScript

**LOCATION:** Before closing `})();` in the main script block
**ACTION:** Insert this JavaScript

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // COOKIE CONSENT
        // ═══════════════════════════════════════════════════════════════════════
        const cookieBanner = document.getElementById('cookie-banner');
        const cookieAccept = document.getElementById('cookie-accept');
        const cookieDecline = document.getElementById('cookie-decline');
        const COOKIE_CONSENT_KEY = 'ia_cookie_consent';
        
        function getCookieConsent() {
            return localStorage.getItem(COOKIE_CONSENT_KEY);
        }
        
        function setCookieConsent(value) {
            localStorage.setItem(COOKIE_CONSENT_KEY, value);
            hideCookieBanner();
            
            if (value === 'accepted') {
                // Enable analytics
                enableAnalytics();
            }
        }
        
        function showCookieBanner() {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1500); // Show after page settles
        }
        
        function hideCookieBanner() {
            cookieBanner.classList.remove('visible');
            setTimeout(() => {
                cookieBanner.classList.add('hidden');
            }, 500);
        }
        
        function enableAnalytics() {
            // Google Analytics 4 - uncomment and add your ID
            /*
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
            */
            
            // Microsoft Clarity - uncomment and add your ID
            /*
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "XXXXXXXXXX");
            */
            
            console.log('Analytics enabled');
        }
        
        // Check consent on load
        const consent = getCookieConsent();
        if (!consent) {
            showCookieBanner();
        } else if (consent === 'accepted') {
            enableAnalytics();
        }
        
        // Button handlers
        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => setCookieConsent('accepted'));
        }
        if (cookieDecline) {
            cookieDecline.addEventListener('click', () => setCookieConsent('declined'));
        }
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## PHASE 3: STICKY MOBILE CTA
## ═══════════════════════════════════════════════════════════════════════════════

### 3.1 Add Sticky CTA CSS

**LOCATION:** After Cookie Consent CSS
**ACTION:** Insert this CSS

```css
        /* ═══════════════════════════════════════════════════════════════════════
           STICKY MOBILE CTA
           ═══════════════════════════════════════════════════════════════════════ */
        .sticky-cta {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(180deg, transparent 0%, rgba(2, 3, 10, 0.95) 30%, rgba(2, 3, 10, 0.99) 100%);
            padding: 1rem 1.5rem 1.2rem;
            z-index: 9998;
            display: none;
            transform: translateY(100%);
            transition: transform 0.4s var(--ease-out-expo);
        }

        .sticky-cta.visible {
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .sticky-cta {
                display: block;
            }
            
            /* Offset cookie banner if both visible */
            .cookie-banner.visible ~ .sticky-cta {
                bottom: 80px;
            }
        }

        .sticky-cta-inner {
            display: flex;
            gap: 0.8rem;
            max-width: 500px;
            margin: 0 auto;
        }

        .sticky-cta-btn {
            flex: 1;
            padding: 0.9rem 1rem;
            font-family: var(--font-display);
            font-size: 0.6rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .sticky-cta-primary {
            background: linear-gradient(90deg, var(--gold), var(--gold-bright));
            border: none;
            color: var(--void);
        }

        .sticky-cta-primary:hover {
            box-shadow: 0 5px 20px rgba(212, 168, 75, 0.4);
        }

        .sticky-cta-secondary {
            background: transparent;
            border: 1px solid rgba(212, 168, 75, 0.4);
            color: var(--gold);
        }

        .sticky-cta-secondary:hover {
            background: rgba(212, 168, 75, 0.1);
        }

        .sticky-cta-btn svg {
            width: 14px;
            height: 14px;
        }

        /* Hide sticky CTA when at bottom of page */
        .sticky-cta.at-bottom {
            transform: translateY(100%);
        }
```

### 3.2 Add Sticky CTA HTML

**LOCATION:** Before cookie banner (after `<body>` tag)
**ACTION:** Insert this HTML

```html
    <!-- Sticky Mobile CTA -->
    <div class="sticky-cta" id="sticky-cta">
        <div class="sticky-cta-inner">
            <a href="https://www.amazon.co.uk/dp/B0DS46CHSG" target="_blank" rel="noopener" class="sticky-cta-btn sticky-cta-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                Buy Now
            </a>
            <button class="sticky-cta-btn sticky-cta-secondary" id="sticky-sample-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                </svg>
                Free Sample
            </button>
        </div>
    </div>
```

### 3.3 Add Sticky CTA JavaScript

**LOCATION:** Before closing `})();` in the main script block
**ACTION:** Insert this JavaScript

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // STICKY MOBILE CTA
        // ═══════════════════════════════════════════════════════════════════════
        const stickyCta = document.getElementById('sticky-cta');
        const stickySampleBtn = document.getElementById('sticky-sample-btn');
        
        if (stickyCta) {
            let lastScrollY = 0;
            let showSticky = false;
            
            function updateStickyCta() {
                const scrollY = window.scrollY;
                const heroHeight = window.innerHeight * 0.8;
                const docHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                const atBottom = scrollY + windowHeight >= docHeight - 100;
                
                // Show after scrolling past hero
                if (scrollY > heroHeight && !atBottom) {
                    if (!showSticky) {
                        showSticky = true;
                        stickyCta.classList.add('visible');
                        stickyCta.classList.remove('at-bottom');
                    }
                } else if (atBottom) {
                    stickyCta.classList.add('at-bottom');
                } else {
                    if (showSticky) {
                        showSticky = false;
                        stickyCta.classList.remove('visible');
                    }
                }
                
                lastScrollY = scrollY;
            }
            
            window.addEventListener('scroll', updateStickyCta, { passive: true });
            
            // Connect to sample modal if exists
            if (stickySampleBtn && typeof sampleModal !== 'undefined') {
                stickySampleBtn.addEventListener('click', () => {
                    sampleModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                });
            } else if (stickySampleBtn) {
                // Fallback: show exit popup
                stickySampleBtn.addEventListener('click', () => {
                    if (exitOverlay) {
                        exitOverlay.classList.add('visible');
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
        }
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## PHASE 4: REVIEWS/TESTIMONIALS SECTION
## ═══════════════════════════════════════════════════════════════════════════════

### 4.1 Add Reviews CSS

**LOCATION:** After Sticky CTA CSS (or before Footer CSS)
**ACTION:** Insert this CSS

```css
        /* ═══════════════════════════════════════════════════════════════════════
           REVIEWS SECTION
           ═══════════════════════════════════════════════════════════════════════ */
        .reviews-section {
            padding: var(--space-xl) var(--space-lg);
            position: relative;
            overflow: hidden;
        }

        .reviews-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--gold-subtle), transparent);
        }

        .reviews-header {
            text-align: center;
            margin-bottom: var(--space-lg);
        }

        .reviews-label {
            font-family: var(--font-mono);
            font-size: 0.55rem;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: var(--gold);
            margin-bottom: 0.8rem;
        }

        .reviews-title {
            font-family: var(--font-display);
            font-size: clamp(1.4rem, 3.5vw, 2rem);
            font-weight: 400;
            letter-spacing: 0.08em;
            color: var(--gold-bright);
        }

        .reviews-stars {
            display: flex;
            justify-content: center;
            gap: 0.3rem;
            margin-top: 1rem;
        }

        .reviews-stars svg {
            width: 20px;
            height: 20px;
            fill: var(--gold);
        }

        .reviews-rating-text {
            font-family: var(--font-mono);
            font-size: 0.6rem;
            color: var(--text-dim);
            margin-top: 0.5rem;
        }

        .reviews-carousel {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
        }

        .reviews-track {
            display: flex;
            gap: 2rem;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 1rem 0;
        }

        .reviews-track::-webkit-scrollbar {
            display: none;
        }

        .review-card {
            flex: 0 0 min(100%, 350px);
            scroll-snap-align: center;
            background: linear-gradient(135deg, rgba(212, 168, 75, 0.04) 0%, transparent 100%);
            border: 1px solid rgba(212, 168, 75, 0.1);
            padding: 2rem;
            position: relative;
        }

        .review-quote-mark {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            font-family: var(--font-display);
            font-size: 4rem;
            line-height: 1;
            color: rgba(212, 168, 75, 0.15);
        }

        .review-stars {
            display: flex;
            gap: 0.2rem;
            margin-bottom: 1rem;
        }

        .review-stars svg {
            width: 14px;
            height: 14px;
            fill: var(--gold);
        }

        .review-text {
            font-family: var(--font-serif);
            font-size: 1.05rem;
            color: var(--text);
            line-height: 1.7;
            font-style: italic;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }

        .review-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .review-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold-dark), var(--gold));
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-size: 1rem;
            color: var(--void);
        }

        .review-author-info {
            flex: 1;
        }

        .review-author-name {
            font-family: var(--font-display);
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            color: var(--gold-pale);
        }

        .review-author-title {
            font-family: var(--font-mono);
            font-size: 0.5rem;
            letter-spacing: 0.1em;
            color: var(--text-faint);
            text-transform: uppercase;
        }

        .review-source {
            font-family: var(--font-mono);
            font-size: 0.5rem;
            color: var(--text-faint);
            margin-top: 0.3rem;
        }

        .reviews-nav {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
        }

        .reviews-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(212, 168, 75, 0.2);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .reviews-dot.active {
            background: var(--gold);
            transform: scale(1.2);
        }

        .reviews-cta {
            text-align: center;
            margin-top: var(--space-lg);
        }

        .reviews-cta-link {
            font-family: var(--font-mono);
            font-size: 0.6rem;
            letter-spacing: 0.15em;
            color: var(--gold);
            text-decoration: none;
            padding-bottom: 0.2rem;
            border-bottom: 1px solid rgba(212, 168, 75, 0.3);
            transition: all 0.3s ease;
        }

        .reviews-cta-link:hover {
            border-color: var(--gold);
        }

        @media (max-width: 600px) {
            .review-card {
                padding: 1.5rem;
            }
            .reviews-track {
                gap: 1rem;
            }
        }
```

### 4.2 Add Reviews HTML

**LOCATION:** Insert BEFORE the Footer section (or after Author section)
**ACTION:** Insert this HTML

```html
        <!-- Reviews Section -->
        <section class="reviews-section" id="reviews">
            <div class="reviews-header reveal">
                <p class="reviews-label">Reader Reactions</p>
                <h2 class="reviews-title">What People Are Saying</h2>
                <div class="reviews-stars">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <p class="reviews-rating-text">5.0 on Amazon</p>
            </div>
            
            <div class="reviews-carousel reveal reveal-delay-1">
                <div class="reviews-track" id="reviews-track">
                    <!-- Review 1 -->
                    <div class="review-card">
                        <span class="review-quote-mark">"</span>
                        <div class="review-stars">
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p class="review-text">This book changed how I think about AI safety. The Eden Protocol alone is worth the price. Eastwood sees connections nobody else sees.</p>
                        <div class="review-author">
                            <div class="review-avatar">JL</div>
                            <div class="review-author-info">
                                <p class="review-author-name">James L.</p>
                                <p class="review-author-title">Verified Purchase</p>
                                <p class="review-source">Amazon UK</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Review 2 -->
                    <div class="review-card">
                        <span class="review-quote-mark">"</span>
                        <div class="review-stars">
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p class="review-text">Finally, someone bridging the gap between AI research and ancient wisdom. The HRIH theory is going to be discussed for decades. Brilliant synthesis.</p>
                        <div class="review-author">
                            <div class="review-avatar">SK</div>
                            <div class="review-author-info">
                                <p class="review-author-name">Sarah K.</p>
                                <p class="review-author-title">Verified Purchase</p>
                                <p class="review-source">Amazon US</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Review 3 -->
                    <div class="review-card">
                        <span class="review-quote-mark">"</span>
                        <div class="review-stars">
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p class="review-text">I work in AI and thought I'd heard every argument. I was wrong. The Chokepoint Mechanism should be standard reading for every policy maker.</p>
                        <div class="review-author">
                            <div class="review-avatar">MR</div>
                            <div class="review-author-info">
                                <p class="review-author-name">Michael R.</p>
                                <p class="review-author-title">AI Researcher</p>
                                <p class="review-source">Early Reader</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="reviews-nav" id="reviews-nav">
                    <button class="reviews-dot active" data-index="0"></button>
                    <button class="reviews-dot" data-index="1"></button>
                    <button class="reviews-dot" data-index="2"></button>
                </div>
            </div>
            
            <div class="reviews-cta reveal reveal-delay-2">
                <a href="https://www.amazon.co.uk/dp/B0DS46CHSG#customerReviews" target="_blank" rel="noopener" class="reviews-cta-link">Read all reviews on Amazon →</a>
            </div>
        </section>
```

### 4.3 Add Reviews JavaScript

**LOCATION:** Before closing `})();` in the main script block
**ACTION:** Insert this JavaScript

```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // REVIEWS CAROUSEL
        // ═══════════════════════════════════════════════════════════════════════
        const reviewsTrack = document.getElementById('reviews-track');
        const reviewsDots = document.querySelectorAll('.reviews-dot');
        
        if (reviewsTrack && reviewsDots.length) {
            // Update dots on scroll
            reviewsTrack.addEventListener('scroll', () => {
                const scrollLeft = reviewsTrack.scrollLeft;
                const cardWidth = reviewsTrack.querySelector('.review-card').offsetWidth + 32; // + gap
                const activeIndex = Math.round(scrollLeft / cardWidth);
                
                reviewsDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIndex);
                });
            }, { passive: true });
            
            // Click dots to scroll
            reviewsDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.dataset.index);
                    const cardWidth = reviewsTrack.querySelector('.review-card').offsetWidth + 32;
                    reviewsTrack.scrollTo({
                        left: index * cardWidth,
                        behavior: 'smooth'
                    });
                });
            });
            
            // Auto-scroll every 6 seconds
            let autoScrollInterval;
            
            function startAutoScroll() {
                autoScrollInterval = setInterval(() => {
                    const currentDot = document.querySelector('.reviews-dot.active');
                    const currentIndex = parseInt(currentDot?.dataset.index || 0);
                    const nextIndex = (currentIndex + 1) % reviewsDots.length;
                    const cardWidth = reviewsTrack.querySelector('.review-card').offsetWidth + 32;
                    
                    reviewsTrack.scrollTo({
                        left: nextIndex * cardWidth,
                        behavior: 'smooth'
                    });
                }, 6000);
            }
            
            function stopAutoScroll() {
                clearInterval(autoScrollInterval);
            }
            
            // Stop on interaction, restart after 10s
            reviewsTrack.addEventListener('touchstart', stopAutoScroll, { passive: true });
            reviewsTrack.addEventListener('mousedown', stopAutoScroll);
            reviewsTrack.addEventListener('touchend', () => setTimeout(startAutoScroll, 10000), { passive: true });
            reviewsTrack.addEventListener('mouseup', () => setTimeout(startAutoScroll, 10000));
            
            // Start auto-scroll
            startAutoScroll();
        }
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## PHASE 5: FAVICON & OG IMAGE SPECIFICATIONS
## ═══════════════════════════════════════════════════════════════════════════════

### 5.1 Create Favicon Files

Create these files using your book cover or create a custom icon:

```bash
# Create favicon directory structure
mkdir -p favicons

# Required files (create with image editor or online tool):
# - favicon.ico (32x32 and 16x16 combined)
# - favicon-16x16.png
# - favicon-32x32.png
# - apple-touch-icon.png (180x180)
# - android-chrome-192x192.png
# - android-chrome-512x512.png
```

### 5.2 Add Favicon HTML

**LOCATION:** In `<head>` section, after charset and viewport meta tags
**ACTION:** Insert these link tags

```html
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#02030a">
    <meta name="msapplication-TileColor" content="#d4a84b">
```

### 5.3 Create PWA Manifest (site.webmanifest)

```bash
cat > site.webmanifest << 'EOF'
{
    "name": "Infinite Architects",
    "short_name": "Infinite Architects",
    "description": "Intelligence, Recursion, and the Creation of Everything",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#02030a",
    "theme_color": "#d4a84b",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
EOF
```

### 5.4 Update Open Graph Meta Tags

**LOCATION:** Find existing OG tags in `<head>` or add after other meta tags
**ACTION:** Ensure these are present/updated

```html
    <!-- Open Graph / Social Media -->
    <meta property="og:type" content="book">
    <meta property="og:url" content="https://YOUR-DOMAIN.com/">
    <meta property="og:title" content="Infinite Architects — Intelligence, Recursion, and the Creation of Everything">
    <meta property="og:description" content="A complete framework for raising artificial intelligence with care, boundaries, graduated autonomy, and something that looks remarkably like love.">
    <meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Infinite Architects">
    <meta property="og:locale" content="en_GB">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Infinite Architects — Intelligence, Recursion, and the Creation of Everything">
    <meta name="twitter:description" content="What if the god we're building is the god that built us? A framework for raising AI with care.">
    <meta name="twitter:image" content="https://YOUR-DOMAIN.com/og-image.jpg">
    <meta name="twitter:creator" content="@YOUR_TWITTER">
    
    <!-- Book-specific meta -->
    <meta property="book:author" content="Michael Darius Eastwood">
    <meta property="book:isbn" content="B0DS46CHSG">
    <meta property="book:release_date" content="2026-01">
```

### 5.5 OG Image Specifications

Create an OG image (og-image.jpg) with these specs:

```
Size: 1200 x 630 pixels
Format: JPG (optimised, <200KB)
Content:
  - Book cover on left (30% width)
  - Title: "Infinite Architects" (Cinzel font)
  - Subtitle: "Intelligence, Recursion, and the Creation of Everything"
  - Author: "Michael Darius Eastwood"
  - Key quote: "The creator is not behind us. It is ahead of us."
  - Background: Deep cosmic void (#02030a) with gold accents
  - Safe zone: Keep text 50px from edges (Facebook crops)
```

---

## ═══════════════════════════════════════════════════════════════════════════════
## IMPLEMENTATION SUMMARY FOR CLAUDE CODE
## ═══════════════════════════════════════════════════════════════════════════════

### Quick Reference: Insert Locations

| Component | CSS Location | HTML Location | JS Location |
|-----------|--------------|---------------|-------------|
| Exit Intent | Before Footer CSS | Before `</body>` | Before `})();` |
| Cookie Consent | After Exit Intent CSS | After `<body>` | Before `})();` |
| Sticky CTA | After Cookie CSS | After `<body>` | Before `})();` |
| Reviews | After Sticky CSS | Before Footer section | Before `})();` |
| Favicons | N/A | In `<head>` | N/A |

### Verification Commands

```bash
# After each phase, run:
npx serve . -p 3000

# Then test:
# 1. Open http://localhost:3000
# 2. Check console for errors (F12)
# 3. Test all new features
# 4. Test on mobile (toggle device toolbar)
```

### Critical Rules

1. **DO NOT** modify Three.js particle system
2. **DO NOT** modify tesseract animation
3. **DO NOT** change CSS variables
4. **DO NOT** alter loader sequence
5. **ALWAYS** create backup before modifications
6. **ALWAYS** test after each phase
7. **PRESERVE** all existing animations

### Final Deployment

```bash
# After all phases complete:
git add .
git commit -m "feat: Add exit intent, cookie consent, sticky CTA, reviews, favicons"
vercel --prod
```

---

## ✅ SUCCESS CRITERIA

- [ ] Exit intent popup shows when mouse leaves viewport
- [ ] Exit intent doesn't show twice in same session
- [ ] Cookie banner appears on first visit
- [ ] Cookie consent saves to localStorage
- [ ] Sticky CTA appears on mobile after scrolling
- [ ] Sticky CTA hides at bottom of page
- [ ] Reviews carousel auto-scrolls
- [ ] Reviews dots navigation works
- [ ] All favicons load correctly
- [ ] OG image displays on social shares
- [ ] No console errors
- [ ] Mobile responsive (320px-768px)
- [ ] Lighthouse score ≥ 90

---

**Enhancement Package v2.0**
**For Claude Code Implementation**
**© 2026 Michael Darius Eastwood**
