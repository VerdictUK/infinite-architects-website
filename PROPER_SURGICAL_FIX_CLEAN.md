# 🔧 PROPER SURGICAL FIX - Clean Code Approach
## For Claude Code Implementation

**Philosophy:** Remove the bad code, don't just override it.

---

## SURGICAL OPERATION 1: Fix Global Scroll Snap

**File:** `index.html`
**Location:** Around line 176-181

### FIND:
```css
html {
    scroll-behavior: auto; /* Precision snap - no smooth drift */
    scroll-snap-type: y mandatory; /* Force snap lock */
    -webkit-text-size-adjust: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--gold-dark) var(--void);
    overscroll-behavior: none; /* Prevent bounce */
```

### REPLACE WITH:
```css
html {
    scroll-behavior: smooth;
    scroll-snap-type: y proximity; /* Gentle snap - doesn't trap users */
    -webkit-text-size-adjust: 100%;
    scrollbar-width: thin;
    scrollbar-color: var(--gold-dark) var(--void);
    overscroll-behavior: contain; /* Contain but allow natural feel */
```

---

## SURGICAL OPERATION 2: Fix Precision Snap System Block

**Location:** Around lines 8090-8115

### FIND:
```css
html {
    scroll-snap-type: y mandatory !important; /* MANDATORY - absolute precision */
    scroll-behavior: auto !important; /* NO smooth - causes drift */
    scroll-padding-top: 0 !important; /* Snap to absolute top */
    overscroll-behavior: none !important; /* Prevent bounce/overscroll */
    overscroll-behavior-y: none !important;
    -webkit-overflow-scrolling: auto !important; /* Disable momentum - instant snap */
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
    scroll-snap-type: y proximity;
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

/* Disable snap entirely on mobile for natural scrolling */
@media (max-width: 768px) {
    html, body {
        scroll-snap-type: none;
    }
}
```

---

## SURGICAL OPERATION 3: Fix Snap Section Definition

**Location:** Around lines 8119-8150

### FIND:
```css
.snap-section {
    /* PRECISION SNAP PROPERTIES - INSTANT LOCK */
    scroll-snap-align: start !important; /* Align to TOP edge exactly */
    scroll-snap-stop: always !important; /* ALWAYS stop - never skip */
    scroll-margin-top: 0 !important; /* No offset - lock to top */

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

    /* CONTENT LAYOUT */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    /* PRECISION PADDING */
    padding-top: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 0.5rem);
    padding-bottom: 0.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    /* ISOLATION */
    position: relative;
    isolation: isolate;
}
```

### REPLACE WITH:
```css
.snap-section {
    /* Snap properties - gentle, not aggressive */
    scroll-snap-align: start;
    scroll-snap-stop: normal; /* Allow skipping */

    /* Flexible height - content determines size */
    min-height: 100vh;
    min-height: 100dvh;
    /* NO max-height - content can exceed viewport */
    /* NO fixed height - let content flow */

    /* Allow overflow - content must be visible */
    overflow: visible;
    overflow-x: hidden; /* Only hide horizontal overflow */

    /* Content layout */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    /* Padding */
    padding-top: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem);
    padding-bottom: 2rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    position: relative;
    isolation: isolate;
}

/* Mobile: sections become normal flowing blocks */
@media (max-width: 768px) {
    .snap-section {
        scroll-snap-align: none;
        min-height: auto;
        height: auto;
        overflow: visible;
        padding-top: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1.5rem);
        padding-bottom: 3rem;
    }
}
```

---

## SURGICAL OPERATION 4: Remove Content Wrapper Constraints

**Location:** Around lines 8173-8190

