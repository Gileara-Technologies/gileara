import type { Metadata } from "next";
import LegalNavbar from "@/components/legal/LegalNavbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Security Disclosure | Gileara Technologies",
  description:
    "Gileara Technologies takes security seriously. Learn how to report vulnerabilities, our commitment to responsible disclosure, and how to contact our security team.",
  alternates: {
    canonical: "/security",
  },
  keywords: [
    "Gileara security",
    "vulnerability disclosure",
    "security reporting",
    "responsible disclosure",
    "Gileara Technologies security",
  ],
  openGraph: {
    title: "Security Disclosure | Gileara Technologies",
    description:
      "Security is at the core of everything we build. Report vulnerabilities and learn about our security practices.",
    url: "/security",
    siteName: "Gileara Technologies",
    type: "website",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies security disclosure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Disclosure | Gileara Technologies",
    description:
      "Security vulnerability reporting and responsible disclosure at Gileara Technologies.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

export default function SecurityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Security Disclosure | Gileara Technologies",
    description: metadata.description,
    url: "https://gileara.org/security",
    dateModified: "2026-05-01",
    publisher: {
      "@type": "Organization",
      name: "Gileara Technologies",
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalNavbar page="security" />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-on-surface">Security Disclosure</h1>
          <div className="prose prose-invert max-w-none text-on-surface-variant space-y-6">
            <p>Last Updated: May 1, 2026</p>
            <p>
              At Gileara Technologies, security is at the core of everything we build. We appreciate the work of security researchers in helping us maintain a safe environment.
            </p>
            <h2 className="text-2xl font-bold text-on-surface mt-8">Vulnerability Reporting</h2>
            <p>
              If you believe you have found a security vulnerability in our systems, please report it to us immediately. We ask that you give us a reasonable amount of time to respond and resolve the issue before making any information public.
            </p>
            <h2 className="text-2xl font-bold text-on-surface mt-8">Contact Information</h2>
            <p>
              Please send security reports to <a href="mailto:tech.gileara@gmail.com" className="text-primary">tech.gileara@gmail.com</a>. We take every report seriously and will investigate promptly.
            </p>
            <h2 className="text-2xl font-bold text-on-surface mt-8">Our Commitment</h2>
            <p>
              We are committed to resolving security issues quickly and will not take legal action against researchers who act in good faith and follow these disclosure guidelines.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
