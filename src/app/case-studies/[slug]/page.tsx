import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CaseStudyDetailClient from "./CaseStudyDetailClient";
import { caseStudies } from "../data";

interface Props {
  params: Promise<{ slug: string }>;
}

function getStudy(slug: string) {
  return caseStudies.find((s) => s.slug === slug);
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return {};
  const base = "https://gileara.org";
  return {
    title: `${study.title} | Gileara Technologies`,
    description: study.summary,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title: `${study.title} | Gileara Technologies`,
      description: study.summary,
      url: `/case-studies/${slug}`,
      siteName: "Gileara Technologies",
      type: "article",
      images: [{ url: `${base}/assets/gileara/og-case-studies.svg`, width: 1200, height: 630, alt: study.title }],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();

  return (
    <>
      <Navbar />
      <main>
        <CaseStudyDetailClient study={study} />
      </main>
      <Footer />
    </>
  );
}
