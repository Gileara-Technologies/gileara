import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-brand-text">Terms of Service</h1>
          <div className="prose prose-invert max-w-none text-brand-muted space-y-6">
            <p>Last Updated: May 1, 2026</p>
            <p>
              Welcome to Gileara Technologies. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">1. Acceptance of Terms</h2>
            <p>
              By using this site, you signify your acceptance of these Terms of Service. If you do not agree, please do not use our site.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">2. Services</h2>
            <p>
              Gileara Technologies provides technology consulting and development services. All services are subject to specific engagement contracts separate from these website terms.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">3. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property of Gileara Technologies and protected by intellectual property laws.
            </p>
            <p>
              For any legal inquiries, please contact us at <a href="mailto:tech.gileara@gmail.com" className="text-brand-primary">tech.gileara@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
