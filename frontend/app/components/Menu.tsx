"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrency, saveCurrency } from "../../lib/store";
import { createClient } from "@supabase/supabase-js";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("€");

  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(false);

  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Load currency + user + nickname
  useEffect(() => {
    setCurrentCurrency(getCurrency());

    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      setUser(u);

      if (u?.user_metadata?.nickname) {
        setNickname(u.user_metadata.nickname);
      }
    });
  }, []);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    saveCurrency(e.target.value);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const saveNicknameToSupabase = async () => {
    if (!user) return;

    await supabase.auth.updateUser({
      data: { nickname: nickname }
    });

    setShowNameModal(false);
  };

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-900/80 border border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-indigo-400 transition"
      >
        <span className="block w-5 h-0.5 bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-200 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-200" />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setOpen(false)} />
      )}

      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#020817] border-l border-gray-800 z-20 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-indigo-300">HeiyuBudget</h2>

            {user && (
              <button
                onClick={() => setShowNameModal(true)}
                className="text-sm text-gray-400 hover:text-white mt-1 flex items-center gap-1"
              >
                👤 {nickname ? nickname : "Add your name"}
              </button>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>

        {/* Currency Picker */}
        <div className="px-4 py-4 border-b border-gray-800">
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Currency</label>
          <select
            value={currentCurrency}
            onChange={handleCurrencyChange}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-2 text-sm"
          >
            <option value="€">Euro (€) - Europe</option>
            <option value="$">Dollar ($)</option>
            <option value="£">Pound (£)</option>
            <option value="¥">Yen/Yuan (¥)</option>
            <option value="₹">Rupee (₹)</option>
          </select>
        </div>

        {/* Nav Links */}
        <nav className="px-4 py-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          <div className="space-y-3 mb-6">
            <Link href="/" onClick={() => setOpen(false)} className="block text-gray-200 hover:text-indigo-300">
              📊 Dashboard
            </Link>

            <Link href="/history" onClick={() => setOpen(false)} className="block text-gray-200 hover:text-indigo-300">
              📜 History
            </Link>

            <Link href="/categories" onClick={() => setOpen(false)} className="block text-gray-200 hover:text-indigo-300">
              🏷️ Categories
            </Link>
          </div>

          {/* Company */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <Link href="/about" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-indigo-300 text-sm">
              👋 About Us
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)} className="block text-gray-400 hover:text-indigo-300 text-sm">
              📩 Contact Support
            </Link>
          </div>

          {/* Auth Area */}
          <div className="pt-4 mt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-center py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition text-sm font-semibold"
              >
                🚪 Log Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition text-sm font-semibold"
              >
                🔑 Log In / Sign Up
              </Link>
            )}
          </div>

          {/* Legal */}
          <div className="mt-8 pt-4 border-t border-gray-800 text-[11px] text-gray-400 flex flex-col gap-3">
            <Link href="/legal/privacy" onClick={() => setOpen(false)} className="hover:text-white">Privacy Policy</Link>
            <Link href="/legal/terms" onClick={() => setOpen(false)} className="hover:text-white">Terms of Service</Link>
            <Link href="/legal/cookies" onClick={() => setOpen(false)} className="hover:text-white">Cookie Policy</Link>
            <p className="mt-2 opacity-50 text-[10px]">© {new Date().getFullYear()} Heiyu Budget</p>
          </div>
        </nav>
      </div>

      {/* Nickname Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-72">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3">Your Name</h3>

            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Enter your name"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowNameModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>

              <button
                onClick={saveNicknameToSupabase}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
