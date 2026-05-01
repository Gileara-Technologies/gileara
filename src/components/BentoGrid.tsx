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
      title: "Custom Software Development",
      desc: "We design and build web and mobile applications tailored to how your business actually operates — not off-the-shelf, not generic.",
      icon: "code_blocks",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      color: "teal-500",
      tag: "BUILD"
    },
    {
      title: "E-Commerce & Business Platforms",
      desc: "From online stores to booking systems and customer portals — we build the digital infrastructure that lets your business transact and grow.",
      icon: "shopping_cart",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
      color: "brand-primary",
      tag: "SELL"
    },
    {
      title: "CRM & Workflow Automation",
      desc: "We replace manual, repetitive processes with smart systems — so your team spends time growing the business, not managing spreadsheets.",
      icon: "rebase_edit",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      color: "indigo-500",
      tag: "ORGANISE"
    },
    {
      title: "Digital Strategy & Advisory",
      desc: "Not sure where to start? We help you map the right technology path for your business goals and manage the build from start to finish.",
      icon: "strategy",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      color: "sky-500",
      tag: "PLAN"
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
          <h3 className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">What We Do</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">Solutions Built Around Your Business</h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">We don't sell software packages. We build what your business actually needs.</p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={item} 
              className="group relative md:aspect-[16/10] overflow-hidden rounded-3xl border border-brand-secondary/30 bg-brand-surface shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-500"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: `url('${service.image}')` }}
              ></div>
              
              {/* Overlays - Theme Aware */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/70 to-transparent dark:from-[#0f172a] dark:via-[#0f172a]/70 dark:to-transparent"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-10 transition-opacity duration-500 bg-brand-primary"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end">
                <div className={`w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-brand-surface/90 backdrop-blur-md border border-brand-secondary/50 text-${service.color} group-hover:scale-110 transition-transform duration-500`}>
                  <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="text-[10px] font-mono text-brand-primary font-bold tracking-[0.2em] uppercase">
                    [ {service.tag} ]
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-brand-text leading-tight">{service.title}</h4>
                  <p className="text-brand-muted text-sm leading-relaxed md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:transform md:translate-y-4 md:group-hover:translate-y-0 max-w-lg">
                    {service.desc}
                  </p>
                  
                  <div className="pt-2 md:pt-4 overflow-hidden">
                    <Link href="#contact" className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-teal-500 transition-colors uppercase tracking-widest group/link">
                      Discuss Project <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Scanline Effect on Hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500">
                <div className="w-full h-1 bg-brand-primary/20 animate-scanline"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
