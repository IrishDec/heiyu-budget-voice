"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user?.user_metadata?.name) setName(user.user_metadata.name);
      setLoading(false);
    });
  }, []);

  const saveName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.auth.updateUser({
      data: { name }
    });

    alert("Name saved!");
    window.location.href = "/";
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <label className="block text-sm text-gray-400 mb-1">Display Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4"
      />

      <button
        onClick={saveName}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl"
      >
        Save
      </button>

      <button
        onClick={() => (window.location.href = "/")}
        className="w-full mt-3 border border-gray-600 py-2 rounded-xl text-gray-300"
      >
        Cancel
      </button>
    </main>
  );
}
