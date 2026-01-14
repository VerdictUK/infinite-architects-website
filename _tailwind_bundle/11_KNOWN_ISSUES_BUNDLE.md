# INFINITE ARCHITECTS - KNOWN ISSUES & FIXES BUNDLE
These are the documented issues that need to be fixed in the Tailwind migration.

---

## COMPREHENSIVE VISUAL ISSUES ANALYSIS

# 🔍 COMPREHENSIVE VISUAL ISSUES ANALYSIS
## Website: Infinite Architects
## Date: 12 January 2026

---

# EXECUTIVE SUMMARY

After deep analysis of your 25,052-line index.html (plus supporting files), I've identified **18 categories of visual issues** causing the messy appearance. The root causes are:

1. **CSS Rule Conflicts** - 432 occurrences of key selectors with competing properties
2. **Duplicate Definitions** - CSS in both index.html AND main.css fighting each other
3. **Hidden Content** - 40+ instances of `overflow: hidden` still cutting things off
4. **Fixed Heights** - Several sections force 100vh which clips content
5. **Z-Index Chaos** - 60+ absolute/fixed positioned elements competing
6. **Flexbox Battles** - Multiple `justify-content` rules overriding each other
7. **Mobile/Desktop Confusion** - Breakpoints not consistently applied

---

# 📋 ISSUE CATALOG

## ISSUE 1: Ideas Section Content Clipped

**Location:** Lines 1831-1864
**Problem:** Fixed height forces content to be clipped

```css
/* THE PROBLEM - Line 1834-1836 */
.ideas-section .section-inner {
    height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 1.5rem);
    overflow: hidden; /* THIS CLIPS CONTENT */
}
```

**FIX:**
```css
.ideas-section .section-inner {
    min-height: auto;
    height: auto;
    overflow: visible;
}
```

---

## ISSUE 2: Ideas Grid Overflow Hidden

**Location:** Line 1863
**Problem:** Grid hides cards that don't fit

```css
/* THE PROBLEM */
.ideas-grid {
    overflow: hidden !important; /* CLIPS CARDS */
}
```

**FIX:**
```css
.ideas-grid {
    overflow: visible;
}

/* Mobile horizontal scroll */
@media (max-width: 768px) {
    .ideas-grid {
        overflow-x: auto;
        overflow-y: hidden;
    }
}
```

---

## ISSUE 3: Conflicting justify-content Rules

**Location:** Multiple locations (30+ instances)
**Problem:** Same selector has different `justify-content` values

```css
/* Line 1409: */ justify-content: center;
/* Line 1422: */ justify-content: center !important;
/* Line 1828: */ justify-content: flex-start !important;
/* Line 9076: */ justify-content: center !important;
```

**FIX:** Remove duplicate rules, keep only ONE per selector. Preference order:
1. `flex-start` for sections with headers (content at top)
2. `center` for sections with minimal centered content
3. Remove all `!important` flags

---

## ISSUE 4: Duplicate CSS Definitions

**Problem:** Variables and rules defined in BOTH files:

| File | :root Variables | Selector Count |
|------|-----------------|----------------|
| index.html | 200+ variables | 16,000+ lines |
| main.css | 70+ variables | 15,000+ lines |

**FIX:** Choose ONE source of truth:
- Keep ALL CSS in `main.css` (external file, cacheable)
- Remove inline `<style>` from index.html
- OR vice versa - but NOT both

---

## ISSUE 5: Z-Index Stacking Conflicts

**Problem:** 60+ elements with absolute/fixed positioning competing:

```css
/* Some z-index values found: */
z-index: 9997;
z-index: 10000;
z-index: 10001;
z-index: var(--z-loader); /* 900 */
z-index: calc(var(--z-loader) + 1); /* 901 */
z-index: var(--z-nav); /* 100 */
z-index: calc(var(--z-nav) + 10); /* 110 */
```

**FIX:** Establish clear z-index hierarchy:

```css
:root {
    --z-background: -1;
    --z-content: 1;
    --z-card: 10;
    --z-nav: 100;
    --z-modal: 500;
    --z-toast: 700;
    --z-loader: 900;
    --z-max: 9999;
}
```

Then audit every `z-index` to use these variables consistently.

---

## ISSUE 6: Hero Section Overlapping Elements

