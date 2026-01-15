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

                // Pause/play hero videos
                const videos = entry.target.querySelectorAll('video');
                videos.forEach(video => {
                    if (isVisible && video.paused && !video.ended) {
                        video.play().catch(() => {}); // Ignore autoplay restrictions
                    } else if (!isVisible && !video.paused) {
                        video.pause();
                    }
                });

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

                // Pause evidence videos when off-screen
                const videos = entry.target.querySelectorAll('video');
                videos.forEach(video => {
                    if (!isVisible && !video.paused) {
                        video.pause();
                    }
                });
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

        // Also observe any videos for auto-pause
        document.querySelectorAll('video').forEach(video => {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !entry.target.paused) {
                        entry.target.pause();
                    }
                });
            }, { threshold: 0 });
            videoObserver.observe(video);
        });

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
