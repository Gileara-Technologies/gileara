"use client";

import Image from "next/image";

export default function Founders() {
  const founders = [
    {
      name: "Amos Frederick Hughes",
      role: "Founder & CEO",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiRm8Uf7edKkLSjEOdlyZ_qNNYRKTzmigC3Y7UIndsmAb6NNumXs-EaeGT_UVu_935A7V39IxP8YSYwqR-TQORaLOnP_ZK-UWmSJTGYiGsB9B3LImhXnnFplc2Gtkdwk5IBdZsElpx6bl9TIK0BePt3nwXutiGQ0INFj5hpEG5SuUCj_C9Y6IaKqsCoKxnfAeEaXFQZpAQrZ4gav1FTG9dsVpkbCVI1hKB9ojBrFpwRyxMbbn-vo4HfrsjTPkFeAKzXgSCPp0vwjI",
      linkedin: "https://linkedin.com/in/amos-frederick-hughes-01570b22a"
    },
    {
      name: "Julian Hagan",
      role: "Co-Founder & COO",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCadEIwgceSuBLAldazfAfTBDLc-NwgNzCULBjofrjLnDjgjJVRK0neQv3D4wB6QA0cjGOhwWhd1fgX3mz2Y51ZFvowqRTFXj-k66bUVydwLf_yaUOounGrr6J-caJ0SNQ-L-_kqVAfOmudzM-EhLU7IVW6UmdCc70f1b4ikJ-OJUgF3OWYYfR4M_trKA27S6YNBELsSS1XRFrRhxJTmyiicWQ7BHld1LC2SN5RKYInnsNTqCZ7_7lLNYjWicuTILmahEEA-_BzkX4",
      linkedin: "https://linkedin.com/in/julian-hagan-441b18228"
    },
    {
      name: "Rodney Hagan",
      role: "Co-Founder & CTO",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuMwJ8rfbibIw0kQ6BWAZv8SB8ptNh0U1qYaJhgi1wrPcfgLpIRHXVZV6JNf6OEBAH-KDPeFU4q7v15PaqQT4RTYerhsyT6Bp3qdlklYNGI5ldQnd6I6ZQBlJucY-vVmqttKq8DPyefSUUcdJkuvD0E0Tad8dXJUGPq5ioXo-yD-IlWC2QyewKG68l5fmCJiXZXDw-U4EGsXjByTOKe9BVXvcwjw709M_tBek0Xb6IsxM4Xw5MyYIsv7WNTVom7CfFmVGD0wJwL34",
      linkedin: "https://linkedin.com/in/rodney-hagan-249a15233"
    }
  ];

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
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    className="w-10 h-10 bg-on-surface rounded-full flex items-center justify-center shadow-lg" 
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img className="w-5 h-5 invert dark:invert-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP8_q7sEI3aDVcJcDUhxnJdJKheIhU4NUwsLbUCERqdmFwYfbn7rqagBUDcAZhq1iNcXm2GUY_3gGO_iFWghguB1VzNpWmWraQs6hDxqtF0OrdyFfUbIroXhqNrUcyxmQjBOXbC236M4kcpjE05a4lAbyRbIAbQAOQF0PQpF-JTqMkWoUmXM_v2O12BkNkzdTLb3uino_E37EsR5Bsbk2ukDBqIBo6yMlDcdsDzPwkyazJuzePFeDFGELKxUkGtwv3ynU12dVzpU0" alt="LinkedIn" />
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

