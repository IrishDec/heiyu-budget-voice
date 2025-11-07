"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Link from "next/link";

type EntryType = "Income" | "Expense";

type Entry = {
  type: EntryType;
  amount: string;
  category: string;
  text?: string;
  created_at: string; // ISO string
};

export default function Home() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // ✅ Load entries from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("heiyu_budget_entries");
    if (!saved) return;
    try {
      const parsed: Entry[] = JSON.parse(saved).map((e: Entry) => ({
        ...e,
        created_at: e.created_at
          ? new Date(e.created_at).toISOString()
          : new Date().toISOString(),
      }));
      // use functional update inside a microtask to avoid lint warning
      Promise.resolve().then(() => setEntries(parsed));
    } catch (err) {
      console.error("Error parsing saved entries:", err);
    }
  }, []);

  // ✅ Save entries whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("heiyu_budget_entries", JSON.stringify(entries));
    } catch (err) {
      console.error("Error saving entries:", err);
    }
  }, [entries]);


 // 🎙️ Voice
const handleMicClick = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onstart = () => setListening(true);
  recognition.onresult = (event: any) => {
    const spokenText = event.results[0][0].transcript.trim();
    setText(spokenText);

    const lower = spokenText.toLowerCase();
    const type: EntryType = lower.includes("income") ? "Income" : "Expense";

    const amountMatch = spokenText.match(/(\d+([.,]\d{1,2})?)/);
    const rawAmount = amountMatch ? amountMatch[1] : "";
    const parsedAmount = rawAmount.replace(",", ".");

    // 🧠 Improved category detection
    const words = spokenText.split(/\s+/);
    const amtIndex = rawAmount
      ? words.findIndex((w: string) => w.replace(/[^0-9.,]/g, "") === rawAmount)
      : -1;

    let cat = "Uncategorized";
    if (amtIndex !== -1) {
      const nextWord = words[amtIndex + 1];
      if (
        nextWord &&
        !["income", "expense", "euro", "€"].includes(nextWord.toLowerCase())
      ) {
        cat = nextWord;
      }
    }

    if (!parsedAmount) {
      alert("Couldn't detect an amount. Try again.");
      return;
    }

    const entry: Entry = {
      type,
      amount: parsedAmount,
      category: cat,
      text: spokenText,
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev].slice(0, 50));
    setText("");
  };

  recognition.onerror = () => setListening(false);
  recognition.onend = () => setListening(false);
  recognition.start();
};


  // ✏️ Manual Add
  const handleAdd = () => {
    if (!amount) {
      alert("Enter an amount.");
      return;
    }

    const entry: Entry = {
      type: entryType,
      amount,
      category: category || "Uncategorized",
      text: `${entryType} €${amount} ${category || ""} ${notes || ""}`.trim(),
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [entry, ...prev].slice(0, 50));
    setAmount("");
    setCategory("");
    setNotes("");
    setManualMode(false);
  };

  // 🧹 Clear
  const handleClear = () => {
    if (confirm("Clear all entries?")) {
      setEntries([]);
      localStorage.removeItem("heiyu_budget_entries");
    }
  };

  // 📊 Totals
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const weekOf = (d: Date) =>
    Math.ceil(
      (1 +
        Math.floor(
          (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000
        ) +
        new Date(d.getFullYear(), 0, 1).getDay()) / 7
    );
  const sameWeek = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && weekOf(a) === weekOf(b);
  const sameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

  const sumFor = (type: EntryType) => {
    let today = 0,
      week = 0,
      month = 0;
    entries.forEach((e) => {
      if (e.type !== type || !e.amount) return;
      const d = new Date(e.created_at);
      const val = parseFloat(e.amount);
      if (isNaN(val)) return;
      if (sameDay(now, d)) today += val;
      if (sameWeek(now, d)) week += val;
      if (sameMonth(now, d)) month += val;
    });
    return { today, week, month };
  };

  const incomeTotals = sumFor("Income");
  const expenseTotals = sumFor("Expense");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
      <Menu />
      <div className="w-full max-w-sm text-center mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Heiyu<span className="text-indigo-400">Budget</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Fast voice or text budgeting.
        </p>

        {/* Mic */}
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

        {/* Add by Text */}
        {!manualMode && (
          <button
            onClick={() => setManualMode(true)}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition"
          >
            ✏️ Add by Text
          </button>
        )}

        {/* Manual form */}
        {manualMode && (
          <div className="bg-gray-800/60 p-5 mt-5 rounded-2xl shadow-xl border border-gray-700 text-left">
            <select
              value={entryType}
              onChange={(e) =>
                setEntryType(e.target.value as "Expense" | "Income")
              }
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
            <input
              type="text"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-3 rounded-full text-white font-semibold"
            >
              💾 Save Entry
            </button>
          </div>
        )}

        {/* Recent */}
        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl border border-gray-700 text-left">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-300">
                Recent Entries
              </h3>
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
                    <strong>{e.type}:</strong>{" "}
                    {e.category || "Uncategorized"} (€
                    {parseFloat(e.amount).toFixed(2)})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(e.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Totals */}
        <div className="bg-gray-800/60 p-5 mt-6 rounded-2xl border border-gray-700 text-center">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">
            Totals Summary
          </h3>
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
      </div>
    </main>
  );
}

