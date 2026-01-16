/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INFINITE ARCHITECTS — ULTIMATE MOBILE ACCORDION ENGINE
 * Version: 4.0.0 ULTIMATE
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = {
    cinema: {
      enabled: true,
      duration: 1400,
      criticalParts: ['accordion-evidence', 'accordion-join'],
    },
    particles: {
      enabled: true,
      count: 40,
      connectionDistance: 80,
      speed: 0.25,
      size: { min: 1.5, max: 3.5 },
      glow: true,
      glowIntensity: 0.6,
    },
    haptics: {
      enabled: true,
      patterns: {
        light: 8, medium: 15, heavy: 30,
        success: [8, 40, 15], error: [40, 25, 40],
        open: [8, 25], close: 12,
      },
    },
    buyBar: { showAfterScroll: 0.3 },
    performance: { throttleScroll: 80, debounceResize: 200 },
  };

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════

  const state = {
    initialized: false,
    isMobile: false,
    accordions: new Map(),
    particleSystem: null,
    buyBarVisible: false,
    pageVisible: true,
  };

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════

  const utils = {
    throttle(fn, wait) {
      let lastTime = 0;
      return function(...args) {
        const now = performance.now();
        if (now - lastTime >= wait) {
          lastTime = now;
          requestAnimationFrame(() => fn.apply(this, args));
        }
      };
    },

    debounce(fn, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    haptic(pattern) {
      if (!CONFIG.haptics.enabled || !navigator.vibrate) return;
      const vibration = CONFIG.haptics.patterns[pattern];
      if (vibration) try { navigator.vibrate(vibration); } catch (e) {}
    },

    track(category, action, label = null) {
      if (typeof gtag === 'function') {
        gtag('event', action, { event_category: category, event_label: label });
      }
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════════════════

  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.particles = [];
      this.mouse = { x: -1000, y: -1000 };
      this.animationId = null;
      this.running = false;
      
      this.resize();
      this.createParticles();
      this.bindEvents();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;
      
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
    }

    createParticles() {
      this.particles = [];
      const { count, size } = CONFIG.particles;
      
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * CONFIG.particles.speed * 2,
          vy: (Math.random() - 0.5) * CONFIG.particles.speed * 2,
          size: size.min + Math.random() * (size.max - size.min),
          hue: 40 + (Math.random() - 0.5) * 15,
          saturation: 70 + (Math.random() - 0.5) * 10,
          lightness: 55 + (Math.random() - 0.5) * 10,
          alpha: 0.4 + Math.random() * 0.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
        });
      }
    }

    bindEvents() {
      this.canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.parentElement.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }

    update() {
      this.particles.forEach(p => {
        p.pulsePhase += p.pulseSpeed;
        p.currentAlpha = p.alpha * (Math.sin(p.pulsePhase) * 0.3 + 0.7);
        
        // Mouse interaction
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        
        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > CONFIG.particles.speed * 2) {
          p.vx = (p.vx / speed) * CONFIG.particles.speed * 2;
          p.vy = (p.vy / speed) * CONFIG.particles.speed * 2;
        }
        
        // Wrap
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
        if (p.y < -10) p.y = this.height + 10;
        if (p.y > this.height + 10) p.y = -10;
      });
    }

    draw() {
      const ctx = this.ctx;
      const { connectionDistance, glow, glowIntensity } = CONFIG.particles;
      
      ctx.clearRect(0, 0, this.width, this.height);
      
      // Draw connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.35 * Math.min(p1.currentAlpha, p2.currentAlpha);
            ctx.strokeStyle = `hsla(40, 60%, 50%, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particles
      this.particles.forEach(p => {
        if (glow) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
          gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha * glowIntensity})`);
          gradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentAlpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    animate() {
      if (!this.running || !state.pageVisible) return;
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.animate();
    }

    stop() {
      this.running = false;
      if (this.animationId) cancelAnimationFrame(this.animationId);
    }

    destroy() {
      this.stop();
      this.particles = [];
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CINEMATIC OVERLAY
  // ═══════════════════════════════════════════════════════════════

  const cinema = {
    overlay: null,
    timeout: null,
    isShowing: false,

    create() {
      if (this.overlay) return;
      
      this.overlay = document.createElement('div');
      this.overlay.className = 'cinema-overlay';
      this.overlay.innerHTML = `
        <span class="cinema-overlay__part"></span>
        <div class="cinema-overlay__divider"></div>
        <span class="cinema-overlay__title"></span>
        <span class="cinema-overlay__hook"></span>
      `;
      this.overlay.addEventListener('click', () => this.hide());
      document.body.appendChild(this.overlay);
    },

    show(partLabel, title, hook) {
      if (!CONFIG.cinema.enabled || !this.overlay || this.isShowing) return;
      
      this.isShowing = true;
      this.overlay.querySelector('.cinema-overlay__part').textContent = partLabel;
      this.overlay.querySelector('.cinema-overlay__title').textContent = title;
      this.overlay.querySelector('.cinema-overlay__hook').textContent = hook;
      
      this.overlay.classList.remove('active');
      void this.overlay.offsetWidth;
      this.overlay.classList.add('active');
      
      document.body.style.overflow = 'hidden';
      utils.haptic('success');
      
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.hide(), CONFIG.cinema.duration);
    },

    hide() {
      if (!this.overlay) return;
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.isShowing = false;
    },

    destroy() {
      clearTimeout(this.timeout);
      if (this.overlay) this.overlay.remove();
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // ACCORDION MANAGER
  // ═══════════════════════════════════════════════════════════════

  const accordionManager = {
    init() {
      document.querySelectorAll('.accordion-item').forEach((accordion) => {
        const id = accordion.id;
        const summary = accordion.querySelector('.accordion-header');
        
        state.accordions.set(id, {
          element: accordion,
          isOpen: accordion.hasAttribute('open'),
          hasAnimated: false,
        });
        
        summary.addEventListener('click', (e) => this.handleToggle(e, id));
        
        if (accordion.hasAttribute('open')) {
          this.onOpen(id, state.accordions.get(id), false);
        }
      });
    },

    handleToggle(event, id) {
      const data = state.accordions.get(id);
      if (!data) return;
      
      const willBeOpen = !data.element.hasAttribute('open');
      utils.haptic(willBeOpen ? 'open' : 'close');
      
      if (willBeOpen) this.onOpen(id, data, true);
      else this.onClose(id, data);
      
      data.isOpen = willBeOpen;
      utils.track('Accordion', willBeOpen ? 'Open' : 'Close', id);
    },

    onOpen(id, data, showCinema = true) {
      if (showCinema && CONFIG.cinema.criticalParts.includes(id) && !data.hasAnimated) {
        const label = data.element.querySelector('.accordion-header__label')?.textContent || '';
        const title = data.element.querySelector('.accordion-header__title')?.textContent || '';
        const hook = data.element.querySelector('.accordion-header__subtitle')?.textContent || '';
        cinema.show(label, title, hook);
      }
      
      data.hasAnimated = true;
      this.lazyLoadContent(data.element);
      
      if (showCinema) {
        const delay = CONFIG.cinema.enabled && CONFIG.cinema.criticalParts.includes(id) ? CONFIG.cinema.duration + 100 : 150;
        setTimeout(() => {
          const header = data.element.querySelector('.accordion-header');
          if (header) {
            const rect = header.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
              header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, delay);
      }
    },

    onClose(id, data) {},

    lazyLoadContent(accordion) {
      accordion.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      
      accordion.querySelectorAll('.video-placeholder:not(.loaded)').forEach(placeholder => {
        placeholder.classList.add('loaded');
        placeholder.addEventListener('click', () => this.loadVideo(placeholder), { once: true });
      });
    },

    loadVideo(placeholder) {
      const wrapper = placeholder.closest('.video-wrapper');
      const src = placeholder.getAttribute('data-video-src');
      if (!src || !wrapper) return;
      
      utils.haptic('medium');
      utils.track('Video', 'Play', src);
      
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      
      placeholder.style.opacity = '0';
      setTimeout(() => {
        wrapper.innerHTML = '';
        wrapper.appendChild(iframe);
      }, 200);
    },

    openById(id) {
      const data = state.accordions.get(id);
      if (data && !data.isOpen) {
        data.element.setAttribute('open', '');
        this.onOpen(id, data, true);
        data.isOpen = true;
      }
    },

    closeById(id) {
      const data = state.accordions.get(id);
      if (data && data.isOpen) {
        data.element.removeAttribute('open');
        this.onClose(id, data);
        data.isOpen = false;
      }
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // BUY BAR
  // ═══════════════════════════════════════════════════════════════

  const buyBar = {
    element: null,

    init() {
      this.element = document.querySelector('.buy-bar');
      if (!this.element) return;
      
      window.addEventListener('scroll', utils.throttle(() => this.check(), CONFIG.performance.throttleScroll), { passive: true });
      this.check();
    },

    check() {
      const hero = document.querySelector('.mobile-hero');
      if (!hero) return;
      
      const scrolled = -hero.getBoundingClientRect().top / hero.offsetHeight;
      const shouldShow = scrolled > CONFIG.buyBar.showAfterScroll;
      
      if (shouldShow !== state.buyBarVisible) {
        state.buyBarVisible = shouldShow;
        shouldShow ? this.show() : this.hide();
      }
    },

    show() {
      if (this.element) this.element.classList.add('visible');
    },

    hide() {
      if (this.element) this.element.classList.remove('visible');
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // SHARE MANAGER
  // ═══════════════════════════════════════════════════════════════

  const shareManager = {
    init() {
      document.querySelectorAll('[data-share="tweet"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.tweet(btn.getAttribute('data-text'));
        });
      });
      
      document.querySelectorAll('[data-share="copy"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.copy(btn.getAttribute('data-text'), btn);
        });
      });
    },

    tweet(text) {
      const defaultText = '"The creator is not behind us." — Infinite Architects\nhttps://michaeldariuseastwood.com';
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text || defaultText)}`, '_blank', 'width=550,height=420');
      utils.haptic('success');
      utils.track('Share', 'Tweet');
    },

    async copy(text, button) {
      const defaultText = '"I am my own first experiment. The results have surprised even me." — Michael Darius Eastwood';
      try {
        await navigator.clipboard.writeText(text || defaultText);
        utils.haptic('success');
        utils.track('Share', 'Copy');
        
        const span = button.querySelector('span');
        if (span) {
          const original = span.textContent;
          span.textContent = 'Copied!';
          setTimeout(() => { span.textContent = original; }, 1500);
        }
      } catch (e) {
        utils.haptic('error');
      }
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handlers = {
    visibility() {
      document.addEventListener('visibilitychange', () => {
        state.pageVisible = !document.hidden;
        if (state.pageVisible && state.particleSystem) state.particleSystem.start();
        else if (state.particleSystem) state.particleSystem.stop();
      });
    },

    resize() {
      window.addEventListener('resize', utils.debounce(() => {
        if (state.particleSystem) {
          state.particleSystem.resize();
          state.particleSystem.createParticles();
        }
      }, CONFIG.performance.debounceResize));
    },

    smoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            utils.haptic('light');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (target.classList.contains('accordion-item')) {
              setTimeout(() => accordionManager.openById(target.id), 500);
            }
          }
        });
      });
    },

    ctaTracking() {
      document.querySelectorAll('[data-analytics]').forEach(el => {
        el.addEventListener('click', () => {
          utils.haptic('medium');
          utils.track('CTA', 'Click', el.getAttribute('data-analytics'));
        });
      });
    },
  };

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    state.isMobile = window.innerWidth < 1024;
    if (!state.isMobile) return;

    console.log('[InfiniteArchitects] Initializing v4.0.0');

    cinema.create();

    const particleCanvas = document.querySelector('.mobile-hero__particles');
    if (particleCanvas && CONFIG.particles.enabled) {
      state.particleSystem = new ParticleSystem(particleCanvas);
      state.particleSystem.start();
    }

    accordionManager.init();
    buyBar.init();
    shareManager.init();
    handlers.visibility();
    handlers.resize();
    handlers.smoothScroll();
    handlers.ctaTracking();

    state.initialized = true;
    utils.track('Page', 'Load', 'Mobile');
    console.log('[InfiniteArchitects] Ready');
  }

  // ═══════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════

  window.InfiniteArchitects = {
    version: '4.0.0',
    openAccordion: (id) => accordionManager.openById(id),
    closeAccordion: (id) => accordionManager.closeById(id),
    showBuyBar: () => buyBar.show(),
    hideBuyBar: () => buyBar.hide(),
    showCinema: (part, title, hook) => cinema.show(part, title, hook),
    hideCinema: () => cinema.hide(),
    pauseParticles: () => state.particleSystem?.stop(),
    resumeParticles: () => state.particleSystem?.start(),
    haptic: (pattern) => utils.haptic(pattern),
    track: (cat, act, label) => utils.track(cat, act, label),
  };

  // ═══════════════════════════════════════════════════════════════
  // DOM READY
  // ═══════════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }

})();
