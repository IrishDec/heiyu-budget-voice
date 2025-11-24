"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  
  // Debug State
  const [debugUrl, setDebugUrl] = useState("");

  useEffect(() => {
    // Check what URL supabase thinks it is using
    // (This is a hack to peek inside the client)
    const url = (supabase as any).supabaseUrl || "Unknown";
    setDebugUrl(url);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMsg(error.message); setLoading(false); } 
    else { router.push("/"); }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setMsg(error.message); setLoading(false); } 
    else { setMsg("Account created! Logging you in..."); router.push("/"); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900/80 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Heiyu<span className="text-indigo-400">Taxi</span>
        </h1>
        
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600" />
          </div>

          {msg && <div className="p-3 bg-red-500/20 text-red-200 text-sm rounded-lg text-center">{msg}</div>}

          <div className="pt-2 flex gap-3">
            <button onClick={handleLogin} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-white font-bold transition">Login</button>
            <button onClick={handleSignUp} disabled={loading} className="flex-1 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 py-3 rounded-xl font-bold transition">Sign Up</button>
          </div>
        </div>

        {/* 👇 DEBUG BOX - THIS WILL TELL US THE TRUTH */}
        <div className="mt-8 p-3 bg-black/50 rounded-lg text-[10px] text-gray-500 font-mono break-all">
          <p>DEBUG INFO:</p>
          <p>Connecting to: {debugUrl}</p>
        </div>
      </div>
    </main>
  );
}