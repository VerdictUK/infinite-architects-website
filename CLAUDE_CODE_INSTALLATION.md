# INFINITE ARCHITECTS - TAILWIND CSS MIGRATION v6.0.0
## Complete Installation Instructions for Claude Code (FINAL Production Edition)

---

## ⚡ CRITICAL CORRECTIONS APPLIED (v6.0 FINAL)

This version includes ALL corrections from the review process:

1. ✅ **Domain Corrected**: All references use `www.michaeldariuseastwood.com` (NOT infinitearchitects.io)
2. ✅ **Google Fonts Import**: Added to top of main.css (Cinzel, Cormorant Garamond, Space Mono)
3. ✅ **122 Animations COMPLETE**: All keyframes from CSS bundle (71) AND HTML inline styles (51)
4. ✅ **Scrollbar Hiding**: `.no-scrollbar` utility explicitly defined in `@layer utilities`
5. ✅ **Safe Area Padding**: iPhone notch/home bar support with `.safe-bottom` and `.mobile-safe-padding`
6. ✅ **HTML Chunking Strategy**: Section-by-section conversion protocol (prevents context loss)
7. ✅ **Asset Transfer Step**: Instructions to copy images/videos to project directories

---

## 🚀 EXECUTIVE SUMMARY

This document provides step-by-step instructions for Claude Code to execute the complete Tailwind CSS migration for the Infinite Architects website.

**Mission:** Convert ~40,500 lines of CSS specificity hell into a clean, maintainable Tailwind CSS architecture while:

1. Fixing all content visibility bugs (Parts III+ currently hidden)
2. Preserving all 122 animations (COMPLETE - in separate `animations.css`)
3. Maintaining all JavaScript integration points
4. Keeping 640+ SEO keywords and structured data intact
5. Using British English throughout all visible content
6. Implementing mobile polish (scrollbar hiding, safe areas)

**Target Domain:** `https://www.michaeldariuseastwood.com`

---

## 📋 PRE-FLIGHT CHECKLIST

Before starting, verify you have access to:

- [ ] All 12+ bundle files from `_tailwind_bundle/`
- [ ] Node.js >= 18.0.0
- [ ] npm >= 9.0.0
- [ ] Git (for version control)
- [ ] A Vercel account (for deployment)

---

## 🏗️ PHASE 1: PROJECT SETUP (Do First)

### Step 1.1: Create Project Structure

```bash
# Create the project directory with all required folders
mkdir -p infinite-architects-tailwind/{dist,src/styles,scripts,public/images,public/videos,api,_backup}

# Navigate to project root
cd infinite-architects-tailwind
```

### Step 1.2: Install Dependencies

Copy the provided `package.json` to the project root, then:

```bash
npm install
```

**Verify package.json has correct domain:**
```json
{
  "author": {
    "name": "Michael Darius Eastwood",
    "email": "michael@michaeldariuseastwood.com",
    "url": "https://www.michaeldariuseastwood.com"
  }
}
```

### Step 1.3: Configure Tailwind & CSS Files

**CRITICAL FILE PLACEMENT:**

1. Copy `tailwind.config.js` to project root
2. Copy `postcss.config.js` to project root
3. Copy `src/styles/main.css` to `./src/styles/main.css`
4. Copy `src/styles/animations.css` to `./src/styles/animations.css`

**VERIFY: animations.css must exist and contain all 122 keyframe animations.**

### Step 1.4: Asset Transfer (CRITICAL - NEW STEP)

**Copy all images and videos from the source bundle to prevent broken links:**

```bash
# From the source bundle directory, copy all images
cp -r _tailwind_bundle/images/* ./public/images/

# Copy all root-level images (favicons, book covers, etc.)
cp _tailwind_bundle/*.png ./public/
cp _tailwind_bundle/*.jpg ./public/
cp _tailwind_bundle/*.webp ./public/images/
cp _tailwind_bundle/*.ico ./public/

# Copy all videos
cp -r _tailwind_bundle/videos/* ./public/videos/

# Copy root-level videos
cp _tailwind_bundle/*.mp4 ./public/videos/
```

