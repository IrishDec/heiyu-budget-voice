"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // State to toggle between Login, Signup, and Forgot Password
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");
  
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); setError(null); setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/"); router.refresh();
    }
  };

  const handleSignUp = async () => {
    setLoading(true); setError(null); setMessage(null);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setMessage("Success! Check your email to confirm your account.");
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true); setError(null); setMessage(null);
    if (!email) { setError("Please enter your email."); setLoading(false); return; }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // You will need to make this page later if you want them to type a new password
    });

    if (error) setError(error.message);
    else setMessage("Password reset link sent! Check your email.");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1e293b] p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Heiyu<span className="text-indigo-400">Budget</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {view === "forgot" ? "Reset your password" : "Sign in to sync your tax records."}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}
        {message && <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">{message}</div>}

        {!message && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg bg-[#0f172a] border border-gray-600 text-white px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="name@example.com" />
            </div>

            {view !== "forgot" && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg bg-[#0f172a] border border-gray-600 text-white px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="••••••••" />
                <div className="text-right mt-1">
                  <button onClick={() => setView("forgot")} className="text-xs text-indigo-400 hover:text-indigo-300">Forgot Password?</button>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              {view === "forgot" ? (
                <div className="w-full flex flex-col gap-3">
                  <button onClick={handleResetPassword} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors">{loading ? "Sending..." : "Send Reset Link"}</button>
                  <button onClick={() => setView("login")} className="text-gray-400 text-sm hover:text-white">Back to Login</button>
                </div>
              ) : (
                <>
                  <button onClick={handleLogin} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors">{loading ? "..." : "Login"}</button>
                  <button onClick={handleSignUp} disabled={loading} className="flex-1 bg-transparent border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white font-semibold py-3 rounded-lg transition-colors">Sign Up</button>
                </>
              )}
            </div>
            
            <div className="pt-6 mt-4 border-t border-gray-700 text-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}