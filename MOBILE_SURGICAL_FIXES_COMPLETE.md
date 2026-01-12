# 🔧 MOBILE SURGICAL FIXES - Complete Implementation Guide
## For Claude Code to Implement

**File:** `index.html`  
**Total Lines:** 17,824  
**Issues Identified:** 12 critical mobile/UX problems

---

## ⚠️ CRITICAL ROOT CAUSE

The website has aggressive scroll-snap CSS with `overflow: hidden` on sections, which:
1. **Cuts off content** that doesn't fit in 100vh
2. **Prevents internal scrolling** within sections
3. **Fights with horizontal scroll** on ideas/evidence grids
4. **Is too aggressive on mobile** - users get stuck

---

# SURGICAL FIX 1: DISABLE AGGRESSIVE SNAP-SECTION OVERFLOW

**Location:** Lines 8119-8144 (approximately)
**Problem:** `overflow: hidden !important` on `.snap-section` hides all content that exceeds viewport

### FIND THIS BLOCK:
```css
.snap-section {
    /* PRECISION SNAP PROPERTIES - INSTANT LOCK */
    scroll-snap-align: start !important;
    scroll-snap-stop: always !important;
    scroll-margin-top: 0 !important;

    /* EXACT VIEWPORT DIMENSIONS */
    min-height: 100vh !important;
    min-height: 100dvh !important;
    max-height: 100vh !important;
    max-height: 100dvh !important;
    height: 100vh !important;
    height: 100dvh !important;

    /* ZERO INTERNAL SCROLL */
    overflow: hidden !important;
    overflow-y: hidden !important;
    overflow-x: hidden !important;
```

### REPLACE WITH:
```css
.snap-section {
    /* PRECISION SNAP PROPERTIES */
    scroll-snap-align: start;
    scroll-snap-stop: normal; /* Changed from always - allows skipping */
    scroll-margin-top: 0;

    /* VIEWPORT DIMENSIONS - Min only, no max constraint */
    min-height: 100vh;
    min-height: 100dvh;
    /* REMOVED: max-height - was cutting off content */
    /* REMOVED: height - let content determine height */

    /* ALLOW OVERFLOW - Content must be visible */
    overflow: visible;
    overflow-y: visible;
    overflow-x: hidden; /* Only hide horizontal overflow */
```

---

# SURGICAL FIX 2: REMOVE CONTENT WRAPPER MAX-HEIGHT

**Location:** Lines 8173-8187 (approximately)
**Problem:** Content wrappers have `max-height` and `overflow: hidden` hiding content

### FIND THIS BLOCK:
```css
/* ALL content wrappers - MUST fit in viewport, NO scroll */
.snap-section > .section-inner,
.snap-section > .container,
.snap-section > [class*="-inner"],
.snap-section > [class*="-content"],
.snap-section > [class*="-container"],
.snap-section > div:first-child:not(canvas):not(.neural-canvas):not(.particle-canvas) {
    width: 100%;
    max-width: 1400px;
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem) !important;
    max-height: calc(100dvh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem) !important;
    overflow: hidden !important; /* NO INTERNAL SCROLL */
```

### REPLACE WITH:
```css
/* Content wrappers - responsive sizing without cutting off */
.snap-section > .section-inner,
.snap-section > .container,
.snap-section > [class*="-inner"],
.snap-section > [class*="-content"],
.snap-section > [class*="-container"],
.snap-section > div:first-child:not(canvas):not(.neural-canvas):not(.particle-canvas) {
    width: 100%;
    max-width: 1400px;
    /* REMOVED: max-height constraints - let content flow */
    overflow: visible; /* Allow content to be seen */
```

---

# SURGICAL FIX 3: FIX EVIDENCE LOCKER OVERFLOW

**Location:** Lines 6427-6458 (approximately)
**Problem:** Evidence locker inner has `overflow: hidden` and max-height cutting off cards

### FIND THIS BLOCK:
```css
.evidence-locker-inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem);
    height: calc(100dvh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem);
    overflow: hidden;
}
```

### REPLACE WITH:
```css
.evidence-locker-inner {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    /* REMOVED: fixed height - let content flow */
    min-height: auto;
    overflow: visible;
}
```

