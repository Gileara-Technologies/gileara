import DisplayHeading from "@/components/DisplayHeading";
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
      className="relative bg-surface-container py-section px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient top-right teal glow */}
      <div
        className="absolute -top-24 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(94,234,212,0.09) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12">
          {/* Left: editorial header + intro */}
          <div className="col-span-12 lg:col-span-5">
            <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-8">
              Operations Audit
            </div>
            <DisplayHeading
              size="lg"
              as="h2"
              id="operations-audit-heading"
              className="mb-6 max-w-xl"
            >
              {auditSection.heading}{" "}
              <span className="italic text-accent-bright">{auditSection.headingAccent}</span>
            </DisplayHeading>
            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
              {auditSection.intro}
            </p>

            {/* Small trust signal */}
            <div className="mt-10 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" />
              <span className="font-mono text-label text-on-surface-variant">
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