**Location:** Lines 1400-1700
**Problem:** Multiple positioned elements stack unpredictably

```css
.hero::after { z-index: 2; }
.mandelbrot-bg { z-index: 0; }
.hero-book { /* no z-index - inherits */ }
.hero-status-pill { /* might overlap book */ }
```

**FIX:**
```css
.hero {
    position: relative;
}

.mandelbrot-bg { z-index: 0; }
.hero-book-container { z-index: 2; }
.hero-content { z-index: 3; }
.hero::after { z-index: 1; } /* gradient overlay */
```

---

## ISSUE 7: Evidence Locker Still Clipped

**Location:** Lines 7280-7320
**Problem:** Still has height constraints

**FIX:**
```css
.evidence-locker.snap-section {
    height: auto;
    min-height: auto;
}

.evidence-locker-inner {
    height: auto;
    overflow: visible;
}

.evidence-locker .evidence-grid {
    max-height: none;
    overflow: visible;
}
```

---

## ISSUE 8: HRIH Section Background/Content Overlap

**Location:** Lines 9860-9920
**Problem:** Visual wrapper rules force absolute positioning

```css
/* THE PROBLEM - Lines 9862-9875 */
.hrih-visual-wrapper,
[class*="-visual-wrapper"] {
    position: absolute !important;
    top: 0 !important;
    /* ... forces full viewport coverage */
}
```

**FIX:** Don't force all visual wrappers to be absolute. Use specific selectors:

```css
/* Only apply to sections that NEED full-bleed backgrounds */
.hero .mandelbrot-bg,
.hrih-section .hrih-visual-wrapper {
    position: absolute;
    inset: 0;
}

/* DON'T apply to all [class*="-visual-wrapper"] */
```

---

## ISSUE 9: Religion Section Grid Broken

**Location:** Lines 9190-9210
**Problem:** Grid forces 2-column on all sizes

```css
.religion-section .religion-content {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    max-height: calc(100vh - ...) !important;
}
```

**FIX:**
```css
.religion-section .religion-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    /* NO max-height */
}

@media (max-width: 768px) {
    .religion-section .religion-content {
        grid-template-columns: 1fr; /* Stack on mobile */
    }
}
```

---

## ISSUE 10: Typography Size Conflicts

**Problem:** Same text elements have multiple font-size rules:

```css
/* Multiple rules for same element */
.section-title { font-size: clamp(1.3rem, 3vw, 2rem) !important; } /* Line 9057 */
.section-title { font-size: clamp(0.9rem, 3vw, 1.3rem) !important; } /* Line 9801 */
```

**FIX:** One font-size per selector. Use CSS cascade properly:

```css
/* Base */
.section-title {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
}

/* Compact sections */
.ideas-section .section-title,
.evidence-section .section-title {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
}

/* Mobile */
@media (max-width: 768px) {
    .section-title {
        font-size: clamp(1rem, 4vw, 1.5rem);
    }
}
```

---

## ISSUE 11: Carousel Section Visibility

**Location:** Lines 16778-16810
**Problem:** Carousel may be hidden or overlapped

**FIX:**
```css
.carousel-section {
    position: relative;
    z-index: 1;
    overflow: visible; /* Allow carousel to show */
}

.carousel-track {
    display: flex;
    gap: 3rem;
}
```

---

## ISSUE 12: BBC Evidence Card Layout

**Location:** Various
**Problem:** Video/content split broken on some screens

**FIX:**
```css
.bbc-evidence-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
}

@media (max-width: 900px) {
    .bbc-evidence-card {
        grid-template-columns: 1fr;
    }
}

.bbc-evidence-card__video {
    width: 100%;
    max-height: 50vh;
    object-fit: contain;
}
```

---

## ISSUE 13: Mobile Buy Bar Overlap

**Problem:** Buy bar may overlap footer content

**FIX:**
```css
.mobile-buy-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

/* Add padding to body when bar is visible */
body.buy-bar-visible {
    padding-bottom: 70px; /* Height of buy bar */
}
```

---

## ISSUE 14: Neural Canvas Blocking Content

**Location:** Line 16686
**Problem:** Canvas may intercept clicks/overlap text

**FIX:**
```css
.neural-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none; /* CRITICAL: Don't block clicks */
}

.section-inner {
    position: relative;
    z-index: 1; /* Above canvas */
}
```

