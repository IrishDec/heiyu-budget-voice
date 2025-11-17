"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "../components/Menu";

type EntryType = "Income" | "Expense";

type Entry = {
  type: EntryType;
  amount: string;
  category: string;
  text?: string;
  created_at: string;
};

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<EntryType>("Expense");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState(""); // yyyy-mm-dd
  const [editTime, setEditTime] = useState(""); // HH:MM

  // 🔁 Load entries from the same localStorage key as Home
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("heiyu_budget_entries");
      if (!saved) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const parsed: Entry[] = JSON.parse(saved);

      // Sort newest → oldest
      const sorted = [...parsed].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setEntries(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Error loading entries in history:", err);
      setEntries([]);
      setLoading(false);
    }
  }, []);

  // 🧠 Helpers
  const formatDateHeader = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisDay = new Date(d);
    thisDay.setHours(0, 0, 0, 0);

    if (thisDay.getTime() === today.getTime()) return "Today";
    if (thisDay.getTime() === yesterday.getTime()) return "Yesterday";

    return d.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime24 = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Group entries by calendar date
  const groupedByDate = entries.reduce(
    (acc: Record<string, Entry[]>, entry) => {
      const d = new Date(entry.created_at);
      const key = d.toISOString().slice(0, 10); // yyyy-mm-dd
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {}
  );

  const dateKeys = Object.keys(groupedByDate).sort((a, b) =>
    a < b ? 1 : -1
  ); // newest date first

  // ✏️ Open Edit Modal
  const openEdit = (globalIndex: number) => {
    const entry = entries[globalIndex];
    if (!entry) return;

    const d = new Date(entry.created_at);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    setEditingIndex(globalIndex);
    setEditType(entry.type);
    setEditAmount(entry.amount);
    setEditCategory(entry.category);
    setEditDate(`${yyyy}-${mm}-${dd}`);
    setEditTime(`${hh}:${min}`);
  };

  // 💾 Save changes to an entry
  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    if (!editAmount.trim()) {
      alert("Amount is required.");
      return;
    }

    const updatedEntries = [...entries];
    const original = updatedEntries[editingIndex];

    const newCreatedAt = new Date(
      `${editDate || new Date().toISOString().slice(0, 10)}T${editTime || "00:00"}`
    ).toISOString();

    updatedEntries[editingIndex] = {
      ...original,
      type: editType,
      amount: editAmount,
      category: editCategory || "Uncategorized",
      created_at: newCreatedAt,
    };

    // Re-sort after edit
    const resorted = [...updatedEntries].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setEntries(resorted);
    if (typeof window !== "undefined") {
      localStorage.setItem("heiyu_budget_entries", JSON.stringify(resorted));
    }
    setEditingIndex(null);
  };

  // 🗑 Delete an entry
  const handleDelete = () => {
    if (editingIndex === null) return;

    if (!confirm("Delete this entry?")) return;

    const updated = entries.filter((_, i) => i !== editingIndex);
    setEntries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("heiyu_budget_entries", JSON.stringify(updated));
    }
    setEditingIndex(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-10">
      <Menu />
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-xs text-gray-400">
              All entries, newest first. Tap to edit.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            ← Back to Budget
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            No entries yet. Add something on the main page.
          </p>
        ) : (
          <div className="space-y-5">
            {dateKeys.map((dateKey) => {
              const group = groupedByDate[dateKey];

              // We need to know each entry's global index for editing
              return (
                <div
                  key={dateKey}
                  className="bg-gray-800/60 rounded-2xl border border-gray-700 p-4"
                >
                  <h2 className="text-sm font-semibold text-indigo-300 mb-3">
                    {formatDateHeader(group[0].created_at)}
                  </h2>

                  <div className="divide-y divide-gray-700">
                    {group.map((entry) => {
                      const globalIndex = entries.indexOf(entry);
                      return (
                        <button
                          key={`${entry.created_at}-${globalIndex}`}
                          onClick={() => openEdit(globalIndex)}
                          className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-700/40 rounded-lg px-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatTime24(entry.created_at)}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  entry.type === "Income"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-pink-500/20 text-pink-300"
                                }`}
                              >
                                {entry.type}
                              </span>
                            </div>
                            <div className="text-sm text-gray-200">
                              {entry.category || "Uncategorized"}
                            </div>
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              entry.type === "Income"
                                ? "text-emerald-300"
                                : "text-pink-300"
                            }`}
                          >
                            €{parseFloat(entry.amount || "0").toFixed(2)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✏️ Edit Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Edit Entry
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1 text-gray-300">Type</label>
                <select
                  value={editType}
                  onChange={(e) =>
                    setEditType(e.target.value as EntryType)
                  }
                  className="w-full p-2 rounded bg-gray-800 text-white"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-300">Amount</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-300">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Category"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1 text-gray-300">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div className="w-28">
                  <label className="block mb-1 text-gray-300">Time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 py-2 rounded-full text-white font-semibold"
              >
                Save
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full border border-red-400 text-red-300 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingIndex(null)}
                className="flex-1 border border-gray-500 text-gray-300 py-2 rounded-full text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
