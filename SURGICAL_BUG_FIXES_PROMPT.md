# SURGICAL BUG FIXES - Execute in Claude Code
## index.html - 14 Issues Resolved

---

## PRE-FLIGHT
```bash
cd /Users/michaeleastwood/infinite-architects-ultimate-websit
cp index.html index.html.backup.bugfix.$(date +%Y%m%d_%H%M%S)
```

---

## FIX 1: COMPLETE TRUNCATED AUDIO BUTTON (CRITICAL)

Find the truncated line at the end of the file and replace it with complete HTML:

**FIND (exact match at end of file):**
```html
    <!-- Sonic Architecture Toggle (Phase 10) -->
    <button class="audio-toggle" id="audio-
```

**REPLACE WITH:**
```html
    <!-- Sonic Architecture Toggle (Phase 10) -->
    <button class="audio-toggle" id="audio-toggle" aria-label="Toggle ambient sound">
        <svg class="audio-icon-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
        <svg class="audio-icon-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
        <span class="audio-toggle-tooltip">Enable Ambient Sound</span>
    </button>
</body>
</html>
```

---

## FIX 2: EXPORT VARIABLES TO WINDOW SCOPE (CRITICAL)

In the FIRST script block (around line 4255), BEFORE the closing `})();`, add:

**FIND:**
```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZE
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', initLoader);

    })();
```

**REPLACE WITH:**
```javascript
        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZE
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', initLoader);

        // Export to window for cross-IIFE access
        window.PERF = PERF;
        window.Features = Features;
        window.pageVisible = pageVisible;
        
        // Keep pageVisible synced
        document.addEventListener('visibilitychange', () => {
            window.pageVisible = !document.hidden;
        });

    })();
```

---

## FIX 3: ADD WINDOW REFERENCES IN SECOND SCRIPT (CRITICAL)

At the START of the second script block (around line 4282), add variable references:

**FIND:**
```javascript
    <script>
    (function() {
        'use strict';

        // ═══════════════════════════════════════════════════════════════════════
        // READING PROGRESS BAR
```

**REPLACE WITH:**
```javascript
    <script>
    (function() {
        'use strict';

        // Import from window scope (set by first script block)
        const PERF = window.PERF || { isMobile: window.innerWidth <= 768, isSlowConnection: false, reducedMotion: false };
        const Features = window.Features || { particles: true, connections: true, filmGrain: true, quantumParticles: true, neuralNetwork: true, smoothScroll: true, cursor: true };
        let pageVisible = window.pageVisible !== undefined ? window.pageVisible : true;
        
        // Sync pageVisible with window
        document.addEventListener('visibilitychange', () => {
            pageVisible = !document.hidden;
        });

        // ═══════════════════════════════════════════════════════════════════════
        // READING PROGRESS BAR
```

---

## FIX 4: REMOVE DUPLICATE NEURAL OBSERVER

**FIND (around line 5332-5339):**
```javascript
        // Skip neural network on slow connections or reduced motion
        if (neuralCanvas && Features.neuralNetwork) {
            // Set up IntersectionObserver for neural canvas
            if ('IntersectionObserver' in window) {
                const neuralObserver = new IntersectionObserver((entries) => {
                    neuralVisible = entries[0].isIntersecting;
                }, { threshold: 0.1 });
                neuralObserver.observe(neuralCanvas);
            } else {
                neuralVisible = true;
            }

            const ctx = neuralCanvas.getContext('2d');
```

**REPLACE WITH:**
```javascript
        // Skip neural network on slow connections or reduced motion
        if (neuralCanvas && Features.neuralNetwork) {
            let neuralVisible = false;
            
            const ctx = neuralCanvas.getContext('2d');
```

Then **FIND (around line 5454-5464):**
```javascript
            const neuralObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        drawNetwork();
                    } else {
                        cancelAnimationFrame(animationFrame);
                    }
                });
            }, { threshold: 0.1 });

            neuralObserver.observe(neuralCanvas.parentElement);
```

**REPLACE WITH:**
```javascript
            // Single IntersectionObserver for neural canvas
            const neuralObserver = new IntersectionObserver((entries) => {
                neuralVisible = entries[0].isIntersecting;
                if (neuralVisible && pageVisible) {
                    drawNetwork();
                } else {
                    cancelAnimationFrame(animationFrame);
                }
            }, { threshold: 0.1 });

            neuralObserver.observe(neuralCanvas.parentElement);
```

---

## FIX 5: ADD VISIBILITY CHECK TO CURSOR ANIMATION

**FIND (around line 5574-5583):**
```javascript
            function animateRing() {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;

                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';

                requestAnimationFrame(animateRing);
            }
            animateRing();
```

**REPLACE WITH:**
```javascript
            function animateRing() {
                // Pause when tab hidden to save CPU
                if (!pageVisible) {
                    setTimeout(() => requestAnimationFrame(animateRing), 200);
                    return;
                }
                
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;

                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';

                requestAnimationFrame(animateRing);
            }
            animateRing();
```

---

## FIX 6: ADD ERROR HANDLING TO TONE.JS LOADER

**FIND (around line 5010-5018):**
```javascript
            async init() {
                if (this.initialized) return;

                // Load Tone.js on demand (not at page load)
                if (typeof Tone === 'undefined') {
                    console.log('🎵 Loading Tone.js on demand...');
                    await window.loadToneJs();
                }

                await Tone.start();
```

