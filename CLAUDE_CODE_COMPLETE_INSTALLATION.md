# INFINITE ARCHITECTS — COMPLETE INSTALLATION PROMPT FOR CLAUDE CODE

**Copy this entire prompt to Claude Code to install everything at the highest standard.**

---

## CONTEXT

You are installing a comprehensive enhancement package for the Infinite Architects book website. This includes:

1. **MASTER ENHANCEMENT** — Hero section, layout fixes, gyroscope effects
2. **FINAL POLISH** — SEO, accessibility, conversion optimization, analytics

The goal is production-ready, world-class quality.

---

## FILES TO PROCESS

```
INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html — Hero + Layout + Gyroscope
INFINITE_ARCHITECTS_FINAL_POLISH.html — SEO + A11y + Conversion + Analytics
```

The target file is `index.html` (main website).

---

## INSTALLATION STEPS

### STEP 1: BACKUP

```bash
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
cp index.html backups/$(date +%Y%m%d_%H%M%S)/
echo "✓ Backup created"
```

### STEP 2: ADD META TAGS TO <head>

From `INFINITE_ARCHITECTS_FINAL_POLISH.html`, extract everything between:
- `<!-- CANONICAL & BASIC META -->` 
- `<!-- RESOURCE HINTS -->` (inclusive)

Insert into index.html `<head>` section, AFTER `<title>` but BEFORE any CSS.

**Verification:**
- Canonical URL present
- Open Graph tags present
- Twitter Card tags present  
- JSON-LD structured data present
- Resource hints (preconnect, preload) present

### STEP 3: ADD SKIP LINK AFTER <body>

From `INFINITE_ARCHITECTS_FINAL_POLISH.html`, add these elements immediately after the opening `<body>` tag:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<div id="sr-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

Then add `id="main-content"` to the hero section:
```html
<section class="hero snap-section chromatic-lens" id="hero" id="main-content">
```

### STEP 4: REPLACE HERO SECTION

From `INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html`, extract the complete hero section HTML (from `<section class="hero snap-section chromatic-lens" id="hero">` to its closing `</section>`).

In index.html:
1. Find the existing hero section (search for `<section class="hero`)
2. Replace it ENTIRELY with the new hero HTML
3. Preserve any unique video sources or image paths from the original

**New hero includes:**
- Social proof bar
- Email capture as primary CTA
- Amazon as secondary CTA
- Trust signals
- Live viewer count

### STEP 5: ADD CONVERSION ELEMENTS BEFORE </body>

From `INFINITE_ARCHITECTS_FINAL_POLISH.html`, add these elements BEFORE the closing `</body>` tag:

```html
<!-- Reading Progress Bar -->
<div class="reading-progress" id="reading-progress" aria-hidden="true">...</div>

<!-- Exit Intent Popup -->
<div class="exit-intent-overlay" id="exit-intent-overlay">...</div>

<!-- Mobile Sticky CTA -->
<div class="mobile-sticky-cta" id="mobile-sticky-cta">...</div>
```

### STEP 6: ADD ALL CSS

**Option A: Add to existing inline <style>**

Combine CSS from both files:
1. From `INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html` — `<style id="ia-master-enhancements">`
2. From `INFINITE_ARCHITECTS_FINAL_POLISH.html` — `<style id="ia-final-polish-css">`

Add all CSS BEFORE the closing `</style>` tag in index.html.

**Option B: Create separate file**

Create `enhancements.css` with combined CSS, then add to `<head>`:
```html
<link rel="stylesheet" href="enhancements.css">
```

### STEP 7: ADD ALL JAVASCRIPT

Find the main `<script>` block in index.html (typically before `</body>`).

Add JavaScript from both files:
1. From `INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html` — contents of `<script id="ia-master-enhancement-scripts">`
2. From `INFINITE_ARCHITECTS_FINAL_POLISH.html` — contents of `<script id="ia-final-polish-scripts">`

