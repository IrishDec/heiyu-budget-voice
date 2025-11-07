"use client";

import React from "react";
import Link from "next/link";
import Menu from "./Menu";

export default function DataTables({
  entries,
  onDelete,
}: {
  entries: any[];
  onDelete?: (index: number) => void;
}) {
  const incomes = entries.filter((e) => e.type === "Income");
  const expenses = entries.filter((e) => e.type === "Expense");

  return (
    <>
      <Menu />
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-lg font-semibold text-indigo-300">Data Tables</h1>
      </div>

      <div className="bg-gray-800/60 p-5 mt-4 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-md text-left">
        <h3 className="text-lg font-semibold text-indigo-300 mb-3">All Entries</h3>

        {/* Income Table */}
        <div className="mb-6">
          <h4 className="text-emerald-400 font-semibold mb-2">Income</h4>
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg">
            <table className="w-full text-sm text-gray-200">
              <thead className="bg-gray-700 text-gray-300 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {incomes.length > 0 ? (
                  incomes.map((e, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="p-2 text-emerald-400">
                        €{parseFloat(e.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">{e.category || "-"}</td>
                      <td className="p-2 text-gray-500 text-xs">{e.created_at}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => onDelete && onDelete(i)}
                          className="text-red-400 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No income entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Table */}
        <div>
          <h4 className="text-pink-400 font-semibold mb-2">Expenses</h4>
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg">
            <table className="w-full text-sm text-gray-200">
              <thead className="bg-gray-700 text-gray-300 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((e, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="p-2 text-pink-400">
                        €{parseFloat(e.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">{e.category || "-"}</td>
                      <td className="p-2 text-gray-500 text-xs">{e.created_at}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => onDelete && onDelete(i)}
                          className="text-red-400 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-500">
                      No expense entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