---

## ISSUE 15: Quote Section Text Overflow

**Problem:** Long quotes may break layout

**FIX:**
```css
.quote-section blockquote {
    max-width: 90%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}
```

---

## ISSUE 16: Predictions Grid Clipped

**Location:** Lines 9138-9155
**Problem:** `overflow: hidden` and `max-height` clip cards

**FIX:**
```css
.predictions-section .predictions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    /* REMOVE: max-height */
    /* REMOVE: overflow: hidden */
}
```

---

## ISSUE 17: Falsification Section Layout

**Problem:** May not center properly

**FIX:**
```css
.falsification-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.falsification-content {
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
}
```

---

## ISSUE 18: Footer/CTA Section Spacing

**Problem:** Inconsistent bottom padding across sections

**FIX:**
```css
.snap-section:last-of-type {
    padding-bottom: 4rem;
}

@media (max-width: 768px) {
    .snap-section:last-of-type {
        padding-bottom: 6rem; /* Account for mobile buy bar */
    }
}
```

---

# 🔧 MASTER FIX STRATEGY

## Step 1: Consolidate CSS (HIGH PRIORITY)

Choose ONE location for all CSS:

**Option A:** External CSS file
```html
<link rel="stylesheet" href="styles/main.css">
```
- Remove all inline `<style>` from index.html
- Easier to maintain, cacheable

**Option B:** Inline CSS
- Remove main.css
- Keep everything in index.html
- Faster initial load (no extra request)

## Step 2: Remove All `overflow: hidden` from Sections

Run this command:
```bash
# Find all overflow: hidden in section contexts
grep -n "overflow.*hidden" index.html | grep -i "section\|inner\|grid\|content"
```

Then change each to `overflow: visible` unless specifically needed.

## Step 3: Remove Fixed Heights

Find and remove/change:
```css
height: 100vh;
height: calc(100vh - ...);
max-height: calc(100vh - ...);
```

Replace with:
```css
min-height: 100vh; /* Minimum, can expand */
height: auto;
```

## Step 4: Fix Z-Index Hierarchy

Establish this hierarchy:
```
0    - Background layers (canvas, video)
1    - Content
10   - Cards (on hover)
100  - Navigation
500  - Modals
900  - Loader
1000 - Buy bar / critical overlays
```

## Step 5: Remove Duplicate Rules

Search for `!important` and remove where possible:
```bash
grep -c "!important" index.html
# Currently: 200+ instances
# Target: < 20
```

## Step 6: Test Each Section Individually

For each section, verify:
- [ ] All content visible (not clipped)
- [ ] Responsive at 320px, 768px, 1024px, 1920px
- [ ] No overlapping elements
- [ ] Correct stacking order
- [ ] Clickable elements work

---

# 📱 MOBILE-SPECIFIC FIXES

## Add This CSS Block at End:

```css
/* MOBILE RESET - Clean slate for phones */
@media (max-width: 768px) {
    /* Remove all fixed heights */
    .snap-section,
    .section-inner,
    [class*="-inner"],
    [class*="-content"],
    [class*="-container"] {
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        overflow: visible !important;
    }
    
    /* Stack everything vertically */
    .snap-section {
        display: flex;
        flex-direction: column;
        padding: 100px 1rem 3rem;
    }
    
    /* Horizontal scroll for card grids */
    .ideas-grid,
    .evidence-grid,
    .predictions-grid {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        gap: 1rem;
        padding-bottom: 1rem;
    }
    
    .ideas-grid > *,
    .evidence-grid > *,
    .predictions-grid > * {
        flex: 0 0 85vw;
        min-width: 280px;
    }
    
    /* Ensure text doesn't overflow */
    h1, h2, h3, p {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
}
```

---

# ⚡ QUICK WINS (Implement First)

1. **Remove `overflow: hidden` from `.ideas-grid`** (Line 1863)
2. **Remove fixed height from `.ideas-section .section-inner`** (Line 1834)
3. **Add `pointer-events: none` to `.neural-canvas`**
4. **Remove `!important` from justify-content rules**
5. **Consolidate duplicate :root variables**

---

# 🎯 FOR CLAUDE CODE

Copy this instruction:

