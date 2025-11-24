"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "../components/Menu";
import { loadCategories, saveCategories } from "../../lib/store";
import { CategoryState, EntryType } from "../../lib/types";

export default function ManageCategories() {
  const [categories, setCategories] = useState<CategoryState>({ incomeCategories: [], expenseCategories: [] });
  const [mounted, setMounted] = useState(false);
  
  // New Category State
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<EntryType>("Income");

  useEffect(() => {
    setMounted(true);
    setCategories(loadCategories());
  }, []);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    
    // Capitalize properly
    const formatted = newCatName.trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    
    const updated = { ...categories };
    if (newCatType === "Income") {
        if (!updated.incomeCategories.includes(formatted)) {
            updated.incomeCategories.push(formatted);
        }
    } else {
        if (!updated.expenseCategories.includes(formatted)) {
            updated.expenseCategories.push(formatted);
        }
    }
    
    saveCategories(updated);
    setCategories(updated);
    setNewCatName("");
  };

  const handleDelete = (type: EntryType, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const updated = { ...categories };
    if (type === "Income") {
        updated.incomeCategories = updated.incomeCategories.filter(c => c !== name);
    } else {
        updated.expenseCategories = updated.expenseCategories.filter(c => c !== name);
    }
    saveCategories(updated);
    setCategories(updated);
  };

  if (!mounted) return <div className="min-h-screen bg-[#0f172a]" />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-6">
      <Menu />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
         <Link href="/history" className="text-gray-400 hover:text-white transition text-lg font-bold">
            ← Back
         </Link>
         <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>

      {/* 👇 NEW: Add Category Section */}
      <div className="bg-gray-800/60 p-5 rounded-2xl border border-gray-700 mb-8 shadow-lg">
        <h2 className="text-sm font-semibold text-indigo-300 mb-3">Add New Category</h2>
        <div className="flex gap-2 mb-3">
             <button 
                onClick={() => setNewCatType("Income")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${newCatType === "Income" ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-400"}`}
             >
                Income
             </button>
             <button 
                onClick={() => setNewCatType("Expense")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${newCatType === "Expense" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-400"}`}
             >
                Expense
             </button>
        </div>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={`New ${newCatType} Name...`}
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
                onClick={handleAddCategory}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold text-sm"
            >
                Add
            </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-6">
        {/* Income List */}
        <div>
            <h3 className="text-emerald-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wide">Income Categories</h3>
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
                {categories.incomeCategories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/20">
                        <span className="text-gray-200 text-sm">{cat}</span>
                        <button onClick={() => handleDelete("Income", cat)} className="text-gray-500 hover:text-red-400 text-xs font-bold">DELETE</button>
                    </div>
                ))}
            </div>
        </div>

        {/* Expense List */}
        <div>
            <h3 className="text-pink-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wide">Expense Categories</h3>
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
                {categories.expenseCategories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-gray-700/50 last:border-0 hover:bg-gray-700/20">
                        <span className="text-gray-200 text-sm">{cat}</span>
                        <button onClick={() => handleDelete("Expense", cat)} className="text-gray-500 hover:text-red-400 text-xs font-bold">DELETE</button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </main>
  );
}