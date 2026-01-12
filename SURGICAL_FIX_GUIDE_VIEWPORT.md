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
