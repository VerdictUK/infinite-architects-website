            </div>
            <div class="slideshow-arrows">
                <button class="slideshow-arrow" id="slideshowPrev" aria-label="Previous section">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                </button>
                <button class="slideshow-arrow" id="slideshowNext" aria-label="Next section">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Swipe hint (shown once on first visit) -->
    <div class="slideshow-swipe-hint" id="swipeHint">
        <div class="swipe-icon">
            <div class="swipe-dot"></div>
        </div>
        <span class="swipe-text">Swipe to explore</span>
    </div>

    <script>
    // ═══════════════════════════════════════════════════════════════════════════
    // PREMIUM SLIDESHOW NAVIGATION SYSTEM
    // Creates an app-like presentation experience on mobile
    // ═══════════════════════════════════════════════════════════════════════════
    (function() {
        'use strict';

        // Only enable on mobile
        const isMobile = () => window.innerWidth <= 768;
        if (!isMobile()) {
            // Hide nav elements on desktop
            const nav = document.getElementById('slideshowNav');
            const hint = document.getElementById('swipeHint');
            if (nav) nav.style.display = 'none';
            if (hint) hint.style.display = 'none';
            return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // CONFIGURATION
        // ─────────────────────────────────────────────────────────────────────
        const config = {
            swipeThreshold: 50,           // Minimum swipe distance
            swipeTimeThreshold: 300,      // Max time for a swipe (ms)
            scrollDebounce: 100,          // Debounce scroll detection
            titleDisplayTime: 2000,       // How long to show section title
            hapticEnabled: true,          // Enable haptic feedback
            animationDuration: 500        // Scroll animation duration
        };

        // ─────────────────────────────────────────────────────────────────────
        // STATE
        // ─────────────────────────────────────────────────────────────────────
        let sections = [];
        let currentIndex = 0;
        let visitedSections = new Set([0]);
        let isScrolling = false;
        let touchStartY = 0;
        let touchStartTime = 0;
        let scrollTimeout = null;
        let titleTimeout = null;

        // ─────────────────────────────────────────────────────────────────────
        // DOM ELEMENTS
        // ─────────────────────────────────────────────────────────────────────
        const nav = document.getElementById('slideshowNav');
        const titleEl = document.getElementById('slideshowTitle');
        const dotsContainer = document.getElementById('slideshowDots');
        const currentEl = document.getElementById('slideshowCurrent');
        const totalEl = document.getElementById('slideshowTotal');
        const progressBar = document.getElementById('slideshowProgress');
        const prevBtn = document.getElementById('slideshowPrev');
        const nextBtn = document.getElementById('slideshowNext');
        const swipeHint = document.getElementById('swipeHint');

        // ─────────────────────────────────────────────────────────────────────
        // SECTION NAMES (for title display)
        // ─────────────────────────────────────────────────────────────────────
        const sectionNames = {
            'hero': 'Welcome',
            'book': 'The Book',
            'equation': 'The Equation',
            'evidence-locker': 'Evidence Locker',
            'ideas': 'The 37 Concepts',
            'carousel': 'Key Quotes',
            'bbc-timeline': 'BBC Timeline',
            'architecture': 'Architecture',
            'chokepoint': 'The Chokepoint',
            'predictions': 'Predictions',
            'falsification': 'Falsification',
            'hrih': 'HRIH Theory',
            'religion': 'Religious Wisdom',
            'future-born': 'Future Born',
            'window': 'The Window',
            'author': 'About the Author',
            'comparison': 'Comparison',
            'stakes': 'The Stakes',
            'predictions-validated': 'Predictions Validated',
            'reviews': 'Reviews',
            'prophecy': 'The Prophecy',
            'get-the-book': 'Get the Book',
            'cta': 'Take Action',
            'paradise': 'Paradise Protocol',
            'newsletter': 'Newsletter',
            'press': 'Press'
        };

        // ─────────────────────────────────────────────────────────────────────
        // HAPTIC FEEDBACK
        // ─────────────────────────────────────────────────────────────────────
        const haptic = {
            light: () => {
                if (config.hapticEnabled && 'vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            },
            medium: () => {
                if (config.hapticEnabled && 'vibrate' in navigator) {
                    navigator.vibrate(20);
                }
            },
            tick: () => {
                if (config.hapticEnabled && 'vibrate' in navigator) {
                    navigator.vibrate([10, 30, 10]); // Mechanical click feel
                }
            }
        };

        // ─────────────────────────────────────────────────────────────────────
        // INITIALIZE
        // ─────────────────────────────────────────────────────────────────────
        function init() {
            // Get all sections
            sections = Array.from(document.querySelectorAll('.snap-section'));
            if (sections.length === 0) return;

            // Enable slideshow mode
            document.documentElement.classList.add('slideshow-mode');

            // Update total count
            totalEl.textContent = sections.length;

            // Create dot navigation
            createDots();

            // Show navigation after delay
            setTimeout(() => {
                nav.classList.add('active');
            }, 1500);

            // Hide swipe hint after interaction or timeout
            setTimeout(() => {
                if (swipeHint) swipeHint.style.display = 'none';
            }, 8000);

            // Set up event listeners
            setupEventListeners();

            // Initial state update
            updateState();

            // ─────────────────────────────────────────────────────────────
            // PREMIUM SNAP HAPTICS
            // Trigger tick exactly when a section is centered
            // ─────────────────────────────────────────────────────────────
            const snapObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        const index = sections.indexOf(entry.target);
                        if (index !== -1 && index !== currentIndex && !isScrolling) {
                            currentIndex = index;
                            visitedSections.add(index);
                            haptic.tick();
                            updateState();
                        }
                    }
                });
            }, { 
                threshold: [0.5],
                rootMargin: '-10% 0px -10% 0px'
            });

            sections.forEach(section => snapObserver.observe(section));

            console.log('✨ Slideshow Navigation Active:', sections.length, 'sections');
        }

        // ─────────────────────────────────────────────────────────────────────
        // CREATE DOT NAVIGATION
        // ─────────────────────────────────────────────────────────────────────
        function createDots() {
            dotsContainer.innerHTML = '';
            sections.forEach((section, index) => {
                const dot = document.createElement('button');
                dot.className = 'slideshow-dot' + (index === 0 ? ' active visited' : '');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Go to section ${index + 1}`);
                dot.addEventListener('click', () => goToSection(index));
                dotsContainer.appendChild(dot);
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // UPDATE STATE
        // ─────────────────────────────────────────────────────────────────────
        function updateState() {
            // Update counter
            currentEl.textContent = currentIndex + 1;

            // Update progress bar
            const progress = ((currentIndex + 1) / sections.length) * 100;
            progressBar.style.width = progress + '%';

            // Update dots
            const dots = dotsContainer.querySelectorAll('.slideshow-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
                if (visitedSections.has(index)) {
                    dot.classList.add('visited');
                }
            });

            // Update arrow states
            prevBtn.classList.toggle('disabled', currentIndex === 0);
            nextBtn.classList.toggle('disabled', currentIndex === sections.length - 1);

            // Show section title
            showSectionTitle();
        }

        // ─────────────────────────────────────────────────────────────────────
        // SHOW SECTION TITLE
        // ─────────────────────────────────────────────────────────────────────
        function showSectionTitle() {
            const section = sections[currentIndex];
            const id = section.id || '';
            const name = sectionNames[id] || `Section ${currentIndex + 1}`;

            titleEl.textContent = name;
            titleEl.classList.add('visible');

            // Clear existing timeout
            if (titleTimeout) clearTimeout(titleTimeout);

            // Hide after delay
            titleTimeout = setTimeout(() => {
                titleEl.classList.remove('visible');
            }, config.titleDisplayTime);
        }

        // ─────────────────────────────────────────────────────────────────────
        // NAVIGATE TO SECTION
        // ─────────────────────────────────────────────────────────────────────
        function goToSection(index, smooth = true) {
            if (index < 0 || index >= sections.length) return;
            if (isScrolling) return;

            const previousIndex = currentIndex;
            currentIndex = index;
            visitedSections.add(index);

            // Haptic feedback
            if (index !== previousIndex) {
                haptic.medium();
            }

            // Hide swipe hint on first navigation
            if (swipeHint) swipeHint.style.display = 'none';

            // Slide exit animation on previous section
            if (sections[previousIndex]) {
                sections[previousIndex].classList.add('slide-exit');
                sections[previousIndex].classList.remove('slide-enter');
            }

            // Scroll to section
            isScrolling = true;
            sections[index].scrollIntoView({
                behavior: smooth ? 'smooth' : 'auto',
                block: 'start'
            });

            // Slide enter animation on new section
            requestAnimationFrame(() => {
                sections[index].classList.add('slide-enter');
                sections[index].classList.remove('slide-exit');
            });

            // Update state
            updateState();

            // Reset animations and scrolling flag
            setTimeout(() => {
                isScrolling = false;
                // Clean up animation classes
                sections.forEach(s => {
                    s.classList.remove('slide-exit', 'slide-enter', 'transitioning');
                });
            }, config.animationDuration);
        }

        function goToPrevious() {
            if (currentIndex > 0) {
                goToSection(currentIndex - 1);
            }
        }

        function goToNext() {
            if (currentIndex < sections.length - 1) {
                goToSection(currentIndex + 1);
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // DETECT CURRENT SECTION FROM SCROLL
        // ─────────────────────────────────────────────────────────────────────
        function detectCurrentSection() {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.scrollY;

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollTop;
                const sectionHeight = rect.height;

                // Section is considered "current" if it occupies majority of viewport
                if (scrollTop >= sectionTop - viewportHeight * 0.3 &&
                    scrollTop < sectionTop + sectionHeight - viewportHeight * 0.3) {
                    if (currentIndex !== i) {
                        currentIndex = i;
                        visitedSections.add(i);
                        haptic.tick();
                        updateState();
                    }
                    break;
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // EVENT LISTENERS
        // ─────────────────────────────────────────────────────────────────────
        function setupEventListeners() {
            // Arrow button clicks
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                haptic.light();
                goToPrevious();
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                haptic.light();
                goToNext();
            });

            // Touch swipe detection
            document.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                const deltaY = touchStartY - touchEndY;
                const deltaTime = touchEndTime - touchStartTime;

                // Check if this is a valid swipe
                if (Math.abs(deltaY) > config.swipeThreshold && deltaTime < config.swipeTimeThreshold) {
                    if (deltaY > 0) {
                        // Swipe up - go to next
                        goToNext();
                    } else {
                        // Swipe down - go to previous
                        goToPrevious();
                    }
                }
            }, { passive: true });

            // Scroll detection (for manual scrolling)
            window.addEventListener('scroll', () => {
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (!isScrolling) {
                        detectCurrentSection();
                    }
                }, config.scrollDebounce);
            }, { passive: true });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    goToNext();
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    goToPrevious();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    goToSection(0);
                } else if (e.key === 'End') {
                    e.preventDefault();
                    goToSection(sections.length - 1);
                }
            });

            // Handle resize (switch between mobile/desktop)
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (isMobile()) {
                        nav.style.display = '';
                        document.documentElement.classList.add('slideshow-mode');
                    } else {
                        nav.style.display = 'none';
                        document.documentElement.classList.remove('slideshow-mode');
                    }
                }, 200);
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 8: CINEMATIC VIDEO PORTAL
        // ═══════════════════════════════════════════════════════════════════════
        const videoPortal = document.getElementById('video-portal');
        const portalVideo = document.getElementById('portal-video');
        
        if (videoPortal && portalVideo) {
            // Lazy load video when section comes into view
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Load and play
                        portalVideo.load();
                        portalVideo.play().then(() => {
                            videoPortal.classList.add('loaded');
                        }).catch(e => {
                            console.log('Video autoplay prevented:', e);
                            // Show poster as fallback
                            videoPortal.classList.add('loaded');
                        });
                    } else {
                        // Pause when out of view (save battery)
                        portalVideo.pause();
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '100px' // Start loading slightly before visible
            });
            
            videoObserver.observe(videoPortal);
            
            // Respect reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                portalVideo.remove();
                videoPortal.style.background = 'radial-gradient(ellipse, rgba(212, 168, 75, 0.1) 0%, transparent 70%)';
                videoPortal.classList.add('loaded');
            }
            
            // Battery saving: pause if page hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    portalVideo.pause();
                } else if (videoPortal.classList.contains('loaded')) {
                    portalVideo.play().catch(() => {});
                }
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 9: LIQUID REALITY SCROLL
        // ═══════════════════════════════════════════════════════════════════════
        let lenis = null;
        
        // Only enable smooth scroll on capable devices
        const enableLiquidScroll = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (enableLiquidScroll && typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.4,                    // Scroll duration (higher = smoother)
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.8,             // Slightly slower wheel
                smoothTouch: false,               // Native touch on mobile (better UX)
                touchMultiplier: 1.5,
                infinite: false,
            });

            // Animation frame loop
            function lenisRaf(time) {
                lenis.raf(time);
                requestAnimationFrame(lenisRaf);
            }
            requestAnimationFrame(lenisRaf);

            // Expose scroll position for other effects
            lenis.on('scroll', ({ scroll, progress }) => {
                document.documentElement.style.setProperty('--scroll-y', scroll);
                document.documentElement.style.setProperty('--scroll-progress', progress);
            });

            // Parallax effect for elements with data-parallax
            lenis.on('scroll', ({ scroll }) => {
                document.querySelectorAll('[data-parallax]').forEach(el => {
                    const speed = parseFloat(el.dataset.parallax) || 0.5;
                    const rect = el.getBoundingClientRect();
                    const yOffset = (rect.top + scroll) * speed * -0.1;
                    el.style.transform = `translateY(${yOffset}px)`;
                });
            });

            console.log('✨ Liquid Reality scroll enabled');
        }

        // Scroll-triggered reveals
        const liquidRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.liquid-reveal, .concept-card, .quote-card').forEach(el => {
            el.classList.add('liquid-reveal');
            liquidRevealObserver.observe(el);
        });

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 10: SONIC ARCHITECTURE
        // ═══════════════════════════════════════════════════════════════════════
        const SonicArchitecture = {
            initialized: false,
            playing: false,
            synths: {},
            
            async init() {
                if (this.initialized || typeof Tone === 'undefined') return;
                
                await Tone.start();
                
                // Ambient pad synth (evolving drone)
                this.synths.pad = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: 'sine' },
                    envelope: { attack: 4, decay: 2, sustain: 0.8, release: 4 }
                }).toDestination();
                this.synths.pad.volume.value = -24;
                
                // Shimmer synth for interactions
                this.synths.shimmer = new Tone.Synth({
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
                }).toDestination();
                this.synths.shimmer.volume.value = -18;
                
                // Filter for movement
                this.filter = new Tone.Filter(800, 'lowpass').toDestination();
                this.synths.pad.connect(this.filter);
                
                // Reverb for space
                this.reverb = new Tone.Reverb({ decay: 8, wet: 0.6 }).toDestination();
                this.synths.pad.connect(this.reverb);
                this.synths.shimmer.connect(this.reverb);
                
                this.initialized = true;
                console.log('✨ Sonic Architecture initialized');
            },
            
            async start() {
                if (!this.initialized) await this.init();
                if (this.playing) return;
                
                this.playing = true;
                
                // Play evolving chord progression
                const chords = [
                    ['A2', 'E3', 'A3'],      // A minor
                    ['F2', 'A2', 'C3'],      // F major
                    ['D2', 'F2', 'A2'],      // D minor
                    ['E2', 'G#2', 'B2']      // E major
                ];
                
                let chordIndex = 0;
                
                const playChord = () => {
                    if (!this.playing) return;
                    
                    this.synths.pad.triggerAttackRelease(chords[chordIndex], '8n');
                    chordIndex = (chordIndex + 1) % chords.length;
                    
                    // Random interval for organic feel
                    setTimeout(playChord, 8000 + Math.random() * 4000);
                };
                
                playChord();
                
                // Modulate filter based on scroll
                if (lenis) {
                    lenis.on('scroll', ({ progress }) => {
                        const freq = 400 + (progress * 1200);
                        this.filter.frequency.rampTo(freq, 0.5);
                    });
                }
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
            // Check saved preference
            const audioEnabled = localStorage.getItem('ia_audio') === 'true';
            
            audioToggle.addEventListener('click', async () => {
                const isActive = audioToggle.classList.toggle('active');
                
                if (isActive) {
                    await SonicArchitecture.start();
                    localStorage.setItem('ia_audio', 'true');
                    audioToggle.querySelector('.audio-toggle-tooltip').textContent = 'Sound On';
                } else {
                    SonicArchitecture.stop();
                    localStorage.setItem('ia_audio', 'false');
                    audioToggle.querySelector('.audio-toggle-tooltip').textContent = 'Enable Ambient Sound';
                }
            });
            
            // Add interaction sounds
            document.querySelectorAll('button, a, .concept-card, .quote-card').forEach(el => {
                el.addEventListener('mouseenter', () => SonicArchitecture.playInteraction('hover'));
                el.addEventListener('click', () => SonicArchitecture.playInteraction('click'));
            });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 11: HOLOGRAPHIC BOOK
        // ═══════════════════════════════════════════════════════════════════════
        const holoBook = document.getElementById('hero-book');
        const bookShadow = document.getElementById('book-shadow');
        const bookLight = holoBook?.querySelector('.book-light-layer');
        
        if (holoBook) {
            const maxRotation = 15; // Maximum degrees of rotation
            
            // Desktop: Mouse tracking
            if (window.innerWidth > 768) {
                document.addEventListener('mousemove', (e) => {
                    const rect = holoBook.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // Calculate rotation based on mouse position relative to book center
                    const rotateY = ((e.clientX - centerX) / window.innerWidth) * maxRotation * 2;
                    const rotateX = ((centerY - e.clientY) / window.innerHeight) * maxRotation * 2;
                    
                    // Apply transform
                    holoBook.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    holoBook.classList.add('tracking');
                    
                    // Move shadow opposite to tilt
                    if (bookShadow) {
                        bookShadow.style.transform = `translateX(calc(-50% + ${rotateY * 2}px)) rotateX(90deg) scaleX(${1 + Math.abs(rotateY) * 0.02})`;
                    }
                    
                    // Move light reflection
                    if (bookLight) {
                        const lightX = 50 + rotateY * 2;
                        const lightY = 50 - rotateX * 2;
                        bookLight.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,255,255,0.5) 0%, transparent 50%)`;
                    }
                });
                
                // Reset on mouse leave
                document.addEventListener('mouseleave', () => {
                    holoBook.style.transform = '';
                    holoBook.classList.remove('tracking');
                    holoBook.classList.add('floating');
                    if (bookShadow) bookShadow.style.transform = '';
                });
            }
            
            // Mobile: Gyroscope tracking (enhanced from Phase 1)
            // Note: existing gyro code might handle this, but this is specific to Phase 11
            const gyroEnabled = window.DeviceOrientationEvent && 
                               typeof window.DeviceOrientationEvent.requestPermission === 'function';
                               
            if (window.innerWidth <= 768) {
                // This hooks into the existing gyroscope from Phase 1 if enabled
                window.addEventListener('deviceorientation', (e) => {
                    if (!e.beta) return;
                    
                    const beta = e.beta || 0;   // Front/back tilt
                    const gamma = e.gamma || 0; // Left/right tilt
                    
                    // Normalize and limit
                    const rotateX = Math.max(-maxRotation, Math.min(maxRotation, (beta - 45) * 0.5));
                    const rotateY = Math.max(-maxRotation, Math.min(maxRotation, gamma * 0.5));
                    
                    holoBook.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                    holoBook.classList.add('tracking');
                    
                    // Shadow follows tilt
                    if (bookShadow) {
                        bookShadow.style.transform = `translateX(calc(-50% + ${rotateY * 2}px)) rotateX(90deg)`;
                    }
                }, { passive: true });
                
                // Fallback: floating animation if no gyro
                holoBook.classList.add('floating');
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 12: PARTICLE TEXT DISSOLUTION
        // ═══════════════════════════════════════════════════════════════════════
        function initDissolveText() {
            const heroTitle = document.querySelector('.hero-title');
            if (!heroTitle || heroTitle.classList.contains('dissolve-ready')) return;
            
            // Split text into individual characters
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
            
            // Create particle pool
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
            
            // Dissolve on scroll past hero
            const dissolveThreshold = window.innerHeight * 0.3;
            
            const checkDissolve = () => {
                const scrollY = window.scrollY;
                
                if (scrollY > dissolveThreshold && !dissolved) {
                    dissolved = true;
                    heroTitle.classList.add('dissolving');
                    
                    // Emit particles from each character
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
                    
                    // Play sound if enabled
                    if (typeof SonicArchitecture !== 'undefined' && SonicArchitecture.initialized) {
                        SonicArchitecture.playInteraction('milestone');
                    }
                    
                } else if (scrollY <= dissolveThreshold * 0.5 && dissolved) {
                    dissolved = false;
                    heroTitle.classList.remove('dissolving');
                }
            };
            
            window.addEventListener('scroll', checkDissolve, { passive: true });
        }
        
        // Initialize after page load
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
                // Update every 5 minutes
                setInterval(() => this.update(), 5 * 60 * 1000);
            },
            
            update() {
                const hour = new Date().getHours();
                const root = document.documentElement;
                const body = document.body;
                
                // Remove all time modes
                body.classList.remove('dawn-mode', 'day-mode', 'dusk-mode', 'night-mode');
                
                // Determine time period
                if (hour >= 5 && hour < 8) {
                    // Dawn (5am - 8am)
                    body.classList.add('dawn-mode');
                    root.style.setProperty('--time-hue-shift', '10deg');
                    root.style.setProperty('--time-warmth', '0.3');
                    root.style.setProperty('--time-brightness', '0.95');
                    console.log('🌅 Dawn mode activated');
                    
                } else if (hour >= 8 && hour < 18) {
                    // Day (8am - 6pm)
                    body.classList.add('day-mode');
                    root.style.setProperty('--time-hue-shift', '0deg');
                    root.style.setProperty('--time-warmth', '0');
                    root.style.setProperty('--time-brightness', '1');
                    console.log('☀️ Day mode activated');
                    
                } else if (hour >= 18 && hour < 21) {
                    // Dusk (6pm - 9pm)
                    body.classList.add('dusk-mode');
                    root.style.setProperty('--time-hue-shift', '15deg');
                    root.style.setProperty('--time-warmth', '0.4');
                    root.style.setProperty('--time-brightness', '0.9');
                    console.log('🌆 Dusk mode activated');
                    
                } else {
                    // Night (9pm - 5am)
                    body.classList.add('night-mode');
                    root.style.setProperty('--time-hue-shift', '-5deg');
                    root.style.setProperty('--time-warmth', '0');
                    root.style.setProperty('--time-brightness', '0.85');
                    root.style.setProperty('--time-saturation', '1.1');
                    console.log('🌙 Night mode activated');
                }
            }
        };
        
        TimeConsciousness.init();

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 14: NEURAL NETWORK VISUALIZER
        // ═══════════════════════════════════════════════════════════════════════
        const neuralCanvas = document.getElementById('neural-canvas');
        
        if (neuralCanvas) {
            const ctx = neuralCanvas.getContext('2d');
            const conceptCards = document.querySelectorAll('.concept-card');
            let nodes = [];
            let animationFrame;
            
            function resizeCanvas() {
                const section = neuralCanvas.parentElement;
                if (!section) return;
                neuralCanvas.width = section.offsetWidth;
                neuralCanvas.height = section.offsetHeight;
                initNodes();
            }
            
            function initNodes() {
                nodes = [];
                const count = Math.min(conceptCards.length * 3, 30);
                
                for (let i = 0; i < count; i++) {
                    nodes.push({
                        x: Math.random() * neuralCanvas.width,
                        y: Math.random() * neuralCanvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        radius: 2 + Math.random() * 3,
                        pulsePhase: Math.random() * Math.PI * 2,
                        active: false
                    });
                }
            }
            
            function drawNetwork() {
                ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
                
                // Draw connections
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
                
                // Draw nodes
                nodes.forEach((node, i) => {
                    // Update position
                    node.x += node.vx;
                    node.y += node.vy;
                    
                    // Bounce off edges
                    if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;
                    
                    // Pulse effect
                    node.pulsePhase += 0.02;
                    const pulse = 1 + Math.sin(node.pulsePhase) * 0.3;
                    
                    // Draw node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = node.active 
                        ? 'rgba(244, 200, 86, 0.9)' 
                        : 'rgba(212, 168, 75, 0.6)';
                    ctx.fill();
                    
                    // Glow
                    if (node.active) {
                        ctx.shadowColor = 'rgba(212, 168, 75, 0.8)';
                        ctx.shadowBlur = 15;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                });
                
                animationFrame = requestAnimationFrame(drawNetwork);
            }
            
            // Activate nodes when hovering concept cards
            conceptCards.forEach((card, i) => {
                card.addEventListener('mouseenter', () => {
                    // Activate nearby nodes
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
            
            // Initialize
            if (neuralCanvas.parentElement) {
                resizeCanvas();
                window.addEventListener('resize', resizeCanvas);
                
                // Only animate when section is visible
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
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 15: CONSTELLATION PROGRESS
        // ═══════════════════════════════════════════════════════════════════════
        const constellationNav = document.getElementById('constellation-nav');
        
        if (constellationNav) {
            // Define sections to track
            const sections = [
                { id: 'hero', label: 'HOME' },
                { id: 'ideas', label: 'IDEAS' },
                { id: 'quotes', label: 'QUOTES' },
                { id: 'about', label: 'AUTHOR' },
                { id: 'reviews', label: 'REVIEWS' },
                { id: 'cta', label: 'GET BOOK' }
            ];
            
            // Build constellation
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
            
            // Click to scroll
            constellationNav.querySelectorAll('.constellation-star').forEach(star => {
                star.addEventListener('click', () => {
                    const sectionId = star.dataset.section;
                    const target = document.getElementById(sectionId) || 
                                   document.querySelector(`.${sectionId}-section`) ||
                                   document.querySelector(`[class*="${sectionId}"]`);
                    
                    if (target) {
                        if (lenis) {
                            lenis.scrollTo(target, { offset: -50 });
                        } else {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
            
            // Update on scroll
            const updateConstellation = () => {
                const scrollY = window.scrollY;
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
            
            // Show nav after scrolling past hero
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
            
            // Track mouse position
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                
                // Dot follows immediately
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            });
            
            // Ring follows with lag
            function animateRing() {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';
                
                requestAnimationFrame(animateRing);
            }
            animateRing();
            
            // Context-aware cursor states
            const hoverTargets = {
                link: 'a, .nav-link',
                button: 'button, .hero-cta, .cta-primary, .cta-secondary, .buy-btn',
                text: 'p, h1, h2, h3, h4, h5, h6, span, .quote-text'
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
            
            // Hide cursor when leaving window
            document.addEventListener('mouseleave', () => {
                cursorDot.style.opacity = '0';
                cursorRing.style.opacity = '0';
            });
            
            document.addEventListener('mouseenter', () => {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            });

            // ─────────────────────────────────────────────────────────────
            // GOLDEN TRAIL EFFECT (Phase 16 Extension)
            // ─────────────────────────────────────────────────────────────
            const trailCount = 12;
            const trails = [];
            
            for (let i = 0; i < trailCount; i++) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                document.body.appendChild(trail);
                trails.push(trail);
            }
            
            let trailIndex = 0;
            document.addEventListener('mousemove', (e) => {
                const trail = trails[trailIndex % trailCount];
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                trail.style.opacity = '0.5';
                
                setTimeout(() => {
                    trail.style.opacity = '0';
                }, 150);
                
                trailIndex++;
            }, { passive: true });
        }

        // ═══════════════════════════════════════════════════════════════════════
        // PHASE 17: QUANTUM ENTANGLEMENT PARTICLES
        // ═══════════════════════════════════════════════════════════════════════
        const QuantumField = {
            pairs: [],
            lines: [],
            
            init() {
                // Create 3 entangled pairs
                for (let i = 0; i < 3; i++) {
                    this.createPair();
                }
                
                this.animate();
            },
            
            createPair() {
                // Particle A
                const particleA = document.createElement('div');
                particleA.className = 'quantum-particle entangled';
                document.body.appendChild(particleA);
                
                // Particle B (entangled twin)
                const particleB = document.createElement('div');
                particleB.className = 'quantum-particle entangled';
                particleB.style.animationDelay = '0s'; // Synchronized pulse
                document.body.appendChild(particleB);
                
                // Connection line
                const line = document.createElement('div');
                line.className = 'quantum-line';
                document.body.appendChild(line);
                
                // Random starting positions
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
                        // B is always mirrored from A
                        x: 0,
                        y: 0
                    },
                    line: line
                };
                
                this.pairs.push(pair);
            },
            
            animate() {
                this.pairs.forEach(pair => {
                    // Move particle A
                    pair.a.x += pair.a.vx;
                    pair.a.y += pair.a.vy;
                    
                    // Bounce off edges
                    if (pair.a.x < 0 || pair.a.x > window.innerWidth * 0.4) pair.a.vx *= -1;
                    if (pair.a.y < 0 || pair.a.y > window.innerHeight) pair.a.vy *= -1;
                    
                    // Particle B is quantum entangled - mirrors A's position
                    pair.b.x = window.innerWidth - pair.a.x;
                    pair.b.y = pair.a.y; // Same Y, opposite X
                    
                    // Update positions
                    pair.a.el.style.left = pair.a.x + 'px';
                    pair.a.el.style.top = pair.a.y + 'px';
                    pair.b.el.style.left = pair.b.x + 'px';
                    pair.b.el.style.top = pair.b.y + 'px';
                    
                    // Update connecting line
                    const dx = pair.b.x - pair.a.x;
                    const dy = pair.b.y - pair.a.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    pair.line.style.left = pair.a.x + 'px';
                    pair.line.style.top = pair.a.y + 'px';
                    pair.line.style.width = length + 'px';
                    pair.line.style.transform = `rotate(${angle}deg)`;
                });
                
                requestAnimationFrame(() => this.animate());
            }
        };
        
        // Initialize quantum field
        if (window.innerWidth > 768) { // Desktop only
            setTimeout(() => QuantumField.init(), 2000);
        }

        // ─────────────────────────────────────────────────────────────────────
        // START
        // ─────────────────────────────────────────────────────────────────────
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

    })();
