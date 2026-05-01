import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Gileara Technologies | Systems for Growing Businesses",
  description: "Gileara builds the custom software and digital systems that power modern businesses. We are your technology partners for growth, security, and scale.",
  metadataBase: new URL("https://gileara.tech"),
  openGraph: {
    title: "Gileara Technologies | Systems for Growing Businesses",
    description: "Custom software, workflow automation, and digital strategy for startups and SMEs.",
    url: "https://gileara.tech",
    siteName: "Gileara Technologies",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or fallback to logo
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gileara Technologies | Systems for Growing Businesses",
    description: "Custom software and digital systems for modern businesses.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/assets/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="mesh-bg text-brand-text bg-brand-background antialiased">
        <div className="noise" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
