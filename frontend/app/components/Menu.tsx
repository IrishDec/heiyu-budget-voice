"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// 👇 Import currency functions
import { getCurrency, saveCurrency } from "../../lib/store";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("€");

  useEffect(() => {
    setCurrentCurrency(getCurrency());
  }, []);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveCurrency(e.target.value);
  };

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

        {/* 👇 Currency Picker */}
        <div className="px-4 py-4 border-b border-gray-800">
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Currency</label>
        <select 
            value={currentCurrency} 
            onChange={handleCurrencyChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-2 text-sm focus:border-indigo-500 outline-none"
          >
            {/* REPLACE THE OPTIONS WITH THIS LIST: */}
            <option value="€">Euro (€) - Europe</option>
            <option value="$">Dollar ($) - USA/Global</option>
            <option value="£">Pound (£) - UK</option>
            <option value="¥">Yen/Yuan (¥) - Japan/China</option>
            <option value="₹">Rupee (₹) - India</option>
            <option value="A$">Dollar (A$) - Australia</option>
            <option value="C$">Dollar (C$) - Canada</option>
            <option value="₣">Franc (₣) - Switzerland/West Africa</option>
            <option value="kr">Kroner (kr) - Scandinavia</option>
            <option value="R">Rand (R) - South Africa</option>
            <option value="R$">Real (R$) - Brazil</option>
            <option value="₱">Peso (₱) - Philippines/Latin Am.</option>
            <option value="Rp">Rupiah (Rp) - Indonesia</option>
            <option value="฿">Baht (฿) - Thailand</option>
            <option value="₫">Dong (₫) - Vietnam</option>
            <option value="RM">Ringgit (RM) - Malaysia</option>
            <option value="₦">Naira (₦) - Nigeria</option>
            <option value="₵">Cedi (₵) - Ghana</option>
            <option value="KSh">Shilling (KSh) - Kenya</option>
            <option value="dh">Dirham (dh) - UAE/Morocco</option>
            <option value="SR">Riyal (SR) - Saudi Arabia</option>
            <option value="₺">Lira (₺) - Turkey</option>
            <option value="₩">Won (₩) - South Korea</option>
            <option value="zł">Złoty (zł) - Poland</option>
            <option value="S$">Dollar (S$) - Singapore</option>
            <option value="NZ$">Dollar (NZ$) - New Zealand</option>
            <option value="HK$">Dollar (HK$) - Hong Kong</option>
          </select>
        </div>

        <nav className="px-4 py-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
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
          <div className="mt-8 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex flex-col gap-3">
            <Link href="/legal/privacy" onClick={() => setOpen(false)} className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/legal/terms" onClick={() => setOpen(false)} className="hover:text-white transition">Terms of Service</Link>
            <Link href="/legal/cookies" onClick={() => setOpen(false)} className="hover:text-white transition">Cookie Policy</Link>
            <p className="mt-2 opacity-50 text-[10px]">© {new Date().getFullYear()} Heiyu Taxi</p>
          </div>
        </nav>
      </div>
    </>
  );
}