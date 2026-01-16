/**
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * ██╗███╗   ██╗███████╗██╗███╗   ██╗██╗████████╗███████╗
 * ██║████╗  ██║██╔════╝██║████╗  ██║██║╚══██╔══╝██╔════╝
 * ██║██╔██╗ ██║█████╗  ██║██╔██╗ ██║██║   ██║   █████╗  
 * ██║██║╚██╗██║██╔══╝  ██║██║╚██╗██║██║   ██║   ██╔══╝  
 * ██║██║ ╚████║██║     ██║██║ ╚████║██║   ██║   ███████╗
 * ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚══════╝
 * 
 * ARCHITECTS — MOBILE ACCORDION SYSTEM V6 ULTIMATE FINAL
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 * 
 * VERSION: 6.0.0-FINAL
 * DATE: January 16, 2026
 * 
 * FEATURES:
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * ✓ updateHeaders() - Fixes SECTION → PART labels automatically
 * ✓ GPU-accelerated particle system with glowing connections
 * ✓ Cinematic full-screen overlay on accordion open
 * ✓ Text scramble decryption effect (Matrix-style)
 * ✓ Deep linking with URL hash (#the-mind, #the-evidence)
 * ✓ State persistence via sessionStorage
 * ✓ Native Web Share API with clipboard fallback
 * ✓ Share toast notifications
 * ✓ Haptic feedback patterns (iOS/Android vibration API)
 * ✓ Lazy loading for videos and heavy assets
 * ✓ Sticky buy bar with scroll threshold trigger
 * ✓ Analytics tracking (GA4 + Meta Pixel + Plausible)
 * ✓ Page Visibility API for battery optimization
 * ✓ Progress indicator dots
 * ✓ Single-open accordion mode
 * 
 * VERIFIED FACTS (IMMUTABLE):
 * ─────────────────────────────────────────────────────────────────────────────────────────
 * • Book published: January 2, 2026
 * • BBC broadcast: January 7, 2026
 * • Gap: 5 DAYS
 * • Prediction quote: "practical quantum computing within approximately five years"
 * • Kindle ASIN: B0DS2L8BVC (£9.99)
 * • Paperback ASIN: B0DS7BZ4L9 (£14.99)
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
    // Part Data — CINEMATIC TITLES
    // ORDER: Mind → Evidence → Thesis → Philosophy → Convergence → Stakes → Verdict → Join
    // ─────────────────────────────────────────────────────────────────────────────────────
    partData: {
      'accordion-mind': {
        part: 'PART I',
        numeral: 'I',
        title: 'THE MIND',
        displayTitle: 'The Mind',
        hook: 'The pattern-finder who saw it coming',
        hash: 'the-mind',
        order: 1
      },
      'accordion-evidence': {
        part: 'PART II',
        numeral: 'II',
        title: 'THE EVIDENCE',
        displayTitle: 'The Evidence',
        hook: 'BBC confirmed this 5 days later',
        hash: 'the-evidence',
        order: 2
      },
      'accordion-equation': {
        part: 'PART III',
        numeral: 'III',
        title: 'THE THESIS',
        displayTitle: 'The Thesis',
        hook: 'One equation. All of creation.',
        hash: 'the-thesis',
        order: 3
      },
      'accordion-concepts': {
        part: 'PART IV',
        numeral: 'IV',
        title: 'THE PHILOSOPHY',
        displayTitle: 'The Philosophy',
        hook: '37 concepts that exist nowhere else',
        hash: 'the-philosophy',
        order: 4
      },
      'accordion-predictions': {
        part: 'PART V',
        numeral: 'V',
        title: 'THE CONVERGENCE',
        displayTitle: 'The Convergence',
        hook: 'When the loops close',
        hash: 'the-convergence',
        order: 5
      },
      'accordion-stakes': {
        part: 'PART VI',
        numeral: 'VI',
        title: 'THE STAKES',
        displayTitle: 'The Stakes',
        hook: "This isn't tomorrow. It's now.",
        hash: 'the-stakes',
        order: 6
      },
      'accordion-reviews': {
        part: 'PART VII',
        numeral: 'VII',
        title: 'THE VERDICT',
        displayTitle: 'The Verdict',
        hook: 'What early readers discovered',
        hash: 'the-verdict',
        order: 7
      },
      'accordion-get-book': { 
        part: 'PART VIII', 
        numeral: 'VIII',
        title: 'JOIN THE MOVEMENT',
        displayTitle: 'Join the Movement',
        hook: 'Your seat is waiting',
        hash: 'join',
        order: 8
      },
      'accordion-faq': {
        part: 'FAQ',
        numeral: '?',
        title: 'FREQUENTLY ASKED',
        displayTitle: 'Frequently Asked',
        hook: 'What readers ask most',
        hash: 'faq',
        order: 9
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Hash Map (URL → Accordion ID)
    // ─────────────────────────────────────────────────────────────────────────────────────
    hashMap: {
      'the-mind': 'accordion-mind',
      'the-evidence': 'accordion-evidence',
      'the-thesis': 'accordion-equation',
      'the-philosophy': 'accordion-concepts',
      'the-convergence': 'accordion-predictions',
      'the-stakes': 'accordion-stakes',
      'the-verdict': 'accordion-reviews',
      'join': 'accordion-get-book',
      'faq': 'accordion-faq'
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Particle System
    // ─────────────────────────────────────────────────────────────────────────────────────
    particles: {
      enabled: true,
      count: 42,
      connectionDistance: 90,
      speed: 0.35,
      sizeRange: { min: 1.5, max: 3.5 },
      colors: {
        particle: { h: 42, s: 68, l: 56 },
        connection: { h: 42, s: 62, l: 52 },
      },
      glow: true,
      glowIntensity: 0.6,
      mouseRepelRadius: 120,
      mouseRepelForce: 0.04,
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
        share: [15, 40, 15],
      },
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Text Scramble Effect
    // ─────────────────────────────────────────────────────────────────────────────────────
    textScramble: {
      enabled: true,
      duration: 450,
      frameRate: 30,
      chars: '▓█▒░╔╗╚╝║═╬┼◆◇○●□■△▲▽▼',
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Buy Bar
    // ─────────────────────────────────────────────────────────────────────────────────────
    buyBar: {
      scrollThreshold: 0.28,
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Cinematic Overlay
    // ─────────────────────────────────────────────────────────────────────────────────────
    cinema: {
      enabled: true,
      duration: 1800,
      criticalAccordions: ['accordion-evidence', 'accordion-get-book'],
    },

    // ─────────────────────────────────────────────────────────────────────────────────────
    // Analytics
    // ─────────────────────────────────────────────────────────────────────────────────────
    analytics: {
      enabled: true,
      debug: false,
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
    shownCinemaIds: new Set(),
    lastScrollY: 0,
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const utils = {
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

    debounce(fn, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    requestIdle(callback, timeout = 100) {
      if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout });
      }
      return setTimeout(callback, 1);
    },

    haptic(pattern) {
      if (!CONFIG.haptics.enabled) return;
      if (!navigator.vibrate) return;
      const vibration = CONFIG.haptics.patterns[pattern];
      if (vibration) {
        try { navigator.vibrate(vibration); } catch (e) {}
      }
    },

    track(category, action, label = null, value = null) {
      if (!CONFIG.analytics.enabled) return;
      if (CONFIG.analytics.debug) {
        console.log(`[Analytics] ${category}/${action}`, label || '', value || '');
      }
      if (typeof gtag === 'function') {
        gtag('event', action, { event_category: category, event_label: label, value });
      }
      if (typeof fbq === 'function') {
        if (action === 'Click' && category === 'CTA') fbq('track', 'InitiateCheckout');
      }
      if (typeof plausible === 'function') {
        plausible(action, { props: { category, label } });
      }
    },

    randomRange(min, max) {
      return min + Math.random() * (max - min);
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    lerp(start, end, factor) {
      return start + (end - start) * factor;
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // TEXT SCRAMBLE EFFECT
  // ═══════════════════════════════════════════════════════════════════════════════════════

  class TextScramble {
    constructor(element, options = {}) {
      this.el = element;
      this.chars = options.chars || CONFIG.textScramble.chars;
      this.duration = options.duration || CONFIG.textScramble.duration;
      this.frameRate = options.frameRate || CONFIG.textScramble.frameRate;
    }

    async scramble(newText) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.el.textContent = newText;
        return;
      }

      const length = newText.length;
      const frameInterval = 1000 / this.frameRate;
      const totalFrames = this.duration / frameInterval;

      return new Promise(resolve => {
        let frame = 0;

        const update = () => {
          let output = '';
          const progress = frame / totalFrames;

          for (let i = 0; i < length; i++) {
            const charProgress = progress * length;
            if (i < charProgress) {
              output += `<span class="char-resolved">${newText[i]}</span>`;
            } else {
              output += `<span class="char-scrambling">${this.randomChar()}</span>`;
            }
          }

          this.el.innerHTML = output;
          frame++;

          if (frame <= totalFrames) {
            requestAnimationFrame(update);
          } else {
            this.el.textContent = newText;
            resolve();
          }
        };

        update();
      });
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // STATE MANAGER (Deep Linking + Persistence)
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const stateManager = {
    storageKey: 'ia-accordion-state',
    expiry: 24 * 60 * 60 * 1000, // 24 hours

    init() {
      // Handle hash on load
      this.restore();

      // Listen for hash changes
      window.addEventListener('hashchange', () => this.handleHashChange());
      window.addEventListener('popstate', () => this.handleHashChange());
    },

    save(accordionId, scrollY) {
      try {
        sessionStorage.setItem(this.storageKey, JSON.stringify({
          accordionId,
          scrollY,
          timestamp: Date.now()
        }));
      } catch (e) {}
    },

    restore() {
      // Check URL hash first
      const hash = window.location.hash.slice(1);
      if (hash && CONFIG.hashMap[hash]) {
        setTimeout(() => {
          accordion.openById(CONFIG.hashMap[hash]);
        }, 300);
        return;
      }

      // Then check sessionStorage
      try {
        const saved = sessionStorage.getItem(this.storageKey);
        if (saved) {
          const data = JSON.parse(saved);
          if (Date.now() - data.timestamp < this.expiry) {
            setTimeout(() => {
              accordion.openById(data.accordionId);
            }, 300);
          } else {
            this.cleanup();
          }
        }
      } catch (e) {}
    },

    handleHashChange() {
      const hash = window.location.hash.slice(1);
      if (hash && CONFIG.hashMap[hash]) {
        accordion.openById(CONFIG.hashMap[hash]);
      }
    },

    updateHash(accordionId) {
      const data = CONFIG.partData[accordionId];
      if (data && data.hash) {
        history.pushState(null, '', `#${data.hash}`);
      }
    },

    clearHash() {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    },

    cleanup() {
      try { sessionStorage.removeItem(this.storageKey); } catch (e) {}
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // SHARE MANAGER (Native Web Share API)
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const shareManager = {
    async share(data) {
      const { title, text, url } = data;

      // Try native share first
      if (navigator.share && this.isMobile()) {
        try {
          await navigator.share({ title, text, url });
          utils.haptic('share');
          utils.track('Share', 'Native', title);
          return { success: true, method: 'native' };
        } catch (err) {
          if (err.name === 'AbortError') {
            return { success: false, method: 'cancelled' };
          }
        }
      }

      // Fallback to clipboard
      return this.copyToClipboard(text, url);
    },

    isMobile() {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },

    async copyToClipboard(text, url) {
      const fullText = `${text}\n\n${url}`;
      try {
        await navigator.clipboard.writeText(fullText);
        utils.haptic('success');
        this.showToast('Link copied to clipboard');
        utils.track('Share', 'Clipboard', text);
        return { success: true, method: 'clipboard' };
      } catch (e) {
        return { success: false, method: 'error' };
      }
    },

    showToast(message) {
      let toast = document.querySelector('.share-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2500);
    },

    getSectionShareData(accordionId) {
      const data = CONFIG.partData[accordionId];
      if (!data) return null;
      return {
        title: `${data.part}: ${data.displayTitle} — Infinite Architects`,
        text: `Read "${data.displayTitle}" from Infinite Architects — ${data.hook}`,
        url: `${window.location.origin}${window.location.pathname}#${data.hash}`
      };
    },

    getBookShareData() {
      return {
        title: 'Infinite Architects by Michael Darius Eastwood',
        text: 'A book that predicted a BBC headline 5 days before it happened. The future of AI, explained.',
        url: window.location.origin
      };
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM
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
      this.frameInterval = 1000 / 60;
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
        p.pulsePhase += p.pulseSpeed;
        p.currentAlpha = p.alpha * (Math.sin(p.pulsePhase) * 0.32 + 0.68);

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

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.988;
        p.vy *= 0.988;
        p.vx += (Math.random() - 0.5) * 0.018;
        p.vy += (Math.random() - 0.5) * 0.018;

        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = speed * 2.2;
        if (currentSpeed > maxSpeed) {
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }

        if (p.x < -12) p.x = this.width + 12;
        if (p.x > this.width + 12) p.x = -12;
        if (p.y < -12) p.y = this.height + 12;
        if (p.y > this.height + 12) p.y = -12;
      });
    }

    draw() {
      const ctx = this.ctx;
      const { connectionDistance, glow, glowIntensity, colors } = CONFIG.particles;

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

      // Draw particles with glow
      this.particles.forEach((p) => {
        if (glow) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha * glowIntensity})`);
          gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    render(timestamp) {
      if (!this.running) return;

      const elapsed = timestamp - this.lastTime;
      if (elapsed >= this.frameInterval) {
        this.lastTime = timestamp - (elapsed % this.frameInterval);
        this.update();
        this.draw();
      }

      this.animationId = requestAnimationFrame((t) => this.render(t));
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();
      this.animationId = requestAnimationFrame((t) => this.render(t));
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
    }
  }


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CINEMATIC OVERLAY
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const cinema = {
    overlay: null,
    dismissTimeout: null,
    textScrambler: null,

    init() {
      if (!CONFIG.cinema.enabled) return;
      this.createOverlay();
      this.bindEvents();
    },

    createOverlay() {
      if (this.overlay) return;
      this.overlay = document.createElement('div');
      this.overlay.className = 'cinema-overlay';
      this.overlay.setAttribute('role', 'dialog');
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.innerHTML = `
        <span class="cinema-overlay__part"></span>
        <span class="cinema-overlay__divider" aria-hidden="true"></span>
        <span class="cinema-overlay__title"></span>
        <span class="cinema-overlay__hook"></span>
      `;
      document.body.appendChild(this.overlay);

      // Initialize text scrambler
      const titleEl = this.overlay.querySelector('.cinema-overlay__title');
      this.textScrambler = new TextScramble(titleEl);
    },

    bindEvents() {
      if (!this.overlay) return;
      this.overlay.addEventListener('click', () => this.hide());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.hide();
      });
    },

    async show(accordionId) {
      if (!CONFIG.cinema.enabled || !this.overlay) return;

      const isCritical = CONFIG.cinema.criticalAccordions.includes(accordionId);
      const alreadyShown = state.shownCinemaIds.has(accordionId);

      if (!isCritical && alreadyShown) return;

      const data = CONFIG.partData[accordionId];
      if (!data) return;

      state.shownCinemaIds.add(accordionId);

      if (this.dismissTimeout) {
        clearTimeout(this.dismissTimeout);
      }

      // Set part and hook
      this.overlay.querySelector('.cinema-overlay__part').textContent = data.part;
      this.overlay.querySelector('.cinema-overlay__hook').textContent = data.hook;

      // Clear title for scramble
      this.overlay.querySelector('.cinema-overlay__title').textContent = '';

      document.body.style.overflow = 'hidden';
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');

      utils.haptic('success');

      // Text scramble effect
      if (CONFIG.textScramble.enabled && this.textScrambler) {
        await this.textScrambler.scramble(data.title);
      } else {
        this.overlay.querySelector('.cinema-overlay__title').textContent = data.title;
      }

      this.dismissTimeout = setTimeout(() => this.hide(), CONFIG.cinema.duration);
      utils.track('Cinema', 'Show', accordionId);
    },

    hide() {
      if (!this.overlay) return;
      if (this.dismissTimeout) {
        clearTimeout(this.dismissTimeout);
        this.dismissTimeout = null;
      }
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
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

        header.addEventListener('click', (e) => {
          this.handleToggle(e, item);
        });

        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });

        if (item.hasAttribute('open')) {
          this.lazyLoadContent(item);
        }
      });

      // *** CRITICAL: Update accordion headers with correct PART labels ***
      this.updateHeaders();
    },

    /**
     * Update accordion headers with correct PART labels and titles
     * This fixes "SECTION 01" → "PART I" etc.
     */
    updateHeaders() {
      document.querySelectorAll('.accordion-item').forEach((item) => {
        const id = item.id;
        const data = CONFIG.partData[id];
        if (!data) return;

        // Find header elements (supports multiple HTML structures)
        const partLabel = item.querySelector('.accordion-header__part, .accordion-header__label');
        const titleEl = item.querySelector('.accordion-header__title');
        const hookEl = item.querySelector('.accordion-header__hook, .accordion-header__subtitle');

        // Update PART label (SECTION 01 → PART I)
        if (partLabel) {
          partLabel.textContent = data.part;
        }

        // Update title
        if (titleEl) {
          // Check if title has hook as child or if it's standalone
          const hookChild = titleEl.querySelector('.accordion-header__hook');
          if (hookChild) {
            // Title structure: <h2>Title <span class="hook">hook</span></h2>
            const textNodes = Array.from(titleEl.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
            if (textNodes.length > 0) {
              textNodes[0].textContent = data.displayTitle + ' ';
            }
          } else {
            // Simple title
            titleEl.textContent = data.displayTitle;
          }
        }

        // Update hook/subtitle
        if (hookEl) {
          hookEl.textContent = data.hook;
        }
      });
    },

    handleToggle(event, item) {
      const willBeOpen = !item.hasAttribute('open');
      const accordionId = item.id;

      utils.haptic(willBeOpen ? 'open' : 'close');

      if (willBeOpen) {
        this.closeAllExcept(accordionId);
        cinema.show(accordionId);
        this.lazyLoadContent(item);
        stateManager.updateHash(accordionId);
        stateManager.save(accordionId, window.scrollY);

        setTimeout(() => {
          const header = item.querySelector('.accordion-header');
          if (header) {
            const rect = header.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.42) {
              header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 220);
      } else {
        stateManager.clearHash();
      }

      const title = CONFIG.partData[accordionId]?.title || accordionId;
      utils.track('Accordion', willBeOpen ? 'Open' : 'Close', title);
    },

    closeAllExcept(exceptId) {
      document.querySelectorAll('.accordion-item[open]').forEach((item) => {
        if (item.id !== exceptId) {
          item.removeAttribute('open');
        }
      });
    },

    lazyLoadContent(item) {
      const videos = item.querySelectorAll('.accordion-video-wrapper[data-loading="true"]');
      videos.forEach((wrapper) => {
        wrapper.addEventListener('click', () => this.loadVideo(wrapper), { once: true });
      });

      const images = item.querySelectorAll('img[data-src]');
      images.forEach((img) => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });

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
      wrapper.removeAttribute('data-loading');
      video.src = src;
      video.load();
      video.play().catch(() => {});
      utils.haptic('medium');
      utils.track('Video', 'Load', src);
    },

    openById(id) {
      const item = document.getElementById(id);
      if (item && !item.hasAttribute('open')) {
        this.closeAllExcept(id);
        item.setAttribute('open', '');
        this.lazyLoadContent(item);
        cinema.show(id);
        utils.haptic('open');
        stateManager.updateHash(id);
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

    toggleById(id) {
      const item = document.getElementById(id);
      if (!item) return;
      if (item.hasAttribute('open')) {
        this.closeById(id);
      } else {
        this.openById(id);
      }
    },

    closeAll() {
      document.querySelectorAll('.accordion-item[open]').forEach((item) => {
        item.removeAttribute('open');
      });
      stateManager.clearHash();
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // BUY BAR
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const buyBar = {
    element: null,

    init() {
      this.element = document.querySelector('.mobile-buy-bar');
      if (!this.element) return;

      window.addEventListener('scroll', utils.throttle(() => {
        this.check();
      }, CONFIG.throttleDelay), { passive: true });
    },

    check() {
      const hero = document.querySelector('.mobile-hero');
      if (!hero) return;

      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const scrollY = window.scrollY;
      const threshold = heroBottom * CONFIG.buyBar.scrollThreshold;

      if (scrollY > threshold && !state.buyBarVisible) {
        this.show();
      } else if (scrollY <= threshold && state.buyBarVisible) {
        this.hide();
      }
    },

    show() {
      if (!this.element || state.buyBarVisible) return;
      this.element.classList.add('visible');
      state.buyBarVisible = true;
    },

    hide() {
      if (!this.element || !state.buyBarVisible) return;
      this.element.classList.remove('visible');
      state.buyBarVisible = false;
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CTA TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const ctaTracking = {
    init() {
      document.querySelectorAll('[data-track-cta]').forEach((cta) => {
        cta.addEventListener('click', () => {
          const label = cta.getAttribute('data-track-label') || cta.textContent.trim();
          utils.haptic('tap');
          utils.track('CTA', 'Click', label);
        });
      });

      // Track share buttons
      document.querySelectorAll('.share-button, [data-share]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const shareType = btn.getAttribute('data-share') || 'book';
          let data;

          if (shareType === 'book') {
            data = shareManager.getBookShareData();
          } else {
            const accordionId = btn.closest('.accordion-item')?.id;
            data = shareManager.getSectionShareData(accordionId) || shareManager.getBookShareData();
          }

          await shareManager.share(data);
        });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PAGE VISIBILITY
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const visibility = {
    init() {
      document.addEventListener('visibilitychange', () => {
        state.pageVisible = !document.hidden;
        if (state.pageVisible) {
          if (state.particleSystem) state.particleSystem.start();
        } else {
          if (state.particleSystem) state.particleSystem.stop();
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
        setTimeout(() => this.onResize(), 180);
      });
    },

    onResize() {
      state.isMobile = window.innerWidth < 1024;
      if (state.particleSystem) {
        state.particleSystem.resize();
        state.particleSystem.createParticles();
      }
      buyBar.check();
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // SMOOTH SCROLL
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

            if (target.classList.contains('accordion-item') && !target.hasAttribute('open')) {
              setTimeout(() => {
                accordion.openById(target.id);
              }, 550);
            }
          }
        });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CONCEPTS CAROUSEL
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const conceptsCarousel = {
    init() {
      const carousels = document.querySelectorAll('.concepts-carousel, .accordion-concepts-carousel');

      carousels.forEach((carousel) => {
        carousel.addEventListener('scroll', utils.throttle(() => {
          const hint = carousel.parentElement?.querySelector('.concepts-hint, .carousel-swipe-hint');
          if (hint && carousel.scrollLeft > 55) {
            hint.style.opacity = '0';
            hint.style.pointerEvents = 'none';
          }
        }, 120), { passive: true });

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
  // CONCEPT CATEGORY EXCLUSIVE ACCORDION
  // When one category opens, others close automatically
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const conceptCategories = {
    init() {
      // Find all containers with exclusive accordion behavior
      const containers = document.querySelectorAll('[data-exclusive-accordion]');

      containers.forEach((container) => {
        const categories = container.querySelectorAll('.concept-category');

        categories.forEach((category) => {
          // Listen for toggle event on each category
          category.addEventListener('toggle', (e) => {
            // Only act when opening (not closing)
            if (category.hasAttribute('open')) {
              // Close all other categories in this container
              categories.forEach((otherCategory) => {
                if (otherCategory !== category && otherCategory.hasAttribute('open')) {
                  otherCategory.removeAttribute('open');
                }
              });

              // Haptic feedback
              utils.haptic('tap');

              // Track the interaction
              const title = category.querySelector('.concept-category__title')?.textContent || 'Unknown';
              utils.track('Concepts', 'OpenCategory', title);

              // Scroll category into view with offset
              setTimeout(() => {
                const headerHeight = 80;
                const rect = category.getBoundingClientRect();
                const scrollTop = window.pageYOffset + rect.top - headerHeight;

                window.scrollTo({
                  top: scrollTop,
                  behavior: 'smooth'
                });
              }, 100);
            }
          });
        });
      });

      console.log('[MobileAccordion] Concept category accordions initialized');
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // FAQ ACCORDION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const faqAccordion = {
    init() {
      const faqItems = document.querySelectorAll('.accordion-faq-item, .faq-item');
      
      faqItems.forEach((item) => {
        item.addEventListener('toggle', () => {
          if (item.open) {
            utils.haptic('light');
            utils.track('FAQ', 'Open', item.querySelector('summary')?.textContent || 'Unknown');
          }
        });
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const progressIndicator = {
    init() {
      const dots = document.querySelectorAll('.progress-dot');
      if (dots.length === 0) return;

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const accordionId = dot.getAttribute('data-accordion');
          if (accordionId) {
            accordion.openById(accordionId);
            utils.haptic('tap');
          }
        });
      });

      // Update active dot on scroll
      this.updateActiveDot();
      window.addEventListener('scroll', utils.throttle(() => {
        this.updateActiveDot();
      }, 150), { passive: true });
    },

    updateActiveDot() {
      const items = document.querySelectorAll('.accordion-item');
      const dots = document.querySelectorAll('.progress-dot');
      
      let activeIndex = 0;
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          activeIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  function init() {
    state.isMobile = window.innerWidth < 1024;
    
    if (!state.isMobile) {
      console.log('[MobileAccordion] Desktop detected, skipping mobile initialization');
      return;
    }

    console.log('[MobileAccordion] Initializing V6 ULTIMATE FINAL');

    // Force hero video autoplay on iOS Safari
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      // Ensure muted (required for autoplay)
      heroVideo.muted = true;
      heroVideo.setAttribute('muted', '');
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('webkit-playsinline', '');

      // Try to play immediately
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay blocked, try on first interaction
          const playOnInteraction = () => {
            heroVideo.play();
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
          document.addEventListener('click', playOnInteraction, { once: true });
        });
      }
      console.log('[MobileAccordion] Hero video autoplay initialized');
    }

    // Create particle canvas if needed
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
    stateManager.init();
    buyBar.init();
    ctaTracking.init();
    visibility.init();
    resize.init();
    smoothScroll.init();
    conceptsCarousel.init();
    conceptCategories.init();
    faqAccordion.init();
    progressIndicator.init();

    state.initialized = true;
    utils.track('Page', 'Load', 'Mobile');
    console.log('[MobileAccordion] Initialization complete ✓');
  }


  // ═══════════════════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════════════════

  window.MobileAccordion = {
    version: '6.0.0-final',

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

    // Share functionality
    share: (data) => shareManager.share(data),
    shareBook: () => shareManager.share(shareManager.getBookShareData()),
    shareSection: (id) => shareManager.share(shareManager.getSectionShareData(id)),

    // Navigation
    navigateTo: (hash) => {
      const id = CONFIG.hashMap[hash];
      if (id) accordion.openById(id);
    },

    // Utilities
    haptic: (pattern) => utils.haptic(pattern),
    track: (cat, action, label, val) => utils.track(cat, action, label, val),

    // State getters
    getState: () => ({
      initialized: state.initialized,
      isMobile: state.isMobile,
      buyBarVisible: state.buyBarVisible,
      pageVisible: state.pageVisible,
      particlesRunning: state.particleSystem?.running || false,
      shownCinemas: Array.from(state.shownCinemaIds),
    }),

    getPartData: () => CONFIG.partData,
    getHashMap: () => CONFIG.hashMap,

    reinit() {
      if (state.particleSystem) {
        state.particleSystem.destroy();
        state.particleSystem = null;
      }
      state.initialized = false;
      state.shownCinemaIds.clear();
      init();
    },

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
    utils.requestIdle(init, 60);
  }

})();
