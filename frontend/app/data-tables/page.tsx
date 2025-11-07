"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "../components/Menu";
import DataTables from "../components/DataTables";

export default function DataTablesPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Only run in the browser
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("heiyu_budget_entries");
        if (saved) setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries:", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
      <Menu />
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-indigo-300 mb-2">📊 Data Tables</h1>
        <p className="text-gray-400 mb-6">View your full income and expense records.</p>

        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <DataTables entries={entries} />
      </div>
    </main>
  );
}
