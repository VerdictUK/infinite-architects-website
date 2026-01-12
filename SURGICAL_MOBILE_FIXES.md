# 🔧 SURGICAL MOBILE FIXES — CLAUDE CODE PROMPT

> **CRITICAL:** Do NOT replace the entire index.html file. Make ONLY the targeted edits below.
> **Order:** Apply these fixes FIRST. Future Tier Enhancements (phases 8-17) come AFTER.

---

## 🎯 MISSION

Fix mobile issues on the deployed Infinite Architects website with **surgical precision**:
1. Blank content sections on mobile
2. iOS gyroscope not working
3. Excessive blank space on mobile
4. Hero content invisible on load

**DO NOT** replace the entire file. **DO NOT** break existing functionality.

---

## ⚠️ RULES

1. **BACKUP FIRST:** `cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)`
2. **READ the current file** before making any changes
3. **Use `str_replace`** for surgical edits — never overwrite the whole file
4. **Test after EACH fix** before moving to the next
5. **Preserve ALL existing code** — only ADD or MODIFY specific sections

---

## FIX 1: ADD MOBILE REVEAL VISIBILITY (CSS)

**What:** The `.reveal` class keeps content at `opacity: 0` until IntersectionObserver triggers. On mobile, this fails silently.

**Action:** Find the `.reveal` CSS and ADD a mobile override AFTER it.

**SEARCH FOR THIS (exact match):**
```css
.reveal.active {
    opacity: 1;
    transform: translateY(0);
}
```

**ADD THIS IMMEDIATELY AFTER:**
```css

/* CRITICAL FIX: Force content visibility on mobile */
@media (max-width: 768px) {
    .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
}
```

**Verification:**
```bash
grep -A2 "Force content visibility on mobile" index.html
```

---

## FIX 2: ADD RIPPLE KEYFRAMES (CSS)

**What:** The ripple animation is added dynamically via JS but may fail on some browsers.

**Action:** Add static keyframes to CSS.

**SEARCH FOR (find the end of reveal-delay classes):**
```css
.reveal-delay-5 { transition-delay: 0.5s; }
```

**ADD THIS IMMEDIATELY AFTER:**
```css

/* Ripple Effect Animation */
@keyframes rippleEffect {
    from { transform: scale(0); opacity: 0.6; }
    to { transform: scale(4); opacity: 0; }
}
```

**Verification:**
```bash
grep "rippleEffect" index.html | head -1
```

---

## FIX 3: ADD MOBILE HERO VISIBILITY (CSS)

**What:** Hero elements use CSS animations that may not trigger on mobile.

**Action:** Find the RESPONSIVE BREAKPOINTS section and ADD mobile hero fixes.

**SEARCH FOR:**
```css
@media (max-width: 768px) {
    .section {
```

