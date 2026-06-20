"use client";

import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import UnderMaintenance from "./UnderMaintenance";

export default function Founders() {
  const isMaintenance = false;

  const founders = [
    {
      name: "Julian Hagan",
      role: "Co-Founder & COO",
      image: "/assets/images/julian_hagan.jpg",
      linkedin: "https://www.linkedin.com/in/julian-hagan/"
    },
    {
      name: "Amos Frederick Hughes",
      role: "Founder & CEO",
      image: "/assets/images/amos.jpg",
      linkedin: "https://linkedin.com/in/amos-frederick-hughes-01570b22a"
    },
    {
      name: "Rodney Hagan",
      role: "Co-Founder & CTO",
      image: "/assets/images/rodney_hagan.jpg",
      linkedin: "https://www.linkedin.com/in/haganrodney/"
    }
  ];

  if (isMaintenance) {
    return (
      <section id="founders" className="py-24 bg-surface-container px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs text-secondary uppercase tracking-widest">Leadership</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary">The Team Behind the Systems</h2>
          </div>
          <UnderMaintenance fullPage={false} />
        </div>
      </section>
    );
  }

  return (
    <section id="founders" className="py-24 bg-surface-container px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-xs text-secondary uppercase tracking-widest">Leadership</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-primary">The Team Behind the Systems</h2>
          <p className="mt-6 text-on-surface-variant text-lg max-w-2xl">When you work with Gileara, you work directly with the founders.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {founders.map((founder, index) => (
            <div key={index} className="group">
              <div className="aspect-[4/5] bg-surface-container-high rounded-2xl mb-6 overflow-hidden relative shadow-md border border-outline-variant/5">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} on LinkedIn`}
                  >
                    <FaLinkedin className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
              <h3 className="font-display text-2xl font-semibold text-on-surface">{founder.name}</h3>
              <p className="text-primary font-semibold font-mono text-xs uppercase tracking-wider mt-2">{founder.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
