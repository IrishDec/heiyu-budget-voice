"use client";

import Link from "next/link";

export default function FooterNote() {
  return (
    <footer className="w-full text-center text-xs text-gray-400 mt-10 mb-4">
      <p>
        ⚠️ This is an early <strong>Heiyu Budget Voice</strong> test version. 
        
      </p>

      <Link
        href="/updates"
        className="block text-indigo-400 hover:text-indigo-300 mt-2"
      >
        🆕 Updates / New Features
      </Link>
    </footer>
  );
}
