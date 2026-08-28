import Link from "next/link";
import DisplayHeading from "@/components/DisplayHeading";
import SectionLabel from "@/components/SectionLabel";
import MagneticButton from "@/components/MagneticButton";

/**
 * FoundingClient — full-bleed dark section with oversized type.
 *
 * The "founding clients" offer: priority onboarding + documented
 * transformation story. Server-rendered (zero JS).
 *
 * Andela-style: full-bleed surface, large H1, single CTA, minimal copy.
 */
export default function FoundingClient() {
  return (
    <section
      aria-labelledby="founding-clients-heading"
      className="relative bg-surface-container-lowest py-32 md:py-48 px-6 md:px-12 overflow-hidden"
    >
      {/* Ambient teal accent corner */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, rgba(94, 234, 212, 0.12) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <div className="col-span-12 lg:col-span-9">
            <SectionLabel number="06" label="FOUNDING CLIENTS" className="mb-10" />
            <DisplayHeading size="lg" as="h2" id="founding-clients-heading" className="mb-10 max-w-4xl">
              One business per vertical gets{" "}
              <span className="italic text-accent-cyan">founder-level attention.</span>
            </DisplayHeading>

            <div className="grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-8 mb-12">
              <div className="col-span-12 md:col-span-7 text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                <p>
                  As we launch, we&apos;re taking a limited set of founding clients — one per vertical. You get priority onboarding and direct founder involvement. In return, we document your transformation story and publish it with your approval when the results are real.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-9">
                <div className="border-t border-on-background/10 pt-6">
                  <div className="font-mono text-label uppercase tracking-[0.2em] text-on-surface-variant mb-2">
                    What it isn&apos;t
                  </div>
                  <p className="text-on-surface text-sm">
                    No discounts. Founding means more attention, not less value.
                  </p>
                </div>
              </div>
            </div>

            <MagneticButton href="/contact" variant="primary" size="lg">
              Ask about a founding slot
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
