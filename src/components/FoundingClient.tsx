import Link from "next/link";


/**
 * Founding-client program block (D4 resolution): no discounts — the offer is
 * priority onboarding plus a documented transformation story, published with
 * the client's approval once results are real. Server-rendered; zero JS.
 */
export default function FoundingClient() {
  return (
    <section aria-labelledby="founding-clients-heading" className="py-20 bg-surface-container dark:bg-surface-container-high px-4 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <span className="font-mono text-xs text-secondary dark:text-primary uppercase tracking-widest">Founding clients</span>
        <h2 id="founding-clients-heading" className="font-display text-3xl md:text-4xl font-bold mt-4 text-primary dark:text-on-background leading-tight">
          One business per vertical gets founder-level attention.
        </h2>
        <p className="mt-6 text-on-surface-variant text-lg leading-relaxed max-w-2xl mx-auto">
          As we launch, we&apos;re taking a limited set of founding clients — one per vertical. You get priority
          onboarding and direct founder involvement; in return, we document your transformation story and publish it
          with your approval when the results are real.
        </p>
        <p className="mt-4 text-sm text-outline">
          No discounts — founding means more attention, not less value.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold teal-gradient-btn text-white dark:text-on-primary shadow-lg group"
        >
          Ask about a founding slot
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
