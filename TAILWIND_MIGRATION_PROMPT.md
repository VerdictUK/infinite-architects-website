# INFINITE ARCHITECTS - Complete Tailwind CSS Migration Brief

## CONTEXT FOR EXTERNAL CLAUDE

You are rebuilding the CSS architecture for Infinite Architects (infinitearchitects.io), a premium book website for "Infinite Architects: Intelligence, Recursion, and the Creation of Everything" by Michael Darius Eastwood.

**Current State:** ~40,500 lines of inline HTML/CSS/JS with severe CSS specificity conflicts causing:
- Content hidden from Part III onwards (max-height + overflow:hidden conflicts)
- Hero content overflow issues
- Grey screen bugs when attempting fixes with !important overrides
- CSS rules fighting each other across ~26,000 lines of styles

**Goal:** Extract and restructure ALL CSS into Tailwind utility classes + minimal custom CSS, while preserving every single feature and animation.

---

## CRITICAL DESIGN TOKENS (DO NOT CHANGE)

```css
/* Primary Gold Palette (Sacred - DO NOT MODIFY) */
--gold-primary: #d4a84b;
--gold-bright: #f4c856;
--gold-pale: #e8d4a0;
--gold-dark: #8b6914;

/* Cosmic Void */
--void-deep: #02030a;
--void-mid: #04050c;
--void-surface: #0a0c14;

/* Nebula Accents */
--nebula-blue: #1a237e;
--nebula-purple: #4a148c;
--nebula-teal: #004d40;

/* Typography */
--font-display: 'Cinzel', serif;           /* Headlines */
--font-serif: 'Cormorant Garamond', serif; /* Body */
--font-mono: 'Space Mono', monospace;      /* Technical */
```

---

## COMPLETE SITE STRUCTURE (32 Sections)

```
1.  hero              - Cinematic intro with book cover, Mandelbrot video bg
2.  the-mind          - "The Mind That Could Not Open Post" intro
3.  origin            - Origin story / About the author
4.  methodology       - Scientific methodology explanation
5.  book              - Book showcase with 3D tesseract animation
6.  quote-carousel    - Horizontal infinite scroll quote carousel
7.  equation          - U=IxR² equation animation
8.  ideas             - 37 expandable concept cards grid
9.  evidence-locker   - Evidence presentation section
10. bbc-timeline      - BBC-style timeline visualization
11. predictions       - 10 prediction cards
12. falsification     - Falsification criteria cards
13. predictions-validated - Validated predictions showcase
14. hrih              - HRIH (Hyperspace Recursive Intelligence) section
15. religion          - Religious traditions as alignment research
16. chokepoint        - Semiconductor chokepoint infographic
17. window            - "Window" concept section
18. architecture      - Architecture overview
19. predictions-summary - Predictions summary
20. future-born       - "Future Born" conclusion
21. stakes            - Stakes/urgency section
22. expert-validation - Expert endorsements
23. reviews           - Reviews carousel
24. chapters          - Chapter breakdown with gates
25. comparison        - Comparison table
26. get-the-book      - Primary CTA section
27. cta               - Secondary CTA
28. newsletter        - Email capture (ConvertKit)
29. paradise          - Paradise/closing section
30. faq               - 11 FAQ accordion items
31. glossary          - Terms glossary with filter
32. ai-timeline       - AI development timeline
33. press             - Press/media section
```

---

## ALL INTERACTIVE COMPONENTS

### 1. Cinematic Loader (FROZEN - Exact Recreation Required)
- 250 wormhole particles with depth-based trails
- 4 orbital rings with 3D tilt
- 4 loading phases: "Awakening...", "Aligning...", "Converging...", "Emergence..."
- Film grain overlay
- Progress bar with glow
- Skip on click/keypress
- Must respect `prefers-reduced-motion`

### 2. Three.js Particle Network (Desktop Only)
- 400 golden particles with connections
- Lazy-loaded after first paint
- Falls back to static background on mobile
- Canvas ID: `#canvas-container`

### 3. 4D Tesseract Animation
- Rotating hypercube in About section
- CSS-only animation using transforms
- Class: `.tesseract-container`

### 4. Ask the Book AI Chat Widget
- Fixed position bottom-right
- Toggle button with pulse animation
- Chat interface with message history
- Typing indicators
- Pre-programmed responses for 100+ questions
- Fuzzy matching for queries
- Rate limiting (5 questions/10 mins)
- Easter eggs for special queries
- IDs: `#ask-book-widget`, `#ask-book-toggle`

