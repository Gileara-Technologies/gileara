"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import DisplayHeading from "@/components/DisplayHeading";
import RevealText from "@/components/RevealText";

/**
 * Counter — animated number ticker.
 *
 * Snaps immediately under prefers-reduced-motion. The font-variant-numeric:
 * tabular-nums CSS prevents layout shifts as digits change.
 */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduceMotion = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setVal(to));
      return () => cancelAnimationFrame(frame);
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

/**
 * Positioning — Why Gileara.
 *
 * Visual upgrades:
 * - The three stats are pulled out of the table and rendered as massive
 *   display numbers with a teal accent, stacked in their own column for
 *   maximum drama — they are the proof, they should be impossible to miss
 * - The value-prop ghost numbers (01/02/03) pulse very faintly on scroll
 * - The photo gets parallax + a teal corner glow
 * - The closing quote is bolder — display-md scale instead of display-sm
 */
export default function Positioning() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const props = [
    {
      num: "01",
      title: "Built to earn its keep",
      desc: "Every system we build ties to a business result: more revenue, lower costs, fewer hours lost to manual work. We advise on what your business needs and pick the stack to fit it.",
    },
    {
      num: "02",
      title: "Support that stays after launch",
      desc: "IT support, software updates, backups and security monitoring are built into the system from day one, with SLA-backed response.",
    },
    {
      num: "03",
      title: "Made for how business actually runs",
      desc: "Chat-based ordering, mobile money, and offline-tolerant builds come standard, because that's how small businesses run, whether you're in Accra, Lagos, Nairobi, or Johannesburg.",
    },
  ];

  const stats = [
    { num: 7, suffix: " days", label: "Average deployment time" },
    { num: 24, suffix: "/7", label: "Managed monitoring" },
    { num: 99, suffix: ".9%", label: "Uptime SLA" },
  ];

  return (
    <section
      ref={ref}
      id="positioning"
      className="relative bg-background py-section-tight px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient teal glow — top right */}
      <div
        className="absolute -top-20 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(94,234,212,0.07) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 mb-20 md:mb-28">
          <div className="col-span-12 lg:col-span-7">
            <DisplayHeading size="lg" as="h2" className="mb-8">
              Built for{" "}
              <span className="italic text-accent-bright">small business</span>,
              {" "}everywhere.
            </DisplayHeading>
            <RevealText delay={0.15}>
              <p className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                We ship real outcomes, piloting in Ghana first and designed to scale globally. Start with one package and add more as you grow. Each one works on its own.
              </p>
            </RevealText>
          </div>
        </div>

        {/* Main grid: value props + photo + stats */}
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-16">
          {/* Value props — cols 1-7 */}
          <div className="col-span-12 lg:col-span-7 space-y-12 md:space-y-16">
            {props.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 gap-x-6 group"
              >
                <div className="col-span-2 font-serif text-display-sm text-on-background/[0.1] group-hover:text-accent-bright/30 leading-none transition-colors duration-500">
                  {p.num}
                </div>
                <div className="col-span-10">
                  <h3 className="font-serif text-2xl md:text-3xl text-on-background leading-tight tracking-[-0.02em] mb-3 group-hover:text-accent-bright transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed max-w-xl">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Photo + stats — cols 8-12 */}
          <div className="col-span-12 lg:col-span-5 space-y-0">
            {/* Photo */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-high mb-12">
              <motion.div className="absolute inset-0" style={{ y: imgY }}>
                <Image
                  src="/assets/imagery/whyghana-collaboration.jpg"
                  alt="Young women collaborating in a stylish office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover scale-[1.08]"
                />
              </motion.div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,20,32,0.05) 0%, rgba(8,20,32,0.35) 100%)",
                }}
                aria-hidden="true"
              />
              {/* Teal corner accent */}
              <div
                className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 100% 100%, rgba(94,234,212,0.2) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* Stats — three massive numbers */}
            <div className="space-y-0">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline justify-between gap-6 py-5 border-b border-on-background/10 first:border-t"
                >
                  <dt className="text-on-surface-variant text-sm font-mono uppercase tracking-wider">
                    {s.label}
                  </dt>
                  <dd className="font-serif text-display-sm text-accent-bright leading-none tabular-nums">
                    <Counter to={s.num} suffix={s.suffix} />
                  </dd>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <RevealText delay={0.4}>
          <div className="mt-32 pt-16 border-t border-on-background/10 max-w-4xl">
            <p className="font-serif text-display-md text-on-background leading-[1.1] tracking-[-0.03em]">
              &ldquo;The technology partner that helps small and growing businesses become{" "}
              <span className="italic text-accent-bright">efficient, digital, and scalable</span>. Currently piloting in Ghana, built to scale globally.&rdquo;
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
