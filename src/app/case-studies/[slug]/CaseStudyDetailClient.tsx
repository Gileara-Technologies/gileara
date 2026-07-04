"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import type { CaseStudy } from "../data";

const details: Record<string, { challenge: string; approach: string; results: string[] }> = {
  "e-commerce-platform": {
    challenge: "A retail startup was managing orders through spreadsheets and email. As order volume grew from 50 to hundreds per month, manual processes became error-prone and unsustainable. They needed a platform that could scale without requiring a large internal team.",
    approach: "We designed and built a full-featured e-commerce platform from the ground up — a custom storefront with product management, real-time inventory tracking, payment gateway integration, and an admin dashboard. The system was built mobile-first and optimized for the client's specific fulfillment workflow.",
    results: [
      "Scaled from 50 to 5,000+ monthly orders within 6 months",
      "Reduced order processing time by 85%",
      "Integrated with existing shipping and accounting tools",
      "Zero downtime since launch",
    ],
  },
  "workflow-automation-sme": {
    challenge: "A professional services firm was spending over 20 hours per week on manual data entry across spreadsheets, emails, and paper forms. Employees were frustrated with repetitive work, and error rates were impacting client satisfaction.",
    approach: "We conducted a full workflow audit, mapping every process from client intake to report delivery. We then built a custom automation platform that digitized forms, automated data routing, and generated reports — all integrated with their existing CRM and accounting software.",
    results: [
      "Eliminated 20+ hours of manual data entry per week per employee",
      "Reduced data errors by 90%",
      "Improved client report delivery time from 3 days to 2 hours",
      "ROI achieved within 4 months of deployment",
    ],
  },
  "mvp-for-startup": {
    challenge: "A fintech startup had a solid business plan and initial funding but no technical team. They needed to go from concept to a working product in 12 weeks to meet investor milestones and begin user acquisition.",
    approach: "We operated as their external CTO and engineering team. We designed the architecture, selected the tech stack, built the MVP with core transaction features, and set up the deployment pipeline. The product launched on schedule with payment processing, user accounts, and an admin dashboard.",
    results: [
      "MVP launched in 12 weeks from kickoff",
      "Processed 1,000+ transactions in the first month",
      "Raised follow-on funding based on early traction",
      "Architecture built to scale without rewrites",
    ],
  },
  "internal-tool-legacy-upgrade": {
    challenge: "A logistics company was running on a 15-year-old desktop application that was slow, vulnerable, and couldn't integrate with modern shipping APIs. Employees had to manually re-enter data between systems, causing delays and errors.",
    approach: "We rebuilt their entire operations platform as a modern web application with real-time tracking, automated API integrations with major carriers, and a role-based dashboard for different teams (dispatch, warehouse, customer support).",
    results: [
      "Page load times improved by 400%",
      "Customer support calls reduced by 60% thanks to real-time tracking",
      "Integrated with 4 major carrier APIs",
      "Employees trained and migrated in under 2 weeks",
    ],
  },
};

export default function CaseStudyDetailClient({ study }: { study: CaseStudy }) {
  const detail = details[study.slug];

  return (
    <section className="pt-36 pb-24 md:pb-32 px-4 md:px-10 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
          >
            <FaArrowLeft className="w-3 h-3" />
            Back to Case Studies
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
              {study.industry}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/10 text-secondary">
              {study.service}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-on-surface mb-3">
            {study.title}
          </h1>
          <p className="text-lg text-on-surface-variant mb-12">
            {study.subtitle}
          </p>
        </motion.div>

        {detail && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest font-semibold mb-3">
                The Challenge
              </h2>
              <p className="text-on-surface leading-relaxed">
                {detail.challenge}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest font-semibold mb-3">
                Our Approach
              </h2>
              <p className="text-on-surface leading-relaxed">
                {detail.approach}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest font-semibold mb-4">
                Results
              </h2>
              <ul className="space-y-3">
                {detail.results.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-on-surface">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-12 border-t border-outline-variant/10"
        >
          <div className="bg-surface-container-low dark:bg-surface-container rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 p-8 md:p-10 text-center">
            <h3 className="text-xl font-bold text-on-surface mb-3">
              Want results like these?
            </h3>
            <p className="text-on-surface-variant mb-6">
              Let&apos;s talk about how we can help your business.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold teal-gradient-btn group"
            >
              Start a Conversation
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
