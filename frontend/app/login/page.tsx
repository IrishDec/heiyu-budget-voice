"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// 👇 FIX: Importing from your EXISTING file
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Login success -> Go to dashboard
      router.push("/"); 
      router.refresh();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // UX FIX: Show message instead of redirecting
      setMessage("Success! Please check your email to confirm your account.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1e293b] p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Heiyu<span className="text-indigo-400">Taxi</span>
          </h1>
          <p className="text-gray-400 text-sm">Sign in to sync your tax records.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success Message (For Sign Up) */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">
            <p className="font-semibold text-lg mb-1">📧 Check your inbox</p>
            {message}
          </div>
        )}

        {!message && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#0f172a] border border-gray-600 text-white px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#0f172a] border border-gray-600 text-white px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Login"}
              </button>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-transparent border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              New here? Click <strong>Sign Up</strong> and we'll send you a confirmation link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}