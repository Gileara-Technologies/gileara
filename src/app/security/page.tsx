import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-brand-text">Security Disclosure</h1>
          <div className="prose prose-invert max-w-none text-brand-muted space-y-6">
            <p>Last Updated: May 1, 2026</p>
            <p>
              At Gileara Technologies, security is at the core of everything we build. We appreciate the work of security researchers in helping us maintain a safe environment.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">Vulnerability Reporting</h2>
            <p>
              If you believe you have found a security vulnerability in our systems, please report it to us immediately. We ask that you give us a reasonable amount of time to respond and resolve the issue before making any information public.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">Contact Information</h2>
            <p>
              Please send security reports to <a href="mailto:tech.gileara@gmail.com" className="text-brand-primary">tech.gileara@gmail.com</a>. We take every report seriously and will investigate promptly.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">Our Commitment</h2>
            <p>
              We are committed to resolving security issues quickly and will not take legal action against researchers who act in good faith and follow these disclosure guidelines.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