**REPLACE THE ENTIRE `@media (max-width: 768px)` BLOCK** with this enhanced version:
```css
@media (max-width: 768px) {
    /* SECTIONS */
    .section {
        padding: var(--space-lg) var(--space-md);
    }

    /* HERO - Force Visibility */
    .hero {
        min-height: 100svh;
        padding: 100px var(--space-md) 80px;
    }
    
    .hero-badge,
    .hero-title,
    .hero-subtitle,
    .hero-author,
    .hero-cta,
    .hero-book {
        opacity: 1 !important;
        transform: none !important;
    }
    
    .hero-title {
        font-size: clamp(1.8rem, 10vw, 3rem);
        letter-spacing: 0.15em;
    }
    
    .hero-subtitle {
        font-size: clamp(0.9rem, 3.5vw, 1.2rem);
    }
    
    .hero-author {
        font-size: 0.7rem;
    }
    
    .scroll-indicator {
        display: none;
    }
    
    .hero::after {
        height: 150px;
    }

    .hero-book {
        width: min(260px, 65vw);
    }

    /* QUOTE - Reduce Height */
    .quote-section {
        min-height: 60vh;
        padding: var(--space-lg) var(--space-md);
    }
    
    .quote-mark {
        font-size: 6rem;
        margin-bottom: -1rem;
    }
    
    .quote-text {
        font-size: clamp(1.2rem, 5vw, 1.8rem);
        line-height: 1.6;
    }

    /* CTA - Reduce Height */
    .cta-section {
        min-height: 50vh;
        padding: var(--space-lg) var(--space-md);
    }
    
    .cta-title {
        font-size: clamp(1.3rem, 5vw, 2rem);
    }

    /* IDEAS - Tighter Grid */
    .ideas-header {
        margin-bottom: var(--space-lg);
    }
    
    .ideas-grid {
        gap: 1rem;
    }
    
    .idea-card {
        padding: 1.5rem;
    }
    
    .idea-number {
        font-size: 3rem;
        top: 0.2rem;
        right: 0.8rem;
    }
    
    .idea-title {
        font-size: 1rem;
        margin-bottom: 0.8rem;
    }
    
    .idea-text {
        font-size: 0.9rem;
        line-height: 1.7;
    }

    /* ABOUT */
    .about-section {
        padding: var(--space-lg) var(--space-md);
    }
    
    .about-inner {
        gap: 3rem;
    }
    
    .about-text p {
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }

    .tesseract-container {
        width: 220px;
        height: 220px;
    }

    /* CAROUSEL */
    .carousel-section {
        padding: var(--space-lg) 0;
    }
    
    .carousel-item {
        max-width: 280px;
        padding: 1rem 1.5rem;
        font-size: 0.95rem;
        line-height: 1.7;
    }
    
    .carousel-section::before,
    .carousel-section::after {
        width: 60px;
    }

    /* REVIEWS */
    .reviews-section {
        padding: var(--space-lg) var(--space-md);
    }
    
    .reviews-grid {
        gap: 1rem;
    }
    
    .review-card {
        padding: 1.5rem;
    }

    /* NEWSLETTER */
    .newsletter-section {
        padding: var(--space-lg) var(--space-md);
    }

    /* FOOTER */
    footer {
        padding: var(--space-lg) var(--space-md);
    }

    /* PERFORMANCE - Reduce Effects on Mobile */
    #canvas-container {
        opacity: 0.3;
    }
    
    .cosmic-bg {
        opacity: 0.7;
    }
    
    .film-grain {
        display: none;
    }
}
```

**Note:** This replaces the existing `@media (max-width: 768px)` block. Make sure you find the COMPLETE existing block and replace it entirely.

---

## FIX 4: UPDATE SCROLL ANIMATIONS JAVASCRIPT

**What:** The `initScrollAnimations` function uses IntersectionObserver which may fail silently on mobile.

**Action:** Replace the function to force visibility on mobile.

**SEARCH FOR:**
```javascript
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}
```

**REPLACE WITH:**
```javascript
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const isMobile = window.innerWidth <= 768;
    
    // Force visibility on mobile immediately
    if (isMobile) {
        reveals.forEach(el => el.classList.add('active'));
        return;
    }
    
    // Desktop: Use IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('active'));
    }
}
```

---

## FIX 5: UPDATE MOBILE ENHANCEMENTS FOR iOS GYROSCOPE

**What:** iOS 13+ requires explicit permission request for DeviceOrientationEvent.

**Action:** Find and replace the `initMobileEnhancements` function.

**SEARCH FOR the function that starts with:**
```javascript
function initMobileEnhancements() {
    if (window.innerWidth > 768) return;
```

