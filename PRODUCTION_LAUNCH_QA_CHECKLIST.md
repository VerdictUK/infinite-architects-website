# INFINITE ARCHITECTS — PRODUCTION LAUNCH QA CHECKLIST

## Pre-Launch Quality Assurance

Complete every item before going live. A single ❌ blocks launch.

---

## 1. TECHNICAL FOUNDATION

### HTML Validation
- [ ] W3C HTML validation passes (https://validator.w3.org/)
- [ ] No broken internal links
- [ ] No broken external links
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] Document language set (`<html lang="en-GB">`)

### CSS
- [ ] No CSS errors in console
- [ ] All custom properties (--variables) defined
- [ ] Print stylesheet tested
- [ ] High contrast mode tested
- [ ] No `!important` overuse (max 5 occurrences)

### JavaScript
- [ ] No console errors on load
- [ ] No console errors during interaction
- [ ] No unhandled promise rejections
- [ ] All event listeners use passive where appropriate
- [ ] Memory leaks checked (Chrome DevTools → Memory)

---

## 2. SEO & DISCOVERABILITY

### Meta Tags
- [ ] Title tag present and under 60 characters
- [ ] Meta description present and under 160 characters
- [ ] Canonical URL correct
- [ ] Robots meta allows indexing

### Open Graph
- [ ] og:title present
- [ ] og:description present
- [ ] og:image present (1200x630px)
- [ ] og:url present
- [ ] og:type = "book"
- [ ] Facebook debugger shows correct preview

### Twitter Cards
- [ ] twitter:card = "summary_large_image"
- [ ] twitter:title present
- [ ] twitter:description present
- [ ] twitter:image present (1200x600px)
- [ ] Twitter card validator shows correct preview

### Structured Data
- [ ] JSON-LD present
- [ ] Schema.org validator passes
- [ ] Book schema complete
- [ ] Author schema complete
- [ ] FAQ schema complete
- [ ] Google Rich Results Test passes

### Technical SEO
- [ ] robots.txt allows crawling
- [ ] sitemap.xml exists and valid
- [ ] Sitemap submitted to Search Console
- [ ] No duplicate title tags
- [ ] No duplicate meta descriptions
- [ ] H1 present and unique
- [ ] Heading hierarchy logical (H1 → H2 → H3)

---

## 3. PERFORMANCE

### Core Web Vitals (Target: All Green)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] INP (Interaction to Next Paint) < 200ms

### Lighthouse Scores (Target: 90+)
- [ ] Performance: ___/100
- [ ] Accessibility: ___/100
- [ ] Best Practices: ___/100
- [ ] SEO: ___/100

### Resource Loading
- [ ] Critical CSS inlined or preloaded
- [ ] Fonts preloaded
- [ ] Images lazy loaded
- [ ] Images optimized (WebP with fallback)
- [ ] No render-blocking resources
- [ ] JavaScript deferred where possible

### Caching
- [ ] Cache headers set correctly
- [ ] Service worker active (if PWA)
- [ ] Static assets versioned for cache busting

---

## 4. ACCESSIBILITY (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Focus order logical (Tab through entire page)
- [ ] Focus visible on all elements
- [ ] Skip link works
- [ ] No keyboard traps
- [ ] Escape closes modals

### Screen Readers
- [ ] Page tested with VoiceOver (Mac)
- [ ] Page tested with NVDA (Windows)
- [ ] All images have meaningful alt text
- [ ] Form inputs have labels
- [ ] ARIA roles used correctly
- [ ] Live regions announce dynamic content

### Visual
- [ ] Color contrast ratio ≥ 4.5:1 (text)
- [ ] Color contrast ratio ≥ 3:1 (UI elements)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without breaking
- [ ] No horizontal scroll at 320px width

### Motion
- [ ] prefers-reduced-motion respected
- [ ] Animations can be paused
- [ ] No flashing content (epilepsy risk)

---

## 5. BROWSER COMPATIBILITY

### Desktop (test all)
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile (test all)
- [ ] iOS Safari (iPhone)
- [ ] iOS Safari (iPad)
- [ ] Chrome Android
- [ ] Samsung Internet

### Responsive Breakpoints
- [ ] 320px (small mobile)
- [ ] 375px (iPhone)
- [ ] 428px (iPhone Pro Max)
- [ ] 768px (tablet)
- [ ] 1024px (small desktop)
- [ ] 1440px (standard desktop)
- [ ] 1920px (large desktop)

---

## 6. FUNCTIONALITY

