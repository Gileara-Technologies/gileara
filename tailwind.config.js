/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        'on-tertiary': 'rgb(var(--on-tertiary) / <alpha-value>)',
        'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
        'on-tertiary-container': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        'on-background': 'rgb(var(--on-background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
        'surface-container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
        'surface-container': 'rgb(var(--surface-container) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
        'surface-container-highest': 'rgb(var(--surface-container-highest) / <alpha-value>)',
        'surface-dim': 'rgb(var(--surface-dim) / <alpha-value>)',
        'surface-bright': 'rgb(var(--surface-bright) / <alpha-value>)',
        'surface-tint': 'rgb(var(--surface-tint) / <alpha-value>)',
        'inverse-surface': 'rgb(var(--inverse-surface) / <alpha-value>)',
        'inverse-on-surface': 'rgb(var(--inverse-on-surface) / <alpha-value>)',
        'inverse-primary': 'rgb(var(--inverse-primary) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'on-error': 'rgb(var(--on-error) / <alpha-value>)',
        'error-container': 'rgb(var(--error-container) / <alpha-value>)',
        'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',
        // Bright accent tokens (used in the "little aspects of white" + bright-cyan visual breaks)
        accent: {
          bright: '#5EEAD4',     // bright teal (slightly desaturated for big surfaces)
          cyan: '#22D3EE',       // bright cyan for highlight chips
          white: '#FFFFFF',      // pure white for type-on-dark emphasis
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-display-serif)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      // Oversized editorial type scale (Andela-style, fluid via clamp so no mobile overflow)
      fontSize: {
        'display-xl': ['clamp(3rem, 5.5vw + 1.5rem, 7.5rem)',     { lineHeight: '0.95',  letterSpacing: '-0.04em' }],  // 48px → 120px
        'display-lg': ['clamp(2.5rem, 4.5vw + 1.25rem, 6rem)',    { lineHeight: '1.0',   letterSpacing: '-0.03em' }],  // 40px → 96px
        'display-md': ['clamp(2rem, 3.5vw + 1rem, 4.5rem)',       { lineHeight: '1.05',  letterSpacing: '-0.03em' }],  // 32px → 72px
        'display-sm': ['clamp(1.75rem, 2.5vw + 0.875rem, 3.5rem)',{ lineHeight: '1.1',   letterSpacing: '-0.02em' }],  // 28px → 56px
        'heading-lg': ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],  // 40px
        'heading-md': ['2rem',    { lineHeight: '1.2',  letterSpacing: '-0.01em' }],  // 32px
        'body-lg':    ['1.25rem', { lineHeight: '1.6' }],
        'body':       ['1rem',    { lineHeight: '1.6' }],
        'body-sm':    ['0.875rem',{ lineHeight: '1.5' }],
        'label':      ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      // Extended spacing scale (ChatGPT brief: 4/8/12/16/24/32/48/64/96/128/160/200)
      // Section rhythm: three steps, mobile value first, desktop from the md breakpoint
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
        'section-tight': 'var(--space-section-tight)',
        'section': 'var(--space-section)',
        'section-loose': 'var(--space-section-loose)',
      },
      // 12-column grid for asymmetric layouts
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      // Restrained border radius (no 9999px except pills)
      borderRadius: {
        'none': '0',
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'pill': '9999px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'var(--hero-mesh-bg)',
      },
    },
  },
  plugins: [],
};

export default config;
