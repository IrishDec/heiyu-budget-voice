import Link from "next/link";

export default function Terms() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-gray-300 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      
      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Introduction</h2>
      <p className="mb-4">
        Heiyu Budget is a productivity tool designed to help freelancers, taxi drivers, and gig workers track their income.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Disclaimer</h2>
      <p className="mb-4">
        <strong>We are not accountants.</strong> While we strive for accuracy, Heiyu Budget is a record-keeping tool, not a substitute for professional tax advice. You are responsible for verifying your own tax returns and financial declarations.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Service Availability</h2>
      <p className="mb-4">
        We do our best to keep the service online 24/7. However, we are not liable for any loss of data or business disruption caused by downtime or technical failures. We strongly recommend keeping backups of critical tax data.
      </p>

      <Link href="/" className="text-indigo-400 hover:text-indigo-300 mt-10 block font-semibold">← Back to App</Link>
    </main>
  );
}