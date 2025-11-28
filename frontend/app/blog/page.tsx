"use client";

import React from "react";
import Link from "next/link";
import Menu from "../components/Menu";

export default function BlogHub() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-6 pb-24">
      <Menu />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-400 hover:text-white transition text-lg font-bold">
            ← Back
        </Link>
        <h1 className="text-2xl font-bold">Tax Tips & Guides</h1>
      </div>

      {/* Intro Card */}
      <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-2xl mb-8">
        <h2 className="text-lg font-bold text-indigo-300 mb-2">Drive Smart, Save Money</h2>
        <p className="text-sm text-gray-300">
          Advice for Irish Taxi Drivers & Gig Workers. Simple guides to help you keep the Revenue Commissioners happy.
        </p>
      </div>

      {/* Article List */}
      <div className="space-y-4">

        {/* 🚨 Article #3 (HOT NEWS - TOP OF LIST) */}
        <Link href="/blog/uber-fixed-fare-protests" className="block bg-red-900/10 p-5 rounded-xl border border-red-500/30 hover:border-red-400 transition shadow-lg group">
            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md mb-2 inline-block">
                INDUSTRY NEWS
            </span>
            <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-300 transition mb-2">
                Uber Fixed Fares: Are you working for free?
            </h3>
            <p className="text-sm text-gray-400">
                Drivers are protesting Upfront Pricing. Here is why the algorithm might be costing you money in traffic.
            </p>
        </Link>
        
        {/* Article #1 */}
        <Link href="/blog/dead-mileage-guide" className="block bg-gray-800/60 p-5 rounded-xl border border-gray-700 hover:border-indigo-500 transition shadow-lg group">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md mb-2 inline-block">
                TAX BASICS
            </span>
            <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition mb-2">
                What is "Dead Mileage" and can I claim it?
            </h3>
            <p className="text-sm text-gray-400">
                Understanding the difference between business miles and personal miles is the #1 way to save on your tax bill.
            </p>
        </Link>

        {/* Article #2 */}
        <Link href="/blog/write-for-us" className="block bg-blue-900/20 p-5 rounded-xl border border-blue-500/30 hover:border-blue-400 transition shadow-lg group">
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md mb-2 inline-block">
                COMMUNITY
            </span>
            <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-300 transition mb-2">
                Heiyu is Global: Write for us
            </h3>
            <p className="text-sm text-gray-400">
                We are looking for local experts in the UK, Europe, and US to help drivers understand their local tax rules.
            </p>
        </Link>

      </div>
    </main>
  );
}