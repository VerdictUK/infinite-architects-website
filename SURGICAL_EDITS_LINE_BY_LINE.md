# 🔬 PRECISE SURGICAL EDITS FOR CLAUDE CODE
## Line-by-Line Implementation Guide

**File:** index.html  
**Based on:** Screenshot analysis January 12, 2026

---

## EDIT 1: Fix snap-section to enforce 100vh MAX height

**Location:** Line 7531-7538  
**Current Code:**
```css
.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
    /* Ensure content isn't hidden behind ticker */
    padding-top: max(2rem, env(safe-area-inset-top));
}
```

**Replace With:**
```css
.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
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
    /* Ensure content isn't hidden behind ticker */
    padding-top: max(5rem, calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem));
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
}

.snap-section > * {
    max-height: calc(100vh - 10rem);
    max-height: calc(100dvh - 10rem);
    width: 100%;
}
```

---

## EDIT 2: Fix Ideas Grid to fit viewport (10 cards in 3x3+1)

**Location:** Line 1080-1084  
**Current Code:**
```css
.ideas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
}
```

**Replace With:**
```css
.ideas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 1400px;
    max-height: calc(100vh - 14rem);
    max-height: calc(100dvh - 14rem);
    overflow: hidden;
}

/* Last card spans remaining space or hides on small screens */
.ideas-grid .idea-card:last-child {
    grid-column: span 1;
}

@media (max-width: 1200px) {
    .ideas-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        max-height: calc(100vh - 12rem);
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }
}
```

---

## EDIT 3: Compact idea-card for viewport fit

**Location:** Line 1086-1093  
**Current Code:**
```css
.idea-card {
    background: rgba(212, 168, 75, 0.02);
    border: 1px solid rgba(212, 168, 75, 0.08);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.6s var(--ease-out-expo);
}
```

**Replace With:**
```css
.idea-card {
    background: rgba(212, 168, 75, 0.02);
    border: 1px solid rgba(212, 168, 75, 0.08);
    padding: 1rem 1.25rem;
    position: relative;
    overflow: hidden;
    transition: all 0.6s var(--ease-out-expo);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.idea-card__image,
.idea-image {
    height: clamp(60px, 8vh, 100px);
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.1) 0%, rgba(18, 18, 22, 0.8) 100%);
}

.idea-number {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    line-height: 1;
}

.idea-title {
    font-size: clamp(0.8rem, 1.1vw, 1rem);
    margin-bottom: 0.4rem;
}

.idea-text {
    font-size: clamp(0.65rem, 0.85vw, 0.8rem);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--text-dim);
}
```

---

## EDIT 4: Add CSS variables for consistent heights

**Location:** After line ~500 (in :root or early CSS)  
**Add This Code:**
```css
:root {
    --ticker-height: 40px;
    --nav-height: 60px;
    --section-safe-height: calc(100vh - var(--ticker-height) - var(--nav-height) - 4rem);
    --section-safe-height-dvh: calc(100dvh - var(--ticker-height) - var(--nav-height) - 4rem);
}
```

---

## EDIT 5: Fix BBC Evidence Section viewport fit

**Find the section CSS for `.timeline-evidence-section` or `.bbc-evidence`**

**Add/Replace:**
```css
.timeline-evidence-section.snap-section,
.bbc-evidence-section.snap-section {
    padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem) 2rem 1.5rem;
}

.bbc-evidence-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-height: calc(100vh - 16rem);
    max-height: calc(100dvh - 16rem);
    align-items: center;
    width: 100%;
    max-width: 1200px;
}

.bbc-evidence-card__video {
    max-height: 40vh;
    border-radius: 12px;
    overflow: hidden;
}

.bbc-evidence-card__video video {
    width: 100%;
    height: auto;
    max-height: 40vh;
    object-fit: contain;
}

/* Scale down quotes to fit */
.bbc-quote {
    font-size: clamp(0.95rem, 1.5vw, 1.2rem);
    line-height: 1.5;
}

.book-response {
    margin-top: 1rem;
    padding-top: 1rem;
}

.book-quote {
    font-size: clamp(0.85rem, 1.2vw, 1rem);
}
```

---

## EDIT 6: Fix HRIH Section viewport fit

**Find:** `.hrih-section` CSS  
**Add/Replace:**
```css
.hrih-section.snap-section {
    padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem) 2rem 1rem;
}

.hrih-section .section-inner,
.hrih-section .hrih-content {
    max-height: calc(100vh - 12rem);
    max-height: calc(100dvh - 12rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
}

.hrih-theory-card {
    padding: 1.5rem 2rem;
    max-height: 50vh;
}

.hrih-section .bbc-evidence-card {
    max-height: 35vh;
    margin-top: 0.5rem;
}

.hrih-section .bbc-evidence-card__video {
    max-height: 22vh;
}

.hrih-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    margin-bottom: 0.5rem;
}

.hrih-subtitle {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
}
```

---

## EDIT 7: Fix Religion/5000 Years Section

**Find:** `.religion-section` CSS  
**Add/Replace:**
```css
.religion-section.snap-section {
    padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 2rem) 2rem 2rem;
    justify-content: flex-start;
}

.religion-section .section-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    max-height: calc(100vh - 14rem);
}

.religion-image,
.alignment-image,
.wisdom-image {
    width: 100%;
    max-height: 45vh;
    border-radius: 16px;
    object-fit: cover;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.1) 0%, rgba(18, 18, 22, 0.8) 100%);
}

/* Fallback for broken images */
.religion-image[alt]:after,
.wisdom-image[alt]:after {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(212, 168, 75, 0.15) 0%, rgba(18, 18, 22, 0.9) 100%);
    content: attr(alt);
    color: var(--gold-pale);
    font-size: 0.8rem;
    text-align: center;
    padding: 1rem;
}

.stat-large {
    font-size: clamp(3rem, 7vw, 5rem);
    font-weight: 200;
    color: var(--gold);
    line-height: 1;
}
```

