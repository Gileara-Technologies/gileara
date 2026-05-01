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
      role: "Founder & CEO",
      bio: "Amos leads Gileara's strategic direction, focusing on business architecture and high-level partnerships. He ensures that every project we take on aligns with our clients' long-term business goals.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
      linkedin: "https://linkedin.com/in/amos-frederick-hughes-01570b22a"
    },
    {
      name: "Julian Hagan",
      role: "Co-Founder & COO",
      bio: "Julian manages Gileara's day-to-day operations and project delivery. With a background in technical project management, he ensures that our builds stay on track, on budget, and up to standard.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      linkedin: "https://linkedin.com/in/julian-hagan-441b18228"
    },
    {
      name: "Rodney Hagan",
      role: "Co-Founder & CTO",
      bio: "Rodney is the engineering heart of the firm. He leads our technical design and systems engineering, ensuring that everything we build is secure, scalable, and built on a foundation of clean code.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      linkedin: "https://linkedin.com/in/rodney-hagan-249a15233"
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
          <h2 className="text-5xl font-bold mb-6 text-brand-text">The Team Behind the Systems</h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">We are a small, dedicated team of engineers and operators. When you work with Gileara, you work directly with the founders.</p>
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
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 relative border-4 border-brand-secondary group-hover:border-brand-primary transition-colors duration-500">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="text-2xl font-bold mb-1 text-brand-text">{founder.name}</h4>
              <p className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-4">{founder.role}</p>
              <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-grow">{founder.bio}</p>
              
              <div className="flex items-center space-x-4 mt-auto">
                <a 
                  href={founder.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-brand-surface border border-brand-secondary flex items-center justify-center text-brand-muted hover:text-[#0077b5] hover:border-[#0077b5] transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus:outline-none"
                  aria-label={`${founder.name} LinkedIn`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