### FIND:
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```

### REPLACE WITH:
```css
/* Content wrappers - responsive, no arbitrary constraints */
.snap-section > .section-inner,
.snap-section > .container,
.snap-section > [class*="-inner"],
.snap-section > [class*="-content"],
.snap-section > [class*="-container"],
.snap-section > div:first-child:not(canvas):not(.neural-canvas):not(.particle-canvas) {
    width: 100%;
    max-width: 1400px;
    /* NO max-height - content flows naturally */
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
```

---

## SURGICAL OPERATION 5: Fix iOS Safari Block

**Location:** Around lines 8157-8170

### FIND:
```css
/* iOS Safari precision fix - MAXIMUM INSTANT */
@supports (-webkit-touch-callout: none) {
    html {
        scroll-snap-type: y mandatory !important;
        -webkit-overflow-scrolling: auto !important; /* Disable momentum for instant snap */
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
/* iOS Safari - enable smooth native scrolling */
@supports (-webkit-touch-callout: none) {
    html, body {
        -webkit-overflow-scrolling: touch;
    }
}
```

---

## SURGICAL OPERATION 6: Fix Evidence Locker

**Location:** Around lines 6427-6458

### FIND:
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
    /* NO fixed height - content flows */
    overflow: visible;
}
```

### ALSO FIND:
```css
.evidence-locker .evidence-grid {
    flex: 1;
    min-height: 0;
    overflow: hidden !important; /* Force fit, no scroll */
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 9rem) !important;
```

### REPLACE WITH:
```css
.evidence-locker .evidence-grid {
    flex: 1;
    min-height: 0;
    overflow: visible;
    /* NO max-height constraint */
```

---

## SURGICAL OPERATION 7: Fix Mobile Breakpoints

**Location:** Around lines 8711-8780

### FIND THE ENTIRE BLOCK:
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
```

### REPLACE WITH:
```css
/* MOBILE PORTRAIT (up to 480px) */
@media (max-width: 480px) {
    /* Natural scrolling on mobile - no snap */
    html, body {
        scroll-snap-type: none;
        -webkit-overflow-scrolling: touch;
    }

    .snap-section {
        scroll-snap-align: none;
        height: auto;
        min-height: auto;
        overflow: visible;
        padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem) 1rem 3rem;
    }

    /* Horizontal swipe for ideas grid */
    .ideas-grid {
        display: flex !important;
        flex-direction: row !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        gap: 1rem !important;
        padding-bottom: 1rem !important;
        -webkit-overflow-scrolling: touch;
    }
    
    .ideas-grid .idea-card {
        flex: 0 0 85vw !important;
        min-width: 280px !important;
    }
```

---

## SURGICAL OPERATION 8: Fix 768px Breakpoint

**Location:** Around lines 8783-8810

### FIND:
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
    html, body {
        scroll-snap-type: none;
        -webkit-overflow-scrolling: touch;
    }

    .snap-section {
        scroll-snap-align: none;
        height: auto;
        min-height: auto;
        overflow: visible;
```

---

## SURGICAL OPERATION 9: Fix Ideas Grid at 768px

**Location:** Around lines 1358-1377

### KEEP THIS (it's correct):
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

### BUT CHANGE `max-height` on `.idea-card`:
```css
    .idea-card {
        flex: 0 0 280px;
        scroll-snap-align: center;
        /* REMOVED: max-height - let card content flow */
    }
```

---

## SURGICAL OPERATION 10: Fix HRIH Section

**Location:** Search for `.hrih-section .hrih-content`

### FIND:
```css
.hrih-section .hrih-content {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem);
    overflow: hidden;
```

### REPLACE WITH:
```css
.hrih-section .hrih-content {
    /* NO max-height constraint */
    overflow: visible;
```

---

# 📋 CLAUDE CODE IMPLEMENTATION COMMANDS

Copy and paste this to Claude Code:

```
Perform the following surgical fixes to index.html to fix mobile scrolling issues:

1. GLOBAL: Change all instances of `scroll-snap-type: y mandatory` to `scroll-snap-type: y proximity`

2. GLOBAL: Change all instances of `-webkit-overflow-scrolling: auto` to `-webkit-overflow-scrolling: touch`

3. GLOBAL: Change all instances of `scroll-snap-stop: always` to `scroll-snap-stop: normal`

4. In the .snap-section CSS block (around line 8119-8150):
   - Remove these lines: `max-height: 100vh`, `height: 100vh`, `overflow: hidden`
   - Change `overflow: hidden` to `overflow: visible`
   
5. In content wrapper rules (around line 8173-8190):
   - Remove all `max-height: calc(100vh - ...)` lines
   - Change `overflow: hidden` to `overflow: visible`

6. In .evidence-locker-inner (around line 6427):
   - Remove `height: calc(100vh - ...)` lines
   - Change `overflow: hidden` to `overflow: visible`

7. In .evidence-locker .evidence-grid (around line 6447):
   - Remove `max-height` constraints
   - Change `overflow: hidden` to `overflow: visible`

8. In mobile breakpoints (480px and 768px):
   - Change `scroll-snap-type: y mandatory` to `scroll-snap-type: none`
   - Remove `height: 100vh` and `max-height: 100vh` from .snap-section
   - Change `overflow: hidden` to `overflow: visible`
   - Keep .ideas-grid as horizontal flex layout

9. Remove the entire iOS Safari aggressive snap block that starts with:
   `/* iOS Safari precision fix - MAXIMUM INSTANT */`

10. In .hrih-section .hrih-content:
    - Remove `max-height` constraint
    - Change `overflow: hidden` to `overflow: visible`

After making these changes, verify that:
- Sections can scroll naturally on mobile
- Ideas grid scrolls horizontally
- No content is cut off
- Desktop still has gentle snap behavior
```

---

# ✅ WHAT THIS ACHIEVES

| Before | After |
|--------|-------|
| `mandatory` snap traps users | `proximity` snap is gentle |
| `overflow: hidden` cuts content | `overflow: visible` shows all |
| `height: 100vh` forces exact fit | `height: auto` flows naturally |
| iOS momentum disabled | iOS momentum enabled |
| Mobile grid overrides horizontal | Mobile keeps horizontal swipe |

---

# 🧪 TESTING AFTER FIX

1. **Desktop Chrome:** Should still have gentle snap between sections
2. **Mobile Safari:** Should scroll smoothly, no stuck feeling
3. **Ideas grid:** Should swipe horizontally on mobile
4. **Evidence locker:** All 9 cards visible
5. **BBC section:** Video and text fully visible
6. **HRIH section:** All content accessible

---

This is the **clean, proper fix** - removing bad code rather than piling more CSS on top. No technical debt, no conflicting rules, maintainable code.
