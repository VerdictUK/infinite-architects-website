# INFINITE ARCHITECTS - Complete Tailwind CSS Migration Brief

---

## ⚡ EXECUTIVE SUMMARY (READ THIS FIRST)

**You are fixing a premium book website that has CSS specificity hell.**

### The Problem in One Sentence:
Content from Part III onwards is HIDDEN because of `max-height: calc(100vh - X)` and `overflow: hidden` rules scattered across 26,000 lines of CSS that fight each other.

### Your Mission:
1. Convert all CSS to Tailwind utility classes
2. Keep animations in a separate `@layer effects` block
3. **FIX THE VISIBILITY BUG** - All 32 sections must be scrollable and visible
4. Preserve every JavaScript hook (IDs, data attributes, class names JS references)

### The Critical Pattern to Understand:
```css
/* CURRENT BROKEN PATTERN (causes hidden content): */
.snap-section {
    max-height: calc(100vh - 14rem);
    overflow: hidden;
}

/* WHAT TAILWIND SHOULD PRODUCE: */
<section class="min-h-screen h-auto overflow-visible">
```

### The Animation Timing Pattern:
```
1. Page loads → Loader shows (content hidden via opacity: 0)
2. Loader completes → body gets class "cinematic-ready"
3. body.cinematic-ready triggers → content fades in via CSS transitions

⚠️ DO NOT force opacity: 1 or visibility: visible on elements!
⚠️ The reveal animations DEPEND on content starting hidden!
```

---

## 🎯 PRIORITY ORDER (What to Fix First)

### P0 - MUST FIX (The whole point of this migration)
1. **Content Visibility** - All 32 sections scrollable, nothing clipped
2. **Hero Layout** - Two-column on desktop, stacked on mobile
3. **Preserve Loader** - Must work exactly as before (controls reveal)

### P1 - HIGH PRIORITY
4. All 108 keyframe animations working
5. All interactive components functional (chat, modals, FAQ accordion)
6. Mobile responsiveness at 375px, 768px, 1024px

### P2 - MEDIUM PRIORITY
7. Secondary pages (presskit, linkinbio, privacy, offline)
8. PWA functionality preserved
9. SEO meta tags and structured data intact

### P3 - POLISH
10. Performance optimization
11. Accessibility (already good, maintain it)

---

## CONTEXT FOR EXTERNAL CLAUDE

You are rebuilding the CSS architecture for Infinite Architects (infinitearchitects.io), a premium book website for "Infinite Architects: Intelligence, Recursion, and the Creation of Everything" by Michael Darius Eastwood.

**Current State:** ~40,500 lines of inline HTML/CSS/JS with severe CSS specificity conflicts causing:
- Content hidden from Part III onwards (max-height + overflow:hidden conflicts)
- Hero content overflow issues
- Grey screen bugs when attempting fixes with !important overrides
- CSS rules fighting each other across ~26,000 lines of styles

**Goal:** Extract and restructure ALL CSS into Tailwind utility classes + minimal custom CSS, while preserving every single feature and animation.

---

## 🇬🇧 UK ENGLISH REQUIREMENT (MANDATORY)

**ALL content must use British English spelling:**
- colour (not color)
- centre (not center)
- realise (not realize)
- programme (not program)
- behaviour (not behavior)
- organisation (not organization)
- analyse (not analyze)
- defence (not defense)
- favour (not favor)
- honour (not honor)

**Exception:** Code syntax (CSS properties, JavaScript) uses American spelling as per web standards.
- `color: #d4a84b;` ✓ (CSS standard)
- `text-center` ✓ (Tailwind class)
- But visible content: "The centre of..." ✓ (UK English)

---

## 🔍 SEO PRESERVATION (CRITICAL - 640+ Keywords)

**See file: `12_SEO_MASTER_DATA.md` for full details.**

### What MUST Be Preserved Exactly:

1. **JSON-LD Structured Data** (~100 lines in `<head>`)
   - Book schema with ISBN, ratings, offers
   - ScholarlyArticle for "Eastwood Equation"
   - Person schema for author
   - FAQPage schema (10 questions)
   - BreadcrumbList schema
   - `mentions` array (competitor authority hijacking)

2. **Meta Tags** (33 tags)
   - All Open Graph tags
   - All Twitter Card tags
   - Canonical URL
   - Description with keywords

3. **ARIA Labels with SEO Keywords**
   - Navigation elements have keyword-rich ARIA labels
   - Example: `aria-label="View the Eastwood Equation: The math of AI Alignment"`
   - DO NOT simplify these - they are intentional SEO

4. **Alt Text on Images** (Comparative Alt-Text Strategy)
   - Example: `alt="Infinite Architects: A successor to Bostrom's Superintelligence model"`
   - These are NOT just descriptions - they are SEO-optimized

5. **Keyword Clusters Embedded in Content:**
   - Eastwood Equation, U=IxR², Eden Protocol
   - Chokepoint Mechanism, HRIH Hypothesis
   - References to Bostrom, Harari, Tegmark, etc.

