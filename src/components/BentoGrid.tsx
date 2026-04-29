"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BentoGrid() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    {
      title: "Embedded Cybersecurity",
      desc: "Proactive defense-in-depth architecture that protects your digital assets from day one. We don't just secure apps; we secure the environment.",
      icon: "shield_lock",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      color: "brand-primary",
      tag: "SECURITY_CORE"
    },
    {
      title: "Scalable Software",
      desc: "High-performance applications built for extreme concurrency and global reach. Engineered with Rust, Go, and Next.js for maximum velocity.",
      icon: "code_blocks",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      color: "teal-500",
      tag: "SOFTWARE_ARCH"
    },
    {
      title: "Cloud Infrastructure",
      desc: "Robust backbone infrastructure that handles your load without breaking a sweat. Managed Kubernetes and multi-cloud resilience by design.",
      icon: "cloud_sync",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      color: "indigo-500",
      tag: "INFRA_SCALE"
    }
  ];

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Core Expertise</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">The Gileara Ecosystem</h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">Symmetrical, integrated solutions where security and performance are baked into the core architecture.</p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={item} 
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-brand-secondary/30 bg-brand-surface"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: `url('${service.image}')` }}
              ></div>
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-brand-primary"></div>
              
              {/* Content */}
              <div className="relative z-10 p-10 h-full flex flex-col">
                <div className={`w-14 h-14 mb-auto flex items-center justify-center rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-brand-secondary/50 text-${service.color} group-hover:scale-110 transition-transform duration-500`}>
                  <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-brand-primary font-bold tracking-[0.2em] uppercase">
                    [ {service.tag} ]
                  </div>
                  <h4 className="text-3xl font-bold text-brand-text leading-tight">{service.title}</h4>
                  <p className="text-brand-muted text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {service.desc}
                  </p>
                  
                  <div className="pt-4 overflow-hidden">
                    <Link href="#contact" className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-teal-400 transition-colors uppercase tracking-widest">
                      Explore Capabilities <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Scanline Effect on Hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <div className="w-full h-1 bg-white/20 animate-scanline"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
