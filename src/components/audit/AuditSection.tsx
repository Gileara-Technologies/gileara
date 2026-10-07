import SectionLabel from "@/components/SectionLabel";
import DisplayHeading from "@/components/DisplayHeading";
import AuditTool from "@/components/audit/AuditTool";
import { auditSection } from "@/content/audit";

/**
 * AuditSection — homepage band 07, the interactive Operations Audit.
 *
 * Editorial header (numbered label, heading with the italic accent,
 * intro) sits left of the AuditTool card, which owns all interactive
 * behaviour as a client component. Copy comes from
 * src/content/audit.ts; nothing here is duplicated prose.
 */
export default function AuditSection() {
  return (
    <section
      id="audit"
      aria-labelledby="operations-audit-heading"
      className="relative bg-surface-container py-32 md:py-48 px-6 md:px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <SectionLabel number="07" label={auditSection.label} className="mb-8" />
            <DisplayHeading
              size="lg"
              as="h2"
              id="operations-audit-heading"
              className="mb-6 max-w-xl"
            >
              {auditSection.heading}{" "}
              <span className="italic text-accent-cyan">{auditSection.headingAccent}</span>
            </DisplayHeading>
            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
              {auditSection.intro}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <AuditTool />
          </div>
        </div>
      </div>
    </section>
  );
}
