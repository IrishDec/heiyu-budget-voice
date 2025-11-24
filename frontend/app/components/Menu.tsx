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
            HeiyuTaxi
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-red-400 transition"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 py-4 space-y-1 overflow-y-auto h-[calc(100vh-60px)]">
          {/* Main App Links */}
          <div className="space-y-3 mb-6">
            <Link
              href="/"
              className="block text-gray-200 hover:text-indigo-300 transition font-medium"
              onClick={() => setOpen(false)}
            >
              📊 Dashboard
            </Link>

            <Link
              href="/history"
              className="block text-gray-200 hover:text-indigo-300 transition font-medium"
              onClick={() => setOpen(false)}
            >
              📜 History
            </Link>

            <Link
              href="/categories"
              className="block text-gray-200 hover:text-indigo-300 transition font-medium"
              onClick={() => setOpen(false)}
            >
              🏷️ Categories
            </Link>
          </div>

          {/* Company Links */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <Link
              href="/about"
              className="block text-gray-400 hover:text-indigo-300 transition text-sm"
              onClick={() => setOpen(false)}
            >
              👋 About Us
            </Link>

            <Link
              href="/contact"
              className="block text-gray-400 hover:text-indigo-300 transition text-sm"
              onClick={() => setOpen(false)}
            >
              📩 Contact Support
            </Link>
          </div>

          {/* Auth Link */}
          <div className="pt-4 mt-2">
             <Link
              href="/login"
              className="block w-full text-center py-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              🔑 Log In / Sign Up
            </Link>
          </div>

          {/* Legal Footer */}
          <div className="mt-8 pt-4 border-t border-gray-800 text-[10px] text-gray-600 flex flex-col gap-2">
            <Link href="/legal/privacy" onClick={() => setOpen(false)} className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/legal/terms" onClick={() => setOpen(false)} className="hover:text-gray-400">Terms of Service</Link>
            <Link href="/legal/cookies" onClick={() => setOpen(false)} className="hover:text-gray-400">Cookie Policy</Link>
            <p className="mt-2 opacity-50">© {new Date().getFullYear()} Heiyu Taxi</p>
          </div>
        </nav>
      </div>
    </>
  );
}