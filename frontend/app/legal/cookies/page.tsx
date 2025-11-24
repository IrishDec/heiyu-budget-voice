import Link from "next/link";

export default function Cookies() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-gray-300 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
      
      <p className="mb-4">
        Heiyu Taxi believes in keeping things simple. We use a minimal number of cookies strictly necessary for the app to function.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Essential Cookies</h2>
      <p className="mb-4">
        We use authentication cookies (provided by Supabase) to keep you logged in securely. Without these, you would have to log in every time you refreshed the page.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. No Tracking Cookies</h2>
      <p className="mb-4">
        We do <strong>not</strong> use third-party tracking cookies, advertising pixels, or intrusive analytics that follow you around the web.
      </p>

      <Link href="/" className="text-indigo-400 hover:text-indigo-300 mt-10 block font-semibold">← Back to App</Link>
    </main>
  );
}