```
Please fix the following issues in index.html:

1. Line 1834-1836: Remove fixed height from .ideas-section .section-inner
   Change to: height: auto; overflow: visible;

2. Line 1863: Remove overflow: hidden from .ideas-grid
   Change to: overflow: visible;

3. Add pointer-events: none to .neural-canvas (around line 2090)

4. Remove all duplicate justify-content rules - keep only one per selector

5. Search for "max-height: calc(100vh" and remove all instances from section containers

6. Consolidate :root variables - remove duplicates between top of file and line 8000+

7. Add this mobile reset block at the end of the <style> section (before </style>):

@media (max-width: 768px) {
    .snap-section, .section-inner, [class*="-inner"], [class*="-content"] {
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        overflow: visible !important;
    }
}

After making changes, verify all sections display correctly at 375px and 1920px widths.
```

---

This comprehensive analysis identifies all major visual issues and provides actionable fixes. The site needs CSS consolidation and removal of conflicting rules to achieve a clean, professional appearance.

---

## SURGICAL FIX GUIDE (VIEWPORT)

# 🔬 SURGICAL FIX GUIDE FOR CLAUDE CODE
## Based on Screenshot Analysis - January 12, 2026

---

## 🔴 CRITICAL BUG #1: BROKEN IMAGES IN IDEAS GRID

**Screenshots Affected:** 5, 9  
**Symptom:** Alt text visible instead of images:
- "The Eastwood Equation: U = I × R²"
- "The ARC Principle - Ancient wisdom meets..."
- "The Eden Protocol visualization..."
- "The grand council of wisdom traditions"

### ROOT CAUSE:
Images referenced but not loading. Either:
1. Wrong file paths
2. Images not deployed to server
3. WebP format not supported

### SURGICAL FIX:

```css
/* Add fallback and error handling for images */
.idea-card__image {
    background-color: rgba(212, 168, 75, 0.1);
    background-image: linear-gradient(135deg, rgba(212, 168, 75, 0.05) 0%, transparent 50%);
}

.idea-card__image img {
    opacity: 1;
    transition: opacity 0.3s ease;
}

.idea-card__image img[src=""], 
.idea-card__image img:not([src]) {
    opacity: 0;
}
```

```javascript
// Add to initialization script - image error handler
document.querySelectorAll('.idea-card__image img').forEach(img => {
    img.onerror = function() {
        // Hide broken image, show gradient placeholder
        this.style.opacity = '0';
        this.parentElement.style.background = 'linear-gradient(135deg, rgba(212, 168, 75, 0.15) 0%, rgba(18, 18, 22, 0.9) 100%)';
        
        // Log for debugging
        console.warn('Image failed to load:', this.src);
    };
    
    // Force reload if already errored
    if (img.complete && img.naturalHeight === 0) {
        img.onerror();
    }
});
```

### CHECK THESE FILE PATHS:
```
images/pillar-1.webp      → Should show equation visual
images/pillar-2.webp      → Should show ARC principle  
images/pillar-3.webp      → Should show Eden Protocol
images/art-grand-council.webp → Should show wisdom traditions
```

---

## 🔴 CRITICAL BUG #2: SECTIONS NOT FITTING 100VH

**Screenshots Affected:** 1, 5, 6, 8, 9  
**Symptom:** Content extends beyond viewport, requiring scroll within snap sections

### MASTER CSS FIX - Add to root styles:

```css
/* ============================================
   VIEWPORT-FIT SNAP SECTIONS - NUCLEAR FIX
   ============================================ */

/* Force ALL snap sections to exactly 100vh */
.snap-section {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
    max-height: 100vh;
    max-height: 100dvh;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: calc(var(--nav-height, 80px) + 2rem) 2rem 2rem 2rem;
}

/* Content wrapper inside snap sections */
.snap-section > .section-content,
.snap-section > .container,
.snap-section > [class*="wrapper"] {
    max-height: calc(100vh - var(--nav-height, 80px) - 4rem);
    max-height: calc(100dvh - var(--nav-height, 80px) - 4rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Prevent content overflow */
.snap-section * {
    flex-shrink: 1;
}
```

---

## 🔧 SECTION-BY-SECTION VIEWPORT FIXES

### FIX 1: IDEAS GRID (Screenshots 1, 5)

**Problem:** 9 cards in 3x3 grid extends beyond viewport

