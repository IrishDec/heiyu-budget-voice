"use client";


import Menu from "./components/Menu";
import React, { useState, useEffect } from "react";



export default function Home() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [entryType, setEntryType] = useState<"Expense" | "Income">("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  // 💾 Local storage persistence
  useEffect(() => {
    const saved = localStorage.getItem("heiyu_budget_entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("heiyu_budget_entries", JSON.stringify(entries));
  }, [entries]);

  // 🎙️ Voice recognition
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
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();
      setText(spokenText);

      const lower = spokenText.toLowerCase();
      const typeGuess =
        lower.includes("income") || lower.includes("earned") || lower.includes("received")
          ? "Income"
          : "Expense";

      const amountMatch = spokenText.match(/(\d+([.,]\d{1,2})?)/);
      const amount = amountMatch ? amountMatch[1].replace(",", ".") : null;

      const entry = {
        type: typeGuess,
        text: spokenText,
        amount,
         created_at: new Date().toISOString(),
      };

      setEntries((prev) => [entry, ...prev].slice(0, 50));
      alert(`🎙️ Saved ${entry.type}: "${spokenText}"`);
       setText(""); // 
    };
    recognition.onerror = (e: any) => {
      console.error("Speech error:", e.error);
      alert("Speech recognition error: " + e.error);
    };
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  // 💾 Manual Add
const handleAdd = () => {
  const fullText = `${entryType} ${
    amount ? `€${amount}` : ""
  } ${category || ""} ${notes || ""}`.trim();

  if (!fullText) {
    alert("Please enter or say something first!");
    return;
  }

  const entry = {
    type: entryType,
    text: fullText,
    amount: amount || null,
    category: category || null,
    notes: notes || null,
    created_at: new Date().toISOString(),

  };

  setEntries((prev) => [entry, ...prev].slice(0, 50));
  alert(`✅ Added ${entry.type}: "${entry.text}"`);
  setText("");
  setAmount("");
  setCategory("");
  setNotes("");
  setManualMode(false);
};


  const handleClear = () => {
    if (confirm("Clear all entries?")) {
      setEntries([]);
      localStorage.removeItem("heiyu_budget_entries");
    }
  };
    // 📊 Totals logic for Income & Expense
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

  const isSameWeek = (d1: Date, d2: Date) => {
    const oneJan = new Date(d1.getFullYear(), 0, 1);
    const week1 = Math.ceil(((+d1 - +oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
    const week2 = Math.ceil(((+d2 - +oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
    return d1.getFullYear() === d2.getFullYear() && week1 === week2;
  };

  const isSameMonth = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

  const getTotals = (type: "Income" | "Expense") => {
    let today = 0,
      week = 0,
      month = 0;
    entries.forEach((e) => {
      if (e.type !== type || !e.amount) return;
      const entryDate = new Date(e.created_at);
      const amt = parseFloat(e.amount);
      if (isSameDay(now, entryDate)) today += amt;
      if (isSameWeek(now, entryDate)) week += amt;
      if (isSameMonth(now, entryDate)) month += amt;
    });
    return { today, week, month };
  };

  
  const incomeTotals = getTotals("Income");
  const expenseTotals = getTotals("Expense");


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center justify-center px-4 py-10">
      <Menu />
       <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Heiyu<span className="text-indigo-400">Budget</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">Fast voice or text budgeting.</p>

        {/* 🎤 Mic button */}
        <button
          onClick={handleMicClick}
          className={`relative w-full py-4 text-lg font-semibold rounded-full text-white shadow-lg mb-4 transition-all duration-300 ${
            listening
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse"
              : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:brightness-110"
          }`}
        >
          {listening ? "🎙️ Listening..." : "🎤 Tap to Speak"}
        </button>

        {/* ✏️ Add by Text */}
        {!manualMode && (
          <button
            onClick={() => setManualMode(true)}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition"
          >
            ✏️ Add by Text
          </button>
        )}

        {/* ✏️ Manual form */}
        {manualMode && (
          <div className="bg-gray-800/60 p-5 mt-5 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md text-left">
            <h3 className="text-lg font-semibold mb-3 text-indigo-300">Add Entry</h3>

            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as "Expense" | "Income")}
              className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option>Expense</option>
              <option>Income</option>
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Amount (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-3 rounded-full font-semibold text-white shadow-md hover:brightness-110 transition"
            >
              💾 Save Entry
            </button>
          </div>
        )}

      {/* 🧾 Recent Entries */}
        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-md text-left">
            <div className="flex items-center justify-between mb-3">
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
                    <strong>{e.type}:</strong> {e.text}
                  </p>
                  {e.amount && (
                    <p
                      className={`text-sm ${
                        e.type === "Income" ? "text-emerald-400" : "text-pink-400"
                      }`}
                    >
                      €{parseFloat(e.amount).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{e.created_at}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
  {/* 💵 Totals Summary */}
        <div className="bg-gray-800/60 p-5 mt-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-md text-center">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">Totals Summary</h3>

          {/* Header Row */}
          <div className="grid grid-cols-4 text-sm font-semibold text-gray-300 mb-3">
            <div></div>
            <div>Today</div>
            <div>Week</div>
            <div>Month</div>
          </div>

          {/* Income Row */}
          <div className="grid grid-cols-4 text-sm items-center mb-2">
            <div className="font-medium text-emerald-400">Income</div>
            <div>€{incomeTotals.today.toFixed(2)}</div>
            <div>€{incomeTotals.week.toFixed(2)}</div>
            <div>€{incomeTotals.month.toFixed(2)}</div>
          </div>

          {/* Expense Row */}
          <div className="grid grid-cols-4 text-sm items-center">
            <div className="font-medium text-pink-400">Expense</div>
            <div>€{expenseTotals.today.toFixed(2)}</div>
            <div>€{expenseTotals.week.toFixed(2)}</div>
            <div>€{expenseTotals.month.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
  