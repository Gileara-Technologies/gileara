"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * DashboardMock — an illustrative "systems" panel for the Hero.
 *
 * Not a real screenshot (Gileara ships bespoke systems per client, so
 * there's no single product shot to show). Instead, this is an original,
 * decorative mock of what "the systems your business runs on" looks like
 * in practice: live-feeling metrics, a small trend chart, a sync status.
 *
 * Marked aria-hidden — it's illustrative, not informational; the real
 * claims live in the surrounding copy.
 */
function useCountUp(to: number, startOnView: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!startOnView) return;
    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setVal(to));
      return () => cancelAnimationFrame(frame);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startOnView, to, duration, reduceMotion]);
  return val;
}

const METRICS = [
  { label: "inventory", value: 1284, suffix: " items", delta: "+6%" },
  { label: "orders today", value: 47, suffix: "", delta: "+12%" },
  { label: "revenue (mtd)", value: 18420, suffix: "", prefix: "$", delta: "+9%" },
];

const BARS = [38, 52, 44, 68, 58, 76, 64];

export default function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative rounded-xl border border-white/10 bg-surface-container/70 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="ml-2 font-mono text-[11px] text-white/25">operations.gileara</span>
        <span className="ml-auto flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent-bright"
          />
          <span className="font-mono text-[10px] text-accent-bright/70 tracking-wider uppercase">live</span>
        </span>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 border-b border-white/[0.06]">
        {METRICS.map((m, i) => (
          <MetricTile key={m.label} metric={m} delay={i * 0.12} startOnView={inView} isLast={i === METRICS.length - 1} />
        ))}
      </div>

      {/* Mini bar chart */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] text-white/25 tracking-widest uppercase">revenue · last 7 days</span>
          <span className="font-mono text-[10px] text-accent-bright/60">+14.2%</span>
        </div>
        <div className="flex items-end gap-2 h-20">
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={inView ? { height: `${h}%` } : { height: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-t-sm"
              style={{
                background: i === BARS.length - 1
                  ? "linear-gradient(180deg, #5EEAD4 0%, rgba(94,234,212,0.3) 100%)"
                  : "rgba(94,234,212,0.18)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Sync footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] font-mono text-[10px] text-white/20">
        <span>synced 2 min ago</span>
        <span>5 systems connected</span>
      </div>
    </div>
  );
}

function MetricTile({
  metric,
  delay,
  startOnView,
  isLast,
}: {
  metric: (typeof METRICS)[number];
  delay: number;
  startOnView: boolean;
  isLast: boolean;
}) {
  const val = useCountUp(metric.value, startOnView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={startOnView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className={`px-5 py-5 ${!isLast ? "border-r border-white/[0.06]" : ""}`}
    >
      <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">
        {metric.label}
      </div>
      <div className="font-mono text-xl text-on-background tabular-nums mb-1">
        {metric.prefix}
        {val.toLocaleString("en-US")}
        {metric.suffix}
      </div>
      <div className="font-mono text-[10px] text-accent-bright/70">{metric.delta}</div>
    </motion.div>
  );
}