**Important:** Add AFTER any dependent code (gtag, PERF object, safeInterval, openFreeChapterModal).

---

## VERIFICATION CHECKLIST

After installation, verify:

### SEO
- [ ] `<link rel="canonical">` present
- [ ] Open Graph meta tags present (og:title, og:image, etc.)
- [ ] Twitter Card meta tags present
- [ ] JSON-LD structured data present and valid (test at schema.org validator)
- [ ] Resource hints present (preconnect, preload)

### Accessibility
- [ ] Skip link works (Tab → first focus → visible)
- [ ] All buttons have 44px minimum touch target
- [ ] Focus-visible styles work (Tab through page)
- [ ] Screen reader announcer div present
- [ ] Reduced motion respected (check with browser setting)

### Hero Section
- [ ] Social proof bar visible
- [ ] Email form submits successfully
- [ ] Success message shows after submission
- [ ] Amazon button tracks clicks (check console)
- [ ] Live viewer count updates every few seconds
- [ ] Trust signals visible

### Layout (Desktop)
- [ ] All sections visible without horizontal scroll
- [ ] Two-column sections render correctly (About, Religion)
- [ ] Ideas grid displays properly
- [ ] No text overflow anywhere

### Layout (Mobile - test at 375px)
- [ ] Hero fits on screen
- [ ] Email form stacks vertically
- [ ] All content visible
- [ ] Touch targets are adequate
- [ ] No horizontal scroll

### Conversion Elements
- [ ] Reading progress bar appears after scrolling
- [ ] Exit intent popup triggers on mouse leave (desktop)
- [ ] Mobile sticky CTA appears after hero (mobile only)
- [ ] Exit popup respects 24h cooldown

### Gyroscope/Parallax
- [ ] Desktop: Book follows mouse cursor
- [ ] Mobile iOS: "Enable Tilt" button appears
- [ ] Mobile Android: Gyroscope auto-starts
- [ ] Effects pause when tab is hidden

### Analytics
- [ ] gtag events fire (check Network tab)
- [ ] Scroll depth events at 25%, 50%, 75%, 90%, 100%
- [ ] Time on page events at 30s, 60s, 120s
- [ ] hero_email_signup event on form submit
- [ ] hero_amazon_click event on buy button

### Performance
- [ ] Images lazy load (check Network tab)
- [ ] No console errors
- [ ] Page loads under 3 seconds

---

## CONFIGURATION NOTES

### ConvertKit Form ID
The code uses Form ID `8970906`. If different, update in:
1. Hero email form JavaScript
2. Exit intent form JavaScript

Search for `8970906` and replace with your form ID.

### Amazon Links
Current link: `https://www.amazon.co.uk/dp/B0DS2L8BVC`

Ensure this matches your book's Amazon link.

### Social Media Handles
Update in meta tags:
- `twitter:site` — currently `@InfiniteArchOrg`
- `twitter:creator` — currently `@MDEastwood`

### OG Image
Create and upload `og-image-1200x630.jpg` and `twitter-card-1200x600.jpg` to your images folder.

---

## ROLLBACK

If anything breaks:

```bash
cp backups/YYYYMMDD_XXXXXX/index.html ./index.html
```

---

## POST-INSTALLATION

1. Clear browser cache
2. Test on real devices (not just DevTools)
3. Validate structured data: https://validator.schema.org/
4. Test OG tags: https://developers.facebook.com/tools/debug/
5. Test Twitter Card: https://cards-dev.twitter.com/validator
6. Run Lighthouse audit (target 90+ all categories)
7. Submit sitemap to Google Search Console

---

## SUCCESS CRITERIA

The installation is complete when:

✅ All checklist items pass
✅ No console errors
✅ Lighthouse scores: Performance 90+, Accessibility 100, Best Practices 95+, SEO 100
✅ Mobile and desktop both work flawlessly
✅ Email capture successfully submits to ConvertKit
✅ All analytics events firing correctly

---

**Execute this installation with precision. The result should be indistinguishable from a site built by a top-tier agency.**
