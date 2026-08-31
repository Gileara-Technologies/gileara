import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  // Only the weights actually used in the design system
  // (normal, medium, semibold, bold). 800/900 were reserved but
  // not used; trimming them drops 2 woff2 preloads on every page.
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/** Serif display face — Andela-style editorial headlines. */
const displaySerif = IBM_Plex_Serif({
  subsets: ["latin"],
  // Only normal and bold are used; 500/600 not in any component
  weight: ["400", "700"],
  variable: "--font-display-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gileara Technologies | We Build the Systems Your Business Runs On",
  description: "We build the systems your business runs on — the operations, sales, customer, and reporting infrastructure small business can't build alone. Currently piloting in Ghana, designed to scale globally.",
  metadataBase: new URL("https://gileara.org"),
  alternates: {
    canonical: "https://gileara.org",
  },
  openGraph: {
    title: "Gileara Technologies | We Build the Systems Your Business Runs On",
    description: "We build the systems your business runs on — the operations, sales, customer, and reporting infrastructure small business can't build alone. Currently piloting in Ghana, designed to scale globally.",
    url: "https://gileara.org",
    siteName: "Gileara Technologies",
    locale: "en_US",
    type: "website",
    // og:image is auto-injected by /opengraph-image.tsx (1200x630 PNG)
  },
  twitter: {
    card: "summary_large_image",
    title: "Gileara Technologies | We Build the Systems Your Business Runs On",
    description: "We build the systems your business runs on — the operations, sales, customer, and reporting infrastructure small business can't build alone. Currently piloting in Ghana, designed to scale globally.",
    // twitter:image is auto-injected by /opengraph-image.tsx
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/gileara/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/gileara/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/assets/gileara/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/assets/gileara/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1A" },
    { media: "(prefers-color-scheme: light)", color: "#F5F7FA" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${displaySerif.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-on-background">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="preload" href="/assets/gileara/logo-full.png" as="image" />
        <MotionProvider>
          <SmoothScroll>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
            </div>
            <BackToTop />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
