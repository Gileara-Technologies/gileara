---
name: Gileara Velocity
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#73777f'
  outline-variant: '#c3c6cf'
  surface-tint: '#426087'
  primary: '#001c38'
  on-primary: '#ffffff'
  primary-container: '#0d3156'
  on-primary-container: '#7c9ac4'
  inverse-primary: '#aac8f6'
  secondary: '#00696e'
  on-secondary: '#ffffff'
  secondary-container: '#71f2fa'
  on-secondary-container: '#006e72'
  tertiary: '#00201e'
  on-tertiary: '#ffffff'
  tertiary-container: '#003735'
  on-tertiary-container: '#00aaa4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#aac8f6'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#29486e'
  secondary-fixed: '#75f5fc'
  secondary-fixed-dim: '#54d9e0'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#52faf1'
  tertiary-fixed-dim: '#1fddd5'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter-desktop: 24px
  margin-desktop: 40px
  gutter-mobile: 16px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style
The brand personality for the design system is defined as **Precision Innovation**. It targets enterprise decision-makers and tech-savvy stakeholders who value reliability paired with forward-thinking momentum. The UI is designed to evoke a sense of high-trust, data-driven intelligence, and seamless performance.

The visual style is **Corporate / Modern** with a **Tech-Forward infusion**. It utilizes clean, systematic layouts characteristic of SaaS excellence, enhanced by subtle glassmorphism and vibrant accent gradients derived from the logo’s "growth arrow." The interface prioritizes clarity and functional beauty, ensuring that complex technological data feels accessible and sophisticated.

## Colors
The palette is rooted in the deep navy of the logo to establish authority, balanced by luminous teals and cyans to signal technical agility.

- **Primary (Deep Navy):** Used for primary navigation, headings, and high-importance interaction states. It provides the "high-trust" anchor.
- **Secondary (Vibrant Teal):** Used for primary actions (CTAs), progress indicators, and active states.
- **Tertiary (Cyan):** Reserved for highlights, data visualization accents, and gradient infusions.
- **Neutral:** A cool-toned grayscale palette that ensures the interface feels airy and modern. Surfaces use subtle shifts in off-white to create logical containment without visual noise.

## Typography
The typography strategy employs a trio of fonts to delineate hierarchy and function. **Hanken Grotesk** is used for headlines to provide a sharp, contemporary edge. **Inter** serves as the workhorse for body content, chosen for its supreme legibility in digital environments. **JetBrains Mono** is introduced for labels, metadata, and technical readouts to reinforce the technological "Gileara" identity.

For display text, utilize a tight letter-spacing to create a more impactful, "locked-in" professional look. Ensure body text maintains generous line heights to facilitate long-form reading of technical documentation.

## Layout & Spacing
The design system utilizes a **Fluid Grid** model based on a 12-column structure for desktop. Layouts are governed by an 8px spacing rhythm (with a 4px sub-unit for tight components) to ensure mathematical harmony.

- **Desktop (1024px+):** 12 columns with 24px gutters. Content is centered within a 1280px max-width container.
- **Tablet (768px - 1023px):** 8 columns with 24px gutters.
- **Mobile (Up to 767px):** 4 columns with 16px gutters and 20px side margins.

Horizontal spacing between logical sections should be generous (80px - 120px) to emphasize the minimalist, "clean" aesthetic.

## Elevation & Depth
This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a structured hierarchy. Surfaces are categorized into three tiers:

1.  **Floor (Level 0):** The base background, typically the neutral color.
2.  **Raised (Level 1):** White cards or containers with a very soft, 12% opacity shadow tinted with the primary navy color. This prevents "muddy" grays.
3.  **Overlay (Level 2):** Modals or dropdowns featuring a background blur (12px) and a subtle 1px border in a semi-transparent primary tint.

Avoid heavy blacks for shadows; instead, use deep navy tints to maintain the professional tech-forward mood.

## Shapes
The shape language mirrors the logo’s construction: fluid but structured. A **Rounded** (0.5rem) base radius is the standard for most components, providing a modern and approachable feel that isn't overly organic.

- **Standard (8px):** Cards, input fields, and standard buttons.
- **Large (16px):** Primary containers and featured hero blocks.
- **Pill:** Reserved exclusively for status indicators (Chips) and search bars to differentiate them from actionable buttons.

## Components
- **Buttons:** Primary buttons use a linear gradient from Secondary Teal to Tertiary Cyan. Text is white. Secondary buttons use a transparent background with a 1.5px border in the Primary Navy.
- **Input Fields:** Use a subtle "Raised" elevation on focus, with the border changing to the Secondary Teal. Labels should use the `label-sm` (monospaced) typography.
- **Cards:** White backgrounds with Level 1 shadows. Use the 16px corner radius for featured cards. Headlines within cards should be `headline-md`.
- **Chips:** Highly rounded (pill-shaped) with light-tinted backgrounds of their respective status (e.g., light cyan background for "Active" with deep teal text).
- **Data Visualizations:** Use the Teal-to-Cyan gradient for positive growth indicators, reflecting the arrow in the logo. Use the Primary Navy for baseline or historical data.
- **Navigation:** Top-tier navigation uses a semi-transparent white backdrop with a background blur when scrolling to maintain the "Glassmorphism" tech-edge.