---

## EDIT 8: Image Error Handler JavaScript

**Location:** Add inside the main `<script>` tag (around line 10300+)

```javascript
// ============================================
// IMAGE ERROR HANDLER - Graceful fallbacks
// ============================================
(function initImageErrorHandlers() {
    document.querySelectorAll('img').forEach(img => {
        // Handle images that already errored
        if (img.complete && img.naturalHeight === 0) {
            handleImageError(img);
        }
        
        // Handle future errors
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
    
    function handleImageError(img) {
        // Hide the broken image
        img.style.opacity = '0';
        
        // Add gradient fallback to parent
        const parent = img.parentElement;
        if (parent) {
            parent.style.background = 'linear-gradient(135deg, rgba(212, 168, 75, 0.12) 0%, rgba(18, 18, 22, 0.95) 100%)';
            parent.style.minHeight = img.classList.contains('idea-image') ? '80px' : '150px';
        }
    }
})();
```

---

## EDIT 9: Force Section Content Containment

**Location:** Add to CSS (around line 7545)

```css
/* NUCLEAR: Force all section content to stay within viewport */
.snap-section .section-inner,
.snap-section .container,
.snap-section > div:first-child {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 6rem);
    max-height: calc(100dvh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 6rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Section headers - compact */
.section-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
}

.section-title {
    font-size: clamp(1.6rem, 3.5vw, 2.5rem);
    line-height: 1.2;
    margin-bottom: 1rem;
}

.section-subtitle {
    font-size: clamp(0.9rem, 1.3vw, 1.1rem);
    line-height: 1.5;
}
```

---

## EDIT 10: Mobile Responsive Overrides

**Location:** Inside `@media (max-width: 768px)` block

```css
@media (max-width: 768px) {
    .snap-section {
        padding: calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 0.5rem) 1rem 1rem;
    }
    
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
    
    .bbc-evidence-card {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .bbc-evidence-card__video {
        max-height: 30vh;
    }
    
    .religion-section .section-inner {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}
```

---

## 📋 IMPLEMENTATION CHECKLIST FOR CLAUDE CODE

### Phase 1: CSS Root Variables
```bash
# Add to :root section (around line 500)
# Variables for consistent spacing
```
- [ ] Add `--ticker-height: 40px`
- [ ] Add `--nav-height: 60px`
- [ ] Add `--section-safe-height` calculation

### Phase 2: Snap Section Nuclear Fix
```bash
# Edit line 7531-7538
```
- [ ] Add `max-height: 100vh`
- [ ] Add `height: 100vh`
- [ ] Add `overflow: hidden`
- [ ] Add `display: flex`
- [ ] Add child max-height rule

### Phase 3: Ideas Grid Fix
```bash
# Edit line 1080-1084
```
- [ ] Change to `grid-template-columns: repeat(3, 1fr)`
- [ ] Add `max-height` constraint
- [ ] Add mobile horizontal scroll override

### Phase 4: Card Compaction
```bash
# Edit line 1086-1093
```
- [ ] Reduce padding from `2.5rem` to `1rem 1.25rem`
- [ ] Add typography clamp() values
- [ ] Add text truncation

### Phase 5: Section-Specific Fixes
- [ ] BBC Evidence section height constraints
- [ ] HRIH section height constraints
- [ ] Religion section grid layout

### Phase 6: JavaScript
- [ ] Add image error handlers
- [ ] Remove console.log statements

### Phase 7: Testing
```bash
# Test at these viewport sizes:
# 1920x1080, 1440x900, 1366x768, 1280x720
```
- [ ] No section requires scrolling
- [ ] All images load or show graceful fallback
- [ ] Navigation works to all sections

---

## 🔍 VERIFICATION COMMANDS

```bash
# Check image paths exist
ls -la images/*.webp

# Check if images are properly referenced
grep -n "images/pillar" index.html
grep -n "images/art-" index.html

# Count snap-section occurrences
grep -c "snap-section" index.html

# Verify no horizontal overflow
# (Manual test in browser DevTools)
```

---

## ⚡ QUICK COPY-PASTE CSS BLOCK

Add this entire block right after the `:root` variables:

```css
/* ═══════════════════════════════════════════════════════════════════════
   VIEWPORT FIT ENFORCEMENT - Nuclear Fix for Snap Sections
   ═══════════════════════════════════════════════════════════════════════ */
:root {
    --ticker-height: 40px;
    --nav-height: 60px;
    --section-content-max: calc(100vh - var(--ticker-height) - var(--nav-height) - 6rem);
}

.snap-section {
    max-height: 100vh !important;
    max-height: 100dvh !important;
    overflow: hidden !important;
}

.snap-section .section-inner,
.snap-section .container,
.snap-section > div:not(.neural-canvas):not(.particle-canvas) {
    max-height: var(--section-content-max) !important;
    overflow: hidden;
}

/* Compact typography for density */
.snap-section .section-title {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
    margin-bottom: 0.75rem;
}

.snap-section .section-label {
    font-size: 0.65rem;
    margin-bottom: 0.4rem;
}
```
