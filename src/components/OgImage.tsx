import { ImageResponse } from "next/og";

/**
 * Shared Gileara OG image renderer.
 *
 * Used by every route's `opengraph-image.tsx`. Pure `next/og` JSX — no
 * client-side code, no Tailwind. Renders a 1200x630 PNG suitable for
 * LinkedIn, Twitter, WhatsApp, Slack, iMessage, etc.
 *
 * Brand colors mirror `globals.css` Velocity Dark tokens:
 *   background   #0A0F1A  (Velocity Navy)
 *   surface-2    #131B2A
 *   accent-cyan  #4FE3C1
 *   accent-bright #5EF0D0
 *   on-bg        #F5F7FA
 *   on-bg-muted  rgba(245,247,250,0.7)
 *   rule         rgba(245,247,250,0.12)
 */

export type OgVariant = {
  eyebrow: string;
  title: string;
  /** Optional italicised accent line (rendered after title) */
  titleAccent?: string;
  description: string;
  /** Optional badge in top-right (e.g. "PLAYBOOK", "BLOG") */
  badge?: string;
};

const BG = "#0A0F1A";
const SURFACE = "#131B2A";
const CYAN = "#4FE3C1";
const BRIGHT = "#5EF0D0";
const ON = "#F5F7FA";
const ON_MUTED = "rgba(245,247,250,0.7)";
const RULE = "rgba(245,247,250,0.12)";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png" as const;

export function renderOg({ eyebrow, title, titleAccent, description, badge }: OgVariant) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(ellipse 80% 60% at 80% 20%, rgba(79,227,193,0.10), transparent 60%)`,
          color: ON,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Top bar — logo + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo mark — simple stylised "G" since we can't load next/image here */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: CYAN,
                color: BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              G
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              Gileara
            </div>
          </div>
          {badge ? (
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: BRIGHT,
                border: `1px solid ${RULE}`,
                backgroundColor: SURFACE,
                padding: "10px 18px",
                borderRadius: 999,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: BRIGHT,
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          }}
        >
          <div style={{ width: 36, height: 2, backgroundColor: BRIGHT }} />
          <div>{eyebrow}</div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            color: ON,
            maxWidth: 1056,
            display: "flex",
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <span>{title}</span>
          {titleAccent ? (
            <span style={{ color: CYAN, fontStyle: "italic", marginLeft: 16 }}>{titleAccent}</span>
          ) : null}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: ON_MUTED,
            maxWidth: 1000,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {description}
        </div>

        {/* Footer rule + URL */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            left: 72,
            right: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 24,
            fontSize: 18,
            color: ON_MUTED,
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          }}
        >
          <div>gileara.org</div>
          <div style={{ color: BRIGHT }}>We build the systems your business runs on.</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
