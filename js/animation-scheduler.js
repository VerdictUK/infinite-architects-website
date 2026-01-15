/**
 * ANIMATION SCHEDULER - Phase-based animation loading
 * Controls when animations start to prevent all-at-once loading
 *
 * Phases:
 * 1. loader: Run during initial page load (only loader animations)
 * 2. ready: Run when loader completes (site-ready)
 * 3. heroVisible: Run when hero section is visible
 * 4. visible: Run when individual sections enter viewport
 */
const AnimationScheduler = {
    // Phase definitions with their trigger conditions
    phases: {
        loader: [],      // Run during initial page load (only loader animations)
        ready: [],       // Run when loader completes (site-ready)
        heroVisible: [], // Run when hero section is visible
        visible: []      // Run when individual sections enter viewport
    },

    // Track which phases have been triggered
    triggered: {
        loader: false,
        ready: false,
        heroVisible: false
    },

    // Track registered section observers
    sectionObservers: new Map(),

    // Stagger delay for animations within a phase (ms)
    staggerDelay: 150,

    /**
     * Schedule an animation for a specific phase
     * @param {Function} animation - The function to execute
     * @param {string} phase - 'loader', 'ready', 'heroVisible', or 'visible'
     * @param {Object} options - { delay, priority, name }
     */
    schedule(animation, phase, options = {}) {
        if (!this.phases[phase]) {
            console.warn('[AnimationScheduler] Unknown phase:', phase);
            return;
        }

        const entry = {
            init: animation,
            delay: options.delay || 0,
            priority: options.priority || 0,
            name: options.name || 'anonymous',
            executed: false
        };

        this.phases[phase].push(entry);

        // Sort by priority (higher priority = earlier execution)
        this.phases[phase].sort((a, b) => b.priority - a.priority);

        // If phase already triggered, execute immediately with delay
        if (this.triggered[phase] && phase !== 'visible') {
            this._executeEntry(entry);
        }
    },

    /**
     * Schedule a section-based animation (triggers when section enters viewport)
     * @param {string} sectionSelector - CSS selector for the section
     * @param {Function} animation - The function to execute
     * @param {Object} options - { delay, name }
     */
    scheduleForSection(sectionSelector, animation, options = {}) {
        const entry = {
            selector: sectionSelector,
            init: animation,
            delay: options.delay || 0,
            name: options.name || 'section-animation',
            executed: false
        };

        this.phases.visible.push(entry);
    },

    /**
     * Trigger a phase - executes all scheduled animations for that phase
     * @param {string} phase - The phase to trigger
     */
    trigger(phase) {
        if (!this.phases[phase]) {
            console.warn('[AnimationScheduler] Unknown phase:', phase);
            return;
        }

        if (this.triggered[phase]) {
            return; // Already triggered
        }

        this.triggered[phase] = true;
        console.log('[AnimationScheduler] Triggering phase:', phase);

        const entries = this.phases[phase];
        let staggerOffset = 0;

        entries.forEach((entry) => {
            if (!entry.executed) {
                const totalDelay = entry.delay + staggerOffset;
                setTimeout(() => this._executeEntry(entry), totalDelay);
                staggerOffset += this.staggerDelay;
            }
        });
    },

    /**
     * Execute a single animation entry
     * @private
     */
    _executeEntry(entry) {
        if (entry.executed) return;
        entry.executed = true;

        try {
            if (typeof entry.init === 'function') {
                entry.init();
                console.log('[AnimationScheduler] Executed:', entry.name);
            }
        } catch (error) {
            console.error('[AnimationScheduler] Error in', entry.name, ':', error.message);
        }
    },

    /**
     * Set up IntersectionObserver for section-based animations
     */
    initSectionObservers() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: execute all visible-phase animations immediately
            this.phases.visible.forEach(entry => this._executeEntry(entry));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(observerEntry => {
                if (observerEntry.isIntersecting) {
                    // Find and execute matching animations
                    this.phases.visible.forEach(animEntry => {
                        if (!animEntry.executed && observerEntry.target.matches(animEntry.selector)) {
                            setTimeout(() => this._executeEntry(animEntry), animEntry.delay);
                        }
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections that have scheduled animations
        const selectors = new Set(this.phases.visible.map(e => e.selector));
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => observer.observe(el));
        });

        this.sectionObservers.set('main', observer);
    },

    /**
     * Helper: Wait for hero to be visible, then trigger heroVisible phase
     */
    watchHeroVisibility() {
        const hero = document.getElementById('hero');
        if (!hero) {
            // No hero section, trigger immediately when ready
            if (this.triggered.ready) {
                this.trigger('heroVisible');
            }
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.trigger('heroVisible');
                    observer.disconnect();
                }
            }, { threshold: 0.3 });
            observer.observe(hero);
        } else {
            // Fallback: trigger after ready phase
            if (this.triggered.ready) {
                this.trigger('heroVisible');
            }
        }
    }
};

// Make AnimationScheduler globally available
window.AnimationScheduler = AnimationScheduler;

// ═══════════════════════════════════════════════════════════════════════
// AUTO-INTEGRATION WITH LOADER COMPLETION
// Listen for cinematic-ready class or custom event to trigger ready phase
// ═══════════════════════════════════════════════════════════════════════
(function autoIntegrate() {
    // Method 1: Watch for cinematic-ready class on body (loader completion indicator)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (document.body.classList.contains('cinematic-ready') && !AnimationScheduler.triggered.ready) {
                    console.log('[AnimationScheduler] Detected cinematic-ready - triggering ready phase');
                    AnimationScheduler.trigger('ready');
                    AnimationScheduler.watchHeroVisibility();
                    AnimationScheduler.initSectionObservers();
                    observer.disconnect();
                }
            }
        }
    });

    // Start observing if body exists
    if (document.body) {
        // Check if already cinematic-ready (late script load)
        if (document.body.classList.contains('cinematic-ready')) {
            console.log('[AnimationScheduler] Already cinematic-ready - triggering immediately');
            AnimationScheduler.trigger('ready');
            AnimationScheduler.watchHeroVisibility();
            AnimationScheduler.initSectionObservers();
        } else {
            observer.observe(document.body, { attributes: true });
        }
    } else {
        // Wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body.classList.contains('cinematic-ready')) {
                AnimationScheduler.trigger('ready');
                AnimationScheduler.watchHeroVisibility();
                AnimationScheduler.initSectionObservers();
            } else {
                observer.observe(document.body, { attributes: true });
            }
        });
    }

    // Method 2: Fallback timeout - if loader takes too long or fails, trigger anyway
    setTimeout(() => {
        if (!AnimationScheduler.triggered.ready) {
            console.log('[AnimationScheduler] Timeout fallback - triggering ready phase');
            AnimationScheduler.trigger('ready');
            AnimationScheduler.watchHeroVisibility();
            AnimationScheduler.initSectionObservers();
            observer.disconnect();
        }
    }, 20000); // 20 second fallback
})();

// Log initialization
console.log('[AnimationScheduler] Module loaded');