### 5. 37 Expandable Concept Cards
- Grid layout with featured cards
- Click to expand modal with full explanation
- Image placeholders
- Share buttons per concept
- Classes: `.concept-item`, `.concept-expand-btn`
- Modal: `#concepts-modal-overlay`

### 6. Quote System (Multiple Types)
- `.quote-breaker` - Full-width quote breaks (24 instances)
- `.carousel-quote` - Horizontal carousel quotes (8 items)
- `.bq-block` - Blockquote styling
- Share buttons: Twitter, LinkedIn, Copy
- Quote download as image (canvas-based)

### 7. FAQ Accordion
- 11 FAQ items
- Expand/collapse with animation
- Class: `.faq-item`, `.faq-question`, `.faq-answer`

### 8. Chapter Navigation System
- 6 chapter gates with particle effects
- Part progress indicators (5 parts)
- Desktop sidebar navigation
- Mobile bottom nav bar
- Chapter intro cinematics (vignette + numeral reveal)
- IDs: `#chapterSidebar`, `#chapterNav`, `#chapterMenu`

### 9. Exit Intent Popup
- Triggers on mouse leave (desktop)
- 24-hour cooldown via localStorage
- Free chapter offer
- Close button + dismiss option
- ID: `#exit-intent-overlay`

### 10. Free Chapter Modal
- Email capture form
- ConvertKit integration (Form ID: 8970906)
- Success/error states
- ID: `#free-chapter-modal`

### 11. Newsletter Section
- Full email capture section
- ConvertKit integration
- Benefit list with icons

### 12. Cookie Consent Banner
- GDPR compliant
- Accept/Decline buttons
- Stores preference in localStorage
- ID: `#cookie-banner`

### 13. Mobile Sticky CTA
- Appears after scrolling past hero
- "Get the Book" button
- Price display
- ID: `#mobile-sticky-cta`

### 14. Reading Progress Bar
- Horizontal bar at top/bottom
- Updates on scroll
- ID: `#reading-progress`

### 15. Status Ticker Banner
- Green terminal-style ticker at top
- Scrolling messages
- 28px height (desktop), 24px (mobile)

### 16. Celebration/Milestone System
- Part completion toasts
- Confetti animation
- Progress tracking
- Welcome back system for returning visitors
- Functions: `triggerPartCelebration()`, `showPartToast()`

### 17. PWA Install Banner
- Detects standalone capability
- "Add to Home Screen" prompt
- Class: `.pwa-install-banner`

### 18. Glossary with Filter
- Alphabetical term listing
- Filter buttons
- ID: `#glossary`

### 19. BBC-Style Timeline
- Horizontal scrolling timeline
- Event markers
- Video embed support
- ID: `#bbc-timeline`

### 20. Predictions Cards
- 10 prediction items
- Evidence linking
- Validation status
- Class: `.prediction-card`

### 21. Evidence Cards
- Expandable evidence items
- Terminal-style presentation
- Class: `.evidence-card`

### 22. Review Cards
- Testimonial/review display
- Star ratings
- Class: `.review-card`

### 23. Comparison Table
- Format comparison (Kindle/Paperback/etc)
- Feature matrix
- ID: `#comparison`

---

## ALL CSS KEYFRAME ANIMATIONS (108 Total)

Must recreate ALL of these:

```
Core Animations:
- fadeIn, fadeInOut, fadeInScroll, fadeInImage
- heroReveal, pageEmerge, modalSlideIn, modalSpring
- pulse-gold, pulse-green, pulseGlow, pulseProgress
- shimmer, grain (film grain), twinkle

Loader Animations:
- loaderVideoFadeIn, loaderVideoZoom
- singularityGrow, singularityPulse
- cosmicPulse, cosmicZoom, cosmicZoomFull
- cosmicFadeOut, awakeningFadeOut
- awakeningTextFadeIn, awakeningTextPulse
- particlesAwaken, ringExpand

Book/Hero Animations:
- bookBreath, bookGlow, portalFloat, portalBurst
- titanDrop (book drop effect)
- impactFlash, impactShake
- goldBreath, lightSpeed

UI Animations:
- arrow-bounce, arrow-bounce-mobile, arrowPulse, scrollArrow
- buttonPulse, ctaGlow, ctaPulse
- hintBounce, hint-float, scroll-pulse
- swipeHint, swipeHintFade, swipeHintLeft, swipeHintRight
- toggleBounce, inputBreathe

Chapter/Navigation:
- chapterPulse, chapterToast, chapterToastDesktop
- gateParticle, numeralReveal, vignetteFlash
- pipPulse, methodPulse

Content Animations:
- conceptReveal, charShimmer
- quoteGlow, scrollCarousel
- confettiFall, celebrationEnter
- message-appear, typing-bounce
- errorShake, shake

Effects:
- tesseractSpin (4D rotation)
- nebulaPulse, neuralPulse, quantumPulse
- orbFloat, floatParticle, floatUp
- ripple, ripple-animation, ripple-effect, rippleEffect, rippleExpand
- touchRipple, edgePulseAnim
- drawLine, beamGrow, rayGrow

Status/Ticker:
- statusPulse, tickerDotPulse, tickerScroll
- livePulse, loadingPulse, urgencyPulse

Special:
- equationTriumph, scoreFill
- welcomeEnter, splashEnter, splashProgress
- skeletonShimmer, skeleton-shimmer
- tiltPhone, rotateLoop
- soundWave, plasmaDrop
- ask-book-pulse, badgePulse, bbc-pulse, editionPulse
- holoFloat, slideEnter, successPulse, uiEmphasisPulse
- overlayPulse, instructPulse, particleFly
```

