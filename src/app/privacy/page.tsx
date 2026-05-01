import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-brand-text">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none text-brand-muted space-y-6">
            <p>Last Updated: May 1, 2026</p>
            <p>
              At Gileara Technologies, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">1. Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, and business details when you contact us through our website or book a discovery call.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide our services, respond to your inquiries, and improve our website and communication.
            </p>
            <h2 className="text-2xl font-bold text-brand-text mt-8">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
            <p>
              For any questions regarding our privacy practices, please contact us at <a href="mailto:tech.gileara@gmail.com" className="text-brand-primary">tech.gileara@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
