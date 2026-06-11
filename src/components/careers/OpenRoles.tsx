"use client";

import { motion } from "framer-motion";
import { FaCode, FaServer, FaBug, FaInfinity, FaPaintbrush } from "react-icons/fa6";

const roles = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    icon: <FaCode className="w-6 h-6" />,
    description: "Build beautiful, highly interactive, and performant user interfaces for our clients' web applications.",
    responsibilities: [
      "Translate UI/UX designs into high-quality code.",
      "Optimize components for maximum performance across a vast array of web-capable devices and browsers.",
      "Collaborate with backend developers to integrate APIs."
    ],
    requiredSkills: [, "TypeScript", "HTML", "CSS", "Responsive web design",
      "Modern JavaScript (ES6+)",
    ],
    niceToHave: ["React/Nextjs", "Tailwind CSS", "Git and GitHub"]
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    icon: <FaServer className="w-6 h-6" />,
    description: "Design and implement robust, scalable APIs and database architectures.",
    responsibilities: [
      "Develop server-side logic and RESTful/GraphQL APIs.",
      "Design and optimize database schemas.",
      "Ensure high performance and responsiveness to requests from the frontend."
    ],
    requiredSkills: ["Node.js", "SQL/NoSQL databases", "REST APIs", "JWT Authentication"],
    niceToHave: ["Docker",]
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    icon: <FaBug className="w-6 h-6" />,
    description: "Ensure the highest quality of our deliverables through rigorous automated and manual testing.",
    responsibilities: [
      "Create detailed, comprehensive, and well-structured test plans and test cases.",
      "Design, develop, and execute automation scripts using open source tools.",
      "Identify, record, document thoroughly, and track bugs."
    ],
    requiredSkills: ["Cypress/Playwright", "Jest/Vitest", "Manual testing methodologies", "CI/CD integration"],
    niceToHave: ["Performance testing experience", "Security testing basics"]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    icon: <FaInfinity className="w-6 h-6" />,
    description: "Streamline our deployment pipelines and manage our cloud infrastructure securely.",
    responsibilities: [
      "Build and maintain CI/CD pipelines.",
      "Manage cloud infrastructure on AWS and Cloudflare.",
      "Monitor system performance and implement security best practices."
    ],
    requiredSkills: ["Docker/Kubernetes", "GitHub Actions", "Infrastructure as Code ", "Linux Admin"],
    niceToHave: ["AWS Certifications", "Experience with OpenNext"]
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    icon: <FaPaintbrush className="w-6 h-6" />,
    description: "Craft intuitive, engaging, and accessible user experiences for complex systems.",
    responsibilities: [
      "Create wireframes, storyboards, user flows, and site maps.",
      "Design UI elements and tools such as navigation menus, search boxes, and widgets.",
      "Conduct user research and evaluate user feedback."
    ],
    requiredSkills: ["Basic HTML/CSS knowledge", "User-centered design principles", "Prototyping", "Understanding of modern web capabilities"],
    niceToHave: ["Figma", "Experience with design systems", "Familiarity with accessibility (a11y) standards"]
  }
];

export default function OpenRoles() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="roles" className="py-24 bg-background px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-secondary uppercase tracking-widest">
            Current Openings
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 text-primary">
            Join the Mission
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-8"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={item}
              className="bg-surface-container-low dark:bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm"
            >
              <div className="p-6 md:p-8 md:flex gap-8 items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mb-6 md:mb-0">
                  {role.icon}
                </div>

                <div className="flex-grow">
                  <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
                    {role.title}
                  </h3>
                  <p className="text-on-surface-variant mb-6 text-sm md:text-base leading-relaxed">
                    {role.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary dark:text-on-surface mb-3 text-sm uppercase tracking-wider font-mono">
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start text-sm text-on-surface-variant">
                            <span className="text-secondary dark:text-primary mr-2">•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary dark:text-on-surface mb-3 text-sm uppercase tracking-wider font-mono">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {role.requiredSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-surface border border-outline-variant/30 rounded-full text-xs text-on-surface font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <h4 className="font-semibold text-primary dark:text-on-surface mb-3 mt-4 text-sm uppercase tracking-wider font-mono">
                        Nice to Have
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.niceToHave.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-surface-container-high border border-outline-variant/10 rounded-full text-xs text-on-surface-variant">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
