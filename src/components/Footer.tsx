import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-20 bg-brand-surface border-t border-brand-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center mb-8">
              <Image
                src="/assets/logo-full.png"
                alt="Gileara Logo"
                width={300}
                height={75}
                className="w-56 md:w-72 h-auto filter dark:brightness-0 dark:invert transition-all"
              />
            </div>
            <p className="text-brand-muted max-w-sm mb-10 leading-relaxed">
              We design and build the digital systems that power modern businesses. From custom software to operational strategy — we are your technology partners for growth.
            </p>
            <div className="flex space-x-5">
              <a 
                href="https://www.linkedin.com/company/gileara" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-brand-background border border-brand-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary text-brand-muted transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a 
                href="mailto:tech.gileara@gmail.com" 
                className="w-10 h-10 rounded-xl bg-brand-background border border-brand-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary text-brand-muted transition-all"
                aria-label="Email"
              >
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-muted">Navigation</h5>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link href="#services" className="text-brand-text hover:text-brand-primary transition-colors">Services</Link></li>
              <li><Link href="#approach" className="text-brand-text hover:text-brand-primary transition-colors">How We Work</Link></li>
              <li><Link href="#founders" className="text-brand-text hover:text-brand-primary transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="text-brand-text hover:text-brand-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-muted">Legal</h5>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link href="/privacy" className="text-brand-text hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-brand-text hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="text-brand-text hover:text-brand-primary transition-colors">Security Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-brand-secondary flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-brand-muted">
          <p>&copy; {new Date().getFullYear()} Gileara Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Consultancy Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