```css
/* Ideas section - force viewport fit */
#ideas.snap-section,
.ideas-section.snap-section {
    padding: calc(var(--nav-height, 80px) + 1rem) 1.5rem 1rem;
}

.ideas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 1400px;
    /* CRITICAL: Constrain height to fit viewport */
    max-height: calc(100vh - var(--nav-height, 80px) - 8rem);
    max-height: calc(100dvh - var(--nav-height, 80px) - 8rem);
}

/* Scale down cards to fit */
.idea-card {
    padding: 1rem;
    min-height: 0; /* Allow shrinking */
}

.idea-card__number {
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1;
}

.idea-card__title {
    font-size: clamp(0.85rem, 1.2vw, 1.1rem);
    margin-bottom: 0.5rem;
}

.idea-card__description {
    font-size: clamp(0.7rem, 0.9vw, 0.85rem);
    line-height: 1.4;
    /* Clamp text to 3 lines max */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.idea-card__image {
    height: clamp(80px, 10vh, 140px);
    margin-bottom: 0.75rem;
}

/* Responsive: 2 columns on smaller screens */
@media (max-width: 1200px) {
    .ideas-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
}
```

---

### FIX 2: BBC EVIDENCE SECTION (Screenshot 6)

**Problem:** "How Long Do We Have?" section too tall

```css
/* BBC Evidence section viewport fit */
.bbc-evidence-section.snap-section,
[id*="timeline"].snap-section,
[id*="window"].snap-section {
    padding: calc(var(--nav-height, 80px) + 1rem) 2rem 1rem;
}

.bbc-evidence-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-height: calc(100vh - var(--nav-height, 80px) - 12rem);
    align-items: center;
}

.bbc-evidence-card__video {
    max-height: 45vh;
    border-radius: 12px;
    overflow: hidden;
}

.bbc-evidence-card__video video {
    width: 100%;
    height: auto;
    max-height: 45vh;
    object-fit: contain;
}

.bbc-evidence-card__quote-block {
    max-height: calc(100vh - var(--nav-height, 80px) - 16rem);
    overflow: hidden;
}

/* Scale typography */
.bbc-quote {
    font-size: clamp(1rem, 1.8vw, 1.3rem);
    line-height: 1.5;
}

.book-quote {
    font-size: clamp(0.85rem, 1.4vw, 1.1rem);
    line-height: 1.5;
}

/* Section header compact */
.section-label {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
}

.section-title {
    font-size: clamp(1.8rem, 4vw, 3rem);
    margin-bottom: 1rem;
}
```

---

### FIX 3: HRIH/ORIGIN THEORY SECTION (Screenshot 8)

**Problem:** Content + BBC video extends beyond viewport

```css
/* HRIH section viewport fit */
.hrih-section.snap-section,
#hrih.snap-section,
[id*="origin"].snap-section {
    padding: calc(var(--nav-height, 80px) + 1rem) 2rem 1rem;
}

/* Constrain the theory card */
.hrih-theory-card,
.origin-card {
    max-height: calc(60vh - var(--nav-height, 80px));
    padding: 1.5rem 2rem;
}

.hrih-acronym {
    font-size: clamp(1rem, 2vw, 1.5rem);
    gap: 1.5rem;
}

.hrih-description {
    font-size: clamp(0.9rem, 1.3vw, 1.1rem);
    margin: 1rem 0;
}

/* If BBC clip is in this section, make it smaller */
.hrih-section .bbc-evidence-card {
    max-height: 35vh;
    margin-top: 1rem;
}

.hrih-section .bbc-evidence-card__video {
    max-height: 25vh;
}
```

---

### FIX 4: 5,000 YEARS SECTION (Screenshot 9)

**Problem:** Empty space at bottom, image broken

```css
/* Alignment research section */
.alignment-section.snap-section,
#alignment.snap-section,
[id*="religion"].snap-section {
    padding: calc(var(--nav-height, 80px) + 2rem) 2rem 2rem;
    justify-content: flex-start;
    padding-top: calc(var(--nav-height, 80px) + 4rem);
}

.alignment-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    max-width: 1200px;
    width: 100%;
}

/* Fix the broken image */
.alignment-image,
.wisdom-image {
    width: 100%;
    max-height: 50vh;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.1) 0%, rgba(18, 18, 22, 0.8) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 84% stat styling */
.stat-large {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 200;
    color: var(--gold);
}
```

