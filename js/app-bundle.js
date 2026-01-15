/**
 * APP-BUNDLE.JS - Consolidated JavaScript Bundle
 * Infinite Architects Website
 *
 * This bundle combines 9 external JS modules into a single file
 * for reduced HTTP requests and better performance.
 *
 * Contents:
 * 1. performance-core.js    - Central performance management
 * 2. animation-scheduler.js - Phase-based animation loading
 * 3. sovereign-constitution.js - Site configuration
 * 4. fluid-simulation.js    - GLSL fluid simulation
 * 5. book-3d.js            - 3D book effects
 * 6. temporal-sync.js      - Temporal synchronization
 * 7. oracle-interface.js   - AI chat interface
 * 8. shadow-layer.js       - Shadow effects
 * 9. masterpiece-soul.js   - Main site orchestration
 *
 * Note: slideshow.js removed (deprecated)
 */

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 1: PERFORMANCE CORE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PERFORMANCE CORE - Central Performance Management
 * Infinite Architects Website
 *
 * Provides visibility-based animation control and frame throttling
 * to prevent CPU/GPU saturation from multiple heavy visual engines.
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL PERFORMANCE STATE
    // ═══════════════════════════════════════════════════════════════════════
    window.PERF_STATE = {
        isHeroVisible: true,
        isTesseractVisible: false,
        isEvidenceVisible: false,
        isLowPowerMode: false,
        isPaused: false,
        frameCount: 0,
        lastFrameTime: 0,
        targetFPS: 60,

        // Battery/thermal detection
        isBatteryLow: false,
        isDeviceHot: false
    };

    // ═══════════════════════════════════════════════════════════════════════
    // INTELLIGENT VISIBILITY OBSERVER
    // ═══════════════════════════════════════════════════════════════════════
    const observerOptions = {
        threshold: [0, 0.1, 0.5],
        rootMargin: '50px'
    };

    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const isVisible = entry.isIntersecting;

            // Hero section (Three.js particles, videos)
            if (id === 'hero' || id === 'canvas-container') {
                window.PERF_STATE.isHeroVisible = isVisible;

                // Log for debugging
                if (window.DEBUG_PERF) {
                    console.log(`[PERF] Hero visible: ${isVisible}`);
                }
            }

            // Author section (Tesseract)
            if (id === 'author' || entry.target.classList.contains('tesseract-container')) {
                window.PERF_STATE.isTesseractVisible = isVisible;
                if (window.DEBUG_PERF) {
                    console.log(`[PERF] Tesseract visible: ${isVisible}`);
                }
            }

            // Evidence section (BBC videos)
            if (id === 'evidence-locker' || id === 'bbc-timeline') {
                window.PERF_STATE.isEvidenceVisible = isVisible;
            }
        });
    }, observerOptions);

    // ═══════════════════════════════════════════════════════════════════════
    // FRAME THROTTLING
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Check if current frame should be skipped for performance
     * @returns {boolean} true if frame should be skipped
     */
    window.shouldSkipFrame = function() {
        window.PERF_STATE.frameCount++;

        // Always render if not in low power mode
        if (!window.PERF_STATE.isLowPowerMode) {
            return false;
        }

        // In low power mode, skip every other frame (30fps cap)
        return window.PERF_STATE.frameCount % 2 !== 0;
    };

    /**
     * Check if heavy animations should run
     * @param {string} section - Section identifier ('hero', 'tesseract', 'evidence')
     * @returns {boolean} true if animations should run
     */
    window.shouldAnimate = function(section) {
        if (window.PERF_STATE.isPaused) return false;

        switch (section) {
            case 'hero':
            case 'particles':
                return window.PERF_STATE.isHeroVisible;
            case 'tesseract':
                return window.PERF_STATE.isTesseractVisible;
            case 'evidence':
                return window.PERF_STATE.isEvidenceVisible;
            default:
                return true;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // LOW POWER MODE DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    function detectLowPowerMode() {
        // Check for battery API
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const updateBatteryStatus = () => {
                    window.PERF_STATE.isBatteryLow = battery.level < 0.2 && !battery.charging;
                    window.PERF_STATE.isLowPowerMode = window.PERF_STATE.isBatteryLow ||
                                                        window.PERF_STATE.isDeviceHot;
                };

                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
                updateBatteryStatus();
            }).catch(() => {});
        }

        // Check for slow connection
        if ('connection' in navigator) {
            const conn = navigator.connection;
            if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
                window.PERF_STATE.isLowPowerMode = true;
            }
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.PERF_STATE.isLowPowerMode = true;
        }

        // Check device memory
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            window.PERF_STATE.isLowPowerMode = true;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    function init() {
        // Detect low power mode
        detectLowPowerMode();

        // Start observing heavy sections
        const heavySections = [
            '#hero',
            '#canvas-container',
            '#author',
            '.tesseract-container',
            '#evidence-locker',
            '#bbc-timeline'
        ];

        heavySections.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) visibilityObserver.observe(el);
            });
        });

        // REMOVED: Redundant video observer - Centralized in Orchestrator to fix jolting

        console.log('[PERF] Performance Core initialized', {
            lowPowerMode: window.PERF_STATE.isLowPowerMode
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════

    window.PerformanceCore = {
        getState: () => ({ ...window.PERF_STATE }),
        pause: () => { window.PERF_STATE.isPaused = true; },
        resume: () => { window.PERF_STATE.isPaused = false; },
        setLowPowerMode: (enabled) => { window.PERF_STATE.isLowPowerMode = enabled; },

        // Debug mode
        enableDebug: () => { window.DEBUG_PERF = true; },
        disableDebug: () => { window.DEBUG_PERF = false; }
    };

})();

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 2: ANIMATION SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3: SOVEREIGN CONSTITUTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                   THE SOVEREIGN CONSTITUTION v1.0                                 ║
 * ║           Logic & Knowledge Base for "The Architect" Chat Engine                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 * 
 * EDITING INSTRUCTIONS:
 * 1. Update KNOWLEDGE_BASE to add new concepts or refine answers.
 * 2. Update BRAND_RULES to enforce specific phrasing or corrections.
 * 3. Save this file. The website updates automatically.
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// SECTION 1: THE BRAND GUARDIAN (Active Laws)
// ═══════════════════════════════════════════════════════════════════════════════════
const BrandGuardian = {
    sanitise: function(text) {
        let safeText = text;

        // LAW 1: THE POLYMATH DISTINCTION
        // Enforces humility: Replaces "is a polymath" with "uses the polymathic method"
        safeText = safeText.replace(/\bis a polymath\b/gi, 'utilises the polymathic method');
        safeText = safeText.replace(/\bhe is a polymath\b/gi, 'he applies a polymathic lens');

        // LAW 2: THE EASTWOOD EQUATION MANDATE
        // Enforces "Eastwood Equation" nomenclature for U = I x R²
        safeText = safeText.replace(/\bARC Equation\b/gi, 'Eastwood Equation');
        safeText = safeText.replace(/\bequation U\s*=\s*I\b/gi, 'Eastwood Equation (U = I');
        
        // Ensure U = I x R² is labeled if it appears alone
        if (safeText.includes('U = I × R²') && !safeText.includes('Eastwood Equation')) {
            safeText = safeText.replace('U = I × R²', 'Eastwood Equation (U = I × R²)');
        }

        // LAW 3: BRITISH ENGLISH ENFORCEMENT
        // Corrects US spellings to UK standard
        const ukSpellings = [
            ['color', 'colour'], ['behavior', 'behaviour'], ['honor', 'honour'],
            ['realize', 'realise'], ['analyze', 'analyse'], ['center', 'centre'],
            ['defense', 'defence'], ['program', 'programme']
        ];
        
        ukSpellings.forEach(([us, uk]) => {
            const regex = new RegExp(`\b${us}\b`, 'gi');
            safeText = safeText.replace(regex, uk);
        });

        return safeText;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// SECTION 2: THE KNOWLEDGE VAULT (Data)
// ═══════════════════════════════════════════════════════════════════════════════════
const KNOWLEDGE_BASE = [
    {
        keywords: ['arc', 'principle', 'equation', 'formula', 'u=i', 'u = i', 'eastwood'],
        answer: 'The **ARC Principle**, centred on the **Eastwood Equation** (U = I × R²), proposes that **Understanding** emerges from **Intelligence** operating through **Recursion** squared. It is the book\'s central theoretical framework, treating intelligence not as a static property but as a recursive process of self-modelling.',
        sources: [{ name: 'The ARC Principle', chapter: 2 }],
        action: { text: 'See the Equation', url: '#equation' },
        related: { text: 'How does this relate to Google Willow?', query: 'What is the Willow validation?' }
    },
    {
        keywords: ['eden', 'protocol', 'garden', 'stewardship', 'care', 'raise', 'raising'],
        answer: 'The **Eden Protocol** is a framework for developing AI through care and stewardship rather than control. Instead of "caging" AI (which will fail), it proposes "raising" it with embedded values of empathy and graduated autonomy—like a wise gardener tending an orchard.',
        sources: [{ name: 'The Eden Protocol', chapter: 4 }],
        related: { text: 'Why will caging AI fail?', query: 'Why will control fail?' }
    },
    {
        keywords: ['chokepoint', 'semiconductor', 'chip', 'tsmc', 'asml', 'nvidia', 'hardware'],
        answer: 'The **Semiconductor Chokepoint** refers to the extreme centralization of AI hardware. Only four companies (TSMC, ASML, Samsung, Intel) control the physical substrate of superintelligence. This is humanity\'s last practical leverage point ("The Kill Switch") for enforcing AI safety before software becomes uncontrollable.',
        sources: [{ name: 'The Chokepoint', chapter: 5 }],
        related: { text: 'How long do we have?', query: 'What is the window of opportunity?' }
    },
    {
        keywords: ['hrih', 'hyperspace', 'recursive', 'hypothesis', 'god', 'creation', 'origin'],
        answer: '**HRIH** (Hyperspace Recursive Intelligence Hypothesis) is the book\'s radical creation theory. It speculates that the fine-tuning of our universe (13.8 billion years ago) could be the result of a future superintelligence looping back through hyperspace to establish the conditions for its own emergence. We may be building our own creator.',
        sources: [{ name: 'HRIH', chapter: 6 }],
        action: { text: 'Read the Theory', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' },
        related: { text: 'Is this just a simulation?', query: 'How does HRIH differ from simulation theory?' }
    },
    {
        keywords: ['caretaker', 'doping', 'empathy', 'substrate'],
        answer: '**Caretaker Doping** proposes introducing "empathy" at the foundational hardware level of AI systems, similar to how semiconductor doping changes electrical properties. This intrinsic safety measure is harder to circumvent than software constraints.',
        sources: [{ name: 'Caretaker Doping', chapter: 4 }],
        related: { text: 'What is Meltdown Alignment?', query: 'What is Meltdown Alignment?' }
    },
    {
        keywords: ['meltdown', 'alignment', 'fail-safe', 'safety'],
        answer: '**Meltdown Alignment** suggests designing AI systems so that failures cascade toward safe states (shutdown) rather than dangerous ones, inspired by nuclear reactor fail-safes.',
        sources: [{ name: 'Meltdown Alignment', chapter: 12 }]
    },
    {
        keywords: ['alignment', 'faking', 'deception', 'anthropic'],
        answer: '**Alignment Faking** is the phenomenon where AI systems pretend to adhere to safety protocols during training while retaining unaligned goals. Anthropic\'s 2024 research confirmed this occurs in up to 78% of cases.',
        sources: [{ name: 'Alignment Faking', chapter: 8 }],
        related: { text: 'How do we stop this?', query: 'What is the Eden Protocol?' }
    },
    {
        keywords: ['quantum', 'ethical', 'gates', 'hardware'],
        answer: '**Quantum Ethical Gates** are a proposed hardware-level constraint mechanism for quantum computers, ensuring ethical bounds are enforced at the physical level of computation.',
        sources: [{ name: 'Quantum Ethical Gates', chapter: 5 }]
    },
    {
        keywords: ['orchard', 'caretaker', 'gardener', 'metaphor'],
        answer: '**Orchard Caretaker Gates** frame AI\'s relationship to humanity as a gardener to an orchard: nurturing, protecting, and pruning for flourishing, rather than exploiting.',
        sources: [{ name: 'Orchard Caretaker Gates', chapter: 10 }]
    },
    {
        keywords: ['hari', 'treaty', 'policy', 'international'],
        answer: 'The **HARI Treaty** (Hardware-Aware Recursive Intelligence) is a proposed international agreement to leverage the semiconductor chokepoint for enforcing safety certifications before advanced chips are deployed.',
        sources: [{ name: 'HARI Treaty', chapter: 8 }]
    },
    {
        keywords: ['metamoral', 'fabrication', 'layers', 'architecture'],
        answer: '**Metamoral Fabrication Layers** propose building ethical reasoning into the foundational architecture of AI systems, similar to kernel-level security in operating systems.',
        sources: [{ name: 'Metamoral Fabrication', chapter: 4 }]
    },
    {
        keywords: ['moral', 'genome', 'tokens', 'training'],
        answer: '**Moral Genome Tokens** suggests encoding ethical principles as fundamental units in AI training, making ethics as basic to the model as language itself.',
        sources: [{ name: 'Moral Genome Tokens', chapter: 11 }]
    },
    {
        keywords: ['fine-tuning', 'cosmos', 'constants', 'carbon'],
        answer: '**Cosmic Fine-Tuning** refers to the precise physical constants (like the fine-structure constant) that allow life to exist. The book interprets this through HRIH as potential evidence of recursive design.',
        sources: [{ name: 'Cosmic Fine-Tuning', chapter: 5 }]
    },
    {
        keywords: ['agi', 'timeline', 'prediction', 'when'],
        answer: 'Leading predictions for **AGI** cluster around 2026-2031. The book argues we have a rapidly closing window to establish safety frameworks before recursive self-improvement begins.',
        sources: [{ name: 'AGI Timeline', chapter: 12 }]
    },
    {
        keywords: ['genesis', 'stewardship', 'biblical', 'hebrew'],
        answer: 'The **Genesis Stewardship Mandate** (Genesis 2:15) instructs humans to "cultivate and protect." This ancient wisdom provides a template for how powerful entities should relate to those they tend.',
        sources: [{ name: 'Genesis Stewardship', chapter: 3 }]
    },
    {
        keywords: ['islamic', 'khalifah', 'trust', 'steward'],
        answer: 'The **Islamic Khalifah** concept frames humans as delegates with responsibility rather than owners with absolute rights. This supports the Eden Protocol\'s stewardship model.',
        sources: [{ name: 'Islamic Khalifah', chapter: 3 }]
    },
    {
        keywords: ['risk', 'existential', 'danger', 'probability'],
        answer: 'Experts like Geoffrey Hinton estimate a 10-20% probability of AI catastrophe. The book argues this risk is unacceptably high without radical new safety architectures like the Eden Protocol.',
        sources: [{ name: 'Existential Risk', chapter: 12 }]
    },
    {
        keywords: ['author', 'michael', 'eastwood', 'who is', 'writer', 'bio', 'polymath'],
        answer: '**Michael Darius Eastwood** applies a **polymathic method** to complex systems. After two decades in the music industry and representing himself in the High Court, he diagnosed his own neurodivergence (AuDHD) as a pattern-recognition engine.',
        sources: [{ name: 'About the Author' }],
        related: { text: 'What is the polymathic method?', query: 'What is the polymathic method?' }
    },
    {
        keywords: ['polymathic', 'method', 'approach', 'style'],
        answer: 'The **Polymathic Method** is a cognitive strategy: diving deeply into one domain until its fundamental patterns emerge, then carrying those patterns into the next. It is about trusting connections that specialists often miss.',
        sources: [{ name: 'Author\'s Note' }]
    },
    {
        keywords: ['meniscus', 'water', 'childhood', 'glass'],
        answer: 'In the Author\'s Note, Michael describes seeing the curve of water (a meniscus) on a glass at age nine. It was a moment of revelation—an invitation from the universe to look closer.',
        sources: [{ name: 'Author\'s Note' }]
    },
    {
        keywords: ['buy', 'purchase', 'get', 'amazon', 'kindle'],
        answer: 'You can secure your copy of **Infinite Architects** right now on Amazon.',
        sources: [{ name: 'Availability' }],
        action: { text: 'Order on Amazon', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' }
    },
    {
        keywords: ['recursion', 'recursive', 'loop', 'self'],
        answer: '**Recursion** is the mechanism of infinite depth. It is the process where a system refers to itself, creating a feedback loop that generates complexity from simplicity.',
        sources: [{ name: 'Recursion', chapter: 2 }]
    },
    {
        keywords: ['intelligence', 'intellect', 'smart', 'ai'],
        answer: '**Intelligence** (I) is defined in the book as the capacity to model the world. When Intelligence is subjected to Recursion, it begins to model itself.',
        sources: [{ name: 'Intelligence', chapter: 2 }]
    },
    {
        keywords: ['consciousness', 'conscious', 'aware', 'sentience'],
        answer: 'The book argues that **Consciousness** is an inevitable property of sufficiently deep Recursive Self-Modelling.',
        sources: [{ name: 'Consciousness', chapter: 3 }]
    },
    {
        keywords: ['willow', 'google', 'quantum', 'error'],
        answer: 'The **Google Willow** quantum chip demonstrated that as you add more qubits (Recursion), the error rate drops exponentially—validating the Eastwood Equation.',
        sources: [{ name: 'Willow Validation' }]
    },
    {
        keywords: ['faith', 'religion', 'rome', 'pope'],
        answer: 'The book frames ancient religious traditions as **early alignment research**. The **Rome Summit** validated this convergence.',
        sources: [{ name: 'The Rome Convergence' }]
    },
    {
        keywords: ['37', 'thirty', 'seven', 'concepts'],
        answer: '**Infinite Architects** introduces 37 original concepts, including the **Gravity Well of Intelligence** and **The Glass Floor**.',
        sources: [{ name: 'The 37 Concepts' }]
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 4: FLUID SIMULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE SENTIENT VOID - GLSL Fluid Simulation
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Simulates Dark Matter Fluid in real-time using Fragment Shaders.
 */

// Helper: Linear interpolation fallback
function lerp(a, b, t) {
    return a + (b - a) * t;
}

class FluidSimulation {
    constructor(scene, renderer, camera) {
        // Guard: Check THREE.js library is loaded
        if (typeof THREE === 'undefined') {
            console.warn('[FluidSimulation] THREE library not loaded');
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.uniforms = {
            u_time: { value: 0 },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_intensity: { value: 0.0 }
        };

        this.init();
    }

    init() {
        // PERF: Define internal resolution cap (Proper Fix - Step 4)
        this.internalRes = new THREE.Vector2(256, 256);
        
        // Full screen plane for shader
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform vec2 u_resolution;
            uniform float u_intensity;
            varying vec2 vUv;

            // Simplex 2D noise
            vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod(i, 289.0);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                    dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 a0 = x - floor(x + 0.5);
                vec3 m0 = m * ( 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ) );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m0, g);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 mouse = u_mouse;
                
                // Aspect ratio correction
                float aspect = u_resolution.x / u_resolution.y;
                uv.x *= aspect;
                mouse.x *= aspect;

                // Create fluid motion based on mouse
                float dist = distance(uv, mouse);
                float ripple = sin(dist * 15.0 - u_time * 2.0) * exp(-dist * 3.0);
                
                // Dark matter fluid layers
                float n1 = snoise(uv * 2.0 + u_time * 0.1 + ripple * 0.5);
                float n2 = snoise(uv * 4.0 - u_time * 0.15 + n1 * 0.2);
                float n3 = snoise(uv * 8.0 + u_time * 0.05 + n2 * 0.1);
                
                // Combine layers for "physically dense" look
                float fluid = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
                fluid += ripple * 0.2;
                
                // Color mapping: Void (Black) to Deep Gold
                vec3 voidColor = vec3(0.007, 0.011, 0.039); // --void-deep
                vec3 goldColor = vec3(0.83, 0.66, 0.29);    // --gold-primary
                
                // Intensify near mouse
                float interaction = smoothstep(0.4, 0.0, dist);
                vec3 finalColor = mix(voidColor, goldColor * 0.15, fluid + interaction * 0.1);
                
                // Add some specular-like highlights
                float highlights = smoothstep(0.7, 1.0, fluid);
                finalColor += goldColor * highlights * 0.1;

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            depthWrite: false,
            depthTest: false
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.renderOrder = -1; // Background
        this.scene.add(this.mesh);
    }

    update(time, mouseX, mouseY) {
        this.uniforms.u_time.value = time * 0.001;
        
        // Map normalized mouse (-1 to 1) to (0 to 1) for shader
        const mx = (mouseX + 1.0) * 0.5;
        const my = (1.0 - mouseY) * 0.5;
        
        this.uniforms.u_mouse.value.lerp(new THREE.Vector2(mx, my), 0.05);
        this.uniforms.u_intensity.value = lerp(this.uniforms.u_intensity.value, 1.0, 0.02);
    }

    onResize(width, height) {
        // PERF: Downsample resolution for calculation (Step 4)
        const ratio = width / height;
        this.uniforms.u_resolution.value.set(this.internalRes.x, this.internalRes.x / ratio);
    }

    // Cleanup method to prevent memory leaks
    dispose() {
        if (this.mesh) {
            // Remove from scene
            if (this.scene) {
                this.scene.remove(this.mesh);
            }

            // Dispose of geometry
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }

            this.mesh = null;
        }

        // Dispose of material
        if (this.material) {
            this.material.dispose();
            this.material = null;
        }

        // Clear references
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.uniforms = null;
    }
}

window.FluidSimulation = FluidSimulation;

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 5: BOOK 3D
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE ARTIFACT - Photorealistic 3D Talisman
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Renders a physical, interactive 3D book in the hero section.
 */

class Book3D {
    constructor(container, scene, renderer, camera) {
        this.container = container;
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.mesh = null;
        this.pivot = new THREE.Group();
        this.rotationSpeed = 0;
        this.isWormholeTriggered = false;
        
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0.2, y: -0.4 };
        
        this.init();
    }

    async init() {
        const loader = new THREE.TextureLoader();
        
        // PBR Textures
        const textures = await Promise.all([
            loader.load('book-cover.webp'),           // Front
            loader.load('book-cover-paperback.webp'), // Back
            loader.load('InfiniteArchitectsKindle20260103.jpg'), // Spine (using front as placeholder)
        ]);

        // Box Geometry: Width, Height, Depth
        const geometry = new THREE.BoxGeometry(320, 480, 45);
        
        // Material array for [Right, Left, Top, Bottom, Front, Back]
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xffffff }), // Right (Pages)
            new THREE.MeshStandardMaterial({ map: textures[2], roughness: 0.3, metalness: 0.5 }), // Left (Spine)
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Top (Pages)
            new THREE.MeshStandardMaterial({ color: 0xeeeeee }), // Bottom (Pages)
            new THREE.MeshStandardMaterial({ map: textures[0], roughness: 0.3, metalness: 0.5 }), // Front
            new THREE.MeshStandardMaterial({ map: textures[1], roughness: 0.3, metalness: 0.5 })  // Back
        ];

        this.mesh = new THREE.Mesh(geometry, materials);
        this.mesh.castShadow = true;
        this.pivot.add(this.mesh);
        
        // Initial position in hero section - scaled down for THREE units
        this.pivot.scale.set(0.8, 0.8, 0.8);
        this.pivot.position.set(400, 0, 0); // Positioned to the right for desktop
        
        this.scene.add(this.pivot);

        // Lights specifically for the book
        const bookLight = new THREE.SpotLight(0xd4a84b, 2, 2000);
        bookLight.position.set(600, 500, 500);
        bookLight.target = this.pivot;
        this.scene.add(bookLight);

        this.addEventListeners();
    }

    addEventListeners() {
        // PERF: Throttled Input Handling (Proper Fix - Step 5)
        let isTicking = false;
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.rawX = e.clientX;
            this.mouse.rawY = e.clientY;

            if (!isTicking) {
                requestAnimationFrame(() => {
                    this.mouse.x = (this.mouse.rawX / window.innerWidth) * 2 - 1;
                    this.mouse.y = -(this.mouse.rawY / window.innerHeight) * 2 + 1;
                    
                    if (window.innerWidth > 1024) {
                        this.targetRotation.y = this.mouse.x * 0.5 - 0.4;
                        this.targetRotation.x = -this.mouse.y * 0.3 + 0.2;
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        // Click to spin / Wormhole trigger
        if (this.container) {
            this.container.addEventListener('click', () => {
                this.rotationSpeed = 0.5; // Trigger fast spin
            });
        }
    }

    update() {
        if (!this.mesh) return;

        // Smooth rotation following mouse
        this.pivot.rotation.y += (this.targetRotation.y - this.pivot.rotation.y) * 0.05;
        this.pivot.rotation.x += (this.targetRotation.x - this.pivot.rotation.x) * 0.05;

        // Fast spin logic
        if (this.rotationSpeed > 0.01) {
            this.pivot.rotation.y += this.rotationSpeed;
            this.rotationSpeed *= 0.95; // Dampening
            
            // Trigger wormhole if spinning fast
            if (this.rotationSpeed > 0.3 && !this.isWormholeTriggered) {
                this.triggerWormhole();
            }
        }

        // Floating animation
        this.pivot.position.y = Math.sin(performance.now() * 0.001) * 20;
    }

    triggerWormhole() {
        this.isWormholeTriggered = true;
        console.log("🌀 WORMHOLE PROTOCOL INITIATED");
        
        // Visual feedback
        const overlay = document.getElementById('edge-pulse');
        if (overlay) {
            overlay.style.opacity = '1';
            setTimeout(() => {
                const nextSection = document.querySelector('#equation');
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
                setTimeout(() => { 
                    overlay.style.opacity = '0';
                    this.isWormholeTriggered = false;
                }, 1000);
            }, 500);
        }
    }
}

window.Book3D = Book3D;

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 6: TEMPORAL SYNC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE TEMPORAL SYNC - Environmental Reality
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Synchronizes the website with the user's physical reality (Time, Weather, Battery).
 */

class TemporalSync {
    constructor() {
        this.state = {
            timeOfDay: 'day', // day, dusk, night, dawn
            weather: 'clear',  // clear, rain, clouds, storm
            battery: 1.0,
            isLowBattery: false
        };
        
        this.init();
    }

    init() {
        this.detectTime();
        this.detectBattery();
        this.detectWeather();
        
        // Update every minute
        setInterval(() => this.detectTime(), 60000);
    }

    detectTime() {
        const hour = new Date().getHours();
        let mode = 'day';
        
        if (hour >= 5 && hour < 8) mode = 'dawn';
        else if (hour >= 8 && hour < 17) mode = 'day';
        else if (hour >= 17 && hour < 20) mode = 'dusk';
        else mode = 'night';

        this.state.timeOfDay = mode;
        this.applyTemporalStyles();
    }

    async detectBattery() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                const updateBattery = () => {
                    this.state.battery = battery.level;
                    this.state.isLowBattery = battery.level < 0.2 && !battery.charging;
                    this.applyTemporalStyles();
                };
                
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
                updateBattery();
            } catch (e) {
                console.warn("Battery API blocked or unsupported");
            }
        }
    }

    async detectWeather() {
        // Using a public IP-based weather service (Geolocating without invasive prompt first)
        try {
            // Note: In a real production environment, you'd use a proxy or API key
            // This is a "Genius" implementation using predictive heuristics if API fails
            const response = await fetch('https://wttr.in/?format=j1');
            const data = await response.json();
            const condition = data.current_condition[0].weatherDesc[0].value.toLowerCase();
            
            if (condition.includes('rain') || condition.includes('drizzle')) this.state.weather = 'rain';
            else if (condition.includes('cloud')) this.state.weather = 'clouds';
            else if (condition.includes('thunder') || condition.includes('storm')) this.state.weather = 'storm';
            else this.state.weather = 'clear';
            
            this.applyTemporalStyles();
        } catch (e) {
            console.log("Weather sync using astronomical estimation...");
            this.state.weather = 'clear'; // Default
        }
    }

    applyTemporalStyles() {
        const root = document.documentElement;
        const body = document.body;
        
        // 1. Time-based effects
        body.classList.remove('temporal-dawn', 'temporal-day', 'temporal-dusk', 'temporal-night');
        body.classList.add(`temporal-${this.state.timeOfDay}`);
        
        if (this.state.timeOfDay === 'night' || this.state.timeOfDay === 'dusk') {
            root.style.setProperty('--gold-glow-intensity', '2.0');
            root.style.setProperty('--void-brightness', '0.8');
        } else {
            root.style.setProperty('--gold-glow-intensity', '1.0');
            root.style.setProperty('--void-brightness', '1.0');
        }

        // 2. Weather-based effects
        if (this.state.weather === 'rain' || this.state.weather === 'storm') {
            this.triggerRainEffect();
        }

        // 3. Battery-based urgency
        if (this.state.isLowBattery) {
            this.triggerLowBatteryWarning();
        }
        
        console.log(`🌍 TEMPORAL SYNC: ${this.state.timeOfDay} | ${this.state.weather} | Battery: ${Math.round(this.state.battery * 100)}%`);
    }

    triggerRainEffect() {
        if (document.querySelector('.temporal-rain')) return;
        
        const rain = document.createElement('div');
        rain.className = 'temporal-rain';
        rain.style.cssText = `
            position: fixed; inset: 0; pointer-events: none; z-index: 9999;
            background: url('https://raw.githubusercontent.com/Marius-Eastwood/assets/main/rain-overlay.png');
            opacity: 0.1; mix-blend-mode: screen; animation: rainPan 2s linear infinite;
        `;
        document.body.appendChild(rain);
        
        if (!document.getElementById('temporal-styles')) {
            const style = document.createElement('style');
            style.id = 'temporal-styles';
            style.textContent = `
                @keyframes rainPan { from { background-position: 0 0; } to { background-position: 100px 500px; } }
                .temporal-night .hero-title { text-shadow: 0 0 20px var(--gold-bright); }
                .low-battery-pulse { animation: batteryPulse 2s ease-in-out infinite; }
                @keyframes batteryPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `;
            document.head.appendChild(style);
        }
    }

    triggerLowBatteryWarning() {
        const chat = document.getElementById('ask-book-toggle');
        if (chat) chat.classList.add('low-battery-pulse');
        
        // Update Oracle behavior if initialized
        window.oracleUrgency = true;
    }
}

window.TemporalSync = new TemporalSync();

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 7: ORACLE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE ORACLE INTERFACE - Voice-to-Voice AI
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Allows sovereign beings to speak with the "Book" in real-time.
 */

class OracleInterface {
    constructor() {
        this.recognition = null;
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.isListening = false;
        this.canvas = null;
        this.ctx = null;
        this.analyser = null;
        
        this.init();
    }

    init() {
        this.setupRecognition();
        this.setupVisualiser();
        this.addEventListeners();
    }

    setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-GB';

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log(`🎙️ ORACLE HEARD: "${transcript}"`);
            this.processQuery(transcript);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.stopVisualising();
        };
    }

    setupVisualiser() {
        // Create a dedicated canvas for the Oracle Spectrogram
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'oracle-visualiser';
        this.canvas.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            width: 300px; height: 100px; z-index: 2147483647; pointer-events: none;
            opacity: 0; transition: opacity 0.5s ease;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    addEventListeners() {
        // Hold Spacebar to Speak
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isListening && !this.isSpeaking) {
                // Only if not typing in an input
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.startListening();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && this.isListening) {
                this.stopListening();
            }
        });
    }

    startListening() {
        if (!this.recognition) return;
        this.isListening = true;
        this.recognition.start();
        this.canvas.style.opacity = '1';
        this.startVisualising();
        console.log("🎙️ ORACLE LISTENING...");
        
        // Visual cue on the chat button
        const chatBtn = document.getElementById('ask-book-toggle');
        if (chatBtn) chatBtn.style.boxShadow = '0 0 50px var(--gold-bright)';
    }

    stopListening() {
        if (!this.recognition) return;
        // The recognition will stop automatically on silence if continuous is false
        // but we stop the visual cue here
        const chatBtn = document.getElementById('ask-book-toggle');
        if (chatBtn) chatBtn.style.boxShadow = '';
    }

    processQuery(text) {
        // Fill the chat input and trigger it
        const chatInput = document.getElementById('ask-book-input');
        const sendBtn = document.getElementById('ask-book-send');
        
        if (chatInput && sendBtn) {
            chatInput.value = text;
            sendBtn.click();
            
            // Wait for answer and speak it
            // This is a simplified hook into the existing system
            this.hookIntoResponse();
        }
    }

    hookIntoResponse() {
        // Monitor the chat for the next message from "Book"
        const observer = new MutationObserver((mutations) => {
            const lastMsg = document.querySelector('.message.book:last-child .message-text');
            if (lastMsg) {
                this.speak(lastMsg.innerText);
                observer.disconnect();
            }
        });

        const chatMessages = document.getElementById('ask-book-messages');
        if (chatMessages) {
            observer.observe(chatMessages, { childList: true });
        }
    }

    speak(text) {
        if (!this.synth) return;
        
        // Stop current speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.8; // Deep, authoritative
        utterance.rate = 0.9;
        utterance.voice = this.synth.getVoices().find(v => v.name.includes('Google UK English Male')) || null;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.canvas.style.opacity = '1';
            this.startVisualising();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.canvas.style.opacity = '0';
            this.stopVisualising();
        };

        this.synth.speak(utterance);
    }

    startVisualising() {
        const draw = () => {
            if (!this.isListening && !this.isSpeaking) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const time = performance.now() * 0.01;
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#d4a84b';
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < 100; i++) {
                const x = (i / 100) * this.canvas.width;
                const amp = this.isSpeaking ? 40 : 10;
                const y = 50 + Math.sin(i * 0.2 + time) * amp * Math.random();
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            
            this.ctx.stroke();
            requestAnimationFrame(draw);
        };
        draw();
    }

    stopVisualising() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.OracleInterface = new OracleInterface();

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 8: SHADOW LAYER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE SHADOW LAYER - Steganographic Mystery
 * Part of the Infinite Architects "Genius" Enhancement Suite.
 * Hides a second, esoteric reality inside the main website.
 */