### ALSO FIND:
```css
/* Constrain evidence grid to fit within viewport - NO internal scroll */
.evidence-locker .evidence-grid {
    flex: 1;
    min-height: 0;
    overflow: hidden !important; /* Force fit, no scroll */
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 9rem) !important;
```

### REPLACE WITH:
```css
/* Evidence grid - allow scrolling on mobile */
.evidence-locker .evidence-grid {
    flex: 1;
    min-height: 0;
    overflow: visible; /* Allow content visibility */
    /* REMOVED: max-height constraints */
```

---

# SURGICAL FIX 4: FIX MOBILE PORTRAIT (480px) CONFLICTS

**Location:** Lines 8711-8780 (approximately)
**Problem:** Mobile portrait overrides horizontal scroll with grid + overflow: hidden

### FIND THIS BLOCK:
```css
/* MOBILE PORTRAIT (up to 480px) */
@media (max-width: 480px) {
    html {
        scroll-snap-type: y mandatory !important;
        scroll-behavior: auto !important;
        -webkit-overflow-scrolling: auto !important;
    }

    .snap-section {
        scroll-snap-align: start !important;
        scroll-snap-stop: always !important;
        height: 100vh !important;
        height: 100dvh !important;
        min-height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
        padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 0.25rem) 0.75rem 0.25rem !important;
    }

    /* Compact grids for mobile */
    .ideas-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        grid-template-rows: repeat(5, 1fr) !important;
        gap: 0.3rem !important;
    }

    .evidence-grid,
    .evidence-locker .evidence-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.3rem !important;
    }
```

### REPLACE WITH:
```css
/* MOBILE PORTRAIT (up to 480px) */
@media (max-width: 480px) {
    html {
        scroll-snap-type: y proximity; /* PROXIMITY instead of mandatory */
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }

    .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: normal; /* Allow skipping sections */
        min-height: 100vh;
        min-height: 100dvh;
        /* REMOVED: max-height - content can exceed viewport */
        /* REMOVED: overflow: hidden - content must scroll */
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem) 1rem 2rem;
    }

    /* Ideas grid - HORIZONTAL SCROLL on mobile */
    .ideas-grid {
        display: flex !important;
        flex-direction: row !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        scroll-snap-type: x mandatory;
        gap: 0.75rem !important;
        padding: 0.5rem 0 1rem !important;
        -webkit-overflow-scrolling: touch;
    }

    .ideas-grid .idea-card {
        flex: 0 0 85vw !important;
        max-width: 85vw !important;
        scroll-snap-align: center;
    }

    /* Evidence grid - 2 columns with scroll */
    .evidence-grid,
    .evidence-locker .evidence-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.5rem !important;
        overflow: visible !important;
    }
```

---

# SURGICAL FIX 5: FIX TABLET BREAKPOINT (481-768px)

**Location:** Lines 8783-8810 (approximately)
**Problem:** Same aggressive snap settings on tablet

### FIND THIS BLOCK:
```css
/* MOBILE LANDSCAPE & SMALL TABLETS (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
    html {
        scroll-snap-type: y mandatory !important;
        scroll-behavior: auto !important;
    }

    .snap-section {
        scroll-snap-align: start !important;
        scroll-snap-stop: always !important;
        height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
```

### REPLACE WITH:
```css
/* MOBILE LANDSCAPE & SMALL TABLETS (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
    html {
        scroll-snap-type: y proximity;
        scroll-behavior: smooth;
    }

    .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        min-height: 100vh;
        /* REMOVED: height/max-height constraints */
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
```

---

# SURGICAL FIX 6: FIX MAIN HTML SCROLL-SNAP

**Location:** Lines 176-181 and 8095-8108
**Problem:** HTML/body have `scroll-snap-type: y mandatory` which is too aggressive

### FIND (near line 176):
```css
html {
    scroll-behavior: auto; /* Precision snap - no smooth drift */
    scroll-snap-type: y mandatory; /* Force snap lock */
```

### REPLACE WITH:
```css
html {
    scroll-behavior: smooth;
    scroll-snap-type: y proximity; /* PROXIMITY - gentler snapping */
```

