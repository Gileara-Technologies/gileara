import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-surface-container-high dark:bg-surface-container-lowest pt-24 pb-12 px-4 md:px-10 text-on-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/assets/logo-full.png"
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
                className="w-10 h-10 bg-surface dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/10 hover:bg-primary hover:text-white dark:hover:text-on-primary transition-all" 
                href="https://www.linkedin.com/company/gileara"
                target="_blank"
                rel="noreferrer"
              >
                <img className="w-5 h-5 opacity-70 invert dark:invert-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjPKSdAi2c4E_KkZKICGrusu_y65_d7QVhiFEiftZVV_tZHQk0RIZhjdrbX5NkfPfj0-8qogsvk2pLwWbjt3DYmsIgjz1FFSSnVuKOvc-OqWaFAPWisj5ICviWXsoqFU_jjjJbNcitUADhPNiQXSe_JSVxOubizjfmamrW9ksQm5UYY5KtjyPm9o1khvHy3I-op-USySGYXiFN7NhgnujX6fOK8QUhlCHbZPHt4dz6I5RYwS3BbR45ZxRWTCZkYwo81cfRz93oDj8" alt="LinkedIn" />
              </a>
              <a 
                className="w-10 h-10 bg-surface dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/10 hover:bg-primary hover:text-white dark:hover:text-on-primary transition-all" 
                href="mailto:tech.gileara@gmail.com"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
              </a>
            </div>
          </div>
          <div className="md:col-span-2 md:col-start-6">
            <h5 className="font-display text-lg mb-6 text-primary dark:text-on-surface">Navigation</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="#approach" className="hover:text-primary transition-colors">How We Work</Link></li>
              <li><Link href="#founders" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="font-display text-lg mb-6 text-primary dark:text-on-surface">Legal</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
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
            Built with <span className="material-symbols-outlined text-secondary dark:text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> in Ghana &amp; Beyond
          </div>
        </div>
      </div>
    </footer>
  );
}