---

## ALL DATA ATTRIBUTES (For JavaScript Hooks)

```html
data-action        - Track action type
data-category      - Analytics category
data-chapter       - Chapter number/ID
data-company       - Company reference (chokepoint)
data-concept       - Concept identifier (37 concepts)
data-current-part  - Current part tracker
data-delay         - Animation delay
data-filter        - Glossary filter category
data-form-type     - Form identification
data-index         - Item index
data-label         - Analytics label
data-lpignore      - LastPass ignore
data-model         - AI model reference
data-parallax      - Parallax multiplier
data-part          - Part number (1-5)
data-preload       - Preload priority
data-question      - Pre-set question
data-src-hq        - High quality image source
data-src-mobile    - Mobile image source
data-stagger-group - Animation stagger group
data-tooltip       - Tooltip content
data-tooltip-position - Tooltip placement
data-type          - Element type identifier
```

---

## JAVASCRIPT INTEGRATION POINTS

### External Libraries
```html
<script src="https://unpkg.com/three@0.128.0/build/three.min.js" defer></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
```

### Analytics (gtag)
```javascript
gtag('event', 'newsletter_signup', {...})
gtag('event', 'free_chapter_signup', {...})
gtag('event', 'app_installed', {...})
```

### Key JavaScript Functions to Preserve
```javascript
// Loader
initLoader(), completeLoader(), skipLoader()

// Navigation
initNavigation(), goToSection(), goToNext(), goToPrevious()
showChapterIntro(), triggerChapterCinematic()

// Animations
initMotionReveals(), initScrollAnimations(), initStaggerReveal()
initTesseract(), initEquationParticles()
initGyroParallax(), handleOrientation()

// Canvas
initMainCanvas(), drawNetwork(), updateConnections()
animateParticles(), createParticles()

// UI Components
initFAQAccordion(), initConceptsModal(), openModal(), closeModal()
initExitIntent(), triggerExitIntent(), closeExit()
initCookieConsent()
initMobileCTA(), updateStickyCTA()

// Progress Tracking
initReadingProgress(), updateProgress()
checkMilestones(), triggerPartCelebration(), showPartToast()
initWelcomeBackSystem(), showWelcomeBack()

// Chat Widget
toggleChat(), sendMessage(), addMessage(), getLocalAnswer()

// Sharing
shareOnTwitter(), shareOnLinkedIn(), copyQuote()
createSharePanel()

// Forms
captureEmail() - ConvertKit integration

// Effects
createConfetti(), createParticleBurst()
createScreenRipple(), triggerBalanceEffect()
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
@media (max-width: 480px)   /* Small mobile */
@media (max-width: 768px)   /* Tablet portrait */
@media (min-width: 769px)   /* Desktop */
@media (min-width: 1024px)  /* Large desktop */
@media (min-width: 1440px)  /* Extra large */
@media (max-height: 700px)  /* Short screens */
```

---

## ACCESSIBILITY REQUIREMENTS

- Skip link: `<a href="#main-content" class="skip-link">`
- Screen reader announcer: `<div id="sr-announcer" aria-live="polite">`
- Focus-visible styles on all interactive elements
- 44px minimum touch targets on mobile
- `prefers-reduced-motion` must disable all animations
- WCAG 2.1 AA contrast ratios
- Semantic HTML structure

---

## KNOWN ISSUES TO FIX

1. **Content Overflow** - Sections from Part III onwards hidden due to:
   - `max-height: calc(100vh - Xrem)` constraints
   - `overflow: hidden` on containers
   - Solution: Use Tailwind's `overflow-visible` and `h-auto`

