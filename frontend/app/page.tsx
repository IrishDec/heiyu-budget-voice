"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [entryType, setEntryType] = useState<"Expense" | "Income">("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  // ✅ Load + Save entries in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("heiyu_budget_entries");
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed.map((e: any) => ({
        ...e,
        created_at: e.created_at ? new Date(e.created_at).toISOString() : new Date().toISOString(),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("heiyu_budget_entries", JSON.stringify(entries));
  }, [entries]);

  // ✅ Voice input
  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();
      setText(spokenText);

      const lower = spokenText.toLowerCase();
      const type = lower.includes("income") ? "Income" : "Expense";

      const amountMatch = spokenText.match(/(\d+([.,]\d{1,2})?)/);
      const parsedAmount = amountMatch ? amountMatch[1].replace(",", ".") : null;

      const words = spokenText.split(" ");
      const amtIndex = words.findIndex((w: string) => w.includes(amountMatch?.[1]));
      const cat = amtIndex !== -1 && words[amtIndex + 1] ? words[amtIndex + 1] : "Uncategorized";

      const entry = {
        type,
        amount: parsedAmount,
        category: cat,
        text: spokenText,
        created_at: new Date().toISOString(),
      };

      setEntries((prev) => [entry, ...prev]);
      setText("");
    };

    recognition.onend = () => setListening(false);
    recognition.start();
  };

  // ✅ Manual add
  const handleAdd = () => {
    if (!amount) return alert("Enter an amount first!");

    const entry = {
      type: entryType,
      amount,
      category: category || "Uncategorized",
      notes,
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev]);
    setAmount("");
    setCategory("");
    setNotes("");
    setManualMode(false);
  };

  // ✅ Totals calculation
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const sameWeek = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    Math.ceil((((+a - +new Date(a.getFullYear(), 0, 1)) / 86400000) + a.getDay() + 1) / 7) ===
      Math.ceil((((+b - +new Date(b.getFullYear(), 0, 1)) / 86400000) + b.getDay() + 1) / 7);
  const sameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

  const sumFor = (type: "Income" | "Expense") => {
    let today = 0, week = 0, month = 0;
    entries.forEach((e) => {
      if (e.type !== type || !e.amount) return;
      const d = new Date(e.created_at);
      const val = parseFloat(e.amount);
      if (sameDay(now, d)) today += val;
      if (sameWeek(now, d)) week += val;
      if (sameMonth(now, d)) month += val;
    });
    return { today, week, month };
  };

  const incomeTotals = sumFor("Income");
  const expenseTotals = sumFor("Expense");

  const handleClear = () => {
    if (confirm("Clear all entries?")) {
      setEntries([]);
      localStorage.removeItem("heiyu_budget_entries");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
      <Menu />
      <div className="w-full max-w-sm text-center mx-auto">
        <h1 className="text-3xl font-bold mb-2">Heiyu<span className="text-indigo-400">Budget</span></h1>
        <p className="text-gray-400 text-sm mb-8">Fast voice or text budgeting.</p>

        <button
          onClick={handleMicClick}
          className={`w-full py-4 mb-4 text-lg font-semibold rounded-full text-white shadow-lg transition ${
            listening
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
              : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:brightness-110"
          }`}
        >
          {listening ? "🎙️ Listening..." : "🎤 Tap to Speak"}
        </button>

        {!manualMode && (
          <button
            onClick={() => setManualMode(true)}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition"
          >
            ✏️ Add by Text
          </button>
        )}

        {manualMode && (
          <div className="bg-gray-800/60 p-5 mt-5 rounded-2xl shadow-xl border border-gray-700 text-left">
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as "Expense" | "Income")}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            >
              <option>Expense</option>
              <option>Income</option>
            </select>
            <input
              type="number"
              placeholder="Amount (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-3 rounded-full text-white font-semibold"
            >
              💾 Save Entry
            </button>
          </div>
        )}

        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl border border-gray-700 text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-300">Recent Entries</h3>
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-red-400 transition"
              >
                Clear
              </button>
            </div>
            <ul className="max-h-40 overflow-y-auto">
              {entries.map((e, i) => (
                <li key={i} className="border-b border-gray-700 py-2">
                  <p className="text-sm text-gray-200">
                    <strong>{e.type}:</strong> {e.category} (€{e.amount})
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-800/60 p-5 mt-6 rounded-2xl border border-gray-700 text-center">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">Totals Summary</h3>
          <div className="grid grid-cols-4 text-sm font-semibold text-gray-300 mb-3">
            <div></div>
            <div>Today</div>
            <div>Week</div>
            <div>Month</div>
          </div>
          <div className="grid grid-cols-4 text-sm items-center mb-2">
            <div className="text-emerald-400 font-medium">Income</div>
            <div>€{incomeTotals.today.toFixed(2)}</div>
            <div>€{incomeTotals.week.toFixed(2)}</div>
            <div>€{incomeTotals.month.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-4 text-sm items-center">
            <div className="text-pink-400 font-medium">Expense</div>
            <div>€{expenseTotals.today.toFixed(2)}</div>
            <div>€{expenseTotals.week.toFixed(2)}</div>
            <div>€{expenseTotals.month.toFixed(2)}</div>
          </div>
        </div>

        <Link href="/data-tables" className="block text-indigo-400 hover:text-indigo-300 mt-4 text-sm">
          📊 View Data Tables
        </Link>
      </div>
    </main>
  );
}