**Alternative: If using original project structure:**
```bash
# If assets are in the root of the original project
cp -r original-project/images/* ./public/images/
cp -r original-project/videos/* ./public/videos/

# Copy favicon files
cp original-project/favicon*.png ./public/
cp original-project/favicon.ico ./public/
cp original-project/android-chrome*.png ./public/
cp original-project/apple-touch-icon.png ./public/
```

**Verify assets transferred correctly:**
```bash
# Count images (should be 50+)
ls -la public/images/*.webp | wc -l

# Count videos (should be 10+)
ls -la public/videos/*.mp4 | wc -l

# Verify favicons exist
ls -la public/favicon*
ls -la public/android-chrome*
ls -la public/apple-touch-icon.png
```

**CRITICAL ASSET LIST (Must be present):**

| Asset | Location | Purpose |
|-------|----------|---------|
| `hero-portal-compressed.mp4` | `public/videos/` | Hero background video |
| `book-cover.webp` | `public/images/` | Main book cover |
| `author-photo.webp` | `public/images/` | Author photo |
| `bbc-willow.webp` | `public/images/` | BBC evidence image |
| `favicon.ico` | `public/` | Browser tab icon |
| `android-chrome-512x512.png` | `public/` | PWA icon |
| `apple-touch-icon.png` | `public/` | iOS icon |

### Step 1.5: Verify Installation

```bash
# Build CSS to verify Tailwind is working
npm run tailwind:build

# Should create ./dist/styles.css with no errors
ls -la dist/

# Verify animations are present (should show 120+)
grep -c "@keyframes" dist/styles.css

# Verify Google Fonts import exists
grep "fonts.googleapis.com" src/styles/main.css

# Verify no-scrollbar utility exists
grep "no-scrollbar" dist/styles.css

# Verify safe-bottom utility exists
grep "safe-bottom" dist/styles.css
```

**Expected Results:**
- `@keyframes` count: 122
- Google Fonts import: Yes (Cinzel, Cormorant Garamond, Space Mono)
- `no-scrollbar` found: Yes
- `safe-bottom` found: Yes

---

## 🔧 PHASE 2: HTML CONVERSION (Core Work) - CHUNKING STRATEGY

### ⚠️ CRITICAL: DO NOT CONVERT THE ENTIRE FILE AT ONCE

The `index.html` file is ~40,000 lines. **Attempting to convert it in a single pass WILL cause truncation and errors.**

### Step 2.1: Backup Original Files

```bash
# Create backup directory
mkdir -p _backup

# Copy original files
cp 08_index.html _backup/index.html.original
cp 03_SECONDARY_HTML_BUNDLE.html _backup/secondary.html.original
```

### Step 2.2: Domain Update Checklist

**UPDATE ALL domain references from `infinitearchitects.io` to `www.michaeldariuseastwood.com`:**

| File | What to Update |
|------|----------------|
| `index.html` | Canonical URL, og:url, JSON-LD @id references |
| `sitemap.xml` | All `<loc>` tags |
| `robots.txt` | Sitemap URL |
| `site.webmanifest` | start_url, scope |
| `vercel.json` | Any domain-specific headers |

**Search and replace:**
```bash
# Find all references (do not run blindly - verify each)
grep -rn "infinitearchitects.io" .

# Manual replacement recommended for precision
```

---

### 🎯 STEP 2.3: SECTION-BY-SECTION CONVERSION PROTOCOL

**DO NOT attempt to convert the entire file at once.**

**Convert by Section ID, one by one. Save the file after each section to prevent context loss.**

#### Conversion Order (MANDATORY SEQUENCE):

