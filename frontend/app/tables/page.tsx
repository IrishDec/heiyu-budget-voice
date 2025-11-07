"use client";

import React, { useEffect, useState } from "react";
import DataTables from "../components/DataTables";

export default function TablesPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("heiyu_budget_entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-400">
          📊 Data Tables
        </h1>
        <p className="text-gray-400 text-center mb-6">
          View your full income and expense records.
        </p>

        <DataTables entries={entries} />
      </div>
    </main>
  );
}
