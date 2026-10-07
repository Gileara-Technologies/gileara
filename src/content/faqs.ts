/**
 * Single source of truth for FAQ questions and answers.
 * Consumers: /faq page (rendered accordion) + FAQPage JSON-LD on the same
 * page — schema always mirrors what is actually rendered.
 *
 * Honesty rules (D4/D5): no invented client outcomes, no promised results;
 * package availability wording matches packages.ts status chips.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How much do your packages cost?",
    answer:
      "Every price is published on our Packages & Services page. Packages start at $550 setup + $85/month (Digital Foundation Basic) and scale up to enterprise tiers at $16,300 + $1,360/month (Business Intelligence). Each tier's full feature matrix is listed so you can compare before you ever talk to us.",
  },
  {
    question: "Can I pay with mobile money?",
    answer:
      "Yes. Mobile money is one of our standard billing rails, alongside card payments and bank transfer. We invoice in USD but settle in the way that suits your business. We'll confirm the available methods on the discovery call based on your bank and country.",
  },
  {
    question: "What does 'managed services included' actually mean?",
    answer:
      "It means your monthly fee covers more than software access: IT support, software updates, backups, and security monitoring are built into every tier, with SLA-backed response times and dedicated engineering at the Enterprise tier. Support isn't billed separately.",
  },
  {
    question: "Am I locked into a long contract?",
    answer:
      "Contracts are cancellable per their written terms, with no surprise lock-ins. Before you sign anything, your consultation lays out exactly what the commitment is, and your data remains yours throughout (see below).",
  },
  {
    question: "Who owns my data and systems?",
    answer:
      "You do. Your business data lives in systems you control, and if we part ways you can export it. We spell out ownership and export paths in every engagement's terms before work begins.",
  },
  {
    question: "We run everything on spreadsheets and notebooks. Is that a problem?",
    answer:
      "That's the most common starting point we see. Migration from spreadsheets and paper records is part of how every package begins: during implementation we move your existing records into the new system with you, so nothing gets dropped.",
  },
  {
    question: "Where do you operate?",
    answer:
      "We're piloting in Ghana for now. We're based in Accra and work in GMT, and the packages are built for how business actually runs here: mobile money, chat-based ordering, low-bandwidth connections. The same packages work for any small or growing business. If you're outside Ghana, book a free consultation and we'll tell you whether we're a fit for your market today.",
  },
  {
    question: "Some packages say 'Rolling out Q4 2026'. Can I still book them?",
    answer:
      "Yes. Discovery consultations are open for all five packages right now, and booking gets you a free 30-minute call where we map your goals to the right starting point. Delivery for packages still in rollout begins once each one passes our internal readiness review. On the call we'll tell you where yours stands.",
  },
  {
    question: "What if none of the packages fit my business?",
    answer:
      "We take a limited number of bespoke engagements each quarter: custom software from $2,625, mobile applications from $2,185, and AI solutions from $3,500. Book a consultation and we'll tell you plainly whether a package or a custom build serves you better.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free consultation on our contact page — thirty minutes, no obligation. Tell us roughly where the pain is (stock tracking, customer follow-ups, reporting) and we'll come to the call prepared with a recommended starting point.",
  },
];
