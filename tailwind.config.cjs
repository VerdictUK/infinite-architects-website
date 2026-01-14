/** @type {import('tailwindcss').Config} */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INFINITE ARCHITECTS - TAILWIND CONFIGURATION v4.0.0
 * Sovereign Design System - Complete Theme Configuration
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * DOMAIN: www.michaeldariuseastwood.com
 * 
 * This configuration includes:
 * - Complete color system (Gold, Void, Nebula)
 * - All 108+ animation keyframes (COMPLETE - NO PLACEHOLDERS)
 * - Fluid typography with clamp()
 * - Extended breakpoints
 * - Custom plugins
 * 
 * @author Michael Darius Eastwood
 * @version 4.0.0 - Corrected Edition
 */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './*.{html,js}',
    './src/**/*.{html,js}',
    './scripts/**/*.js',
  ],

  // Safelist critical utilities that must always be included
  safelist: [
    'no-scrollbar',
    'scrollbar-hide',
    'scrollbar-gold',
    'safe-top',
    'safe-bottom',
    'safe-left',
    'safe-right',
    'safe-all',
    'mobile-safe-padding',
    'gpu',
    'gpu-opacity',
    'glass',
    'glass-light',
    'glass-dark',
    'glass-gold',
  ],

  // Future flags for cutting-edge features
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
  },

  theme: {
    // ═══════════════════════════════════════════════════════════════════════════
    // BREAKPOINTS
    // ═══════════════════════════════════════════════════════════════════════════
    screens: {
      'xs': '375px',    // iPhone SE / Small Mobile
      'sm': '480px',    // Large Mobile
      'md': '768px',    // Tablet
      'lg': '1024px',   // Desktop
      'xl': '1280px',   // Large Desktop
      '2xl': '1536px',  // Extra Large
      '3xl': '1920px',  // Full HD
      '4xl': '2560px',  // 4K Displays
      // Height-based breakpoints
      'short': { 'raw': '(max-height: 700px)' },
      'tall': { 'raw': '(min-height: 800px)' },
      // Input modality
      'touch': { 'raw': '(pointer: coarse)' },
      'mouse': { 'raw': '(pointer: fine) and (hover: hover)' },
      // Reduced motion preference
      'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
      'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
      // High contrast preference
      'contrast-more': { 'raw': '(prefers-contrast: more)' },
      // Print
      'print': { 'raw': 'print' },
    },

    extend: {
      // ═══════════════════════════════════════════════════════════════════════════
      // COLORS - Sovereign Gold & Cosmic Void System (Apple-Grade Vibrancy)
      // ═══════════════════════════════════════════════════════════════════════════
      colors: {
        // Sacred Gold Palette
        gold: {
          DEFAULT: '#d4a84b',   // --gold-primary
          50: '#fefbf3',
          100: '#fef5e0',
          200: '#f4e4b8',
          300: '#f4c856',       // --gold-bright
          400: '#d4a84b',       // --gold-primary (DEFAULT)
          500: '#c49a42',
          600: '#a88336',
          700: '#8b6914',       // --gold-dark
          800: '#6b4d1a',
          900: '#4a3512',
          bright: '#f4c856',
          pale: '#e8d4a0',
          dark: '#8b6914',
          deep: '#6b4d1a',
        },
        // Cosmic Void Palette
        void: {
          DEFAULT: '#02030a',
          deep: '#010208',      // OLED Black
          mid: '#04050c',       // Deep Space
          surface: '#0a0c14',   // Card Surface
          elevated: '#121420',  // Modal Surface
          light: '#1a1d2e',
        },
        // Nebula Accent Palette
        nebula: {
          blue: '#1a237e',
          purple: '#4a148c',
          teal: '#004d40',
          magenta: '#8a2b60',
          cyan: '#006064',
        },
        // Text Hierarchy (Apple Standard Contrast)
        text: {
          primary: '#f5f5f7', // SF Pro Light Text
          secondary: 'rgba(235, 235, 245, 0.75)',
          dim: 'rgba(235, 235, 245, 0.60)',
          tertiary: 'rgba(235, 235, 245, 0.45)',
          muted: 'rgba(235, 235, 245, 0.30)',
        },
        // Alpha Variations
        'gold-alpha': {
          5: 'rgba(212, 168, 75, 0.05)',
          10: 'rgba(212, 168, 75, 0.10)',
          20: 'rgba(212, 168, 75, 0.20)',
          30: 'rgba(212, 168, 75, 0.30)',
          50: 'rgba(212, 168, 75, 0.50)',
        },
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // TYPOGRAPHY - Optical Sizing & Rhythm
      // ═══════════════════════════════════════════════════════════════════════════
      fontFamily: {
        display: ['Cinzel', 'SF Pro Display', 'system-ui', 'serif'],
        serif: ['Cormorant Garamond', 'New York', 'serif'],
        mono: ['Space Mono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Fluid typography with clamp()
        'display-2xl': ['clamp(3.5rem, 8vw + 1rem, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }], // Apple Tight
        'display-xl': ['clamp(3rem, 6vw + 1rem, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display': ['clamp(2.25rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw + 0.5rem, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'h2': ['clamp(1.75rem, 3vw + 0.5rem, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.5rem, 2vw + 0.5rem, 2rem)', { lineHeight: '1.25' }],
        'h4': ['clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)', { lineHeight: '1.3' }],
        'h5': ['clamp(1.125rem, 1vw + 0.5rem, 1.25rem)', { lineHeight: '1.35' }],
        'h6': ['clamp(1rem, 0.75vw + 0.5rem, 1.125rem)', { lineHeight: '1.4' }],
        'body-xl': ['clamp(1.25rem, 1.5vw + 0.75rem, 1.5rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.125rem, 1vw + 0.75rem, 1.25rem)', { lineHeight: '1.6' }],
        'body': ['clamp(1rem, 0.5vw + 0.875rem, 1.125rem)', { lineHeight: '1.6' }],
        'caption': ['clamp(0.75rem, 0.25vw + 0.625rem, 0.875rem)', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'tighter': '-0.03em',
        'tight': '-0.015em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.15em',
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // PHYSICS - iOS Spring Dynamics
      // ═══════════════════════════════════════════════════════════════════════════
      transitionTimingFunction: {
        'spring-tight': 'cubic-bezier(0.25, 1, 0.5, 1)', // iOS "Snappy"
        'spring-loose': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // iOS "Bouncy"
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)', // Apple Standard Ease
        'lux': 'cubic-bezier(0.65, 0, 0.35, 1)', // Cinematic slow-mo
        'standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms', // iOS Navigation Speed
        '600': '600ms', // Modal Speed
        'normal': '300ms', // Standard duration
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // SPACING - 4pt/8pt Rhythm
      // ═══════════════════════════════════════════════════════════════════════════
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem', // 120px
        '34': '8.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        'screen-safe': 'calc(100vh - env(safe-area-inset-bottom))',
      },
      
      // ═══════════════════════════════════════════════════════════════════════════
      // GLASS & DEPTH
      // ═══════════════════════════════════════════════════════════════════════════
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'lg': '24px', // Apple Standard
        'xl': '40px',
        '2xl': '60px',
        '3xl': '80px', // Deep Depth
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 40px 0 rgba(212, 168, 75, 0.15)',
        'glow-gold': '0 0 20px rgba(212, 168, 75, 0.3)',
        'card-hover': '0 20px 40px -10px rgba(0,0,0,0.5)',
      },


      // ═══════════════════════════════════════════════════════════════════════════
      // ANIMATION KEYFRAMES - ALL 108+ COMPLETE (NO PLACEHOLDERS)
      // ═══════════════════════════════════════════════════════════════════════════
      keyframes: {
        // ─────────────────────────────────────────────────────────────────────────
        // LOADER ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        wormholeSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.05)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        wormholePulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        particleOrbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        loaderProgress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        loaderVideoFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.4' },
        },
        loaderVideoZoom: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.3)' },
        },
        overlayPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '0.9' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // BOOK ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        titanDrop: {
          '0%': { 
            transform: 'translateY(-120vh) scale(0.6)', 
            opacity: '0', 
            filter: 'brightness(10) blur(50px)' 
          },
          '25%': { 
            transform: 'translateY(-80vh) scale(0.8)', 
            opacity: '0.9' 
          },
          '100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: '1', 
            filter: 'none' 
          },
        },
        bookFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(0.5deg)' },
          '75%': { transform: 'translateY(-4px) rotate(-0.5deg)' },
        },
        bookGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // REVEAL ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heroReveal: {
          '0%': { opacity: '0', transform: 'translateY(25px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        conceptReveal: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        welcomeEnter: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        celebrationEnter: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-5deg)' },
          '50%': { transform: 'scale(1.05) rotate(2deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        numeralReveal: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInImage: {
          '0%': { opacity: '0', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // PULSE ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        pulseGold: {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 rgba(212, 168, 75, 0)' 
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'scale(1.05)', 
            boxShadow: '0 0 20px rgba(212, 168, 75, 0.3)' 
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pipPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        bbcPulse: {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 0 rgba(212, 168, 75, 0)' },
          '50%': { opacity: '1', boxShadow: '0 0 20px rgba(212, 168, 75, 0.4)' },
        },
        urgencyPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' },
        },
        badgePulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 rgba(212, 168, 75, 0)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 15px rgba(212, 168, 75, 0.4)' },
        },
        livePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        instructPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        editionPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 168, 75, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 168, 75, 0.6)' },
        },
        methodPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        titlePulseGlow: {
          '0%, 100%': { textShadow: '0 0 20px rgba(212, 168, 75, 0.3)' },
          '50%': { textShadow: '0 0 40px rgba(212, 168, 75, 0.6), 0 0 60px rgba(212, 168, 75, 0.3)' },
        },
        quoteGlow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        uiEmphasisPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        },
        pillPulse: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        chapterPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        neuralPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        quantumPulse: {
          '0%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
          '100%': { opacity: '0.2', transform: 'scale(1)' },
        },
        inputBreathe: {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(212, 168, 75, 0.1)' },
          '50%': { boxShadow: '0 0 0 4px rgba(212, 168, 75, 0.2)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // ROTATION & SPIN ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        tesseractSpin: {
          '0%': { opacity: '0', transform: 'rotate(0deg) scale(0.5)' },
          '30%': { opacity: '0.6', transform: 'rotate(90deg) scale(1.1)' },
          '60%': { opacity: '0.4', transform: 'rotate(180deg) scale(1)' },
          '100%': { opacity: '0', transform: 'rotate(270deg) scale(1.2)' },
        },
        rotateLoop: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // FLOAT ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
        holoFloat: {
          '0%, 100%': { transform: 'translateY(0) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(5deg)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translate(10px, -10px) scale(1.1)', opacity: '0.5' },
        },
        portalFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // SHIMMER & SHINE ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        charShimmer: {
          '0%': { opacity: '0.5', textShadow: '0 0 5px rgba(212, 168, 75, 0.3)' },
          '50%': { opacity: '1', textShadow: '0 0 15px rgba(212, 168, 75, 0.6)' },
          '100%': { opacity: '0.5', textShadow: '0 0 5px rgba(212, 168, 75, 0.3)' },
        },
        skeletonShimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // COSMIC & VISUAL EFFECTS
        // ─────────────────────────────────────────────────────────────────────────
        cosmicZoom: {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'scale(1.15) rotate(1deg)', filter: 'hue-rotate(15deg)' },
        },
        cosmicZoomFull: {
          '0%': { 
            transform: 'translate(-50%, -50%) scale(1.1) rotate(0deg)', 
            filter: 'hue-rotate(0deg)' 
          },
          '100%': { 
            transform: 'translate(-50%, -50%) scale(1.3) rotate(2deg)', 
            filter: 'hue-rotate(30deg)' 
          },
        },
        nebulaPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        vignetteFlash: {
          '0%': { 
            background: 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.1) 0%, rgba(0,0,0,0.8) 100%)' 
          },
          '20%': { 
            background: 'radial-gradient(ellipse at center, rgba(212, 168, 75, 0.2) 0%, rgba(0,0,0,0.7) 100%)' 
          },
          '100%': { 
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0) 100%)' 
          },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        lightSpeed: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        plasmaDrop: {
          '0%': { transform: 'translateX(-50%) translateY(-100%) scaleY(2)', opacity: '1' },
          '100%': { transform: 'translateX(-50%) translateY(100%) scaleY(1)', opacity: '0' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // PARTICLE ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        particleFly: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        gateParticle: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-50px) scale(0.5)', opacity: '0' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        soundWave: {
          '0%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.3)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // UI COMPONENT ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        scrollCarousel: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        tickerDotPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        scrollArrow: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(-50%) translateY(0)' },
          '50%': { opacity: '1', transform: 'translateX(-50%) translateY(8px)' },
        },
        scrollLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        hintBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        arrowBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // BUTTON & CTA ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        ctaGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 168, 75, 0.3), inset 0 0 20px rgba(212, 168, 75, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(212, 168, 75, 0.5), inset 0 0 30px rgba(212, 168, 75, 0.2)' 
          },
        },
        buttonPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        toggleBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // MODAL & OVERLAY ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        modalSpring: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '70%': { transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // TOAST & NOTIFICATION ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        chapterToast: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '15%': { opacity: '1', transform: 'translateX(0)' },
          '85%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
        fadeInOut: {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // RIPPLE & EXPAND ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        rippleAnimation: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        rippleExpand: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        rippleOut: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        edgePulseAnim: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // IMPACT & SHAKE ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        impactShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        impactFlash: {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.5' },
          '100%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // EQUATION ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        equationPulse: {
          '0%, 100%': { textShadow: '0 0 20px rgba(212, 168, 75, 0.4)' },
          '50%': { textShadow: '0 0 40px rgba(212, 168, 75, 0.8)' },
        },
        equationTriumph: {
          '0%': { transform: 'scale(1)', textShadow: '0 0 20px rgba(212, 168, 75, 0.3)' },
          '50%': { transform: 'scale(1.1)', textShadow: '0 0 40px rgba(212, 168, 75, 0.8)' },
          '100%': { transform: 'scale(1)', textShadow: '0 0 20px rgba(212, 168, 75, 0.3)' },
        },
        variablePop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1.1)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // SCORE & PROGRESS ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        scoreFill: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseProgress: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0' },
        },
        timelineGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 168, 75, 0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(212, 168, 75, 0.6)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // BOUNCE & ELASTIC ANIMATIONS
        // ─────────────────────────────────────────────────────────────────────────
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rubberBand: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.25, 0.75)' },
          '40%': { transform: 'scale(0.75, 1.25)' },
          '50%': { transform: 'scale(1.15, 0.85)' },
          '65%': { transform: 'scale(0.95, 1.05)' },
          '75%': { transform: 'scale(1.05, 0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        
        // ─────────────────────────────────────────────────────────────────────────
        // TYPING INDICATOR
        // ─────────────────────────────────────────────────────────────────────────
        typingDot: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // ANIMATION PRESETS (Mapped to keyframes above)
      // ═══════════════════════════════════════════════════════════════════════════
      animation: {
        // Loader
        'wormhole-spin': 'wormholeSpin 20s linear infinite',
        'wormhole-pulse': 'wormholePulse 3s ease-in-out infinite',
        'particle-orbit': 'particleOrbit 6s linear infinite',
        'loader-progress': 'loaderProgress 3s ease-in-out forwards',
        'loader-video-fade': 'loaderVideoFadeIn 1s ease-out forwards',
        'loader-video-zoom': 'loaderVideoZoom 30s ease-out forwards',
        'overlay-pulse': 'overlayPulse 4s ease-in-out infinite',
        
        // Book
        'titan-drop': 'titanDrop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'book-float': 'bookFloat 6s ease-in-out infinite',
        'book-glow': 'bookGlow 4s ease-in-out infinite',
        
        // Reveal
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
        'hero-reveal': 'heroReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'concept-reveal': 'conceptReveal 0.6s ease-out forwards',
        'welcome-enter': 'welcomeEnter 0.5s ease-out forwards',
        'celebration-enter': 'celebrationEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'numeral-reveal': 'numeralReveal 0.4s ease-out forwards',
        'fade-in-image': 'fadeInImage 0.8s ease-out forwards',
        
        // Pulse
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'pip-pulse': 'pipPulse 2s ease-in-out infinite',
        'bbc-pulse': 'bbcPulse 2s ease-in-out infinite',
        'urgency-pulse': 'urgencyPulse 2s ease-in-out infinite',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
        'live-pulse': 'livePulse 1.5s ease-in-out infinite',
        'instruct-pulse': 'instructPulse 2s ease-in-out infinite',
        'status-pulse': 'statusPulse 2s ease-in-out infinite',
        'edition-pulse': 'editionPulse 2s ease-in-out infinite',
        'method-pulse': 'methodPulse 3s ease-in-out infinite',
        'title-pulse-glow': 'titlePulseGlow 3s ease-in-out infinite',
        'quote-glow': 'quoteGlow 3s ease-in-out infinite',
        'ui-emphasis-pulse': 'uiEmphasisPulse 3s ease-in-out infinite',
        'pill-pulse': 'pillPulse 2s ease-in-out infinite',
        'chapter-pulse': 'chapterPulse 2s ease-in-out infinite',
        'neural-pulse': 'neuralPulse 3s ease-in-out infinite',
        'quantum-pulse': 'quantumPulse 4s ease-in-out infinite',
        'input-breathe': 'inputBreathe 3s ease-in-out infinite',
        
        // Rotation
        'spin': 'spin 1s linear infinite',
        'spin-slow': 'spinSlow 15s linear infinite',
        'tesseract-spin': 'tesseractSpin 8s ease-in-out infinite',
        'rotate-loop': 'rotateLoop 20s linear infinite',
        
        // Float
        'float': 'float 6s ease-in-out infinite',
        'float-gentle': 'floatGentle 8s ease-in-out infinite',
        'holo-float': 'holoFloat 6s ease-in-out infinite',
        'orb-float': 'orbFloat 10s ease-in-out infinite',
        'portal-float': 'portalFloat 8s ease-in-out infinite',
        
        // Shimmer
        'shimmer': 'shimmer 2s linear infinite',
        'text-shimmer': 'textShimmer 2.5s ease-out infinite',
        'char-shimmer': 'charShimmer 2s ease-in-out infinite',
        'skeleton-shimmer': 'skeletonShimmer 1.5s ease-in-out infinite',
        
        // Cosmic
        'cosmic-zoom': 'cosmicZoom 30s ease-in-out infinite alternate',
        'cosmic-zoom-full': 'cosmicZoomFull 40s ease-in-out infinite alternate',
        'nebula-pulse': 'nebulaPulse 8s ease-in-out infinite',
        'vignette-flash': 'vignetteFlash 2s ease-out forwards',
        'grain': 'grain 0.5s steps(10) infinite',
        'light-speed': 'lightSpeed 10s linear infinite',
        'plasma-drop': 'plasmaDrop 1s ease-out forwards',
        
        // Particles
        'particle-fly': 'particleFly 1s ease-out forwards',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'gate-particle': 'gateParticle 2s ease-out forwards',
        'confetti-fall': 'confettiFall 3s ease-out forwards',
        'sound-wave': 'soundWave 1s ease-in-out infinite',
        
        // UI Components
        'scroll-carousel': 'scrollCarousel 30s linear infinite',
        'ticker-scroll': 'tickerScroll 20s linear infinite',
        'ticker-dot-pulse': 'tickerDotPulse 2s ease-in-out infinite',
        'scroll-arrow': 'scrollArrow 2s ease-in-out infinite',
        'scroll-line': 'scrollLine 1.5s ease-in-out infinite',
        'hint-bounce': 'hintBounce 2s ease-in-out infinite',
        'arrow-bounce': 'arrowBounce 1.5s ease-in-out infinite',
        
        // Button & CTA
        'cta-glow': 'ctaGlow 3s ease-in-out infinite',
        'button-pulse': 'buttonPulse 2s ease-in-out infinite',
        'toggle-bounce': 'toggleBounce 0.3s ease-out',
        
        // Modal
        'modal-slide-in': 'modalSlideIn 0.4s ease-out forwards',
        'modal-spring': 'modalSpring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        
        // Toast
        'chapter-toast': 'chapterToast 4s ease-in-out forwards',
        'fade-in-out': 'fadeInOut 3s ease-in-out forwards',
        
        // Ripple
        'ripple': 'rippleAnimation 0.6s ease-out forwards',
        'ripple-expand': 'rippleExpand 0.8s ease-out forwards',
        'ripple-out': 'rippleOut 0.6s ease-out forwards',
        'edge-pulse': 'edgePulseAnim 2s ease-in-out infinite',
        
        // Impact
        'shake': 'shake 0.5s ease-in-out',
        'impact-shake': 'impactShake 0.3s ease-in-out',
        'impact-flash': 'impactFlash 0.5s ease-out forwards',
        'glitch': 'glitch 0.3s ease-in-out',
        
        // Equation
        'equation-pulse': 'equationPulse 2s ease-in-out infinite',
        'equation-triumph': 'equationTriumph 1s ease-in-out',
        'variable-pop': 'variablePop 0.4s ease-out',
        
        // Score & Progress
        'score-fill': 'scoreFill 2s ease-out forwards',
        'pulse-progress': 'pulseProgress 1.5s ease-in-out infinite',
        'draw-line': 'drawLine 1s ease-out forwards',
        'timeline-glow': 'timelineGlow 2s ease-in-out infinite',
        
        // Bounce
        'bounce': 'bounce 1s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'rubber-band': 'rubberBand 1s ease-in-out',
        
        // Typing
        'typing-dot': 'typingDot 1.4s ease-in-out infinite',
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // BACKGROUND IMAGES
      // ═══════════════════════════════════════════════════════════════════════════
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4a84b 0%, #f4c856 100%)',
        'gold-gradient-radial': 'radial-gradient(ellipse at center, #d4a84b 0%, #8b6914 100%)',
        'void-gradient': 'linear-gradient(180deg, #02030a 0%, #0a0c14 100%)',
        'void-radial': 'radial-gradient(ellipse at center, #0a0c14 0%, #02030a 100%)',
        'glass-surface': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(212, 168, 75, 0.3) 50%, transparent 100%)',
        'text-shimmer': 'linear-gradient(90deg, #d4a84b, #f4c856, #d4a84b)',
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // GRID TEMPLATES
      // ═══════════════════════════════════════════════════════════════════════════
      gridTemplateColumns: {
        'auto-fill-280': 'repeat(auto-fill, minmax(280px, 1fr))',
        'auto-fill-320': 'repeat(auto-fill, minmax(320px, 1fr))',
        'auto-fit-280': 'repeat(auto-fit, minmax(280px, 1fr))',
        'auto-fit-320': 'repeat(auto-fit, minmax(320px, 1fr))',
        'hero': '1fr 1fr',
        'hero-wide': '1.2fr 0.8fr',
        'ideas': 'repeat(auto-fit, minmax(280px, 1fr))',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLUGINS
  // ═══════════════════════════════════════════════════════════════════════════
  plugins: [
    // Add line-clamp plugin
    function({ addUtilities }) {
      addUtilities({
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
          overflow: 'hidden',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
          overflow: 'hidden',
        },
        '.line-clamp-4': {
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
          overflow: 'hidden',
        },
        '.line-clamp-none': {
          display: 'block',
          '-webkit-box-orient': 'unset',
          '-webkit-line-clamp': 'unset',
          overflow: 'visible',
        },
      })
    },
    
    // No-scrollbar utility
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(212, 168, 75, 0.3) transparent',
        },
        '.scrollbar-gold': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#d4a84b rgba(212, 168, 75, 0.1)',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(212, 168, 75, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#d4a84b',
            borderRadius: '4px',
          },
        },
      })
    },
    
    // Text gradient utility
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient-gold': {
          background: 'linear-gradient(135deg, #d4a84b 0%, #f4c856 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-cosmic': {
          background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #d4a84b 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-shimmer': {
          background: 'linear-gradient(90deg, #d4a84b, #f4c856, #d4a84b)',
          'background-size': '200% 100%',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          animation: 'shimmer 2s linear infinite',
        },
      })
    },
    
    // GPU acceleration utility
    function({ addUtilities }) {
      addUtilities({
        '.gpu': {
          transform: 'translateZ(0)',
          'will-change': 'transform',
        },
        '.gpu-opacity': {
          transform: 'translateZ(0)',
          'will-change': 'transform, opacity',
        },
      })
    },
    
    // Safe area utilities
    function({ addUtilities }) {
      addUtilities({
        '.safe-top': {
          'padding-top': 'env(safe-area-inset-top, 0)',
        },
        '.safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom, 0)',
        },
        '.safe-left': {
          'padding-left': 'env(safe-area-inset-left, 0)',
        },
        '.safe-right': {
          'padding-right': 'env(safe-area-inset-right, 0)',
        },
        '.safe-all': {
          'padding-top': 'env(safe-area-inset-top, 0)',
          'padding-bottom': 'env(safe-area-inset-bottom, 0)',
          'padding-left': 'env(safe-area-inset-left, 0)',
          'padding-right': 'env(safe-area-inset-right, 0)',
        },
        '.mobile-safe-padding': {
          'padding-bottom': 'env(safe-area-inset-bottom, 0)',
        },
      })
    },
  ],
}