2. **Hero Layout** - Two-column layout breaking on some viewports
   - Solution: Use Tailwind grid with proper breakpoints

3. **Scroll Snap Conflicts** - `scroll-snap-type: y mandatory` traps users
   - Solution: Use `scroll-snap-type: y proximity` or none

4. **Animation Timing** - `body.cinematic-ready` class triggers content reveal
   - Loader completion adds this class
   - All content must start hidden until this class exists

---

## DELIVERABLES REQUIRED

1. **tailwind.config.js** - Complete configuration with:
   - All custom colours from design tokens
   - Custom font families
   - Custom animations
   - Custom spacing scale if needed

2. **styles/base.css** - Tailwind imports + CSS custom properties

3. **styles/animations.css** - All 108 keyframe animations

4. **styles/components.css** - Component-specific styles that can't be Tailwind utilities

5. **index.html** - Restructured HTML with:
   - Tailwind utility classes
   - Preserved data attributes
   - Preserved IDs for JavaScript hooks
   - Clean, semantic structure

6. **Migration Guide** - Document mapping old classes to new Tailwind classes

---

## FILES PROVIDED

You will receive these files (MUST ALL BE PROVIDED):

### Core Files
1. **`index.html`** - Main website (40,464 lines) - Contains inline HTML/CSS/JS
2. **`CLAUDE.md`** - Project documentation and design tokens
3. **`TAILWIND_MIGRATION_PROMPT.md`** - This brief

### CSS Files (Reference for Extraction)
4. **`css/sovereign.css`** (278KB) - External CSS (may have duplicate rules with inline)
5. **`CONTENT_VISIBILITY_FIX.css`** - The fix that needs to be applied (Part III visibility)
6. **`HERO_OVERFLOW_FIX.css`** - Hero layout fixes
7. **`SURGICAL_FIX.css`** - Safe overflow fix pattern (respects body.cinematic-ready)

### JavaScript Files (DO NOT MODIFY - Reference Only)
8. **`js/sovereign-core.js`** (335KB) - Core JavaScript
9. **`js/enhancements.js`** (147KB) - Enhancement features
10. **`js/main.js`** (77KB) - Main functionality
11. **`js/slideshow.js`** (64KB) - Slideshow/carousel logic
12. **`js/sovereign-constitution.js`** (14KB) - Constitution/rules
13. **`js/mobile-wow.js`** (12KB) - Mobile effects
14. **`js/buy-bar.js`** (2KB) - Buy bar functionality

### API & Service Worker (DO NOT MODIFY)
15. **`api/ask-book.js`** (15KB) - Vercel serverless function for AI chat (uses 4-model council)
16. **`sw.js`** (15KB) - Service Worker for PWA offline support & caching

### Knowledge Base (AI Chat Data - DO NOT MODIFY)
17. **`knowledge/concepts.json`** (17KB) - 37 book concepts data
18. **`knowledge/chapters.json`** (13KB) - Chapter metadata
19. **`knowledge/quotes.json`** (10KB) - Shareable quotes
20. **`knowledge/faq.json`** (13KB) - Pre-computed FAQ responses
21. **`knowledge/evidence.json`** (8KB) - Evidence & citations

### Additional Pages (Need Same Styling)
22. **`presskit.html`** (40KB) - Press/media kit page - NEEDS TAILWIND MIGRATION TOO
23. **`linkinbio.html`** (16KB) - Social media link hub - NEEDS TAILWIND MIGRATION TOO
24. **`privacy.html`** (11KB) - Privacy policy page - NEEDS TAILWIND MIGRATION TOO
25. **`offline.html`** (9KB) - PWA offline fallback - NEEDS TAILWIND MIGRATION TOO

### Deployment & Config (CRITICAL)
26. **`vercel.json`** (2KB) - Vercel deployment config (headers, redirects)
27. **`package.json`** (1KB) - Node dependencies

### SEO & PWA Config
28. **`sitemap.xml`** (1KB) - SEO sitemap
29. **`robots.txt`** (315B) - Crawler rules
30. **`site.webmanifest`** (4KB) - PWA manifest (icons, theme, etc.)

### Knowledge Base - Book Chapters (AI Chat Context)
31-44. **`knowledge/book/*.md`** (14 files) - Full chapter content:
   - `00_prologue_intro.md` through `13_epilogue_afterword_glossary.md`

