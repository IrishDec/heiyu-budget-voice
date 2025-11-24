"use client";

import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Link from "next/link";
// 👇 Import getCurrency
import { fetchCategories, fetchEntries, addEntry, getWeekBounds, getCurrency } from "../lib/store";
import { parseVoiceInput } from "../lib/voiceUtils";
import { Entry, EntryType, CategoryState } from "../lib/types";
import { supabase } from "../lib/supabaseClient";

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
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [categories, setCategories] = useState<CategoryState>({ incomeCategories: [], expenseCategories: [] });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // 👇 Currency State
  const [currency, setCurrency] = useState("€");

  const refreshData = async () => {
    const data = await fetchEntries();
    setEntries(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);

      const cats = await fetchCategories();
      setCategories(cats);
      
      // 👇 Load Currency
      setCurrency(getCurrency());

      await refreshData();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleMicClick = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) { alert("Speech recognition not supported."); return; }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = async (event: SpeechRecognitionEventLike) => {
      const spokenText = event.results[0][0].transcript.trim();
      const result = parseVoiceInput(spokenText);
      if (!result.success || !result.data) { alert(result.error); return; }
      
      const newEntry: Omit<Entry, "id"> = { ...result.data, created_at: new Date().toISOString() };
      const saved = await addEntry(newEntry);
      if (saved) await refreshData();
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleAdd = async () => {
    if (!amount) { alert("Enter an amount."); return; }
    const newEntry: Omit<Entry, "id"> = {
      type: entryType, amount, category: category || "Uncategorized",
      text: `${entryType} ${currency}${amount} ${category || ""} ${notes || ""}`.trim(),
      created_at: new Date().toISOString(),
    };
    const saved = await addEntry(newEntry);
    if (saved) {
      await refreshData();
      setAmount(""); setCategory(""); setNotes(""); setManualMode(false);
    }
  };

  const now = new Date();
  const { start: weekStart, end: weekEnd } = getWeekBounds(now);
  const sumFor = (type: EntryType) => {
    let today = 0, week = 0, month = 0;
    entries.forEach((e) => {
      if (e.type !== type) return;
      const d = new Date(e.created_at);
      const val = parseFloat(e.amount);
      if (isNaN(val)) return;
      const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
      if (d >= todayStart && d < new Date(todayStart.getTime() + 86400000)) today += val;
      if (d >= weekStart && d <= weekEnd) week += val;
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      if (d >= monthStart && d < monthEnd) month += val;
    });
    return { today, week, month };
  };

  const incomeTotals = sumFor("Income");
  const expenseTotals = sumFor("Expense");

  const handleSaveCategory = () => { setShowCategoryModal(false); alert("Custom categories updating coming soon!"); };

  if (loading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
      <Menu />
      <div className="w-full max-w-sm text-center mx-auto">
        <h1 className="text-3xl font-bold mb-2">Heiyu<span className="text-indigo-400">Taxi</span></h1>
        <p className="text-gray-400 text-sm mb-6">Fast voice or text budgeting.</p>

        {!userEmail ? (
          <div className="mb-8 p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-2xl">
            <p className="text-sm text-indigo-200 mb-3">Sign in to save your tax records safely to the cloud.</p>
            <Link 
              href="/login"
              className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              Login / Sign Up
            </Link>
          </div>
        ) : null}

        <button onClick={handleMicClick} className={`w-full py-4 mb-4 text-lg font-semibold rounded-full text-white shadow-lg transition ${listening ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse" : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:brightness-110"}`}>
          {listening ? "🎙️ Listening..." : "🎤 Tap to Speak"}
        </button>

        {!manualMode ? (
          <>
            <button onClick={() => setManualMode(true)} className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition">✏️ Add by Text</button>
            <button onClick={() => setShowCategoryModal(true)} className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white py-3 rounded-full font-medium shadow-md hover:brightness-110 transition mt-3">➕ Add New Category</button>
            <Link href="/categories" className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 py-3 rounded-full font-medium shadow-md hover:brightness-110 transition mt-3 block text-center">📁 Manage Categories</Link>
          </>
        ) : (
          <div className="bg-gray-800/60 p-5 mt-5 rounded-2xl shadow-xl border border-gray-700 text-left">
            <select value={entryType} onChange={(e) => setEntryType(e.target.value as EntryType)} className="w-full p-2 mb-3 rounded bg-gray-700 text-white">
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <input type="number" placeholder={`Amount (${currency})`} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-700 text-white" />
            <input list="categoryList" type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-700 text-white" />
            <datalist id="categoryList">{(entryType === "Income" ? categories.incomeCategories : categories.expenseCategories).map((c, i) => <option key={i} value={c} />)}</datalist>
            <input type="text" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <button onClick={handleAdd} className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-3 rounded-full text-white font-semibold">💾 Save Entry</button>
            <button onClick={() => setManualMode(false)} className="w-full mt-3 border border-gray-500 text-gray-300 py-2 rounded-full text-sm">Cancel</button>
          </div>
        )}

        <div className="bg-gray-800/60 p-5 mt-6 rounded-2xl border border-gray-700 text-center">
          <div className="flex justify-between items-center mb-4 w-full">
            <h3 className="text-lg font-semibold text-indigo-300">Totals Summary</h3>
            <Link href="/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition">View All →</Link>
          </div>
          <div className="grid grid-cols-4 text-sm font-semibold text-gray-300 mb-3"><div></div><div>Today</div><div>Week</div><div>Month</div></div>
          <div className="grid grid-cols-4 text-sm items-center mb-2"><div className="text-emerald-400 font-medium">Income</div><div>{currency}{incomeTotals.today.toFixed(2)}</div><div>{currency}{incomeTotals.week.toFixed(2)}</div><div>{currency}{incomeTotals.month.toFixed(2)}</div></div>
          <div className="grid grid-cols-4 text-sm items-center"><div className="text-pink-400 font-medium">Expense</div><div>{currency}{expenseTotals.today.toFixed(2)}</div><div>{currency}{expenseTotals.week.toFixed(2)}</div><div>{currency}{expenseTotals.month.toFixed(2)}</div></div>
        </div>

        {entries.length > 0 && (
          <div className="bg-gray-800/60 p-5 mt-8 rounded-2xl border border-gray-700 text-left">
            <div className="flex justify-between items-center mb-3 w-full">
              <h3 className="text-lg font-semibold text-indigo-300">Recent Entries</h3>
              <Link href="/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition">View All →</Link>
            </div>
            <ul className="max-h-40 overflow-y-auto">
              {entries.map((e, i) => (
                <li key={i} className="border-b border-gray-700 py-2">
                  <p className="text-sm text-gray-200"><strong>{e.type}:</strong> {e.category} ({currency}{parseFloat(e.amount).toFixed(2)})</p>
                  <p className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-full max-w-xs">
              <h2 className="text-lg font-semibold mb-4 text-indigo-300">Add New Category</h2>
              <input type="text" placeholder="Category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-2 mb-3 rounded bg-gray-700 text-white" />
              <div className="flex gap-4 mb-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="catType" value="Income" checked={entryType === "Income"} onChange={() => setEntryType("Income")} /> Income</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="catType" value="Expense" checked={entryType === "Expense"} onChange={() => setEntryType("Expense")} /> Expense</label>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveCategory} className="flex-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-2 rounded-full text-white font-semibold">Save</button>
                <button onClick={() => { setNewCategoryName(""); setShowCategoryModal(false); }} className="flex-1 border border-gray-500 text-gray-300 py-2 rounded-full">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}