"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Founders() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const founders = [
    {
      name: "Amos Frederick Hughes",
      role: "Chief Executive Officer",
      bio: "Visionary leader driving Gileara's strategic growth and partnerships. Former enterprise architect with 15 years scaling digital infrastructure.",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Julian Hagan",
      role: "Chief Operating Officer",
      bio: "Master of operational efficiency and global scaling. Ensures every Gileara deployment is delivered with military precision and zero friction.",
      socials: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Rodney Hagan",
      role: "Chief Technology Officer",
      bio: "The engineering mastermind behind the Gileara Core. Specialized in distributed systems, zero-trust cybersecurity, and extreme-scale architecture.",
      socials: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ];

  return (
    <section id="founders" className="py-32 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4">Leadership</h3>
          <h2 className="text-5xl font-bold mb-6 text-brand-text">Meet the Founders</h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">The architects behind Gileara's digital core. A collective of engineers, strategists, and operators obsessed with scale.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-10"
        >
          {founders.map((founder, index) => (
            <motion.div key={index} variants={item} className="glass-card group p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 relative border-4 border-brand-secondary group-hover:border-brand-primary transition-colors duration-500">
                <Image
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${founder.name}&backgroundColor=0ea5e9,0d9488,6366f1`}
                  alt={founder.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-2xl font-bold mb-1 text-brand-text">{founder.name}</h4>
              <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-4">{founder.role}</p>
              <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">{founder.bio}</p>
              
              <div className="flex items-center space-x-4 mt-auto">
                <a href={founder.socials.linkedin} className="w-10 h-10 rounded-full bg-brand-surface border border-brand-secondary flex items-center justify-center text-brand-muted hover:text-[#0077b5] hover:border-[#0077b5] transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href={founder.socials.twitter} className="w-10 h-10 rounded-full bg-brand-surface border border-brand-secondary flex items-center justify-center text-brand-muted hover:text-white hover:border-white transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {founder.socials.github && (
                  <a href={founder.socials.github} className="w-10 h-10 rounded-full bg-brand-surface border border-brand-secondary flex items-center justify-center text-brand-muted hover:text-white hover:border-white transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
