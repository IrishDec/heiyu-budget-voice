"use client";

import React from "react";
import Link from "next/link";
import Menu from "../../components/Menu";

export default function ArticleGlobal() {
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
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md mb-3 inline-block">
                COMMUNITY
            </span>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                Heiyu is Global: Help us help drivers in your country
            </h1>
            <p className="text-gray-400 text-sm">
                By Heiyu Team • 2 min read
            </p>
        </header>

        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-indigo-300">
            <p className="text-lg leading-relaxed mb-6">
                HeiyuBudget started in Dublin, Ireland. We built it because we were tired of losing receipts and dreading the end-of-year tax return.
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">Universal Problem, Local Rules</h2>
            <p className="mb-4">
                Whether you drive a Yellow Cab in New York, an Uber in London, or a Bolt in Paris, the problem is the same: <strong>You need to track your cash.</strong>
            </p>
            <p className="mb-4">
                Our App Engine is built to work anywhere. It detects your local currency and time zone automatically. However, <strong>Tax Laws</strong> are different in every city.
            </p>
            
            <h2 className="text-xl font-bold mb-3 mt-8">We need Local Experts</h2>
            <p className="mb-4">
                We are looking for Drivers, Accountants, or Gig Workers from around the world to contribute to this blog.
            </p>
            <p className="mb-4">
                Do you know the specific deductions for Uber drivers in Germany? Do you know the VAT rules for freelancers in Australia?
            </p>

            <h2 className="text-xl font-bold mb-3 mt-8">Write for Us</h2>
            <p className="mb-6">
                If you want to write a guide for your local area, we want to hear from you. We can feature your profile and help you build a reputation in your local driver community.
            </p>

            {/* CTA Box */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl mt-10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Get in Touch</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Send us a quick email with your location and what you want to write about.
                </p>
                <a href="mailto:contact@heiyubudget.com" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
                    Email the Team
                </a>
            </div>

        </div>
      </article>
    </main>
  );
}