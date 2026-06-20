import type { Metadata } from "next";
import LegalNavbar from "@/components/legal/LegalNavbar";
import Footer from "@/components/Footer";

const lastUpdated = "June 12, 2026";

const legalSections = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      "These Legal Terms describe the rules that apply when you access the Gileara Technologies website, review our materials, contact our team, or use digital experiences made available through gileara.org.",
      "Gileara Technologies provides software engineering, automation, digital strategy, and technology consulting services for growing organizations. These terms apply to website use only unless a signed service agreement, statement of work, or other written contract says otherwise.",
    ],
  },
  {
    id: "terms-of-use",
    title: "Terms of Use",
    body: [
      "By using this website, you agree to use it lawfully, respectfully, and in a way that does not interfere with its availability, security, or integrity. If you do not agree with these terms, you should not use this website.",
      "Project work, deliverables, support commitments, payment terms, ownership arrangements, and confidentiality obligations are governed by the applicable written agreement between Gileara and the client.",
    ],
  },
  {
    id: "website-guidelines",
    title: "Website Usage Guidelines",
    body: [
      "You may browse our website, read published materials, submit inquiries, and share links to public pages for legitimate business or informational purposes.",
      "You may not attempt to disrupt site performance, probe unauthorized systems, bypass security controls, copy large portions of the site through automated scraping, or misrepresent your relationship with Gileara.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    body: [
      "The website, visual design, written content, graphics, logos, source structure, and other materials displayed on this site are owned by Gileara Technologies or used with permission.",
      "Except where expressly allowed, you may not reproduce, modify, distribute, sell, or create derivative works from our website content without prior written permission from Gileara.",
    ],
  },
  {
    id: "trademarks",
    title: "Trademarks and Branding",
    body: [
      "The Gileara name, logo mark, brand assets, taglines, and related visual identity elements represent Gileara Technologies. They may not be used in a way that suggests endorsement, partnership, sponsorship, or affiliation without written authorization.",
      "References to third-party names, products, or marks belong to their respective owners and are used only for identification or descriptive purposes.",
    ],
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    body: [
      "When you submit information through the website, you are responsible for ensuring that the information is accurate, that you are authorized to provide it, and that it does not violate the rights of another person or organization.",
      "You are responsible for maintaining the confidentiality of any private information you choose to share with us and for avoiding submission of sensitive data unless it is necessary for your request.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    body: [
      "You agree not to use the website for unlawful, harmful, abusive, fraudulent, or security-compromising activity. This includes uploading malicious code, attempting unauthorized access, interfering with service operations, or using the site to transmit spam.",
      "We may restrict access, preserve relevant technical records, or take other reasonable steps if we believe website use creates legal, security, operational, or reputational risk.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    body: [
      "The website is provided for general informational purposes. While we work to keep information accurate and current, we do not guarantee that every page will be error-free, complete, uninterrupted, or suitable for every business decision.",
      "To the fullest extent permitted by applicable law, Gileara Technologies is not liable for indirect, incidental, special, consequential, or punitive damages arising from use of this website.",
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Services and Links",
    body: [
      "Our website may reference third-party platforms, tools, APIs, websites, social networks, or service providers. These third-party services are governed by their own terms and privacy practices.",
      "Links are provided for convenience and context. Gileara does not control third-party websites and is not responsible for their content, security, availability, or policies.",
    ],
  },
  {
    id: "availability",
    title: "Service Availability Disclaimer",
    body: [
      "We aim to keep the website reliable and accessible, but availability may be affected by maintenance, hosting providers, internet conditions, updates, security events, or factors outside our control.",
      "We may update, suspend, remove, or restructure website content at any time without notice.",
    ],
  },
  {
    id: "indemnification",
    title: "Indemnification",
    body: [
      "You agree to defend and hold Gileara Technologies, its team members, partners, and affiliates harmless from claims, losses, liabilities, damages, costs, and expenses that arise from your misuse of the website or violation of these terms.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: [
      "These terms are intended to be interpreted in a commercially reasonable manner under applicable laws relevant to Gileara Technologies and its operations. Where a client agreement specifies governing law, that agreement controls the relevant client relationship.",
      "Because legal requirements vary by jurisdiction, these terms should be reviewed by qualified counsel before being relied on for a specific transaction or market.",
    ],
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
    body: [
      "If a concern arises from website use, we encourage you to contact us first so we can attempt to resolve the matter promptly and professionally.",
      "Disputes relating to paid services, deliverables, confidentiality, intellectual property ownership, or support obligations will be handled according to the dispute terms in the applicable written agreement.",
    ],
  },
  {
    id: "updates",
    title: "Policy Updates and Revisions",
    body: [
      "We may revise these Legal Terms as our website, services, operations, or legal requirements evolve. The updated version will be posted on this page with a revised last updated date.",
      "Continued use of the website after updates means you accept the revised terms for future website use.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    body: [
      "Questions about these terms, brand permissions, website usage, or legal notices can be sent to tech.gileara@gmail.com.",
      "For client engagements, please refer to your signed agreement or contact your Gileara project representative.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Legal Terms | Gileara Technologies",
  description:
    "Review Gileara Technologies legal terms, website usage rules, intellectual property notices, acceptable use guidelines, liability terms, and legal contact information.",
  alternates: {
    canonical: "/terms",
  },
  keywords: [
    "Gileara legal",
    "Gileara terms",
    "technology company terms of use",
    "website usage guidelines",
    "acceptable use policy",
    "intellectual property rights",
  ],
  openGraph: {
    title: "Legal Terms | Gileara Technologies",
    description:
      "Clear legal terms for using the Gileara Technologies website, brand materials, and digital resources.",
    url: "/terms",
    siteName: "Gileara Technologies",
    type: "article",
    publishedTime: "2026-06-12",
    modifiedTime: "2026-06-12",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies legal terms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Terms | Gileara Technologies",
    description:
      "Website terms, acceptable use, intellectual property notices, and legal contact details for Gileara Technologies.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Legal Terms | Gileara Technologies",
    description: metadata.description,
    url: "https://gileara.org/terms",
    dateModified: "2026-06-12",
    publisher: {
      "@type": "Organization",
      name: "Gileara Technologies",
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
    },
  };

  return (
    <>
      <LegalNavbar page="terms" />
      <main className="min-h-screen bg-background pt-32 pb-20 text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 border-b border-outline-variant/20 pb-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Legal Resource
              </p>
              <h1 className="max-w-4xl text-4xl font-bold text-on-surface md:text-6xl">
                Legal Terms for a trusted technology partnership.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
                These terms explain how visitors, prospects, clients, and partners may use
                Gileara's website, public materials, and brand resources.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  Last updated: {lastUpdated}
                </span>
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  Applies to website use
                </span>
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  Client contracts may supersede
                </span>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-outline-variant/20 bg-surface-container-low p-5 lg:max-h-[calc(100vh-8rem)]">
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    Contents
                  </h2>
                  <nav aria-label="Legal page sections" className="mt-5">
                    <ol className="space-y-2 text-sm text-on-surface-variant">
                      {legalSections.map((section, index) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="flex gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-container-high hover:text-primary"
                          >
                            <span className="font-mono text-xs text-primary">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>{section.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </aside>

              <div className="space-y-8">
                <div className="rounded-lg border border-primary/25 bg-primary/10 p-6">
                  <h2 className="text-xl font-bold text-on-surface">Important notice</h2>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    This page is intended to provide transparent website terms for Gileara
                    Technologies. It is not a substitute for a signed client agreement or
                    professional legal advice tailored to a specific jurisdiction.
                  </p>
                </div>

                {legalSections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-32 border-t border-outline-variant/20 pt-8"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-mono text-sm text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-2xl font-bold text-on-surface md:text-3xl">
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-4 text-base leading-8 text-on-surface-variant">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}

                <section className="rounded-lg border border-outline-variant/20 bg-surface-container p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-on-surface">Legal support</h2>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    For notices, permissions, brand usage requests, or questions about these
                    terms, contact the Gileara team.
                  </p>
                  <a
                    href="mailto:tech.gileara@gmail.com"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-transform hover:-translate-y-0.5"
                  >
                    tech.gileara@gmail.com
                  </a>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
