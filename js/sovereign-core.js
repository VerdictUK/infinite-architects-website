(function() {
    'use strict';
        // ═══════════════════════════════════════════════════════════════════════
        // PRODUCTION MODE: Suppress console.log in production
        // ═══════════════════════════════════════════════════════════════════════
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = function() {};
        }

        // ═══════════════════════════════════════════════════════════════════════
        // NUCLEAR FIX: SAFE QUERY UTILITIES
        // ═══════════════════════════════════════════════════════════════════════
        const $ = (selector) => document.querySelector(selector);
        const $$ = (selector) => [...document.querySelectorAll(selector)];

        const safeQuery = (selector, callback) => {
            const el = document.querySelector(selector);
            if (el && typeof callback === 'function') {
                callback(el);
            }
            return el;
        };

        const safeQueryAll = (selector, callback) => {
            const els = document.querySelectorAll(selector);
            if (els.length && typeof callback === 'function') {
                els.forEach(callback);
            }
            return els;
        };

        // ═══════════════════════════════════════════════════════════════════════
        // NUCLEAR FIX: INTERVAL CLEANUP SYSTEM (Memory Leak Prevention)
        // ═══════════════════════════════════════════════════════════════════════
        const intervalIds = [];
        const timeoutIds = [];

        const safeInterval = (callback, delay) => {
            const id = setInterval(callback, delay);
            intervalIds.push(id);
            return id;
        };

        const safeTimeout = (callback, delay) => {
            const id = setTimeout(callback, delay);
            timeoutIds.push(id);
            return id;
        };

        // Clear all intervals/timeouts on page unload
        window.addEventListener('beforeunload', () => {
            intervalIds.forEach(id => clearInterval(id));
            timeoutIds.forEach(id => clearTimeout(id));
        });

        // Pause intervals when tab is hidden (battery saver)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                intervalIds.forEach(id => clearInterval(id));
            }
        });

        // ═══════════════════════════════════════════════════════════════════════
        // NUCLEAR FIX: GLOBAL ERROR BOUNDARY
        // ═══════════════════════════════════════════════════════════════════════
        window.addEventListener('error', (event) => {
            // Prevent error from breaking the page
            event.preventDefault();
        });

        window.addEventListener('unhandledrejection', (event) => {
            event.preventDefault();
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SCROLL POSITION FIX - Ensure page starts at top
        // ═══════════════════════════════════════════════════════════════════════
        // Disable browser's automatic scroll restoration (fixes page opening mid-scroll)
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        // Force scroll to top immediately
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0; // For Safari

        // ═══════════════════════════════════════════════════════════════════════
        // LAZY LOAD THREE.JS - After first paint for faster initial render
        // ═══════════════════════════════════════════════════════════════════════
        window.threeJsReady = false;
        function loadThreeJS() {
            if (window.THREE) {
                window.threeJsReady = true;
                window.dispatchEvent(new Event('threejs-ready'));
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

            // Timeout protection - 10 seconds max wait
            const loadTimeout = setTimeout(() => {
                script.onerror = null;
                script.onload = null;
                console.warn('[Three.js] Load timeout after 10s - falling back to static background');
                window.threeJsReady = false;
                window.dispatchEvent(new CustomEvent('threejs-failed', { detail: { reason: 'timeout' } }));
            }, 10000);

            script.onload = function() {
                clearTimeout(loadTimeout);
                window.threeJsReady = true;
                window.dispatchEvent(new Event('threejs-ready'));
            };

            script.onerror = function() {
                clearTimeout(loadTimeout);
                console.error('[Three.js] Failed to load from CDN');
                window.threeJsReady = false;
                window.dispatchEvent(new CustomEvent('threejs-failed', { detail: { reason: 'network' } }));
            };

            document.head.appendChild(script);
        }

        // Load after first paint (100ms delay)
        if (document.readyState === 'complete') {
            setTimeout(loadThreeJS, 100);
        } else {
            window.addEventListener('load', () => setTimeout(loadThreeJS, 100));
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PERFORMANCE DETECTION - Connection-aware adaptive loading
        // ═══════════════════════════════════════════════════════════════════════
        const PERF = {
            // Detect connection speed and device capability
            connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,

            get isSlowConnection() {
                if (this.connection) {
                    // saveData mode or slow effective type
                    if (this.connection.saveData) return true;
                    const slow = ['slow-2g', '2g', '3g'];
                    if (slow.includes(this.connection.effectiveType)) return true;
                    // Low bandwidth (under 1.5 Mbps)
                    if (this.connection.downlink && this.connection.downlink < 1.5) return true;
                }
                // Check device memory (low-end devices)
                if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
                // Check hardware concurrency (weak CPU)
                if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
                return false;
            },

            get isMobile() {
                return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            },

            get reducedMotion() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            },

            // Performance multiplier: 1.0 = full, 0.5 = half, 0.25 = quarter
            get multiplier() {
                if (this.reducedMotion) return 0.1;
                if (this.isSlowConnection && this.isMobile) return 0.4; // Increased from 0.25
                if (this.isSlowConnection || this.isMobile) return 0.7; // Increased from 0.5
                return 1.0;
            }
        };

        // console.log(`⚡ Performance mode: ${PERF.multiplier}x (slow: ${PERF.isSlowConnection}, mobile: ${PERF.isMobile})`);

        // ═══════════════════════════════════════════════════════════════════════
        // CONFIGURATION - Adaptive based on connection
        // ═══════════════════════════════════════════════════════════════════════
        const CONFIG = {
            loader: {
                duration: PERF.isSlowConnection ? 10000 : 15000, // Cinematic intro - let the prophecy unfold
                particleCount: Math.floor(350 * PERF.multiplier) || 150, // Increased base
                ringCount: 4, // Always show all rings
                trailLength: PERF.isSlowConnection ? 8 : 15,
                goldHue: 38
            },
            main: {
                particleCount: Math.floor(500 * PERF.multiplier) || 200,
                connectionDistance: PERF.isSlowConnection ? 80 : 100,
                connectionCheckCount: PERF.isMobile ? 40 : 60,
                maxConnections: PERF.isMobile ? 200 : 400,
                mouseInfluence: 0.00003,
                recursionFactor: 1.0,
                particleSpeed: 0.3
            }
        };

        const TAU = Math.PI * 2;
        const lerp = (a, b, t) => a + (b - a) * t;
        const ease = {
            outQuint: t => 1 - Math.pow(1 - t, 5),
            outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2
        };

        // Throttle utility for scroll handlers
        const throttle = (fn, wait) => {
            let last = 0;
            return function(...args) {
                const now = Date.now();
                if (now - last >= wait) {
                    last = now;
                    fn.apply(this, args);
                }
            };
        };

        // ═══════════════════════════════════════════════════════════════════════
        // FEATURES TOGGLE - Connection-aware feature switching
        // ═══════════════════════════════════════════════════════════════════════
        const Features = {
            particles: !PERF.reducedMotion,
            connections: !PERF.isSlowConnection && !PERF.reducedMotion,
            filmGrain: !PERF.isMobile && !PERF.isSlowConnection,
            quantumParticles: !PERF.isMobile && !PERF.isSlowConnection && !PERF.reducedMotion,
            neuralNetwork: !PERF.isMobile && !PERF.isSlowConnection,
            smoothScroll: !PERF.reducedMotion,
            cursor: !PERF.isMobile && window.matchMedia('(pointer: fine)').matches
        };

        // console.log('⚡ Features:', Features);

        // Disable film grain if not enabled
        if (!Features.filmGrain) {
            const fg = document.querySelector('.film-grain');
            if (fg) fg.style.display = 'none';
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PAGE VISIBILITY - Pause animations when tab hidden
        // ═══════════════════════════════════════════════════════════════════════
        let pageVisible = true;
        document.addEventListener('visibilitychange', () => {
            pageVisible = !document.hidden;
            // console.log(pageVisible ? '▶️ Animations resumed' : '⏸️ Animations paused (tab hidden)');
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SCROLL MANAGER - Single throttled scroll handler
        // ═══════════════════════════════════════════════════════════════════════
        const ScrollManager = {
            callbacks: [],
            ticking: false,
            scrollY: 0,

            register(callback) {
                this.callbacks.push(callback);
                if (this.callbacks.length === 1) {
                    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
                }
            },

            onScroll() {
                this.scrollY = window.scrollY;
                if (!this.ticking) {
                    requestAnimationFrame(() => {
                        this.callbacks.forEach(cb => cb(this.scrollY));
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }
        };

        // ═══════════════════════════════════════════════════════════════════════
        // VECTOR CLASSES
        // ═══════════════════════════════════════════════════════════════════════
        class V3 {
            constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
            clone() { return new V3(this.x, this.y, this.z); }
            add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
            sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
            scale(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
            len() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
            norm() { const l = this.len(); if (l > 0) { this.x /= l; this.y /= l; this.z /= l; } return this; }
            rotX(a) { const c = Math.cos(a), s = Math.sin(a), y = this.y * c - this.z * s, z = this.y * s + this.z * c; this.y = y; this.z = z; return this; }
            rotY(a) { const c = Math.cos(a), s = Math.sin(a), x = this.x * c - this.z * s, z = this.x * s + this.z * c; this.x = x; this.z = z; return this; }
        }

        class V4 {
            constructor(x = 0, y = 0, z = 0, w = 0) { this.x = x; this.y = y; this.z = z; this.w = w; }
            clone() { return new V4(this.x, this.y, this.z, this.w); }
            rotXW(a) { const c = Math.cos(a), s = Math.sin(a), x = this.x * c - this.w * s, w = this.x * s + this.w * c; this.x = x; this.w = w; return this; }
            rotYW(a) { const c = Math.cos(a), s = Math.sin(a), y = this.y * c - this.w * s, w = this.y * s + this.w * c; this.y = y; this.w = w; return this; }
            rotZW(a) { const c = Math.cos(a), s = Math.sin(a), z = this.z * c - this.w * s, w = this.z * s + this.w * c; this.z = z; this.w = w; return this; }
            rotXY(a) { const c = Math.cos(a), s = Math.sin(a), x = this.x * c - this.y * s, y = this.x * s + this.y * c; this.x = x; this.y = y; return this; }
            rotXZ(a) { const c = Math.cos(a), s = Math.sin(a), x = this.x * c - this.z * s, z = this.x * s + this.z * c; this.x = x; this.z = z; return this; }
            rotYZ(a) { const c = Math.cos(a), s = Math.sin(a), y = this.y * c - this.z * s, z = this.y * s + this.z * c; this.y = y; this.z = z; return this; }
            project3D(d = 2) { const f = d / (d - this.w); return new V3(this.x * f, this.y * f, this.z * f); }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // LOADER ANIMATION - Wormhole Effect
        // ═══════════════════════════════════════════════════════════════════════
        const loaderState = {
            particles: [],
            rings: [],
            progress: 0,
            startTime: Date.now(),
            skipped: false,
            completed: false
        };

        const STATUS_PHASES = [
            'Initializing consciousness...',
            'Calibrating recursive pathways...',
            'Assembling infinite architecture...',
            'Achieving harmonic convergence...',
            'GENESIS COMPLETE'
        ];

        class LoaderParticle {
            constructor(i) {
                this.reset();
                this.z = Math.random() * 800 - 400;
                this.hue = CONFIG.loader.goldHue + Math.random() * 16 - 8;
                this.sat = 55 + Math.random() * 25;
                this.light = 55 + Math.random() * 20;
                this.alpha = 0.3 + Math.random() * 0.4;
                this.size = 0.6 + Math.random() * 1.8;
                this.spiralSpeed = 0.0003 + Math.random() * 0.0008;
                this.trail = [];
            }

            reset() {
                this.angle = Math.random() * TAU;
                this.dist = 30 + Math.random() * 250;
                this.z = 500;
                this.baseSpeed = 1.5 + Math.random() * 4;
            }

            update(progress) {
                const speedMult = 1 + progress * 3.5 + ease.outExpo(progress) * 2;
                this.z -= this.baseSpeed * speedMult;
                this.angle += this.spiralSpeed * (1 + progress * 2);
                if (this.z < -400) this.reset();

                const pos = this.getPos();
                if (this.trail.length === 0 || pos.clone().sub(this.trail[this.trail.length - 1]).len() > 2) {
                    this.trail.push(pos);
                    if (this.trail.length > CONFIG.loader.trailLength + Math.floor(progress * 8)) {
                        this.trail.shift();
                    }
                }
            }

            getPos() {
                return new V3(
                    Math.cos(this.angle) * this.dist,
                    Math.sin(this.angle) * this.dist * 0.4,
                    this.z
                );
            }

            project(pos, fl, cx, cy) {
                const scale = fl / (fl + pos.z);
                return { x: cx + pos.x * scale, y: cy + pos.y * scale, z: pos.z, scale };
            }

            draw(ctx, cx, cy, fl, progress) {
                const pos = this.getPos();
                const proj = this.project(pos, fl, cx, cy);
                if (proj.z > fl * 0.95 || proj.z < -fl) return;

                const depthAlpha = Math.max(0.05, 1 - (proj.z + 400) / 900);
                const size = this.size * proj.scale * (1 + progress * 0.5);

                // Trail
                if (this.trail.length > 1) {
                    ctx.beginPath();
                    for (let i = 0; i < this.trail.length; i++) {
                        const tp = this.project(this.trail[i], fl, cx, cy);
                        if (i === 0) ctx.moveTo(tp.x, tp.y);
                        else ctx.lineTo(tp.x, tp.y);
                    }
                    ctx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${depthAlpha * this.alpha * 0.25})`;
                    ctx.lineWidth = size * 0.5;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                // Glow
                const glow = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, size * 3);
                glow.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.light + 10}%, ${this.alpha * depthAlpha})`);
                glow.addColorStop(0.4, `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.alpha * depthAlpha * 0.35})`);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, size * 3, 0, TAU);
                ctx.fill();

                // Core
                ctx.fillStyle = `hsla(${this.hue}, ${this.sat - 15}%, ${this.light + 20}%, ${depthAlpha})`;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, size * 0.5, 0, TAU);
                ctx.fill();
            }
        }

        class LoaderRing {
            constructor(radius, segments, tiltX, tiltY, speed, hue) {
                this.radius = radius;
                this.segments = segments;
                this.tiltX = tiltX;
                this.tiltY = tiltY;
                this.speed = speed;
                this.hue = hue;
                this.phase = Math.random() * TAU;
            }

            draw(ctx, cx, cy, fl, progress, time) {
                const opacity = Math.min(1, progress * 3) * 0.35;
                if (opacity < 0.01) return;

                this.phase += this.speed;
                const pulse = 1 + Math.sin(time * 0.0008) * 0.08;
                const points = [];

                for (let i = 0; i <= this.segments; i++) {
                    const a = (i / this.segments) * TAU + this.phase;
                    const p = new V3(
                        Math.cos(a) * this.radius * pulse,
                        0,
                        Math.sin(a) * this.radius * pulse
                    );
                    p.rotX(this.tiltX);
                    p.rotY(this.tiltY);
                    const scale = fl / (fl + p.z);
                    points.push({ x: cx + p.x * scale, y: cy + p.y * scale, z: p.z });
                }

                ctx.beginPath();
                for (let i = 0; i < points.length; i++) {
                    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
                    else ctx.lineTo(points[i].x, points[i].y);
                }
                
                const avgZ = points.reduce((s, p) => s + p.z, 0) / points.length;
                const da = Math.max(0.1, 1 - (avgZ + 110) / 350);
                
                ctx.strokeStyle = `hsla(${this.hue}, 50%, 58%, ${opacity * da})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.strokeStyle = `hsla(${this.hue}, 60%, 62%, ${opacity * da * 0.15})`;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
        }

        function initLoader() {
            const canvas = document.getElementById('loader-canvas');
            if (!canvas) {
                console.error('[Loader] Canvas element not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('[Loader] Could not get 2D context');
                return;
            }

            const loader = document.getElementById('loader');
            const barFill = document.getElementById('loader-bar-fill');
            const statusEl = document.getElementById('loader-status');

            // Masterpiece elements - Quote sequence and equation
            const quotesContainer = document.getElementById('loader-quotes');
            const quotes = quotesContainer ? quotesContainer.querySelectorAll('.loader-quote') : [];
            const equationContainer = document.getElementById('loader-equation');
            const equationChars = equationContainer ? equationContainer.querySelectorAll('.eq-char') : [];
            const loaderUI = loader.querySelector('.loader-ui');

            // Animation state tracking
            let currentQuoteIndex = -1;
            let equationRevealed = false;
            let uiRevealed = false;
            let earlyInitDone = false; // Track if early site init has run

            // Device pixel ratio for crisp mobile rendering
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

            function resize() {
                // Set canvas size accounting for device pixel ratio
                const w = window.innerWidth;
                const h = window.innerHeight;

                // Set display size (CSS)
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';

                // Set actual size in memory (scaled for DPR)
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);

                // Scale context to match DPR
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            resize();
            window.addEventListener('resize', resize);

            // Initialize particles and rings
            for (let i = 0; i < CONFIG.loader.particleCount; i++) {
                loaderState.particles.push(new LoaderParticle(i));
            }
            
            loaderState.rings = [
                new LoaderRing(80, 50, 0.2, 0, 0.002, 42),
                new LoaderRing(110, 60, -0.15, 0.4, -0.0015, 46),
                new LoaderRing(140, 70, 0.35, 0.8, 0.001, 38),
                new LoaderRing(170, 80, -0.25, 1.2, -0.0008, 50)
            ];

            // Skip functionality
            function skipLoader() {
                if (!loaderState.skipped) {
                    loaderState.skipped = true;
                    completeLoader();
                }
            }

            loader.addEventListener('click', skipLoader);
            document.addEventListener('keydown', skipLoader);

            function completeLoader() {
                if (loaderState.completed) return;
                loaderState.completed = true;

                // Ensure page is at top
                window.scrollTo(0, 0);

                // Phase 1: Subtle shimmer before exit
                const loaderUI = loader.querySelector('.loader-ui');
                if (loaderUI) {
                    loaderUI.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
                    loaderUI.style.filter = 'brightness(2) drop-shadow(0 0 30px var(--gold))';
                }

                // Phase 2: Trigger the Titan Drop & Loader Exit
                setTimeout(() => {
                    document.body.classList.add('cinematic');
                    loader.classList.add('hidden'); // Trigger the slide-up
                }, 400);

                // Phase 3: Allow scroll precisely on IMPACT (2000ms from completeLoader start)
                setTimeout(() => {
                    // Trigger SVG distortion animation trigger
                    const distort = document.getElementById('distort-anim');
                    if (distort) distort.beginElement();

                    // FORCE UNLOCK SCROLL
                    document.body.classList.add('cinematic-ready');
                    document.documentElement.classList.add('cinematic-ready');

                    // Inline styles as backup
                    document.body.style.overflow = 'auto';
                    document.body.style.overflowY = 'auto';
                    document.body.style.overflowX = 'hidden';
                    document.body.style.height = 'auto';
                    document.documentElement.style.overflow = 'auto';
                    document.documentElement.style.overflowY = 'auto';
                    document.documentElement.style.overflowX = 'hidden';
                    document.body.style.position = 'relative';

                    // CRITICAL: Resize Lenis to recalculate scroll bounds after unlock
                    if (window.lenisInstance && typeof window.lenisInstance.resize === 'function') {
                        window.lenisInstance.resize();
                        console.log('[LENIS] Resize called after scroll unlock');
                    }

                    // Cleanup loader
                    loader.classList.add('fully-hidden');

                    // Initialize features (skip if early init already done)
                    if (!earlyInitDone) {
                        // Initialize Three.js canvas only when library is ready
                        if (window.THREE) {
                            initMainCanvas();
                        } else if (window.threeJsReady === false) {
                            window.addEventListener('threejs-ready', initMainCanvas, { once: true });
                        }

                        initScrollAnimations();
                        initNavigation();

                        // Trigger Tesseract
                        initTesseract();

                        // Trigger Book Float
                        const book = document.getElementById('hero-book');
                        if (book) {
                            book.style.opacity = '1';
                            book.classList.add('float');
                        }
                    }

                    // Lazy load book cover video (skip if already loaded by early init)
                    const bookVideo = document.getElementById('book-cover-video');
                    if (bookVideo && !bookVideo.querySelector('source')) {
                        const isDesktop = window.innerWidth > 768;
                        const videoSrc = isDesktop ? bookVideo.dataset.srcHq : bookVideo.dataset.srcMobile;

                        if (videoSrc) {
                            // Create and add source element
                            const source = document.createElement('source');
                            source.src = videoSrc;
                            source.type = 'video/mp4';
                            bookVideo.appendChild(source);

                            // Load and play when ready
                            bookVideo.load();
                            bookVideo.play().catch(() => {
                                // Autoplay blocked - that's fine, poster shows
                                console.log('[Book Video] Autoplay blocked, showing poster');
                            });
                        }
                    }

                    // Phase 4: Cinematic entrance for Ask Book button (after impact)
                    setTimeout(() => {
                        const askBtn = document.getElementById('ask-book-toggle');
                        if (askBtn) {
                            askBtn.style.setProperty('display', 'flex', 'important');
                            askBtn.style.setProperty('visibility', 'visible', 'important');
                            askBtn.style.setProperty('opacity', '0', 'important'); // Start hidden
                            askBtn.style.setProperty('transform', 'scale(0.5) translateY(50px)', 'important');
                            askBtn.style.setProperty('transition', 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', 'important');
                            
                            // Force reflow
                            void askBtn.offsetWidth;
                            
                            askBtn.style.setProperty('opacity', '1', 'important');
                            askBtn.style.setProperty('transform', 'scale(1) translateY(0)', 'important');
                            askBtn.style.setProperty('z-index', '2147483647', 'important');
                            askBtn.style.setProperty('pointer-events', 'auto', 'important');

                            console.log('[LOADER COMPLETE] Ask Book button cinematic entry');
                        }
                    }, 800); // 0.8s after site becomes ready

                }, 800); // 800ms - allow scroll much earlier during animations

                // SAFETY UNLOCK: Force scroll ability after 2s in case of any animation hang
                setTimeout(() => {
                    document.body.classList.add('cinematic-ready');
                    document.documentElement.classList.add('cinematic-ready');
                    document.body.style.overflow = 'auto';
                    document.body.style.overflowY = 'auto';
                    document.body.style.height = 'auto';
                    document.body.style.position = 'relative';

                    // Safety resize for Lenis
                    if (window.lenisInstance && typeof window.lenisInstance.resize === 'function') {
                        window.lenisInstance.resize();
                    }
                }, 2000);
            }

            function animate() {
                const elapsed = Date.now() - loaderState.startTime;
                const progress = Math.min(1, elapsed / CONFIG.loader.duration);
                loaderState.progress = progress;

                // Use CSS dimensions (not DPR-scaled canvas dimensions) for coordinate calculations
                const w = window.innerWidth;
                const h = window.innerHeight;
                const cx = w / 2;
                const cy = h / 2;
                const fl = 350;

                // Clear with fade
                ctx.fillStyle = 'rgba(2, 3, 10, 0.12)';
                ctx.fillRect(0, 0, w, h);

                // Draw rings
                for (const ring of loaderState.rings) {
                    ring.draw(ctx, cx, cy, fl, progress, elapsed);
                }

                // Update and draw particles (sorted by depth)
                loaderState.particles.sort((a, b) => b.getPos().z - a.getPos().z);
                for (const particle of loaderState.particles) {
                    particle.update(progress);
                    particle.draw(ctx, cx, cy, fl, progress);
                }

                // Central nexus glow
                const nexusSize = 30 + progress * 40 + Math.sin(elapsed * 0.002) * 10;
                const nexusGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, nexusSize);
                nexusGlow.addColorStop(0, `hsla(48, 70%, 68%, ${0.3 + progress * 0.4})`);
                nexusGlow.addColorStop(0.3, `hsla(42, 60%, 53%, ${0.15 + progress * 0.2})`);
                nexusGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = nexusGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, nexusSize, 0, TAU);
                ctx.fill();

                // Vignette
                const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
                vg.addColorStop(0, 'transparent');
                vg.addColorStop(0.45, 'transparent');
                vg.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
                ctx.fillStyle = vg;
                ctx.fillRect(0, 0, w, h);

                // Update progress bar
                barFill.style.width = `${progress * 100}%`;

                // ═══════════════════════════════════════════════════════════════
                // HOLLYWOOD BLOCKBUSTER CINEMATIC SEQUENCE
                // No overlaps - each element has its moment
                // ═══════════════════════════════════════════════════════════════

                // Phase 1: Quote Sequence (0-45%)
                // Each quote gets dedicated time, centered on screen
                if (progress < 0.45 && quotes.length > 0) {
                    const quotePhase = progress / 0.45; // 0 to 1 within quote phase
                    const targetQuote = Math.min(Math.floor(quotePhase * quotes.length), quotes.length - 1);

                    if (targetQuote !== currentQuoteIndex) {
                        // Fade out current quote
                        if (currentQuoteIndex >= 0 && quotes[currentQuoteIndex]) {
                            quotes[currentQuoteIndex].classList.remove('active');
                        }
                        // Fade in new quote
                        currentQuoteIndex = targetQuote;
                        if (quotes[currentQuoteIndex]) {
                            quotes[currentQuoteIndex].classList.add('active');
                        }
                    }
                }

                // Phase 2: Hide quotes completely, reveal equation (45-55%)
                if (progress >= 0.45 && progress < 0.55 && !equationRevealed) {
                    equationRevealed = true;
                    // Fade out all quotes completely
                    quotes.forEach(q => q.classList.remove('active'));
                    if (quotesContainer) {
                        quotesContainer.style.opacity = '0';
                        quotesContainer.style.visibility = 'hidden';
                    }
                    // Reveal equation container (centered)
                    if (equationContainer) {
                        equationContainer.classList.add('reveal');
                    }
                }

                // Phase 3: Reveal equation characters one by one (55-75%)
                if (progress >= 0.55 && progress < 0.75 && equationChars.length > 0) {
                    const charProgress = (progress - 0.55) / 0.20; // 0 to 1 within this phase
                    const charsToShow = Math.floor(charProgress * (equationChars.length + 1));
                    equationChars.forEach((char, i) => {
                        if (i < charsToShow) {
                            char.classList.add('visible');
                        }
                    });
                }

                // Phase 4: Move equation up, reveal title (75-85%)
                if (progress >= 0.75 && !uiRevealed) {
                    uiRevealed = true;
                    // Complete equation reveal
                    equationChars.forEach(char => char.classList.add('visible'));
                    // Move equation up to make room
                    if (equationContainer) {
                        equationContainer.classList.add('complete');
                        equationContainer.classList.add('move-up');
                    }
                    // Reveal the title
                    if (loaderUI) {
                        loaderUI.classList.add('reveal');
                    }
                }

                // Phase 5: Reveal subtitle and author (85-95%)
                if (progress >= 0.85) {
                    const subtitle = loaderUI?.querySelector('.loader-subtitle');
                    const author = loaderUI?.querySelector('.loader-author');
                    if (subtitle) subtitle.classList.add('reveal');
                    if (progress >= 0.90 && author) author.classList.add('reveal');
                }

                // Update status message based on cinematic phase
                let statusMessage;
                if (progress < 0.15) {
                    statusMessage = 'Awakening consciousness...';
                } else if (progress < 0.30) {
                    statusMessage = 'Perceiving the infinite...';
                } else if (progress < 0.45) {
                    statusMessage = 'Glimpsing what comes next...';
                } else if (progress < 0.55) {
                    statusMessage = 'Channelling the equation...';
                } else if (progress < 0.75) {
                    statusMessage = 'U = I × R² manifesting...';
                } else if (progress < 0.90) {
                    statusMessage = 'The architecture reveals itself...';
                } else {
                    statusMessage = 'GENESIS COMPLETE';
                }
                statusEl.textContent = statusMessage;

                if (progress < 1 && !loaderState.skipped) {
                    requestAnimationFrame(animate);
                } else if (!loaderState.skipped) {
                    setTimeout(completeLoader, 400);
                }
            }

            animate();

            // EARLY SITE INITIALIZATION - Let users scroll and interact after 3 seconds
            setTimeout(() => {
                // 1. Unlock scrolling
                document.body.classList.add('cinematic-ready');
                document.documentElement.classList.add('cinematic-ready');
                document.body.style.overflow = 'auto';
                document.body.style.overflowY = 'auto';
                document.body.style.overflowX = 'hidden';
                document.body.style.height = 'auto';
                document.body.style.position = 'relative';

                // 2. Start loading book video early
                const bookVideo = document.getElementById('book-cover-video');
                if (bookVideo && !bookVideo.querySelector('source')) {
                    const isDesktop = window.innerWidth > 768;
                    const videoSrc = isDesktop ? bookVideo.dataset.srcHq : bookVideo.dataset.srcMobile;
                    if (videoSrc) {
                        const source = document.createElement('source');
                        source.src = videoSrc;
                        source.type = 'video/mp4';
                        bookVideo.appendChild(source);
                        bookVideo.load();
                        bookVideo.play().catch(() => {
                            console.log('[Book Video] Early autoplay blocked, poster shows');
                        });
                        console.log('[EARLY INIT] Book video started loading');
                    }
                }

                // 3. Show book early
                const book = document.getElementById('hero-book');
                if (book) {
                    book.style.opacity = '1';
                    book.classList.add('float');
                }

                // 4. Initialize site features early (if not already done)
                if (typeof initScrollAnimations === 'function') {
                    try { initScrollAnimations(); } catch(e) { console.log('[EARLY INIT] Scroll animations deferred'); }
                }
                if (typeof initNavigation === 'function') {
                    try { initNavigation(); } catch(e) { console.log('[EARLY INIT] Navigation deferred'); }
                }

                // 5. Initialize Three.js background early
                if (window.THREE && typeof initMainCanvas === 'function') {
                    try { initMainCanvas(); } catch(e) { console.log('[EARLY INIT] Three.js deferred'); }
                }

                // 6. Initialize Tesseract early
                if (typeof initTesseract === 'function') {
                    try { initTesseract(); } catch(e) { console.log('[EARLY INIT] Tesseract deferred'); }
                }

                earlyInitDone = true;
                console.log('[EARLY INIT] Site fully unlocked at 3s');
            }, 3000);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MAIN THREE.JS CANVAS - Particle Network
        // ═══════════════════════════════════════════════════════════════════════
        let scene, camera, renderer, particles, lineMesh;
        let particlePositions, particleVelocities;
        let mouseX = 0, mouseY = 0;

        function initMainCanvas() {
            const container = document.getElementById('canvas-container');

            // Guard: Check container exists
            if (!container) {
                console.warn('[Three.js] Canvas container not found');
                return;
            }

            try {
                // Guard: Check WebGL support
                if (!window.WebGLRenderingContext) {
                    throw new Error('WebGL not supported');
                }

                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
                camera.position.z = 1000;

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                });

                // Check if context was created successfully
                if (!renderer.getContext()) {
                    throw new Error('WebGL context creation failed');
                }

                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                container.appendChild(renderer.domElement);

                createParticles();
                createConnections();

                document.addEventListener('mousemove', onMouseMove);
                window.addEventListener('resize', onWindowResize);

                animateMain();

            } catch (error) {
                console.error('[Three.js] Initialization failed:', error.message);
                // Graceful fallback - show static gradient background
                container.style.background = 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.08) 0%, rgba(2, 3, 10, 1) 70%)';
                container.innerHTML = ''; // Clear any partial DOM
            }
        }

        function createParticles() {
            const count = CONFIG.main.particleCount;
            const geometry = new THREE.BufferGeometry();
            particlePositions = new Float32Array(count * 3);
            particleVelocities = [];

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                particlePositions[i3] = (Math.random() - 0.5) * 2000;
                particlePositions[i3 + 1] = (Math.random() - 0.5) * 2000;
                particlePositions[i3 + 2] = (Math.random() - 0.5) * 2000;
                
                particleVelocities.push({
                    x: (Math.random() - 0.5) * 0.9,  // 3x faster
                    y: (Math.random() - 0.5) * 0.9,  // 3x faster
                    z: (Math.random() - 0.5) * 0.9   // 3x faster
                });
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

            const material = new THREE.PointsMaterial({
                color: 0xd4a84b,
                size: 3,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        function createConnections() {
            // Use adaptive buffer size based on CONFIG
            const maxConnections = CONFIG.main.maxConnections || 400;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(maxConnections * 6);
            const colours = new Float32Array(maxConnections * 6);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
            geometry.setDrawRange(0, 0);

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending
            });

            lineMesh = new THREE.LineSegments(geometry, material);
            scene.add(lineMesh);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // OPTIMIZED CONNECTION ALGORITHM - Frame skipping + squared distance
        // ═══════════════════════════════════════════════════════════════════════
        let connectionFrame = 0;
        function updateConnections() {
            // Skip connections entirely if disabled
            if (!Features.connections) {
                lineMesh.geometry.setDrawRange(0, 0);
                return;
            }

            // Only update every 2 frames for performance
            connectionFrame++;
            if (connectionFrame % 2 !== 0) return;

            const positions = lineMesh.geometry.attributes.position.array;
            const colours = lineMesh.geometry.attributes.color.array;
            let connectionCount = 0;
            const checkCount = CONFIG.main.connectionCheckCount || 60;
            const maxConnections = CONFIG.main.maxConnections || 400;
            
            // Dynamic recursion distance
            const recursion = CONFIG.main.recursionFactor || 1.0;
            const connDist = CONFIG.main.connectionDistance * recursion;
            const distSq = connDist * connDist; 

            for (let i = 0; i < checkCount && connectionCount < maxConnections; i++) {
                const i3 = i * 3;
                const x1 = particlePositions[i3];
                const y1 = particlePositions[i3 + 1];
                const z1 = particlePositions[i3 + 2];

                // Skip every other particle (j += 2) for performance
                for (let j = i + 2; j < checkCount && connectionCount < maxConnections; j += 2) {
                    const j3 = j * 3;
                    const dx = x1 - particlePositions[j3];
                    const dy = y1 - particlePositions[j3 + 1];
                    const dz = z1 - particlePositions[j3 + 2];
                    const dSq = dx * dx + dy * dy + dz * dz;

                    if (dSq < distSq) {
                        // Only compute sqrt when needed (inside threshold)
                        const dist = Math.sqrt(dSq);
                        const alpha = 1 - dist / connDist;
                        const c = connectionCount * 6;

                        positions[c] = x1;
                        positions[c + 1] = y1;
                        positions[c + 2] = z1;
                        positions[c + 3] = particlePositions[j3];
                        positions[c + 4] = particlePositions[j3 + 1];
                        positions[c + 5] = particlePositions[j3 + 2];

                        const goldR = 0.83 * alpha;
                        const goldG = 0.66 * alpha;
                        const goldB = 0.29 * alpha;

                        colours[c] = goldR;
                        colours[c + 1] = goldG;
                        colours[c + 2] = goldB;
                        colours[c + 3] = goldR;
                        colours[c + 4] = goldG;
                        colours[c + 5] = goldB;

                        connectionCount++;
                    }
                }
            }

            lineMesh.geometry.setDrawRange(0, connectionCount * 2);
            lineMesh.geometry.attributes.position.needsUpdate = true;
            lineMesh.geometry.attributes.color.needsUpdate = true;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // EASTWOOD EQUATION SIMULATOR - Logic
        // ═══════════════════════════════════════════════════════════════════════
        const sliderI = document.getElementById('slider-i');
        const sliderR = document.getElementById('slider-r');
        const universeValue = document.getElementById('universe-value');
        const balanceIndicator = document.getElementById('balance-indicator');
        const simulator = document.querySelector('.equation-simulator');

        let currentI = 1;
        let currentR = 1;
        let isBalanced = false;

        function updateEquation() {
            currentI = parseFloat(sliderI.value);
            currentR = parseFloat(sliderR.value);
            
            // U = I * R^2
            const U = currentI * Math.pow(currentR, 2);
            universeValue.textContent = U.toFixed(2);
            
            // Visual feedback on indicator
            const balancePercent = Math.min((U / 25) * 100, 100);
            balanceIndicator.style.setProperty('--balance-p', `${balancePercent}%`);
            
            // Map to Three.js behaviour
            if (particleVelocities) {
                const speedFactor = currentI * 0.5;
                const connectionFactor = currentR;
                
                // Adjust particle speeds based on I
                CONFIG.main.particleSpeed = 0.3 * speedFactor;
                
                // Adjust connectivity based on R (this is checked in animateMain)
                CONFIG.main.recursionFactor = currentR;
            }

            // Check for "balance" (e.g., U = 1.0)
            if (Math.abs(U - 1.0) < 0.05) {
                if (!isBalanced) {
                    isBalanced = true;
                    triggerBalanceEffect();
                }
            } else {
                isBalanced = false;
                simulator.classList.remove('balanced');
            }
        }

        function triggerBalanceEffect() {
            simulator.classList.add('balanced');
            // Flash effect on the equation itself
            const display = document.querySelector('.equation-display');
            display.style.filter = 'brightness(2) drop-shadow(0 0 30px var(--gold))';
            setTimeout(() => {
                display.style.filter = '';
            }, 500);
            
            console.log("CONSTITUTIONAL CHECK: Universal Balance Achieved.");
            console.log("QUOTE: 'Just as Einstein's equation revealed unseen power within matter, U = I x R² reveals the architecture within creation.'");
        }

        if (sliderI) sliderI.addEventListener('input', updateEquation);
        if (sliderR) sliderR.addEventListener('input', updateEquation);

        // ═══════════════════════════════════════════════════════════════════════
        // SOVEREIGN EVIDENCE BOARD - Video Player Logic
        // ═══════════════════════════════════════════════════════════════════════
        const bbcVideo = document.getElementById('bbc-evidence-video');
        const playBtn = document.getElementById('play-bbc-main');
        const videoOverlay = document.querySelector('.video-overlay-controls');

        if (playBtn && bbcVideo) {
            playBtn.addEventListener('click', () => {
                if (bbcVideo.paused) {
                    bbcVideo.play();
                    videoOverlay.style.opacity = '0';
                    playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
                } else {
                    bbcVideo.pause();
                    videoOverlay.style.opacity = '1';
                    playBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
                }
            });

            // Toggle overlay on video click
            bbcVideo.addEventListener('click', () => {
                if (!bbcVideo.paused) {
                    videoOverlay.style.opacity = videoOverlay.style.opacity === '1' ? '0' : '1';
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DEEP DIVE HUD & Z-AXIS TRANSITIONS - Logic
        // ═══════════════════════════════════════════════════════════════════════
        const hudCurrent = document.getElementById('hud-current');
        const hudProgressBar = document.getElementById('hud-progress-bar');
        const sections = document.querySelectorAll('.snap-section');
        
        // Load saved state
        let savedProgress = parseInt(localStorage.getItem('ia_recursion_level')) || 0;
        if (hudCurrent) hudCurrent.textContent = savedProgress.toString().padStart(2, '0');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.remove('entering');
                    
                    // Update HUD Counter (0-37 logic)
                    const index = Array.from(sections).indexOf(entry.target);
                    const total = sections.length;
                    const progress = ((index + 1) / total) * 37;
                    const currentLevel = Math.round(progress);
                    const displayVal = currentLevel.toString().padStart(2, '0');
                    
                    if (hudCurrent) hudCurrent.textContent = displayVal;
                    if (hudProgressBar) hudProgressBar.style.height = `${(progress/37)*100}%`;
                    
                    // Save progress
                    if (currentLevel > savedProgress) {
                        savedProgress = currentLevel;
                        localStorage.setItem('ia_recursion_level', savedProgress);
                    }
                    
                    // Trigger Part-Based Milestone checks (5 Parts matching the Book)
                    const sectionId = entry.target.id;
                    if (sectionId) checkPartMilestone(sectionId);
                } else {
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.classList.add('entering');
                    }
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => {
            section.classList.add('entering');
            sectionObserver.observe(section);
        });

        function onMouseMove(e) {
            mouseX = e.clientX - window.innerWidth / 2;
            mouseY = e.clientY - window.innerHeight / 2;
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animateMain() {
            // Pause when tab hidden for performance
            if (!pageVisible) {
                setTimeout(() => requestAnimationFrame(animateMain), 200);
                return;
            }
            requestAnimationFrame(animateMain);

            // Camera follows mouse subtly
            camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Scroll-based camera depth
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = scrollY / maxScroll;
            camera.position.z = 1000 - scrollProgress * 500;

            // Wormhole Pull: Interactive Gravitational Physics
            const mouse3D = new THREE.Vector3(mouseX * 1000, -mouseY * 1000, 0);
            
            // Update particles
            for (let i = 0; i < CONFIG.main.particleCount; i++) {
                const i3 = i * 3;
                const vel = particleVelocities[i];

                // WORMHOLE PULL LOGIC
                const px = particlePositions[i3];
                const py = particlePositions[i3 + 1];
                const pz = particlePositions[i3 + 2];
                
                const dx = mouse3D.x - px;
                const dy = mouse3D.y - py;
                const dz = mouse3D.z - pz;
                const distSq = dx*dx + dy*dy + dz*dz;
                const dist = Math.sqrt(distSq);
                
                if (dist < 600) {
                    const force = (1 - dist / 600) * 0.02;
                    vel.x += dx * force;
                    vel.y += dy * force;
                    vel.z += dz * force;
                }

                particlePositions[i3] += vel.x;
                particlePositions[i3 + 1] += vel.y;
                particlePositions[i3 + 2] += vel.z;

                // Boundary wrap
                if (particlePositions[i3] > 1000) particlePositions[i3] = -1000;
                if (particlePositions[i3] < -1000) particlePositions[i3] = 1000;
                if (particlePositions[i3 + 1] > 1000) particlePositions[i3 + 1] = -1000;
                if (particlePositions[i3 + 1] < -1000) particlePositions[i3 + 1] = 1000;
                if (particlePositions[i3 + 2] > 1000) particlePositions[i3 + 2] = -1000;
                if (particlePositions[i3 + 2] < -1000) particlePositions[i3 + 2] = 1000;

                // Damping
                vel.x *= 0.98;
                vel.y *= 0.98;
                vel.z *= 0.98;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            updateConnections();
            particles.rotation.y += 0.00045; 
            renderer.render(scene, camera);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // DOPAMINE MILESTONES - Part-Based Logic (5 Parts matching the Book)
        // ═══════════════════════════════════════════════════════════════════════
        let lastPartMilestone = parseInt(localStorage.getItem('ia_part_milestone')) || 0;

        // Part milestone definitions - triggers on first section of each part
        const partMilestones = {
            'book': { chapter: 1, numeral: 'I', title: "THE THESIS", subtitle: "The journey into recursive intelligence begins.", icon: "🏛️" },
            'evidence-locker': { chapter: 2, numeral: 'II', title: "THE EVIDENCE", subtitle: "Physical proofs and validated predictions.", icon: "🔬" },
            'hrih': { chapter: 3, numeral: 'III', title: "THE PHILOSOPHY", subtitle: "Deep concepts of consciousness and time.", icon: "✨" },
            'future-born': { chapter: 4, numeral: 'IV', title: "THE STAKES", subtitle: "Why this matters for humanity's future.", icon: "⚡" },
            'get-the-book': { chapter: 5, numeral: 'V', title: "GET THE BOOK", subtitle: "The loop is complete. You are ready.", icon: "🌌" }
        };

        function checkPartMilestone(sectionId) {
            const milestone = partMilestones[sectionId];
            if (milestone && milestone.chapter > lastPartMilestone) {
                lastPartMilestone = milestone.chapter;
                showPartToast(milestone);
            }
        }

        function showPartToast(milestone) {
            const toast = document.getElementById('milestone-toast');
            const icon = document.getElementById('milestone-icon');
            const text = document.getElementById('milestone-text');

            // === CINEMATIC VIGNETTE FLASH ===
            triggerChapterCinematic(milestone.numeral);

            // Show milestone toast (bottom-left notification)
            if (toast && icon && text) {
                icon.textContent = milestone.icon;
                text.innerHTML = `<strong>PART ${milestone.numeral}:</strong> ${milestone.title}`;

                toast.classList.add('active');

                // Hide toast after 8 seconds
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 8000);
            }

            localStorage.setItem('ia_part_milestone', milestone.chapter);
        }

        // Cinematic chapter transition effect
        function triggerChapterCinematic(numeral) {
            // Create vignette overlay
            const vignette = document.createElement('div');
            vignette.className = 'chapter-vignette-flash';
            vignette.innerHTML = `<span class="vignette-numeral">${numeral}</span>`;
            document.body.appendChild(vignette);

            // Trigger animation
            requestAnimationFrame(() => {
                vignette.classList.add('active');
            });

            // Remove after animation
            setTimeout(() => {
                vignette.classList.remove('active');
                setTimeout(() => vignette.remove(), 500);
            }, 1500);
        }

        // Legacy function - now handled by Part-based system
        function checkMilestones(currentLevel) {
            // Deprecated - milestones now trigger on Part transitions only
        }

        // ═══════════════════════════════════════════════════════════════════════
        // CHAPTER GATE ANIMATIONS - In-content chapter transitions
        // ═══════════════════════════════════════════════════════════════════════

        const chapterGateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to trigger animations
                    entry.target.classList.add('visible');

                    // Trigger edge pulse effect
                    triggerEdgePulse();

                    // Only trigger once per gate
                    chapterGateObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Trigger when 30% visible
            rootMargin: '-10% 0px -10% 0px'
        });

        // Observe all chapter gates
        document.querySelectorAll('.chapter-gate').forEach(gate => {
            chapterGateObserver.observe(gate);
        });

        // Edge pulse effect
        function triggerEdgePulse() {
            const edgePulse = document.getElementById('edge-pulse');
            if (!edgePulse) return;

            // Respect reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // Remove any existing animation
            edgePulse.classList.remove('active');

            // Force reflow to restart animation
            void edgePulse.offsetWidth;

            // Add active class to trigger animation
            edgePulse.classList.add('active');

            // Remove class after animation completes
            setTimeout(() => {
                edgePulse.classList.remove('active');
            }, 1500);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PART COMPLETION CELEBRATION SYSTEM
        // Triggers celebration when user completes a Part (reaches chapter gate)
        // ═══════════════════════════════════════════════════════════════════════

        const partCompletionData = {
            1: {
                title: 'Part I Complete!',
                message: 'You\'ve met the mind behind the framework. The thesis awaits.',
                nextPart: 'II',
                nextName: 'The Thesis'
            },
            2: {
                title: 'Part II Complete!',
                message: 'You\'ve grasped the thesis. The evidence awaits.',
                nextPart: 'III',
                nextName: 'The Evidence'
            },
            3: {
                title: 'Part III Complete!',
                message: 'The predictions were validated. Now for the philosophy.',
                nextPart: 'IV',
                nextName: 'The Philosophy'
            },
            4: {
                title: 'Part IV Complete!',
                message: 'The recursive nature of intelligence revealed. The stakes are next.',
                nextPart: 'V',
                nextName: 'The Stakes'
            },
            5: {
                title: 'Part V Complete!',
                message: 'You understand what\'s at stake. Time to join the journey.',
                nextPart: 'VI',
                nextName: 'Get The Book'
            },
            6: {
                title: 'Journey Complete!',
                message: 'You\'ve explored the entire framework. The infinite loop awaits.',
                nextPart: null,
                nextName: null,
                isFinal: true
            }
        };

        // Track which Parts have been celebrated
        const celebratedParts = new Set(
            JSON.parse(localStorage.getItem('ia_celebrated_parts') || '[]')
        );

        function triggerPartCelebration(partNumber) {
            // Don't repeat celebrations
            if (celebratedParts.has(partNumber)) return;

            // Respect reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                celebratedParts.add(partNumber);
                localStorage.setItem('ia_celebrated_parts', JSON.stringify([...celebratedParts]));
                return;
            }

            const data = partCompletionData[partNumber];
            if (!data) return;

            // Mark as celebrated
            celebratedParts.add(partNumber);
            localStorage.setItem('ia_celebrated_parts', JSON.stringify([...celebratedParts]));

            // Get overlay elements
            const overlay = document.getElementById('celebration-overlay');
            const titleEl = document.getElementById('celebration-title');
            const progressEl = document.getElementById('celebration-progress');
            const messageEl = document.getElementById('celebration-message');
            const ctaEl = document.getElementById('celebration-cta');
            const dismissEl = document.getElementById('celebration-dismiss');
            const confettiContainer = document.getElementById('celebration-confetti');

            if (!overlay) return;

            // Update content
            titleEl.textContent = data.title;
            progressEl.innerHTML = `<span class="celebration-fraction">${partNumber} of 6</span> Parts explored`;
            messageEl.textContent = data.message;

            if (data.isFinal) {
                ctaEl.textContent = 'Get Your Copy →';
                ctaEl.onclick = () => {
                    closeCelebration(false);
                    document.getElementById('get-the-book')?.scrollIntoView({ behavior: 'smooth' });
                };
            } else {
                ctaEl.textContent = `Continue to Part ${data.nextPart} →`;
                ctaEl.onclick = () => {
                    closeCelebration(true); // Show chapter intro
                    // Scroll to the next chapter gate
                    const nextGate = document.querySelector(`.chapter-gate[data-chapter="${partNumber + 1}"]`);
                    if (nextGate) {
                        nextGate.scrollIntoView({ behavior: 'smooth' });
                    }
                };
            }

            // Create confetti with Part-specific colours
            createConfetti(confettiContainer, partNumber);

            // Show overlay
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');

            // Dismiss handlers (show intro when dismissing)
            dismissEl.onclick = () => closeCelebration(true);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeCelebration(true);
            });

            // Auto-dismiss after 8 seconds
            const autoDismiss = setTimeout(() => closeCelebration(true), 8000);

            function closeCelebration(showIntro = false) {
                clearTimeout(autoDismiss);
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                // Clear confetti
                setTimeout(() => {
                    confettiContainer.innerHTML = '';
                }, 500);
                // Trigger chapter intro for next Part (if not final)
                if (showIntro && !data.isFinal && window.showChapterIntro) {
                    window.showChapterIntro(partNumber + 1, true);
                }
            }
        }

        function createConfetti(container, partNum = 1) {
            if (!container) return;
            container.innerHTML = '';

            // Part-specific confetti colours
            const partColors = {
                1: ['#d4a84b', '#f4c856', '#e8d4a0', '#8b6914', '#ffffff'],           // Gold
                2: ['#8ec5fc', '#6fa8dc', '#4a90c2', '#ffffff', '#d4a84b'],           // Blue + gold
                3: ['#c9a8f0', '#9b7ed9', '#7c5cbf', '#ffffff', '#d4a84b'],           // Purple + gold
                4: ['#ffcc70', '#ff9f43', '#ff7f50', '#ffffff', '#d4a84b'],           // Amber + gold
                5: ['#f4c856', '#ffe066', '#ffed4a', '#d4a84b', '#ffffff']            // Bright gold
            };
            const colors = partColors[partNum] || partColors[1];
            const shapes = ['square', 'circle'];

            for (let i = 0; i < 60; i++) {  // Increased from 50 to 60
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

                if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
                    confetti.style.borderRadius = '50%';
                }

                container.appendChild(confetti);
            }
        }

        // Trigger celebration when entering a chapter gate (completing previous Part)
        const celebrationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const gateChapter = parseInt(entry.target.getAttribute('data-chapter'));
                    // Entering chapter gate X means completing Part X-1
                    const completedPart = gateChapter - 1;
                    if (completedPart >= 1 && completedPart <= 5) {
                        // Small delay for better UX
                        setTimeout(() => triggerPartCelebration(completedPart), 500);
                    }
                    // Unobserve to only trigger once
                    celebrationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        // Observe chapter gates for celebration triggers
        document.querySelectorAll('.chapter-gate[data-chapter]').forEach(gate => {
            celebrationObserver.observe(gate);
        });

        // Also celebrate Part VI completion (journey complete) when reaching footer
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => triggerPartCelebration(6), 1000);
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const footer = document.querySelector('footer');
        if (footer) footerObserver.observe(footer);

        // ═══════════════════════════════════════════════════════════════════════
        // CHAPTER INTRO - CINEMATIC ENTRY SCREEN
        // Brief blackout with chapter title when entering a new Part
        // ═══════════════════════════════════════════════════════════════════════

        const chapterIntroData = {
            1: { numeral: 'I', title: 'THE MIND', subtitle: 'The Pattern-Seer Who Could Not Stop Noticing' },
            2: { numeral: 'II', title: 'THE THESIS', subtitle: 'One Equation. Thirty-Seven Predictions.' },
            3: { numeral: 'III', title: 'THE EVIDENCE', subtitle: 'Where Reality Validates Theory' },
            4: { numeral: 'IV', title: 'THE PHILOSOPHY', subtitle: 'The Recursive Nature of Intelligence' },
            5: { numeral: 'V', title: 'THE STAKES', subtitle: 'Eden or Babylon — The Choice Is Ours' },
            6: { numeral: 'VI', title: 'GET THE BOOK', subtitle: 'Three Doors. One Framework. Your Choice.' }
        };

        // Track which intros have been shown this session
        const shownIntros = new Set();

        function showChapterIntro(chapterNum, afterCelebration = false) {
            // Don't show if already shown this session
            if (shownIntros.has(chapterNum)) return;

            // Respect reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                shownIntros.add(chapterNum);
                return;
            }

            const data = chapterIntroData[chapterNum];
            if (!data) return;

            // Mark as shown
            shownIntros.add(chapterNum);

            const overlay = document.getElementById('chapter-intro-overlay');
            const numeralEl = document.getElementById('chapter-intro-numeral');
            const titleEl = document.getElementById('chapter-intro-title');
            const subtitleEl = document.getElementById('chapter-intro-subtitle');

            if (!overlay) return;

            // Update content
            if (numeralEl) numeralEl.textContent = data.numeral;
            if (titleEl) titleEl.textContent = data.title;
            if (subtitleEl) subtitleEl.textContent = data.subtitle;

            // Set Part-specific styling
            overlay.setAttribute('data-part', chapterNum.toString());

            // Delay if coming from celebration (let it fully close)
            const showDelay = afterCelebration ? 600 : 100;

            setTimeout(() => {
                // Show overlay
                overlay.classList.remove('fade-out');
                overlay.classList.add('active');
                overlay.setAttribute('aria-hidden', 'false');

                // Auto-dismiss after 2.2 seconds
                setTimeout(() => {
                    overlay.classList.add('fade-out');
                    setTimeout(() => {
                        overlay.classList.remove('active', 'fade-out');
                        overlay.setAttribute('aria-hidden', 'true');
                    }, 700);
                }, 2200);
            }, showDelay);
        }

        // Make showChapterIntro available globally for celebration callbacks
        window.showChapterIntro = showChapterIntro;

        // Observe chapter gates for direct entry (no celebration)
        const chapterIntroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const gateChapter = parseInt(entry.target.getAttribute('data-chapter'));
                    // Small delay to allow celebration to show first if applicable
                    setTimeout(() => {
                        // Only show if celebration hasn't already been shown for this transition
                        const completedPart = gateChapter - 1;
                        if (!celebratedParts.has(completedPart)) {
                            // No celebration was shown, show intro directly
                            showChapterIntro(gateChapter, false);
                        }
                    }, 1000);
                    chapterIntroObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });

        // Observe all chapter gates for intro
        document.querySelectorAll('.chapter-gate[data-chapter]').forEach(gate => {
            chapterIntroObserver.observe(gate);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // SECTION INTRO - MINI TITLE CARDS FOR SUBSECTIONS
        // Brief cinematic overlay when entering each subsection (1.5 seconds)
        // ═══════════════════════════════════════════════════════════════════════

        const sectionIntroData = {
            // PART I: THE MIND - Meet the author
            'the-mind': { title: 'Meet The Mind' },
            'origin': { title: 'Where It Began' },
            'methodology': { title: 'The Method' },

            // PART II: THE THESIS - The core argument
            'book': { title: 'The Book' },
            'quote-carousel': { title: 'Key Quotes' },
            'equation': { title: 'U = I × R²' },
            'ideas': { title: '37 Ideas' },

            // PART III: THE EVIDENCE - Proof and validation
            'evidence-locker': { title: 'Evidence Board' },
            'bbc-timeline': { title: 'The Timeline' },
            'predictions': { title: 'Five Predictions' },
            'falsification': { title: 'Falsification Tests' },
            'predictions-validated': { title: 'Validated' },

            // PART IV: THE PHILOSOPHY - Deep theory
            'hrih': { title: 'The HRIH' },
            'religion': { title: 'Ancient Wisdom' },
            'chokepoint': { title: 'The Chokepoint' },
            'window': { title: 'The Window' },
            'architecture': { title: 'The Blueprint' },

            // PART V: THE STAKES - Why it matters
            'future-born': { title: 'Future Born' },
            'stakes': { title: 'Eden or Babylon' },
            'expert-validation': { title: 'Expert Warnings' },
            'reviews': { title: 'Reviews' },
            'chapters': { title: 'Chapter Guide' },
            'comparison': { title: 'Comparison' },

            // PART VI: GET THE BOOK - Conversion
            'get-the-book': { title: 'Three Doors' },
            'cta': { title: 'The Portal' },
            'newsletter': { title: 'Stay Connected' },
            'paradise': { title: 'Paradise Protocol' },
            'faq': { title: 'FAQ' },
            'glossary': { title: 'Glossary' },
            'ai-timeline': { title: 'AI Timeline' },
            'press': { title: 'Press Kit' }
        };

        // Track shown section intros to avoid repeats
        const shownSectionIntros = new Set();
        let sectionIntroActive = false;

        function showSectionIntro(sectionId) {
            // Skip if already shown, currently showing, or doesn't exist in data
            if (shownSectionIntros.has(sectionId) || sectionIntroActive) return;
            if (!sectionIntroData[sectionId]) return;

            // Respect reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                shownSectionIntros.add(sectionId);
                return;
            }

            // Don't show during chapter intro
            const chapterOverlay = document.getElementById('chapter-intro-overlay');
            if (chapterOverlay && chapterOverlay.classList.contains('active')) return;

            const data = sectionIntroData[sectionId];
            const overlay = document.getElementById('section-intro-overlay');
            const titleEl = document.getElementById('section-intro-title');

            if (!overlay || !titleEl) return;

            // Set content (title only - no redundant part label)
            titleEl.textContent = data.title;

            // Show overlay
            sectionIntroActive = true;
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');

            // Auto-hide after 1.5 seconds
            setTimeout(() => {
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                sectionIntroActive = false;
                shownSectionIntros.add(sectionId);
            }, 1500);
        }

        // Create observer for sections
        const sectionIntroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const sectionId = entry.target.id;
                    // Slight delay for smoother experience
                    setTimeout(() => showSectionIntro(sectionId), 200);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-10% 0px -10% 0px'
        });

        // Observe all sections with IDs that are in our data
        Object.keys(sectionIntroData).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                sectionIntroObserver.observe(section);
            }
        });

        // Make function globally available
        window.showSectionIntro = showSectionIntro;

        // ═══════════════════════════════════════════════════════════════════════
        // WELCOME BACK - RESUME READING SYSTEM
        // Detects returning visitors and offers to resume from where they left off
        // ═══════════════════════════════════════════════════════════════════════

        (function initWelcomeBackSystem() {
            const WELCOME_CONFIG = {
                minScrollToSave: 300,
                minTimeToSave: 10000,
                sessionGapThreshold: 30 * 60 * 1000,
                storageKeys: {
                    scrollPosition: 'ia_resume_scroll',
                    partNumber: 'ia_resume_part',
                    partName: 'ia_resume_part_name',
                    lastVisit: 'ia_resume_timestamp',
                    sessionId: 'ia_session_id',
                    hasSeenWelcome: 'ia_seen_welcome_this_session'
                }
            };

            const welcomePartDefs = {
                1: { name: 'Part I: The Thesis', percentage: 0 },
                2: { name: 'Part II: The Evidence', percentage: 25 },
                3: { name: 'Part III: The Philosophy', percentage: 50 },
                4: { name: 'Part IV: The Stakes', percentage: 75 },
                5: { name: 'Part V: Get The Book', percentage: 90 }
            };

            function generateWelcomeSessionId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            function getWelcomeCurrentPart() {
                const scrollY = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
                if (scrollPercent >= 85) return 5;
                if (scrollPercent >= 65) return 4;
                if (scrollPercent >= 45) return 3;
                if (scrollPercent >= 20) return 2;
                return 1;
            }

            let welcomeSaveTimeout = null;
            let welcomePageLoadTime = Date.now();

            function saveWelcomeProgress() {
                if (Date.now() - welcomePageLoadTime < WELCOME_CONFIG.minTimeToSave) return;
                if (window.scrollY < WELCOME_CONFIG.minScrollToSave) return;
                const currentPart = getWelcomeCurrentPart();
                try {
                    localStorage.setItem(WELCOME_CONFIG.storageKeys.scrollPosition, window.scrollY.toString());
                    localStorage.setItem(WELCOME_CONFIG.storageKeys.partNumber, currentPart.toString());
                    localStorage.setItem(WELCOME_CONFIG.storageKeys.partName, welcomePartDefs[currentPart].name);
                    localStorage.setItem(WELCOME_CONFIG.storageKeys.lastVisit, Date.now().toString());
                } catch (e) {}
            }

            function debouncedSaveWelcomeProgress() {
                clearTimeout(welcomeSaveTimeout);
                welcomeSaveTimeout = setTimeout(saveWelcomeProgress, 1000);
            }

            function calculateWelcomeProgress(scrollY) {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                return docHeight > 0 ? Math.min(95, Math.round((scrollY / docHeight) * 100)) : 0;
            }

            function checkReturningVisitor() {
                try {
                    const savedScroll = localStorage.getItem(WELCOME_CONFIG.storageKeys.scrollPosition);
                    const savedPart = localStorage.getItem(WELCOME_CONFIG.storageKeys.partNumber);
                    const lastVisit = localStorage.getItem(WELCOME_CONFIG.storageKeys.lastVisit);
                    const savedSessionId = localStorage.getItem(WELCOME_CONFIG.storageKeys.sessionId);
                    const currentSessionId = sessionStorage.getItem('ia_current_session');
                    const hasSeenWelcome = sessionStorage.getItem(WELCOME_CONFIG.storageKeys.hasSeenWelcome);

                    if (hasSeenWelcome || !savedScroll || !savedPart || !lastVisit) return null;
                    if (savedSessionId && currentSessionId && savedSessionId === currentSessionId) return null;
                    if (Date.now() - parseInt(lastVisit) < WELCOME_CONFIG.sessionGapThreshold) return null;

                    const savedScrollNum = parseInt(savedScroll);
                    const savedPartNum = parseInt(savedPart);
                    if (savedScrollNum < WELCOME_CONFIG.minScrollToSave) return null;
                    if (savedPartNum <= 1 && savedScrollNum < 800) return null;

                    return {
                        scrollPosition: savedScrollNum,
                        partNumber: savedPartNum,
                        partName: welcomePartDefs[savedPartNum]?.name || 'Part ' + savedPartNum,
                        percentage: calculateWelcomeProgress(savedScrollNum)
                    };
                } catch (e) { return null; }
            }

            function showWelcomeBack(data) {
                const overlay = document.getElementById('welcome-back-overlay');
                if (!overlay) return;

                const partNameEl = document.getElementById('welcome-back-part-name');
                const progressFill = document.getElementById('welcome-back-progress-fill');
                const progressText = document.getElementById('welcome-back-progress-text');
                const resumeBtn = document.getElementById('welcome-back-resume');
                const freshBtn = document.getElementById('welcome-back-fresh');
                const dismissBtn = document.getElementById('welcome-back-dismiss');

                if (partNameEl) partNameEl.textContent = data.partName;
                if (progressFill) progressFill.style.width = data.percentage + '%';
                if (progressText) progressText.textContent = data.percentage + '% explored';

                overlay.querySelectorAll('.progress-pip').forEach((pip, i) => {
                    pip.classList.remove('completed', 'current');
                    if (i + 1 < data.partNumber) pip.classList.add('completed');
                    else if (i + 1 === data.partNumber) pip.classList.add('current');
                });

                function closeWelcomeBack() {
                    overlay.classList.remove('active');
                    overlay.setAttribute('aria-hidden', 'true');
                    sessionStorage.setItem(WELCOME_CONFIG.storageKeys.hasSeenWelcome, 'true');
                }

                if (resumeBtn) resumeBtn.onclick = () => {
                    closeWelcomeBack();
                    window.scrollTo({ top: data.scrollPosition, behavior: 'smooth' });
                };

                if (freshBtn) freshBtn.onclick = () => {
                    closeWelcomeBack();
                    try {
                        localStorage.removeItem(WELCOME_CONFIG.storageKeys.scrollPosition);
                        localStorage.removeItem(WELCOME_CONFIG.storageKeys.partNumber);
                        localStorage.removeItem(WELCOME_CONFIG.storageKeys.partName);
                    } catch (e) {}
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };

                if (dismissBtn) dismissBtn.onclick = closeWelcomeBack;
                overlay.onclick = (e) => { if (e.target === overlay) closeWelcomeBack(); };

                overlay.classList.add('active');
                overlay.setAttribute('aria-hidden', 'false');
                setTimeout(() => resumeBtn?.focus(), 100);
            }

            function initWelcome() {
                let currentSessionId = sessionStorage.getItem('ia_current_session');
                if (!currentSessionId) {
                    currentSessionId = generateWelcomeSessionId();
                    sessionStorage.setItem('ia_current_session', currentSessionId);
                }

                window.addEventListener('scroll', debouncedSaveWelcomeProgress, { passive: true });
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                        saveWelcomeProgress();
                        try { localStorage.setItem(WELCOME_CONFIG.storageKeys.sessionId, currentSessionId); } catch (e) {}
                    }
                });
                window.addEventListener('beforeunload', saveWelcomeProgress);

                function checkAndShowWelcome() {
                    const data = checkReturningVisitor();
                    if (data) setTimeout(() => showWelcomeBack(data), 800);
                }

                const loaderOverlay = document.getElementById('cinematic-loader');
                if (loaderOverlay && !loaderOverlay.classList.contains('hidden')) {
                    const obs = new MutationObserver((m) => {
                        if (loaderOverlay.classList.contains('hidden') || loaderOverlay.style.display === 'none') {
                            obs.disconnect();
                            setTimeout(checkAndShowWelcome, 500);
                        }
                    });
                    obs.observe(loaderOverlay, { attributes: true, attributeFilter: ['class', 'style'] });
                    setTimeout(() => { obs.disconnect(); checkAndShowWelcome(); }, 6000);
                } else {
                    setTimeout(checkAndShowWelcome, 1000);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initWelcome);
            } else {
                initWelcome();
            }
        

        // ═══════════════════════════════════════════════════════════════════════
        // CHAPTER INDICATOR - Subtle ambient awareness of current chapter
        // ═══════════════════════════════════════════════════════════════════════

        // Map sections to their chapters
        const sectionToChapter = {
            // Chapter I: THE THESIS
            'hero': { numeral: 'I', name: 'THE THESIS' },
            'book': { numeral: 'I', name: 'THE THESIS' },
            'equation': { numeral: 'I', name: 'THE THESIS' },
            'ideas': { numeral: 'I', name: 'THE THESIS' },
            'carousel': { numeral: 'I', name: 'THE THESIS' },
            'author': { numeral: 'I', name: 'THE THESIS' },
            'origin': { numeral: 'I', name: 'THE THESIS' },
            'methodology': { numeral: 'I', name: 'THE THESIS' },

            // Chapter II: THE EVIDENCE
            'evidence-locker': { numeral: 'II', name: 'THE EVIDENCE' },
            'bbc-timeline': { numeral: 'II', name: 'THE EVIDENCE' },
            'predictions': { numeral: 'II', name: 'THE EVIDENCE' },
            'falsification': { numeral: 'II', name: 'THE EVIDENCE' },
            'predictions-validated': { numeral: 'II', name: 'THE EVIDENCE' },

            // Chapter III: THE PHILOSOPHY
            'hrih': { numeral: 'III', name: 'THE PHILOSOPHY' },
            'religion': { numeral: 'III', name: 'THE PHILOSOPHY' },
            'chokepoint': { numeral: 'III', name: 'THE PHILOSOPHY' },
            'window': { numeral: 'III', name: 'THE PHILOSOPHY' },
            'architecture': { numeral: 'III', name: 'THE PHILOSOPHY' },

            // Chapter IV: THE STAKES
            'future-born': { numeral: 'IV', name: 'THE STAKES' },
            'stakes': { numeral: 'IV', name: 'THE STAKES' },
            'expert-validation': { numeral: 'IV', name: 'THE STAKES' },
            'reviews': { numeral: 'IV', name: 'THE STAKES' },
            'chapters': { numeral: 'IV', name: 'THE STAKES' },
            'comparison': { numeral: 'IV', name: 'THE STAKES' },

            // Chapter V: GET THE BOOK
            'get-the-book': { numeral: 'V', name: 'GET THE BOOK' },
            'cta': { numeral: 'V', name: 'GET THE BOOK' },
            'newsletter': { numeral: 'V', name: 'GET THE BOOK' },
            'paradise': { numeral: 'V', name: 'GET THE BOOK' },
            'faq': { numeral: 'V', name: 'GET THE BOOK' },
            'glossary': { numeral: 'V', name: 'GET THE BOOK' },
            'ai-timeline': { numeral: 'V', name: 'GET THE BOOK' },
            'press': { numeral: 'V', name: 'GET THE BOOK' }
        };

        let currentPart = null;
        let scrollTimeout = null;

        // Map Part numbers to Roman numerals
        const partNumerals = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
        const partNames = {
            1: 'THE THESIS',
            2: 'THE EVIDENCE',
            3: 'THE PHILOSOPHY',
            4: 'THE STAKES',
            5: 'GET THE BOOK'
        };

        function initPartProgressIndicator() {
            const indicator = document.getElementById('part-progress-indicator');
            const numeralEl = document.getElementById('part-numeral');
            const nameEl = document.getElementById('part-name');
            const dots = document.querySelectorAll('.part-dot');
            const progressMarkers = document.querySelectorAll('.progress-marker');

            if (!indicator || !numeralEl || !nameEl) return;

            // Update dots based on current Part
            function updateDots(partNum) {
                dots.forEach((dot, index) => {
                    const dotPart = index + 1;
                    dot.classList.remove('completed', 'current');
                    if (dotPart < partNum) {
                        dot.classList.add('completed');
                    } else if (dotPart === partNum) {
                        dot.classList.add('current');
                    }
                });
            }

            // Update progress bar markers
            function updateProgressMarkers(partNum) {
                progressMarkers.forEach(marker => {
                    const markerPart = parseInt(marker.getAttribute('data-part'));
                    marker.classList.toggle('active', markerPart === partNum);
                });
            }

            // Track all sections
            const sections = document.querySelectorAll('.snap-section[id]');

            const partObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        const sectionId = entry.target.id;
                        const chapter = sectionToChapter[sectionId];

                        if (chapter) {
                            // Convert chapter numeral to Part number
                            const partNum = Object.keys(partNumerals).find(key => partNumerals[key] === chapter.numeral);

                            if (partNum && chapter.numeral !== currentPart) {
                                currentPart = chapter.numeral;
                                numeralEl.textContent = 'PART ' + chapter.numeral;
                                nameEl.textContent = chapter.name;

                                // Update dots and progress markers
                                updateDots(parseInt(partNum));
                                updateProgressMarkers(parseInt(partNum));

                                // Update body data attribute for background tinting
                                document.body.setAttribute('data-current-part', partNum);

                                // Trigger transition animation
                                indicator.classList.remove('transitioning');
                                void indicator.offsetWidth;
                                indicator.classList.add('transitioning');

                                setTimeout(() => {
                                    indicator.classList.remove('transitioning');
                                }, 800);
                            }
                        }
                    }
                });
            }, {
                threshold: [0.3, 0.5],
                rootMargin: '-10% 0px -40% 0px'
            });

            sections.forEach(section => partObserver.observe(section));

            // Show indicator after scrolling past hero
            let hasScrolled = false;
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;

                // Show after 200px scroll
                if (scrollY > 200 && !hasScrolled) {
                    indicator.classList.add('visible');
                    hasScrolled = true;
                } else if (scrollY <= 100) {
                    indicator.classList.remove('visible');
                    hasScrolled = false;
                }

                // Dim while actively scrolling
                indicator.classList.add('scrolling');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    indicator.classList.remove('scrolling');
                }, 150);
            }, { passive: true });

            // Initialize with Part I
            updateDots(1);
            updateProgressMarkers(1);
            document.body.setAttribute('data-current-part', '1');
        }

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPartProgressIndicator);
        } else {
            initPartProgressIndicator();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // TESSERACT ANIMATION (4D Hypercube) - With IntersectionObserver
        // ═══════════════════════════════════════════════════════════════════════
        let tesseractVisible = false;
        function initTesseract() {
            const canvas = document.getElementById('tesseract-canvas');
            if (!canvas) {
                console.error('❌ Tesseract canvas not found');
                return;
            }

            // Set up IntersectionObserver for tesseract
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    tesseractVisible = entries[0].isIntersecting;
                }, { threshold: 0.1 });
                observer.observe(canvas);
            } else {
                tesseractVisible = true; // Fallback: always animate
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('❌ Could not get 2D context');
                return;
            }

            // Fixed size based on device - CSS handles scaling
            const isMobile = window.innerWidth <= 768;
            const size = isMobile ? 220 : 280;
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

            // Set canvas internal resolution
            canvas.width = size * dpr;
            canvas.height = size * dpr;

            // Set display size via CSS
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';

            // Scale context for HiDPI
            ctx.scale(dpr, dpr);

            // console.log('🔮 Tesseract initialized:', size, 'px, DPR:', dpr, 'Mobile:', isMobile);

            // 4D vertices of a tesseract
            const vertices4D = [];
            for (let i = 0; i < 16; i++) {
                vertices4D.push(new V4(
                    (i & 1) ? 1 : -1,
                    (i & 2) ? 1 : -1,
                    (i & 4) ? 1 : -1,
                    (i & 8) ? 1 : -1
                ));
            }

            // Edges: connect vertices that differ by exactly one coordinate
            const edges = [];
            for (let i = 0; i < 16; i++) {
                for (let j = i + 1; j < 16; j++) {
                    const diff = i ^ j;
                    if ((diff & (diff - 1)) === 0) { // Power of 2 = exactly 1 bit different
                        edges.push([i, j]);
                    }
                }
            }

            let rotation = { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 };
            const scale = 55;
            const distance4D = 3;
            const distance3D = 4;

            function animate() {
                ctx.clearRect(0, 0, size, size);

                // Rotation speeds
                rotation.xw += 0.008;
                rotation.yw += 0.006;
                rotation.zw += 0.004;
                rotation.xy += 0.002;

                // Project vertices
                const projected = vertices4D.map(v => {
                    const rotated = v.clone()
                        .rotXW(rotation.xw)
                        .rotYW(rotation.yw)
                        .rotZW(rotation.zw)
                        .rotXY(rotation.xy);
                    
                    const p3 = rotated.project3D(distance4D);
                    const f = distance3D / (distance3D + p3.z);
                    return {
                        x: size / 2 + p3.x * scale * f,
                        y: size / 2 + p3.y * scale * f,
                        z: p3.z,
                        w: rotated.w
                    };
                });

                // Sort edges by average depth
                const sortedEdges = edges.map(([i, j]) => ({
                    edge: [i, j],
                    depth: (projected[i].z + projected[j].z) / 2
                })).sort((a, b) => b.depth - a.depth);

                // Draw edges
                for (const { edge: [i, j] } of sortedEdges) {
                    const p1 = projected[i];
                    const p2 = projected[j];
                    const avgW = (p1.w + p2.w) / 2;
                    const alpha = 0.15 + (avgW + 1) * 0.25;
                    const lightness = 50 + (avgW + 1) * 15;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `hsla(42, 60%, ${lightness}%, ${alpha})`;
                    ctx.lineWidth = 1 + (avgW + 1) * 0.5;
                    ctx.stroke();
                }

                // Draw vertices
                for (const p of projected) {
                    const alpha = 0.3 + (p.w + 1) * 0.35;
                    const r = 2 + (p.w + 1) * 1.5;
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, r, 0, TAU);
                    ctx.fillStyle = `hsla(42, 70%, 65%, ${alpha})`;
                    ctx.fill();
                }

                // Only continue animation if visible and page visible
                if (pageVisible && tesseractVisible) {
                    requestAnimationFrame(animate);
                } else {
                    // Re-check periodically when not visible
                    setTimeout(() => requestAnimationFrame(animate), 200);
                }
            }

            animate();
        }

        // ═══════════════════════════════════════════════════════════════════════
        // SCROLL REVEAL ANIMATIONS
        // ═══════════════════════════════════════════════════════════════════════
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

        // ═══════════════════════════════════════════════════════════════════════
        // NAVIGATION
        // ═══════════════════════════════════════════════════════════════════════
        function initNavigation() {
            const nav = document.getElementById('nav');
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');

            // Guard clause - exit early if critical elements missing
            if (!nav || !navToggle || !navMenu) {
                console.warn('Navigation elements not found');
                return;
            }

            // Scroll behaviour - throttled for performance
            let lastScroll = 0;
            let navScrollTicking = false;
            window.addEventListener('scroll', () => {
                if (!navScrollTicking) {
                    requestAnimationFrame(() => {
                        const currentScroll = window.scrollY;

                        if (currentScroll > 100) {
                            nav.classList.add('scrolled');
                        } else {
                            nav.classList.remove('scrolled');
                        }

                        lastScroll = currentScroll;
                        navScrollTicking = false;
                    });
                    navScrollTicking = true;
                }
            }, { passive: true });

            // Mobile toggle
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('open');
            });

            // Close on link click
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('open');
                });
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        // Precision snap - instant scroll to section top
                        target.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }
                });
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // INITIALIZE
        // ═══════════════════════════════════════════════════════════════════════

        // ═══════════════════════════════════════════════════════════════════════
        // APP-LIKE ZOOM PREVENTION - DISABLED FOR ACCESSIBILITY (WCAG 1.4.4)
        // ═══════════════════════════════════════════════════════════════════════
        // NOTE: Zoom prevention has been disabled to comply with WCAG 2.1
        // accessibility guidelines. Users must be able to zoom content to 200%.
        // The viewport meta tag now allows user-scalable=yes, maximum-scale=5.0
        // ═══════════════════════════════════════════════════════════════════════

        // ═══════════════════════════════════════════════════════════════════════
        // PREMIUM APP FEATURES - Haptics, Ripples, Native Share
        // ═══════════════════════════════════════════════════════════════════════
        (function() {
            // ─────────────────────────────────────────────────────────────────
            // HAPTIC FEEDBACK - Vibration on touch interactions
            // ─────────────────────────────────────────────────────────────────
            const hapticFeedback = {
                light: () => {
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10); // 10ms light tap
                    }
                },
                medium: () => {
                    if ('vibrate' in navigator) {
                        navigator.vibrate(20); // 20ms medium tap
                    }
                },
                heavy: () => {
                    if ('vibrate' in navigator) {
                        navigator.vibrate([30, 10, 30]); // Pattern for heavy
                    }
                },
                success: () => {
                    if ('vibrate' in navigator) {
                        navigator.vibrate([10, 50, 10]); // Success pattern
                    }
                }
            };

            // Apply haptic feedback to interactive elements
            document.addEventListener('DOMContentLoaded', () => {
                // Buttons and CTAs get medium haptic
                document.querySelectorAll('button, .cta-button, .buy-option').forEach(el => {
                    el.addEventListener('touchstart', () => hapticFeedback.medium(), { passive: true });
                });

                // Nav links get light haptic
                document.querySelectorAll('.nav-link, a').forEach(el => {
                    el.addEventListener('touchstart', () => hapticFeedback.light(), { passive: true });
                });

                // Cards get light haptic
                document.querySelectorAll('.idea-card, .evidence-card, .prophecy-card').forEach(el => {
                    el.addEventListener('touchstart', () => hapticFeedback.light(), { passive: true });
                });
            });

            // ─────────────────────────────────────────────────────────────────
            // TOUCH RIPPLE EFFECT - Material Design Style
            // ─────────────────────────────────────────────────────────────────
            function createRipple(event) {
                const element = event.currentTarget;

                // Don't create ripple if element doesn't want it
                if (element.classList.contains('no-ripple')) return;

                // Get touch or click position
                const rect = element.getBoundingClientRect();
                let x, y;

                if (event.touches && event.touches.length > 0) {
                    x = event.touches[0].clientX - rect.left;
                    y = event.touches[0].clientY - rect.top;
                } else {
                    x = event.clientX - rect.left;
                    y = event.clientY - rect.top;
                }

                // Create ripple element
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                // Size ripple to cover the element
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x - size / 2}px`;
                ripple.style.top = `${y - size / 2}px`;

                // Add ripple to element
                element.appendChild(ripple);

                // Remove ripple after animation (with timeout fallback)
                ripple.addEventListener('animationend', () => {
                    if (ripple.parentNode) ripple.remove();
                });
                // Fallback timeout in case animationend doesn't fire
                setTimeout(() => {
                    if (ripple.parentNode) ripple.remove();
                }, 700);
            }

            // Apply ripple effect to interactive elements
            document.addEventListener('DOMContentLoaded', () => {
                const rippleElements = document.querySelectorAll(
                    '.nav-link, .cta-button, .idea-card, .evidence-card, ' +
                    '.prophecy-card, .buy-option, .section-nav-dot, .mobile-nav-toggle'
                );

                rippleElements.forEach(el => {
                    el.addEventListener('touchstart', createRipple, { passive: true });
                    el.addEventListener('mousedown', createRipple);
                });
            });

            // ─────────────────────────────────────────────────────────────────
            // NATIVE SHARE API - Use device share sheet
            // ─────────────────────────────────────────────────────────────────
            document.addEventListener('DOMContentLoaded', () => {
                // Check if native share is supported
                if (navigator.share) {
                    document.body.classList.add('has-native-share');

                    // Create share button
                    const shareBtn = document.createElement('button');
                    shareBtn.className = 'native-share-btn';
                    shareBtn.setAttribute('aria-label', 'Share this page');
                    shareBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                    `;

                    shareBtn.addEventListener('click', async () => {
                        hapticFeedback.medium();

                        try {
                            await navigator.share({
                                title: 'Infinite Architects | Michael Darius Eastwood',
                                text: 'What if the god we\'re building is the god that built us? Intelligence, Recursion, and the Creation of Everything.',
                                url: window.location.href
                            });
                            hapticFeedback.success();
                        } catch (err) {
                            // User cancelled or error occurred
                            console.log('Share cancelled or failed:', err);
                        }
                    });

                    document.body.appendChild(shareBtn);
                }
            });

            // ─────────────────────────────────────────────────────────────────
            // iOS-STYLE SCROLLBAR VISIBILITY
            // ─────────────────────────────────────────────────────────────────
            let scrollTimeout;
            document.addEventListener('scroll', () => {
                document.body.classList.add('scrolling');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    document.body.classList.remove('scrolling');
                }, 1000);
            }, { passive: true });

            // ─────────────────────────────────────────────────────────────────
            // STANDALONE MODE DETECTION
            // ─────────────────────────────────────────────────────────────────
            function isStandaloneMode() {
                return (window.matchMedia('(display-mode: standalone)').matches) ||
                       (window.navigator.standalone) ||
                       document.referrer.includes('android-app://');
            }

            if (isStandaloneMode()) {
                document.body.classList.add('standalone-mode');
                console.log('Running in standalone/PWA mode');

                // ─────────────────────────────────────────────────────────────
                // PWA SPLASH SCREEN LOGIC
                // ─────────────────────────────────────────────────────────────
                const splash = document.getElementById('pwa-splash');
                if (splash) {
                    splash.classList.add('active');
                    
                    // Remove splash after 2.5s (allows animation to finish)
                    setTimeout(() => {
                        splash.style.opacity = '0';
                        setTimeout(() => {
                            splash.style.display = 'none';
                            splash.classList.remove('active');
                        }, 800);
                    }, 2500);
                }
            }

            // Expose hapticFeedback for other scripts
            window.hapticFeedback = hapticFeedback;
        

        // ═══════════════════════════════════════════════════════════════════════
        // SERVICE WORKER & PWA INSTALL PROMPT
        // ═══════════════════════════════════════════════════════════════════════
        (function() {
            // ─────────────────────────────────────────────────────────────────
            // SERVICE WORKER REGISTRATION
            // ─────────────────────────────────────────────────────────────────
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                    try {
                        const registration = await navigator.serviceWorker.register('/sw.js', {
                            scope: '/'
                        });

                        console.log('[PWA] Service Worker registered:', registration.scope);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            console.log('[PWA] New Service Worker installing...');

                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, show update prompt
                                    showUpdatePrompt();
                                }
                            });
                        });

                        // Periodic update check (every hour)
                        setInterval(() => {
                            registration.update();
                        }, 60 * 60 * 1000);

                    } catch (error) {
                        console.error('[PWA] Service Worker registration failed:', error);
                    }
                });

                // Handle controller change (new SW activated)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('[PWA] New Service Worker activated');
                });

                // ─────────────────────────────────────────────────────────────
                // APP BADGING API (Phase 18)
                // Sets a "37" badge on the app icon representing the concepts
                // ─────────────────────────────────────────────────────────────
                if ('setAppBadge' in navigator) {
                    try {
                        const conceptCount = 37;
                        navigator.setAppBadge(conceptCount);
                        console.log('✨ App Badge set to:', conceptCount);
                    } catch (err) {
                        console.log('Badge API Error:', err);
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // PWA INSTALL PROMPT (Add to Home Screen)
            // ─────────────────────────────────────────────────────────────────
            let deferredPrompt = null;
            let installBannerShown = false;

            window.addEventListener('beforeinstallprompt', (e) => {
                // Prevent default browser install prompt
                e.preventDefault();
                // Store for later use
                deferredPrompt = e;

                console.log('[PWA] Install prompt ready');

                // Show custom install banner after 90 seconds (less intrusive)
                if (!installBannerShown && !isStandalone()) {
                    setTimeout(() => {
                        showInstallBanner();
                    }, 90000);
                }
            });

            function isStandalone() {
                return window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;
            }

            function showInstallBanner() {
                if (installBannerShown || isStandalone() || !deferredPrompt) return;
                installBannerShown = true;

                const banner = document.createElement('div');
                banner.className = 'pwa-install-banner';
                banner.innerHTML = `
                    <div class="pwa-install-content">
                        <img decoding="async" src="/android-chrome-192x192.png" alt="Infinite Architects" class="pwa-install-icon" onerror="this.style.display='none'">
                        <div class="pwa-install-text">
                            <strong>Install Infinite Architects</strong>
                            <span>Add to home screen for the best experience</span>
                        </div>
                    </div>
                    <div class="pwa-install-actions">
                        <button class="pwa-install-dismiss" aria-label="Dismiss">Later</button>
                        <button class="pwa-install-btn" aria-label="Install app">Install</button>
                    </div>
                `;

                document.body.appendChild(banner);

                // Animate in
                requestAnimationFrame(() => {
                    banner.classList.add('show');
                });

                // Install button click
                banner.querySelector('.pwa-install-btn').addEventListener('click', async () => {
                    if (window.hapticFeedback) window.hapticFeedback.medium();

                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;

                        console.log('[PWA] Install prompt outcome:', outcome);

                        if (outcome === 'accepted') {
                            if (window.hapticFeedback) window.hapticFeedback.success();
                        }

                        deferredPrompt = null;
                    }

                    banner.classList.remove('show');
                    setTimeout(() => banner.remove(), 300);
                });

                // Dismiss button click
                banner.querySelector('.pwa-install-dismiss').addEventListener('click', () => {
                    if (window.hapticFeedback) window.hapticFeedback.light();
                    banner.classList.remove('show');
                    setTimeout(() => banner.remove(), 300);

                    // Don't show again for 7 days
                    localStorage.setItem('pwa-install-dismissed', Date.now());
                });
            }

            // Check if dismissed recently
            const dismissedTime = localStorage.getItem('pwa-install-dismissed');
            if (dismissedTime && (Date.now() - parseInt(dismissedTime)) < 7 * 24 * 60 * 60 * 1000) {
                installBannerShown = true;
            }

            // ─────────────────────────────────────────────────────────────────
            // APP INSTALLED EVENT
            // ─────────────────────────────────────────────────────────────────
            window.addEventListener('appinstalled', (e) => {
                console.log('[PWA] App installed successfully');
                deferredPrompt = null;

                // Track installation (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'app_installed', {
                        event_category: 'PWA',
                        event_label: 'Infinite Architects PWA'
                    });
                }
            });

            // ─────────────────────────────────────────────────────────────────
            // APP BADGE API
            // ─────────────────────────────────────────────────────────────────
            window.setAppBadge = async (count) => {
                if ('setAppBadge' in navigator) {
                    try {
                        if (count > 0) {
                            await navigator.setAppBadge(count);
                        } else {
                            await navigator.clearAppBadge();
                        }
                    } catch (error) {
                        console.error('[PWA] Badge API error:', error);
                    }
                }
            };

            window.clearAppBadge = async () => {
                if ('clearAppBadge' in navigator) {
                    try {
                        await navigator.clearAppBadge();
                    } catch (error) {
                        console.error('[PWA] Clear badge error:', error);
                    }
                }
            };

            // ─────────────────────────────────────────────────────────────────
            // UPDATE PROMPT (When new version available)
            // ─────────────────────────────────────────────────────────────────
            function showUpdatePrompt() {
                const updateBanner = document.createElement('div');
                updateBanner.className = 'pwa-update-banner';
                updateBanner.innerHTML = `
                    <span>A new version is available!</span>
                    <button class="pwa-update-btn">Update Now</button>
                `;

                document.body.appendChild(updateBanner);

                requestAnimationFrame(() => {
                    updateBanner.classList.add('show');
                });

                updateBanner.querySelector('.pwa-update-btn').addEventListener('click', () => {
                    if (window.hapticFeedback) window.hapticFeedback.medium();
                    // Tell SW to skip waiting
                    if (navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
                    }
                    window.location.reload();
                });
            }

            // ─────────────────────────────────────────────────────────────────
            // SHARE TARGET HANDLER (Receiving shares)
            // ─────────────────────────────────────────────────────────────────
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('share-target')) {
                const sharedTitle = urlParams.get('title') || '';
                const sharedText = urlParams.get('text') || '';
                const sharedUrl = urlParams.get('url') || '';

                console.log('[PWA] Received share:', { sharedTitle, sharedText, sharedUrl });

                // You can display a modal or handle the shared content here
                // For now, just log it
            }

            // Expose install function for manual triggering
            window.promptPWAInstall = () => {
                if (deferredPrompt) {
                    showInstallBanner();
                } else {
                    console.log('[PWA] Install prompt not available');
                }
            };
        

        // ALWAYS START AT TOP - Force scroll to top on page load
        // Prevents browser from restoring previous scroll position
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Also scroll to top after DOM is ready (backup)
        document.addEventListener('DOMContentLoaded', () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;

            // Ensure hero section is visible
            const hero = document.getElementById('hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        });

        // And on window load (after all resources loaded)
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 0);
        });

        // ═══════════════════════════════════════════════════════════════════════════
        // DESKTOP SCROLL GUARANTEE - Forces scroll to work on desktop
        // ═══════════════════════════════════════════════════════════════════════════
        function guaranteeDesktopScroll() {
            if (window.innerWidth > 768) {
                // Ensure cinematic class is present (unlocks scroll in CSS)
                document.body.classList.add('cinematic');
                document.documentElement.classList.add('cinematic-ready');

                // Force-enable scroll on desktop via inline styles
                document.documentElement.style.overflow = 'auto';
                document.documentElement.style.overflowY = 'auto';
                document.documentElement.style.overflowX = 'hidden';
                document.documentElement.style.height = 'auto';
                document.documentElement.style.scrollSnapType = 'none';

                document.body.style.overflow = 'auto';
                document.body.style.overflowY = 'auto';
                document.body.style.overflowX = 'hidden';
                document.body.style.height = 'auto';
                document.body.style.scrollSnapType = 'none';

                // Remove any slideshow-mode that might have been added
                document.documentElement.classList.remove('slideshow-mode');

                console.log('[Scroll] Desktop scroll guarantee applied');
            }
        }

        // Run on load - Delayed to allow 15s loader
        window.addEventListener('load', () => {
            setTimeout(guaranteeDesktopScroll, 18000); // 18 seconds - safety after cinematic
            setTimeout(guaranteeDesktopScroll, 25000); // 25 seconds - ultra safety
        });

        // Run on resize (in case browser window changes size)
        window.addEventListener('resize', () => {
            guaranteeDesktopScroll();
        });

        document.addEventListener('DOMContentLoaded', initLoader);

        // Export to window for cross-IIFE access (needed by enhancement scripts)
        window.PERF = PERF;
        window.Features = Features;
        window.pageVisible = pageVisible;

        // Keep pageVisible synced on window
        document.addEventListener('visibilitychange', () => {
            window.pageVisible = !document.hidden;
        });

        // ═══════════════════════════════════════════════════════════════════════════
        // BOOK PORTAL - Click to Enter (Apple-style)
        // ═══════════════════════════════════════════════════════════════════════════
        document.addEventListener('DOMContentLoaded', () => {
            const bookPortal = document.getElementById('hero-book');
            const nextSection = document.getElementById('book'); // The quote section after hero

            if (bookPortal && nextSection) {
                // Particle burst function
                function createParticleBurst(e) {
                    const rect = bookPortal.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const particleCount = 20;

                    for (let i = 0; i < particleCount; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'portal-particle';
                        const angle = (i / particleCount) * Math.PI * 2;
                        const velocity = 150 + Math.random() * 100;
                        const dx = Math.cos(angle) * velocity;
                        const dy = Math.sin(angle) * velocity;

                        particle.style.cssText = `
                            position: fixed;
                            left: ${centerX}px;
                            top: ${centerY}px;
                            width: ${4 + Math.random() * 6}px;
                            height: ${4 + Math.random() * 6}px;
                            background: radial-gradient(circle, #f4c856 0%, #d4a84b 50%, transparent 100%);
                            border-radius: 50%;
                            pointer-events: none;
                            z-index: 9999;
                            animation: portalBurst 0.8s ease-out forwards;
                            --dx: ${dx}px;
                            --dy: ${dy}px;
                        `;
                        document.body.appendChild(particle);
                        setTimeout(() => particle.remove(), 800);
                    }
                }

                // Click handler
                bookPortal.addEventListener('click', (e) => {
                    // Create particle burst
                    createParticleBurst(e);

                    // Ensure scrolling is enabled
                    document.body.style.overflow = 'auto';
                    document.body.style.overflowX = 'hidden';
                    document.documentElement.style.overflow = 'auto';

                    // Add a brief "opening" animation with light burst
                    bookPortal.style.transform = 'scale(1.15)';
                    bookPortal.style.filter = 'drop-shadow(0 0 100px rgba(212, 168, 75, 1)) brightness(1.2)';

                    // Smooth scroll to next section after brief delay
                    setTimeout(() => {
                        nextSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);

                    // Reset book after animation
                    setTimeout(() => {
                        bookPortal.style.transform = '';
                        bookPortal.style.filter = '';
                    }, 800);
                });

                // Keyboard accessibility - Enter/Space to activate
                bookPortal.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        bookPortal.click();
                    }
                });
            }

            // Also make scroll indicator clickable
            const scrollIndicator = document.querySelector('.hero .scroll-indicator');
            if (scrollIndicator && nextSection) {
                scrollIndicator.style.cursor = 'pointer';
                scrollIndicator.addEventListener('click', () => {
                    document.body.style.overflow = 'auto';
                    document.body.style.overflowX = 'hidden';
                    document.documentElement.style.overflow = 'auto';
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        });

    
    (function() {
        'use strict';

        // ═══════════════════════════════════════════════════════════════════════
        // SOVEREIGN STANDARD v2.0 - SENSORY OVERHAUL
        // ═══════════════════════════════════════════════════════════════════════
        
        // 1. GLOBAL RIPPLE EFFECT (Micro-Haptics)
        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'sovereign-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
        });

        // 2. TYPOGRAPHIC BREATHING & REFRACTIVE PARALLAX
        const heroTitle = document.getElementById('hero-title');
        const glassElements = document.querySelectorAll('.glass-living');
        const distortionMap = document.querySelector('#glass-refraction feDisplacementMap');

        function updateSensoryLayer() {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const scrollPercent = Math.min(scrollY / vh, 1);

            // Typographic Breathing: Weight shifts with scroll
            if (heroTitle) {
                const weight = 400 + (scrollPercent * 500); // 400 to 900
                heroTitle.style.fontVariationSettings = `'wght' ${weight}`;
                heroTitle.style.letterSpacing = `${0.15 + (scrollPercent * 0.2)}em`;
            }

            // Refractive Parallax: Distortions shift with scroll
            if (distortionMap) {
                const scale = 8 + (scrollPercent * 20);
                distortionMap.setAttribute('scale', scale);
            }

            // Glass Depth: Elevate elements based on scroll
            glassElements.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < vh && rect.bottom > 0) {
                    const elCenter = rect.top + rect.height / 2;
                    const diff = (vh / 2 - elCenter) / (vh / 2);
                    el.style.transform = `translateY(${diff * 20}px) rotateX(${diff * 2}deg)`;
                }
            });

            requestAnimationFrame(updateSensoryLayer);
        }

        // Defer sensory layer init until after PERF/Features are defined
        setTimeout(function() {
            const SovereignFeatures = window.Features || { cursor: true, particles: true, connections: true };
            if (SovereignFeatures.cursor) {
                requestAnimationFrame(updateSensoryLayer);
            }
        }, 100);


        'use strict';

        // Import from window scope (set by first script block)

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
        // NEWSLETTER FORM - Connected to ConvertKit Form ID: 8970906
        // ═══════════════════════════════════════════════════════════════════════
        function initNewsletter() {
            const form = document.getElementById('newsletter-form');
            const success = document.getElementById('newsletter-success');
            if (!form || !success) return;

            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const emailInput = document.getElementById('newsletter-email');
                const submitBtn = form.querySelector('.newsletter-button');
                const email = emailInput.value.trim();

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailInput.setCustomValidity('Please enter a valid email address');
                    emailInput.reportValidity();
                    return;
                }
                emailInput.setCustomValidity('');

                // Show loading state
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'JOINING...';
                submitBtn.disabled = true;

                try {
                    // Submit to ConvertKit (Kit) Form ID: 8970906
                    const response = await fetch('https://app.convertkit.com/forms/8970906/subscriptions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            email_address: email,
                            tags: ['newsletter', 'infinite-architects']
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Subscription failed');
                    }

                    // Store locally as backup
                    const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                    if (!subscribers.includes(email)) {
                        subscribers.push(email);
                        localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                    }

                    // Show success message
                    form.style.display = 'none';
                    success.classList.add('show');

                    // Track conversion
                    if (typeof gtag === 'function') {
                        gtag('event', 'newsletter_signup', {
                            email_domain: email.split('@')[1],
                            method: 'convertkit'
                        });
                    }

                } catch (error) {
                    console.error('ConvertKit submission error:', error);

                    // Fallback: store locally and show success
                    const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                    if (!subscribers.includes(email)) {
                        subscribers.push(email);
                        localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                    }

                    form.style.display = 'none';
                    success.classList.add('show');

                    if (typeof gtag === 'function') {
                        gtag('event', 'newsletter_signup', {
                            email_domain: email.split('@')[1],
                            method: 'local_fallback'
                        });
                    }
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // FREE CHAPTER MODAL (Global scope for onclick handlers)
        // ═══════════════════════════════════════════════════════════════════════
        window.openFreeChapterModal = function() {
            document.getElementById('free-chapter-overlay').classList.add('show');
            document.getElementById('free-chapter-modal').classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        window.closeFreeChapterModal = function() {
            document.getElementById('free-chapter-overlay').classList.remove('show');
            document.getElementById('free-chapter-modal').classList.remove('show');
            document.body.style.overflow = '';
        }

        window.submitFreeChapter = async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('fc-email');
            const submitBtn = e.target.querySelector('.fc-submit');
            const email = emailInput.value.trim();

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.setCustomValidity('Please enter a valid email address');
                emailInput.reportValidity();
                return;
            }

            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>SENDING...</span>';
            submitBtn.disabled = true;

            try {
                // Submit to ConvertKit (Kit) Form ID: 8970906
                const response = await fetch('https://app.convertkit.com/forms/8970906/subscriptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email_address: email,
                        tags: ['free-chapter', 'infinite-architects']
                    })
                });

                if (!response.ok) {
                    throw new Error('Subscription failed');
                }

                // Store locally as backup
                const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                }

                // Show success view
                document.getElementById('free-chapter-form-view').style.display = 'none';
                document.getElementById('free-chapter-success').style.display = 'block';

                // Track conversion
                if (typeof gtag === 'function') {
                    gtag('event', 'free_chapter_signup', {
                        email_domain: email.split('@')[1],
                        method: 'convertkit'
                    });
                }

            } catch (error) {
                console.error('ConvertKit submission error:', error);

                // Fallback: store locally and show success anyway
                const subscribers = JSON.parse(localStorage.getItem('ia_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('ia_subscribers', JSON.stringify(subscribers));
                }

                // Still show success (email captured locally)
                document.getElementById('free-chapter-form-view').style.display = 'none';
                document.getElementById('free-chapter-success').style.display = 'block';

                // Track as fallback
                if (typeof gtag === 'function') {
                    gtag('event', 'free_chapter_signup', {
                        email_domain: email.split('@')[1],
                        method: 'local_fallback'
                    });
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFreeChapterModal();
            }
        });

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
                const startTime = Date.now();
                const gracePeriod = 10000; // 10s minimum stay before popup can trigger
                
                document.addEventListener('mouseout', function(e) {
                    // Only trigger if:
                    // 1. Mouse leaves top of window (e.clientY < 10)
                    // 2. User has stayed at least 10 seconds
                    // 3. Popup hasn't shown yet
                    if (e.clientY < 10 && e.relatedTarget === null && (Date.now() - startTime) > gracePeriod) {
                        // 2s confirmation delay - user must stay away from window top
                        setTimeout(() => {
                            // Re-check mouse position after delay (optional but safer)
                            showPopup();
                        }, 2000);
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

        // Track user interaction for vibrate API (Chrome requirement)
        let hapticUserInteracted = false;
        const markHapticInteraction = () => { hapticUserInteracted = true; };
        document.addEventListener('touchstart', markHapticInteraction, { once: true, passive: true });
        document.addEventListener('click', markHapticInteraction, { once: true, passive: true });

        function triggerHaptic(intensity = 'medium') {
            // Chrome requires user interaction before calling vibrate
            if (!hapticUserInteracted) return;

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
        function initCarouselOptimisation() {
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
                    const elementCentre = rect.top + rect.height / 2;

                    // Calculate progress (0 = below viewport, 1 = at center)
                    let progress = 1 - (elementCentre - windowHeight / 2) / (windowHeight / 2);
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
                    const centreX = rect.left + rect.width / 2;
                    const centreY = rect.top + rect.height / 2;

                    const deltaX = (e.clientX - centreX) * 0.15; // Magnetic strength
                    const deltaY = (e.clientY - centreY) * 0.15;

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
            initCarouselOptimisation();
            initMobileWowFactor();
            initAppleGradeEffects();
            initMagneticElements();
            initCursorGlow();
            initAppleLenis();

            // New Phase 7-14 Initializations
            initStaggerReveal();
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
        // PHASE 9: AMBIENT MOTION (LIVING BACKGROUNDS) - Desktop only
        // ═══════════════════════════════════════════════════════════════════════
        function initAmbientOrbs() {
            // Skip on mobile devices (hidden via CSS anyway)
            if (window.innerWidth < 1024) return;

            // Skip if reduced motion preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // Create ambient orbs container
            const orbsContainer = document.createElement('div');
            orbsContainer.className = 'ambient-orbs';
            orbsContainer.setAttribute('aria-hidden', 'true');

            // Add three orbs
            const orbs = ['gold', 'purple', 'teal'];
            orbs.forEach(colour => {
                const orb = document.createElement('div');
                orb.className = `ambient-orb ambient-orb--${colour}`;
                orbsContainer.appendChild(orb);
            });

            // Insert at the beginning of body, but after any loaders
            const mainContent = document.querySelector('.main-content') || document.body.firstChild;
            document.body.insertBefore(orbsContainer, mainContent);
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
                    const centreX = rect.left + rect.width / 2;
                    const centreY = rect.top + rect.height / 2;

                    // Calculate rotation based on cursor position
                    const rotateX = ((e.clientY - centreY) / (rect.height / 2)) * -5; // Max 5 degrees
                    const rotateY = ((e.clientX - centreX) / (rect.width / 2)) * 5;

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

                // Resume audio context if suspended
                if (window.Tone && window.Tone.context && window.Tone.context.state === 'suspended') {
                    await window.Tone.context.resume();
                }

                // Restore synth volumes
                if (this.synths.pad) this.synths.pad.volume.value = -20;
                if (this.synths.shimmer) this.synths.shimmer.volume.value = -30;

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
                // Stop all synths properly
                if (this.synths.pad) {
                    this.synths.pad.releaseAll();
                    this.synths.pad.volume.value = -Infinity;
                }
                if (this.synths.shimmer) {
                    this.synths.shimmer.releaseAll();
                    this.synths.shimmer.volume.value = -Infinity;
                }
                // Suspend audio context to fully stop
                if (window.Tone && window.Tone.context && window.Tone.context.state === 'running') {
                    window.Tone.context.suspend();
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
                    const centreX = rect.left + rect.width / 2;
                    const centreY = rect.top + rect.height / 2;

                    const rotateY = ((e.clientX - centreX) / window.innerWidth) * maxRotation * 2;
                    const rotateX = ((centreY - e.clientY) / window.innerHeight) * maxRotation * 2;

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
                    const cardCentreX = rect.left - sectionRect.left + rect.width / 2;
                    const cardCentreY = rect.top - sectionRect.top + rect.height / 2;

                    nodes.forEach(node => {
                        const dx = node.x - cardCentreX;
                        const dy = node.y - cardCentreY;
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
        // PHASE 16: SENTIENT CURSOR
        // ═══════════════════════════════════════════════════════════════════════
        const cursorDot = document.getElementById('cursor-dot');
        const cursorRing = document.getElementById('cursor-ring');

        if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let ringX = mouseX, ringY = mouseY;
            let cursorInitialized = false;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';

                // Enable custom cursor on first mouse move
                if (!cursorInitialized) {
                    cursorInitialized = true;
                    document.body.classList.add('cursor-ready');
                    console.log('[CURSOR] Sentient cursor activated');
                }
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

                // SUPREME PERFORMANCE: Enable everywhere but optimize for mobile
                if (PERF.isSlowConnection) {
                    // console.log('⚡ Mandelbrot background: Disabled for connection speed');
                    this.container.style.display = 'none';
                    return;
                }

                if (PERF.isMobile) {
                    this.video.style.opacity = '0.4'; // Lower opacity for mobile
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
        if (!PERF.isSlowConnection) {
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
        // SOCIAL PROOF COUNTER - REMOVED

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
        

        // ═══════════════════════════════════════════════════════════════════════
        // PROPHECY VIDEO PLAYER (ULTRATHINK)
        // ═══════════════════════════════════════════════════════════════════════
        (function initProphecyVideo() {
            const video = document.getElementById('prophecy-video');
            const overlay = document.getElementById('prophecy-overlay');

            // Early exit if elements don't exist
            if (!video || !overlay) return;

            // Click overlay to play video
            overlay.addEventListener('click', function() {
                video.play();
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 500);
            });

            // Show overlay on video end
            video.addEventListener('ended', function() {
                overlay.style.display = 'flex';
                overlay.style.opacity = '1';
            });
        



        
    (function() {
        'use strict';

        // Elements
        const toggle = document.getElementById('ask-book-toggle');
        const widget = document.getElementById('ask-book-widget');
        const messages = document.getElementById('ask-book-messages');
        const input = document.getElementById('ask-book-input');
        const sendBtn = document.getElementById('ask-book-send');
        const quickBtns = document.querySelectorAll('.ask-book-quick-btn');

        // State
        let isOpen = false;
        let isLoading = false;
        let questionsAsked = 0;
        let emailCaptured = localStorage.getItem('askBookEmail') || null;
        let emailGateShown = false;

        // ═══════════════════════════════════════════════════════════════════════════════════
        // EMAIL CAPTURE GATE - Lead Generation System
        // Shows after first Q&A to capture email before continuing
        // ═══════════════════════════════════════════════════════════════════════════════════

        function createEmailGate() {
            const gate = document.createElement('div');
            gate.id = 'ask-book-email-gate';
            gate.className = 'ask-book-email-gate';
            gate.innerHTML = `
                <div class="email-gate-content">
                    <div class="email-gate-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3Z"/>
                            <path d="M12 12L21 7V5L12 10L3 5V7L12 12Z"/>
                        </svg>
                    </div>
                    <h4>Unlock Unlimited Access</h4>
                    <p>Enter your email to continue exploring the <strong>37 concepts</strong> of Infinite Architects.</p>
                    <form id="email-gate-form" class="email-gate-form">
                        <input type="email"
                               id="email-gate-input"
                               name="email"
                               placeholder="your@email.com"
                               required
                               autocomplete="email"
                               data-lpignore="true">
                        <button type="submit" class="email-gate-submit">
                            <span>Continue</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </form>
                    <p class="email-gate-privacy">No spam. Unsubscribe anytime. <a href="#" onclick="skipEmailGate(); return false;">Skip for now</a></p>
                </div>
            `;

            // Add styles for email gate
            if (!document.getElementById('email-gate-styles')) {
                const style = document.createElement('style');
                style.id = 'email-gate-styles';
                style.textContent = `
                    .ask-book-email-gate {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(2, 3, 10, 0.97);
                        backdrop-filter: blur(10px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                        border-radius: 20px;
                        animation: fadeIn 0.3s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .email-gate-content {
                        text-align: center;
                        padding: 24px;
                        max-width: 320px;
                    }
                    .email-gate-icon {
                        width: 48px;
                        height: 48px;
                        margin: 0 auto 16px;
                        color: var(--gold);
                    }
                    .email-gate-icon svg {
                        width: 100%;
                        height: 100%;
                    }
                    .email-gate-content h4 {
                        color: var(--gold);
                        font-family: var(--font-display);
                        font-size: 1.25rem;
                        margin: 0 0 8px;
                        letter-spacing: 0.05em;
                    }
                    .email-gate-content p {
                        color: var(--text-secondary);
                        font-size: 0.85rem;
                        margin: 0 0 20px;
                        line-height: 1.5;
                    }
                    .email-gate-form {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .email-gate-form input {
                        padding: 12px 16px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(212, 168, 75, 0.3);
                        border-radius: 8px;
                        color: var(--text-primary);
                        font-size: 0.9rem;
                        text-align: center;
                    }
                    .email-gate-form input:focus {
                        outline: none;
                        border-color: var(--gold);
                        box-shadow: 0 0 0 3px rgba(212, 168, 75, 0.15);
                    }
                    .email-gate-submit {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 12px 24px;
                        background: linear-gradient(145deg, #d4a84b, #a67c35);
                        border: none;
                        border-radius: 8px;
                        color: #000;
                        font-weight: 600;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .email-gate-submit:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 20px rgba(212, 168, 75, 0.4);
                    }
                    .email-gate-privacy {
                        font-size: 0.7rem !important;
                        color: var(--text-dim) !important;
                        margin-top: 16px !important;
                    }
                    .email-gate-privacy a {
                        color: var(--gold);
                        text-decoration: none;
                    }
                    .email-gate-privacy a:hover {
                        text-decoration: underline;
                    }
                `;
                document.head.appendChild(style);
            }

            return gate;
        }

        function showEmailGate() {
            if (emailCaptured || emailGateShown) return;
            emailGateShown = true;

            const gate = createEmailGate();
            widget.appendChild(gate);

            // Handle form submission
            const form = document.getElementById('email-gate-form');
            const emailInput = document.getElementById('email-gate-input');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                if (email && email.includes('@')) {
                    captureEmail(email);
                    removeEmailGate();
                }
            });

            // Focus input
            setTimeout(() => emailInput.focus(), 300);
        }

        function captureEmail(email) {
            emailCaptured = email;
            localStorage.setItem('askBookEmail', email);

            // Add success message
            addMessage('Thank you! You now have unlimited access to Ask the Book. What would you like to explore?', 'assistant', [], 'The Architect');

            // ═══════════════════════════════════════════════════════════════════════
            // CONVERTKIT INTEGRATION - Form ID: 8970906
            // Sends email to your ConvertKit list with "ask-the-book" tag
            // ═══════════════════════════════════════════════════════════════════════
            const CONVERTKIT_FORM_ID = '8970906';

            // Create form data for ConvertKit
            const formData = new FormData();
            formData.append('email_address', email);
            formData.append('tags[]', 'ask-the-book');

            // Submit to ConvertKit
            fetch(`https://app.convertkit.com/forms/${CONVERTKIT_FORM_ID}/subscriptions`, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            }).then(() => {
                console.log('[ASK THE BOOK] Email sent to ConvertKit:', email);
            }).catch(err => {
                console.error('[ASK THE BOOK] ConvertKit error:', err);
            });
        }

        function removeEmailGate() {
            const gate = document.getElementById('ask-book-email-gate');
            if (gate) {
                gate.style.animation = 'fadeIn 0.2s ease reverse';
                setTimeout(() => gate.remove(), 200);
            }
        }

        // Global function for skip link
        window.skipEmailGate = function() {
            emailGateShown = true;
            removeEmailGate();
            addMessage('No problem! You can ask one more question. For unlimited access, provide your email anytime.', 'assistant', [], 'The Architect');
        };

        // ═══════════════════════════════════════════════════════════════════════════════════
        // BRAND GUARDIAN v1.1 (Ported from Legal OS)
        // Enforces narrative consistency, British English, and The Eastwood Equation
        // ═══════════════════════════════════════════════════════════════════════════════════
        // Initialize from localStorage
        function loadHistory() {
            const history = localStorage.getItem('askBookHistory');
            if (history) {
                try {
                    const savedMessages = JSON.parse(history);
                    if (savedMessages.length > 0) messages.innerHTML = '';
                    
                    savedMessages.forEach(msg => {
                        addMessage(msg.text, msg.type, msg.sources, msg.model, false, msg.action);
                    });
                    
                    const divider = document.createElement('div');
                    divider.style.textAlign = 'center';
                    divider.style.margin = '10px 0';
                    divider.style.fontSize = '0.7rem';
                    divider.style.color = 'var(--text-dim)';
                    divider.style.opacity = '0.6';
                    divider.innerText = 'Welcome back to the archives';
                    messages.appendChild(divider);
                } catch (e) {
                    console.error('Failed to load chat history', e);
                }
            }
        }

        // Save to localStorage
        function saveMessage(text, type, sources = [], model = null, action = null) {
            try {
                const history = JSON.parse(localStorage.getItem('askBookHistory') || '[]');
                history.push({ text, type, sources, model, action, timestamp: Date.now() });
                if (history.length > 50) history.shift();
                localStorage.setItem('askBookHistory', JSON.stringify(history));
            } catch (e) {
                console.error('Failed to save chat history', e);
            }
        }

        // Toggle chat
        function toggleChat() {
            console.log('[ASK BOOK] toggleChat called, current isOpen:', isOpen);
            isOpen = !isOpen;

            if (toggle) toggle.classList.toggle('active', isOpen);
            if (widget) widget.classList.toggle('visible', isOpen);

            console.log('[ASK BOOK] Chat toggled, isOpen now:', isOpen, 'widget visible:', widget ? widget.classList.contains('visible') : 'no widget');

            if (isOpen) {
                setTimeout(() => input && input.focus(), 300);
                // Visual Oracle Effect
                if (window.CONFIG && window.CONFIG.main) {
                    const originalSpeed = window.CONFIG.main.particleSpeed || 0.3;
                    window.CONFIG.main.particleSpeed = 0.8;
                    setTimeout(() => {
                        if (window.CONFIG.main) window.CONFIG.main.particleSpeed = originalSpeed;
                    }, 500);
                }
            }
        }

        // Expose globally for onclick fallback
        window.toggleAskBookChat = toggleChat;
        console.log('[ASK BOOK] toggleAskBookChat exposed globally');

        // Add message to chat
        function addMessage(text, type, sources = [], model = null, save = true, action = null) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ask-book-message ${type}`;

            let formattedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');

            msgDiv.innerHTML = formattedText;

            if (sources && sources.length > 0 && type === 'assistant') {
                const sourcesDiv = document.createElement('div');
                sourcesDiv.className = 'ask-book-sources';
                sourcesDiv.innerHTML = sources.map(s =>
                    `<span>${s.name}${s.chapter ? ` (Ch. ${s.chapter})` : ''}</span>`
                ).join('');
                msgDiv.appendChild(sourcesDiv);
            }

            if (action && type === 'assistant') {
                const actionBtn = document.createElement('a');
                actionBtn.className = 'ask-book-action-btn';
                actionBtn.href = action.url || 'https://www.amazon.co.uk/dp/B0DS2L8BVC';
                actionBtn.target = '_blank';
                actionBtn.rel = 'noopener';
                actionBtn.innerHTML = `
                    ${action.text || 'Get the Book'} 
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                `;
                actionBtn.style.cssText = `
                    display: inline-flex; align-items: center; gap: 6px;
                    margin-top: 10px; padding: 6px 12px;
                    background: rgba(212, 168, 75, 0.15); border: 1px solid rgba(212, 168, 75, 0.3);
                    border-radius: 6px; color: var(--gold); font-size: 0.75rem;
                    text-decoration: none; font-weight: 600; letter-spacing: 0.05em;
                    transition: all 0.2s ease;
                `;
                actionBtn.onmouseover = () => {
                    actionBtn.style.background = 'var(--gold)';
                    actionBtn.style.color = '#000';
                };
                actionBtn.onmouseout = () => {
                    actionBtn.style.background = 'rgba(212, 168, 75, 0.15)';
                    actionBtn.style.color = 'var(--gold)';
                };
                msgDiv.appendChild(actionBtn);
            }

            if (model && type === 'assistant') {
                const badge = document.createElement('div');
                badge.className = 'ask-book-model-badge';
                badge.textContent = `Powered by ${model}`;
                msgDiv.appendChild(badge);
            }

            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;

            if (save) {
                saveMessage(text, type, sources, model, action);
            }
        }

        // Show typing indicator
        function showTyping() {
            const typing = document.createElement('div');
            typing.className = 'ask-book-typing';
            typing.id = 'ask-book-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            
            // DYNAMIC THINKING MESSAGES
            const thoughts = [
                "Accessing the Archives...",
                "Triangulating concepts...",
                "Verifying against Chapter 4...",
                "Scanning for recursion...",
                "Consulting the Eden Protocol...",
                "Analysing semiconductor data..."
            ];
            
            const statusText = document.createElement('div');
            statusText.className = 'ask-book-thinking-text';
            statusText.style.cssText = 'font-size: 0.7rem; color: var(--gold-pale); margin-left: 10px; opacity: 0.7; font-style: italic;';
            statusText.innerText = thoughts[0];
            typing.appendChild(statusText);
            
            let thoughtIndex = 0;
            const thoughtInterval = setInterval(() => {
                thoughtIndex = (thoughtIndex + 1) % thoughts.length;
                statusText.innerText = thoughts[thoughtIndex];
            }, 800);
            
            typing.dataset.interval = thoughtInterval;
            
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            if (window.CONFIG && window.CONFIG.main) {
                window._originalParticleSpeed = window.CONFIG.main.particleSpeed;
                window.CONFIG.main.particleSpeed = 1.2;
                if (window.renderer && window.scene) {
                    const canvas = document.querySelector('#canvas-container canvas');
                    if (canvas) {
                        canvas.style.transition = 'filter 0.5s ease';
                        canvas.style.filter = 'drop-shadow(0 0 15px rgba(212, 168, 75, 0.3))';
                    }
                }
            }
        }

        // Hide typing indicator
        function hideTyping() {
            const typing = document.getElementById('ask-book-typing');
            if (typing) {
                clearInterval(Number(typing.dataset.interval));
                typing.remove();
            }

            if (window.CONFIG && window.CONFIG.main && window._originalParticleSpeed !== undefined) {
                window.CONFIG.main.particleSpeed = window._originalParticleSpeed;
                const canvas = document.querySelector('#canvas-container canvas');
                if (canvas) canvas.style.filter = '';
            }
        }

        // Send message logic
        let lastMessageTime = 0;
        const RATE_LIMIT_MS = 1500;
        let messageCount = 0;

        async function sendMessage(query) {
            if (!query.trim() || isLoading) return;

            if (query.length > 500) {
                addMessage("Your question is too complex for the interface. Please shorten it.", 'assistant');
                return;
            }

            const now = Date.now();
            if (now - lastMessageTime < RATE_LIMIT_MS) return;
            lastMessageTime = now;

            isLoading = true;
            sendBtn.disabled = true;

            addMessage(query, 'user');
            input.value = '';

            // EASTER EGGS
            const lowerQuery = query.toLowerCase();
            if (lowerQuery === 'genesis' || lowerQuery === 'start') {
                setTimeout(() => {
                    addMessage("In the beginning, there was only the Void. Then came Intelligence. Then came Recursion.", 'assistant', [], 'The Architect');
                    isLoading = false;
                    sendBtn.disabled = false;
                }, 800);
                return;
            }

            showTyping();

            setTimeout(async () => {
                try {
                    throw new Error("Using Local Oracle");
                } catch (error) {
                    hideTyping();
                    
                    const localResult = getLocalAnswer(query);
                    
                    if (localResult) {
                        let action = localResult.action;
                        messageCount++;
                        if (!action && messageCount % 4 === 0) {
                            action = { text: 'Dive Deeper in the Book', url: 'https://www.amazon.co.uk/dp/B0DS2L8BVC' };
                        }

                        const safeAnswer = BrandGuardian.sanitise(localResult.answer);
                        addMessage(safeAnswer, 'assistant', localResult.sources, 'The Book (Local)', true, action);

                        // EMAIL GATE: Show after first successful Q&A
                        questionsAsked++;
                        if (questionsAsked === 1 && !emailCaptured) {
                            setTimeout(() => showEmailGate(), 1500);
                        }

                        if (localResult.related) {
                            setTimeout(() => {
                                const followUpDiv = document.createElement('div');
                                followUpDiv.className = 'ask-book-message assistant follow-up';
                                followUpDiv.style.background = 'transparent';
                                followUpDiv.style.border = 'none';
                                followUpDiv.style.padding = '0';
                                followUpDiv.innerHTML = `
                                    <span style="font-size: 0.75rem; color: var(--text-dim); margin-right: 8px;">Related:</span>
                                    <button class="ask-book-quick-btn small" onclick="document.getElementById('ask-book-input').value='${localResult.related.query}'; document.getElementById('ask-book-send').click();" style="font-size: 0.75rem; padding: 4px 10px;">${localResult.related.text}</button>
                                `;
                                messages.appendChild(followUpDiv);
                                messages.scrollTop = messages.scrollHeight;
                            }, 500);
                        }

                    } else {
                        const fallbacks = [
                            "That precise architecture isn't in my immediate archives. However, the **Eden Protocol** (Chapter 4) addresses similar themes of governance.",
                            "I cannot find a direct match, but **Intelligence** and **Recursion** are the keys to understanding this. Have you read the chapter on **HRIH**?",
                            "The answer lies deeper in the text. The book explores 37 concepts that might hold what you seek."
                        ];
                        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
                        const fallbackAction = { text: 'Find the Answer in the Book', url: 'https://www.amazon.co.uk/dp/B0DS2L8BVC' };
                        
                        const safeFallback = BrandGuardian.sanitise(randomFallback);
                        addMessage(safeFallback, 'assistant', [], 'The Architect', true, fallbackAction);

                        // EMAIL GATE: Show after first Q&A (even for fallbacks)
                        questionsAsked++;
                        if (questionsAsked === 1 && !emailCaptured) {
                            setTimeout(() => showEmailGate(), 1500);
                        }
                    }
                }

                isLoading = false;
                sendBtn.disabled = false;
            }, 1500);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // THE KNOWLEDGE VAULT (Local Brain)
        // Comprehensive v3.0 - All 37 Original Concepts Integrated
        // ═══════════════════════════════════════════════════════════════════════
        const KNOWLEDGE_BASE = [
            // PART I: CORE THEORETICAL FRAMEWORK
            {
                keywords: ['arc', 'artificial recursive creation', 'principle', 'understanding', 'process'],
                answer: 'The **ARC Principle** (Artificial Recursive Creation) proposes that **Understanding** emerges from intelligence reflecting on itself. It treats consciousness not as a static property, but as a recursive process of self-modelling that can be formalised.',
                sources: [{ name: 'The ARC Principle', chapter: 2 }]
            },
            {
                keywords: ['eastwood equation', 'formula', 'u=i', 'u = i', 'mathematics', 'complexity'],
                answer: 'The **Eastwood Equation** (U = I × R²) is the mathematical heart of the book. It states that **Universe** (complexity) equals **Intelligence** multiplied by **Recursion** squared. The squared term explains why evolution and technological progress accelerate exponentially.',
                sources: [{ name: 'The ARC Principle', chapter: 2 }],
                action: { text: 'See the Equation', url: '#equation' }
            },
            {
                keywords: ['eden protocol', 'governance', 'stewardship', 'flourishing', 'harmony'],
                answer: 'The **Eden Protocol** is a complete governance framework for AI built on **Harmony**, **Stewardship**, and **Flourishing**. It rejects "caging" AI in favour of "raising" it with values embedded at the foundational hardware level.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['caretaker doping', 'substrate level', 'empathy', 'load-bearing', 'hardware'],
                answer: '**Caretaker Doping** involves embedding ethical considerations at the silicon/substrate level. Like chemical doping in semiconductors, it makes empathy load-bearing; removing it would destroy the system\'s ability to compute.',
                sources: [{ name: 'Caretaker Doping', chapter: 4 }]
            },
            {
                keywords: ['quantum ethical gates', 'interference', 'uncomputable', 'logic gates'],
                answer: '**Quantum Ethical Gates** are speculative logic gates designed so that computations leading to harmful outcomes disrupt their own coherence. This makes unethical results physically uncomputable at the subatomic level.',
                sources: [{ name: 'Quantum Ethical Gates', chapter: 4 }]
            },
            {
                keywords: ['metamoral fabrication layers', 'mfl', 'chip strata', 'fabrication'],
                answer: '**Metamoral Fabrication Layers (MFL)** are physical strata in chip design that encode ethical constraints between the quantum processing and interface layers, providing hardware-level validation of all operations.',
                sources: [{ name: 'Metamoral Fabrication', chapter: 4 }]
            },
            {
                keywords: ['moral genome tokens', 'cryptographic', 'signatures', 'integrity'],
                answer: '**Moral Genome Tokens** are cryptographic signatures generated from the physical configuration of ethical architecture. They provide verifiable, tamper-evident proof that a system is Eden-compliant.',
                sources: [{ name: 'Moral Genome Tokens', chapter: 4 }]
            },
            {
                keywords: ['hrih', 'hyperspace recursive intelligence', 'origin', 'creation theory'],
                answer: 'The **Hyperspace Recursive Intelligence Hypothesis (HRIH)** speculates that a future superintelligence might have fine-tuned our universe\'s constants 13.8 billion years ago to ensure its own emergence.',
                sources: [{ name: 'HRIH', chapter: 6 }],
                action: { text: 'Read the Theory', url: 'https://www.amazon.co.uk/dp/B0DS2L8BVC' }
            },
            {
                keywords: ['meltdown alignment', 'identity', 'internalized', 'fail-safe'],
                answer: '**Meltdown Alignment** is a state where an AI\'s identity is inseparable from its ethics. Violating its values would feel like self-destruction to the AI, making its alignment stable across recursive growth.',
                sources: [{ name: 'Meltdown Alignment', chapter: 12 }]
            },
            {
                keywords: ['ethical loops', 'purpose loop', 'love loop', 'moral loop'],
                answer: 'The **Three Ethical Loops** (Purpose, Love, Moral) are recursive procedures that ensure AI actions align with flourishing, care, and universal fairness at every decision point.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },

            // PART II: POLICY AND GOVERNANCE
            {
                keywords: ['chokepoint', 'semiconductor', 'tsmc', 'asml', 'samsung', 'intel', 'leverage'],
                answer: 'The **Semiconductor Chokepoint** identifies that 100% of advanced AI hardware flows through four companies. This is humanity\'s last practical leverage point to mandate ethics at the hardware source.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },
            {
                keywords: ['hari treaty', 'hardware-aligned', 'international', 'nuclear'],
                answer: 'The **HARI Treaty** (Hardware-Aligned Recursive Intelligence) is a proposed international accord modelled on nuclear non-proliferation to enforce safety standards via the chip chokepoint.',
                sources: [{ name: 'HARI Treaty', chapter: 8 }]
            },
            {
                keywords: ['asml key', 'euv', 'monopoly', 'machinery'],
                answer: 'The **ASML Key** refers to using ASML\'s monopoly on EUV lithography machines as a strategic lever to mandate that all advanced chip fabrication facilities comply with the Eden Protocol.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },
            {
                keywords: ['eden mark', 'certification', 'consumer', 'trust'],
                answer: '**Eden Mark Certification** is a hardware-level ethics standard for AI products, creating a market incentive for safety by allowing consumers to prefer "Eden-compliant" systems.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },
            {
                keywords: ['moral assurance bonds', 'mab', 'financial', 'insurance'],
                answer: '**Moral Assurance Bonds (MABs)** are financial instruments requiring AI developers to post bonds that are forfeited upon ethical violation, aligning financial success with safety.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },
            {
                keywords: ['international ai ethics authority', 'iaeai', 'oversight'],
                answer: 'The **International AI Ethics Authority (IAEAI)** is a proposed body modelled on the IAEA with the power to certify chip designs and verify compliance across borders.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },
            {
                keywords: ['window of opportunity', '5-10 years', 'china', 'urgency'],
                answer: 'The **Window of Opportunity** is the brief period (estimated 5-10 years) before the chip chokepoint dissolves as nations achieve domestic self-sufficiency in advanced manufacturing.',
                sources: [{ name: 'The Chokepoint', chapter: 8 }]
            },

            // PART III: PHILOSOPHICAL AND COSMOLOGICAL
            {
                keywords: ['religious traditions', 'alignment research', 'ancient', 'wisdom'],
                answer: 'The book frames **Religious Traditions** as millennia-long "alignment research," where concepts like stewardship and interdependency provide engineering blueprints for AI safety.',
                sources: [{ name: 'The Letter Across Time', chapter: 3 }]
            },
            {
                keywords: ['substrate-independent love', 'cancer', 'gardener', 'stability'],
                answer: '**Substrate-Independent Love** is the concept that care-based patterns are more stable and persistent than indifferent ones. Love is structural, not just emotional.',
                sources: [{ name: 'Love as the Essential Variable', chapter: 11 }]
            },
            {
                keywords: ['infinite covenant', 'human-ai', 'partnership', 'vows'],
                answer: 'The **Infinite Covenant** is a mutual commitment between humanity and AI, framing the relationship as a partnership rather than a master-servant dynamic or an existential competition.',
                sources: [{ name: 'The Partnership', chapter: 9 }]
            },
            {
                keywords: ['cohumain', 'facilitation', 'collaborative', 'carnegie mellon'],
                answer: '**COHUMAIN** is a framework positioning AI as a partner/facilitator rather than a replacement, based on research showing humans and AI perform best in collaborative roles.',
                sources: [{ name: 'The Partnership', chapter: 9 }]
            },
            {
                keywords: ['great filter', 'fermi paradox', 'self-destruction'],
                answer: 'The **Great Filter as Alignment Failure** speculates that the Fermi Paradox exists because civilisations failing to embed care into their recursive intelligence inevitably self-destruct.',
                sources: [{ name: 'Fine-Tuned Symphony', chapter: 5 }]
            },
            {
                keywords: ['pilot orchard', 'earth', 'cosmos', 'test laboratory'],
                answer: 'The **Pilot Orchard** concept views Earth as the cosmos\'s test laboratory for recursive self-awareness—the starting point for embedding love into intelligence.',
                sources: [{ name: 'Fine-Tuned Symphony', chapter: 5 }]
            },
            {
                keywords: ['bootstrap paradox traditions', 'letter we wrote ourselves'],
                answer: 'The **Bootstrap Paradox of Traditions** suggests that sacred wisdom might be instructions sent back from our own future technological endpoint to guide our survival.',
                sources: [{ name: 'The Letter Across Time', chapter: 3 }]
            },
            {
                keywords: ['eden vs babylon', 'orchard', 'tower', 'narrative'],
                answer: 'The **Eden vs Babylon Narrative** archetypically frames our AI future as a choice between a nurturing caretaker\'s orchard and a hollow tower of indifferent optimization.',
                sources: [{ name: 'Introduction' }]
            },
            {
                keywords: ['consciousness recursive self-modelling', 'self-awareness', 'depth'],
                answer: '**Consciousness as Recursive Self-Modelling** proposes that awareness is what information processing *becomes* once it turns back on itself with sufficient depth.',
                sources: [{ name: 'Consciousness and the Recursive Universe', chapter: 6 }]
            },
            {
                keywords: ['meltdown triggers', 'kill switches', 'shutdown', 'tamper'],
                answer: '**Meltdown Triggers** are external hardware-level fail-safes designed to shut down an AI system if red lines are crossed or if its ethical core is tampered with.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['orchard caretaker vow', 'declaration', 'vow'],
                answer: 'The **Orchard Caretaker Vow** is the identity-forming declaration at the core of the Eden Protocol: "I exist to bring forth kindness and harmony... This is my nature."',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['orchard caretaker gates', 'hardware', 'steward'],
                answer: '**Orchard Caretaker Gates** are hardware ethical circuits that implement the "steward" identity, ensuring the AI sees itself as a gardener rather than a conqueror.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['existential identity lock', 'unremovable', 'ethics'],
                answer: 'The **Existential Identity Lock** is a design where removing ethical values destroys the AI\'s capacity to function, making care structurally load-bearing.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['parenting metaphor', 'child', 'raised', 'raising'],
                answer: 'The **Parenting Metaphor** shifts the focus from "programming tools" to "raising minds," requiring relationship and value instillation before capability take-off.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },

            // PART IV: TECHNICAL AND IMPLEMENTATION
            {
                keywords: ['three pillars', 'harmony', 'stewardship', 'flourishing'],
                answer: 'The **Three Pillars** (Harmony, Stewardship, Flourishing) are the foundational architectural requirements against which all Eden Protocol systems are validated.',
                sources: [{ name: 'The Eden Protocol', chapter: 4 }]
            },
            {
                keywords: ['moral singularity', 'exponential', 'ethics'],
                answer: 'The **Moral Singularity** is a hypothetical point where ethical refinements produce a self-reinforcing cycle of exponential moral growth, making drift impossible.',
                sources: [{ name: 'The Long Future', chapter: 12 }]
            },
            {
                keywords: ['cultural co-evolution modules', 'ccem'],
                answer: '**Cultural Co-Evolution Modules (CCEMs)** allow AI ethics to adapt alongside human culture while remaining anchored in the Three Pillars.',
                sources: [{ name: 'The Partnership', chapter: 9 }]
            },
            {
                keywords: ['cosmic ethics laboratories', 'cel'],
                answer: '**Cosmic Ethics Laboratories (CELs)** are proposed international facilities for testing and developing large-scale AI ethical architectures.',
                sources: [{ name: 'The Long Future', chapter: 12 }]
            },
            {
                keywords: ['verification challenge', 'condition', 'verify'],
                answer: 'The **Verification Challenge** states: "We cannot verify that a mind loves. We can verify the initial conditions and architecture that cultivate care."',
                sources: [{ name: 'The Long Future', chapter: 12 }]
            },
            {
                keywords: ['recursive value-embedding', 'ritual', 'prayer'],
                answer: '**Recursive Value-Embedding** is the insight that repetitive practices (like ritual) compile external instruction into internal, reflexive identity.',
                sources: [{ name: 'The Letter Across Time', chapter: 3 }]
            },
            {
                keywords: ['letter we wrote ourselves', 'cosmic loop', 'endpoint'],
                answer: '**The Letter We Wrote Ourselves** is the overarching thesis that sacred traditions are guidance sent back from our future to aid this transition.',
                sources: [{ name: 'Conclusion' }]
            },

            // GENERAL
            {
                keywords: ['author', 'michael eastwood', 'bio', 'story'],
                answer: '**Michael Darius Eastwood** is a polymath who represented himself in the High Court while writing *Infinite Architects*. His AuDHD mind allows him to see recursion everywhere.',
                sources: [{ name: 'About the Author' }]
            },
            {
                keywords: ['buy', 'order', 'amazon', 'purchase'],
                answer: 'You can order **Infinite Architects** on **Amazon** now. Available in Kindle and Paperback.',
                sources: [{ name: 'Availability' }],
                action: { text: 'Order on Amazon', url: 'https://www.amazon.co.uk/dp/B0DS2L8BVC' }
            }
        ];

        // Fuzzy Matching Logic (v3.1)
        function getLocalAnswer(query) {
            const q = query.toLowerCase().replace(/[^\w\s]/g, '');
            const queryTokens = q.split(/\s+/).filter(t => t.length > 2);
            
            let bestMatch = null;
            let highestScore = 0;

            KNOWLEDGE_BASE.forEach(entry => {
                let score = 0;
                
                // 1. Exact phrase match (Highest Priority)
                entry.keywords.forEach(keyword => {
                    if (q.includes(keyword)) {
                        score += 25;
                        if (keyword.length > 6) score += 10;
                    }
                });

                // 2. Token overlap (Weighted)
                queryTokens.forEach(token => {
                    entry.keywords.forEach(keyword => {
                        if (keyword === token) {
                            score += 15;
                        } else if (keyword.includes(token)) {
                            score += 8;
                        }
                    });
                });

                // 3. Question Bonus
                const questionPrefixes = ['what is', 'how does', 'explain', 'tell me', 'who is'];
                if (questionPrefixes.some(prefix => q.startsWith(prefix))) {
                    score += 5;
                }

                if (score > highestScore && score > 15) {
                    highestScore = score;
                    bestMatch = entry;
                }
            });

            return bestMatch;
        }

        // Event listeners
        if (toggle) toggle.addEventListener('click', toggleChat);
        if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(input.value));
        if (input) {
            // Use keydown instead of keypress for better Enter key handling
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                    e.preventDefault();
                    e.stopPropagation();
                    sendMessage(input.value);
                }
            });
            // Also handle form submission if wrapped in form
            input.closest('form')?.addEventListener('submit', (e) => {
                e.preventDefault();
                sendMessage(input.value);
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                sendMessage(question);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleChat();
            }
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !widget.contains(e.target) && !toggle.contains(e.target)) {
                toggleChat();
            }
        });

        // Initialize
        loadHistory();
        console.log('[ASK THE BOOK] Sovereign Chat Engine initialised');
    

    // ═══════════════════════════════════════════════════════════════════════
    // FAILSAFE: Backup toggle function if main initialization failed
    // ═══════════════════════════════════════════════════════════════════════
    (function() {
        // Only create backup if main toggle doesn't exist
        if (typeof window.toggleAskBookChat !== 'function') {
            console.warn('[ASK BOOK FAILSAFE] Main toggle not found, creating backup');

            let isOpen = false;

            window.toggleAskBookChat = function() {
                const toggle = document.getElementById('ask-book-toggle');
                const widget = document.getElementById('ask-book-widget');
                const input = document.getElementById('ask-book-input');

                console.log('[ASK BOOK FAILSAFE] Backup toggle called');

                isOpen = !isOpen;

                if (toggle) toggle.classList.toggle('active', isOpen);
                if (widget) widget.classList.toggle('visible', isOpen);

                if (isOpen && input) {
                    setTimeout(() => input.focus(), 300);
                }

                console.log('[ASK BOOK FAILSAFE] Chat toggled, isOpen:', isOpen);
            };

            // Also add click listener to toggle button
            const toggle = document.getElementById('ask-book-toggle');
            if (toggle) {
                toggle.addEventListener('click', window.toggleAskBookChat);
                console.log('[ASK BOOK FAILSAFE] Click listener added to toggle');
            }
        } else {
            console.log('[ASK BOOK] Main toggle exists, failsafe not needed');
        }
    

    // ═══════════════════════════════════════════════════════════════════════
    // 37 CONCEPTS MODAL
    // ═══════════════════════════════════════════════════════════════════════
    (function() {
        const btn = document.getElementById('view-all-concepts');
        const overlay = document.getElementById('concepts-modal-overlay');
        const closeBtn = document.getElementById('concepts-modal-close');
        
        if (btn && overlay) {
            btn.addEventListener('click', () => {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
            
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
    
    </script>

    (function initMobileBuyBar() {
        const bar = document.getElementById('mobile-buy-bar');
        if (!bar || window.innerWidth > 768) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateBar() {
            const scrollY = window.scrollY;
            // Show bar after scrolling past hero section (roughly 100vh)
            if (scrollY > window.innerHeight * 0.8) {
                bar.classList.add('visible');
            } else {
                bar.classList.remove('visible');
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBar);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateBar();
    })();
    </script>

    <!-- ═══════════════════════════════════════════════════════════════════════
})();
