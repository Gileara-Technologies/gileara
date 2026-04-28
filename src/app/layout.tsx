import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gileara Technologies | Smart, Secure & Scalable Systems",
  description: "Digital Transformation Partners. We architect intelligent digital ecosystems that empower high-growth businesses with clarity, defense-grade security, and extreme efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/assets/logo-icon.png" />
      </head>
      <body className="mesh-bg text-brand-text bg-brand-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
