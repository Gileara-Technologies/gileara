"use client";

export default function TechMarquee() {
  const techs = [
    { name: "Rust Engineering", color: "bg-brand-primary" },
    { name: "Kubernetes Cloud", color: "bg-teal-500" },
    { name: "Zero Trust Security", color: "bg-indigo-500" },
    { name: "Next.js Frontiers", color: "bg-sky-500" },
    { name: "PyTorch AI", color: "bg-brand-primary" },
    { name: "Distributed Systems", color: "bg-teal-500" },
  ];

  return (
    <section className="py-12 border-y border-brand-secondary/50 bg-brand-surface/20 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {techs.map((tech, index) => (
            <div key={index} className="flex items-center space-x-3 text-brand-muted/60 font-bold tracking-widest text-sm uppercase">
              <span className={`w-2 h-2 ${tech.color} rounded-full`}></span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="marquee-content" aria-hidden="true">
          {techs.map((tech, index) => (
            <div key={`dup-${index}`} className="flex items-center space-x-3 text-brand-muted/60 font-bold tracking-widest text-sm uppercase">
              <span className={`w-2 h-2 ${tech.color} rounded-full`}></span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
