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

        console.log('[SLIDESHOW] Navigation Active:', sections.length, 'sections');
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

    // ─────────────────────────────────────────────────────────────────────
    // START
    // ─────────────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
