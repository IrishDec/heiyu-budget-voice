import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Heiyu Taxi | Built by a Driver, For Drivers",
  description: "Heiyu Taxi was built by a Dublin taxi driver with 14 years of experience. The ultimate voice-powered income and expense tracker for gig workers worldwide.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-indigo-400 text-sm mb-6 block hover:text-indigo-300 transition">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-4">
          The Budget App Built Behind the Wheel
        </h1>
        
        <div className="text-lg text-gray-300 mb-8 leading-relaxed space-y-4">
          <p>
            <strong>Heiyu Taxi</strong> wasn't built in a boardroom. It was built on the streets of Dublin.
          </p>
          <p>
            I spent <strong>14 years as a Taxi Driver</strong>. I know the chaos of tracking cash fares, stuffing fuel receipts into the glovebox, and trying to figure out your net profit at the end of a 12-hour shift.
          </p>
          <p>
            I built Heiyu because the existing apps were too complicated. When you are driving, you don't have time to type. You need to speak, save, and keep moving.
          </p>
        </div>

        {/* SEO Feature Block */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="font-bold text-white mb-2">Voice-First Tracking</h3>
            <p className="text-gray-400 text-sm">
              Keep your eyes on the road. Just tap and say <em>"Spent 50 on Fuel"</em> or <em>"Income 25 Airport run"</em>.
            </p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-white mb-2">Global & Flexible</h3>
            <p className="text-gray-400 text-sm">
              Built in Ireland, but works everywhere. Supports <strong>all currencies</strong>. Perfect for taxi drivers, delivery riders, freelancers, and anyone who needs to track cash flow fast.
            </p>
          </div>
        </div>

        <section className="border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-400">Why Heiyu?</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>No Subscriptions Required:</strong> Start tracking for free.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>Cloud Sync:</strong> Your data is safe in the cloud. Lose your phone? You don't lose your tax records.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span><strong>Privacy First:</strong> Your financial data is encrypted and yours alone.</span>
            </li>
          </ul>
        </section>

        <div className="mt-10">
          <Link 
            href="/" 
            className="block w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-center py-4 rounded-xl font-bold text-white hover:opacity-90 transition"
          >
            Start Tracking Now
          </Link>
        </div>
      </div>
    </main>
  );
}