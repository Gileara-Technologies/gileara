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
                width={224}
                height={56}
                className="h-14 w-auto dark:brightness-0 dark:invert transition-all"
              />
            </div>
            <p className="text-brand-muted max-w-sm mb-10 leading-relaxed">
              Building the digital backbone for tomorrow's market leaders. Smart systems, secure foundations, and limitless scale.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-xl bg-brand-background border border-brand-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary text-brand-muted transition-all">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-brand-background border border-brand-secondary flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary text-brand-muted transition-all">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-muted">Navigation</h5>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link href="#about" className="text-brand-text hover:text-brand-primary transition-colors">Our Philosophy</Link></li>
              <li><Link href="#services" className="text-brand-text hover:text-brand-primary transition-colors">Ecosystem Services</Link></li>
              <li><Link href="#solutions" className="text-brand-text hover:text-brand-primary transition-colors">Growth Solutions</Link></li>
              <li><Link href="#approach" className="text-brand-text hover:text-brand-primary transition-colors">Systemic Approach</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-muted">Legal</h5>
            <ul className="space-y-4 text-sm font-semibold">
              <li><Link href="#" className="text-brand-text hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-brand-text hover:text-brand-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-brand-text hover:text-brand-primary transition-colors">Security Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-brand-secondary flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-brand-muted">
          <p>&copy; {new Date().getFullYear()} Gileara Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
