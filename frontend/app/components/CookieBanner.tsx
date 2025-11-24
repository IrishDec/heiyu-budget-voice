"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem("heiyu_cookie_consent");
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("heiyu_cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 p-4 z-50 shadow-2xl">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-300 text-center md:text-left">
          <p>
            We use strictly necessary cookies to keep you logged in and save your preferences. 
            We do not track you. By using Heiyu Budget, you agree to our 
            <Link href="/legal/cookies" className="text-indigo-400 hover:text-indigo-300 ml-1 underline">
              Cookie Policy
            </Link>.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-6 rounded-full transition"
        >
          Accept & Close
        </button>
      </div>
    </div>
  );
}