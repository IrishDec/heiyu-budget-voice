"use client";

import React from "react";
import Link from "next/link";
import Menu from "../../components/Menu";

export default function ArticleUberProtest() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-6 pb-24">
      <Menu />

      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/blog" className="text-gray-400 hover:text-white transition">
            ← Back to Blog
        </Link>
      </div>

      <article className="max-w-xl mx-auto">
        
        <header className="mb-8">
            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md mb-3 inline-block">
                INDUSTRY NEWS
            </span>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                Uber Fixed Fares: Are you working for free in traffic?
            </h1>
            <p className="text-gray-400 text-sm">
                By Heiyu Team • 3 min read
            </p>
        </header>

        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-indigo-300">
            <p className="text-lg leading-relaxed mb-6">
                The tension between Drivers and Apps has hit a boiling point again. This time, it's about <strong>Fixed Price Fares</strong>.
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">The Meter vs. The Algorithm</h2>
            <p className="mb-4">
                For decades, the Taximeter was the fair judge. If you got stuck in gridlock on the Quays, the meter kept ticking. Time was money.
            </p>
            <p className="mb-4">
                With "Upfront Pricing," the algorithm guesses the price before you turn the key. If that 15-minute trip turns into a 45-minute nightmare because of a protest or roadworks, <strong>you eat the cost, not the passenger.</strong>
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">Why Drivers are Protesting</h2>
            <p className="mb-4">
                It's simple math. If your fixed fare is €12, but the meter *would* have read €18, you have worked the last 20 minutes for free.
            </p>
            <p className="mb-4">
                Apps claim it gives passengers "certainty." Drivers argue it shifts all the risk onto the person behind the wheel.
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">The Solution? Vote with your feet.</h2>
            <p className="mb-6">
                We are not employees. We are business owners. If a business partner is costing you money, <strong>fire them.</strong>
            </p>
            <p className="mb-6">
                Don't accept fixed fares ever. If an app goes fixed fares, <strong>delete the app.</strong>
            </p>
            <p className="mb-6">
                Use Heiyu to track your earnings on the street. Compare a week of "App Work" vs a week of "Rank Work". Data doesn't lie. If the apps are dragging your hourly rate down, turn them off and stick to the meter.
            </p>

            {/* CTA Box */}
            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl mt-10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Know Your Worth</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Track your income instantly. See exactly how much you are making per shift.
                </p>
                <Link href="/" className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                    Start Tracking Now
                </Link>
            </div>

        </div>
      </article>
    </main>
  );
}