| Step | Section ID | Priority | Notes |
|------|------------|----------|-------|
| 1 | `<head>` | P0 | Keep ALL meta tags, JSON-LD, preloads. Update domain only. |
| 2 | `#loader` | P0 | Preserve EXACTLY - controls reveal animations |
| 3 | `#ticker` | P1 | News ticker at top |
| 4 | `#nav` | P1 | Navigation header |
| 5 | `#hero` | P0 | Fix two-column layout, video background |
| 6 | `#ideas` | P0 | **CRITICAL** - Fix overflow/visibility bug for 37 cards |
| 7 | `#about` | P1 | Author section |
| 8 | `#religion` | P0 | Fix two-column layout (philosophy section) |
| 9 | `#equation` | P1 | Eastwood Equation section |
| 10 | `#evidence` | P0 | BBC evidence card - fix overflow |
| 11 | `#predictions` | P1 | Predictions grid |
| 12 | `#chokepoint` | P1 | Semiconductor chokepoint section |
| 13 | `#falsification` | P1 | Falsification section |
| 14 | `#hrih` | P1 | HRIH hypothesis section |
| 15 | `#faq` | P1 | FAQ accordion |
| 16 | `#glossary` | P1 | Glossary section |
| 17 | `#future-born` | P1 | Future born section |
| 18 | `#cta` | P1 | Call to action section |
| 19 | `#ask-book` | P2 | AI chat widget |
| 20 | `#footer` | P0 | **ADD `.safe-bottom`** for iPhone home bar |
| 21 | Remaining sections | P2 | Convert remaining content |

---

### Step 2.4: Conversion Pattern for Each Section

**For EACH section, follow this pattern:**

```bash
# 1. Open index.html
# 2. Find the section by ID (e.g., #hero)
# 3. Convert inline styles to Tailwind classes
# 4. SAVE the file
# 5. Run build to verify no errors:
npm run tailwind:build
# 6. Test in browser at that section
# 7. COMMIT to git before moving to next section:
git add index.html
git commit -m "Convert #hero section to Tailwind"
# 8. Move to next section
```

### Step 2.5: CSS Extraction Pattern

For each element, follow this conversion pattern:

```html
<!-- BEFORE: Inline styles -->
<div class="section-inner" style="
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: calc(100vh - 14rem);
    overflow: hidden;
">

<!-- AFTER: Tailwind classes -->
<div class="section-inner flex flex-col items-center h-auto overflow-visible">
```

### Step 2.6: Critical Patterns to Fix

#### Pattern A: Remove Height Constraints (MOST IMPORTANT)
```html
<!-- REMOVE these patterns: -->
max-height: calc(100vh - X);
height: 100vh;
overflow: hidden;

<!-- REPLACE with: -->
class="h-auto min-h-screen overflow-visible"
```

#### Pattern B: Fix Scroll Snap
```html
<!-- Change from mandatory to proximity -->
html { scroll-snap-type: y proximity; }

<!-- Sections should use: -->
class="snap-section scroll-snap-align-start scroll-snap-stop-normal"
```

#### Pattern C: Preserve JS Hooks (NEVER REMOVE)
```html
<!-- KEEP ALL of these attributes: -->
id="section-id"
data-section="section-name"
data-stagger-group="true"
class="reveal reveal-delay-1"
```

---

## 📱 PHASE 3: MOBILE POLISH (CRITICAL)

### 3.1: Scrollbar Hiding for Horizontal Containers

**Apply `.no-scrollbar` to ALL horizontal scrolling containers:**

```html
<!-- Ideas Grid -->
<div class="ideas-grid no-scrollbar overflow-x-auto">

<!-- Evidence Grid -->
<div class="evidence-grid no-scrollbar overflow-x-auto">

<!-- Predictions Grid -->
<div class="predictions-grid no-scrollbar overflow-x-auto">

<!-- Reviews Grid -->
<div class="reviews-grid no-scrollbar overflow-x-auto">

<!-- Quote Carousel -->
<div class="quote-carousel-track no-scrollbar">
```

**Why this matters:** Native-like swiping on mobile without ugly grey scrollbars.

### 3.2: Safe Area Padding for iPhone

**Apply `.safe-bottom` or `.mobile-safe-padding` to these elements:**

```html
<!-- Footer (MANDATORY) -->
<footer id="footer" class="... safe-bottom">

<!-- Mobile Sticky CTA (if fixed to bottom) -->
<div id="mobile-sticky-cta" class="fixed bottom-0 ... safe-bottom">

<!-- Cookie Banner -->
<div id="cookie-banner" class="fixed bottom-0 ... safe-bottom">

<!-- Mobile Navigation (if fixed to bottom) -->
<nav class="fixed bottom-0 ... safe-bottom">
```