### ALSO FIND (near line 8095):
```css
html {
    scroll-snap-type: y mandatory !important; /* MANDATORY - absolute precision */
    scroll-behavior: auto !important; /* NO smooth - causes drift */
    scroll-padding-top: 0 !important;
    overscroll-behavior: none !important;
    overscroll-behavior-y: none !important;
    -webkit-overflow-scrolling: auto !important;
}

body {
    scroll-snap-type: y mandatory !important;
    overscroll-behavior: none !important;
    overscroll-behavior-y: none !important;
    -webkit-overflow-scrolling: auto !important;
}
```

### REPLACE WITH:
```css
html {
    scroll-snap-type: y proximity; /* PROXIMITY instead of mandatory */
    scroll-behavior: smooth;
    scroll-padding-top: var(--ticker-height, 40px);
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch; /* Enable momentum scrolling */
}

body {
    scroll-snap-type: y proximity;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}
```

---

# SURGICAL FIX 7: FIX IDEAS GRID 768px BREAKPOINT

**Location:** Lines 1358-1377
**Problem:** Good horizontal scroll setup, but conflicts with later overrides

### VERIFY THIS EXISTS (keep it):
```css
@media (max-width: 768px) {
    .ideas-grid {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        gap: 1rem;
        max-height: none;
        height: auto;
        padding-bottom: 1rem;
    }

    .idea-card {
        flex: 0 0 280px;
        scroll-snap-align: center;
        max-height: calc(100vh - 16rem);
    }
}
```

### REMOVE THE CONFLICTING OVERRIDE at lines 8729-8746:
The `@media (max-width: 480px) .ideas-grid` rule overrides horizontal scroll with grid. We already fixed this in Fix 4.

---

# SURGICAL FIX 8: FIX iOS SAFARI SPECIFIC ISSUES

**Location:** Lines 8157-8170
**Problem:** iOS-specific overrides are too aggressive

### FIND THIS BLOCK:
```css
/* iOS Safari precision fix - MAXIMUM INSTANT */
@supports (-webkit-touch-callout: none) {
    html {
        scroll-snap-type: y mandatory !important;
        -webkit-overflow-scrolling: auto !important;
    }
    body {
        -webkit-overflow-scrolling: auto !important;
    }
    .snap-section {
        scroll-snap-align: start !important;
        scroll-snap-stop: always !important;
    }
}
```

### REPLACE WITH:
```css
/* iOS Safari - enable smooth momentum scrolling */
@supports (-webkit-touch-callout: none) {
    html {
        scroll-snap-type: y proximity;
        -webkit-overflow-scrolling: touch;
    }
    body {
        -webkit-overflow-scrolling: touch;
    }
    .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: normal;
        -webkit-overflow-scrolling: touch;
    }
}
```

---

# SURGICAL FIX 9: FIX BBC EVIDENCE SECTION HEIGHT

**Location:** Search for `.bbc-evidence-card`
**Problem:** Video section cut off on mobile

### ADD THIS NEW RULE (after existing .bbc-evidence-card rules):
```css
@media (max-width: 768px) {
    .bbc-evidence-section.snap-section {
        min-height: auto;
        height: auto;
        overflow: visible;
    }
    
    .bbc-evidence-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .bbc-evidence-card__video {
        max-height: 40vh;
        width: 100%;
    }
    
    .bbc-evidence-card__content {
        flex: 1;
        overflow: visible;
    }
}
```

---

# SURGICAL FIX 10: ADD MOBILE SCROLL INDICATOR

**Location:** Add to mobile CSS section
**Problem:** Users don't know they can scroll within sections

### ADD THIS NEW CSS:
```css
/* Mobile scroll indicator */
@media (max-width: 768px) {
    .snap-section::after {
        content: '';
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 40px;
        background: linear-gradient(180deg, var(--gold) 0%, transparent 100%);
        border-radius: 2px;
        opacity: 0.6;
        animation: scrollHint 2s ease-in-out infinite;
        pointer-events: none;
        z-index: 100;
    }
    
    @keyframes scrollHint {
        0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
        50% { transform: translateX(-50%) translateY(10px); opacity: 0.3; }
    }
    
    /* Hide indicator when scrolling */
    .snap-section:active::after,
    .snap-section:focus-within::after {
        opacity: 0;
    }
}
```

---

# SURGICAL FIX 11: FIX HRIH SECTION HEIGHT