### The SEO Implementation Includes:
- 640+ keywords in semantic layer
- 6 JSON-LD schema blocks
- Competitor "mentions" hijacking
- ARIA-label keyword injection
- British English authority signals

**⚠️ DO NOT:**
- Remove or simplify JSON-LD
- Change alt text on images
- Remove ARIA labels
- Americanize spelling in content
- Remove keyword-rich descriptions

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

## THE ROOT CAUSE (Why This Migration is Needed)

### Pattern 1: Viewport Height Constraints
```css
/* Found 40+ times in the codebase: */
.section-inner {
    max-height: calc(100vh - var(--ticker-height) - var(--nav-height));
    overflow: hidden;
}
```
**Problem:** Content taller than viewport gets clipped.
**Tailwind Fix:** `h-auto overflow-visible`

### Pattern 2: Scroll Snap Strictness
```css
html {
    scroll-snap-type: y mandatory;
}
.snap-section {
    scroll-snap-align: start;
    height: 100vh;
}
```
**Problem:** Users get trapped in sections, can't scroll freely.
**Tailwind Fix:** `scroll-snap-type: y proximity` or remove entirely

### Pattern 3: Specificity Wars
```css
/* Same element targeted with conflicting rules: */
.ideas-grid { overflow: hidden; }           /* Line 1863 */
.ideas-grid { overflow: hidden !important; } /* Line 4521 */
.ideas-grid { overflow: visible; }          /* Line 8932 */
```
**Problem:** Can't predict which rule wins.
**Tailwind Fix:** Single source of truth via utility classes

### Pattern 4: Duplicate CSS Sources
```
index.html: 26,000+ lines of inline CSS
sovereign.css: 11,000+ lines of external CSS
```
**Problem:** Same selectors defined in both files, fighting.
**Tailwind Fix:** One CSS file with utilities + effects layer

---

## COMPLETE SITE STRUCTURE (32 Sections)

```
PART I: THE MIND
1.  hero              - Cinematic intro with book cover, Mandelbrot video bg
2.  the-mind          - "The Mind That Could Not Open Post" intro
3.  origin            - Origin story / About the author
4.  methodology       - Scientific methodology explanation

PART II: THE IDEAS
5.  book              - Book showcase with 3D tesseract animation
6.  quote-carousel    - Horizontal infinite scroll quote carousel
7.  equation          - U=IxR² equation animation
8.  ideas             - 37 expandable concept cards grid ⚠️ OFTEN CLIPPED

PART III: THE PHILOSOPHY ⚠️ HIDDEN CONTENT STARTS HERE
9.  evidence-locker   - Evidence presentation section
10. bbc-timeline      - BBC-style timeline visualization
11. predictions       - 10 prediction cards
12. falsification     - Falsification criteria cards
13. predictions-validated - Validated predictions showcase
14. hrih              - HRIH (Hyperspace Recursive Intelligence) section
15. religion          - Religious traditions as alignment research ⚠️ TWO-COLUMN LAYOUT

PART IV: THE STAKES
16. chokepoint        - Semiconductor chokepoint infographic
17. window            - "Window" concept section
18. architecture      - Architecture overview
19. predictions-summary - Predictions summary

PART V: THE CALL
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
- **CRITICAL:** Adds `body.cinematic-ready` class when complete

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

Must recreate ALL of these in `@layer effects`:

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

## ALL DATA ATTRIBUTES (JavaScript Hooks - MUST PRESERVE)

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

### External Libraries (Keep these)
```html
<script src="https://unpkg.com/three@0.128.0/build/three.min.js" defer></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer></script>
```

### Analytics (gtag events to preserve)
```javascript
gtag('event', 'newsletter_signup', {...})
gtag('event', 'free_chapter_signup', {...})
gtag('event', 'app_installed', {...})
```

### Key JavaScript Functions (These reference CSS classes)
```javascript
// Loader - controls body.cinematic-ready
initLoader(), completeLoader(), skipLoader()

// Navigation - references section IDs
initNavigation(), goToSection(), goToNext(), goToPrevious()
showChapterIntro(), triggerChapterCinematic()

// Animations - reference class names
initMotionReveals() // looks for .reveal classes
initScrollAnimations()
initStaggerReveal() // looks for data-stagger-group

// UI Components - reference IDs and classes
initFAQAccordion() // .faq-item, .faq-question, .faq-answer
initConceptsModal() // .concept-expand-btn, #concepts-modal-overlay
initExitIntent() // #exit-intent-overlay
initCookieConsent() // #cookie-banner
initMobileCTA() // #mobile-sticky-cta

