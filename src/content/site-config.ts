/**
 * Single source of truth for site-wide contact details and brand lines.
 * Replace the placeholder phone/WhatsApp values once real numbers exist —
 * every consumer reads from here, so the swap is one edit.
 */

export const siteConfig = {
  name: "Gileara Technologies",
  /** v3.0 market position line — problem-focused, global with Ghana as launch market */
  positioningLine:
    "We see the same problem in small business everywhere: the work that should be invisible is still eating the founder's week. We build the systems that fix it, piloting in Ghana now and designing for global scale.",
  email: "tech.gileara@gmail.com", // TODO: replace with domain alias (e.g. hello@gileara.org) when domain email exists
  // TODO: placeholders — replace with real numbers when provided
  phone: "+233 XX XXX XXXX",
  whatsapp: "+233 XX XXX XXXX",
  location: "Accra, Ghana",
  timezone: "GMT (Accra)",
} as const;

export type SocialPlatform = "linkedin" | "instagram";

export interface SocialProfile {
  platform: SocialPlatform;
  /** Shown in the UI, e.g. "@gileara" or "LinkedIn". */
  label: string;
  url: string;
}

/**
 * Gileara's Instagram accounts. Each one is a separate Instagram
 * professional account, so each has its own access token and account id
 * (Meta's "Instagram API with Instagram Login" issues tokens per account,
 * not per business). `envSuffix` names the Cloudflare Secrets for that
 * account: "" reads INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID
 * (the original names, kept for @gileara so nothing already set breaks),
 * "_INS" reads INSTAGRAM_ACCESS_TOKEN_INS / INSTAGRAM_BUSINESS_ACCOUNT_ID_INS.
 * See docs/INSTAGRAM-CONNECTOR-PLAN.md.
 */
export const instagramAccounts = [
  { handle: "gileara", url: "https://www.instagram.com/gileara/", envSuffix: "" },
  { handle: "ins.gileara", url: "https://www.instagram.com/ins.gileara/", envSuffix: "_INS" },
] as const;

export type InstagramAccount = (typeof instagramAccounts)[number];

/** Every public profile, in footer order. Also feeds Organization JSON-LD `sameAs`. */
export const socialProfiles: readonly SocialProfile[] = [
  { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/gileara" },
  ...instagramAccounts.map((a) => ({ platform: "instagram" as const, label: `@${a.handle}`, url: a.url })),
];
