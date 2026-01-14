# INFINITE ARCHITECTS - Master Enhancement Installation Guide

## For Claude Code: Step-by-Step Installation

This document provides precise instructions for installing the Infinite Architects website enhancements. Follow each step exactly.

---

## Pre-Installation Checklist

Before starting, verify you have:
- [ ] `index.html` - Main website file
- [ ] `sovereign.css` - Main stylesheet (or inline styles in index.html)
- [ ] `sovereign-core.js` - Core JavaScript (or inline scripts in index.html)
- [ ] Backup of all files created

---

## Installation Steps

### STEP 1: Create Backup

```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d_%H%M%S)

# Backup all critical files
cp index.html backups/$(date +%Y%m%d_%H%M%S)/
cp sovereign.css backups/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp sovereign-core.js backups/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

echo "✓ Backup created"
```

### STEP 2: Locate Hero Section in index.html

```bash
# Find the hero section start line
grep -n '<section class="hero' index.html | head -1

# Find the hero section end line (look for closing </section> after hero)
# The hero section typically spans approximately 100-150 lines
```

Expected output: Line number around 26580-26700

### STEP 3: Extract CSS from Master Enhancement File

The CSS section in `INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html` is contained within:
```html
<style id="ia-master-enhancements">
...
</style>
```

**Installation Method A: Add to existing inline styles**
1. Open `index.html`
2. Find the main `<style>` block (usually within `<head>`)
3. Add all CSS from the master file BEFORE the closing `</style>`

**Installation Method B: Create separate CSS file**
```bash
# Extract CSS to new file
# Copy everything between <style id="ia-master-enhancements"> and </style>
# Save as: enhancements.css

# Add link in index.html <head>:
# <link rel="stylesheet" href="enhancements.css">
```

### STEP 4: Replace Hero Section HTML

1. Open `index.html`
2. Find: `<section class="hero snap-section chromatic-lens" id="hero">`
3. Find the closing `</section>` for this hero
4. Replace the ENTIRE hero section with the HTML from the master file

**Critical: Preserve these elements if they exist:**
- Mandelbrot video background
- Book cover video element
- Any custom JavaScript hooks

### STEP 5: Add JavaScript

The JavaScript section in `INFINITE_ARCHITECTS_MASTER_ENHANCEMENT.html` is contained within:
```html
<script id="ia-master-enhancement-scripts">
...
</script>
```

**Installation:**
1. Open `index.html`
2. Find the main `<script>` block (usually before `</body>`)
3. Add the JavaScript INSIDE the existing script block
4. Ensure it's placed AFTER any dependent code (like `PERF` object, `gtag`, `safeInterval`)

### STEP 6: Verify ConvertKit Integration

The email capture uses your existing ConvertKit endpoint:
- Form ID: `8970906`
- Endpoint: `https://app.convertkit.com/forms/8970906/subscriptions`

**No changes needed if this is correct.** If your form ID differs, update in the JavaScript:
```javascript
const response = await fetch('https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions', {
```

### STEP 7: Test Installation

```bash
# Start local server for testing
python3 -m http.server 8000

# Or use Node.js
npx serve .
```

Open `http://localhost:8000` and verify:

**Desktop Testing:**
- [ ] Hero section loads with social proof bar
- [ ] Email capture form visible above Amazon button
- [ ] Book cover has mouse parallax effect
- [ ] Submit email → Success message appears
- [ ] Amazon button tracks click in console

**Mobile Testing (use DevTools device mode):**
- [ ] Layout responsive, no horizontal scroll
- [ ] Email form stacks vertically on small screens
- [ ] "Enable Tilt" button appears (iOS)
- [ ] All sections visible without cutoff
- [ ] Touch targets are 44px minimum

---

## File Structure After Installation

```
project/
├── index.html              # Main file (updated)
├── sovereign.css           # Styles (updated OR new enhancements.css)
├── sovereign-core.js       # Core JS (unchanged)
├── enhancements.css        # NEW (if using separate file)
└── backups/
    └── 20260114_XXXXXX/    # Backup folder
        ├── index.html
        ├── sovereign.css
        └── sovereign-core.js
```

