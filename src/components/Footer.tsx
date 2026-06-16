import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaEnvelope, FaHeart, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-surface-container-high dark:bg-surface-container-lowest pt-24 pb-12 px-4 md:px-10 text-on-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/assets/gileara/logo-full.png"
                alt="Gileara Logo"
                width={224}
                height={56}
                className="w-40 md:w-56 h-auto filter dark:brightness-0 dark:invert transition-all"
              />
            </div>
            <p className="text-on-surface-variant text-sm mb-8 max-w-sm">
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
          <div className="md:col-span-2 md:col-start-6">
            <h5 className="font-display text-lg mb-6 text-primary dark:text-on-surface">Navigation</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="#approach" className="hover:text-primary transition-colors">How We Work</Link></li>
              <li><Link href="#founders" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="font-display text-lg mb-6 text-primary dark:text-on-surface">Legal</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="bg-surface dark:bg-surface-container-high p-6 rounded-xl border border-outline-variant/30 dark:border-outline-variant/10">
              <span className="flex items-center gap-2 text-secondary dark:text-primary font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-secondary dark:bg-primary animate-pulse"></span>
                Consultancy Active
              </span>
              <p className="text-on-surface-variant text-sm italic">Precision Innovation for Enterprise Growth.</p>
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

