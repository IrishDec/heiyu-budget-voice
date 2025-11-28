"use client";

import React from "react";
import Link from "next/link";
import Menu from "../../components/Menu"; // Note: Up 2 levels

export default function ArticleDeadMileage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 py-6 pb-24">
      <Menu />

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/blog" className="text-gray-400 hover:text-white transition">
            ← Back to Blog
        </Link>
      </div>

      {/* Article Container */}
      <article className="max-w-xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md mb-3 inline-block">
                TAX BASICS
            </span>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                What is "Dead Mileage" and can I claim it?
            </h1>
            <p className="text-gray-400 text-sm">
                By Heiyu Team • 3 min read
            </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-indigo-300">
            <p className="text-lg leading-relaxed mb-6">
                One of the most confusing parts of being a Taxi Driver or Gig Worker in Ireland is understanding exactly <strong>when</strong> you are "working" for tax purposes.
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">The "Commute" vs. "Dead Mileage"</h2>
            <p className="mb-4">
                The Revenue Commissioners draw a strict line between two types of driving without a passenger:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-300">
                <li>
                    <strong className="text-white">The Commute (Not Deductible):</strong> Driving from your front door to your "Place of Work" (e.g., the rank, or the first pickup zone) is usually considered a private commute. You cannot claim diesel for this.
                </li>
                <li>
                    <strong className="text-white">Dead Mileage (Deductible):</strong> Once you have started your shift, driving from a drop-off point to your next pickup point is a business expense. You <strong>can</strong> claim this.
                </li>
            </ul>

            <h2 className="text-xl font-bold mb-3 mt-8">Why tracking matters</h2>
            <p className="mb-4">
                If you get audited, Revenue might ask: <em>"You claimed 100% of your diesel, but surely you drive the car to the shops sometimes?"</em>
            </p>
            <p className="mb-4">
                If you don't have records, they might estimate your personal usage is higher than it really is, costing you money.
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">The Solution</h2>
            <p className="mb-6">
                Keep a simple log. You don't need a complex GPS tracker. Just noting your "Start Shift" mileage and "End Shift" mileage is often enough to establish a pattern.
            </p>

            {/* CTA Box */}
            <div className="bg-indigo-900/40 border border-indigo-500/50 p-6 rounded-2xl mt-10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Start Tracking Today</h3>
                <p className="text-sm text-gray-300 mb-4">
                    HeiyuBudget helps you track income and expenses instantly with voice commands. Don't lose another receipt.
                </p>
                <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                    Go to Dashboard
                </Link>
            </div>

        </div>
      </article>
    </main>
  );
}