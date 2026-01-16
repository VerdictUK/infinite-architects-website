/**
 * INTEGRATIONS - Premium Features for Infinite Architects
 *
 * Microsoft Clarity - Heatmaps & session recordings
 * Live Presence - "X people reading now"
 * Instant Search - Algolia-powered search
 * Email Capture - Newsletter subscription
 * Turnstile - Bot protection
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const CONFIG = {
    // Microsoft Clarity (set via data attribute or replace here)
    clarityId: document.body.dataset.clarityId || null,

    // Turnstile (set via data attribute)
    turnstileSiteKey: document.body.dataset.turnstileSiteKey || null,

    // Pusher (set via data attributes)
    pusherKey: document.body.dataset.pusherKey || null,
    pusherCluster: document.body.dataset.pusherCluster || 'eu',

    // API endpoints
    endpoints: {
      subscribe: '/api/subscribe',
      presence: '/api/presence',
      search: '/api/search',
      healthCheck: '/api/health-check'
    },

    // Presence heartbeat interval
    heartbeatInterval: 30000 // 30 seconds
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // MICROSOFT CLARITY
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const Clarity = {
    init() {
      if (!CONFIG.clarityId) {
        console.log('[Clarity] No project ID configured');
        return;
      }

      // Inject Clarity script
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", CONFIG.clarityId);

      console.log('[Clarity] Initialized');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // LIVE PRESENCE COUNTER
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const Presence = {
    visitorId: null,
    heartbeatTimer: null,
    pusher: null,
    channel: null,
    countElement: null,

    init() {
      // Generate unique visitor ID
      this.visitorId = this.getOrCreateVisitorId();

      // Find count display element
      this.countElement = document.getElementById('live-visitor-count');

      // Join presence
      this.join();

      // Setup heartbeat
      this.heartbeatTimer = setInterval(() => this.heartbeat(), CONFIG.heartbeatInterval);

      // Setup Pusher for real-time updates if configured
      if (CONFIG.pusherKey && window.Pusher) {
        this.initPusher();
      }

      // Leave on page unload
      window.addEventListener('beforeunload', () => this.leave());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.leave();
        } else {
          this.join();
        }
      });

      console.log('[Presence] Initialized');
    },

    getOrCreateVisitorId() {
      let id = sessionStorage.getItem('ia-visitor-id');
      if (!id) {
        id = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        sessionStorage.setItem('ia-visitor-id', id);
      }
      return id;
    },

    async join() {
      try {
        const response = await fetch(CONFIG.endpoints.presence, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'join',
            visitorId: this.visitorId,
            page: window.location.pathname
          })
        });
        const data = await response.json();
        this.updateCount(data.count);
      } catch (error) {
        console.warn('[Presence] Join failed:', error);
      }
    },

    async heartbeat() {
      if (document.hidden) return;

      try {
        const response = await fetch(CONFIG.endpoints.presence, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'heartbeat',
            visitorId: this.visitorId,
            page: window.location.pathname
          })
        });
        const data = await response.json();
        this.updateCount(data.count);
      } catch (error) {
        console.warn('[Presence] Heartbeat failed:', error);
      }
    },

    async leave() {
      try {
        navigator.sendBeacon(CONFIG.endpoints.presence, JSON.stringify({
          action: 'leave',
          visitorId: this.visitorId
        }));
      } catch (error) {
        // Ignore leave errors
      }
    },

    initPusher() {
      try {
        this.pusher = new Pusher(CONFIG.pusherKey, {
          cluster: CONFIG.pusherCluster
        });

        this.channel = this.pusher.subscribe('infinite-architects');
        this.channel.bind('presence-update', (data) => {
          this.updateCount(data.count);
        });

        console.log('[Presence] Pusher connected');
      } catch (error) {
        console.warn('[Presence] Pusher init failed:', error);
      }
    },

    updateCount(count) {
      if (this.countElement) {
        this.countElement.textContent = count;
        this.countElement.classList.toggle('hidden', count < 2);
      }

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('presence-update', { detail: { count } }));
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // INSTANT SEARCH
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const Search = {
    input: null,
    results: null,
    debounceTimer: null,

    init() {
      this.input = document.getElementById('instant-search');
      this.results = document.getElementById('search-results');

      if (!this.input) {
        console.log('[Search] No search input found');
        return;
      }

      this.input.addEventListener('input', (e) => this.handleInput(e));
      this.input.addEventListener('focus', () => this.showResults());

      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.input.contains(e.target) && !this.results?.contains(e.target)) {
          this.hideResults();
        }
      });

      // Keyboard navigation
      this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

      console.log('[Search] Initialized');
    },

    handleInput(e) {
      const query = e.target.value.trim();

      clearTimeout(this.debounceTimer);

      if (query.length < 2) {
        this.hideResults();
        return;
      }

      this.debounceTimer = setTimeout(() => this.search(query), 150);
    },

    async search(query) {
      try {
        const response = await fetch(`${CONFIG.endpoints.search}?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.success && data.results.length > 0) {
          this.renderResults(data.results);
        } else {
          this.renderNoResults();
        }
      } catch (error) {
        console.error('[Search] Error:', error);
        this.hideResults();
      }
    },

    renderResults(results) {
      if (!this.results) return;

      const html = results.map((result, index) => `
        <button class="search-result" data-index="${index}" data-chapter="${result.chapter}">
          <span class="search-result__type">${result.type}</span>
          <span class="search-result__name">${result.name}</span>
          ${result.description ? `<span class="search-result__desc">${result.description.slice(0, 100)}...</span>` : ''}
        </button>
      `).join('');

      this.results.innerHTML = html;
      this.showResults();

      // Add click handlers
      this.results.querySelectorAll('.search-result').forEach(btn => {
        btn.addEventListener('click', () => this.selectResult(btn));
      });
    },

    renderNoResults() {
      if (!this.results) return;
      this.results.innerHTML = '<div class="search-no-results">No results found</div>';
      this.showResults();
    },

    selectResult(btn) {
      const chapter = btn.dataset.chapter;
      // Scroll to relevant section or open accordion
      if (chapter) {
        const accordion = document.querySelector(`[data-chapter="${chapter}"]`);
        if (accordion) {
          accordion.scrollIntoView({ behavior: 'smooth' });
          // Open accordion if it's a details element
          if (accordion.tagName === 'DETAILS') {
            accordion.open = true;
          }
        }
      }
      this.hideResults();
      this.input.value = '';
    },

    handleKeydown(e) {
      if (!this.results || this.results.classList.contains('hidden')) return;

      const items = this.results.querySelectorAll('.search-result');
      const current = this.results.querySelector('.search-result--active');
      let index = current ? parseInt(current.dataset.index) : -1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          index = Math.min(index + 1, items.length - 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          index = Math.max(index - 1, 0);
          break;
        case 'Enter':
          if (current) {
            e.preventDefault();
            this.selectResult(current);
          }
          return;
        case 'Escape':
          this.hideResults();
          return;
        default:
          return;
      }

      items.forEach(item => item.classList.remove('search-result--active'));
      if (items[index]) {
        items[index].classList.add('search-result--active');
        items[index].scrollIntoView({ block: 'nearest' });
      }
    },

    showResults() {
      this.results?.classList.remove('hidden');
    },

    hideResults() {
      this.results?.classList.add('hidden');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // EMAIL SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const Subscribe = {
    form: null,
    turnstileWidget: null,

    init() {
      this.form = document.getElementById('subscribe-form');

      if (!this.form) {
        console.log('[Subscribe] No form found');
        return;
      }

      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Load Turnstile if configured
      if (CONFIG.turnstileSiteKey) {
        this.loadTurnstile();
      }

      console.log('[Subscribe] Initialized');
    },

    loadTurnstile() {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        const container = this.form.querySelector('.turnstile-container');
        if (container && window.turnstile) {
          this.turnstileWidget = turnstile.render(container, {
            sitekey: CONFIG.turnstileSiteKey,
            theme: 'dark',
            callback: (token) => {
              this.form.dataset.turnstileToken = token;
            }
          });
        }
      };
    },

    async handleSubmit(e) {
      e.preventDefault();

      const emailInput = this.form.querySelector('input[type="email"]');
      const nameInput = this.form.querySelector('input[name="name"]');
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const messageEl = this.form.querySelector('.subscribe-message');

      const email = emailInput?.value.trim();
      const name = nameInput?.value.trim();

      if (!email) {
        this.showMessage(messageEl, 'Please enter your email address', 'error');
        return;
      }

      // Disable button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';

      try {
        const response = await fetch(CONFIG.endpoints.subscribe, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            turnstileToken: this.form.dataset.turnstileToken
          })
        });

        const data = await response.json();

        if (data.success) {
          this.showMessage(messageEl, data.message || 'Welcome! Check your inbox.', 'success');
          emailInput.value = '';
          if (nameInput) nameInput.value = '';

          // Track conversion
          if (window.clarity) {
            clarity('set', 'subscribed', 'true');
          }
          if (window.gtag) {
            gtag('event', 'subscribe', { method: 'email' });
          }
        } else {
          this.showMessage(messageEl, data.message || 'Something went wrong. Please try again.', 'error');
        }
      } catch (error) {
        console.error('[Subscribe] Error:', error);
        this.showMessage(messageEl, 'Network error. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';

        // Reset Turnstile
        if (this.turnstileWidget && window.turnstile) {
          turnstile.reset(this.turnstileWidget);
        }
      }
    },

    showMessage(el, text, type) {
      if (!el) return;
      el.textContent = text;
      el.className = `subscribe-message subscribe-message--${type}`;
      el.classList.remove('hidden');

      setTimeout(() => {
        el.classList.add('hidden');
      }, 5000);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // HEALTH CHECK
  // ═══════════════════════════════════════════════════════════════════════════════════════

  const HealthCheck = {
    async run() {
      try {
        const response = await fetch(CONFIG.endpoints.healthCheck);
        const data = await response.json();

        console.log('[HealthCheck] Status:', data.status);
        console.log('[HealthCheck] Services:', data.services?.map(s => `${s.name}: ${s.status}`).join(', '));

        if (data.recommendations?.length > 0) {
          console.log('[HealthCheck] Recommendations:', data.recommendations);
        }

        return data;
      } catch (error) {
        console.error('[HealthCheck] Failed:', error);
        return null;
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════════════

  function init() {
    // Initialize all integrations
    Clarity.init();
    Presence.init();
    Search.init();
    Subscribe.init();

    // Run health check in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      HealthCheck.run();
    }

    console.log('[Integrations] All systems initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to global scope for debugging
  window.IAIntegrations = {
    Clarity,
    Presence,
    Search,
    Subscribe,
    HealthCheck,
    CONFIG
  };

})();
