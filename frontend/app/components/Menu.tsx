"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-900/80 border border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-indigo-400 transition"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-200" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#020817] border-l border-gray-800 z-20 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-indigo-300">
            HeiyuBudget
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-red-400 transition"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 py-4 space-y-3 text-sm">
          <Link
            href="/"
            className="block text-gray-300 hover:text-indigo-300 transition"
            onClick={() => setOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            href="/data-tables"
            className="block text-gray-300 hover:text-indigo-300 transition"
            onClick={() => setOpen(false)}
          >
            💰 Data Tables
          </Link>

          <button
            className="block w-full text-left text-gray-400 hover:text-indigo-200 transition mt-4 text-xs"
            onClick={() => setOpen(false)}
          >
            ⚙️ Settings / Privacy / Cookies (later)
          </button>
        </nav>
      </div>
    </>
  );
}

