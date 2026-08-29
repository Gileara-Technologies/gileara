import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import DisplayHeading from "@/components/DisplayHeading";
import { siteConfig } from "@/content/site-config";

interface ContactBandProps {
  /** Pre-headline eyebrow, e.g. "GET IN TOUCH" */
  eyebrow?: string;
  /** Big H2 (italic accent words via <span>). */
  headline: React.ReactNode;
  /** Optional supporting copy under the headline */
  body?: string;
  /** Optional alignment — start (default) for content pages, center for service pages */
  align?: "start" | "center";
  /** Background elevation. The default sits well between most page sections. */
  bg?: "background" | "surface-container" | "surface-container-lowest";
  /**
   * Set true to hide the phone/WhatsApp action when only the booking channel
   * is wired (e.g. the /contact page already shows everything). Default false.
   */
  showChannels?: boolean;
}

const phoneReady = !siteConfig.phone.includes("XX");
const whatsappReady = !siteConfig.whatsapp.includes("XX");

/**
 * ContactBand — the in-page contact section, placed just above the footer on
 * every page. One component, one shape, three channels (booking, email, phone
 * or WhatsApp) so the user always has at least one way to reach us.
 *
 * The footer also has a contact card; the two layers serve different
 * visitors — band converts the in-page reader, footer is the safety net.
 */
export default function ContactBand({
  eyebrow = "Get in touch",
  headline,
  body = "Thirty minutes, free. Tell us what's hard about running your business today and we'll help you think through it — even if the answer turns out to be something we don't do.",
  align = "start",
  bg = "surface-container-lowest",
  showChannels = true,
}: ContactBandProps) {
  const bgClass: Record<NonNullable<ContactBandProps["bg"]>, string> = {
    "background": "bg-background",
    "surface-container": "bg-surface-container",
    "surface-container-lowest": "bg-surface-container-lowest",
  };

  const isCentered = align === "center";
  const headingClass = isCentered
    ? "max-w-3xl mx-auto text-center"
    : "max-w-4xl";
  const bodyClass = isCentered
    ? "text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-12 text-center"
    : "text-body-lg md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-12";
  const actionsClass = isCentered
    ? "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12"
    : "flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-12 flex-wrap";
  const metaClass = isCentered
    ? "text-sm text-on-surface-variant font-mono flex flex-col sm:flex-row gap-3 sm:gap-10 justify-center"
    : "text-sm text-on-surface-variant font-mono flex flex-col sm:flex-row gap-3 sm:gap-10";

  return (
    <section className={`relative ${bgClass[bg]} py-32 md:py-40 px-6 md:px-12 overflow-hidden border-t border-on-background/10`}>
      {/* Ambient teal glow from above */}
      <div
        className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(94, 234, 212, 0.18) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className={isCentered ? "text-center" : "grid grid-cols-12 gap-x-6 md:gap-x-8"}>
          <div className={isCentered ? "" : "col-span-12 lg:col-span-10"}>
            {/* Eyebrow */}
            <div className={`font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-10 ${isCentered ? "" : ""}`}>
              {eyebrow}
            </div>

            {/* Headline */}
            <DisplayHeading size="lg" as="h2" className={`mb-10 ${headingClass}`}>
              {headline}
            </DisplayHeading>

            {/* Body */}
            {body && <p className={bodyClass}>{body}</p>}

            {/* Three channels — book, email, phone/WhatsApp */}
            <div className={actionsClass}>
              {/* Primary: book a free consultation */}
              <Link
                href="/contact"
                className="group inline-flex items-center pl-7 pr-12 py-3.5 rounded-pill bg-accent-bright text-background font-medium text-base hover:bg-accent-cyan transition-colors duration-300"
              >
                Book a Free Consultation
                <span className="ml-5 material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>

              {showChannels && (
                <>
                  {/* Email */}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group inline-flex items-center px-5 py-3.5 rounded-pill border border-on-background/20 hover:border-accent-bright text-on-background font-medium text-base transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-lg mr-2.5 text-accent-bright">
                      mail
                    </span>
                    Email us
                  </a>

                  {/* Phone or WhatsApp */}
                  {(phoneReady || whatsappReady) && (
                    <a
                      href={
                        whatsappReady
                          ? `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`
                          : `tel:${siteConfig.phone}`
                      }
                      target={whatsappReady ? "_blank" : undefined}
                      rel={whatsappReady ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center px-5 py-3.5 rounded-pill border border-on-background/20 hover:border-accent-bright text-on-background font-medium text-base transition-colors duration-300"
                    >
                      {whatsappReady ? (
                        <FaWhatsapp className="w-4 h-4 mr-2.5 text-accent-bright" />
                      ) : (
                        <span className="material-symbols-outlined text-lg mr-2.5 text-accent-bright">
                          call
                        </span>
                      )}
                      {whatsappReady ? "WhatsApp us" : "Call us"}
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Meta strip */}
            <div className={metaClass}>
              <span>{siteConfig.location}</span>
              <span>{siteConfig.timezone}</span>
              <span>Replies within 1 business day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
