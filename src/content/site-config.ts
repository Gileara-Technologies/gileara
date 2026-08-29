/**
 * Single source of truth for site-wide contact details and brand lines.
 * Replace the placeholder phone/WhatsApp values once real numbers exist —
 * every consumer reads from here, so the swap is one edit.
 */

export const siteConfig = {
  name: "Gileara Technologies",
  /** v3.0 market position line — problem-focused, global with Ghana as launch market */
  positioningLine:
    "We see the same problem in small business everywhere: the work that should be invisible is still eating the founder's week. We build the systems that fix it — currently piloting in Ghana, designed to scale globally.",
  email: "tech.gileara@gmail.com", // TODO: replace with domain alias (e.g. hello@gileara.org) when domain email exists
  // TODO: placeholders — replace with real numbers when provided
  phone: "+233 XX XXX XXXX",
  whatsapp: "+233 XX XXX XXXX",
  location: "Accra, Ghana",
  timezone: "GMT (Accra)",
} as const;