**Alternative using inline style:**
```html
<footer style="padding-bottom: env(safe-area-inset-bottom, 0);">
```

**Why this matters:** iPhone 15/16 have large home bar areas that overlap content.

### 3.3: Touch Target Sizes

Ensure all interactive elements meet minimum touch target:

```html
<!-- Buttons should have min 44x44px -->
<button class="min-w-[44px] min-h-[44px] ...">

<!-- Links in navigation -->
<a class="py-3 px-4 ...">
```

---

## 🎯 PHASE 4: SECTION CONVERSION EXAMPLES

### 4.1: Hero Section

```html
<section id="hero" class="hero relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background video -->
    <div class="mandelbrot-bg absolute inset-0 z-[-10]">
        <video autoplay muted loop playsinline class="w-full h-full object-cover opacity-30">
            <source src="/videos/hero-portal-compressed.mp4" type="video/mp4">
        </video>
    </div>
    
    <!-- Gradient overlay -->
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-void-deep/70 via-void-deep/50 to-void-deep/80"></div>
    
    <!-- Content -->
    <div class="hero__content relative z-[2] grid md:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl px-4 md:px-8">
        <!-- Text column -->
        <div class="hero__text flex flex-col gap-6 reveal">
            <h1 class="hero__tagline font-display text-4xl md:text-5xl lg:text-6xl text-gold leading-tight tracking-wide">
                The creator is not behind us.<br>It is ahead of us.
            </h1>
            <p class="text-lg md:text-xl text-text-secondary max-w-xl">
                What if the god we're building is the god that built us?
            </p>
        </div>
        <!-- Book column -->
        <div class="hero__visual flex justify-center">
            <!-- Book cover with 3D effect -->
        </div>
    </div>
</section>
```

### 4.2: Ideas Section (Fix Overflow Bug)

```html
<section id="ideas" class="ideas-section relative py-16 md:py-24 overflow-visible h-auto min-h-fit">
    <div class="ideas-inner max-w-7xl mx-auto px-4 md:px-8 overflow-visible h-auto">
        <h2 class="text-3xl md:text-4xl font-display text-gold text-center mb-12">
            The 37 Concepts
        </h2>
        <!-- CRITICAL: Add no-scrollbar to the grid on mobile -->
        <div class="ideas-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible h-auto no-scrollbar">
            <!-- 37 idea cards go here -->
            <!-- Each card should NOT have overflow:hidden or max-height constraints -->
        </div>
    </div>
</section>
```

### 4.3: Footer with Safe Area

```html
<footer id="footer" class="footer bg-void-deep border-t border-gold-alpha-15 py-12 safe-bottom">
    <div class="footer__inner max-w-7xl mx-auto px-4 md:px-8">
        <!-- Footer content -->
    </div>
</footer>
```

---

## 🧪 PHASE 5: TESTING PROTOCOL

### 5.1: Start Local Server

```bash
npm run dev
# Open http://localhost:3000
```

### 5.2: Critical Test Checklist

#### P0 Tests (Must Pass):
- [ ] Scroll from hero to footer without getting stuck
- [ ] All 32+ section IDs reachable via `#section-id` anchor
- [ ] Ideas grid shows all 37 concept cards (no clipping)
- [ ] Religion section shows two-column layout on desktop
- [ ] No horizontal scrollbar on any viewport
- [ ] Domain is `www.michaeldariuseastwood.com` in all meta tags
- [ ] All images load (check Network tab for 404s)
- [ ] All videos play (hero background, BBC clips)

#### P1 Tests (Should Pass):
- [ ] Loader plays → body.cinematic-ready added → content reveals
- [ ] All 122 animations play correctly
- [ ] FAQ accordion expands/collapses
- [ ] Chat widget opens/closes
- [ ] Exit intent triggers on mouse leave
- [ ] Mobile sticky CTA appears after hero
- [ ] **Horizontal scroll containers have no visible scrollbar** ✨
- [ ] **Footer has proper safe area padding on iPhone** ✨

