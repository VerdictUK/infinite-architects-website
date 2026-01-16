/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ██╗███╗   ██╗███████╗██╗███╗   ██╗██╗████████╗███████╗
 * ██║████╗  ██║██╔════╝██║████╗  ██║██║╚══██╔══╝██╔════╝
 * ██║██╔██╗ ██║█████╗  ██║██╔██╗ ██║██║   ██║   █████╗  
 * ██║██║╚██╗██║██╔══╝  ██║██║╚██╗██║██║   ██║   ██╔══╝  
 * ██║██║ ╚████║██║     ██║██║ ╚████║██║   ██║   ███████╗
 * ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚══════╝
 * 
 * ARCHITECTS — MOBILE ACCORDION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * 
 * VERSION: 4.0.0 ULTIMATE (Option B - TRUE COMPLETE)
 * DATE: January 16, 2026
 * 
 * FEATURES:
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * ✓ GPU-accelerated particle system with glowing connections
 * ✓ Cinematic full-screen overlay on accordion open
 * ✓ Haptic feedback patterns (iOS/Android vibration API)
 * ✓ Lazy loading for videos and heavy assets
 * ✓ Sticky buy bar with scroll threshold trigger
 * ✓ Analytics tracking (GA4 + Meta Pixel)
 * ✓ Page Visibility API for battery optimization
 * ✓ Orientation change handling
 * ✓ Smooth scroll for anchor links
 * ✓ Concepts carousel swipe detection
 * ✓ Public API for external control
 * 
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const CONFIG = {
    // ─────────────────────────────────────────────────────────────────────────────────────
    // Particle System
    // ─────────────────────────────────────────────────────────────────────────────────────
    particles: {
      enabled: true,
      count: 38,
      connectionDistance: 85,
      speed: 0.32,
      sizeRange: { min: 1.5, max: 3.2 },
      colors: {
        particle: { h: 42, s: 68, l: 56 },    // Gold
        connection: { h: 42, s: 62, l: 52 },  // Slightly darker gold
      },
      glow: true,
      glowIntensity: 0.55,
      mouseRepelRadius: 110,
      mouseRepelForce: 0.035,
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Haptic Feedback Patterns (milliseconds)
    // ─────────────────────────────────────────────────────────────────────────────────────
    haptics: {
      enabled: true,
      patterns: {
        light: 10,
        medium: 20,
        heavy: 45,
        success: [10, 50, 20],
        error: [50, 30, 50],
        open: [10, 35],
        close: 15,
        tap: 8,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Buy Bar
    // ─────────────────────────────────────────────────────────────────────────────────────
    buyBar: {
      scrollThreshold: 0.28, // Show after scrolling 28% past hero
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Cinematic Overlay
    // ─────────────────────────────────────────────────────────────────────────────────────
    cinema: {
      enabled: true,
      duration: 1500, // ms before auto-dismiss
      // Only show full-screen for these critical accordions
      criticalAccordions: ['accordion-evidence', 'accordion-get-book'],
      // Part data with UPGRADED titles from the audit
      partData: {
        'accordion-mind': { 
          part: 'PART I', 
          title: 'THE MIND', 
          hook: 'Why I see what others miss' 
        },
        'accordion-equation': { 
          part: 'PART II', 
          title: 'THE THESIS', 
          hook: 'What if E=mc² had a sequel?' 
        },
        'accordion-evidence': { 
          part: 'PART III', 
          title: 'THE EVIDENCE', 
          hook: '5 days. From page to proof.' 
        },
        'accordion-concepts': { 
          part: 'PART IV', 
          title: 'THE PHILOSOPHY', 
          hook: 'A new vocabulary for what\'s coming' 
        },
        'accordion-predictions': { 
          part: 'PART V', 
          title: 'THE CONVERGENCE', 
          hook: 'When the loops close' 
        },
        'accordion-stakes': { 
          part: 'PART VI', 
          title: 'THE STAKES', 
          hook: 'What happens if you look away' 
        },
        'accordion-reviews': { 
          part: 'PART VII', 
          title: 'THE VERDICT', 
          hook: 'They saw it too' 
        },
        'accordion-get-book': { 
          part: 'PART VIII', 
          title: 'JOIN THE MOVEMENT', 
          hook: 'Your seat is waiting' 
        },
        'accordion-faq': { 
          part: 'FAQ', 
          title: 'QUESTIONS', 
          hook: 'What readers ask most' 
        },
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Analytics
    // ─────────────────────────────────────────────────────────────────────────────────────
    analytics: {
      enabled: true,
      debug: false, // Set true to log events to console
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Performance
    // ─────────────────────────────────────────────────────────────────────────────────────
    throttleDelay: 100,
    debounceDelay: 250,
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const state = {
    initialized: false,
    isMobile: false,
    particleSystem: null,
    buyBarVisible: false,
    pageVisible: true,
    shownCinemaIds: new Set(), // Track which cinematic overlays have been shown
    lastScrollY: 0,
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const utils = {
    /**
     * Throttle function execution
     */
    throttle(fn, delay) {
      let lastCall = 0;
      let rafId = null;
      return function(...args) {
        const now = performance.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => fn.apply(this, args));
        }
      };
    },

    /**
     * Debounce function execution
     */
    debounce(fn, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    /**
     * Request idle callback with fallback
     */
    requestIdle(callback, timeout = 100) {
      if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout });
      }
      return setTimeout(callback, 1);
    },

    /**
     * Trigger haptic feedback
     */
    haptic(pattern) {
      if (!CONFIG.haptics.enabled) return;
      if (!navigator.vibrate) return;

      const vibration = CONFIG.haptics.patterns[pattern];
      if (vibration) {
        try {
          navigator.vibrate(vibration);
        } catch (e) {
          // Vibration not supported or blocked
        }
      }
    },

    /**
     * Track analytics event
     */
    track(category, action, label = null, value = null) {
      if (!CONFIG.analytics.enabled) return;

      if (CONFIG.analytics.debug) {
        console.log(`[Analytics] ${category}/${action}`, label || '', value || '');
      }

      // Google Analytics 4
      if (typeof gtag === 'function') {
        gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }

      // Meta Pixel
      if (typeof fbq === 'function') {
        if (action === 'Click' && category === 'CTA') {
          fbq('track', 'InitiateCheckout');
        }
        if (action === 'Open' && category === 'Accordion') {
          fbq('track', 'ViewContent', { content_name: label });
        }
      }
    },

    /**
     * Random number in range
     */
    randomRange(min, max) {
      return min + Math.random() * (max - min);
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, factor) {
      return start + (end - start) * factor;
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM — GPU-Accelerated with Glowing Connections
  // ═══════════════════════════════════════════════════════════════════════════════════════

  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.particles = [];
      this.mouse = { x: -1000, y: -1000, active: false };
      this.animationId = null;
      this.running = false;
      this.lastTime = 0;
      this.frameInterval = 1000 / 60; // Target 60fps
      this.dpr = 1;

      this.resize();
      this.createParticles();
      this.bindEvents();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = rect.width * this.dpr;
      this.canvas.height = rect.height * this.dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;

      this.ctx.scale(this.dpr, this.dpr);
      this.width = rect.width;
      this.height = rect.height;
    }

    createParticles() {
      const { count, sizeRange, colors, speed } = CONFIG.particles;
      this.particles = [];

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          size: utils.randomRange(sizeRange.min, sizeRange.max),
          hue: colors.particle.h + utils.randomRange(-10, 10),
          saturation: colors.particle.s + utils.randomRange(-6, 6),
          lightness: colors.particle.l + utils.randomRange(-6, 6),
          alpha: utils.randomRange(0.42, 0.82),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: utils.randomRange(0.012, 0.028),
        });
      }
    }

    bindEvents() {
      const parent = this.canvas.parentElement;

      // Mouse events
      parent.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.mouse.active = true;
      });

      parent.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
        this.mouse.active = false;
      });

      // Touch events
      parent.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const rect = this.canvas.getBoundingClientRect();
          this.mouse.x = e.touches[0].clientX - rect.left;
          this.mouse.y = e.touches[0].clientY - rect.top;
          this.mouse.active = true;
        }
      }, { passive: true });

      parent.addEventListener('touchend', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
        this.mouse.active = false;
      });
    }

    update() {
      const { speed, mouseRepelRadius, mouseRepelForce } = CONFIG.particles;

      this.particles.forEach((p) => {
        // Pulse animation
        p.pulsePhase += p.pulseSpeed;
        p.currentAlpha = p.alpha * (Math.sin(p.pulsePhase) * 0.32 + 0.68);

        // Mouse repulsion
        if (this.mouse.active) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRepelRadius && dist > 0) {
            const force = (mouseRepelRadius - dist) / mouseRepelRadius;
            p.vx -= (dx / dist) * force * mouseRepelForce;
            p.vy -= (dy / dist) * force * mouseRepelForce;
          }
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.988;
        p.vy *= 0.988;

        // Random drift
        p.vx += (Math.random() - 0.5) * 0.018;
        p.vy += (Math.random() - 0.5) * 0.018;

        // Speed limit
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = speed * 2.2;
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

        // Wrap around edges
        if (p.x < -12) p.x = this.width + 12;
        if (p.x > this.width + 12) p.x = -12;
        if (p.y < -12) p.y = this.height + 12;
        if (p.y > this.height + 12) p.y = -12;
      });
    }

    draw() {
      const ctx = this.ctx;
      const { connectionDistance, glow, glowIntensity, colors } = CONFIG.particles;

      // Clear canvas
      ctx.clearRect(0, 0, this.width, this.height);

      // Draw connections
      ctx.lineWidth = 0.65;
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.42 *
              Math.min(p1.currentAlpha, p2.currentAlpha);
            ctx.strokeStyle = `hsla(${colors.connection.h}, ${colors.connection.s}%, ${colors.connection.l}%, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      this.particles.forEach((p) => {
        // Glow effect
        if (glow) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5.5);
          gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha * glowIntensity})`);
          gradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size * 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    animate(currentTime = 0) {
      if (!this.running || !state.pageVisible) {
        this.animationId = null;
        return;
      }

      const deltaTime = currentTime - this.lastTime;
      if (deltaTime >= this.frameInterval) {
        this.lastTime = currentTime - (deltaTime % this.frameInterval);
        this.update();
        this.draw();
      }

      this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();
      this.animate(this.lastTime);
    }

    stop() {
      this.running = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    destroy() {
      this.stop();
      this.particles = [];
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CINEMATIC OVERLAY SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const cinema = {
    overlay: null,
    dismissTimeout: null,

    init() {
      if (!CONFIG.cinema.enabled) return;

      // Get or create overlay element
      this.overlay = document.querySelector('.cinema-overlay');
      if (!this.overlay) {
        this.createOverlay();
      }

      // Click to dismiss
      this.overlay.addEventListener('click', () => this.hide());
      
      // Keyboard dismiss (Escape key)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
          this.hide();
        }
      });
    },

    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'cinema-overlay';
      this.overlay.setAttribute('role', 'dialog');
      this.overlay.setAttribute('aria-modal', 'true');
      this.overlay.innerHTML = `
        <span class="cinema-overlay__part" aria-hidden="true"></span>
        <span class="cinema-overlay__divider" aria-hidden="true"></span>
        <span class="cinema-overlay__title"></span>
        <span class="cinema-overlay__hook"></span>
      `;
      document.body.appendChild(this.overlay);
    },

    show(accordionId) {
      if (!CONFIG.cinema.enabled || !this.overlay) return;

      // Check if this is a critical accordion (always show) or first-time
      const isCritical = CONFIG.cinema.criticalAccordions.includes(accordionId);
      const alreadyShown = state.shownCinemaIds.has(accordionId);

      // For critical accordions, always show. For others, show only first time.
      if (!isCritical && alreadyShown) return;

      const data = CONFIG.cinema.partData[accordionId];
      if (!data) return;

      // Mark as shown
      state.shownCinemaIds.add(accordionId);

      // Clear any existing timeout
      if (this.dismissTimeout) {
        clearTimeout(this.dismissTimeout);
      }

      // Populate overlay content
      this.overlay.querySelector('.cinema-overlay__part').textContent = data.part;
      this.overlay.querySelector('.cinema-overlay__title').textContent = data.title;
      this.overlay.querySelector('.cinema-overlay__hook').textContent = data.hook;

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Show overlay
      this.overlay.classList.add('active');

      // Haptic feedback
      utils.haptic('success');

      // Auto-dismiss after duration
      this.dismissTimeout = setTimeout(() => this.hide(), CONFIG.cinema.duration);

      // Track analytics
      utils.track('Cinema', 'Show', accordionId);
    },

    hide() {
      if (!this.overlay) return;

      // Clear timeout
      if (this.dismissTimeout) {
        clearTimeout(this.dismissTimeout);
        this.dismissTimeout = null;
      }

      // Hide overlay
      this.overlay.classList.remove('active');

      // Restore body scroll
      document.body.style.overflow = '';
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // ACCORDION MANAGER
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const accordion = {
    init() {
      const items = document.querySelectorAll('.accordion-item');

      items.forEach((item) => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;

        // Click handler
        header.addEventListener('click', (e) => {
          this.handleToggle(e, item);
        });

        // Keyboard handler
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });

        // If already open, lazy load content
        if (item.hasAttribute('open')) {
          this.lazyLoadContent(item);
        }
      });
    },

    handleToggle(event, item) {
      const willBeOpen = !item.hasAttribute('open');
      const accordionId = item.id;

      // Haptic feedback
      utils.haptic(willBeOpen ? 'open' : 'close');

      if (willBeOpen) {
        // Show cinematic overlay for critical sections
        cinema.show(accordionId);

        // Lazy load content
        this.lazyLoadContent(item);

        // Scroll into view after animation settles
        setTimeout(() => {
          const header = item.querySelector('.accordion-header');
          if (header) {
            const rect = header.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.42) {
              header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 220);
      }

      // Track analytics
      const title = item.querySelector('.accordion-header__title')?.textContent || accordionId;
      utils.track('Accordion', willBeOpen ? 'Open' : 'Close', title);
    },

    lazyLoadContent(item) {
      // Lazy load videos
      const videos = item.querySelectorAll('.accordion-video-wrapper[data-loading="true"]');
      videos.forEach((wrapper) => {
        wrapper.addEventListener('click', () => this.loadVideo(wrapper), { once: true });
      });

      // Lazy load images
      const images = item.querySelectorAll('img[data-src]');
      images.forEach((img) => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });

      // Lazy load heavy assets
      const heavyAssets = item.querySelectorAll('[data-heavy-asset]');
      heavyAssets.forEach((el) => {
        el.classList.add('loaded');
      });
    },

    loadVideo(wrapper) {
      const video = wrapper.querySelector('video');
      if (!video) return;

      const src = video.getAttribute('data-src');
      if (!src) return;

      // Remove loading state
      wrapper.removeAttribute('data-loading');

      // Load and play video
      video.src = src;
      video.load();
      video.play().catch(() => {
        // Autoplay blocked, user will need to tap again
      });

      // Haptic feedback
      utils.haptic('medium');

      // Track
      utils.track('Video', 'Load', src);
    },

    openById(id) {
      const item = document.getElementById(id);
      if (item && !item.hasAttribute('open')) {
        item.setAttribute('open', '');
        this.lazyLoadContent(item);
        cinema.show(id);
        utils.haptic('open');
        
        // Scroll to it
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    },

    closeById(id) {
      const item = document.getElementById(id);
      if (item && item.hasAttribute('open')) {
        item.removeAttribute('open');
        utils.haptic('close');
      }
    },

    closeAll() {
      document.querySelectorAll('.accordion-item[open]').forEach((item) => {
        item.removeAttribute('open');
      });
      utils.haptic('close');
    },

    toggleById(id) {
      const item = document.getElementById(id);
      if (!item) return;
      
      if (item.hasAttribute('open')) {
        this.closeById(id);
      } else {
        this.openById(id);
      }
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // BUY BAR CONTROLLER
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const buyBar = {
    element: null,

    init() {
      this.element = document.querySelector('.mobile-buy-bar');
      if (!this.element) return;

      // Scroll handler
      window.addEventListener('scroll', utils.throttle(() => {
        this.check();
      }, CONFIG.throttleDelay), { passive: true });

      // Initial check
      this.check();
    },

    check() {
      const hero = document.querySelector('.mobile-hero');
      if (!hero || !this.element) return;

      const rect = hero.getBoundingClientRect();
      const scrolled = -rect.top / hero.offsetHeight;
      const shouldShow = scrolled > CONFIG.buyBar.scrollThreshold;

      if (shouldShow && !state.buyBarVisible) {
        this.show();
      } else if (!shouldShow && state.buyBarVisible) {
        this.hide();
      }
    },

    show() {
      if (!this.element) return;
      this.element.classList.add('visible');
      state.buyBarVisible = true;
    },

    hide() {
      if (!this.element) return;
      this.element.classList.remove('visible');
      state.buyBarVisible = false;
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CTA TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const ctaTracking = {
    init() {
      // Track elements with data-analytics attribute
      document.querySelectorAll('[data-analytics]').forEach((el) => {
        el.addEventListener('click', () => {
          utils.haptic('tap');
          utils.track('CTA', 'Click', el.getAttribute('data-analytics'));
        });
      });

      // Track pricing CTAs
      document.querySelectorAll('.accordion-pricing-card__cta').forEach((cta) => {
        cta.addEventListener('click', () => {
          const card = cta.closest('.accordion-pricing-card');
          const format = card?.querySelector('.accordion-pricing-card__format')?.textContent || 'Unknown';
          utils.haptic('medium');
          utils.track('Purchase', 'Click', format);
        });
      });

      // Track buy bar CTA
      const buyBarCta = document.querySelector('.mobile-buy-bar__cta');
      if (buyBarCta) {
        buyBarCta.addEventListener('click', () => {
          utils.haptic('medium');
          utils.track('Purchase', 'Click', 'BuyBar');
        });
      }
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PAGE VISIBILITY HANDLER
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const visibility = {
    init() {
      document.addEventListener('visibilitychange', () => {
        state.pageVisible = !document.hidden;

        if (state.pageVisible) {
          // Resume particle system
          if (state.particleSystem) {
            state.particleSystem.start();
          }
        } else {
          // Pause particle system (battery optimization)
          if (state.particleSystem) {
            state.particleSystem.stop();
          }
        }
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // RESIZE HANDLER
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const resize = {
    init() {
      window.addEventListener('resize', utils.debounce(() => {
        this.onResize();
      }, CONFIG.debounceDelay));

      window.addEventListener('orientationchange', () => {
        // Delay to allow browser to settle
        setTimeout(() => this.onResize(), 180);
      });
    },

    onResize() {
      state.isMobile = window.innerWidth < 1024;

      // Resize particle system
      if (state.particleSystem) {
        state.particleSystem.resize();
        state.particleSystem.createParticles();
      }

      // Re-check buy bar
      buyBar.check();
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const smoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#' || targetId === '#0') return;

          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            utils.haptic('tap');

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // If it's an accordion, open it after scrolling
            if (target.classList.contains('accordion-item') && !target.hasAttribute('open')) {
              setTimeout(() => {
                target.setAttribute('open', '');
                accordion.lazyLoadContent(target);
                cinema.show(target.id);
              }, 550);
            }
          }
        });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CONCEPTS CAROUSEL (Horizontal Swipe)
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const conceptsCarousel = {
    init() {
      const carousels = document.querySelectorAll('.concepts-carousel');
      
      carousels.forEach((carousel) => {
        // Hide hint after scrolling
        carousel.addEventListener('scroll', utils.throttle(() => {
          const hint = carousel.parentElement?.querySelector('.concepts-hint');
          if (hint && carousel.scrollLeft > 55) {
            hint.style.opacity = '0';
            hint.style.pointerEvents = 'none';
          }
        }, 120), { passive: true });

        // Track scroll engagement
        let hasTrackedScroll = false;
        carousel.addEventListener('scroll', utils.debounce(() => {
          if (!hasTrackedScroll && carousel.scrollLeft > 100) {
            hasTrackedScroll = true;
            utils.track('Carousel', 'Scroll', 'Concepts');
          }
        }, 300), { passive: true });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // FAQ ACCORDION (Nested details elements)
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const faqAccordion = {
    init() {
      const faqItems = document.querySelectorAll('.accordion-faq-item');
      
      faqItems.forEach((item) => {
        item.addEventListener('toggle', (e) => {
          if (item.open) {
            utils.haptic('light');
            utils.track('FAQ', 'Open', item.querySelector('summary')?.textContent || 'Unknown');
          }
        });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  function init() {
    // Check if mobile
    state.isMobile = window.innerWidth < 1024;
    
    if (!state.isMobile) {
      console.log('[MobileAccordion] Desktop detected, skipping mobile initialization');
      return;
    }

    console.log('[MobileAccordion] Initializing v4.0 ULTIMATE');

    // Create particle canvas if enabled and doesn't exist
    let particleCanvas = document.querySelector('.mobile-hero__particles');
    if (!particleCanvas && CONFIG.particles.enabled) {
      const hero = document.querySelector('.mobile-hero');
      if (hero) {
        particleCanvas = document.createElement('canvas');
        particleCanvas.className = 'mobile-hero__particles';
        particleCanvas.setAttribute('aria-hidden', 'true');
        hero.insertBefore(particleCanvas, hero.firstChild);
      }
    }

    // Initialize particle system
    if (particleCanvas && CONFIG.particles.enabled) {
      state.particleSystem = new ParticleSystem(particleCanvas);
      state.particleSystem.start();
    }

    // Initialize all modules
    cinema.init();
    accordion.init();
    buyBar.init();
    ctaTracking.init();
    visibility.init();
    resize.init();
    smoothScroll.init();
    conceptsCarousel.init();
    faqAccordion.init();

    // Mark as initialized
    state.initialized = true;

    // Track page load
    utils.track('Page', 'Load', 'Mobile');

    console.log('[MobileAccordion] Initialization complete ✓');
  }


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════════════════

  window.MobileAccordion = {
    version: '4.0.0-ultimate',

    // Accordion controls
    openAccordion: (id) => accordion.openById(id),
    closeAccordion: (id) => accordion.closeById(id),
    toggleAccordion: (id) => accordion.toggleById(id),
    closeAll: () => accordion.closeAll(),

    // Buy bar controls
    showBuyBar: () => buyBar.show(),
    hideBuyBar: () => buyBar.hide(),

    // Cinema controls
    showCinema: (id) => cinema.show(id),
    hideCinema: () => cinema.hide(),

    // Particle controls
    pauseParticles: () => state.particleSystem?.stop(),
    resumeParticles: () => state.particleSystem?.start(),
    destroyParticles: () => state.particleSystem?.destroy(),

    // Haptic feedback
    haptic: (pattern) => utils.haptic(pattern),

    // Analytics
    track: (category, action, label, value) => utils.track(category, action, label, value),

    // State getter
    getState: () => ({
      initialized: state.initialized,
      isMobile: state.isMobile,
      buyBarVisible: state.buyBarVisible,
      pageVisible: state.pageVisible,
      particlesRunning: state.particleSystem?.running || false,
      shownCinemas: Array.from(state.shownCinemaIds),
    }),

    // Re-initialize
    reinit() {
      if (state.particleSystem) {
        state.particleSystem.destroy();
        state.particleSystem = null;
      }
      state.initialized = false;
      state.shownCinemaIds.clear();
      init();
    },

    // Force scroll to section
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        utils.haptic('tap');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // DOM READY
  // ═══════════════════════════════════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Use requestIdleCallback for non-blocking initialization
    utils.requestIdle(init, 60);
  }

})();
