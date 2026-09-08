"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import RevealText from "@/components/RevealText";

/**
 * Why Gileara — numbered value props + animated counter stats + photography.
 *
 * The data/laptop photo on the right grounds the "tech" promise in a
 * real working scene. The animated counters are the "little aspects
 * of white" motion — numbers ticking up to their final value.
 */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function Positioning() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bigY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const props = [
    {
      num: "01",
      title: "Outcomes over code",
      desc: "Every system we build ties to a business result — more revenue, lower costs, fewer hours lost to manual work. We advise on what your business needs, not the fanciest stack.",
    },
    {
      num: "02",
      title: "Supported, not abandoned",
      desc: "IT support, software updates, backups and security monitoring are built into the system from day one — with SLA-backed response. Nothing bolted on later.",
    },
    {
      num: "03",
      title: "Built for how business actually runs",
      desc: "Chat-based ordering, mobile money, and offline-tolerant builds come standard — because that's how small businesses actually run, whether you're in Accra, Lagos, Nairobi, or Johannesburg.",
    },
  ];

  const stats = [
    { num: 7, suffix: " days", label: "Average deployment time" },
    { num: 24, suffix: "/7", label: "Managed monitoring" },
    { num: 99, suffix: ".9%", label: "Uptime SLA" },
  ];

  return (
    <section ref={ref} id="positioning" className="relative bg-background py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <motion.div
        style={{ y: bigY }}
        className="hidden lg:block absolute -right-20 top-20 font-serif text-[28rem] text-on-background/[0.04] leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        04
      </motion.div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <RevealText>
              <SectionLabel number="04" label="WHY GILEARA" className="mb-8" />
            </RevealText>
            <DisplayHeading size="lg" as="h2" className="mb-8">
              Built for{" "}
              <span className="italic text-accent-cyan">small business</span>{" "}
              — everywhere.
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Real outcomes, not slideware. Currently piloting in Ghana, designed to scale globally. Every package is independently useful and stacks cleanly as you grow.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Two-col: numbered value props (left) + stats + photo (right) */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          <div className="col-span-12 lg:col-span-7 space-y-12 md:space-y-16">
            {props.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 gap-x-6"
              >
                <div className="col-span-2 font-serif text-display-sm text-on-background/[0.15] leading-none">
                  {p.num}
                </div>
                <div className="col-span-10">
                  <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3">
                    {p.title}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed max-w-xl">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats + photo column */}
          <div className="col-span-12 lg:col-span-5 space-y-12">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-high">
              <Image
                src="/assets/imagery/whyghana-collaboration.jpg"
                alt="Young women collaborating in a stylish office"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(8, 20, 32, 0.05) 0%, rgba(8, 20, 32, 0.3) 100%)",
                }}
                aria-hidden="true"
              />
            </div>

            <div className="border-t border-on-background/10 pt-10 space-y-10">
              {stats.map((s) => (
                <div key={s.label} className="border-b border-on-background/10 pb-8 last:border-b-0">
                  <div className="font-serif text-display-md text-accent-bright leading-none tracking-[-0.03em] mb-3">
                    <Counter to={s.num} suffix={s.suffix} />
                  </div>
                  <p className="text-on-surface-variant text-sm font-mono uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <RevealText delay={0.4}>
          <div className="mt-32 pt-16 border-t border-on-background/10 max-w-4xl">
            <p className="font-serif text-2xl md:text-display-sm text-on-background leading-snug tracking-[-0.02em]">
              &ldquo;The technology partner that helps small and growing businesses become{" "}
              <span className="italic text-accent-cyan">efficient, digital, and scalable</span> — currently piloting in Ghana, built to scale globally.&rdquo;
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
