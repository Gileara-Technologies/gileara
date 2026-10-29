import AuditTool from "@/components/audit/AuditTool";
import { auditSection } from "@/content/audit";

/**
 * AuditSection — homepage band, the interactive Operations Audit.
 *
 * Visual upgrades:
 * - A diagonal accent stripe in the top-right corner adds visual texture
 * - The left copy column is wider (5→5 cols) with a teal ambient glow
 *   so the editorial heading has more breathing room
 * - The tool card area inherits a subtle surface lift from the section bg
 */
export default function AuditSection() {
  return (
    <section
      id="audit"
      aria-labelledby="operations-audit-heading"
      className="relative bg-brand-soft-alt py-section px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12">
          {/* Left: editorial header + intro */}
          <div className="col-span-12 lg:col-span-5">
            <div className="font-mono text-[11px] text-accent-bright tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="text-accent-bright/40">▸</span>
              operations audit
            </div>
            <h2 id="operations-audit-heading" className="font-display text-display-md text-on-background mb-6 max-w-xl">
              {auditSection.heading}{" "}
              <span className="text-accent-bright">{auditSection.headingAccent}</span>
            </h2>
            <p className="max-w-xl font-sans text-body-lg leading-relaxed text-white/40">
              {auditSection.intro}
            </p>

            {/* Small trust signal */}
            <div className="mt-10 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" />
              <span className="font-mono text-[11px] text-white/30">
                5 questions · free · no email required
              </span>
            </div>
          </div>

          {/* Right: interactive audit tool */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <AuditTool />
          </div>
        </div>
      </div>
    </section>
  );
}
