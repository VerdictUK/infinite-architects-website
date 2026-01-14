/**
 * PostCSS Configuration for Infinite Architects
 * 
 * Plugins:
 * - postcss-import: Enables @import for CSS modularization
 * - tailwindcss: The core Tailwind CSS processor
 * - autoprefixer: Adds vendor prefixes for browser compatibility
 * - cssnano: Minifies CSS in production (conditional)
 */

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': { preset: 'default' } } : {}),
  },
}
