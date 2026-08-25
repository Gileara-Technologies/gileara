/**
 * Single source of truth for site-wide contact details and brand lines.
 * Replace the placeholder phone/WhatsApp values once real numbers exist —
 * every consumer reads from here, so the swap is one edit.
 */

export const siteConfig = {
  name: "Gileara Technologies",
  /** v3.0 market position line (tech-wing-positioning.md) */
  positioningLine:
    "The technology partner that helps Ghanaian MSMEs become efficient, digital, and scalable businesses.",
  email: "tech.gileara@gmail.com", // TODO: replace with domain alias (e.g. hello@gileara.org) when domain email exists
  // TODO: placeholders — replace with real numbers when provided
  phone: "+233 XX XXX XXXX",
  whatsapp: "+233 XX XXX XXXX",
  location: "Accra, Ghana",
  timezone: "GMT (Accra)",
} as const;
