"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * IndustryStrip — a proof strip right under the Hero.
 *
 * The six photos that used to live inside the Hero's background carousel
 * now live here as a self-contained, auto-scrolling marquee: a quick
 * "we work across these kinds of businesses" beat, rather than wallpaper
 * behind the headline. Pauses entirely under prefers-reduced-motion.
 */
const INDUSTRIES = [
  { src: "/assets/imagery/carousel-fashion-boutique.jpg", alt: "Customers browsing a fashion boutique in Accra", label: "Retail" },
  { src: "/assets/imagery/carousel-flowers.jpg",          alt: "Couple browsing flowers at a market",             label: "Hospitality" },
  { src: "/assets/imagery/carousel-sale-card.jpg",        alt: "Smiling woman holding a sale card",               label: "Sales" },
  { src: "/assets/imagery/carousel-crate.jpg",            alt: "A man holding a crate of produce",                label: "Distribution" },
  { src: "/assets/imagery/carousel-apron-workshop.jpg",   alt: "A man in an apron working in his workshop",       label: "Services" },
  { src: "/assets/imagery/carousel-barber.jpg",           alt: "Barber shaving a young boy's hair",               label: "Personal services" },
];

function Card({ item }: { item: (typeof INDUSTRIES)[number] }) {
  return (
    <div className="relative w-44 h-28 md:w-52 md:h-32 rounded-lg overflow-hidden border border-white/10 shrink-0">
      <Image src={item.src} alt={item.alt} fill sizes="208px" className="object-cover grayscale opacity-70" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 40%, rgba(3,10,12,0.9) 100%)" }}
        aria-hidden="true"
      />
      <div className="absolute bottom-2.5 left-3">
        <span className="font-mono text-[10px] text-on-background/80 tracking-wider uppercase">
          {item.label}
        </span>
      </div>
    </div>
  );
}

export default function IndustryStrip() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-background border-t border-b border-white/[0.06] py-10 md:py-12 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-7 flex items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-white/30 tracking-widest uppercase flex items-center gap-2">
          <span className="text-accent-bright/40">▸</span>
          built across industries
        </div>
        <div className="font-mono text-[11px] text-white/20 hidden sm:block">
          retail · hospitality · sales · distribution · services
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max px-6 md:px-12"
          animate={prefersReducedMotion ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {[...INDUSTRIES, ...INDUSTRIES].map((item, i) => (
            <Card key={`${item.label}-${i}`} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
