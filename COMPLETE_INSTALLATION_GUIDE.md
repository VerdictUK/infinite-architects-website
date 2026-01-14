# INFINITE ARCHITECTS - COMPLETE FIX PACKAGE
## Full Installation Instructions for Claude Code

---

## CURRENT STATE OF YOUR SITE

| Item | Status |
|------|--------|
| Tailwind CSS | ❌ NOT installed (demo file only, not on your site) |
| Nuclear Fix | ❌ NOT applied (you didn't implement it) |
| Safe Fix | ❌ NOT applied (you didn't implement it) |
| Your site | ✅ Original state with visibility bugs |

---

## WHAT YOU NEED

**ONE FILE**: `SURGICAL_FIX.css`

This file is already created and ready. It fixes the visibility issues while preserving 100% of your features.

---

## CLAUDE CODE INSTRUCTIONS

Copy and paste this ENTIRE prompt into Claude Code:

```
=== INFINITE ARCHITECTS VISIBILITY FIX ===

TASK: Fix hidden content from Part III onwards

STEP 1: Navigate to site directory
cd /path/to/infinite-architects-site

STEP 2: Backup sovereign.css
cp sovereign.css sovereign.css.backup

STEP 3: Append the surgical fix to the END of sovereign.css

Add the following CSS to the END of sovereign.css (after all existing content):

/* ═══════════════════════════════════════════════════════════════════════════════════════════
   INFINITE ARCHITECTS - SURGICAL VISIBILITY FIX
   Added: January 14, 2026
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

html {
    scroll-snap-type: none !important;
}

html.cinematic-ready,
body.cinematic-ready {
    scroll-snap-type: none !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.snap-section {
    min-height: auto !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    overflow-x: clip !important;
}

.ideas-grid {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.religion-inner {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.religion-section,
.religion-section.snap-section {
    min-height: auto !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.bbc-evidence-card,
.timeline-evidence-section .bbc-evidence-card {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.timeline-evidence-section,
.timeline-evidence-section.snap-section {
    min-height: auto !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.about-section,
.chokepoint-section,
.predictions-section,
.falsification-section,
.hrih-section,
.equation-section,
.expert-validation,
.evidence-locker,
.future-born-section,
.cta-section,
.carousel-section,
.prophecy-section,
.press-section {
    min-height: auto !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.predictions-grid,
.evidence-grid,
.expert-grid,
.falsification-grid,
.press-grid {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.about-inner,
.religion-inner,
.chokepoint-inner,
.predictions-inner,
.falsification-inner,
.hrih-inner,
.equation-inner,
.section-inner {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.chapter-gate {
    min-height: 40vh !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
}

.quote-breaker,
.quote-section {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

body.cinematic-ready .hero,
body.cinematic-ready .hero.snap-section {
    overflow: visible !important;
    overflow-x: clip !important;
    height: auto !important;
    max-height: none !important;
}

.idea-text,
.prediction-desc,
.evidence-desc {
    -webkit-line-clamp: unset !important;
    line-clamp: unset !important;
    display: block !important;
    max-height: none !important;
    overflow: visible !important;
}

body.cinematic-ready main,
body.cinematic-ready #main-content,
body.cinematic-ready .content {
    max-height: none !important;
    height: auto !important;
    overflow: visible !important;
}

.mandelbrot-bg,
.bbc-evidence-card__video,
[class*="-video-container"],
[class*="-bg-wrapper"] {
    overflow: hidden !important;
}

@media (max-width: 1024px) {
    .snap-section,
    section,
    [class*="-section"] {
        max-height: none !important;
        height: auto !important;
        overflow: visible !important;
    }
    
    [class*="-inner"],
    [class*="-grid"]:not(.loader-grid) {
        max-height: none !important;
        overflow: visible !important;
    }
}

@media (max-height: 700px) {
    .snap-section {
        max-height: none !important;
        overflow: visible !important;
    }
}

/* END SURGICAL FIX */

STEP 4: Deploy and test
- Push changes to your hosting (Netlify/Vercel/GitHub Pages)
- Test that intro animation still plays
- Verify all 6 parts are visible by scrolling through entire page

DO NOT:
- Modify index.html
- Modify sovereign-core.js
- Delete any existing CSS
- Add Tailwind (not needed)

VERIFICATION CHECKLIST:
□ Intro animation plays normally
□ Hero section fully visible after animation
□ Part I (The Mind) visible
□ Part II (37 Ideas grid) visible  
□ Part III (Philosophy/Religion) visible
□ Part IV (BBC Evidence) visible
□ Part V (Stakes) visible
□ Part VI (CTA) visible
□ Footer visible
□ No grey screen
□ No horizontal scrollbar
```

---

## ALTERNATIVE: Manual Installation

If you prefer to do it manually:

1. Open `sovereign.css` in your editor
2. Go to the END of the file (after line 9793)
3. Paste the CSS from the SURGICAL_FIX.css file
4. Save
5. Deploy

---

## IF SOMETHING BREAKS

Restore from backup:
```bash
cp sovereign.css.backup sovereign.css
```

---

## WHAT THIS FIX DOES

### Removes (bad constraints):
- `max-height: calc(100vh - X)` on content sections
- `scroll-snap-type: y mandatory` trapping
- `overflow: hidden` on content containers

### Preserves (your features):
- Cinematic loader (100%)
- All animations (100%)
- Book portal effects (100%)
- Film grain (100%)
- Everything else (100%)

---

## FILES SUMMARY

| File | Action | Location |
|------|--------|----------|
| SURGICAL_FIX.css | Append to sovereign.css | Already in outputs folder |
| sovereign.css | ADD fix to end | Your site |
| index.html | NO CHANGES | Your site |
| sovereign-core.js | NO CHANGES | Your site |

---

## THAT'S IT

One file. Append to end. Deploy. Done.
