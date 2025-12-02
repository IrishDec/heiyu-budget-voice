import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-12">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="text-indigo-400 text-sm mb-6 block hover:text-indigo-300 transition"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-400 mb-8">
          Have a feature request, found a bug, or need to request account
          deletion? We'd love to hear from you.
        </p>

        {/* Direct Email Card */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            General Inquiries & Support
          </p>
          <a
            href="mailto:info@heiyudigital.com"
            className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition"
          >
            info@heiyudigital.com
          </a>
        </div>

        {/* FAQ Section */}
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 mb-1">
              Is my data safe?
            </h3>
            <p className="text-xs text-gray-500">
              Yes. Your data is encrypted and stored securely in the cloud using
              enterprise-grade database security (RLS).
            </p>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 mb-1">
              How do I delete my account?
            </h3>
            <p className="text-xs text-gray-500">
              Please email us at the address above to request full data
              deletion.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
