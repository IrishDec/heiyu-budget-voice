"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategories, updateCategories } from "../../lib/store";

export default function CategoriesPage() {
  const [income, setIncome] = useState<string[]>([]);
  const [expense, setExpense] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [newType, setNewType] = useState<"Income" | "Expense">("Expense"); // ⭐ NEW TOGGLE

  // Load from DB
  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const data = await fetchCategories();
      setIncome(data.incomeCategories);
      setExpense(data.expenseCategories);
      setLoading(false);
    };
    load();
  }, []);

  const updateStore = async (inc: string[], exp: string[]) => {
    setIncome(inc);
    setExpense(exp);
    await updateCategories({
      incomeCategories: inc,
      expenseCategories: exp,
    });
  };

  // ⭐ FIXED: Add with proper toggle
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const formatted = newCategory
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    let updatedIncome = [...income];
    let updatedExpense = [...expense];

    if (newType === "Income") {
      updatedIncome.push(formatted);
    } else {
      updatedExpense.push(formatted);
    }

    await updateStore(updatedIncome, updatedExpense);
    setNewCategory("");
  };

  const handleDelete = async (type: "income" | "expense", name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    if (type === "income") {
      await updateStore(income.filter((c) => c !== name), expense);
    } else {
      await updateStore(income, expense.filter((c) => c !== name));
    }
  };

  const handleRename = async (type: "income" | "expense", oldName: string) => {
    if (!newName.trim()) return;

    const formatted = newName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    if (type === "income") {
      await updateStore(
        income.map((c) => (c === oldName ? formatted : c)),
        expense
      );
    } else {
      await updateStore(
        income,
        expense.map((c) => (c === oldName ? formatted : c))
      );
    }

    setRenaming(null);
    setNewName("");
  };

  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;
  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        Loading categories...
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <div className="w-full max-w-sm mx-auto">
        <Link href="/" className="text-indigo-400 text-sm">
          ← Back to Budget
        </Link>

        <h1 className="text-2xl font-bold mt-3 mb-6">Manage Categories</h1>

        {/* ⭐ NEW CATEGORY INPUT WITH TYPE TOGGLE */}
        <h2 className="text-lg font-semibold text-indigo-400 mb-2">
          Add New Category
        </h2>

        <div className="flex gap-2 mb-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1 bg-gray-700 text-white p-2 rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-indigo-500 px-4 py-2 rounded text-white text-sm"
          >
            Add
          </button>
        </div>

        {/* ⭐ PRETTY TOGGLE MATCHING YOUR UI */}
        <div className="flex gap-4 mb-8 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={newType === "Income"}
              onChange={() => setNewType("Income")}
            />
            <span className="text-emerald-400">Income</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={newType === "Expense"}
              onChange={() => setNewType("Expense")}
            />
            <span className="text-pink-400">Expense</span>
          </label>
        </div>

        {/* Income */}
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">Income</h2>
        <ul className="mb-8 space-y-2">
          {income.map((c) => (
            <li
              key={c}
              className="flex justify-between items-center bg-gray-800 p-2 rounded-lg"
            >
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
            <li
              key={c}
              className="flex justify-between items-center bg-gray-800 p-2 rounded-lg"
            >
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