**REPLACE THE ENTIRE FUNCTION** (from `function initMobileEnhancements()` to its closing `}`) with:
```javascript
function initMobileEnhancements() {
    if (window.innerWidth > 768) return;

    // Touch ripple effect
    function createRipple(e) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 168, 75, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - rect.left - 50}px;
            top: ${y - rect.top - 50}px;
        `;

        target.style.position = 'relative';
        target.style.overflow = 'hidden';
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.hero-cta, .cta-button, .nav-cta, .newsletter-button, .mobile-cta-button').forEach(el => {
        el.addEventListener('touchstart', createRipple, { passive: true });
    });

    // iOS Gyroscope with permission request
    const book = document.getElementById('hero-book');
    
    function initGyroscope() {
        if (!book) return;
        let lastGamma = 0, lastBeta = 0;
        
        function handleOrientation(e) {
            if (e.gamma === null || e.beta === null) return;
            const gamma = lastGamma + (e.gamma - lastGamma) * 0.1;
            const beta = lastBeta + (e.beta - lastBeta) * 0.1;
            lastGamma = gamma;
            lastBeta = beta;
            
            const tiltX = Math.max(-15, Math.min(15, gamma)) / 15;
            const tiltY = Math.max(-15, Math.min(15, beta - 45)) / 15;
            book.style.transform = `perspective(1000px) rotateY(${tiltX * 10}deg) rotateX(${-tiltY * 5}deg)`;
        }
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
    
    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        let permissionRequested = false;
        function requestGyroPermission() {
            if (permissionRequested) return;
            permissionRequested = true;
            DeviceOrientationEvent.requestPermission()
                .then(response => { if (response === 'granted') initGyroscope(); })
                .catch(console.error);
        }
        document.addEventListener('touchstart', requestGyroPermission, { once: true, passive: true });
    } else if (window.DeviceOrientationEvent) {
        initGyroscope();
    }

    // Haptic feedback
    function triggerHaptic(style = 'light') {
        if (navigator.vibrate) {
            const patterns = { light: 10, medium: 25, heavy: 50 };
            navigator.vibrate(patterns[style] || 10);
        }
    }

    document.querySelectorAll('a[href*="amazon"], .cta-button, .hero-cta, .mobile-cta-button').forEach(el => {
        el.addEventListener('touchstart', () => triggerHaptic('light'), { passive: true });
    });
}
```

---

## FIX 6: UPDATE MOBILE CTA SAFE AREA (CSS)

**What:** iPhone notch/home bar can overlap the sticky CTA.

**Action:** Find `.mobile-cta` CSS and update padding.

**SEARCH FOR:**
```css
.mobile-cta {
    display: none;
    position: fixed;
    bottom: 0;
```

**Find the `padding: 1rem;` line within that block and REPLACE it with:**
```css
    padding: 0.8rem 1rem;
    padding-bottom: calc(0.8rem + env(safe-area-inset-bottom, 0px));
```

---

## ✅ VERIFICATION CHECKLIST

After ALL fixes, run these checks:

```bash
echo "=== VERIFICATION ==="

echo "1. Mobile reveal fix:"
grep -c "opacity: 1 !important" index.html
# Expected: 2 or more

echo "2. Ripple keyframes:"
grep -c "@keyframes rippleEffect" index.html
# Expected: 1 or more

echo "3. iOS gyroscope permission:"
grep -c "requestPermission" index.html
# Expected: 1 or more

echo "4. Safe area support:"
grep -c "safe-area-inset" index.html
# Expected: 1

echo "5. Mobile scroll fix:"
grep -c "isMobile" index.html
# Expected: 1 or more
```

---

## 🚀 DEPLOYMENT

```bash
git add index.html
git commit -m "Surgical mobile fixes: visibility, iOS gyro, spacing"
git push origin main
```

---

## 📋 WHAT COMES NEXT

**AFTER these fixes are deployed and verified working:**

1. Test on actual mobile device (iOS Safari, Chrome)
2. Verify all content is visible
3. Verify gyroscope works after first touch (iOS)
4. THEN proceed to Future Tier Enhancements (phases 8-17)

---

## 🔴 TROUBLESHOOTING

**If content is still blank:**
- Check browser console for JS errors
- Verify the CSS `!important` rules are inside a `@media (max-width: 768px)` block

**If gyroscope still doesn't work on iOS:**
- User must touch the screen first (Apple security requirement)
- Only works on HTTPS (Vercel provides this)

**If a fix breaks something:**
```bash
# Restore backup
cp index.html.backup.YYYYMMDD_HHMMSS index.html
git checkout index.html  # Or use git to restore
```
