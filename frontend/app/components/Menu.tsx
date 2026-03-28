"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrency, saveCurrency } from "../../lib/store";
import { supabase } from "../../lib/supabaseClient";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("€");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  // Load currency
  setCurrentCurrency(getCurrency());

  // Load current user once
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
  });

  // 🔥 Listen for login/logout changes
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);



  const handleCurrencyChange = (e: any) => {
    saveCurrency(e.target.value);
    setCurrentCurrency(e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-900/80 border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
      >
        <div className="w-5 h-0.5 bg-gray-200 mb-1" />
        <div className="w-5 h-0.5 bg-gray-200 mb-1" />
        <div className="w-5 h-0.5 bg-gray-200" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#020817] border-l border-gray-800 z-20 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-indigo-300">HeiyuBudget</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>

        {/* USER NAME */}
        <div className="px-4 py-3 text-sm text-indigo-300 border-b border-gray-800">
          {user?.user_metadata?.name ? (
            <span>👤 {user.user_metadata.name}</span>
          ) : (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="text-indigo-400 underline"
            >
              👤 Add your name
            </Link>
          )}
        </div>

        {/* CURRENCY */}
        <div className="px-4 py-4 border-b border-gray-800">
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">
            Currency
          </label>

          <select
            value={currentCurrency}
            onChange={handleCurrencyChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-2 text-sm"
          >
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

        {/* NAVIGATION */}
        <nav className="px-4 py-4 space-y-4 text-gray-200 text-sm">

          <Link href="/" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            📊 Dashboard
          </Link>

          <Link href="/history" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            📜 History
          </Link>

          <Link href="/categories" onClick={() => setOpen(false)} className="block hover:text-indigo-300">
            🏷️ Categories
          </Link>
      <Link 
  href="https://www.heiyudigital.com/contact"
  className="block text-left hover:text-indigo-300"
>
  📩 Contact Support
</Link>
  </nav>

        {/* AUTH BUTTONS */}
<div className="px-4 mt-6">
  {user ? (
    <button
      onClick={handleLogout}
      className="w-full text-center py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition"
    >
      🚪 Log Out
    </button>
  ) : (
    <Link
      href="/login"
      onClick={() => setOpen(false)}
      className="w-full block text-center py-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
    >
      🔐 Login / Sign Up
    </Link>
  )}
</div>


        {/* LEGAL */}
        <div className="mt-8 px-4 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex flex-col gap-2">
          <Link href="/legal/privacy" onClick={() => setOpen(false)}>Privacy Policy</Link>
          <Link href="/legal/terms" onClick={() => setOpen(false)}>Terms of Service</Link>
          <Link href="/legal/cookies" onClick={() => setOpen(false)}>Cookie Policy</Link>
          <p className="mt-2 opacity-50 text-[10px]">© {new Date().getFullYear()} Heiyu Budget</p>
        </div>

      </div>
    </>
  );
}