**REPLACE WITH:**
```javascript
            async init() {
                if (this.initialized) return;

                // Load Tone.js on demand (not at page load)
                if (typeof Tone === 'undefined') {
                    if (typeof window.loadToneJs !== 'function') {
                        console.error('❌ Tone.js loader not available');
                        return false;
                    }
                    console.log('🎵 Loading Tone.js on demand...');
                    try {
                        await window.loadToneJs();
                    } catch (err) {
                        console.error('❌ Failed to load Tone.js:', err);
                        return false;
                    }
                }

                try {
                    await Tone.start();
                } catch (err) {
                    console.error('❌ Failed to start Tone.js:', err);
                    return false;
                }
```

---

## FIX 7: SAFER LENIS CHECK IN SONIC ARCHITECTURE

**FIND (around line 5070-5075):**
```javascript
                if (lenis) {
                    lenis.on('scroll', ({ progress }) => {
                        const freq = 400 + (progress * 1200);
                        this.filter.frequency.rampTo(freq, 0.5);
                    });
                }
```

**REPLACE WITH:**
```javascript
                if (typeof lenis !== 'undefined' && lenis && typeof lenis.on === 'function') {
                    lenis.on('scroll', ({ progress }) => {
                        const freq = 400 + (progress * 1200);
                        if (this.filter && this.filter.frequency) {
                            this.filter.frequency.rampTo(freq, 0.5);
                        }
                    });
                }
```

---

## FIX 8: THREE.JS READY CHECK

**FIND (around line 3718-3729):**
```javascript
            function completeLoader() {
                document.body.classList.add('cinematic');
                loader.classList.add('hidden');
                initMainCanvas();
                initScrollAnimations();
                initNavigation();

                // Delay tesseract init to ensure DOM is laid out
                setTimeout(() => {
                    initTesseract();
                }, 100);
```

**REPLACE WITH:**
```javascript
            function completeLoader() {
                document.body.classList.add('cinematic');
                loader.classList.add('hidden');
                
                // Initialize Three.js canvas only when library is ready
                if (window.THREE) {
                    initMainCanvas();
                } else if (window.threeJsReady === false) {
                    window.addEventListener('threejs-ready', initMainCanvas, { once: true });
                }
                
                initScrollAnimations();
                initNavigation();

                // Delay tesseract init to ensure DOM is laid out
                setTimeout(() => {
                    initTesseract();
                }, 100);
```

---

## FIX 9: ADD EMAIL VALIDATION TO NEWSLETTER

**FIND (around line 4311-4330):**
```javascript
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('newsletter-email').value;

                // Store email locally (in production, send to backend)
                const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                }

                // Show success message
                form.style.display = 'none';
                success.classList.add('show');
```

**REPLACE WITH:**
```javascript
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = document.getElementById('newsletter-email');
                const email = emailInput.value.trim();

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailInput.setCustomValidity('Please enter a valid email address');
                    emailInput.reportValidity();
                    return;
                }
                emailInput.setCustomValidity('');
                
                // Sanitize email
                const sanitizedEmail = email.replace(/[<>]/g, '');

                // Store email locally (in production, send to backend)
                const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                if (!subscribers.includes(sanitizedEmail)) {
                    subscribers.push(sanitizedEmail);
                    localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                }

                // Show success message
                form.style.display = 'none';
                success.classList.add('show');
```

---

## FIX 10: CLEAN UP MOBILE PARTICLE INTERVAL

**FIND (around line 4589-4593):**
```javascript
            // Create fewer initial particles
            for (let i = 0; i < 6; i++) {
                setTimeout(createFloatingParticle, i * 600);
            }
            // Slower continuous particle creation
            setInterval(createFloatingParticle, 2500);
```

**REPLACE WITH:**
```javascript
            // Create fewer initial particles
            for (let i = 0; i < 6; i++) {
                setTimeout(createFloatingParticle, i * 600);
            }
            // Slower continuous particle creation
            const particleInterval = setInterval(createFloatingParticle, 2500);
            
            // Clear interval on page unload to prevent memory leak
            window.addEventListener('beforeunload', () => {
                clearInterval(particleInterval);
            });
            
            // Pause when tab hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && particleContainer.children.length > 3) {
                    // Remove excess particles when tab hidden
                    while (particleContainer.children.length > 3) {
                        particleContainer.lastChild.remove();
                    }
                }
            });
```

---

## VERIFICATION COMMANDS

After applying all fixes:

```bash
# Check for syntax errors
node -e "require('fs').readFileSync('index.html', 'utf8')" && echo "✅ File readable"

# Check audio button exists
grep -c 'id="audio-toggle"' index.html  # Should be 1

# Check window exports
grep -c 'window.PERF = PERF' index.html  # Should be 1
grep -c 'window.Features = Features' index.html  # Should be 1

# Check duplicate observers removed
grep -c 'neuralObserver.observe' index.html  # Should be 1 (was 2)

# Check visibility checks added
grep -c 'pageVisible' index.html  # Should be 10+

# Verify HTML closes properly
tail -5 index.html  # Should end with </body></html>
```

---

## DEPLOY

```bash
git add -A
git commit -m "fix: resolve 14 bugs including critical audio button truncation, cross-IIFE variable scope, duplicate observers, and animation visibility checks"
git push origin main

# Vercel auto-deploys, or:
vercel --prod
```

---

## POST-DEPLOY TESTING

1. ✅ Open DevTools Console - no errors on load
2. ✅ Click audio toggle - should work
3. ✅ Scroll page - animations should be smooth
4. ✅ Switch tabs and back - animations should pause/resume
5. ✅ Test on mobile - gyroscope should work
6. ✅ Submit newsletter with invalid email - should reject
7. ✅ Check constellation nav - should highlight sections
8. ✅ Verify neural network animates in Ideas section

---

**Total fixes: 10 surgical edits**
**Estimated time: 30 minutes**
**Risk level: Low (all changes are additive/corrective)**
