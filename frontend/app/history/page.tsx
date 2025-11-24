"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Menu from "../components/Menu";
// 👇 FIX: Import Supabase functions instead of local storage
import { 
  fetchEntries, 
  fetchCategories, 
  updateEntry, 
  deleteEntry, 
  getWeekBounds 
} from "../../lib/store";
import { Entry, EntryType, CategoryState } from "../../lib/types";

type TimeFilter = "Day" | "Week" | "Month" | "Year";

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<CategoryState>({ incomeCategories: [], expenseCategories: [] });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Week");
  const [filterType, setFilterType] = useState<"All" | "Income" | "Expense">("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Edit Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<EntryType>("Expense");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  // 🔄 Load from Database
  useEffect(() => {
    setMounted(true);
    const initData = async () => {
        const [dbEntries, dbCats] = await Promise.all([
            fetchEntries(),
            fetchCategories()
        ]);
        setEntries(dbEntries);
        setCategories(dbCats);
        setLoading(false);
    };
    initData();
  }, []);

  // --- Filtering Logic (Preserved) ---
  const filteredEntries = useMemo(() => {
    if (!mounted) return [];

    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (timeFilter === "Day") {
      start = new Date(now.setHours(0,0,0,0));
      end = new Date(now.setHours(23,59,59,999));
    } else if (timeFilter === "Week") {
      const bounds = getWeekBounds(new Date());
      start = bounds.start;
      end = bounds.end;
    } else if (timeFilter === "Month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (timeFilter === "Year") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    const byDate = entries.filter(e => {
      const d = new Date(e.created_at);
      return d >= start && d <= end;
    });

    if (filterType === "All" || selectedCategory === "All") {
      return byDate;
    }

    return byDate.filter(e => 
      e.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    );

  }, [entries, timeFilter, filterType, selectedCategory, mounted]);

  const totalIncome = filteredEntries
    .filter(e => e.type === "Income")
    .reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);

  const totalExpense = filteredEntries
    .filter(e => e.type === "Expense")
    .reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);

  const netBalance = totalIncome - totalExpense;

  const groupedByDate = filteredEntries.reduce(
    (acc: Record<string, Entry[]>, entry) => {
      const d = new Date(entry.created_at);
      const key = d.toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {}
  );

  const dateKeys = Object.keys(groupedByDate).sort((a, b) => (a < b ? 1 : -1));

  const handleExport = () => {
    if (filteredEntries.length === 0) {
      alert("No entries match your current filters.");
      return;
    }
    let csvContent = "Date,Time,Type,Category,Amount,Notes\n";
    filteredEntries.forEach((e) => {
      const dateObj = new Date(e.created_at);
      const safeNotes = e.text ? e.text.replace(/,/g, " ") : "";
      csvContent += `${dateObj.toLocaleDateString()},${dateObj.toLocaleTimeString()},${e.type},${e.category},${e.amount},${safeNotes}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Heiyu_Export_${timeFilter}.csv`;
    link.click();
  };

  const handleIncomeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "All") {
        setFilterType("All");
        setSelectedCategory("All");
    } else {
        setFilterType("Income");
        setSelectedCategory(val);
    }
  };

  const handleExpenseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "All") {
        setFilterType("All");
        setSelectedCategory("All");
    } else {
        setFilterType("Expense");
        setSelectedCategory(val);
    }
  };

  const formatDateHeader = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  };

  const formatTime24 = (iso: string) => {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  // Edit/Delete Handlers
  const openEdit = (entry: Entry) => {
    const globalIndex = entries.indexOf(entry); 
    if (globalIndex === -1) return;
    const d = new Date(entry.created_at);
    setEditingIndex(globalIndex);
    setEditType(entry.type);
    setEditAmount(entry.amount);
    setEditCategory(entry.category);
    setEditDate(d.toISOString().slice(0, 10));
    setEditTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null) return;
    
    const originalEntry = entries[editingIndex];
    const newCreatedAt = new Date(`${editDate}T${editTime}`).toISOString();

    const updatedEntry: Entry = {
      ...originalEntry,
      type: editType,
      amount: editAmount,
      category: editCategory || "Uncategorized",
      created_at: newCreatedAt,
    };

    // Optimistic Update (Update UI immediately)
    const newEntries = [...entries];
    newEntries[editingIndex] = updatedEntry;
    
    // Sort again to keep list correct
    const resorted = newEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setEntries(resorted);
    setEditingIndex(null);

    // ☁️ Save to Database
    if (updatedEntry.id) {
        await updateEntry(updatedEntry);
    }
  };

  const handleDelete = async () => {
    if (editingIndex === null) return;
    if (!confirm("Delete this entry?")) return;

    const entryToDelete = entries[editingIndex];

    // Optimistic Update
    const updated = entries.filter((_, i) => i !== editingIndex);
    setEntries(updated);
    setEditingIndex(null);

    // ☁️ Delete from Database
    if (entryToDelete.id) {
        await deleteEntry(entryToDelete.id);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-6 pb-24">
      <Menu />
      
      {/* 1. HEADER (Cleaned up) */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition text-lg font-bold">
            ← Back
        </Link>
        <h1 className="text-2xl font-bold">History</h1>
        <div className="w-10"></div> {/* Spacer to center title */}
      </div>

      {/* 2. TIME TOGGLES */}
      <div className="flex bg-gray-800/50 p-1 rounded-xl mb-6">
        {(["Day", "Week", "Month", "Year"] as TimeFilter[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeFilter(tf)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              timeFilter === tf
                ? "bg-indigo-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* 3. MANAGEMENT BUTTONS */}
      <div className="flex justify-between items-center mb-2 px-1">
        <Link href="/categories" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
            ⚙️ Manage Categories
        </Link>
        <Link href="/categories" className="text-xs text-emerald-400 font-semibold hover:text-emerald-300">
            + New Category
        </Link>
      </div>

      {/* 4. DROPDOWN FILTERS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="relative">
            <select
                value={filterType === "Income" ? selectedCategory : "All"}
                onChange={handleIncomeSelect}
                className={`w-full appearance-none bg-gray-800 text-sm p-3 rounded-xl border focus:outline-none transition ${
                    filterType === "Income" 
                    ? "border-emerald-500 text-emerald-400 font-bold" 
                    : "border-gray-700 text-gray-400"
                }`}
            >
                <option value="All">All Income</option>
                {categories.incomeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
        <div className="relative">
            <select
                value={filterType === "Expense" ? selectedCategory : "All"}
                onChange={handleExpenseSelect}
                className={`w-full appearance-none bg-gray-800 text-sm p-3 rounded-xl border focus:outline-none transition ${
                    filterType === "Expense" 
                    ? "border-pink-500 text-pink-400 font-bold" 
                    : "border-gray-700 text-gray-400"
                }`}
            >
                <option value="All">All Expenses</option>
                {categories.expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
      </div>

      {/* 5. SUMMARY CARD + EXPORT BUTTON */}
      <div className="bg-gray-800/80 rounded-2xl p-5 mb-6 border border-gray-700 shadow-xl">
        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
            {timeFilter} Summary • {selectedCategory === "All" ? "All Categories" : selectedCategory}
        </p>
        <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${netBalance >= 0 ? "text-white" : "text-pink-400"}`}>
                €{netBalance.toFixed(2)}
            </span>
            <span className="text-gray-500 text-sm">Net Profit</span>
        </div>
        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-700/50 mb-3">
            <div>
                <p className="text-[10px] text-emerald-400 font-bold">INCOME</p>
                <p className="text-lg text-gray-200">€{totalIncome.toFixed(2)}</p>
            </div>
            <div>
                <p className="text-[10px] text-pink-400 font-bold">EXPENSE</p>
                <p className="text-lg text-gray-200">€{totalExpense.toFixed(2)}</p>
            </div>
        </div>
        
        {/* 👇 NEW EXPORT BUTTON LOCATION */}
        <button 
            onClick={handleExport}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
        >
            📥 Export This View to CSV
        </button>
      </div>

      {/* 6. LIST */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-10 opacity-50">
            <p className="text-4xl mb-2">🤷‍♂️</p>
            <p className="text-gray-400 text-sm">No entries found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dateKeys.map((dateKey) => (
            <div key={dateKey} className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gray-800/80 px-4 py-2 text-xs font-semibold text-indigo-300 border-b border-gray-700/50">
                {formatDateHeader(groupedByDate[dateKey][0].created_at)}
              </div>
              <div className="divide-y divide-gray-700/50">
                {groupedByDate[dateKey].map((entry, i) => (
                  <button
                    key={i}
                    onClick={() => openEdit(entry)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/30 transition text-left"
                  >
                    <div>
                        <p className="text-sm text-gray-200 font-medium">{entry.category}</p>
                        <p className="text-xs text-gray-500">{formatTime24(entry.created_at)} • {entry.type}</p>
                    </div>
                    <div className={`text-sm font-bold ${entry.type === "Income" ? "text-emerald-400" : "text-pink-400"}`}>
                        {entry.type === "Income" ? "+" : "-"}€{parseFloat(entry.amount).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal (Same as before) */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">Edit Entry</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 text-gray-400">Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as EntryType)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-400">Amount (€)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-400">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block mb-1 text-gray-400">Date</label>
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                </div>
                <div className="w-28">
                    <label className="block mb-1 text-gray-400">Time</label>
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-white font-semibold transition">Save</button>
              <button onClick={handleDelete} className="px-4 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition">Delete</button>
              <button onClick={() => setEditingIndex(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-gray-300 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}