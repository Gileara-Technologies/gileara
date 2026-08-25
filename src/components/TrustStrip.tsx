const claims = [
  { icon: "package_2", label: "All-inclusive monthly packages" },
  { icon: "support_agent", label: "Managed services from day one" },
  { icon: "chat", label: "WhatsApp & MTN MoMo ready" },
  { icon: "handshake", label: "Founder-led delivery" },
];

/** Slim credibility band under the hero. Server-rendered — zero JS cost. */
export default function TrustStrip() {
  return (
    <section aria-label="What every engagement includes" className="bg-surface-container dark:bg-surface-container-high border-y border-outline-variant/15 dark:border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {claims.map((c) => (
          <span key={c.label} className="flex items-center gap-2.5 text-sm font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary dark:text-primary text-xl" aria-hidden>
              {c.icon}
            </span>
            {c.label}
          </span>
        ))}
      </div>
    </section>
  );
}
