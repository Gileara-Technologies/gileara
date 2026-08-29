/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'on-primary': 'var(--on-primary)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'on-secondary': 'var(--on-secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary-container': 'var(--on-secondary-container)',
        tertiary: 'var(--tertiary)',
        'on-tertiary': 'var(--on-tertiary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        background: 'var(--background)',
        'on-background': 'var(--on-background)',
        surface: 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        'surface-variant': 'var(--surface-variant)',
        'on-surface-variant': 'var(--on-surface-variant)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-dim': 'var(--surface-dim)',
        'surface-bright': 'var(--surface-bright)',
        'surface-tint': 'var(--surface-tint)',
        'inverse-surface': 'var(--inverse-surface)',
        'inverse-on-surface': 'var(--inverse-on-surface)',
        'inverse-primary': 'var(--inverse-primary)',
        error: 'var(--error)',
        'on-error': 'var(--on-error)',
        'error-container': 'var(--error-container)',
        'on-error-container': 'var(--on-error-container)',
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
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
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
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