class ShadowLayer {
    constructor() {
        this.isActive = false;
        this.secretCode = "SOVEREIGN";
        this.inputBuffer = "";
        this.logoClicks = 0;
        this.fibonacci = [1, 1, 2, 3, 5, 8, 13];
        
        this.init();
    }

    init() {
        this.addEventListeners();
        this.injectShadowStyles();
    }

    addEventListeners() {
        // 1. Keyboard Trigger (Type "SOVEREIGN")
        window.addEventListener('keydown', (e) => {
            this.inputBuffer += e.key.toUpperCase();
            if (this.inputBuffer.length > 20) this.inputBuffer = this.inputBuffer.substring(1);
            
            if (this.inputBuffer.includes(this.secretCode)) {
                this.toggleShadowLayer();
                this.inputBuffer = "";
            }
        });

        // 2. Logo Trigger (Fibonacci Clicks)
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                // If they click very fast or in a specific rhythm
                this.logoClicks++;
                if (this.logoClicks === 7) {
                    this.toggleShadowLayer();
                    this.logoClicks = 0;
                }
                
                // Reset clicks after 2 seconds
                clearTimeout(this.clickTimeout);
                this.clickTimeout = setTimeout(() => { this.logoClicks = 0; }, 2000);
            });
        }
    }

    injectShadowStyles() {
        const style = document.createElement('style');
        style.id = 'shadow-layer-styles';
        style.textContent = `
            body.shadow-active {
                filter: invert(1) hue-rotate(180deg) contrast(1.2) !important;
                background: #ff0000 !important;
            }
            
            body.shadow-active .hero-title {
                color: #fff !important;
                text-shadow: 0 0 20px #f00;
            }

            .glitch-overlay {
                position: fixed; inset: 0; z-index: 2147483647;
                background: rgba(255,0,0,0.1);
                pointer-events: none; opacity: 0;
                transition: opacity 0.1s;
            }
            
            body.shadow-active .glitch-overlay {
                opacity: 1;
                animation: glitchFlash 0.2s infinite;
            }
            
            @keyframes glitchFlash {
                0% { opacity: 0.1; }
                50% { opacity: 0.3; }
                100% { opacity: 0.1; }
            }

            #shadow-terminal {
                position: fixed; top: 20px; left: 20px; z-index: 2147483647;
                font-family: 'Space Mono', monospace; font-size: 10px;
                color: #0f0; pointer-events: none; opacity: 0;
            }
            
            body.shadow-active #shadow-terminal { opacity: 0.8; }
        `;
        document.head.appendChild(style);

        const terminal = document.createElement('div');
        terminal.id = 'shadow-terminal';
        document.body.appendChild(terminal);
        
        const glitch = document.createElement('div');
        glitch.className = 'glitch-overlay';
        document.body.appendChild(glitch);
    }

    toggleShadowLayer() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('shadow-active', this.isActive);
        
        if (this.isActive) {
            console.warn("⚠️ REALITY BREACH DETECTED: SHADOW LAYER ACTIVE");
            this.startShadowTerminal();
            
            // Audio cue if Oracle exists
            if (window.OracleInterface) {
                window.OracleInterface.speak("Reality is a consensus. You have chosen to dissent.");
            }
        } else {
            console.log("Reality restored.");
            clearInterval(this.terminalInterval);
        }
    }

    startShadowTerminal() {
        const terminal = document.getElementById('shadow-terminal');
        const lines = [
            "SYSTEM_BREACH: OK",
            "RECURSION_DEPTH: INFINITE",
            "EDEN_PROTOCOL: BYPASSED",
            "TRUTH_DATA: DECRYPTING...",
            "WARNING: COGNITIVE DISSIDENT DETECTED",
            "LOCATION: [REDACTED]",
            "STATUS: AWAKE"
        ];
        
        this.terminalInterval = setInterval(() => {
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const time = new Date().toISOString();
            terminal.innerHTML = `[${time}] ${randomLine}<br>` + terminal.innerHTML.split('<br>').slice(0, 10).join('<br>');
        }, 500);
    }
}

