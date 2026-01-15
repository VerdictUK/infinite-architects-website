/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MASTERPIECE SOUL - The Ferrari Engine of Infinite Architects
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Includes:
 * 1. Lenis Smooth Scroll (Inertial Physics)
 * 2. Web Audio API Soul (Generative Drone & Chimes)
 * 3. GSAP Magnetic Interactions & God Cursor
 * 4. Scramble Reveal Engine
 */

(function() {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. LENIS INERTIAL PHYSICS
    // ─────────────────────────────────────────────────────────────────────────────
    let lenis;
    function initPhysics() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8,
            smoothTouch: false,
            touchMultiplier: 1.5,
            infinite: false,
        });

        window.lenisInstance = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        console.log('✨ Masterpiece Physics: Lenis Active (Dampening: 0.1)');
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. THE SOUL (Generative Audio)
    // ─────────────────────────────────────────────────────────────────────────────
    const AudioSoul = {
        ctx: null,
        drone: null,
        filter: null,
        isPlaying: false,
        
        init() {
            const btn = document.getElementById('audio-toggle');
            if (!btn) return;

            btn.addEventListener('click', () => this.toggle());
        },

        async toggle() {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.createDrone();
            }

            if (this.isPlaying) {
                this.ctx.suspend();
                this.isPlaying = false;
                document.getElementById('audio-status').textContent = 'Off';
                document.querySelector('.sound-waves').style.opacity = '0.3';
            } else {
                await this.ctx.resume();
                this.isPlaying = true;
                document.getElementById('audio-status').textContent = 'Live';
                document.querySelector('.sound-waves').style.opacity = '1';
            }
        },

        createDrone() {
            // THE VOID: A low deep 40Hz drone
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            this.filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(40, this.ctx.currentTime); // 40Hz Deep Drone
            
            this.filter.type = 'lowpass';
            this.filter.frequency.setValueAtTime(400, this.ctx.currentTime);
            this.filter.Q.setValueAtTime(10, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Subtle

            osc.connect(this.filter);
            this.filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            
            // PERF: Throttled scroll listener
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!this.isPlaying || ticking) return;
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const freq = 40 + (scrollY * 0.05);
                    osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
                    ticking = false;
                });
                ticking = true;
            }, { passive: true });
        },

        playChime() {
            if (!this.isPlaying) return;
            // THE GOLD: High frequency chime
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880 + Math.random() * 400, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 1.5);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. GOD CURSOR & MAGNETIC BUTTONS
    // ─────────────────────────────────────────────────────────────────────────────
    function initInteractions() {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        
        if (!dot || !ring || window.innerWidth < 1024) return;

        // Show cursor
        document.addEventListener('mousemove', () => {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }, { once: true });

        // Update position
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        gsap.set(ring, { xPercent: -50, yPercent: -50 });

        window.addEventListener('mousemove', e => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
            
            createTrail(e.clientX, e.clientY);
        });

        // Magnetic Buttons
        const magnets = document.querySelectorAll('.nav-link-iconic, .nav-cta, .hero-cta, #view-all-concepts, .tripath-cta');
        magnets.forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                // Expand cursor
                gsap.to(ring, { scale: 1.5, borderColor: '#f4c856', duration: 0.3 });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
                gsap.to(ring, { scale: 1, borderColor: 'rgba(212, 168, 75, 0.3)', duration: 0.3 });
            });
            
            btn.addEventListener('mouseenter', () => AudioSoul.playChime());
        });
    }

    function createTrail(x, y) {
        if (Math.random() > 0.3) return; // Particle density
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        gsap.to(trail, {
            y: y + (Math.random() - 0.5) * 50,
            x: x + (Math.random() - 0.5) * 50,
            opacity: 0,
            scale: 0,
            duration: 1 + Math.random(),
            onComplete: () => trail.remove()
        });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. TEXT SCRAMBLE ENGINE
    // ─────────────────────────────────────────────────────────────────────────────
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => (this.resolve = resolve));
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="opacity-50 text-gold font-mono">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    function initScramble() {
        const headers = document.querySelectorAll('h1, h2.section-title');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                    const scrambler = new TextScramble(entry.target);
                    const originalText = entry.target.innerText;
                    entry.target.dataset.scrambled = "true";
                    scrambler.setText(originalText);
                }
            });
        }, { threshold: 0.5 });

        headers.forEach(h => observer.observe(h));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 5. THE RESOURCE ORCHESTRATOR (Proper Fix - Performance)
    // ─────────────────────────────────────────────────────────────────────────────
    const Orchestrator = {
        targets: new Map(),
        
        init() {
            console.log('🎻 Orchestrator: Setting up Resource Management...');
            
            const observerOptions = {
                root: null,
                threshold: 0.01,
                rootMargin: '300px' // High margin for smooth pre-reveal
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const el = entry.target;
                    const id = el.id || 'video-' + Math.random();
                    const isVisible = entry.isIntersecting;
                    
                    if (isVisible) {
                        this.activateEffect(el, id);
                    } else {
                        this.deactivateEffect(el, id);
                    }
                });
            }, observerOptions);

            // Register Specific Heavy Assets
            const heavyIds = [
                'neural-canvas',
                'tesseract-canvas',
                'portal-video',
                'bbc-evidence-video',
                'book-cover-video',
                'mandelbrot-video'
            ];
            heavyIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });

            // Register ALL generic videos for performance management
            document.querySelectorAll('video').forEach(video => {
                // Skip if already tracked via heavyIds
                if (!heavyIds.includes(video.id)) {
                    observer.observe(video);
                }
            });

            // Monitor Modals to pause everything behind them
            this.watchModals();
        },

        activateEffect(el, id) {
            if (!el) return;
            
            if (window.DEBUG_PERF) console.log(`🚀 Orchestrator: Activating ${id}`);
            
            if (el.tagName === 'VIDEO') {
                if (el.paused) el.play().catch(() => {});
            } else {
                el.style.display = 'block';
            }
            
            // Hook for custom engines (Proper Fix)
            if (id === 'neural-canvas' && window.neuralEngine) window.neuralEngine.resume();
            if (id === 'fluid-canvas' && window.fluidEngine) window.fluidEngine.resume?.();
            if (id === 'hero-book-container' && window.bookEngine) window.bookEngine.resume?.();
        },

        deactivateEffect(el, id) {
            if (!el) return;
            
            if (window.DEBUG_PERF) console.log(`💤 Orchestrator: Hibernating ${id}`);
            
            if (el.tagName === 'VIDEO') {
                if (!el.paused) el.pause();
            } else {
                el.style.display = 'none'; 
            }
            
            if (id === 'neural-canvas' && window.neuralEngine) window.neuralEngine.pause();
            if (id === 'fluid-canvas' && window.fluidEngine) window.fluidEngine.pause?.();
            if (id === 'hero-book-container' && window.bookEngine) window.bookEngine.pause?.();
        },

        watchModals() {
            const modalObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isAnyModalActive = !!document.querySelector('.active[id*="modal"], .active[id*="overlay"]');
                        document.body.classList.toggle('modal-open', isAnyModalActive);
                        
                        // PERF: Pause expensive background effects when modal is open
                        if (window.fluidEngine) {
                            if (isAnyModalActive) window.fluidEngine.pause?.();
                            else if (window.PERF_STATE?.isHeroVisible) window.fluidEngine.resume?.();
                        }
                        if (window.bookEngine) {
                            if (isAnyModalActive) window.bookEngine.pause?.();
                            else if (window.PERF_STATE?.isHeroVisible) window.bookEngine.resume?.();
                        }
                    }
                });
            });

            const config = { attributes: true, subtree: true, attributeFilter: ['class'] };
            modalObserver.observe(document.body, config);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 6. CONCEPT ARCHIVE MANAGER (Proper Fix - Performance)
    // ─────────────────────────────────────────────────────────────────────────────
    const ConceptArchive = {
        data: null,
        isLoaded: false,
        
        async open() {
            const modal = document.getElementById('concepts-modal');
            if (!modal) return;

            modal.classList.add('active');
            document.body.classList.add('modal-active');

            if (!this.isLoaded) {
                await this.load();
            }
        },

        async load() {
            console.log('📚 ConceptArchive: Loading data...');
            const container = document.getElementById('concepts-modal-content');
            if (!container) return;

            try {
                const response = await fetch('knowledge/concepts.json');
                this.data = await response.json();
                
                let html = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 md:p-12">
                `;

                this.data.forEach((item, index) => {
                    html += `
                        <article class="reveal glass-panel-ultra p-8 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all duration-500 group flex flex-col h-full" style="transition-delay: ${index * 0.05}s">
                            <div class="flex justify-between items-start mb-8">
                                <span class="font-mono text-gold text-[10px] uppercase tracking-widest border border-gold/20 px-3 py-1 rounded-full">Concept ${item.id.toString().padStart(2, '0')}</span>
                                <span class="text-[9px] text-white/30 uppercase tracking-tighter font-mono">${item.category}</span>
                            </div>
                            <h4 class="font-display text-2xl text-white mb-4 group-hover:text-gold transition-colors leading-tight">${item.title}</h4>
                            <p class="text-text-secondary text-sm leading-relaxed font-serif italic italic flex-grow">${item.description}</p>
                            
                            <div class="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <span class="text-[10px] font-mono text-white/20 uppercase tracking-widest">IA-CORE-V1</span>
                                <div class="w-2 h-2 rounded-full bg-gold/30 group-hover:bg-gold transition-colors shadow-glow-sm"></div>
                            </div>
                        </article>
                    `;
                });

                html += `</div>`;
                container.innerHTML = html;
                this.isLoaded = true;
                
                // Trigger reveal after render
                setTimeout(() => {
                    container.querySelectorAll('.reveal').forEach(el => el.classList.add('apple-visible'));
                }, 100);

                console.log('📚 ConceptArchive: 37 Concepts rendered.');
            } catch (error) {
                console.error('❌ ConceptArchive: Load failed', error);
                container.innerHTML = '<p class="text-red-400">Failed to load the archive. Please try again.</p>';
            }
        }
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 7. THE LIFECYCLE MANAGER (The Conductor)
    // ─────────────────────────────────────────────────────────────────────────────
    const SiteLifecycle = {
        isInitialized: false,
        
        async init() {
            if (this.isInitialized) return;
            this.isInitialized = true;

            console.log('🏗️ Lifecycle: Initializing Masterpiece Engine...');
            
            initPhysics();
            AudioSoul.init();
            initInteractions();
            initScramble();
            Orchestrator.init();

            // Register Concept Archive Click
            const archiveBtn = document.getElementById('view-all-concepts');
            if (archiveBtn) archiveBtn.addEventListener('click', () => ConceptArchive.open());

            const closeBtn = document.getElementById('close-concepts-modal');
            if (closeBtn) closeBtn.addEventListener('click', () => {
                document.getElementById('concepts-modal').classList.remove('active');
                document.body.classList.remove('modal-active');
            });

            // Wait for everything
            if (document.readyState === 'complete') {
                this.reveal();
            } else {
                window.addEventListener('load', () => this.reveal());
            }

            // Fail-safe
            setTimeout(() => this.reveal(), 5000);
        },

        reveal() {
            if (document.body.classList.contains('site-ready')) return;

            console.log('✨ Lifecycle: Site Ready. Commencing Cinematic Reveal.');

            // CLAUDE FIX: Explicitly stop loader video to free GPU (2026-01-15)
            const loaderVideo = document.getElementById('loader-video');
            if (loaderVideo && !loaderVideo.paused) {
                loaderVideo.pause();
                loaderVideo.currentTime = 0;
                console.log('🎬 Lifecycle: Loader video stopped.');
            }

            document.body.classList.remove('loader-active');
            document.body.classList.add('site-ready');
            
            // Force Lenis to wake up and sync
            if (window.lenisInstance) {
                window.lenisInstance.start();
                window.lenisInstance.resize();
            }

            // Reveal UI elements (sidebar, ticker, chat, etc.)
            setTimeout(() => {
                document.body.classList.add('ui-revealed');
                
                // REANIMATION: Plug Genius features into the Lifecycle (Proper Fix)
                this.initGeniusFeatures();
            }, 500);

            // Trigger the TITAN SLAM
            this.triggerTitanSlam();
        },

        initGeniusFeatures() {
            console.log('🧠 Lifecycle: Reanimating Genius Features...');
            
            // 1. Reanimate Fluid Simulation (The Void)
            const fluidCanvas = document.getElementById('fluid-canvas');
            if (fluidCanvas && window.FluidSimulation) {
                // We'll use the existing global THREE if available
                window.fluidEngine = new FluidSimulation(window.mainScene, window.mainRenderer, window.mainCamera);
                console.log('🌌 Genius: Fluid Simulation Active');
            }

            // 2. Reanimate 3D Book (The Artifact)
            const bookContainer = document.getElementById('hero-book-container');
            if (bookContainer && window.Book3D) {
                window.bookEngine = new Book3D(bookContainer, window.mainScene, window.mainRenderer, window.mainCamera);
                console.log('📚 Genius: 3D Book Active');
            }
        },

        triggerTitanSlam() {
            const book = document.getElementById('hero-book');
            if (book) {
                // Ensure small delay for opacity transition to finish
                setTimeout(() => {
                    book.classList.add('titan-drop');
                    console.log('🔨 Lifecycle: Titan Slam executed.');
                    
                    // Subtle haptic feedback feel via screen shake (optional effect)
                    document.body.classList.add('slam-impact');
                    setTimeout(() => document.body.classList.remove('slam-impact'), 500);
                }, 300);
            }
        }
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // BOOTSTRAP
    // ─────────────────────────────────────────────────────────────────────────────
    // Standardizing the entry point
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SiteLifecycle.init());
    } else {
        SiteLifecycle.init();
    }


})();
