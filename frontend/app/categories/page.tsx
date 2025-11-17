"use client";

import { useState } from "react";
import Link from "next/link";
import { loadCategories, saveCategories } from "../lib/categoryStore.js";

export default function CategoriesPage() {
  const { incomeCategories, expenseCategories } = loadCategories();

  const [income, setIncome] = useState<string[]>(incomeCategories);
  const [expense, setExpense] = useState<string[]>(expenseCategories);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleDelete = (type: "income" | "expense", name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    const updated =
      type === "income"
        ? {
            incomeCategories: income.filter((c) => c !== name),
            expenseCategories: expense,
          }
        : {
            incomeCategories: income,
            expenseCategories: expense.filter((c) => c !== name),
          };

    saveCategories(updated);
    setIncome(updated.incomeCategories);
    setExpense(updated.expenseCategories);
  };

  const handleRename = (type: "income" | "expense", oldName: string) => {
    if (!newName.trim()) return;

    const formatted = newName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const updated =
      type === "income"
        ? {
            incomeCategories: income.map((c) =>
              c === oldName ? formatted : c
            ),
            expenseCategories: expense,
          }
        : {
            incomeCategories: income,
            expenseCategories: expense.map((c) =>
              c === oldName ? formatted : c
            ),
          };

    saveCategories(updated);
    setIncome(updated.incomeCategories);
    setExpense(updated.expenseCategories);
    setRenaming(null);
    setNewName("");
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <div className="w-full max-w-sm mx-auto">
        <Link href="/" className="text-indigo-400 text-sm">
          ← Back to Budget
        </Link>

        <h1 className="text-2xl font-bold mt-3 mb-6">Manage Categories</h1>

        {/* Income */}
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">Income</h2>
        <ul className="mb-8 space-y-2">
          {income.map((c) => (
            <li key={c} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
              {renaming === c ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700 text-white p-1 rounded w-32"
                />
              ) : (
                <span>{c}</span>
              )}

              <div className="flex gap-2">
                {renaming === c ? (
                  <button
                    onClick={() => handleRename("income", c)}
                    className="text-green-400 text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setRenaming(c);
                      setNewName(c);
                    }}
                    className="text-yellow-300 text-sm"
                  >
                    Rename
                  </button>
                )}

                <button
                  onClick={() => handleDelete("income", c)}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Expense */}
        <h2 className="text-lg font-semibold text-pink-400 mb-2">Expense</h2>
        <ul className="space-y-2">
          {expense.map((c) => (
            <li key={c} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
              {renaming === c ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-700 text-white p-1 rounded w-32"
                />
              ) : (
                <span>{c}</span>
              )}

              <div className="flex gap-2">
                {renaming === c ? (
                  <button
                    onClick={() => handleRename("expense", c)}
                    className="text-green-400 text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setRenaming(c);
                      setNewName(c);
                    }}
                    className="text-yellow-300 text-sm"
                  >
                    Rename
                  </button>
                )}
                <button
                  onClick={() => handleDelete("expense", c)}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
