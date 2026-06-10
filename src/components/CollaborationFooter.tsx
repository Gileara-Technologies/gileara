import Image from "next/image";

export default function CollaborationFooter() {
  return (
    <div className="w-full bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant/20 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="text-center md:text-right">
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-4">In Partnership With</p>
          <Image
            src="/assets/wg_darkinwhite_full.jpg"
            alt="Workforce Global logo"
            width={320}
            height={100}
            className="h-16 md:h-24 w-auto object-contain block dark:hidden mx-auto md:ml-auto md:mr-0"
          />
          <Image
            src="/assets/wg_whiteindarkfull.jpg"
            alt="Workforce Global logo"
            width={320}
            height={100}
            className="h-16 md:h-24 w-auto object-contain hidden dark:block mx-auto md:ml-auto md:mr-0"
          />
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-px h-16 bg-outline-variant/30"></div>
        {/* Divider for mobile */}
        <div className="md:hidden w-16 h-px bg-outline-variant/30"></div>

        <div className="text-center md:text-left">
          <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-4">Powered By</p>
          <Image
            src="/assets/logo-full.png"
            alt="Gileara logo"
            width={320}
            height={80}
            className="h-14 md:h-20 w-auto object-contain filter dark:brightness-0 dark:invert mx-auto md:mr-auto md:ml-0"
          />
        </div>
      </div>
    </div>
  );
}
