import { ImageResponse } from "next/og";

/**
 * Per-post OG image renderer — full-bleed cover photo with the post
 * title overlaid on a dark gradient. Used only by /insights/[slug].
 *
 * Different layout from the brand `<OgImage>`:
 *  - Cover photo fills the frame (object-cover)
 *  - Dark gradient from bottom (for legibility of the title)
 *  - Brand stripe at the top (logo + tag)
 *  - Title + excerpt at the bottom
 *
 * next/og can't load next/image, so we pass a remote/local URL that
 * `ImageResponse` will fetch directly. The cover photos are served
 * from /public at the route's base URL.
 */

export type PostOgVariant = {
  /** Brand or route name shown in the top-left */
  brand: string;
  /** Tag label in the top-right (e.g. "Packages", "Operations") */
  tag: string;
  /** Post title — main hero text, white */
  title: string;
  /** Post excerpt — secondary text under title */
  excerpt: string;
  /**
   * Cover image URL. Can be:
   *  - relative (e.g. "/assets/insights/...jpg") — will be resolved
   *    against the site's base URL
   *  - absolute (https://...)
   */
  cover: string;
  /** Site origin (used to resolve relative image URLs) */
  baseUrl: string;
};

const BG = "#0A0F1A";
const CYAN = "#4FE3C1";
const BRIGHT = "#5EF0D0";
const ON = "#F5F7FA";
const ON_MUTED = "rgba(245,247,250,0.75)";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

function absoluteUrl(input: string, base: string): string {
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (input.startsWith("/")) return `${base}${input}`;
  return `${base}/${input}`;
}

export function renderPostOg({ brand, tag, title, excerpt, cover, baseUrl }: PostOgVariant) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: BG,
          color: ON,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Cover photo — full bleed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={absoluteUrl(cover, baseUrl)}
          alt=""
          width="1200"
          height="630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark gradient overlay for legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(180deg, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.10) 28%, rgba(10,15,26,0.10) 52%, rgba(10,15,26,0.92) 100%)",
            display: "flex",
          }}
        />

        {/* Top brand stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "44px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: CYAN,
                color: BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              G
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{brand}</div>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: BRIGHT,
              border: "1px solid rgba(245,247,250,0.20)",
              backgroundColor: "rgba(19,27,42,0.70)",
              padding: "8px 16px",
              borderRadius: 999,
            }}
          >
            {tag}
          </div>
        </div>

        {/* Title + excerpt at the bottom */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: ON,
              maxWidth: 1088,
              display: "flex",
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              color: ON_MUTED,
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {excerpt}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
