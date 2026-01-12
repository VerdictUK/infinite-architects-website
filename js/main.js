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
                if (this.isSlowConnection && this.isMobile) return 0.25;
                if (this.isSlowConnection || this.isMobile) return 0.5;
                return 1.0;
            }
        };

        // console.log(`⚡ Performance mode: ${PERF.multiplier}x (slow: ${PERF.isSlowConnection}, mobile: ${PERF.isMobile})`);

        // ═══════════════════════════════════════════════════════════════════════
        // CONFIGURATION - Adaptive based on connection
        // ═══════════════════════════════════════════════════════════════════════
        const CONFIG = {
            loader: {
                duration: PERF.isSlowConnection ? 3000 : 5000,
                particleCount: Math.floor(250 * PERF.multiplier) || 50,
                ringCount: PERF.isSlowConnection ? 2 : 4,
                trailLength: PERF.isSlowConnection ? 6 : 12,
                goldHue: 38
            },
            main: {
                particleCount: Math.floor(400 * PERF.multiplier) || 80,
                connectionDistance: PERF.isSlowConnection ? 80 : 100,
                connectionCheckCount: PERF.isMobile ? 40 : 60,
                maxConnections: PERF.isMobile ? 200 : 400,
                mouseInfluence: 0.00003
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
            skipped: false
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
            const ctx = canvas.getContext('2d');
            const loader = document.getElementById('loader');
            const barFill = document.getElementById('loader-bar-fill');
            const statusEl = document.getElementById('loader-status');

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
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
                document.body.classList.add('cinematic');
                loader.classList.add('hidden');

                // Ensure page is at top when loader completes
                window.scrollTo(0, 0);

                // Initialize Three.js canvas only when library is ready
                if (window.THREE) {
                    initMainCanvas();
                } else if (window.threeJsReady === false) {
                    // Wait for lazy-loaded Three.js
                    window.addEventListener('threejs-ready', initMainCanvas, { once: true });
                }

                initScrollAnimations();
                initNavigation();

                // Delay tesseract init to ensure DOM is laid out
                setTimeout(() => {
                    initTesseract();
                }, 100);

                // Start book floating animation after heroReveal completes (1.8s + 0.3s delay + buffer)
                setTimeout(() => {
                    const book = document.getElementById('hero-book');
                    if (book) {
                        book.style.opacity = '1'; // Force opacity before adding float
                        book.classList.add('float');
                    }
                }, 2500);
            }

            function animate() {
                const elapsed = Date.now() - loaderState.startTime;
                const progress = Math.min(1, elapsed / CONFIG.loader.duration);
                loaderState.progress = progress;

                const { width: w, height: h } = canvas;
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

                // Update UI
                barFill.style.width = `${progress * 100}%`;
                const phaseIndex = Math.min(STATUS_PHASES.length - 1, Math.floor(progress * STATUS_PHASES.length));
                statusEl.textContent = STATUS_PHASES[phaseIndex];

                if (progress < 1 && !loaderState.skipped) {
                    requestAnimationFrame(animate);
                } else if (!loaderState.skipped) {
                    setTimeout(completeLoader, 400);
                }
            }

            animate();
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
            const colors = new Float32Array(maxConnections * 6);

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
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
            const colors = lineMesh.geometry.attributes.color.array;
            let connectionCount = 0;
            const checkCount = CONFIG.main.connectionCheckCount || 60;
            const maxConnections = CONFIG.main.maxConnections || 400;
            const connDist = CONFIG.main.connectionDistance;
            const distSq = connDist * connDist; // Squared distance to avoid sqrt

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

                        colors[c] = goldR;
                        colors[c + 1] = goldG;
                        colors[c + 2] = goldB;
                        colors[c + 3] = goldR;
                        colors[c + 4] = goldG;
                        colors[c + 5] = goldB;

                        connectionCount++;
                    }
                }
            }

            lineMesh.geometry.setDrawRange(0, connectionCount * 2);
            lineMesh.geometry.attributes.position.needsUpdate = true;
            lineMesh.geometry.attributes.color.needsUpdate = true;
        }

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

            // Update particles
            for (let i = 0; i < CONFIG.main.particleCount; i++) {
                const i3 = i * 3;
                const vel = particleVelocities[i];

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

                // Mouse influence
                vel.x += mouseX * CONFIG.main.mouseInfluence;
                vel.y += mouseY * CONFIG.main.mouseInfluence;

                // Damping
                vel.x *= 0.99;
                vel.y *= 0.99;
                vel.z *= 0.99;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            updateConnections();
            particles.rotation.y += 0.00045;  // 3x faster rotation
            renderer.render(scene, camera);
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

            // Scroll behavior - throttled for performance
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
        })();

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

                // Show custom install banner after 30 seconds
                if (!installBannerShown && !isStandalone()) {
                    setTimeout(() => {
                        showInstallBanner();
                    }, 30000);
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
                        <img src="/android-chrome-192x192.png" alt="Infinite Architects" class="pwa-install-icon" onerror="this.style.display='none'">
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
        })();

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

        document.addEventListener('DOMContentLoaded', initLoader);

        // Export to window for cross-IIFE access (needed by enhancement scripts)
        window.PERF = PERF;
        window.Features = Features;
        window.pageVisible = pageVisible;

        // Keep pageVisible synced on window
        document.addEventListener('visibilitychange', () => {
            window.pageVisible = !document.hidden;
        });

    })();
