/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INFINITE ARCHITECTS — MOBILE ACCORDION CONTROLLER
 * Digital Consulate Interface JavaScript
 * 
 * PRODUCTION VERSION: January 16, 2026
 * INCLUDES: Haptic feedback, lazy loading, analytics tracking
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────────
  const CONFIG = {
    breakpoint: 1023,
    buyBarScrollThreshold: 0.25,
    selectors: {
      mobileExperience: '.mobile-experience',
      accordionContainer: '.accordion-container',
      accordionItem: '.accordion-item',
      accordionContent: '.accordion-content',
      buyBar: '.mobile-buy-bar',
      hero: '.mobile-hero',
      lazyVideo: '[data-src]',
      heavyAsset: '[data-heavy-asset]'
    },
    analytics: {
      enabled: true,
      events: {
        accordionOpen: 'accordion_open',
        accordionClose: 'accordion_close',
        videoPlay: 'video_play',
        ctaClick: 'cta_click'
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const state = {
    isMobile: false,
    buyBarVisible: false,
    buyBarShownOnce: false,
    loadedAssets: new Set(),
    openAccordions: new Set()
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────
  
  function debounce(fn, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function trackEvent(eventName, params = {}) {
    if (!CONFIG.analytics.enabled) return;
    
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    
    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName, params);
    }
    
    // Microsoft Clarity
    if (typeof clarity === 'function') {
      clarity('set', eventName, JSON.stringify(params));
    }
    
    // Console log for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Analytics]', eventName, params);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HAPTIC FEEDBACK — Apple-grade tactile response
  // ─────────────────────────────────────────────────────────────────────────────
  
  function hapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    
    const patterns = {
      light: 10,      // Quick tap
      medium: 20,     // Standard interaction
      heavy: 40,      // Important action
      success: [10, 50, 20] // Success pattern
    };
    
    navigator.vibrate(patterns[type] || patterns.light);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LAZY LOADING
  // ─────────────────────────────────────────────────────────────────────────────
  
  function loadVideo(video) {
    if (!video || state.loadedAssets.has(video)) return;
    
    const dataSrc = video.getAttribute('data-src');
    if (!dataSrc) return;
    
    video.src = dataSrc;
    video.removeAttribute('data-src');
    
    video.querySelectorAll('source[data-src]').forEach(source => {
      source.src = source.getAttribute('data-src');
      source.removeAttribute('data-src');
    });
    
    video.load();
    state.loadedAssets.add(video);
    
    const wrapper = video.closest('.accordion-video-wrapper');
    if (wrapper) {
      wrapper.removeAttribute('data-loading');
    }
    
    video.addEventListener('play', () => {
      trackEvent(CONFIG.analytics.events.videoPlay, {
        video_id: video.id || 'bbc-evidence',
        section: video.closest('.accordion-item')?.id || 'unknown'
      });
    });
  }

  function loadHeavyAsset(element) {
    if (!element || state.loadedAssets.has(element)) return;
    
    const assetType = element.getAttribute('data-heavy-asset');
    
    switch (assetType) {
      case 'equation-particles':
        initEquationParticles(element);
        break;
      default:
        console.warn('[LazyLoad] Unknown asset type:', assetType);
    }
    
    state.loadedAssets.add(element);
  }

  function initEquationParticles(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth || 300;
    canvas.height = 150;
    canvas.style.cssText = 'width: 100%; height: 150px; display: block;';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2
      });
    }
    
    let animationId;
    let isAnimating = true;
    
    function animate() {
      if (!isAnimating) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 75, ${p.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    const accordion = container.closest('.accordion-item');
    if (accordion) {
      accordion.addEventListener('toggle', (e) => {
        if (!e.target.open) {
          isAnimating = false;
          if (animationId) cancelAnimationFrame(animationId);
        } else {
          isAnimating = true;
          animate();
        }
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ACCORDION CONTROLLER
  // ─────────────────────────────────────────────────────────────────────────────
  
  function initAccordions() {
    const accordions = document.querySelectorAll(CONFIG.selectors.accordionItem);
    
    accordions.forEach(accordion => {
      accordion.addEventListener('toggle', handleAccordionToggle);
      
      // Add haptic feedback on summary click
      const summary = accordion.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', () => {
          hapticFeedback('light');
        });
      }
    });
  }

  function handleAccordionToggle(event) {
    const accordion = event.target;
    const id = accordion.id || 'unnamed';
    const content = accordion.querySelector(CONFIG.selectors.accordionContent);
    
    if (accordion.open) {
      state.openAccordions.add(id);
      
      // Lazy load content
      const inner = content?.querySelector('.accordion-content__inner');
      if (inner) {
        inner.querySelectorAll(CONFIG.selectors.lazyVideo).forEach(loadVideo);
        inner.querySelectorAll(CONFIG.selectors.heavyAsset).forEach(loadHeavyAsset);
      }
      
      // Smooth scroll into view
      setTimeout(() => {
        const rect = accordion.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
          accordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      trackEvent(CONFIG.analytics.events.accordionOpen, { section_id: id });
      
    } else {
      state.openAccordions.delete(id);
      trackEvent(CONFIG.analytics.events.accordionClose, { section_id: id });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BUY BAR CONTROLLER
  // ─────────────────────────────────────────────────────────────────────────────
  
  function initBuyBar() {
    const buyBar = document.querySelector(CONFIG.selectors.buyBar);
    const hero = document.querySelector(CONFIG.selectors.hero);
    
    if (!buyBar || !hero) return;
    
    const heroHeight = hero.offsetHeight;
    const threshold = heroHeight * CONFIG.buyBarScrollThreshold;
    
    function updateBuyBar() {
      const scrollY = window.scrollY;
      
      // Once shown, keep it shown forever
      if (scrollY > threshold) {
        state.buyBarShownOnce = true;
      }
      
      if (state.buyBarShownOnce && !state.buyBarVisible) {
        buyBar.classList.add('visible');
        state.buyBarVisible = true;
        hapticFeedback('light');
      }
    }
    
    window.addEventListener('scroll', throttle(updateBuyBar, 100), { passive: true });
    updateBuyBar();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CTA TRACKING
  // ─────────────────────────────────────────────────────────────────────────────
  
  function initCTATracking() {
    document.querySelectorAll('[data-analytics]').forEach(el => {
      el.addEventListener('click', () => {
        trackEvent(CONFIG.analytics.events.ctaClick, {
          cta_id: el.getAttribute('data-analytics'),
          location: el.closest('.accordion-item')?.id || 'hero'
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIDEO CLICK-TO-LOAD
  // ─────────────────────────────────────────────────────────────────────────────
  
  function initVideoClickToLoad() {
    document.querySelectorAll('.accordion-video-wrapper[data-loading="true"]').forEach(wrapper => {
      wrapper.addEventListener('click', function() {
        const video = this.querySelector('video');
        if (video) {
          loadVideo(video);
          video.play().catch(() => {
            // Autoplay blocked, that's fine
          });
        }
        hapticFeedback('medium');
      }, { once: true });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEWPORT HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  
  function handleViewportChange() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth <= CONFIG.breakpoint;
    
    if (wasMobile !== state.isMobile) {
      console.log('[MobileAccordion] Viewport:', state.isMobile ? 'Mobile' : 'Desktop');
      
      if (!state.isMobile) {
        state.buyBarVisible = false;
        state.buyBarShownOnce = false;
        document.querySelector(CONFIG.selectors.buyBar)?.classList.remove('visible');
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  
  function init() {
    console.log('[MobileAccordion] Initializing...');
    
    handleViewportChange();
    
    if (state.isMobile) {
      initAccordions();
      initBuyBar();
      initCTATracking();
      initVideoClickToLoad();
    }
    
    window.addEventListener('resize', debounce(handleViewportChange, 250));
    
    console.log('[MobileAccordion] Ready');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────────
  
  window.MobileAccordion = {
    openAccordion: (id) => {
      const accordion = document.getElementById(id);
      if (accordion) {
        accordion.open = true;
        accordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        hapticFeedback('light');
      }
    },
    closeAccordion: (id) => {
      const accordion = document.getElementById(id);
      if (accordion) accordion.open = false;
    },
    getState: () => ({ ...state }),
    setDebug: (enabled) => { CONFIG.analytics.enabled = enabled; }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // START
  // ─────────────────────────────────────────────────────────────────────────────
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
