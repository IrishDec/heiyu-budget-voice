"use client";

import Link from "next/link";

export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">🆕 Updates & New Features</h1>
      <p className="text-gray-400 mb-8">
        Here you'll find the latest improvements, fixes, and upcoming plans for <strong>HeiyuBudget</strong>.
      </p>
      <div className="max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-left">
        <ul className="space-y-3 text-sm text-gray-300">
          <li>✅ Voice recognition improved for multi-word categories.</li>
          <li>✅ Added delete confirmation for data tables.</li>
          <li>🧱 Next up: separate Business and Personal expense tracking.</li>
          <li>🛠️ Performance and privacy updates in progress.</li>
        </ul>
      </div>

      <Link href="/" className="block mt-8 text-indigo-400 hover:text-indigo-300 text-sm">
        ← Back to Dashboard
      </Link>
    </main>
  );
}