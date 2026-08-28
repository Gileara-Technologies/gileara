import type { Metadata } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MotionProvider } from "@/components/MotionProvider";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

/** Serif display face — Andela-style headline character (Droid Serif equivalent). */
const displaySerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  description: "All-inclusive monthly digital transformation packages for Ghanaian MSMEs — WhatsApp-ready, MTN MoMo-ready, managed services included from day one.",
  metadataBase: new URL("https://gileara.org"),
  alternates: {
    canonical: "https://gileara.org",
  },
  openGraph: {
    title: "Gileara Technologies | We Build the Systems Your Business Runs On",
    description: "Digital transformation packages for Ghanaian MSMEs — managed from day one.",
    url: "https://gileara.org",
    siteName: "Gileara Technologies",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gileara Technologies | We Build the Systems Your Business Runs On",
    description: "Digital transformation packages for Ghanaian MSMEs — managed from day one.",
    images: ["/assets/gileara/logo-full.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${displaySerif.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="preload" href="/assets/gileara/logo-full.png" as="image" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MotionProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
            </div>
            <BackToTop />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}