**Location:** Search for `.hrih-section`
**Problem:** HRIH section content cut off

### FIND:
```css
.hrih-section .hrih-content {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem);
    overflow: hidden;
```

### REPLACE WITH:
```css
.hrih-section .hrih-content {
    /* REMOVED: max-height constraint */
    overflow: visible;
```

---

# SURGICAL FIX 12: FIX RELIGION SECTION HEIGHT

**Location:** Search for `.religion-section`
**Problem:** Religion section images cut off on mobile

### FIND ANY RULES LIKE:
```css
.religion-section .religion-inner {
    max-height: ...
    overflow: hidden;
}
```

### REPLACE WITH:
```css
.religion-section .religion-inner {
    overflow: visible;
}

@media (max-width: 768px) {
    .religion-section.snap-section {
        min-height: auto;
        height: auto;
    }
    
    .religion-inner {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .religion-image {
        max-height: 40vh;
        object-fit: cover;
    }
}
```

---

# 📋 IMPLEMENTATION CHECKLIST FOR CLAUDE CODE

Run these in order:

- [ ] **Fix 1:** Remove `overflow: hidden` and `max-height/height` from `.snap-section` (line ~8119)
- [ ] **Fix 2:** Remove `max-height` and `overflow: hidden` from content wrappers (line ~8173)
- [ ] **Fix 3:** Fix evidence-locker-inner overflow (line ~6427)
- [ ] **Fix 4:** Fix mobile portrait 480px breakpoint (line ~8711)
- [ ] **Fix 5:** Fix tablet 481-768px breakpoint (line ~8783)
- [ ] **Fix 6:** Change `mandatory` to `proximity` on html/body (lines ~176, ~8095)
- [ ] **Fix 7:** Verify ideas-grid 768px horizontal scroll exists (line ~1358)
- [ ] **Fix 8:** Fix iOS Safari overrides (line ~8157)
- [ ] **Fix 9:** Add BBC evidence mobile fix
- [ ] **Fix 10:** Add mobile scroll indicator
- [ ] **Fix 11:** Fix HRIH section overflow
- [ ] **Fix 12:** Fix religion section overflow

---

# 🎯 QUICK COMMAND FOR CLAUDE CODE

```bash
# Run these sed commands to make the critical fixes:

# 1. Change mandatory to proximity globally
sed -i 's/scroll-snap-type: y mandatory/scroll-snap-type: y proximity/g' index.html

# 2. Change scroll-snap-stop: always to normal
sed -i 's/scroll-snap-stop: always/scroll-snap-stop: normal/g' index.html

# 3. Remove !important from overflow: hidden on snap-section
# This needs manual review - search for:
# overflow: hidden !important;
# and change to:
# overflow: visible;

# 4. Enable touch scrolling
sed -i 's/-webkit-overflow-scrolling: auto/-webkit-overflow-scrolling: touch/g' index.html
```

---

# ✅ EXPECTED RESULTS AFTER FIXES

1. **Sections can scroll** - Content that exceeds viewport is scrollable
2. **Gentler snap** - `proximity` snaps when near edges, not forcing
3. **Ideas grid horizontal scroll** - Works on mobile as designed
4. **Evidence locker visible** - All 9 cards visible with scroll
5. **iOS smooth scrolling** - Momentum scrolling enabled
6. **No content cutoff** - All text/images visible
7. **Better mobile UX** - Users can explore freely

---

# ⚠️ DO NOT CHANGE

These should remain as-is:
- Navigation sticky behavior
- Ticker scroll animation
- Three.js canvas z-index
- Book cover positioning
- CTA button styles

---

# 🧪 TESTING CHECKLIST

After implementing, test on:
- [ ] iPhone Safari (portrait)
- [ ] iPhone Safari (landscape)
- [ ] Android Chrome (portrait)
- [ ] Android Chrome (landscape)
- [ ] iPad Safari
- [ ] Desktop Chrome/Firefox/Safari

For each, verify:
- [ ] Can scroll past hero section
- [ ] Ideas grid scrolls horizontally on mobile
- [ ] Evidence locker shows all cards
- [ ] BBC video section fully visible
- [ ] HRIH section content visible
- [ ] No content cut off anywhere
- [ ] Snap happens but isn't aggressive
