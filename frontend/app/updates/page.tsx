"use client";

import Link from "next/link";

export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-indigo-400 mb-3">
        🆕 Latest Updates
      </h1>

      <p className="text-gray-400 mb-10 text-sm max-w-md mx-auto">
        HeiyuBudget evolves fast. <span className="text-indigo-300">Refresh this page often</span> —
        new improvements and features are added regularly.
      </p>

      <div className="max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-left shadow-lg">
        <h2 className="text-indigo-300 font-semibold mb-4 text-sm tracking-wide">
          Recent Highlights
        </h2>

        <ul className="space-y-3 text-gray-300 text-sm">
          <li>⚡ Faster voice entry recognition & improved accuracy.</li>
          <li>🗂️ Cleaner History filtering with better category logic.</li>
          <li>🧹 Visual polish across buttons, spacing, and animations.</li>
          <li>🔐 Security & performance enhancements under the hood.</li>
        </ul>
      </div>

      <Link
        href="/"
        className="block mt-10 text-indigo-400 hover:text-indigo-300 text-sm"
      >
        ← Back to Dashboard
      </Link>
    </main>
  );
}

