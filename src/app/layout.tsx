import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalLoading from "@/components/GlobalLoading";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Gileara Technologies | Systems for Growing Businesses",
  description: "Gileara builds the custom software and digital systems that power modern businesses. We are your technology partners for growth, security, and scale.",
  metadataBase: new URL("https://gileara.org"),
  alternates: {
    canonical: "https://gileara.org",
  },
  openGraph: {
    title: "Gileara Technologies | Systems for Growing Businesses",
    description: "Custom software, workflow automation, and digital strategy for startups and SMEs.",
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
    title: "Gileara Technologies | Systems for Growing Businesses",
    description: "Custom software and digital systems for modern businesses.",
    images: ["/assets/gileara/logo-full.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/gileara/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/gileara/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/assets/gileara/icon-512.png", type: "image/png", sizes: "256x256" },
      { url: "/assets/gileara/icon-512.png", type: "image/png", sizes: "64x64" },
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="preload" href="/assets/gileara/logo-full.png" as="image" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <GlobalLoading />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
          </div>
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
