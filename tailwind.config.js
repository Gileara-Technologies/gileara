/** @type {import('tailwindcss').Config} */
/**
 * Terminal / Operator design system — inspired by Vercel + Linear.
 *
 * Principles:
 *  - Pure black (#000) background. Nothing is decorative.
 *  - JetBrains Mono is the DISPLAY face — headings are mono at scale.
 *  - Inter is the BODY face — legible, invisible, functional.
 *  - One accent: teal (#5EEAD4). Used precisely, never scattered.
 *  - Borders everywhere, gradients nowhere (only precise radial glows).
 *  - White-fill CTAs (Vercel-style inversion on dark).
 */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Base tokens (CSS custom properties for dark theme) ────────────
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        'on-background': 'rgb(var(--on-background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
        // Surface elevation steps (used for cards, panels)
        'surface-container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
        'surface-container': 'rgb(var(--surface-container) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--surface-container-highest) / <alpha-value>)',
        // Legacy tokens kept for compatibility
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'on-error': 'rgb(var(--on-error) / <alpha-value>)',
        'surface-dim': 'rgb(var(--surface-dim) / <alpha-value>)',
        'surface-bright': 'rgb(var(--surface-bright) / <alpha-value>)',
        'surface-tint': 'rgb(var(--surface-tint) / <alpha-value>)',
        'inverse-surface': 'rgb(var(--inverse-surface) / <alpha-value>)',
        'inverse-on-surface': 'rgb(var(--inverse-on-surface) / <alpha-value>)',
        'inverse-primary': 'rgb(var(--inverse-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
        'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
        'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
        'on-tertiary-container': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
        'error-container': 'rgb(var(--error-container) / <alpha-value>)',
        'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',
        'on-tertiary': 'rgb(var(--on-tertiary) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
        // ── Operator accent ───────────────────────────────────────────────
        accent: {
          bright: '#5EEAD4',  // the one teal — use precisely
          cyan: '#22D3EE',    // highlight chips only
          white: '#FFFFFF',
        },
      },

      fontFamily: {
        // Terminal inversion: mono IS the display face
        display: ["var(--font-jetbrains-mono)", "monospace"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
        sans:    ["var(--font-inter)", "sans-serif"],
        // Serif kept for rare editorial pull-quotes
        serif:   ["var(--font-display-serif)", "serif"],
      },

      fontSize: {
        // ── Display scale — mono at massive size ─────────────────────────
        // Tight line-height and slight negative tracking gives the
        // "dense CLI output" feel. No letter-spacing loosening.
        'display-xl': ['clamp(2.75rem, 5vw + 1.5rem, 7rem)',     { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 1.25rem, 5.5rem)',  { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 3vw + 1rem, 4rem)',       { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 2vw + 0.875rem, 2.75rem)', { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'heading-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-md': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        // ── Body / UI scale — Inter ───────────────────────────────────────
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body':    ['1rem',     { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'label':   ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'label-lg':['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
        // Section rhythm (CSS vars set in globals.css)
        'section-tight':  'var(--space-section-tight)',
        'section':        'var(--space-section)',
        'section-loose':  'var(--space-section-loose)',
      },

      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },

      borderRadius: {
        'none': '0',
        'xs':   '2px',
        'sm':   '4px',
        DEFAULT: '6px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        'pill': '9999px',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'var(--hero-mesh-bg)',
        // Vercel-style radial glow used in hero + contact band
        'glow-teal': 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(94,234,212,0.15) 0%, transparent 70%)',
        'glow-teal-sm': 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(94,234,212,0.10) 0%, transparent 70%)',
        // Grid line texture (always-visible column structure)
        'grid-lines': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },

      // Box shadows — tinted to the surface (Vercel uses subtle colored shadows)
      boxShadow: {
        'glow-teal': '0 0 40px rgba(94,234,212,0.15)',
        'glow-teal-lg': '0 0 80px rgba(94,234,212,0.2)',
        'card': '0 1px 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 1px 0 rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(94,234,212,0.08)',
      },

      // Keyframes for the typewriter cursor blink
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