### Knowledge Base - Notes & Research
45. **`knowledge/notes/arc_deep_dive.md`** - ARC principle deep dive
46. **`knowledge/notes/author_story_legal_battle.md`** - Author background
47. **`knowledge/notes/eden_babylon_narrative.md`** - Eden/Babylon narrative
48. **`knowledge/research/37_original_concepts.md`** - All 37 concepts detail
49. **`knowledge/research/four_companies_chokepoint.md`** - Chokepoint research

### Assets (Reference - Don't Modify)
50. **`images/`** folder (27 webp files ~3.6MB total) - Optimized images
51. **`videos/`** folder (~80MB) - BBC clips, hero portal video, etc.

### File Paths
```
/Users/michaeleastwood/infinite-architects-ultimate-website/
├── index.html                     # MAIN - Primary migration target
├── presskit.html                  # SECONDARY - Also needs Tailwind
├── linkinbio.html                 # SECONDARY - Also needs Tailwind
├── privacy.html                   # SECONDARY - Also needs Tailwind
├── offline.html                   # SECONDARY - PWA offline page
├── CLAUDE.md
├── TAILWIND_MIGRATION_PROMPT.md
├── vercel.json                    # CRITICAL - Deployment config
├── package.json                   # CRITICAL - Dependencies
├── sw.js                          # Service Worker (PWA)
├── site.webmanifest               # PWA manifest
├── sitemap.xml                    # SEO
├── robots.txt                     # Crawlers
├── CONTENT_VISIBILITY_FIX.css
├── HERO_OVERFLOW_FIX.css
├── SURGICAL_FIX.css
├── css/
│   └── sovereign.css
├── js/
│   ├── sovereign-core.js
│   ├── enhancements.js
│   ├── main.js
│   ├── slideshow.js
│   ├── sovereign-constitution.js
│   ├── mobile-wow.js
│   └── buy-bar.js
├── api/
│   └── ask-book.js                # Vercel AI Chat Function
├── knowledge/
│   ├── concepts.json              # 37 concepts
│   ├── chapters.json              # Chapter data
│   ├── quotes.json                # Shareable quotes
│   ├── faq.json                   # Pre-computed FAQs
│   ├── evidence.json              # Evidence data
│   ├── carousel-quotes.md         # Quote carousel content
│   ├── book/                      # 14 chapter markdown files
│   │   ├── 00_prologue_intro.md
│   │   ├── 01_seeds_of_creation.md
│   │   ├── ... (12 more)
│   │   └── 13_epilogue_afterword_glossary.md
│   ├── notes/                     # Background context
│   │   ├── arc_deep_dive.md
│   │   ├── author_story_legal_battle.md
│   │   └── eden_babylon_narrative.md
│   └── research/                  # Research docs
│       ├── 37_original_concepts.md
│       └── four_companies_chokepoint.md
├── images/                        # 27 optimized webp images
│   ├── book-cover.webp
│   ├── author-photo.webp
│   ├── bbc-willow.webp
│   └── ... (24 more)
└── videos/                        # Video assets
    ├── bbc_all_clips.mp4
    ├── bbc_clip_1-5.mp4
    └── london-night.mp4
```

---

## SUCCESS CRITERIA

1. ALL 32 sections render correctly on desktop and mobile
2. ALL 108 animations work identically to original
3. ALL interactive components function (chat, modals, accordions, etc.)
4. Content from Part III onwards is VISIBLE (the main bug to fix)
5. Hero section displays without overflow issues
6. Lighthouse scores: Performance 90+, Accessibility 95+
7. Zero console errors
8. `prefers-reduced-motion` respected
9. All analytics events fire correctly
10. Newsletter/forms submit to ConvertKit

---

## APPROACH RECOMMENDATION

1. **Phase 1: Audit** - Map all existing classes to Tailwind equivalents
2. **Phase 2: Config** - Build complete tailwind.config.js
3. **Phase 3: Base** - Create base styles with animations
4. **Phase 4: Sections** - Convert section by section, testing each
5. **Phase 5: Components** - Handle interactive components
6. **Phase 6: Polish** - Responsive testing and fixes
7. **Phase 7: Validation** - Full checklist verification

---

## CRITICAL WARNINGS

1. **DO NOT** remove any animations - they are integral to the premium feel
2. **DO NOT** change the gold colour palette - it's sacred
3. **DO NOT** break the loader animation sequence
4. **DO NOT** remove any JavaScript hooks (data attributes, IDs)
5. **PRESERVE** the `body.cinematic-ready` pattern
6. **TEST** on real mobile devices, not just DevTools

---

*This document represents a complete audit of the Infinite Architects website.*
*Every feature, animation, and component has been catalogued.*
*The goal is a clean, maintainable Tailwind implementation that fixes all current issues.*