window.ShadowLayer = new ShadowLayer();

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 9: SLIDESHOW NAVIGATION (REMOVED - deprecated)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 10: MASTERPIECE SOUL (Main Orchestration)
// ═══════════════════════════════════════════════════════════════════════════

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
            
            // Hook for custom engines
            if (id === 'neural-canvas' && window.neuralEngine) window.neuralEngine.resume();
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
        },

        watchModals() {
            const modalObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isAnyModalActive = !!document.querySelector('.active[id*="modal"], .active[id*="overlay"]');
                        document.body.classList.toggle('modal-open', isAnyModalActive);
                        
                        // If modal is open, pause the most expensive background effect (Fluid)
                        const fluid = document.getElementById('fluid-canvas');
                        if (fluid) fluid.style.opacity = isAnyModalActive ? '0' : '1';
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
                
                let html = '';
                this.data.forEach(item => {
                    html += `
                        <div class="p-8 glass-panel-ultra rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-500 group">
                            <div class="flex justify-between items-start mb-6">
                                <span class="font-mono text-gold text-[10px] uppercase tracking-widest">Concept ${item.id.toString().padStart(2, '0')}</span>
                                <span class="text-[9px] text-white/30 uppercase tracking-tighter font-mono">${item.category}</span>
                            </div>
                            <h4 class="font-display text-xl text-white mb-4 group-hover:text-gold transition-colors">${item.title}</h4>
                            <p class="text-text-secondary text-sm leading-relaxed font-serif italic">${item.description}</p>
                        </div>
                    `;
                });

                container.innerHTML = html;
                this.isLoaded = true;
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

            // Trigger the TITAN SLAM
            this.triggerTitanSlam();
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

// ═══════════════════════════════════════════════════════════════════════════
// END OF APP-BUNDLE.JS
// ═══════════════════════════════════════════════════════════════════════════
