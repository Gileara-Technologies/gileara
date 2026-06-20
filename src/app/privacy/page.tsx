import type { Metadata } from "next";
import LegalNavbar from "@/components/legal/LegalNavbar";
import Footer from "@/components/Footer";

const lastUpdated = "June 12, 2026";

const privacyHighlights = [
  {
    title: "Purpose-led collection",
    body: "We collect only the information needed to respond to inquiries, manage consultations, and operate our website.",
  },
  {
    title: "Trusted operations",
    body: "We use trusted providers for hosting, scheduling, communications, analytics, and business operations.",
  },
  {
    title: "Respect for rights",
    body: "We do not sell personal information, and we treat privacy requests seriously.",
  },
];

const privacySections = [
  {
    id: "introduction",
    title: "Introduction",
    body: [
      "This Privacy Policy explains how Gileara Technologies collects, uses, protects, and shares information when you visit our website, contact our team, request a consultation, apply for a role, or otherwise interact with our digital services.",
      "Gileara builds software, automation, and technology systems for growing organizations. Our privacy approach is designed to support professional, secure, and transparent business relationships.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: [
      "The information we collect depends on how you interact with us. It may include contact details, business information, technical usage data, and communication records.",
      "We aim to collect information that is relevant, proportionate, and useful for responding to your request or improving the reliability of our website and services.",
    ],
  },
  {
    id: "information-you-provide",
    title: "Information You Provide",
    body: [
      "You may provide your name, email address, company name, role, phone number, project details, hiring information, application materials, or other context when submitting a form, booking a call, emailing us, or applying for an opportunity.",
      "Please avoid sending highly sensitive personal information unless it is necessary for your request and you are comfortable sharing it with Gileara.",
    ],
  },
  {
    id: "automatic-information",
    title: "Automatically Collected Information",
    body: [
      "When you visit our website, certain technical information may be collected automatically, such as browser type, device type, referring page, pages visited, approximate location derived from IP address, timestamps, and diagnostic data.",
      "This information helps us understand site performance, maintain security, troubleshoot issues, and improve user experience.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    body: [
      "Our website and third-party providers may use cookies, local storage, pixels, or similar technologies to remember preferences, analyze traffic, protect forms, and improve website performance.",
      "You can manage cookies through your browser settings. Blocking certain technologies may affect site functionality, form submissions, or scheduling flows.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Information",
    body: [
      "We use information to respond to inquiries, schedule consultations, evaluate potential projects, process applications, maintain business records, improve website performance, protect systems, and communicate about relevant services.",
      "We may also use information for administrative, compliance, fraud prevention, security monitoring, and internal reporting purposes.",
    ],
  },
  {
    id: "legal-basis",
    title: "Legal Basis for Processing",
    body: [
      "Where privacy laws require a legal basis, we generally process personal information based on consent, legitimate business interests, contract preparation or performance, legal obligations, or the need to protect the security of our website and operations.",
      "The specific basis may depend on your location, your relationship with Gileara, and the purpose for which information was collected.",
    ],
  },
  {
    id: "storage-security",
    title: "Data Storage and Security",
    body: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect information from unauthorized access, misuse, loss, disclosure, alteration, and destruction.",
      "No digital transmission or storage system can be guaranteed completely secure, but we work to apply practical security controls appropriate for the nature of the information and our operations.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    body: [
      "We retain information for as long as reasonably necessary to respond to your request, maintain business records, support client relationships, evaluate applications, comply with legal obligations, resolve disputes, and protect our rights.",
      "When information is no longer needed, we may delete, anonymize, or archive it according to operational, legal, and security requirements.",
    ],
  },
  {
    id: "third-party-providers",
    title: "Third-Party Providers",
    body: [
      "We may share limited information with service providers that help us operate our website, host infrastructure, manage communications, schedule meetings, process forms, analyze traffic, and support business operations.",
      "These providers are expected to process information only as needed to provide their services and according to their own contractual and legal obligations.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics Services",
    body: [
      "We may use analytics or diagnostic services to understand aggregate website usage, performance, device trends, and visitor journeys.",
      "Analytics information helps us improve page structure, content quality, accessibility, security, and conversion paths. Where possible, analytics should be configured to limit unnecessary personal identification.",
    ],
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    body: [
      "Gileara may work with providers, clients, or infrastructure located in different countries. Information may therefore be processed outside your country of residence.",
      "When international transfers occur, we seek to use reasonable safeguards appropriate to the provider, processing activity, and applicable legal requirements.",
    ],
  },
  {
    id: "rights",
    title: "User Rights and Choices",
    body: [
      "Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, objection, withdrawal of consent, or information about how your personal data is handled.",
      "To make a privacy request, contact us at tech.gileara@gmail.com. We may need to verify your identity and understand the scope of your request before responding.",
    ],
  },
  {
    id: "gdpr",
    title: "GDPR Considerations",
    body: [
      "For individuals in the European Economic Area, United Kingdom, or similar jurisdictions, Gileara will consider applicable GDPR-style rights and obligations when handling personal data.",
      "You may have the right to lodge a complaint with a supervisory authority, although we encourage you to contact us first so we can try to resolve the issue directly.",
    ],
  },
  {
    id: "ccpa",
    title: "CCPA and Privacy Rights Considerations",
    body: [
      "For individuals in California or other privacy-rights jurisdictions, applicable law may provide rights to know, access, delete, correct, or opt out of certain uses of personal information.",
      "Gileara does not sell personal information. If our practices change in a way that creates additional notice or opt-out obligations, we will update this policy accordingly.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    body: [
      "Our website and services are intended for business users, prospective clients, partners, applicants, and adults. We do not knowingly collect personal information from children.",
      "If you believe a child has provided personal information to Gileara, contact us so we can review and take appropriate action.",
    ],
  },
  {
    id: "updates",
    title: "Policy Updates",
    body: [
      "We may update this Privacy Policy as our website, service providers, legal obligations, or business operations evolve. The latest version will be posted on this page with a revised last updated date.",
      "Material changes may be communicated through additional notices where appropriate.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    body: [
      "For privacy questions, data requests, or concerns about how Gileara handles information, contact tech.gileara@gmail.com.",
      "Please include enough detail for us to understand your request, but avoid sending unnecessary sensitive information by email.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | Gileara Technologies",
  description:
    "Read Gileara Technologies' privacy policy, including what information we collect, how we use it, data security practices, retention, user rights, GDPR and CCPA considerations.",
  alternates: {
    canonical: "/privacy",
  },
  keywords: [
    "Gileara privacy policy",
    "technology company privacy policy",
    "data security",
    "user privacy rights",
    "GDPR considerations",
    "CCPA privacy rights",
    "data retention",
  ],
  openGraph: {
    title: "Privacy Policy | Gileara Technologies",
    description:
      "A transparent overview of how Gileara Technologies collects, uses, protects, and manages personal information.",
    url: "/privacy",
    siteName: "Gileara Technologies",
    type: "article",
    publishedTime: "2026-06-12",
    modifiedTime: "2026-06-12",
    images: [
      {
        url: "/assets/gileara/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Gileara Technologies privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Gileara Technologies",
    description:
      "How Gileara handles information, security, retention, user rights, GDPR, and CCPA privacy considerations.",
    images: ["/assets/gileara/logo-full.png"],
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy | Gileara Technologies",
    description: metadata.description,
    url: "https://gileara.org/privacy",
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
      <LegalNavbar page="privacy" />
      <main className="min-h-screen bg-background pt-32 pb-20 text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 border-b border-outline-variant/20 pb-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Privacy Resource
              </p>
              <h1 className="max-w-4xl text-4xl font-bold text-on-surface md:text-6xl">
                Privacy practices built for trust, security, and clarity.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
                This policy explains how Gileara Technologies handles personal information
                across website visits, consultation requests, business inquiries, and talent
                conversations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  Last updated: {lastUpdated}
                </span>
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  No sale of personal information
                </span>
                <span className="rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2">
                  Privacy requests supported
                </span>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="max-h-[28rem] overflow-y-auto rounded-lg border border-outline-variant/20 bg-surface-container-low p-5 lg:max-h-[calc(100vh-8rem)]">
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                    Contents
                  </h2>
                  <nav aria-label="Privacy policy sections" className="mt-5">
                    <ol className="space-y-2 text-sm text-on-surface-variant">
                      {privacySections.map((section, index) => (
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
                <section className="grid gap-4 md:grid-cols-3">
                  {privacyHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-lg border border-primary/20 bg-primary/10 p-5"
                    >
                      <span className="material-symbols-outlined text-primary" aria-hidden="true">
                        verified_user
                      </span>
                      <h3 className="mt-4 text-base font-bold text-on-surface">
                        {highlight.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                        {highlight.body}
                      </p>
                    </div>
                  ))}
                </section>

                <div className="rounded-lg border border-outline-variant/20 bg-surface-container p-6">
                  <h2 className="text-xl font-bold text-on-surface">Security-focused handling</h2>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    We treat privacy and security as practical operating responsibilities:
                    collect what is needed, limit unnecessary exposure, rely on reputable
                    providers, and respond thoughtfully to privacy requests.
                  </p>
                </div>

                {privacySections.map((section, index) => (
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

                <section className="rounded-lg border border-primary/25 bg-primary/10 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-on-surface">Privacy requests</h2>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    To ask a privacy question, request access or deletion, or raise a data
                    handling concern, contact Gileara. We will review your request and respond
                    based on applicable law and operational context.
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