---

## Quick Reference: Key Selectors

### New Hero Elements
```css
.hero-proof-bar          /* Social proof bar at top */
.hero-proof-item         /* Individual proof items */
.hero-email-capture      /* Email form container */
.hero-email-form         /* Form element */
.hero-email-input        /* Email input field */
.hero-email-submit       /* Submit button */
.hero-email-success      /* Success message */
.hero-cta-secondary      /* Amazon button (outline style) */
.hero-preview-link       /* Preview button */
.hero-trust-signals      /* Trust badges */
.hero-subtitle-secondary /* Second tagline with urgency */
```

### Gyroscope Classes
```css
.gyro-enabled            /* Added to body when gyro active */
.motion-enable-btn       /* iOS permission button */
```

### Layout Fix Classes
These override existing classes to fix mobile/desktop layouts:
- `.about-inner`
- `.ideas-grid`
- `.religion-inner`
- `.predictions-grid`
- `.falsification-grid`
- `.bbc-evidence-card`

---

## Troubleshooting

### Email Form Not Submitting
1. Check browser console for errors
2. Verify ConvertKit form ID is correct
3. Test network tab for failed requests
4. Ensure CORS is not blocking (shouldn't be an issue with ConvertKit)

### Gyroscope Not Working
1. iOS 13+ requires HTTPS for device orientation
2. Check browser supports `DeviceOrientationEvent`
3. Verify permission was granted
4. Test on physical device (not simulator)

### Layout Still Broken on Mobile
1. Clear browser cache
2. Check for CSS specificity conflicts (use `!important` if needed)
3. Verify all CSS was copied correctly
4. Check for duplicate class definitions

### Parallax Jittery
1. Reduce parallax multipliers in JavaScript
2. Check for conflicting transform styles
3. Verify `will-change: transform` is applied

---

## Performance Considerations

### Metrics to Monitor
- First Contentful Paint (FCP): Target < 1.8s
- Largest Contentful Paint (LCP): Target < 2.5s
- Cumulative Layout Shift (CLS): Target < 0.1
- Total Blocking Time (TBT): Target < 200ms

### Optimizations Applied
- Gyroscope uses `requestAnimationFrame` for smooth 60fps
- Mouse parallax uses interpolation to prevent jitter
- IntersectionObserver for efficient scroll reveals
- `passive: true` on all scroll/touch listeners
- `will-change` hints for GPU acceleration
- Respects `prefers-reduced-motion` preference

---

## Analytics Events Added

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `hero_email_signup` | Email form submit | `email_domain`, `method` |
| `hero_amazon_click` | Amazon button click | `value: 9.99` |

---

## Rollback Instructions

If something breaks:

```bash
# Restore from backup
cp backups/YYYYMMDD_XXXXXX/index.html ./index.html
cp backups/YYYYMMDD_XXXXXX/sovereign.css ./sovereign.css 2>/dev/null || true

# Clear browser cache and reload
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-14 | Initial release: Hero section, layout fixes, gyroscope |

---

## Support

If issues persist after following this guide:
1. Check browser console for JavaScript errors
2. Inspect Network tab for failed resource loads
3. Validate HTML with W3C Validator
4. Test in multiple browsers (Chrome, Safari, Firefox)

---

## Code Quality Standards Applied

- ✅ WCAG 2.1 AA accessibility (44px touch targets, contrast ratios)
- ✅ Mobile-first responsive design
- ✅ Progressive enhancement (works without JS)
- ✅ Graceful degradation for older browsers
- ✅ Memory-safe intervals/animations
- ✅ Battery-conscious (pauses when tab hidden)
- ✅ Respects user preferences (reduced motion)
- ✅ Semantic HTML structure
- ✅ CSS custom properties for theming
- ✅ No layout shifts on load (CLS optimized)
