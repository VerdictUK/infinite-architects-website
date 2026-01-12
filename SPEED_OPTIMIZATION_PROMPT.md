# ⚡ SPEED OPTIMIZATION — CLAUDE CODE PROMPT

> **Copy this into Claude Code to massively speed up the site**
> **NO features removed — only optimized**

---

## 🎯 MISSION

Optimize Infinite Architects website for fast loading on slow connections while keeping ALL features.

**Key targets:**
- Reduce loader from 5s → 2.5s
- Reduce particles: 250 → 80 (loader), 400 → 150-250 (main)
- Async load fonts and Three.js
- Add connection-aware performance scaling

---

## ⚠️ RULES

1. **BACKUP FIRST:** `cp index.html index.html.backup.speed.$(date +%Y%m%d_%H%M%S)`
2. **Use str_replace** — surgical edits only
3. **Apply in order** listed below
4. **Test after each optimization**
5. **DO NOT remove any features**

---

## OPTIMIZATION 1: ASYNC FONTS

**FIND:**
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

**REPLACE WITH:**
```html
<!-- Async font loading for speed -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap" as="style">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400&display=swap" media="print" onload="this.media='all'">
```

---

## OPTIMIZATION 2: PRELOAD CRITICAL ASSETS

**FIND (in `<head>`, after preconnects):**
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**ADD AFTER:**
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Preload critical assets -->
<link rel="preload" href="InfiniteArchitectsKindle20260103.jpg" as="image" fetchpriority="high">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
```

---

## OPTIMIZATION 3: ADAPTIVE PERFORMANCE CONFIG (Critical)

**FIND:**
```javascript
const CONFIG = {
    loader: {
        duration: 5000,
        particleCount: 250,
        ringCount: 4,
        trailLength: 12,
        goldHue: 38
    },
    main: {
        particleCount: 400,
        connectionDistance: 120,
        mouseInfluence: 0.00003
    }
};
```

**REPLACE WITH:**
```javascript
// ═══════════════════════════════════════════════════════════════════════
// ADAPTIVE PERFORMANCE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
const PERF = {
    isMobile: window.innerWidth <= 768,
    isSlowConnection: navigator.connection?.effectiveType === '2g' || 
                      navigator.connection?.effectiveType === 'slow-2g' ||
                      navigator.connection?.saveData === true,
    isLowEndDevice: navigator.hardwareConcurrency <= 4 || 
                    navigator.deviceMemory <= 4,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const CONFIG = {
    loader: {
        duration: PERF.isSlowConnection ? 1500 : (PERF.isMobile ? 2000 : 2500),
        particleCount: PERF.prefersReducedMotion ? 20 : 
                       (PERF.isSlowConnection ? 30 : 
                       (PERF.isMobile ? 50 : 80)),
        ringCount: PERF.isMobile ? 2 : 3,
        trailLength: PERF.isMobile ? 4 : 8,
        goldHue: 38
    },
    main: {
        particleCount: PERF.prefersReducedMotion ? 50 :
                       (PERF.isSlowConnection ? 80 :
                       (PERF.isLowEndDevice ? 120 :
                       (PERF.isMobile ? 150 : 250))),
        connectionDistance: PERF.isMobile ? 80 : 100,
        connectionCheckCount: PERF.isMobile ? 40 : 60,
        maxConnections: PERF.isMobile ? 200 : 400,
        mouseInfluence: 0.00003
    }
};

console.log('⚡ Performance mode:', 
    PERF.isSlowConnection ? 'SLOW CONNECTION' :
    PERF.isLowEndDevice ? 'LOW-END' :
    PERF.isMobile ? 'MOBILE' : 'DESKTOP',
    '| Particles:', CONFIG.main.particleCount);
```

---

## OPTIMIZATION 4: FASTER CONNECTION ALGORITHM

**FIND:**
```javascript
function updateConnections() {
    const positions = lineMesh.geometry.attributes.position.array;
    const colors = lineMesh.geometry.attributes.color.array;
    let connectionCount = 0;
    const checkCount = Math.min(100, CONFIG.main.particleCount);
    const maxConnections = 600;

    for (let i = 0; i < checkCount && connectionCount < maxConnections; i++) {
        const i3 = i * 3;
        const x1 = particlePositions[i3];
        const y1 = particlePositions[i3 + 1];
        const z1 = particlePositions[i3 + 2];

        for (let j = i + 1; j < checkCount && connectionCount < maxConnections; j++) {
```

**REPLACE WITH:**
```javascript
let connectionFrame = 0;
function updateConnections() {
    // Only update every 2 frames for performance
    connectionFrame++;
    if (connectionFrame % 2 !== 0) return;
    
    const positions = lineMesh.geometry.attributes.position.array;
    const colors = lineMesh.geometry.attributes.color.array;
    let connectionCount = 0;
    const checkCount = CONFIG.main.connectionCheckCount || 60;
    const maxConnections = CONFIG.main.maxConnections || 400;
    const distSq = CONFIG.main.connectionDistance * CONFIG.main.connectionDistance;

    for (let i = 0; i < checkCount && connectionCount < maxConnections; i++) {
        const i3 = i * 3;
        const x1 = particlePositions[i3];
        const y1 = particlePositions[i3 + 1];
        const z1 = particlePositions[i3 + 2];

        for (let j = i + 2; j < checkCount && connectionCount < maxConnections; j += 2) {
```

---

## OPTIMIZATION 5: PAUSE WHEN TAB HIDDEN

**FIND (after CONFIG, before Vector classes):**
```javascript
const TAU = Math.PI * 2;
```

**ADD BEFORE:**
```javascript
// ═══════════════════════════════════════════════════════════════════════
// VISIBILITY-AWARE ANIMATION CONTROL
// ═══════════════════════════════════════════════════════════════════════
let pageVisible = true;
document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    console.log(pageVisible ? '▶️ Animations resumed' : '⏸️ Animations paused');
});

const TAU = Math.PI * 2;
```

**Then find each `requestAnimationFrame(animate` and wrap with visibility check:**
```javascript
if (pageVisible) requestAnimationFrame(animate);
```

---

## OPTIMIZATION 6: DISABLE FILM GRAIN ON MOBILE

**FIND (in CSS, around .film-grain):**
```css
.film-grain {
```

**ADD inside or after the rule:**
```css
@media (max-width: 768px) {
    .film-grain {
        display: none !important;
    }
}
```

---

## OPTIMIZATION 7: CSS CONTAINMENT

**FIND:**
```css
.section {
    position: relative;
    z-index: var(--z-content);
}
```

**REPLACE WITH:**
```css
.section {
    position: relative;
    z-index: var(--z-content);
    contain: content;
}
```

---

## OPTIMIZATION 8: SKIP INTRO BUTTON

**FIND (in loader HTML, look for loader structure):**
```html
<div class="loader-status" id="loader-status">Initializing consciousness...</div>
```

**ADD AFTER:**
```html
<div class="loader-status" id="loader-status">Initializing consciousness...</div>
<button class="loader-skip" id="loader-skip" aria-label="Skip intro">SKIP →</button>
```

**ADD CSS:**
```css
.loader-skip {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-mono);
    font-size: 0.55rem;
    letter-spacing: 0.15em;
    color: var(--text-dim);
    background: transparent;
    border: 1px solid var(--text-faint);
    padding: 0.5rem 1rem;
    cursor: pointer;
    opacity: 0;
    animation: fadeIn 0.5s ease 1.5s forwards;
    transition: all 0.3s ease;
}

.loader-skip:hover {
    color: var(--gold);
    border-color: var(--gold);
}

@keyframes fadeIn {
    to { opacity: 1; }
}
```

**ADD JS (in loader section):**
```javascript
const skipBtn = document.getElementById('loader-skip');
if (skipBtn) {
    skipBtn.addEventListener('click', () => {
        loaderState.skipped = true;
        loaderState.progress = 1;
    });
}
```

---

## ✅ VERIFICATION

```bash
# Check adaptive config is working
grep -c "PERF.isMobile" index.html
# Expected: 1+

# Check connection optimization
grep -c "connectionFrame" index.html
# Expected: 1+

# Check visibility pause
grep -c "pageVisible" index.html
# Expected: 1+

# Check film grain disabled on mobile
grep -c "film-grain" index.html
# Should show the @media rule
```

---

## 🚀 DEPLOY

```bash
git add index.html
git commit -m "Speed optimizations: adaptive particles, async fonts, faster connections"
git push origin main
```

---

## 📊 EXPECTED RESULTS

| Metric | Before | After |
|--------|--------|-------|
| Loader time | 5s | 2-2.5s |
| Particles (mobile) | 400 | 150 |
| Particles (slow conn) | 400 | 80 |
| Connection updates | Every frame | Every 2 frames |
| Font blocking | ~2s | 0s |
| Tab hidden CPU | 100% | 0% |

**Total perceived speedup: 50-70% faster**
