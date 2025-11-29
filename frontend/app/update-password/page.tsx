"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    if (!password) return;
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setMsg("Error: " + error.message);
      setLoading(false);
    } else {
      setMsg("Success! Password updated.");
      setTimeout(() => {
        router.push("/"); // Send them to dashboard
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900/80 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-white mb-2 text-center">
          Set New Password
        </h1>
        <p className="text-gray-400 text-xs text-center mb-6">
          Enter your new password below.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {msg && (
            <div className={`p-3 text-sm rounded-lg text-center ${msg.includes("Error") ? "bg-red-500/20 text-red-200" : "bg-emerald-500/20 text-emerald-200"}`}>
              {msg}
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-white font-bold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Password"}
          </button>
        </div>
      </div>
    </main>
  );
}