---

## 🔧 GLOBAL VIEWPORT SAFETY NET

Add this JavaScript to handle any edge cases:

```javascript
// ============================================
// VIEWPORT FIT ENFORCEMENT
// ============================================

(function enforceViewportFit() {
    const navHeight = 80; // Adjust to match your nav height
    const snapSections = document.querySelectorAll('.snap-section');
    
    function checkSectionHeight() {
        const viewportHeight = window.innerHeight;
        const maxContentHeight = viewportHeight - navHeight - 40; // 40px buffer
        
        snapSections.forEach(section => {
            const content = section.querySelector('.section-content, .container, [class*="wrapper"]');
            if (content) {
                const contentHeight = content.scrollHeight;
                
                if (contentHeight > maxContentHeight) {
                    // Content too tall - apply overflow handling
                    content.style.maxHeight = maxContentHeight + 'px';
                    content.style.overflow = 'hidden';
                    
                    // Log for debugging
                    console.warn('Section content overflow:', section.id || section.className, {
                        contentHeight,
                        maxAllowed: maxContentHeight
                    });
                }
            }
        });
    }
    
    // Run on load and resize
    window.addEventListener('load', checkSectionHeight);
    window.addEventListener('resize', debounce(checkSectionHeight, 250));
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();
```

---

## 🎯 IMPLEMENTATION ORDER FOR CLAUDE CODE

### Phase 1: Fix Broken Images (CRITICAL)
1. Check if image files exist in `/images/` directory
2. Verify file extensions (.webp vs .png vs .jpg)
3. Add image error handlers
4. Add gradient fallbacks

### Phase 2: Apply Viewport Constraints
1. Add master `.snap-section` CSS fixes
2. Apply section-specific height constraints
3. Test each section at different viewport sizes

### Phase 3: Typography Scaling
1. Apply `clamp()` to all font sizes
2. Reduce line-height where needed
3. Apply text truncation where appropriate

### Phase 4: Grid Density
1. Reduce gaps in ideas grid
2. Reduce padding on cards
3. Constrain image heights

### Phase 5: JavaScript Safety Net
1. Add viewport enforcement script
2. Add image error handlers
3. Remove console.log statements

---

## 📋 CLAUDE CODE COMMAND CHECKLIST

```bash
# 1. First, check if images exist
ls -la images/*.webp

# 2. Verify image paths in HTML match actual files
grep -n "images/" index.html | head -20

# 3. Test viewport heights
# Open Chrome DevTools → Toggle device toolbar → Test at:
# - 1920x1080 (Desktop)
# - 1440x900 (Laptop)  
# - 1366x768 (Common laptop)
# - 768x1024 (Tablet)

# 4. After fixes, validate
# - No horizontal scroll
# - No vertical scroll within snap sections
# - All images load
# - All text readable
```

---

## 🚨 QUICK WINS - COPY/PASTE READY

### Add to `<head>` or top of `<style>`:

```css
/* NUCLEAR VIEWPORT FIX - Add this first */
:root {
    --nav-height: 80px;
    --section-padding: calc(var(--nav-height) + 2rem);
}

.snap-section {
    min-height: 100vh;
    min-height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    overflow: hidden !important;
    box-sizing: border-box;
}

/* Prevent ANY content from causing overflow */
.snap-section > * {
    max-height: calc(100vh - var(--nav-height) - 4rem);
    max-height: calc(100dvh - var(--nav-height) - 4rem);
}
```

---

## ✅ SUCCESS CRITERIA

After implementing these fixes:

| Section | Should Fit | No Scroll | Images Load |
|---------|-----------|-----------|-------------|
| Hero | ✅ | ✅ | ✅ |
| Equation | ✅ | ✅ | N/A |
| Ideas Grid | ✅ | ✅ | ✅ |
| BBC Evidence | ✅ | ✅ | N/A |
| HRIH | ✅ | ✅ | ✅ |
| Falsifiability | ✅ | ✅ | N/A |
| 5,000 Years | ✅ | ✅ | ✅ |

**Test at these resolutions:**
- 2560x1440 (4K scaled)
- 1920x1080 (Full HD)
- 1440x900 (MacBook Pro)
- 1366x768 (Common laptop)
- 1280x720 (HD)
