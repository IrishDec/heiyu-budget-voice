"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Link from "next/link";
import HelpSheet from "./components/HelpSheet";


// Imports
import { 
  fetchCategories, 
  fetchEntries, 
  addEntry, 
  getWeekBounds, 
  getCurrency
} from "../lib/store";

import { parseVoiceInput } from "../lib/voiceUtils";
import { Entry, EntryType, CategoryState } from "../lib/types";
import { supabase } from "../lib/supabaseClient";
import MiniWeeklyBars from "./components/MiniWeeklyBars";


interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
    };
  };
}

export default function Home() {
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  const [entryType, setEntryType] = useState<EntryType>("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);


  const [categories, setCategories] = useState<CategoryState>({
    incomeCategories: [],
    expenseCategories: [],
  });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [incomeGraph, setIncomeGraph] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [expenseGraph, setExpenseGraph] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  // Currency
  const [currency, setCurrency] = useState("€");

 const refreshData = async () => {
  const data = await fetchEntries();
  setEntries(data);

  // Update weekly graphs
  setIncomeGraph(getLast7DaysTotals(data, "Income"));
  setExpenseGraph(getLast7DaysTotals(data, "Expense"));
};


  // On load
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      setUserName(user?.user_metadata?.name ?? "");   

      const cats = await fetchCategories();
      setCategories(cats);

      setCurrency(getCurrency());

      await refreshData();
      setLoading(false);
    };
    loadData();
  }, []);

  // Mic handler
  const handleMicClick = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionConstructor = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event: SpeechRecognitionEventLike) => {
      const spokenText = event.results[0][0].transcript.trim();
      const result = parseVoiceInput(spokenText);

      if (!result.success || !result.data) {
        alert(result.error);
        return;
      }
      
      const newEntry: Omit<Entry, "id"> = { 
        ...result.data, 
        created_at: new Date().toISOString() 
      };

      const saved = await addEntry(newEntry);
      if (saved) await refreshData();
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  // Manual add
  const handleAdd = async () => {
    if (!amount) {
      alert("Enter an amount.");
      return;
    }

    const newEntry: Omit<Entry, "id"> = {
      type: entryType,
      amount,
      category: category || "Uncategorized",
      text: `${entryType} ${currency}${amount} ${category || ""} ${notes || ""}`.trim(),
      created_at: new Date().toISOString(),
    };

    const saved = await addEntry(newEntry);
    if (saved) {
      await refreshData();
      setAmount("");
      setCategory("");
      setNotes("");
      setManualMode(false);
    }
  };

  // Totals
  const now = new Date();
  const { start: weekStart, end: weekEnd } = getWeekBounds(now);

  const sumFor = (type: EntryType) => {
    let today = 0, week = 0, month = 0;

    entries.forEach((e) => {
      if (e.type !== type) return;

      const d = new Date(e.created_at);
      const val = parseFloat(e.amount);
      if (isNaN(val)) return;

      const todayStart = new Date(now);
      todayStart.setHours(0,0,0,0);

      if (d >= todayStart && d < new Date(todayStart.getTime() + 86400000)) 
        today += val;

      if (d >= weekStart && d <= weekEnd) 
        week += val;

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      if (d >= monthStart && d < monthEnd) 
        month += val;
    });

    return { today, week, month };
  };

  const incomeTotals = sumFor("Income");
  const expenseTotals = sumFor("Expense");

  // Get totals for last 7 days (Mon–Sun) — timezone-safe
function getLast7DaysTotals(entries: Entry[], type: EntryType) {
  const totals = [0, 0, 0, 0, 0, 0, 0]; // Mon..Sun

  entries
    .filter((e) => e.type === type)
    .forEach((e) => {
      // Read date but force local day safely
      const d = new Date(e.created_at);
      
      // Convert UTC timestamp to local midnight (no shifting)
      const local = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
      );

      // 0 = Sunday → we want Sunday last
      const jsDay = local.getDay(); 
      const index = jsDay === 0 ? 6 : jsDay - 1;

      totals[index] += parseFloat(e.amount) || 0;
    });

  return totals;
}

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
    

  return (
         <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
  <Menu />

  {/* USER GREETING */}
  {userEmail && (
    <p className="text-sm text-gray-400 mb-3 px-1">
      Hey {userName || userEmail} 👋

    </p>
  )}

  <div className="w-full max-w-sm text-center mx-auto">

    <h1 className="text-3xl font-bold mb-2">
      Heiyu<span className="text-indigo-400">Budget</span>
    </h1>


        <p className="text-gray-400 text-sm mb-6">Fast voice or text budgeting.</p>

        {!userEmail && (
          <div className="mb-8 p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-2xl">
            <p className="text-sm text-indigo-200 mb-3">
              Sign in to save your tax records safely to the cloud.
            </p>
            <Link 
              href="/login"
              className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              Login / Sign Up
            </Link>
          </div>
        )}

        {/* MIC */}
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

        {/* ENTRY MODE */}
        {!manualMode ? (
          <>
            <button
              onClick={() => setManualMode(true)}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition"
            >
              ✏️ Add by Text
            </button>

            {/* CLEANED BUTTON HERE */}
            <Link 
              href="/categories"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition mt-3 block text-center"
            >
              ➕ Add / Manage Categories
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
              placeholder={`Amount (${currency})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />

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
                ? categories.incomeCategories
                : categories.expenseCategories
              ).map((c, i) => (
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

    {/* TOTALS */}
<div className="bg-gray-800/60 p-5 mt-6 rounded-2xl border border-gray-700 text-center">
  <div className="flex justify-between items-center mb-4 w-full">
    <h3 className="text-lg font-semibold text-indigo-300">Totals Summary</h3>
    <Link href="/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
      View All →
    </Link>
  </div>

  {/* HEADERS */}
  <div className="grid grid-cols-3 text-sm font-semibold text-gray-300 mb-3">
    <div></div>
    <div>Today</div>
    <div>Week</div>
  </div>

  {/* INCOME */}
  <div className="grid grid-cols-3 text-sm items-center mb-2">
    <div className="text-emerald-400 font-medium">Income</div>
    <div>{currency}{incomeTotals.today.toFixed(2)}</div>
    <div>{currency}{incomeTotals.week.toFixed(2)}</div>
  </div>

  {/* EXPENSE */}
  <div className="grid grid-cols-3 text-sm items-center">
    <div className="text-pink-400 font-medium">Expense</div>
    <div>{currency}{expenseTotals.today.toFixed(2)}</div>
    <div>{currency}{expenseTotals.week.toFixed(2)}</div>
  </div>
</div>
{/* WEEKLY GRAPHS SIDE-BY-SIDE */}
<div className="bg-gray-800/60 p-4 mt-4 rounded-2xl border border-gray-700">
  <div className="grid grid-cols-2 gap-4">

    {/* Income */}
    <div className="text-center shadow-md shadow-black/20 p-2 rounded-xl">
      <p className="text-xs text-emerald-300 mb-1">Income</p>
      <MiniWeeklyBars data={incomeGraph} color="emerald" />


      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        {["M","T","W","T","F","S","S"].map((d,i)=>(
          <span key={i} className="w-2 text-center">{d}</span>
        ))}
      </div>
    </div>

    {/* Expense */}
    <div className="text-center shadow-md shadow-black/20 p-2 rounded-xl border-l border-gray-700/60">
      <p className="text-xs text-pink-300 mb-1">Expense</p>
     <MiniWeeklyBars data={expenseGraph} color="pink" />
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        {["M","T","W","T","F","S","S"].map((d,i)=>(
          <span key={i} className="w-2 text-center">{d}</span>
        ))}
      </div>
    </div>

  </div>
</div>



   {/* RECENT ENTRIES */}
        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl border border-gray-700 text-left">
            <div className="flex justify-between items-center mb-3 w-full">
              <h3 className="text-lg font-semibold text-indigo-300">Recent Entries</h3>
              <Link href="/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                View All →
              </Link>
            </div>

            <ul className="max-h-40 overflow-y-auto">
              {entries.map((e, i) => (
                <li key={i} className="border-b border-gray-700 py-2">
                  <p className="text-sm text-gray-200">
                    <strong>{e.type}:</strong> {e.category} ({currency}
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

      </div>
<button 
  onClick={() => setHelpOpen(true)} 
  className="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white"
>
  ?
</button>

<HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />

    </main>
  );
}
