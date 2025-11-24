import Link from "next/link";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-gray-300 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last Updated: {new Date().getFullYear()}</p>
      
      <p className="mb-4">
        Heiyu Taxi ("we", "us") is committed to protecting your financial data. This policy outlines how we handle your information.
      </p>
      
      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Data We Collect</h2>
      <ul className="list-disc pl-5 mb-4 space-y-2">
        <li><strong>Account Information:</strong> We collect your email address solely for authentication purposes via Supabase.</li>
        <li><strong>Financial Entries:</strong> We store the income and expense records you enter (Amount, Category, Notes, Date) to provide the service.</li>
        <li><strong>Voice Data:</strong> Voice processing happens on your device (via Web Speech API). We do <strong>not</strong> store audio recordings. Only the transcribed text is saved.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. How We Store Data</h2>
      <p className="mb-4">
        Your data is stored in a secure, enterprise-grade database (Supabase). We utilize <strong>Row Level Security (RLS)</strong>, which means technically and legally, only your authenticated user account can access your specific financial records.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Data Usage</h2>
      <p className="mb-4">
        We do not sell, rent, or share your personal or financial data with third-party advertisers. Your data is used strictly to generate your budget history and reports.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Account Deletion</h2>
      <p className="mb-4">
        You have the right to be forgotten. If you wish to delete your account and all associated data, please contact us via the Contact page, and we will permanently wipe your records.
      </p>

      <Link href="/" className="text-indigo-400 hover:text-indigo-300 mt-10 block font-semibold">← Back to App</Link>
    </main>
  );
}