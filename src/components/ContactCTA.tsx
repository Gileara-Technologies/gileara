"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site-config";

/**
 * ContactCTA — the homepage climax with photography.
 *
 * A local Ghanaian craftsperson grounds the "we build what's next"
 * promise in a real working Ghanaian scene. The photo sits on the
 * right, the headline parallaxes on the left, the teal glow
 * emanates from above.
 */
export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.3, 1, 1, 0.5]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative bg-surface-container-lowest py-40 md:py-56 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient teal glow from above */}
      <div
        className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(94, 234, 212, 0.18) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          {/* Text — cols 1-7 */}
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              style={{ y, opacity }}
              className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10"
            >
              Get in touch
            </motion.div>

            <motion.h2
              style={{ y, opacity }}
              className="font-serif text-display-lg md:text-display-xl leading-[0.9] tracking-[-0.03em] text-on-background max-w-5xl mb-12"
            >
              Ready when
              <br />
              <span className="italic text-accent-cyan">you are.</span>
            </motion.h2>

            <motion.p
              style={{ y, opacity }}
              className="text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12"
            >
              Thirty minutes, free. We&apos;ll map your goals to the right package — even if you don&apos;t buy.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <Link
                href="/contact"
                className="group inline-flex items-center pl-8 pr-14 py-4 rounded-pill bg-accent-bright text-background font-medium text-lg hover:bg-accent-cyan transition-colors duration-300"
              >
                Book a Free Consultation
                <span className="ml-6 material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-on-surface-variant hover:text-accent-bright font-medium transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Or email us at {siteConfig.email}
              </a>
            </div>

            <div className="mt-20 pt-10 border-t border-on-background/10 flex flex-col sm:flex-row gap-4 sm:gap-12 text-sm text-on-surface-variant font-mono">
              <span>{siteConfig.location}</span>
              <span>{siteConfig.timezone}</span>
              <span>Replies within 1 business day</span>
            </div>
          </div>

          {/* Image — cols 9-12 */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-9">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-high">
              <Image
                src="/assets/imagery/cta-business.jpg"
                alt="Professional Black business woman with phone, ready to connect"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(180deg, rgba(4, 15, 27, 0.05) 0%, rgba(4, 15, 27, 0.3) 100%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
