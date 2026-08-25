import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CinematicStory from "@/components/CinematicStory";
import BentoGrid from "@/components/BentoGrid";
import Positioning from "@/components/Positioning";
import Approach from "@/components/Approach";
import Founders from "@/components/Founders";
import CareersCTA from "@/components/CareersCTA";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://gileara.org",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Gileara Technologies",
    "custom software development",
    "workflow automation",
    "digital strategy",
    "business technology systems",
    "SME technology solutions",
    "software engineering Ghana",
    "startup technology partner",
  ],
  openGraph: {
    url: "https://gileara.org",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const services = [
  {
    name: "Custom Software Development",
    description:
      "Web and mobile applications tailored to how your business actually operates — not off-the-shelf.",
    serviceType: "Custom Software Development",
  },
  {
    name: "E-Commerce Development",
    description:
      "Digital storefronts, booking systems, and portals that build digital infrastructure for growth.",
    serviceType: "E-Commerce Development",
  },
  {
    name: "Workflow Automation",
    description:
      "Replace manual, repetitive processes with smart systems so your team spends time growing.",
    serviceType: "Workflow Automation",
  },
  {
    name: "Technology Strategy & Advisory",
    description:
      "Map the right technology path and manage the build from start to finish.",
    serviceType: "Technology Consulting",
  },
];

const faqs = [
  {
    question: "What types of businesses does Gileara work with?",
    answer:
      "We work with startups needing scalable MVPs, growing SMEs needing workflow automation and custom systems, and any organization with technical challenges that require expert software engineering.",
  },
  {
    question: "What is Gileara's development process?",
    answer:
      "Our process follows four phases: Discovery (deep dive into goals and bottlenecks), Strategy (map exact solution and scope), Build (iterative, transparent delivery phases), and Deploy (launch and ongoing support).",
  },
  {
    question: "Do you build MVPs for startups?",
    answer:
      "Yes. We act as your external CTO and engineering team, building scalable MVPs that can grow into market-leading products with solid technical foundations.",
  },
  {
    question: "Can Gileara help automate our business workflows?",
    answer:
      "Yes. We audit your existing workflows and build custom systems that replace manual, repetitive processes with smart automation, so your team can focus on growth.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "Yes. The Deploy phase includes ongoing support to ensure your system runs smoothly, with iterative improvements as your business evolves.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gileara.org/#organization",
      name: "Gileara Technologies",
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
      description:
        "Gileara builds the custom software and digital systems that power modern businesses.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        email: "tech.gileara@gmail.com",
        contactType: "sales",
      },
      sameAs: ["https://www.linkedin.com/company/gileara"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GH",
        addressLocality: "Accra",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://gileara.org/#local-business",
      name: "Gileara Technologies",
      url: "https://gileara.org",
      logo: "https://gileara.org/assets/gileara/logo-icon.png",
      image: "https://gileara.org/assets/gileara/logo-full.png",
      description:
        "Custom software, workflow automation, and digital strategy for startups and SMEs.",
      foundingDate: "2024",
      email: "tech.gileara@gmail.com",
      sameAs: ["https://www.linkedin.com/company/gileara"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GH",
        addressLocality: "Accra",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "tech.gileara@gmail.com",
        contactType: "sales",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://gileara.org/#webpage",
      url: "https://gileara.org",
      name: "Gileara Technologies | Systems for Growing Businesses",
      description:
        "Gileara builds the custom software and digital systems that power modern businesses.",
      about: { "@id": "https://gileara.org/#organization" },
      mainEntity: { "@id": "https://gileara.org/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://gileara.org/#website",
      url: "https://gileara.org",
      name: "Gileara Technologies | Systems for Growing Businesses",
      publisher: { "@id": "https://gileara.org/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://gileara.org/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://gileara.org" },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://gileara.org/#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    ...services.map((s) => ({
      "@type": "Service",
      "@id": `https://gileara.org/#service-${s.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: s.name,
      description: s.description,
      serviceType: s.serviceType,
      provider: { "@id": "https://gileara.org/#organization" },
      areaServed: "Worldwide",
      category: "Technology Consulting",
    })),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <CinematicStory />
        <BentoGrid />
        <Positioning />
        <Approach />
        <Founders />
        <CareersCTA />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
