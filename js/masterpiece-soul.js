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
            
            // Modulate drone based on scroll
            window.addEventListener('scroll', () => {
                if (!this.isPlaying) return;
                const scrollY = window.scrollY;
                const freq = 40 + (scrollY * 0.05);
                osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
            });
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
    // BOOTSTRAP
    // ─────────────────────────────────────────────────────────────────────────────
    window.addEventListener('load', () => {
        initPhysics();
        AudioSoul.init();
        initInteractions();
        initScramble();
        
        // FAIL-SAFE UNLOCK (Rule 15)
        // Ensure site is scrollable and visible after 4 seconds regardless of loader state
        setTimeout(() => {
            document.body.classList.remove('loader-active');
            document.body.classList.add('scroll-unlocked');
            console.log('🔓 Fail-safe: Scroll and Intro forced.');
            
            // Force Lenis to wake up
            if (window.lenisInstance) {
                window.lenisInstance.start();
                window.lenisInstance.resize();
                console.log('✨ Lenis forced start (Local Fix)');
            }
            
            // Trigger Titan Slam if it hasn't fired
            const book = document.getElementById('hero-book');
            if (book && !book.classList.contains('titan-drop')) {
                book.classList.add('titan-drop');
            }
        }, 4000);

        console.log('🚀 MASTERPIECE SOUL ACTIVATED: All enhancements live.');
    });

})();
