    <!-- Exit Intent Popup -->
    <div class="exit-popup-overlay" id="exit-popup-overlay"></div>
    <div class="exit-popup" id="exit-popup">
        <button class="exit-popup-close" id="exit-popup-close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <h3 class="exit-popup-title">WAIT — BEFORE YOU GO</h3>
        <p class="exit-popup-text">The future of intelligence is being written now. Do not miss your chance to understand it before everyone else does.</p>
        <a href="https://www.amazon.com/dp/B0GFD2GCCQ" target="_blank" rel="noopener" class="exit-popup-cta">
            GET YOUR COPY NOW
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </a>
        <button class="exit-popup-dismiss" id="exit-popup-dismiss">No thanks, I will miss out</button>
    </div>

    <!-- Additional Enhancement Scripts -->
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
        // ═══════════════════════════════════════════════════════════════════════
        function initReadingProgress() {
            const progressBar = document.getElementById('reading-progress');
            if (!progressBar) return;

            function updateProgress() {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
            }

            window.addEventListener('scroll', updateProgress, { passive: true });
            updateProgress();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // NEWSLETTER FORM
        // ═══════════════════════════════════════════════════════════════════════
        function initNewsletter() {
            const form = document.getElementById('newsletter-form');
            const success = document.getElementById('newsletter-success');
            if (!form || !success) return;

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

                // Sanitize email (remove potential HTML)
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

                // Track event (placeholder for analytics)
                if (typeof gtag === 'function') {
                    gtag('event', 'newsletter_signup', { email_domain: email.split('@')[1] });
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // EXIT INTENT POPUP
        // ═══════════════════════════════════════════════════════════════════════
        function initExitIntent() {
            const overlay = document.getElementById('exit-popup-overlay');
            const popup = document.getElementById('exit-popup');
            const closeBtn = document.getElementById('exit-popup-close');
            const dismissBtn = document.getElementById('exit-popup-dismiss');

            if (!overlay || !popup) return;

            let hasShown = sessionStorage.getItem('ia_exit_shown') === 'true';
            let isEnabled = true;

            function showPopup() {
                if (hasShown || !isEnabled) return;
                hasShown = true;
                sessionStorage.setItem('ia_exit_shown', 'true');
                overlay.classList.add('show');
                popup.classList.add('show');
            }

            function hidePopup() {
                overlay.classList.remove('show');
                popup.classList.remove('show');
            }

            // Exit intent detection (desktop only)
            if (window.innerWidth > 768) {
                document.addEventListener('mouseout', function(e) {
                    if (e.clientY < 10 && e.relatedTarget === null) {
                        setTimeout(showPopup, 500);
                    }
                });
            }

            // Close handlers
            if (closeBtn) closeBtn.addEventListener('click', hidePopup);
            if (dismissBtn) dismissBtn.addEventListener('click', hidePopup);
            overlay.addEventListener('click', hidePopup);

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') hidePopup();
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // COOKIE CONSENT
        // ═══════════════════════════════════════════════════════════════════════
        function initCookieConsent() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');
            const declineBtn = document.getElementById('cookie-decline');

            if (!banner) return;

            // Check if already responded
            if (localStorage.getItem('ia_cookies') !== null) return;

            // Show banner shortly after loader completes (loader is 2.5-5s)
            setTimeout(() => {
                banner.classList.add('show');
            }, 3500);

            function handleResponse(accepted) {
                localStorage.setItem('ia_cookies', accepted ? 'accepted' : 'declined');
                banner.classList.remove('show');

                if (accepted) {
                    // Enable analytics (placeholder)
                    // console.log('Cookies accepted - analytics enabled');
                }
            }

            if (acceptBtn) acceptBtn.addEventListener('click', () => handleResponse(true));
            if (declineBtn) declineBtn.addEventListener('click', () => handleResponse(false));
        }

        // ═══════════════════════════════════════════════════════════════════════
        // STICKY MOBILE CTA
        // ═══════════════════════════════════════════════════════════════════════
        function initMobileCTA() {
            const cta = document.getElementById('mobile-cta');
            if (!cta) return;

            let lastScroll = 0;
            let ticking = false;

            function updateCTA() {
                const scrollY = window.scrollY;
                const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
                const footerTop = document.querySelector('footer')?.offsetTop || Infinity;
                const windowBottom = scrollY + window.innerHeight;

                // Show after scrolling past hero, hide near footer
                if (scrollY > heroHeight * 0.8 && windowBottom < footerTop - 100) {
                    cta.classList.add('show');
                } else {
                    cta.classList.remove('show');
                }

                lastScroll = scrollY;
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateCTA);
                    ticking = true;
                }
            }, { passive: true });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // HAPTIC FEEDBACK SYSTEM (iOS + Android)
        // ═══════════════════════════════════════════════════════════════════════
        let audioContext = null;

        function triggerHaptic(intensity = 'medium') {
            // console.log('🎯 triggerHaptic called:', intensity);

            // ANDROID - Vibration API (works reliably)
            if (typeof navigator.vibrate === 'function') {
                const durations = { light: 20, medium: 35, heavy: 60 };
                const success = navigator.vibrate(durations[intensity] || 35);
                // console.log('📳 Android Vibrate:', intensity, success);
                return;
            }

            // iOS - AudioContext produces audible click (no true haptics in web)
            // Note: iOS Safari does NOT support vibration API - this is audio only
            try {
                // Create AudioContext on demand
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    // console.log('🎵 AudioContext created');
                }

                // Resume if suspended (iOS requires user gesture)
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        playHapticSound(intensity);
                    });
                } else {
                    playHapticSound(intensity);
                }
            } catch (err) {
                // console.log('❌ Haptic error:', err);
            }
        }

        function playHapticSound(intensity) {
            if (!audioContext) return;

            const now = audioContext.currentTime;

            // Soft power chord with reverb
            const settings = {
                light:  { baseFreq: 440, gain: 0.04, duration: 0.6 },
                medium: { baseFreq: 392, gain: 0.05, duration: 0.8 },  // G4
                heavy:  { baseFreq: 330, gain: 0.06, duration: 1.0 }   // E4
            };
            const s = settings[intensity] || settings.medium;

            // Create master gain for overall volume
            const masterGain = audioContext.createGain();
            masterGain.gain.setValueAtTime(s.gain, now);
            masterGain.connect(audioContext.destination);

            // Power chord: Root + Fifth + Octave (soft pad sound)
            const chordRatios = [1, 1.5, 2]; // Root, Perfect Fifth, Octave
            const chordGains = [1, 0.7, 0.5];

            chordRatios.forEach((ratio, i) => {
                const osc = audioContext.createOscillator();
                const oscGain = audioContext.createGain();

                osc.frequency.value = s.baseFreq * ratio;
                osc.type = 'sine'; // Pure sine for soft sound

                // Soft attack, long release - pad-like envelope
                oscGain.gain.setValueAtTime(0, now);
                oscGain.gain.linearRampToValueAtTime(chordGains[i], now + 0.08); // Soft attack
                oscGain.gain.exponentialRampToValueAtTime(0.001, now + s.duration);

                osc.connect(oscGain);
                oscGain.connect(masterGain);

                osc.start(now);
                osc.stop(now + s.duration + 0.1);
            });

            // Simulated reverb - delayed quieter copies
            const reverbDelays = [0.03, 0.06, 0.1, 0.15, 0.22];
            const reverbGains = [0.3, 0.2, 0.15, 0.1, 0.05];

            reverbDelays.forEach((delay, i) => {
                const reverbOsc = audioContext.createOscillator();
                const reverbGain = audioContext.createGain();

                reverbOsc.frequency.value = s.baseFreq;
                reverbOsc.type = 'sine';

                reverbGain.gain.setValueAtTime(0, now + delay);
                reverbGain.gain.linearRampToValueAtTime(s.gain * reverbGains[i], now + delay + 0.05);
                reverbGain.gain.exponentialRampToValueAtTime(0.001, now + delay + s.duration * 0.7);

                reverbOsc.connect(reverbGain);
                reverbGain.connect(audioContext.destination);

                reverbOsc.start(now + delay);
                reverbOsc.stop(now + delay + s.duration);
            });

            // console.log('🎵 Soft power chord:', intensity);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MOBILE WOW ENHANCEMENTS - Complete System
        // ═══════════════════════════════════════════════════════════════════════
        function initMobileEnhancements() {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;

            // Skip on slow connections or reduced motion
            if (PERF.isSlowConnection || PERF.reducedMotion) {
                // console.log('⚡ Mobile enhancements reduced for performance');
                return;
            }

            // console.log('🚀 Initializing Mobile WOW Enhancements');

            // ─────────────────────────────────────────────────────────────────────
            // 1. AMBIENT FLOATING PARTICLES (Reduced for performance)
            // ─────────────────────────────────────────────────────────────────────
            const particleContainer = document.createElement('div');
            particleContainer.className = 'mobile-particles';
            document.body.appendChild(particleContainer);

            function createFloatingParticle() {
                // Limit max particles to prevent memory issues
                if (particleContainer.children.length > 8) return;

                const particle = document.createElement('div');
                particle.className = 'mobile-particle';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.animationDuration = (12 + Math.random() * 8) + 's';
                particle.style.animationDelay = Math.random() * 3 + 's';
                const size = 2 + Math.random() * 3;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particleContainer.appendChild(particle);
                setTimeout(() => particle.remove(), 15000);
            }

            // Create fewer initial particles
            for (let i = 0; i < 6; i++) {
                setTimeout(createFloatingParticle, i * 600);
            }
            // Slower continuous particle creation - only when page visible
            let particleInterval = setInterval(() => {
                if (pageVisible) createFloatingParticle();
            }, 2500);

            // Clean up interval when page hidden for extended time
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && particleInterval) {
                    // Particles will auto-cleanup, just stop creating new ones
                }
            });

            // ─────────────────────────────────────────────────────────────────────
            // 2. GLOWING ORBS (Reduced for performance)
            // ─────────────────────────────────────────────────────────────────────
            for (let i = 0; i < 2; i++) {
                const orb = document.createElement('div');
                orb.className = 'mobile-orb';
                const size = 100 + Math.random() * 80;
                orb.style.width = size + 'px';
                orb.style.height = size + 'px';
                orb.style.left = (10 + Math.random() * 80) + '%';
                orb.style.top = (10 + Math.random() * 80) + '%';
                orb.style.animationDelay = i * 4 + 's';
                document.body.appendChild(orb);
            }

            // ─────────────────────────────────────────────────────────────────────
            // 3. SCREEN-WIDE TOUCH RIPPLES
            // ─────────────────────────────────────────────────────────────────────
            const rippleContainer = document.createElement('div');
            rippleContainer.className = 'touch-ripple-container';
            document.body.appendChild(rippleContainer);

            function createScreenRipple(x, y) {
                const size = Math.max(window.innerWidth, window.innerHeight) * 0.6;

                // Main ripple
                const ripple = document.createElement('div');
                ripple.className = 'touch-ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                rippleContainer.appendChild(ripple);

                // Rings
                for (let i = 0; i < 2; i++) {
                    const ring = document.createElement('div');
                    ring.className = 'touch-ripple-ring';
                    ring.style.left = x + 'px';
                    ring.style.top = y + 'px';
                    ring.style.width = (size * 0.4) + 'px';
                    ring.style.height = (size * 0.4) + 'px';
                    ring.style.animationDelay = (i * 0.1) + 's';
                    rippleContainer.appendChild(ring);
                }

                // Cleanup
                setTimeout(() => {
                    rippleContainer.innerHTML = '';
                }, 900);

                // Haptic feedback (iOS + Android)
                triggerHaptic('medium');
            }

            document.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                createScreenRipple(touch.clientX, touch.clientY);
            }, { passive: true });

            // ─────────────────────────────────────────────────────────────────────
            // 4. MOTION STATUS INDICATOR
            // ─────────────────────────────────────────────────────────────────────
            const motionStatus = document.createElement('div');
            motionStatus.className = 'motion-status';
            motionStatus.innerHTML = '<span class="motion-status-dot"></span><span>MOTION</span>';
            document.body.appendChild(motionStatus);

            // ─────────────────────────────────────────────────────────────────────
            // 5. iOS GYROSCOPE WITH VISIBLE PERMISSION BUTTON
            // Performance optimized with RAF batching and cached DOM queries
            // ─────────────────────────────────────────────────────────────────────
            const book = document.getElementById('hero-book');
            let gyroEnabled = false;
            let lastGamma = 0, lastBeta = 0;
            let gyroTicking = false;
            let pendingGyroEvent = null;

            // Cache DOM queries for performance (60 DOM lookups/sec → 0)
            const cachedGyroElements = {
                cosmicBg: null,
                canvasContainer: null,
                heroContent: null,
                orbs: null
            };

            function cacheGyroElements() {
                cachedGyroElements.cosmicBg = document.querySelector('.cosmic-bg');
                cachedGyroElements.canvasContainer = document.getElementById('canvas-container');
                cachedGyroElements.heroContent = document.querySelector('.hero-content');
                cachedGyroElements.orbs = document.querySelectorAll('.mobile-orb');
            }

            function applyGyroTransforms() {
                const e = pendingGyroEvent;
                if (!e || e.gamma === null || e.beta === null) {
                    gyroTicking = false;
                    return;
                }

                // Smooth interpolation
                const gamma = lastGamma + (e.gamma - lastGamma) * 0.12;
                const beta = lastBeta + (e.beta - lastBeta) * 0.12;
                lastGamma = gamma;
                lastBeta = beta;

                // Calculate tilt - EXPANDED range for more dramatic effect
                const tiltX = Math.max(-30, Math.min(30, gamma)) / 30;
                const tiltY = Math.max(-30, Math.min(30, beta - 45)) / 30;

                // Batch all transforms in single RAF - Apply to book
                if (book) {
                    book.style.transform = `perspective(800px) rotateY(${tiltX * 20}deg) rotateX(${-tiltY * 15}deg) scale(1.05)`;
                }

                // Move floating particles with gyro
                if (particleContainer) {
                    particleContainer.style.transform = `translate(${tiltX * 40}px, ${tiltY * 40}px)`;
                }

                // Move cosmic background (cached)
                if (cachedGyroElements.cosmicBg) {
                    cachedGyroElements.cosmicBg.style.transform = `translate(${tiltX * 60}px, ${tiltY * 60}px) scale(1.1)`;
                }

                // Move Three.js canvas container (cached)
                if (cachedGyroElements.canvasContainer) {
                    cachedGyroElements.canvasContainer.style.transform = `translate(${tiltX * 50}px, ${tiltY * 50}px) rotate(${tiltX * 3}deg)`;
                }

                // Move orbs (cached)
                if (cachedGyroElements.orbs) {
                    cachedGyroElements.orbs.forEach((orb, i) => {
                        const multiplier = 1 + (i * 0.5);
                        orb.style.transform = `translate(${tiltX * 80 * multiplier}px, ${tiltY * 80 * multiplier}px)`;
                    });
                }

                // Shift hero elements (cached)
                if (cachedGyroElements.heroContent) {
                    cachedGyroElements.heroContent.style.transform = `translate(${tiltX * 15}px, ${tiltY * 15}px)`;
                }

                // Trigger haptic on significant movement
                const movement = Math.abs(e.gamma - gamma) + Math.abs(e.beta - beta);
                if (movement > 8 && typeof triggerHaptic === 'function') {
                    triggerHaptic('light');
                }

                gyroTicking = false;
            }

            function handleOrientation(e) {
                pendingGyroEvent = e;
                if (!gyroTicking) {
                    requestAnimationFrame(applyGyroTransforms);
                    gyroTicking = true;
                }
            }

            function enableGyroscope() {
                gyroEnabled = true;
                cacheGyroElements(); // Cache DOM queries once for performance
                window.addEventListener('deviceorientation', handleOrientation, { passive: true });
                motionStatus.classList.add('visible');
                // console.log('✨ Gyroscope enabled!');
            }

            // Check if iOS requires permission
            const needsPermission = typeof DeviceOrientationEvent !== 'undefined' &&
                                    typeof DeviceOrientationEvent.requestPermission === 'function';

            if (needsPermission) {
                // iOS 13+ - Create visible button
                const motionBtn = document.createElement('button');
                motionBtn.className = 'motion-enable-btn';
                motionBtn.innerHTML = '<span class="motion-enable-icon">📱</span><span class="motion-enable-text">Enable Motion Effects</span>';
                document.body.appendChild(motionBtn);

                motionBtn.addEventListener('click', async function() {
                    try {
                        const permission = await DeviceOrientationEvent.requestPermission();
                        if (permission === 'granted') {
                            enableGyroscope();
                            motionBtn.classList.add('hidden');
                            setTimeout(() => motionBtn.remove(), 500);
                        } else {
                            motionBtn.innerHTML = '<span class="motion-enable-icon">❌</span><span class="motion-enable-text">Permission Denied</span>';
                            setTimeout(() => motionBtn.classList.add('hidden'), 2000);
                        }
                    } catch (err) {
                        console.error('Gyroscope error:', err);
                        motionBtn.classList.add('hidden');
                    }
                });

                // Auto-hide after 10 seconds if not tapped
                setTimeout(() => {
                    if (!gyroEnabled && motionBtn.parentNode) {
                        motionBtn.classList.add('hidden');
                    }
                }, 10000);
            } else if (window.DeviceOrientationEvent) {
                // Android or older iOS - enable directly
                enableGyroscope();
            }

            // ─────────────────────────────────────────────────────────────────────
            // 6. ENHANCED HAPTIC FEEDBACK (iOS + Android)
            // ─────────────────────────────────────────────────────────────────────
            const hapticTargets = document.querySelectorAll(
                '.hero-cta, .cta-button, .nav-cta, .newsletter-button, .mobile-cta-button, ' +
                '.idea-card, .review-card, .quote-card, a[href*="amazon"]'
            );

            hapticTargets.forEach(el => {
                el.addEventListener('touchstart', () => {
                    triggerHaptic('light');
                }, { passive: true });
            });

            // ─────────────────────────────────────────────────────────────────────
            // 7. BUTTON RIPPLE EFFECTS (on specific elements)
            // ─────────────────────────────────────────────────────────────────────
            document.querySelectorAll('.hero-cta, .cta-button, .nav-cta, .newsletter-button, .mobile-cta-button').forEach(btn => {
                btn.addEventListener('touchstart', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const y = e.touches[0].clientY - rect.top;

                    const ripple = document.createElement('span');
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.4);
                        width: 100px;
                        height: 100px;
                        left: ${x - 50}px;
                        top: ${y - 50}px;
                        transform: scale(0);
                        animation: rippleEffect 0.5s ease-out forwards;
                        pointer-events: none;
                    `;
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 500);
                }, { passive: true });
            });

            // console.log('✅ Mobile WOW Enhancements Active');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // ADD RIPPLE KEYFRAMES
        // ═══════════════════════════════════════════════════════════════════════
        function addRippleStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // CAROUSEL VISIBILITY OPTIMIZATION - Pause animation when not visible
        // ═══════════════════════════════════════════════════════════════════════
        function initCarouselOptimization() {
            const carouselTrack = document.querySelector('.carousel-track');
            if (!carouselTrack) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Pause animation when not visible
                    carouselTrack.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, { threshold: 0.1 });

            observer.observe(carouselTrack.parentElement);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MOBILE WOW FACTOR - Touch Interactions
        // ═══════════════════════════════════════════════════════════════════════
        function initMobileWowFactor() {
            if (window.innerWidth > 768) return;

            // Create touch ripple container
            const rippleContainer = document.createElement('div');
            rippleContainer.className = 'mobile-particles';
            document.body.appendChild(rippleContainer);

            // Create floating particles
            const particles = [];
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'mobile-particle';
                rippleContainer.appendChild(particle);
                particles.push({
                    el: particle,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: 0
                });
            }

            // Animate floating particles (with visibility check for performance)
            let particleAnimationId = null;
            function animateParticles() {
                // PERFORMANCE: Skip animation when tab is hidden
                if (!pageVisible) {
                    particleAnimationId = requestAnimationFrame(animateParticles);
                    return;
                }

                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Wrap around screen
                    if (p.x < 0) p.x = window.innerWidth;
                    if (p.x > window.innerWidth) p.x = 0;
                    if (p.y < 0) p.y = window.innerHeight;
                    if (p.y > window.innerHeight) p.y = 0;

                    // Fade in/out
                    p.opacity = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2;

                    p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
                    p.el.style.opacity = p.opacity;
                });
                particleAnimationId = requestAnimationFrame(animateParticles);
            }
            animateParticles();

            // Touch ripple effect
            document.addEventListener('touchstart', function(e) {
                const touch = e.touches[0];
                const ripple = document.createElement('div');
                ripple.className = 'touch-ripple';
                ripple.style.left = (touch.clientX - 75) + 'px';
                ripple.style.top = (touch.clientY - 75) + 'px';
                ripple.style.width = '150px';
                ripple.style.height = '150px';
                document.body.appendChild(ripple);

                requestAnimationFrame(() => {
                    ripple.classList.add('active');
                });

                setTimeout(() => ripple.remove(), 600);

                // Attract particles to touch point
                particles.forEach(p => {
                    const dx = touch.clientX - p.x;
                    const dy = touch.clientY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        p.vx += dx * 0.01;
                        p.vy += dy * 0.01;
                    }
                });
            }, { passive: true });

            // Device orientation for particles (iOS)
            if (window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(e) {
                    if (e.gamma && e.beta) {
                        particles.forEach(p => {
                            p.vx += e.gamma * 0.001;
                            p.vy += e.beta * 0.001;
                            // Damping
                            p.vx *= 0.99;
                            p.vy *= 0.99;
                        });
                    }
                }, { passive: true });
            }

            // console.log('✨ Mobile WOW factor enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // APPLE-GRADE EFFECTS - Complete System
        // ═══════════════════════════════════════════════════════════════════════
        function initAppleGradeEffects() {
            // Skip if reduced motion preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // 1. ENHANCED SCROLLYTELLING TYPOGRAPHY with blur
            const textReveals = document.querySelectorAll('h2, h3, .book-quote, .quote-text, .apple-reveal');

            function updateTextReveals() {
                const windowHeight = window.innerHeight;

                textReveals.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;

                    // Calculate progress (0 = below viewport, 1 = at center)
                    let progress = 1 - (elementCenter - windowHeight / 2) / (windowHeight / 2);
                    progress = Math.max(0, Math.min(1, progress));

                    // Apply easing
                    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

                    // Interpolate values
                    const opacity = 0.15 + (eased * 0.85);
                    const y = 20 - (eased * 20);
                    const scale = 0.97 + (eased * 0.03);
                    const blur = 3 - (eased * 3);

                    el.style.opacity = opacity;
                    el.style.transform = `translateY(${y}px) scale(${scale})`;
                    el.style.filter = `blur(${blur}px)`;
                });
            }

            // 2. ENHANCED PARALLAX with data attributes
            const parallaxElements = document.querySelectorAll('[data-parallax], .hrih-visual');

            function updateParallax() {
                const scrollY = window.scrollY;

                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset?.parallax) || 0.08;
                    const direction = el.dataset?.parallaxDir || 'y';
                    const baseScale = parseFloat(el.dataset?.parallaxScale) || 1.05;

                    const rect = el.getBoundingClientRect();
                    const elementTop = rect.top + scrollY;
                    const distanceFromTop = scrollY - elementTop + window.innerHeight;

                    // Only animate when in view
                    if (distanceFromTop > 0 && scrollY < elementTop + rect.height + window.innerHeight) {
                        const offset = distanceFromTop * speed;

                        if (direction === 'x') {
                            el.style.transform = `translateX(${offset}px) scale(${baseScale})`;
                        } else {
                            el.style.transform = `translateY(${offset}px) scale(${baseScale})`;
                        }
                    }
                });
            }

            // 3. COMBINED SCROLL HANDLER
            let ticking = false;

            function onScroll() {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateTextReveals();
                        updateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            }

            window.addEventListener('scroll', onScroll, { passive: true });

            // Initial call
            updateTextReveals();
            updateParallax();

            // console.log('✨ Apple-grade effects enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MAGNETIC CURSOR EFFECT
        // ═══════════════════════════════════════════════════════════════════════
        function initMagneticElements() {
            const magneticElements = document.querySelectorAll('.magnetic, .hero-cta, .cta-button, .tripath-cta');

            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const deltaX = (e.clientX - centerX) * 0.15; // Magnetic strength
                    const deltaY = (e.clientY - centerY) * 0.15;

                    el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                });

                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(0, 0)';
                    el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                });

                el.addEventListener('mouseenter', () => {
                    el.style.transition = 'transform 0.15s ease-out';
                });
            });

            // console.log('✨ Magnetic cursor enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // CURSOR-FOLLOWING GLOW ON CARDS
        // ═══════════════════════════════════════════════════════════════════════
        function initCursorGlow() {
            const glowCards = document.querySelectorAll('.idea-card, .evidence-card, .expert-card, .timeline-event');

            glowCards.forEach(card => {
                // Add the glow class
                card.classList.add('card-with-glow');

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    card.style.setProperty('--glow-x', `${x}px`);
                    card.style.setProperty('--glow-y', `${y}px`);
                });
            });

            // console.log('✨ Cursor glow enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // ENHANCED LENIS CONFIGURATION
        // ═══════════════════════════════════════════════════════════════════════
        // REMOVED: Duplicate Lenis initialization - using PHASE 9 instead
        function initAppleLenis() {
            // Lenis now handled by PHASE 9: LIQUID REALITY SCROLL
            // This prevents duplicate animation loops
            return;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // IMAGE ERROR HANDLER - Graceful fallbacks for broken images
        // ═══════════════════════════════════════════════════════════════════════
        function initImageErrorHandlers() {
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
                // Hide the broken image icon
                img.style.opacity = '0';
                img.style.minHeight = '0';

                // Add gradient fallback to parent
                const parent = img.parentElement;
                if (parent) {
                    parent.style.background = 'linear-gradient(135deg, rgba(212, 168, 75, 0.12) 0%, rgba(18, 18, 22, 0.95) 100%)';
                    parent.style.minHeight = img.classList.contains('idea-image') ? '80px' : '150px';
                    parent.style.borderRadius = '12px';
                }
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // NUCLEAR FIX: ANIMATION PAUSE CONTROLLER
        // ═══════════════════════════════════════════════════════════════════════
        function initAnimationPauser() {
            if (!('IntersectionObserver' in window)) return;

            const animationPauser = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const section = entry.target;
                    const animations = section.querySelectorAll('[class*="animate"], .ticker-track, .carousel-track');

                    if (entry.isIntersecting) {
                        animations.forEach(el => el.style.animationPlayState = 'running');
                    } else {
                        animations.forEach(el => el.style.animationPlayState = 'paused');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.snap-section').forEach(section => {
                animationPauser.observe(section);
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // NUCLEAR FIX: VIDEO PERFORMANCE MANAGER
        // ═══════════════════════════════════════════════════════════════════════
        function initVideoManager() {
            if (!('IntersectionObserver' in window)) return;
            const videos = document.querySelectorAll('video');

            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;

                    if (entry.isIntersecting) {
                        if (video.paused && video.hasAttribute('autoplay')) {
                            video.play().catch(() => {});
                        }
                    } else {
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            }, { threshold: 0.3 });

            videos.forEach(video => {
                video.addEventListener('error', () => {
                    const parent = video.parentElement;
                    if (parent) {
                        parent.classList.add('video-error');
                    }
                });
                videoObserver.observe(video);
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZE ALL ENHANCEMENTS
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function() {
            initImageErrorHandlers();
            initAnimationPauser();
            initVideoManager();
            addRippleStyles();
            initReadingProgress();
            initNewsletter();
            initExitIntent();
            initCookieConsent();
            initMobileCTA();
            initMobileEnhancements();
            initCarouselOptimization();
            initMobileWowFactor();
            initAppleGradeEffects();
            initMagneticElements();
            initCursorGlow();
            initAppleLenis();

            // New Phase 7-14 Initializations
            initStaggerReveal();
            initSectionProgress();
            initAmbientOrbs();
        });

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 7: STAGGER REVEAL SYSTEM
        // ═══════════════════════════════════════════════════════════════════════
        function initStaggerReveal() {
            const staggerGroups = document.querySelectorAll('[data-stagger-group]');

            const staggerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('stagger-visible');
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            staggerGroups.forEach(group => {
                staggerObserver.observe(group);
            });

            // console.log('✨ Stagger reveal system enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 8: SECTION PROGRESS DOTS
        // ═══════════════════════════════════════════════════════════════════════
        function initSectionProgress() {
            // Define sections to track
            const sectionConfig = [
                { id: 'hero', label: 'HOME' },
                { id: 'opening-quote', label: 'QUOTE' },
                { id: 'equation', label: 'EQUATION' },
                { id: 'prophecy', label: 'PREDICTION' },
                { id: 'evidence-locker', label: 'EVIDENCE' },
                { id: 'ideas', label: 'IDEAS' },
                { id: 'chokepoint', label: 'CHOKEPOINT' },
                { id: 'hrih', label: 'HRIH' },
                { id: 'religion', label: 'RELIGION' },
                { id: 'about', label: 'AUTHOR' },
                { id: 'tripath', label: 'FUTURE' },
                { id: 'predictions', label: 'TIMELINE' },
                { id: 'reviews', label: 'REVIEWS' }
            ];

            // Create progress container
            const progressContainer = document.createElement('nav');
            progressContainer.className = 'section-progress';
            progressContainer.setAttribute('aria-label', 'Section navigation');

            sectionConfig.forEach(section => {
                const dot = document.createElement('button');
                dot.className = 'progress-dot';
                dot.dataset.section = section.id;
                dot.setAttribute('aria-label', `Navigate to ${section.label}`);

                const tooltip = document.createElement('span');
                tooltip.className = 'progress-dot-tooltip';
                tooltip.textContent = section.label;
                dot.appendChild(tooltip);

                dot.addEventListener('click', () => {
                    const targetSection = document.getElementById(section.id);
                    if (targetSection) {
                        // Precision snap - instant lock to section top
                        targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }
                });

                progressContainer.appendChild(dot);
            });

            document.body.appendChild(progressContainer);

            // Track active section
            let activeSection = null;
            const sections = sectionConfig.map(s => document.getElementById(s.id)).filter(Boolean);

            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        const sectionId = entry.target.id;
                        const dot = progressContainer.querySelector(`[data-section="${sectionId}"]`);

                        // Remove active from all
                        progressContainer.querySelectorAll('.progress-dot').forEach(d => d.classList.remove('active'));

                        // Add active to current
                        if (dot) {
                            dot.classList.add('active');
                        }
                    }
                });
            }, {
                threshold: [0.3, 0.5, 0.7],
                rootMargin: '-10% 0px -40% 0px'
            });

            sections.forEach(section => {
                if (section) progressObserver.observe(section);
            });

            // Show/hide progress based on scroll position
            let lastScrollY = 0;
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;

                // Show after loader
                if (scrollY > 100) {
                    progressContainer.classList.add('visible');
                } else {
                    progressContainer.classList.remove('visible');
                }

                lastScrollY = scrollY;
            }, { passive: true });

            // console.log('✨ Section progress dots enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 9: AMBIENT MOTION (LIVING BACKGROUNDS)
        // ═══════════════════════════════════════════════════════════════════════
        function initAmbientOrbs() {
            // Skip if reduced motion preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // Create ambient orbs container
            const orbsContainer = document.createElement('div');
            orbsContainer.className = 'ambient-orbs';
            orbsContainer.setAttribute('aria-hidden', 'true');

            // Add three orbs
            const orbs = ['gold', 'purple', 'teal'];
            orbs.forEach(color => {
                const orb = document.createElement('div');
                orb.className = `ambient-orb ambient-orb--${color}`;
                orbsContainer.appendChild(orb);
            });

            // Insert at the beginning of body, but after any loaders
            const mainContent = document.querySelector('.main-content') || document.body.firstChild;
            document.body.insertBefore(orbsContainer, mainContent);

            // console.log('✨ Ambient orbs enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 16: 3D CARD TILT EFFECT (Haptic Feedback Simulation)
        // ═══════════════════════════════════════════════════════════════════════
        function initCardTilt() {
            // Skip on touch devices or if reduced motion preferred
            if ('ontouchstart' in window || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const tiltCards = document.querySelectorAll('.idea-card, .evidence-card, .prophecy-card, .expert-card');

            tiltCards.forEach(card => {
                card.classList.add('tilt-card');

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    // Calculate rotation based on cursor position
                    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5; // Max 5 degrees
                    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                    card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
                });

                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'transform 0.15s ease-out';
                });
            });

            // console.log('✨ 3D card tilt enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 19: SPATIAL AUDIO CUES (Subliminal Sound Design)
        // ═══════════════════════════════════════════════════════════════════════
        function initSpatialAudio() {
            // Only initialize if user has interacted and Tone.js is available
            let audioEnabled = false;
            let audioContext = null;

            // Create subtle audio feedback
            function createSubtleClick() {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);

                gainNode.gain.setValueAtTime(0.03, audioContext.currentTime); // Very quiet
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            }

            function createSubtleHover() {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);

                gainNode.gain.setValueAtTime(0.01, audioContext.currentTime); // Almost subliminal
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.02);
            }

            // Enable audio on first interaction
            document.addEventListener('click', function enableAudio() {
                audioEnabled = true;
                document.removeEventListener('click', enableAudio);
            }, { once: true });

            // Add subtle click sounds to buttons (after user enables audio)
            document.querySelectorAll('.buy-button, .cta-button, .hero-cta').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (audioEnabled) createSubtleClick();
                });
            });

            // Add subtle hover sounds to cards (after user enables audio)
            document.querySelectorAll('.idea-card, .evidence-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    if (audioEnabled) createSubtleHover();
                });
            });

            // console.log('✨ Spatial audio ready (activates on first click)');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 25: PROGRESSIVE IMAGE LOADING & PRELOAD ON HOVER
        // ═══════════════════════════════════════════════════════════════════════
        function initProgressiveImages() {
            // Progressive image loading
            const images = document.querySelectorAll('img[loading="lazy"]');

            images.forEach(img => {
                // Add loading class for blur effect
                img.classList.add('loading');

                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });

                // If already loaded (cached)
                if (img.complete) {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                }
            });

            // Preload on hover for links
            const preloadLinks = document.querySelectorAll('[data-preload]');

            preloadLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const preloadUrl = link.dataset.preload;
                    if (preloadUrl) {
                        const preloadLink = document.createElement('link');
                        preloadLink.rel = 'prefetch';
                        preloadLink.href = preloadUrl;
                        document.head.appendChild(preloadLink);
                    }
                }, { once: true }); // Only prefetch once
            });

            // console.log('✨ Progressive images enabled');
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 17: MOTION REVEAL OBSERVER (Semantic Motion)
        // ═══════════════════════════════════════════════════════════════════════
        function initMotionReveals() {
            const motionElements = document.querySelectorAll('.motion-reveal');

            const motionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        motionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });

            motionElements.forEach(el => motionObserver.observe(el));

            // console.log('✨ Motion reveals enabled');
        }

        // Initialize all Phase 16-25 features
        document.addEventListener('DOMContentLoaded', function() {
            initCardTilt();
            initSpatialAudio();
            initProgressiveImages();
            initMotionReveals();
        });

        // ═══════════════════════════════════════════════════════════════════════════════
        // FUTURE TIER ENHANCEMENTS - PHASES 8-17
        // ═══════════════════════════════════════════════════════════════════════════════

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 9: PRECISION SNAP SCROLL (Lenis DISABLED for snap-lock precision)
        // ═══════════════════════════════════════════════════════════════════════
        let lenis = null;

        // DISABLED: Lenis smooth scroll interferes with precision snap-and-lock
        // Using native CSS scroll-snap instead for absolute precision
        const enableLiquidScroll = false; // Disabled for snap precision

        if (enableLiquidScroll && typeof Lenis !== 'undefined') {
            // Lenis disabled - precision snap scrolling active
            lenis = null;
        }

        // Native scroll tracking for parallax (without Lenis smooth scroll)
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateScrollProperties() {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

            document.documentElement.style.setProperty('--scroll-y', scrollY);
            document.documentElement.style.setProperty('--scroll-progress', progress);

            // Parallax effects (lightweight)
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const yOffset = rect.top * speed * -0.05;
                el.style.transform = `translateY(${yOffset}px)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollProperties);
                ticking = true;
            }
        }, { passive: true });

        // console.log('✨ Precision snap scroll enabled (Lenis disabled)');

        // Scroll-triggered reveals
        const liquidRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.idea-card, .quote-card').forEach(el => {
            el.classList.add('liquid-reveal');
            liquidRevealObserver.observe(el);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 8: CINEMATIC VIDEO PORTAL (with animated fallback)
        // ═══════════════════════════════════════════════════════════════════════
        const videoPortal = document.getElementById('video-portal');
        const portalVideo = document.getElementById('portal-video');

        if (videoPortal) {
            // Create animated particle fallback for CTA section
            const createPortalFallback = () => {
                videoPortal.style.background = `
                    radial-gradient(ellipse at 30% 40%, rgba(212, 168, 75, 0.15) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 60%, rgba(212, 168, 75, 0.1) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, rgba(26, 35, 126, 0.1) 0%, transparent 70%)
                `;
                videoPortal.classList.add('loaded');

                // Add floating particles (reduced from 20 to 5 for mobile performance)
                for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: absolute;
                        width: ${2 + Math.random() * 4}px;
                        height: ${2 + Math.random() * 4}px;
                        background: var(--gold);
                        border-radius: 50%;
                        opacity: ${0.2 + Math.random() * 0.4};
                        left: ${Math.random() * 100}%;
                        top: ${Math.random() * 100}%;
                        animation: portalFloat ${5 + Math.random() * 5}s ease-in-out infinite;
                        animation-delay: ${Math.random() * 5}s;
                    `;
                    videoPortal.appendChild(particle);
                }

                // Add keyframes
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes portalFloat {
                        0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
                        25% { transform: translateY(-30px) translateX(10px) scale(1.2); opacity: 0.6; }
                        50% { transform: translateY(-20px) translateX(-10px) scale(0.8); opacity: 0.4; }
                        75% { transform: translateY(-40px) translateX(5px) scale(1.1); opacity: 0.5; }
                    }
                `;
                document.head.appendChild(style);
            };

            if (portalVideo) {
                // Try video first, fallback to animated particles
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            portalVideo.load();
                            portalVideo.play().then(() => {
                                videoPortal.classList.add('loaded');
                            }).catch(e => {
                                // console.log('Video fallback to particles:', e);
                                portalVideo.style.display = 'none';
                                createPortalFallback();
                            });
                        } else {
                            portalVideo.pause();
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '100px'
                });

                // Check if video source exists
                portalVideo.addEventListener('error', () => {
                    // console.log('Video not available, using particle fallback');
                    portalVideo.style.display = 'none';
                    createPortalFallback();
                });

                videoObserver.observe(videoPortal);

                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    portalVideo.remove();
                    createPortalFallback();
                }

                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        portalVideo.pause();
                    } else if (videoPortal.classList.contains('loaded') && portalVideo.style.display !== 'none') {
                        portalVideo.play().catch(() => {});
                    }
                });
            } else {
                createPortalFallback();
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 10: SONIC ARCHITECTURE (TONE.JS) - Loads on demand
        // ═══════════════════════════════════════════════════════════════════════
        const SonicArchitecture = {
            initialized: false,
            playing: false,
            synths: {},

            async init() {
                if (this.initialized) return;

                // Load Tone.js on demand (not at page load)
                if (typeof Tone === 'undefined') {
                    if (typeof window.loadToneJs !== 'function') {
                        console.error('❌ Tone.js loader not available');
                        return false;
                    }
                    // console.log('🎵 Loading Tone.js on demand...');
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

                this.synths.pad = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 4, decay: 2, sustain: 0.8, release: 4 }
                }).toDestination();
                this.synths.pad.volume.value = -24;

                this.synths.shimmer = new Tone.Synth({
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
                }).toDestination();
                this.synths.shimmer.volume.value = -18;

                this.filter = new Tone.Filter(800, 'lowpass').toDestination();
                this.synths.pad.connect(this.filter);

                this.reverb = new Tone.Reverb({ decay: 8, wet: 0.6 }).toDestination();
                this.synths.pad.connect(this.reverb);
                this.synths.shimmer.connect(this.reverb);

                this.initialized = true;
                // console.log('✨ Sonic Architecture initialized');
            },

            async start() {
                if (!this.initialized) await this.init();
                if (this.playing) return;

                this.playing = true;

                const chords = [
                    ['A2', 'E3', 'A3'],
                    ['F2', 'A2', 'C3'],
                    ['D2', 'F2', 'A2'],
                    ['E2', 'G#2', 'B2']
                ];

                let chordIndex = 0;

                const playChord = () => {
                    if (!this.playing) return;

                    this.synths.pad.triggerAttackRelease(chords[chordIndex], '8n');
                    chordIndex = (chordIndex + 1) % chords.length;

                    setTimeout(playChord, 8000 + Math.random() * 4000);
                };

                playChord();

                // Native scroll listener (Lenis disabled for precision snap)
                window.addEventListener('scroll', () => {
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
                    const freq = 400 + (progress * 1200);
                    if (this.filter && this.filter.frequency) {
                        this.filter.frequency.rampTo(freq, 0.5);
                    }
                }, { passive: true });
            },

            stop() {
                this.playing = false;
                if (this.synths.pad) {
                    this.synths.pad.releaseAll();
                }
            },

            playInteraction(type = 'click') {
                if (!this.initialized || !this.playing) return;

                const notes = {
                    click: 'C5',
                    hover: 'E5',
                    scroll: 'G4',
                    milestone: ['C5', 'E5', 'G5']
                };

                const note = notes[type] || 'C5';

                if (Array.isArray(note)) {
                    note.forEach((n, i) => {
                        setTimeout(() => {
                            this.synths.shimmer.triggerAttackRelease(n, '16n');
                        }, i * 100);
                    });
                } else {
                    this.synths.shimmer.triggerAttackRelease(note, '16n');
                }
            }
        };

        // Audio toggle button
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', async () => {
                const isActive = audioToggle.classList.toggle('active');

                if (isActive) {
                    await SonicArchitecture.start();
                    localStorage.setItem('ia_audio', 'true');
                    const tooltip = audioToggle.querySelector('.audio-toggle-tooltip');
                    if (tooltip) tooltip.textContent = 'Sound On';
                } else {
                    SonicArchitecture.stop();
                    localStorage.setItem('ia_audio', 'false');
                    const tooltip = audioToggle.querySelector('.audio-toggle-tooltip');
                    if (tooltip) tooltip.textContent = 'Enable Ambient Sound';
                }
            });

            document.querySelectorAll('button, a, .idea-card, .quote-card').forEach(el => {
                el.addEventListener('mouseenter', () => SonicArchitecture.playInteraction('hover'));
                el.addEventListener('click', () => SonicArchitecture.playInteraction('click'));
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 11: HOLOGRAPHIC BOOK
        // ═══════════════════════════════════════════════════════════════════════
        const holoBook = document.getElementById('hero-book-3d');
        const bookShadow = document.getElementById('book-shadow');
        const bookLight = holoBook?.querySelector('.book-light-layer');

        if (holoBook) {
            const maxRotation = 15;

            // Desktop: Mouse tracking
            if (window.innerWidth > 768) {
                document.addEventListener('mousemove', (e) => {
                    const rect = holoBook.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const rotateY = ((e.clientX - centerX) / window.innerWidth) * maxRotation * 2;
                    const rotateX = ((centerY - e.clientY) / window.innerHeight) * maxRotation * 2;

                    holoBook.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    holoBook.classList.add('tracking');

                    if (bookShadow) {
                        bookShadow.style.transform = `translateX(calc(-50% + ${rotateY * 2}px)) rotateX(90deg) scaleX(${1 + Math.abs(rotateY) * 0.02})`;
                    }

                    if (bookLight) {
                        const lightX = 50 + rotateY * 2;
                        const lightY = 50 - rotateX * 2;
                        bookLight.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.5) 0%, transparent 50%)`;
                    }
                });

                document.addEventListener('mouseleave', () => {
                    holoBook.style.transform = '';
                    holoBook.classList.remove('tracking');
                    holoBook.classList.add('floating');
                    if (bookShadow) bookShadow.style.transform = '';
                });
            }

            // Mobile: Gyroscope tracking
            if (window.innerWidth <= 768) {
                window.addEventListener('deviceorientation', (e) => {
                    const beta = e.beta || 0;
                    const gamma = e.gamma || 0;

                    const rotateX = Math.max(-maxRotation, Math.min(maxRotation, (beta - 45) * 0.5));
                    const rotateY = Math.max(-maxRotation, Math.min(maxRotation, gamma * 0.5));

                    holoBook.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    holoBook.classList.add('tracking');

                    if (bookShadow) {
                        bookShadow.style.transform = `translateX(calc(-50% + ${rotateY * 2}px)) rotateX(90deg)`;
                    }
                }, { passive: true });
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 12: PARTICLE TEXT DISSOLUTION
        // ═══════════════════════════════════════════════════════════════════════
        function initDissolveText() {
            const heroTitle = document.getElementById('hero-title');
            if (!heroTitle || heroTitle.classList.contains('dissolve-ready')) return;

            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            heroTitle.classList.add('dissolve-text', 'dissolve-ready');

            [...text].forEach((char, i) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.setProperty('--char-index', i);
                heroTitle.appendChild(span);
            });

            const particlePool = [];
            const poolSize = 50;

            for (let i = 0; i < poolSize; i++) {
                const particle = document.createElement('div');
                particle.className = 'dissolve-particle';
                document.body.appendChild(particle);
                particlePool.push(particle);
            }

            let dissolved = false;
            let particleIndex = 0;

            const dissolveThreshold = window.innerHeight * 0.3;

            const checkDissolve = () => {
                const scrollY = window.scrollY;

                if (scrollY > dissolveThreshold && !dissolved) {
                    dissolved = true;
                    heroTitle.classList.add('dissolving');

                    heroTitle.querySelectorAll('.char').forEach((char, i) => {
                        setTimeout(() => {
                            const rect = char.getBoundingClientRect();
                            const particle = particlePool[particleIndex % poolSize];
                            particleIndex++;

                            particle.style.left = rect.left + rect.width / 2 + 'px';
                            particle.style.top = rect.top + rect.height / 2 + 'px';
                            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                            particle.style.setProperty('--ty', -100 - Math.random() * 100 + 'px');
                            particle.style.animation = 'particleFly 1s ease-out forwards';

                            setTimeout(() => {
                                particle.style.animation = '';
                            }, 1000);
                        }, i * 20);
                    });

                    if (typeof SonicArchitecture !== 'undefined') {
                        SonicArchitecture.playInteraction('milestone');
                    }

                } else if (scrollY <= dissolveThreshold * 0.5 && dissolved) {
                    dissolved = false;
                    heroTitle.classList.remove('dissolving');
                }
            };

            window.addEventListener('scroll', checkDissolve, { passive: true });
        }

        if (document.readyState === 'complete') {
            initDissolveText();
        } else {
            window.addEventListener('load', initDissolveText);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 13: TIME-AWARE CONSCIOUSNESS
        // ═══════════════════════════════════════════════════════════════════════
        const TimeConsciousness = {
            init() {
                this.update();
                setInterval(() => this.update(), 5 * 60 * 1000);
            },

            update() {
                const hour = new Date().getHours();
                const root = document.documentElement;
                const body = document.body;

                body.classList.remove('dawn-mode', 'day-mode', 'dusk-mode', 'night-mode');

                if (hour >= 5 && hour < 8) {
                    body.classList.add('dawn-mode');
                    root.style.setProperty('--time-hue-shift', '10deg');
                    root.style.setProperty('--time-warmth', '0.3');
                    root.style.setProperty('--time-brightness', '0.95');
                    // console.log('🌅 Dawn mode activated');

                } else if (hour >= 8 && hour < 18) {
                    body.classList.add('day-mode');
                    root.style.setProperty('--time-hue-shift', '0deg');
                    root.style.setProperty('--time-warmth', '0');
                    root.style.setProperty('--time-brightness', '1');
                    // console.log('☀️ Day mode activated');

                } else if (hour >= 18 && hour < 21) {
                    body.classList.add('dusk-mode');
                    root.style.setProperty('--time-hue-shift', '15deg');
                    root.style.setProperty('--time-warmth', '0.4');
                    root.style.setProperty('--time-brightness', '0.9');
                    // console.log('🌆 Dusk mode activated');

                } else {
                    body.classList.add('night-mode');
                    root.style.setProperty('--time-hue-shift', '-5deg');
                    root.style.setProperty('--time-warmth', '0');
                    root.style.setProperty('--time-brightness', '0.85');
                    root.style.setProperty('--time-saturation', '1.1');
                    // console.log('🌙 Night mode activated');
                }
            }
        };

        TimeConsciousness.init();

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 14: NEURAL NETWORK VISUALIZER (Performance-aware + IntersectionObserver)
        // ═══════════════════════════════════════════════════════════════════════
        const neuralCanvas = document.getElementById('neural-canvas');
        let neuralVisible = false;

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
            const ideaCards = document.querySelectorAll('.idea-card');
            let nodes = [];
            let animationFrame;

            function resizeNeuralCanvas() {
                const section = neuralCanvas.parentElement;
                neuralCanvas.width = section.offsetWidth;
                neuralCanvas.height = section.offsetHeight;
                initNeuralNodes();
            }

            function initNeuralNodes() {
                nodes = [];
                // Reduce node count on mobile
                const maxNodes = PERF.isMobile ? 12 : 30;
                const count = Math.min(ideaCards.length * 2, maxNodes);

                for (let i = 0; i < count; i++) {
                    nodes.push({
                        x: Math.random() * neuralCanvas.width,
                        y: Math.random() * neuralCanvas.height,
                        vx: (Math.random() - 0.5) * 0.3, // Slower movement
                        vy: (Math.random() - 0.5) * 0.3, // Slower movement
                        radius: 2 + Math.random() * 3,
                        pulsePhase: Math.random() * Math.PI * 2,
                        active: false
                    });
                }
            }

            function drawNetwork() {
                ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

                ctx.strokeStyle = 'rgba(212, 168, 75, 0.1)';
                ctx.lineWidth = 1;

                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dx = nodes[j].x - nodes[i].x;
                        const dy = nodes[j].y - nodes[i].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 150) {
                            const opacity = (1 - dist / 150) * 0.3;
                            ctx.strokeStyle = `rgba(212, 168, 75, ${opacity})`;

                            ctx.beginPath();
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                            ctx.stroke();
                        }
                    }
                }

                nodes.forEach((node, i) => {
                    node.x += node.vx;
                    node.y += node.vy;

                    if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;

                    node.pulsePhase += 0.02;
                    const pulse = 1 + Math.sin(node.pulsePhase) * 0.3;

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = node.active
                        ? 'rgba(244, 200, 86, 0.9)'
                        : 'rgba(212, 168, 75, 0.6)';
                    ctx.fill();

                    if (node.active) {
                        ctx.shadowColor = 'rgba(212, 168, 75, 0.8)';
                        ctx.shadowBlur = 15;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                });

                // Only animate if visible and page visible
                if (pageVisible && neuralVisible) {
                    animationFrame = requestAnimationFrame(drawNetwork);
                } else {
                    setTimeout(() => {
                        animationFrame = requestAnimationFrame(drawNetwork);
                    }, 200);
                }
            }

            ideaCards.forEach((card, i) => {
                card.addEventListener('mouseenter', () => {
                    const rect = card.getBoundingClientRect();
                    const sectionRect = neuralCanvas.getBoundingClientRect();
                    const cardCenterX = rect.left - sectionRect.left + rect.width / 2;
                    const cardCenterY = rect.top - sectionRect.top + rect.height / 2;

                    nodes.forEach(node => {
                        const dx = node.x - cardCenterX;
                        const dy = node.y - cardCenterY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        node.active = dist < 200;
                    });
                });

                card.addEventListener('mouseleave', () => {
                    nodes.forEach(node => node.active = false);
                });
            });

            resizeNeuralCanvas();
            window.addEventListener('resize', resizeNeuralCanvas);

            // Start animation when section becomes visible
            const startObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animationFrame) {
                        drawNetwork();
                    }
                });
            }, { threshold: 0.1 });

            startObserver.observe(neuralCanvas.parentElement);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 15: CONSTELLATION PROGRESS
        // ═══════════════════════════════════════════════════════════════════════
        const constellationNav = document.getElementById('constellation-nav');

        if (constellationNav) {
            const sections = [
                { id: 'hero', label: 'HOME' },
                { id: 'ideas', label: 'IDEAS' },
                { id: 'quotes', label: 'QUOTES' },
                { id: 'about', label: 'AUTHOR' },
                { id: 'reviews', label: 'REVIEWS' },
                { id: 'cta', label: 'GET BOOK' }
            ];

            let html = '';
            sections.forEach((section, i) => {
                const sectionEl = document.getElementById(section.id) ||
                                  document.querySelector(`.${section.id}-section`) ||
                                  document.querySelector(`[class*="${section.id}"]`);

                if (sectionEl) {
                    html += `
                        <div class="constellation-star" data-section="${section.id}">
                            <span class="constellation-label">${section.label}</span>
                        </div>
                    `;
                    if (i < sections.length - 1) {
                        html += `<div class="constellation-line" data-line="${i}"></div>`;
                    }
                }
            });

            constellationNav.innerHTML = html;

            constellationNav.querySelectorAll('.constellation-star').forEach(star => {
                star.addEventListener('click', () => {
                    const sectionId = star.dataset.section;
                    const target = document.getElementById(sectionId) ||
                                   document.querySelector(`.${sectionId}-section`) ||
                                   document.querySelector(`[class*="${sectionId}"]`);

                    if (target) {
                        // Precision snap - use 'auto' for instant lock, not 'smooth'
                        target.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }
                });
            });

            const updateConstellation = () => {
                const windowHeight = window.innerHeight;
                const stars = constellationNav.querySelectorAll('.constellation-star');
                const lines = constellationNav.querySelectorAll('.constellation-line');

                sections.forEach((section, i) => {
                    const sectionEl = document.getElementById(section.id) ||
                                      document.querySelector(`.${section.id}-section`) ||
                                      document.querySelector(`[class*="${section.id}"]`);

                    if (sectionEl && stars[i]) {
                        const rect = sectionEl.getBoundingClientRect();
                        const isActive = rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.3;
                        const isPassed = rect.bottom < windowHeight * 0.5;

                        stars[i].classList.toggle('active', isActive || isPassed);

                        if (lines[i]) {
                            lines[i].classList.toggle('filled', isPassed);
                        }
                    }
                });
            };

            const showConstellation = () => {
                const show = window.scrollY > window.innerHeight * 0.5;
                constellationNav.classList.toggle('visible', show);
            };

            window.addEventListener('scroll', () => {
                updateConstellation();
                showConstellation();
            }, { passive: true });

            updateConstellation();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 16: SENTIENT CURSOR
        // ═══════════════════════════════════════════════════════════════════════
        const cursorDot = document.getElementById('cursor-dot');
        const cursorRing = document.getElementById('cursor-ring');

        if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
            let mouseX = 0, mouseY = 0;
            let ringX = 0, ringY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            });

            function animateRing() {
                // Pause when tab hidden
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

            const hoverTargets = {
                link: 'a, .nav-link',
                button: 'button, .hero-cta, .cta-primary, .cta-secondary, .buy-btn, .cta-button',
                text: 'p, h1, h2, h3, h4, h5, h6'
            };

            Object.entries(hoverTargets).forEach(([type, selector]) => {
                document.querySelectorAll(selector).forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursorDot.classList.add(`hover-${type}`);
                        cursorRing.classList.add(`hover-${type}`);
                    });
                    el.addEventListener('mouseleave', () => {
                        cursorDot.classList.remove(`hover-${type}`);
                        cursorRing.classList.remove(`hover-${type}`);
                    });
                });
            });

            document.addEventListener('mouseleave', () => {
                cursorDot.style.opacity = '0';
                cursorRing.style.opacity = '0';
            });

            document.addEventListener('mouseenter', () => {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 17: QUANTUM ENTANGLEMENT - GPU-accelerated with transform3d
        // ═══════════════════════════════════════════════════════════════════════
        const QuantumField = {
            pairs: [],

            init() {
                // Skip if disabled by Features or slow connection
                if (!Features.quantumParticles) {
                    // console.log('⚡ Quantum Field disabled for performance');
                    return;
                }
                // Reduce pairs on mobile
                const pairCount = PERF.isMobile ? 1 : 3;
                for (let i = 0; i < pairCount; i++) {
                    this.createPair();
                }
                this.animate();
            },

            createPair() {
                const particleA = document.createElement('div');
                particleA.className = 'quantum-particle entangled';
                // Use will-change for GPU acceleration
                particleA.style.willChange = 'transform';
                particleA.style.left = '0';
                particleA.style.top = '0';
                document.body.appendChild(particleA);

                const particleB = document.createElement('div');
                particleB.className = 'quantum-particle entangled';
                particleB.style.animationDelay = '0s';
                particleB.style.willChange = 'transform';
                particleB.style.left = '0';
                particleB.style.top = '0';
                document.body.appendChild(particleB);

                const line = document.createElement('div');
                line.className = 'quantum-line';
                line.style.willChange = 'transform, width';
                line.style.left = '0';
                line.style.top = '0';
                document.body.appendChild(line);

                const pair = {
                    a: {
                        el: particleA,
                        x: Math.random() * window.innerWidth * 0.4,
                        y: Math.random() * window.innerHeight,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2
                    },
                    b: {
                        el: particleB,
                        x: 0,
                        y: 0
                    },
                    line: line
                };

                this.pairs.push(pair);
            },

            animate() {
                // Pause when tab hidden
                if (!pageVisible) {
                    setTimeout(() => requestAnimationFrame(() => this.animate()), 200);
                    return;
                }

                this.pairs.forEach(pair => {
                    pair.a.x += pair.a.vx;
                    pair.a.y += pair.a.vy;

                    if (pair.a.x < 0 || pair.a.x > window.innerWidth * 0.4) pair.a.vx *= -1;
                    if (pair.a.y < 0 || pair.a.y > window.innerHeight) pair.a.vy *= -1;

                    pair.b.x = window.innerWidth - pair.a.x;
                    pair.b.y = pair.a.y;

                    // Use transform3d for GPU acceleration (faster than left/top)
                    pair.a.el.style.transform = `translate3d(${pair.a.x}px, ${pair.a.y}px, 0)`;
                    pair.b.el.style.transform = `translate3d(${pair.b.x}px, ${pair.b.y}px, 0)`;

                    const dx = pair.b.x - pair.a.x;
                    const dy = pair.b.y - pair.a.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    pair.line.style.width = length + 'px';
                    pair.line.style.transform = `translate3d(${pair.a.x}px, ${pair.a.y}px, 0) rotate(${angle}deg)`;
                });

                requestAnimationFrame(() => this.animate());
            }
        };

        // Initialize quantum field (desktop only, features check)
        if (window.innerWidth > 768 && Features.quantumParticles) {
            setTimeout(() => QuantumField.init(), 2000);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MANDELBROT FRACTAL VIDEO BACKGROUND - Precision Seamless Loop
        // Custom loop controller for frame-perfect looping
        // ═══════════════════════════════════════════════════════════════════════
        const MandelbrotBackground = {
            video: null,
            container: null,
            isPlaying: false,
            heroVisible: true,
            // Loop configuration - adjust loopEnd to find the perfect seamless point
            // The video should loop back just before the visual "jolt"
            loopStart: 0,        // Start point in seconds
            loopEnd: null,       // Will be set based on video duration (slightly before end)
            loopBuffer: 0.15,    // Seconds before end to trigger loop (prevents jolt)

            init() {
                this.container = document.getElementById('mandelbrot-bg');
                this.video = document.getElementById('mandelbrot-video');

                if (!this.container || !this.video) {
                    // console.log('⚡ Mandelbrot background: Elements not found');
                    return;
                }

                // Skip on slow connections or mobile
                if (PERF.isSlowConnection || PERF.isMobile) {
                    // console.log('⚡ Mandelbrot background: Disabled for performance');
                    this.container.style.display = 'none';
                    return;
                }

                // Set up IntersectionObserver to pause when not visible
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        this.heroVisible = entries[0].isIntersecting;
                        if (this.heroVisible && pageVisible) {
                            this.play();
                        } else {
                            this.pause();
                        }
                    }, { threshold: 0.1 });
                    observer.observe(this.container.parentElement);
                }

                // Handle video load errors
                this.video.addEventListener('error', () => this.handleError());

                // When metadata loads, set up the loop point
                this.video.addEventListener('loadedmetadata', () => {
                    // Set loop end point slightly before video end to avoid jolt
                    this.loopEnd = this.video.duration - this.loopBuffer;
                    // console.log(`✨ Mandelbrot loop: 0s → ${this.loopEnd.toFixed(2)}s (duration: ${this.video.duration.toFixed(2)}s)`);
                });

                // Precision loop using timeupdate event
                this.video.addEventListener('timeupdate', () => {
                    if (this.loopEnd && this.video.currentTime >= this.loopEnd) {
                        // Instantly reset to start for seamless loop
                        this.video.currentTime = this.loopStart;
                    }
                });

                // Fallback: if video somehow reaches end, restart
                this.video.addEventListener('ended', () => {
                    this.video.currentTime = this.loopStart;
                    this.video.play().catch(() => {});
                });

                // Start when video is ready
                this.video.addEventListener('canplaythrough', () => {
                    if (!this.isPlaying) {
                        this.start();
                    }
                }, { once: true });

                // Visibility change handler
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        this.pause();
                    } else if (this.heroVisible) {
                        this.play();
                    }
                });

                // Load video
                this.video.load();

                // console.log('✨ Mandelbrot Precision Loop initialized');
            },

            start() {
                this.isPlaying = true;
                this.video.currentTime = this.loopStart;
                this.video.play().catch(e => {
                    // console.log('Mandelbrot video autoplay blocked:', e);
                    // Try to play on first user interaction
                    document.addEventListener('click', () => this.play(), { once: true });
                });
            },

            play() {
                if (!this.isPlaying) return;
                this.video.play().catch(() => {});
            },

            pause() {
                this.video.pause();
            },

            handleError() {
                console.error('❌ Mandelbrot video error');
                // Hide container on error
                if (this.container) {
                    this.container.style.opacity = '0';
                }
            }
        };

        // Initialize Mandelbrot background after a delay (after loader)
        if (window.innerWidth > 768 && !PERF.isSlowConnection) {
            setTimeout(() => MandelbrotBackground.init(), 3000);
        }

        // console.log('🚀 Future Tier Enhancements Phases 8-17 loaded');

        // ═══════════════════════════════════════════════════════════════════════
        // 37 CONCEPTS MODAL - Must wait for DOM since modal HTML is after this script
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initConceptsModal() {
            const btn = document.getElementById('view-all-concepts');
            const overlay = document.getElementById('concepts-modal-overlay');
            const closeBtn = document.getElementById('concepts-modal-close');

            if (btn && overlay) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });

                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                }

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && overlay.classList.contains('active')) {
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });

        // ═══════════════════════════════════════════════════════════════════════
        // FAQ ACCORDION - Expand/collapse functionality
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initFAQAccordion() {
            const faqQuestions = document.querySelectorAll('.faq-question');

            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const item = question.closest('.faq-item');
                    const isActive = item.classList.contains('active');

                    // Close all other items
                    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                        if (activeItem !== item) {
                            activeItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');

                    // Haptic feedback
                    if (window.hapticFeedback) {
                        window.hapticFeedback.light();
                    }
                });
            });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // GLOSSARY FILTER - Filter terms by category
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initGlossaryFilter() {
            const filterBtns = document.querySelectorAll('.glossary-filter-btn');
            const glossaryItems = document.querySelectorAll('.glossary-item');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;

                    // Update active button
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Filter items
                    glossaryItems.forEach(item => {
                        const category = item.dataset.category;
                        if (filter === 'all' || category === filter) {
                            item.style.display = 'block';
                            item.style.animation = 'fadeIn 0.3s ease';
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // Haptic feedback
                    if (window.hapticFeedback) {
                        window.hapticFeedback.light();
                    }
                });
            });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // TIMELINE SCROLL ANIMATION - Animate timeline events on scroll
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initTimelineAnimation() {
            const timelineEvents = document.querySelectorAll('.timeline-event');

            if ('IntersectionObserver' in window && timelineEvents.length > 0) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    threshold: 0.2,
                    rootMargin: '0px 0px -50px 0px'
                });

                timelineEvents.forEach((event, index) => {
                    event.style.transitionDelay = `${index * 0.1}s`;
                    observer.observe(event);
                });
            }
        });

        // ═══════════════════════════════════════════════════════════════════════
        // CHAPTER PREVIEW CARDS - Hover effects and interactions
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initChapterCards() {
            const chapterCards = document.querySelectorAll('.chapter-card');

            chapterCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    if (window.hapticFeedback) {
                        window.hapticFeedback.light();
                    }
                });

                // Add touch feedback for mobile
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'scale(0.98)';
                }, { passive: true });

                card.addEventListener('touchend', () => {
                    card.style.transform = '';
                }, { passive: true });
            });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SCROLL TO PROPHECY BUTTON - Replaces inline onclick for accessibility
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initScrollToProphecy() {
            const btn = document.getElementById('scroll-to-prophecy-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    const target = document.getElementById('prophecy');
                    if (target) {
                        target.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }
                });
            }
        });

        // ═══════════════════════════════════════════════════════════════════════
        // READING PROGRESS BAR - Shows scroll progress through page
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initReadingProgress() {
            const progressBar = document.getElementById('reading-progress-bar');
            if (!progressBar) return;

            let ticking = false;

            function updateProgress() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateProgress);
                    ticking = true;
                }
            }, { passive: true });

            // Initial update
            updateProgress();
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SOCIAL PROOF COUNTER - Simulated viewer count
        // ═══════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', function initSocialProof() {
            const badge = document.getElementById('social-proof-badge');
            const numberEl = document.getElementById('social-proof-number');
            if (!badge || !numberEl) return;

            // Base viewers + time-based variance
            const baseViewers = 12;
            const maxVariance = 8;

            function getViewerCount() {
                // Simulate realistic viewer count with small fluctuations
                const timeVariance = Math.sin(Date.now() / 30000) * 3;
                const randomVariance = Math.random() * maxVariance;
                return Math.floor(baseViewers + timeVariance + randomVariance);
            }

            function animateNumber(target) {
                const current = parseInt(numberEl.textContent) || 0;
                const diff = target - current;
                const steps = 10;
                let step = 0;

                const animate = () => {
                    step++;
                    const progress = step / steps;
                    const value = Math.round(current + diff * progress);
                    numberEl.textContent = value;
                    if (step < steps) {
                        requestAnimationFrame(animate);
                    }
                };
                animate();
            }

            // Show badge after 5 seconds
            setTimeout(() => {
                badge.classList.add('visible');
                animateNumber(getViewerCount());
            }, 5000);

            // Update every 30 seconds
            setInterval(() => {
                animateNumber(getViewerCount());
            }, 30000);

            // Hide after scroll past certain point
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    if (scrollPercent > 80) {
                        badge.classList.remove('visible');
                    } else if (scrollPercent > 10) {
                        badge.classList.add('visible');
                    }
                }, 100);
            }, { passive: true });
        });

        // ═══════════════════════════════════════════════════════════════════════
        // LIVING EQUATION PARTICLES (ULTRATHINK)
        // ═══════════════════════════════════════════════════════════════════════
        (function initEquationParticles() {
            const canvas = document.getElementById('equation-particles');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let width, height, particles = [], mouse = { x: null, y: null, radius: 150 };

            function resize() {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                initParticles();
            }

            // Create particles that spell U = I × R²
            function initParticles() {
                particles = [];

                // Create temporary canvas to render text
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = width;
                tempCanvas.height = height;

                // Draw the equation
                const fontSize = Math.min(width / 8, 120);
                tempCtx.font = `bold ${fontSize}px 'Cinzel', serif`;
                tempCtx.fillStyle = '#d4a84b';
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                tempCtx.fillText('U = I × R²', width / 2, height / 2);

                // Sample pixels
                const imageData = tempCtx.getImageData(0, 0, width, height);
                const data = imageData.data;
                const gap = 4; // Density

                for (let y = 0; y < height; y += gap) {
                    for (let x = 0; x < width; x += gap) {
                        const index = (y * width + x) * 4;
                        const alpha = data[index + 3];

                        if (alpha > 128) {
                            particles.push({
                                x: x,
                                y: y,
                                baseX: x,
                                baseY: y,
                                size: Math.random() * 2 + 1,
                                color: `rgba(212, 168, 75, ${0.3 + Math.random() * 0.7})`
                            });
                        }
                    }
                }
            }

            function animate() {
                ctx.clearRect(0, 0, width, height);

                particles.forEach(p => {
                    // Calculate distance from mouse
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Repel particles from mouse
                    if (distance < mouse.radius && mouse.x !== null) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        const tx = p.x - Math.cos(angle) * force * 50;
                        const ty = p.y - Math.sin(angle) * force * 50;
                        p.x += (tx - p.x) * 0.1;
                        p.y += (ty - p.y) * 0.1;
                    } else {
                        // Return to base position
                        p.x += (p.baseX - p.x) * 0.05;
                        p.y += (p.baseY - p.y) * 0.05;
                    }

                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                });

                requestAnimationFrame(animate);
            }

            // Mouse tracking
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            canvas.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            // Touch support
            canvas.addEventListener('touchmove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
            });

            canvas.addEventListener('touchend', () => {
                mouse.x = null;
                mouse.y = null;
            });

            // Initialize
            window.addEventListener('resize', resize);
            resize();
            animate();

            // console.log('✨ Living Equation particles initialized with', particles.length, 'particles');
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // PROPHECY VIDEO PLAYER (ULTRATHINK)
        // ═══════════════════════════════════════════════════════════════════════
        (function initProphecyVideo() {
            const video = document.getElementById('prophecy-video');
            const overlay = document.getElementById('prophecy-overlay');
            const wrapper = document.getElementById('prophecy-video-wrapper');

            if (!video || !overlay) return;

            overlay.addEventListener('click', () => {
                overlay.classList.add('hidden');
                video.play();
            });

            video.addEventListener('ended', () => {
                overlay.classList.remove('hidden');
                video.currentTime = 0;
            });

            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    overlay.classList.add('hidden');
                } else {
                    video.pause();
                    overlay.classList.remove('hidden');
                }
            });

            // console.log('✨ Prophecy Video player initialized');
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // CHOKEPOINT GOLDEN LINE ANIMATION (ULTRATHINK)
        // ═══════════════════════════════════════════════════════════════════════
        (function initChokepointAnimation() {
            const goldenLine = document.querySelector('.golden-line');
            if (!goldenLine) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        goldenLine.style.animation = 'drawLine 2s ease-out forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(goldenLine.closest('.chokepoint-section'));

            // Add hover effects to chokepoint nodes
            document.querySelectorAll('.chokepoint-node').forEach(node => {
                node.addEventListener('mouseenter', () => {
                    node.querySelector('circle').style.strokeWidth = '4';
                });
                node.addEventListener('mouseleave', () => {
                    node.querySelector('circle').style.strokeWidth = '2';
                });
            });

            // console.log('✨ Chokepoint animation initialized');
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // THE MONUMENT: TIME-SLIP SLIDER LOGIC
        // ═══════════════════════════════════════════════════════════════════════
        (function initTimeSlip() {
            const container = document.querySelector('.time-slip-container');
            const overlay = document.getElementById('slider-overlay');
            const handle = document.getElementById('slider-handle');
            const instructions = document.querySelector('.slider-instructions');

            if (!container || !overlay || !handle) return;

            let isDragging = false;
            let hasInteracted = false;

            function move(x) {
                const rect = container.getBoundingClientRect();
                let percentage = ((x - rect.left) / rect.width) * 100;
                percentage = Math.max(5, Math.min(95, percentage));

                overlay.style.width = percentage + '%';
                handle.style.left = percentage + '%';

                // Hide instructions after first interaction
                if (!hasInteracted) {
                    hasInteracted = true;
                    if (instructions) {
                        instructions.style.opacity = '0';
                        instructions.style.pointerEvents = 'none';
                    }
                }
            }

            // Mouse events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
                document.body.style.cursor = 'col-resize';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.cursor = '';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                move(e.clientX);
            });

            // Touch events
            handle.addEventListener('touchstart', (e) => {
                isDragging = true;
            }, { passive: true });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                move(e.touches[0].clientX);
            }, { passive: true });

            // Click anywhere on slider to jump
            container.addEventListener('click', (e) => {
                if (e.target === handle || handle.contains(e.target)) return;
                move(e.clientX);
            });

            // Initial hint animation
            setTimeout(() => {
                if (hasInteracted) return;

                let start = 50;
                let direction = 1;
                let ticks = 0;

                const hint = setInterval(() => {
                    if (hasInteracted || ticks > 60) {
                        clearInterval(hint);
                        return;
                    }

                    start += direction * 0.3;
                    if (start > 55 || start < 45) direction *= -1;

                    overlay.style.width = start + '%';
                    handle.style.left = start + '%';
                    ticks++;
                }, 40);
            }, 2500);

            // console.log('✨ Time-Slip Slider initialized');
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // COMPLETE WEAPON: MISSION BAR VISIBILITY CONTROLLER
        // ═══════════════════════════════════════════════════════════════════════
        (function initMissionBar() {
            const missionBar = document.getElementById('mission-bar');
            const ctaSection = document.querySelector('.cta-section');
            const tripathSection = document.querySelector('.tripath-section');

            if (!missionBar) return;

            // Hide mission bar when CTA or Tri-Path section is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        missionBar.classList.add('hidden');
                    } else {
                        missionBar.classList.remove('hidden');
                    }
                });
            }, { threshold: 0.3 });

            if (ctaSection) observer.observe(ctaSection);
            if (tripathSection) observer.observe(tripathSection);

            // Hide on scroll up near top
            window.addEventListener('scroll', () => {
                if (window.scrollY < 300) {
                    missionBar.classList.add('hidden');
                } else if (!isInViewport(ctaSection) && !isInViewport(tripathSection)) {
                    missionBar.classList.remove('hidden');
                }
            }, { passive: true });

            function isInViewport(el) {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }

            // console.log('✨ Mission Bar initialized');
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // COMPLETE WEAPON: HAPTIC EQUATION - GYROSCOPE PARALLAX
        // Uses existing motion-enable-btn for permission (no duplicate button)
        // ═══════════════════════════════════════════════════════════════════════
        (function initHapticEquation() {
            if (window.innerWidth > 768) return;
            if (!window.DeviceOrientationEvent) return;

            // iOS 13+ permission is already handled by motion-enable-btn
            // Just enable gyroscope if permission already granted or not needed
            if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
                enableGyroscope();
            }

            function enableGyroscope() {
                const equationTerms = document.querySelectorAll('.eq-term');
                const particleCanvas = document.getElementById('equation-particles');

                window.addEventListener('deviceorientation', (e) => {
                    const tiltX = e.gamma || 0;
                    const tiltY = e.beta || 0;
                    const x = Math.max(-30, Math.min(30, tiltX));
                    const y = Math.max(-30, Math.min(30, tiltY));

                    equationTerms.forEach((term, i) => {
                        const depth = 0.3 + (i * 0.2);
                        term.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                    });

                    if (particleCanvas) {
                        particleCanvas.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
                    }
                }, { passive: true });

                // console.log('✨ Haptic Equation gyroscope enabled');
            }
        })();

        // ═══════════════════════════════════════════════════════════════════════
        // COMPLETE WEAPON: SWIPE DECK INDICATORS
        // ═══════════════════════════════════════════════════════════════════════
        (function initSwipeIndicators() {
            if (window.innerWidth > 768) return;

            const decks = document.querySelectorAll('.ideas-grid, .predictions-grid, .evidence-grid');

            decks.forEach(deck => {
                const cards = deck.querySelectorAll('.idea-card, .prediction-card, .evidence-card');
                if (cards.length < 2) return;

                // Create indicator container
                const indicator = document.createElement('div');
                indicator.className = 'swipe-indicator';

                cards.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.className = 'swipe-dot' + (i === 0 ? ' active' : '');
                    indicator.appendChild(dot);
                });

                deck.parentNode.insertBefore(indicator, deck.nextSibling);

                // Update active dot on scroll
                const dots = indicator.querySelectorAll('.swipe-dot');
                deck.addEventListener('scroll', () => {
                    const scrollLeft = deck.scrollLeft;
                    const cardWidth = cards[0].offsetWidth + 16;
                    const activeIndex = Math.round(scrollLeft / cardWidth);

                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === activeIndex);
                    });
                }, { passive: true });
            });

            // console.log('✨ Swipe indicators initialized');
        })();

    })();