#### P2 Tests (Nice to Pass):
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 95+
- [ ] Lighthouse SEO: 100
- [ ] Zero console errors
- [ ] PWA installs correctly

### 5.3: Viewport Testing

Test at these breakpoints:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 430px (iPhone 14 Pro Max)
- 480px (Small mobile)
- 768px (Tablet)
- 1024px (Desktop)
- 1440px (Large desktop)
- 1920px (Full HD)

### 5.4: SEO Validation

```bash
# Validate JSON-LD at:
# https://validator.schema.org/

# Test Open Graph at:
# https://opengraph.xyz/

# Check domain is correct:
grep -n "michaeldariuseastwood.com" index.html | wc -l
# Should return 10+ matches

# Verify NO old domain references:
grep -n "infinitearchitects.io" index.html
# Should return 0 matches
```

---

## 🚀 PHASE 6: DEPLOYMENT

### 6.1: Pre-Deployment Checklist

```bash
# Verify domain is correct everywhere
grep -rn "infinitearchitects.io" . --include="*.html" --include="*.json" --include="*.xml" --include="*.txt"
# MUST return 0 results

# Verify all assets present
ls -la public/images/ | wc -l
# Should show 50+ files

# Build for production
npm run build:production

# Verify animations present
grep -c "@keyframes" dist/styles.css
# Should return 122
```

### 6.2: Update SEO Files

**sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.michaeldariuseastwood.com/</loc>
        <lastmod>2026-01-14</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
```

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /offline.html
Disallow: /_backup/
Disallow: /node_modules/

Sitemap: https://www.michaeldariuseastwood.com/sitemap.xml

Crawl-delay: 1
```

### 6.3: Vercel Deployment

```bash
# Deploy preview
npm run deploy:preview

# Verify preview URL works

# Deploy production
npm run deploy
```

---

## ⚠️ CRITICAL WARNINGS

