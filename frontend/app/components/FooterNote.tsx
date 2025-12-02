"use client";

import Link from "next/link";

export default function FooterNote() {
  return (
    <footer className="w-full text-center text-xs text-gray-400 mt-10 mb-4">

      {/* © line is now the clickable link */}
      <a
        href="https://www.heiyudigital.com"
        target="_blank"
        className="text-gray-300 hover:text-white transition font-medium"
      >
        © {new Date().getFullYear()} HeiyuDigital, All rights reserved.
      </a>

      <Link
        href="/updates"
        className="block text-indigo-400 hover:text-indigo-300 mt-2"
      >
        🆕 Updates / New Features
      </Link>
    </footer>
  );
}
