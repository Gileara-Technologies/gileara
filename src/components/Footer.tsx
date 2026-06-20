import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-surface-container-high dark:bg-surface-container-lowest pt-24 pb-12 px-4 md:px-10 text-on-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-12 lg:gap-16 mb-20">
          {/* Top Row: Logos & Links */}
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            {/* Left: Logos */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-8 sm:gap-10">
                {/* Gileara Block */}
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">Powered by</span>
                  <div className="flex-grow flex items-center">
                    <Image
                      src="/assets/gileara/logo-full.png"
                      alt="Gileara Logo"
                      width={224}
                      height={56}
                      sizes="(max-width: 768px) 160px, 224px"
                      className="w-40 md:w-56 h-auto filter dark:brightness-0 dark:invert transition-all"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-outline-variant/30 self-stretch my-2"></div>

                {/* Workforce Block */}
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-3">In collaboration with</span>
                  <div className="flex-grow flex items-center relative">
                    <Image
                      src="/assets/workforce/wg_darkinwhite_full-removebg-preview.png"
                      alt="Workforce Global"
                      width={320}
                      height={100}
                      sizes="(max-width: 768px) 160px, 224px"
                      className="w-40 md:w-56 h-auto object-contain block dark:hidden"
                    />
                    <Image
                      src="/assets/workforce/wg_whiteindarkfull-removebg-preview.png"
                      alt="Workforce Global"
                      width={320}
                      height={100}
                      sizes="(max-width: 768px) 160px, 224px"
                      className="w-40 md:w-56 h-auto object-contain hidden dark:block"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Links */}
            <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 lg:gap-32">
              <div>
                <h3 className="font-display text-lg font-semibold mb-5 text-on-surface tracking-tight">Navigation</h3>
                <ul className="space-y-3 text-base text-on-surface-variant">
                  <li><Link href="#services" className="hover:text-primary transition-colors">Services</Link></li>
                  <li><Link href="#approach" className="hover:text-primary transition-colors">How We Work</Link></li>
                  <li><Link href="#founders" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-5 text-on-surface tracking-tight">Legal</h3>
                <ul className="space-y-3 text-base text-on-surface-variant">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                  <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row: Tagline, Socials, Consultancy Box */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-t border-outline-variant/10 pt-8 lg:pt-0 lg:border-t-0">
            {/* Left: Tagline & Socials */}
            <div>
              <p className="text-on-surface-variant text-base leading-relaxed mb-6 max-w-md">
                Technology partners for growth. Precision innovation for enterprise and startup scaling.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 bg-surface dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/10 hover:bg-primary hover:text-white dark:hover:text-on-primary transition-all group"
                  href="https://www.linkedin.com/company/gileara"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Gileara on LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 text-on-surface-variant group-hover:text-white dark:group-hover:text-on-primary transition-colors" />
                </a>

                <a
                  className="w-10 h-10 bg-surface dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/10 hover:bg-primary hover:text-white dark:hover:text-on-primary transition-all group"
                  href="mailto:tech.gileara@gmail.com"
                  aria-label="Email Gileara"
                >
                  <FaEnvelope className="w-4 h-4 text-on-surface-variant group-hover:text-white dark:group-hover:text-on-primary transition-colors" />
                </a>
              </div>
            </div>

            {/* Right: Consultancy Box */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-surface dark:bg-surface-container-high p-6 rounded-xl border border-outline-variant/30 dark:border-outline-variant/10">
                <span className="flex items-center gap-2 text-primary font-medium mb-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Consultancy Active
                </span>
                <p className="text-on-surface-variant text-base leading-relaxed">Precision Innovation for Enterprise Growth.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-outline-variant/30 dark:border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
          <p>© {new Date().getFullYear()} Gileara Technologies. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Built with <FaHeart className="text-secondary dark:text-primary text-sm inline-block" /> in Ghana &amp; Beyond
          </div>
        </div>
      </div>
    </footer>
  );
}