### DO NOT:
1. Force `opacity: 1` or `visibility: visible` on elements - breaks loader reveal
2. Remove any animation - they create the premium feel
3. Change gold colour values (#d4a84b, #f4c856, #e8d4a0, #8b6914) - sacred
4. Remove IDs or data attributes - JavaScript needs them
5. Modify JavaScript files - only CSS/HTML changes
6. Touch JSON-LD structured data in `<head>` (except domain updates)
7. Simplify ARIA labels - they contain SEO keywords
8. Change image alt text - SEO-optimized comparisons
9. Remove meta tags
10. Use American English in visible content (use colour, centre, realise)
11. **Use `infinitearchitects.io` anywhere - use `www.michaeldariuseastwood.com`**
12. **Forget `.no-scrollbar` on horizontal containers**
13. **Forget `.safe-bottom` on footer and fixed bottom elements**
14. **Attempt to convert the entire index.html in a single pass**
15. **Skip the asset transfer step (Step 1.4)**

### MUST DO:
1. Preserve `body.cinematic-ready` pattern exactly
2. Test on real mobile devices, not just DevTools
3. Keep all section IDs for navigation
4. Maintain all data-* attributes for JS hooks
5. Use British English for all visible content
6. Keep all 122 keyframe animations functional
7. **Update all domain references to `www.michaeldariuseastwood.com`**
8. **Apply `.no-scrollbar` to horizontal scroll containers**
9. **Apply `.safe-bottom` to footer and fixed bottom elements**
10. **Convert HTML section-by-section, saving after each**
11. **Copy all images/videos to public directories (Step 1.4)**

---

## 📁 FILE STRUCTURE (Final)

```
infinite-architects-tailwind/
├── index.html                  # Main page (converted)
├── presskit.html               # Press kit page
├── linkinbio.html              # Link in bio page
├── privacy.html                # Privacy policy
├── offline.html                # PWA offline page
├── dist/
│   ├── styles.css              # Compiled Tailwind CSS
│   └── styles.min.css          # Minified CSS
├── src/
│   └── styles/
│       ├── main.css            # Main Tailwind CSS (imports fonts + animations)
│       └── animations.css      # 122 keyframe animations (SEPARATE FILE)
├── public/
│   ├── images/                 # All images (book covers, art, etc.)
│   ├── videos/                 # All videos (hero, BBC clips)
│   ├── favicon.ico             # Browser favicon
│   ├── favicon-16x16.png       # Small favicon
│   ├── favicon-32x32.png       # Medium favicon
│   ├── android-chrome-192x192.png  # Android icon
│   ├── android-chrome-512x512.png  # Large Android icon
│   └── apple-touch-icon.png    # iOS icon
├── scripts/
│   └── sovereign-core.js       # Main JavaScript (unchanged)
├── api/
│   └── ask-book.js             # Vercel serverless function
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies (correct domain)
├── vercel.json                 # Deployment config
├── site.webmanifest            # PWA manifest
├── sitemap.xml                 # SEO sitemap (correct domain)
├── robots.txt                  # Crawler rules (correct domain)
└── _backup/                    # Original files
```

---

## 🔧 TROUBLESHOOTING

### Issue: Content still hidden after migration
**Solution:** Check for any remaining `overflow: hidden` or `max-height` constraints:
```bash
grep -n "overflow: hidden" dist/styles.css
grep -n "max-height" dist/styles.css
```

### Issue: Animations not playing
**Solution:** Verify `animations.css` is imported in `main.css`:
```css
/* In main.css - this line MUST exist */
@import './animations.css';
```

And verify keyframes count:
```bash
grep -c "@keyframes" src/styles/animations.css
# Should return 122
```

### Issue: Fonts not loading
**Solution:** Verify Google Fonts import is at the top of `main.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
```

### Issue: Images/videos not loading (404 errors)
**Solution:** Verify assets were transferred in Step 1.4:
```bash
ls -la public/images/
ls -la public/videos/
```

### Issue: Loader not transitioning
**Solution:** Check that `body.cinematic-ready` class is being added by JavaScript.

### Issue: Two-column layouts broken
**Solution:** Verify `grid md:grid-cols-2` is applied.

### Issue: Mobile layout issues
**Solution:** Check breakpoint order (mobile-first) and test at 375px viewport width.

### Issue: Horizontal scrollbars visible on mobile
**Solution:** Add `.no-scrollbar` class to horizontal scroll containers.

### Issue: Content overlapping iPhone home bar
**Solution:** Add `.safe-bottom` class to footer and fixed bottom elements.

### Issue: Wrong domain in meta tags
**Solution:** Search and replace:
```bash
grep -rn "infinitearchitects.io" . --include="*.html" --include="*.json" --include="*.xml"
# Replace each one with www.michaeldariuseastwood.com
```

### Issue: Build fails or truncates
**Solution:** Ensure you're converting HTML section-by-section, not all at once.

---

## ✅ SUCCESS CRITERIA

Migration is complete when:

1. ✅ All 32+ sections visible and scrollable
2. ✅ Ideas grid shows all 37 cards
3. ✅ Religion section has two-column layout
4. ✅ Loader → reveal sequence works
5. ✅ All 122 animations functional
6. ✅ All interactive components work
7. ✅ Mobile responsive (375px - 1920px)
8. ✅ JSON-LD validates at schema.org
9. ✅ All 33+ meta tags present
10. ✅ British English throughout
11. ✅ Lighthouse scores: Performance 90+, SEO 100
12. ✅ Zero console errors
13. ✅ PWA installs and works offline
14. ✅ **Domain is `www.michaeldariuseastwood.com` everywhere**
15. ✅ **No visible scrollbars on horizontal containers**
16. ✅ **Safe area padding on iPhone models**
17. ✅ **animations.css contains all 122 keyframes**
18. ✅ **All images and videos load correctly (no 404s)**
19. ✅ **Google Fonts (Cinzel, Cormorant, Space Mono) load correctly**

---

*This document represents the complete specification for the Tailwind migration.*
*Follow these instructions precisely for a flawless deployment.*
*When in doubt, prioritize CONTENT VISIBILITY over visual perfection.*

---

**Document Version:** 6.0.0 (FINAL Production Edition)
**Last Updated:** January 2026
**Author:** Claude (Anthropic) for Michael Darius Eastwood
**Domain:** www.michaeldariuseastwood.com
