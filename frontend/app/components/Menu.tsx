"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in when menu loads
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
      } else {
        setUserEmail(null);
      }
    };
    checkUser();
  }, [isOpen]); // Re-check every time menu opens

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* 🍔 Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-2 bg-gray-800/80 rounded-full border border-gray-600 shadow-lg text-white hover:bg-gray-700 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 🌑 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 📂 Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <span className="text-xl font-bold text-white">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* User Status */}
          <div className="mb-6">
            {userEmail ? (
              <div className="p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
                <p className="text-xs text-indigo-300 uppercase font-bold">Logged in as</p>
                <p className="text-xs text-white truncate">{userEmail}</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-xs text-gray-400">Guest Mode (Offline)</p>
              </div>
            )}
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4 flex-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-lg font-medium hover:pl-2 transition-all"
            >
              🏠 Dashboard
            </Link>
            <Link
              href="/history"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-lg font-medium hover:pl-2 transition-all"
            >
              📜 History
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-lg font-medium hover:pl-2 transition-all"
            >
              🏷️ Categories
            </Link>
          </nav>

          {/* Login / Logout Button */}
          <div className="mt-auto pt-6 border-t border-gray-700">
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl font-bold hover:bg-red-500/20 transition"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}