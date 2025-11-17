"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Link from "next/link";
import { getWeeklyIncome } from "./lib/income/connectToBudget.js";
import { loadCategories, saveCategories } from "./lib/categoryStore.js";
import { loadEntries, saveEntries } from "./lib/entriesStore.js";


// ✅ Custom event type to fix SpeechRecognition TS issues
interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
}

type EntryType = "Income" | "Expense";

type Entry = {
  type: EntryType;
  amount: string;
  category: string;
  text?: string;
  created_at: string;
};

type CategoryState = {
  incomeCategories: string[];
  expenseCategories: string[];
};

export default function Home() {
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load category list
  const { incomeCategories, expenseCategories } = loadCategories() as CategoryState;


  const [entries, setEntries] = useState<Entry[]>(loadEntries());

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  // ✅ Load entries (synchronously)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("heiyu_budget_entries");
      if (saved) {
        const parsed: Entry[] = JSON.parse(saved);
        setEntries(parsed); // Directly load on mount
      }
    } catch (err) {
      console.error("Error loading entries:", err);
    }
  }, []);

  // ✅ Save entries
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("heiyu_budget_entries", JSON.stringify(entries));
    } catch (err) {
      console.error("Error saving entries:", err);
    }
  }, [entries]);

  // 🎙️ Voice entry
  const handleMicClick = () => {
    // Safety: only run in browser
    if (typeof window === "undefined") {
      alert("Speech recognition only works in the browser.");
      return;
    }

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const spokenText = event.results[0][0].transcript.trim();
      const lower = spokenText.toLowerCase();

      // 1️⃣ Must start with Income or Expense
      let type: EntryType | null = null;
      if (lower.startsWith("income")) type = "Income";
      if (lower.startsWith("expense")) type = "Expense";

      if (!type) {
        alert(
          "Please start with 'Income' or 'Expense'.\nExample: Income 20 Street cash"
        );
        return;
      }

      // 2️⃣ Extract numeric amount (10, 10.50, 10,50)
      const amountMatch = spokenText.match(/(\d+([.,]\d{1,2})?)/);
      if (!amountMatch) {
        alert("No amount found. Say: Income 20 Street cash");
        return;
      }

      const rawAmount = amountMatch[1];
      const parsedAmount = rawAmount.replace(",", ".");

      // 3️⃣ Category = everything after amount
      let cat = spokenText.split(rawAmount)[1]?.trim() ?? "";

      // Remove leading currency words
      cat = cat.replace(
        /^(dollar|dollars|euro|euros|pound|pounds|yen|yuan|peso|rupee|€|\$|£|¥)\s*/i,
        ""
      );

      if (!cat) cat = "Uncategorized";

      // 🆙 Auto-capitalize category
      cat = cat
        .split(" ")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      const entry: Entry = {
        type,
        amount: parsedAmount,
        category: cat,
        text: spokenText,
        created_at: new Date().toISOString(),
      };

      setEntries((prev) => [entry, ...prev].slice(0, 50));
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

  // 🧮 Totals – with proper Monday–Sunday weeks and calendar months
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const isSameDayAsToday = (d: Date) => {
    const dStart = new Date(d);
    dStart.setHours(0, 0, 0, 0);
    return dStart.getTime() === todayStart.getTime();
  };

  // Week: Monday 00:00 → Sunday 23:59:59
  const weekStart = new Date(todayStart);
  const day = weekStart.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diffFromMonday = (day + 6) % 7;
  weekStart.setDate(weekStart.getDate() - diffFromMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Month: first of this month 00:00 → first of next month 00:00
  const monthStart = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    1
  );
  const monthEnd = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth() + 1,
    1
  );

  const sumFor = (type: EntryType) => {
    let today = 0,
      week = 0,
      month = 0;

    entries.forEach((e) => {
      if (e.type !== type) return;
      const d = new Date(e.created_at);
      const val = parseFloat(e.amount);
      if (isNaN(val)) return;

      if (isSameDayAsToday(d)) today += val;
      if (d >= weekStart && d <= weekEnd) week += val;
      if (d >= monthStart && d < monthEnd) month += val;
    });

    return { today, week, month };
  };

  const incomeTotals = sumFor("Income");
  const expenseTotals = sumFor("Expense");


  // 🧹 Clear
  const handleClear = () => {
    if (confirm("Clear all entries?")) {
      setEntries([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("heiyu_budget_entries");
      }
    }
  };

  // 💾 Save new category
  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) return;

    const formatTitle = (name: string) =>
      name
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const formatted = formatTitle(newCategoryName.trim());

    const current = loadCategories() as CategoryState;

    const updated =
      entryType === "Income"
        ? {
            incomeCategories: [...current.incomeCategories, formatted],
            expenseCategories: current.expenseCategories,
          }
        : {
            incomeCategories: current.incomeCategories,
            expenseCategories: [...current.expenseCategories, formatted],
          };

    saveCategories(updated);
    setNewCategoryName("");
    setShowCategoryModal(false);
    alert(`Category "${formatted}" saved!`);
  };

  // 🧱 UI
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

        {/* 🎙️ Mic */}
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

        {/* ✏️ Manual Add + ➕ New Category */}
        {!manualMode ? (
          <>
            <button
              onClick={() => setManualMode(true)}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition"
            >
              ✏️ Add by Text
            </button>

            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition mt-3"
            >
              ➕ Add New Category
            </button>
<Link
  href="/categories"
  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 py-3 rounded-full font-medium shadow-md hover:brightness-110 transition mt-3 block text-center"
>
  📁 Manage Categories
</Link>

          </>
        ) : (
          <div className="bg-gray-800/60 p-5 mt-5 rounded-2xl shadow-xl border border-gray-700 text-left">
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as EntryType)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>

            <input
              type="number"
              placeholder="Amount (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />

            {/* Category with filtered datalist based on Income/Expense */}
            <input
              list="categoryList"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />

            <datalist id="categoryList">
              {(entryType === "Income"
                ? incomeCategories
                : expenseCategories
              ).map((c: string, i: number) => (
                <option key={i} value={c} />
              ))}
            </datalist>

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

            <button
              onClick={() => setManualMode(false)}
              className="w-full mt-3 border border-gray-500 text-gray-300 py-2 rounded-full text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* 📊 Totals */}
        <div className="bg-gray-800/60 p-5 mt-6 rounded-2xl border border-gray-700 text-center">
          <div className="flex justify-between items-center mb-4 w-full">
            <h3 className="text-lg font-semibold text-indigo-300">
              Totals Summary
            </h3>
            <Link
            href="/history"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
           View All →
          </Link>

            </div>
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

        {/* 🧾 Recent */}
        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl border border-gray-700 text-left">
            <div className="flex justify-between items-center mb-3 w-full">
              <h3 className="text-lg font-semibold text-indigo-300">
                Recent Entries
              </h3>
               <Link
               href="/history"
               className="text-xs text-indigo-400 hover:text-indigo-300 transition"
               >
               View All →
               </Link>

            </div>

            <ul className="max-h-40 overflow-y-auto">
              {entries.map((e, i) => (
                <li key={i} className="border-b border-gray-700 py-2">
                  <p className="text-sm text-gray-200">
                    <strong>{e.type}:</strong> {e.category} (
                    {`€${parseFloat(e.amount).toFixed(2)}`})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(e.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ➕ Add Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-full max-w-xs">
              <h2 className="text-lg font-semibold mb-4 text-indigo-300">
                Add New Category
              </h2>

              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              />

              <div className="flex gap-4 mb-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="catType"
                    value="Income"
                    checked={entryType === "Income"}
                    onChange={() => setEntryType("Income")}
                  />
                  Income
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="catType"
                    value="Expense"
                    checked={entryType === "Expense"}
                    onChange={() => setEntryType("Expense")}
                  />
                  Expense
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-2 rounded-full text-white font-semibold"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setNewCategoryName("");
                    setShowCategoryModal(false);
                  }}
                  className="flex-1 border border-gray-500 text-gray-300 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>{" "}
      {/* closes w-full max-w-sm */}
    </main>
  );
}