// These class names MUST be preserved for JS:
.reveal, .reveal-delay-1 through .reveal-delay-5
.visible (added by JS on scroll)
.active (added to nav items)
.expanded (added to FAQ items)
.open (added to modals)
```

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile First - Match these exactly */
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

## TAILWIND CONFIG STRUCTURE

```javascript
// tailwind.config.js
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4a84b',
          bright: '#f4c856',
          pale: '#e8d4a0',
          dark: '#8b6914',
        },
        void: {
          deep: '#02030a',
          mid: '#04050c',
          surface: '#0a0c14',
        },
        nebula: {
          blue: '#1a237e',
          purple: '#4a148c',
          teal: '#004d40',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['Space Mono', 'monospace'],
      },
      // Add animation keyframes here
    },
  },
  plugins: [],
}
```

---

## CSS FILE STRUCTURE

```css
/* styles/main.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Layer 1: CSS Custom Properties */
@layer base {
  :root {
    --gold-primary: #d4a84b;
    /* ... all design tokens ... */
  }
}

/* Layer 2: Effects (Animations) - ISOLATED */
@layer effects {
  @keyframes titanDrop { /* ... */ }
  @keyframes fadeIn { /* ... */ }
  /* ... all 108 animations ... */

  /* Animation utility classes */
  .animate-titan-drop { animation: titanDrop 1.2s ease-out forwards; }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
}

/* Layer 3: Component overrides (minimal) */
@layer components {
  /* Only for complex components that can't be utilities */
  .loader { /* loader specific styles */ }
  .tesseract-container { /* 3D transform styles */ }
}
```

---

## DELIVERABLES REQUIRED

1. **tailwind.config.js** - Complete configuration with all design tokens

2. **styles/main.css** - Structure:
   - Tailwind directives
   - CSS custom properties in @layer base
   - All 108 animations in @layer effects
   - Minimal component overrides in @layer components

3. **index.html** - Restructured with:
   - Link to compiled Tailwind CSS
   - All inline `<style>` removed
   - Tailwind utility classes on elements
   - ALL IDs preserved
   - ALL data-* attributes preserved
   - ALL JavaScript unchanged

4. **Secondary pages** - Same treatment:
   - presskit.html
   - linkinbio.html
   - privacy.html
   - offline.html

5. **package.json** - Updated with Tailwind dependencies

---

## SUCCESS CRITERIA (Measurable)

### Must Pass (P0)
- [ ] Scroll from hero to footer without getting stuck
- [ ] All 32 section IDs reachable via `#section-id` anchor
- [ ] Ideas grid shows all 37 concept cards
- [ ] Religion section shows two-column layout on desktop
- [ ] No horizontal scrollbar on any viewport

### Should Pass (P1)
- [ ] Loader plays → body.cinematic-ready added → content reveals
- [ ] All 108 animations play (test: titanDrop, fadeIn, pulse-gold)
- [ ] FAQ accordion expands/collapses
- [ ] Ask the Book chat opens/closes
- [ ] Exit intent triggers on mouse leave
- [ ] Mobile sticky CTA appears after hero

### Nice to Pass (P2)
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] Lighthouse SEO: 100
- [ ] Zero console errors
- [ ] PWA installs correctly

### SEO Verification (P1)
- [ ] JSON-LD validates at schema.org/validator
- [ ] All 33 meta tags present
- [ ] Open Graph preview works (use opengraph.xyz)
- [ ] All image alt texts preserved
- [ ] All ARIA labels preserved
- [ ] British English spelling throughout content

---

## CRITICAL WARNINGS

1. **DO NOT** force `opacity: 1` or `visibility: visible` - breaks loader reveal
2. **DO NOT** remove any animation - they create the premium feel
3. **DO NOT** change the gold colour values - they are sacred
4. **DO NOT** remove IDs or data attributes - JavaScript needs them
5. **DO NOT** modify JavaScript - only CSS/HTML changes
6. **PRESERVE** the `body.cinematic-ready` pattern exactly
7. **TEST** on real mobile devices, not just DevTools
8. **DO NOT** touch JSON-LD structured data in `<head>` - 640+ SEO keywords
9. **DO NOT** simplify ARIA labels - they contain SEO keywords
10. **DO NOT** change image alt text - SEO-optimized comparative descriptions
11. **PRESERVE** all meta tags exactly as they are
12. **USE** British English for all visible content (colour, centre, realise)

---

## APPROACH RECOMMENDATION

### Phase 1: Setup (Do First)
1. Create tailwind.config.js with all design tokens
2. Create styles/main.css with @layer structure
3. Extract all @keyframes into @layer effects

### Phase 2: Core Sections (Main Fix)
4. Convert hero section - verify two-column layout
5. Convert ideas section - verify all 37 cards visible
6. Convert religion section - verify two-column layout
7. Test scroll through all 32 sections

### Phase 3: Components
8. Convert all modals/overlays
9. Convert navigation components
10. Convert forms and CTAs

### Phase 4: Secondary Pages
11. Apply same pattern to presskit, linkinbio, privacy, offline

### Phase 5: Validation
12. Run through all success criteria
13. Test on mobile (375px) and desktop (1440px)
14. Verify loader → reveal sequence

---

*This document represents a complete specification for the Tailwind migration.*
*The goal is clean, maintainable CSS that fixes all visibility bugs.*
*When in doubt, prioritize CONTENT VISIBILITY over visual perfection.*