### Hero Section
- [ ] Book cover displays correctly
- [ ] Video background plays (if present)
- [ ] Social proof bar visible
- [ ] Live viewer count updates
- [ ] Email form visible and functional
- [ ] Amazon button links correctly
- [ ] Preview button triggers modal

### Email Capture
- [ ] Hero form submits to ConvertKit
- [ ] Exit intent form submits to ConvertKit
- [ ] Footer form submits (if present)
- [ ] Success messages display
- [ ] Error handling works
- [ ] localStorage fallback works
- [ ] Duplicate submissions prevented

### Navigation
- [ ] All menu items work
- [ ] Scroll-to-section smooth
- [ ] Mobile menu opens/closes
- [ ] Active states update on scroll

### Interactive Elements
- [ ] All buttons clickable
- [ ] All links work
- [ ] Share buttons function
- [ ] Quote sharing works
- [ ] Free chapter modal opens
- [ ] Chat widget works (if enabled)

### Conversion Elements
- [ ] Reading progress bar appears after hero
- [ ] Exit intent triggers on desktop
- [ ] Exit intent respects 24h cooldown
- [ ] Mobile sticky CTA appears
- [ ] Mobile sticky CTA hides in hero area

### Gyroscope/Parallax
- [ ] Desktop mouse parallax works
- [ ] iOS "Enable Tilt" button appears
- [ ] iOS permission flow works
- [ ] Android auto-starts gyroscope
- [ ] Effects pause when tab hidden
- [ ] prefers-reduced-motion disables effects

---

## 7. ANALYTICS & TRACKING

### Google Analytics
- [ ] GA4 property configured
- [ ] Page views tracking
- [ ] gtag loaded correctly

### Custom Events (verify in GA4 DebugView)
- [ ] hero_email_signup fires on form submit
- [ ] hero_amazon_click fires on buy button
- [ ] exit_intent_shown fires on popup
- [ ] exit_intent_conversion fires on popup submit
- [ ] mobile_sticky_click fires on sticky button
- [ ] scroll_depth fires at 25/50/75/90/100%
- [ ] time_on_page fires at 30/60/120/300/600s
- [ ] web_vitals fires with LCP/FID/CLS

### Error Tracking
- [ ] JavaScript errors logged to GA
- [ ] Unhandled rejections logged

---

## 8. SECURITY

### HTTPS
- [ ] SSL certificate valid
- [ ] All resources loaded over HTTPS
- [ ] No mixed content warnings
- [ ] HSTS header present

### Headers
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy set
- [ ] Content-Security-Policy considered

### Forms
- [ ] No sensitive data in URLs
- [ ] CSRF protection (if applicable)
- [ ] Input sanitization in place

---

## 9. CONTENT

### Copy
- [ ] No typos or grammatical errors
- [ ] All placeholder text replaced
- [ ] Copyright year correct (2026)
- [ ] Author name spelled correctly
- [ ] Book title consistent throughout
- [ ] Price accurate (£9.99)
- [ ] Amazon ASIN correct (B0DS2L8BVC)

### Legal
- [ ] Privacy policy link present
- [ ] Cookie consent (if required by jurisdiction)
- [ ] Copyright notice in footer

### Images
- [ ] Book cover high quality
- [ ] Author photo present
- [ ] All decorative images load
- [ ] No placeholder images remaining

---

## 10. FINAL CHECKS

### Cross-Team Review
- [ ] Developer sign-off
- [ ] Designer sign-off
- [ ] Content review complete
- [ ] Stakeholder approval

### Documentation
- [ ] README updated
- [ ] Deployment instructions documented
- [ ] Rollback procedure documented
- [ ] Analytics dashboard configured

### Monitoring
- [ ] Uptime monitoring configured
- [ ] Error alerting configured
- [ ] Performance monitoring active

---

## LAUNCH APPROVAL

| Role | Name | Sign-off | Date |
|------|------|----------|------|
| Developer | | ☐ | |
| QA | | ☐ | |
| Stakeholder | | ☐ | |

---

## POST-LAUNCH (Within 24 Hours)

- [ ] Verify GA4 receiving data
- [ ] Check Search Console for indexing
- [ ] Monitor error logs
- [ ] Test email delivery (check spam folder)
- [ ] Social media share test
- [ ] Submit to Product Hunt (if planned)
- [ ] Announce on social channels

---

**Do not launch until ALL items are checked.**

Launch Date: ____________
Launch Time: ____________
Launched By: ____________
