---
name: Gileara Velocity Dark
colors:
  surface: '#081420'
  surface-dim: '#081420'
  surface-bright: '#2f3a47'
  surface-container-lowest: '#040f1b'
  surface-container-low: '#111c29'
  surface-container: '#15202d'
  surface-container-high: '#1f2b38'
  surface-container-highest: '#2a3643'
  on-surface: '#d8e3f5'
  on-surface-variant: '#bbcac4'
  inverse-surface: '#d8e3f5'
  inverse-on-surface: '#26313e'
  outline: '#85948f'
  outline-variant: '#3c4a46'
  surface-tint: '#44ddc1'
  primary: '#44ddc1'
  on-primary: '#00382f'
  primary-container: '#00bfa5'
  on-primary-container: '#00473c'
  inverse-primary: '#006b5c'
  secondary: '#bbc6e2'
  on-secondary: '#263046'
  secondary-container: '#3e4960'
  on-secondary-container: '#adb8d3'
  tertiary: '#afc9ea'
  on-tertiary: '#17324d'
  tertiary-container: '#92accc'
  on-tertiary-container: '#26405c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#68fadd'
  primary-fixed-dim: '#44ddc1'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#005145'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#bbc6e2'
  on-secondary-fixed: '#101b30'
  on-secondary-fixed-variant: '#3c475d'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#afc9ea'
  on-tertiary-fixed: '#001d36'
  on-tertiary-fixed-variant: '#2f4865'
  background: '#081420'
  on-background: '#d8e3f5'
  surface-variant: '#2a3643'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system evolves into a high-performance, nocturnal environment. The brand personality is technical, streamlined, and focused, catering to power users who require long-session endurance. By shifting to a dark-mode-first architecture, the UI minimizes eye strain while maintaining its core identity of speed and precision.

The style is **Corporate Modern** with a lean toward **Tonal Layering**. It leverages deep navy and charcoal surfaces to create a sense of infinite depth, punctuated by high-vibrancy teal accents that guide the eye to critical actions. The emotional response is one of calm authority and technological sophistication.

## Colors
This design system utilizes a tiered dark palette to establish hierarchy without relying on heavy borders.
- **Primary (#00BFA5):** A vibrant, high-performance teal used exclusively for primary CTAs, active states, and critical progress indicators.
- **Neutral / Background (#0A1622):** The base canvas color, a deep charcoal-navy that provides a stable, low-light foundation.
- **Secondary / Surface (#0D1B2A):** Used for large container elements like sidebars and cards to create subtle separation from the background.
- **Text:** High-contrast "Off-White" (#E0E1DD) for primary content and "Silver-Gray" (#A0AEC0) for supportive metadata.

## Typography
The system uses **Hanken Grotesk** exclusively to maintain a sharp, contemporary feel. In this dark iteration, font weights are slightly adjusted to prevent "ink bleed" on high-brightness screens. Headlines use a tighter letter spacing and heavy weights to command attention, while body text uses a generous line height to ensure maximum legibility against the dark background. 

For mobile devices, headline scales are reduced to ensure long technical strings do not wrap aggressively.

## Layout & Spacing
The design system employs a **Fluid Grid** model based on an 8px square-grid rhythm. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1440px.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Spacing is used to group related technical data; use `md` (24px) for component grouping and `lg` (48px) for distinct section breaks.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** rather than traditional drop shadows. As elements "rise" closer to the user, their surface color becomes lighter.

- **Level 0 (Base):** #0A1622 (Background)
- **Level 1 (Cards/Navigation):** #0D1B2A (Secondary Surface)
- **Level 2 (Modals/Overlays):** #1B263B (Tertiary Surface)

Shadows, when used, are ultra-subtle: a deep black (#000000) with 40% opacity and a large 24px blur to create a soft "glow" of darkness that separates floating modals from the background.

## Shapes
The shape language is **Rounded**, utilizing a 0.5rem (8px) base radius. This softens the technical nature of the navy palette, making the interface feel modern and accessible.

- **Standard Buttons & Inputs:** 8px (rounded)
- **Cards & Larger Containers:** 16px (rounded-lg)
- **Avatars & Status Tags:** Full radius (Pill-shaped)

## Components
- **Buttons:** Primary buttons use the Teal (#00BFA5) background with black text for maximum contrast. Secondary buttons use an outlined style with a 1px border in Tertiary Navy.
- **Input Fields:** Backgrounds should be #0D1B2A with a subtle 1px border (#415A77). On focus, the border transitions to Primary Teal.
- **Cards:** Use Level 1 Tonal Layering. No borders; use spacing and subtle value shifts to define boundaries.
- **Chips:** Small, pill-shaped indicators. Active chips use a semi-transparent Teal tint (15% opacity) with Teal text.
- **Lists:** Rows should be separated by thin 1px dividers in #1B263B or distinguished by alternating background tints.
- **Data Visualizations:** Charts and graphs should utilize the Primary Teal and supporting shades of blue-gray to maintain a monochromatic, focused aesthetic.