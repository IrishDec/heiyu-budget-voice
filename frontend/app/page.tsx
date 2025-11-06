"use client";

import React, { useState, useEffect } from "react";


export default function Home() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [entryType, setEntryType] = useState<"Expense" | "Income">("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  // 🧠 Load saved entries on startup
useEffect(() => {
  const saved = localStorage.getItem("heiyu-entries");
  if (saved) {
    setEntries(JSON.parse(saved));
  }
}, []);

// 💾 Save entries every time they change
useEffect(() => {
  localStorage.setItem("heiyu-entries", JSON.stringify(entries));
}, [entries]);


  // 🎙️ Speech recognition
  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      console.log("🗣️ Heard:", spokenText);
      setText(spokenText);

      // basic guess: if it contains "income" or "earned" → income, else expense
      const lower = spokenText.toLowerCase();
      const typeGuess =
        lower.includes("income") || lower.includes("earned") || lower.includes("received")
          ? "Income"
          : "Expense";
      setEntryType(typeGuess as "Expense" | "Income");
    };
    recognition.onerror = (e: any) => {
      console.error("Speech error:", e.error);
      alert("Speech recognition error: " + e.error);
    };
    recognition.onend = () => setListening(false);

    recognition.start();
  };

// 💾 Save handler (for both voice + manual)
const handleAdd = () => {
  // Merge text + manual fields before parsing
  const combinedText = text || `${entryType} ${amount} ${category} ${notes}`.trim();
  const lower = combinedText.toLowerCase();

  // Detect type (income vs expense)
  const type =
    lower.includes("income") || lower.includes("earned") || lower.includes("received")
      ? "Income"
      : "Expense";

  // Detect numeric amount
  const numberMatch = lower.match(/(\d+(\.\d+)?)/);
  const parsedAmount = numberMatch ? numberMatch[0] : amount || null;

  // Detect category (after the number)
  const words = lower.split(" ");
  const numberIndex = words.findIndex((w) => w.match(/(\d+(\.\d+)?)/));
  let parsedCategory = category;
  if (!parsedCategory && numberIndex !== -1 && words[numberIndex + 1]) {
    parsedCategory = words.slice(numberIndex + 1).join(" ");
  }

  const entry = {
    type,
    text: combinedText,
    amount: parsedAmount || "—",
    category: parsedCategory || "—",
    notes: notes || null,
    created_at: new Date().toLocaleString(),
  };

  console.log("💾 Added to budget:", entry);
  alert(`Added ${entry.type}: ${entry.category} (€${entry.amount})`);

  setEntries((prev) => [entry, ...prev].slice(0, 5));

  // Reset everything
  setText("");
  setAmount("");
  setCategory("");
  setNotes("");
  setManualMode(false);
};


  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Heiyu Budget Voice</h1>

      {/* 🎤 Voice input */}
      <button
        className={`${
          listening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
        } text-white py-3 px-6 rounded-full text-lg mb-4`}
        onClick={handleMicClick}
      >
        {listening ? "🎙️ Listening..." : "🎤 Tap to Speak"}
      </button>

      {/* 🗒️ Spoken or typed entry */}
      {text && (
        <div className="bg-gray-800 w-full max-w-md p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Captured {entryType}</h3>
          <p className="text-gray-200">{text}</p>
        </div>
      )}

      {/* 💾 Save directly (from voice) */}
      {text && !manualMode && (
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-lg mb-4"
          onClick={handleAdd}
        >
          💾 Save Voice Entry
        </button>
      )}

      {/* ✏️ Switch to manual form */}
      {!manualMode && (
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-5 rounded-lg mb-4"
          onClick={() => setManualMode(true)}
        >
          ✏️ Add Manually
        </button>
      )}

      {/* 🧾 Manual form */}
      {manualMode && (
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md mb-4">
          <label className="block mb-2 text-sm text-gray-300">Type</label>
          <select
            className="w-full p-2 rounded text-black mb-3"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as "Expense" | "Income")}
          >
            <option>Expense</option>
            <option>Income</option>
          </select>

          <label className="block mb-2 text-sm text-gray-300">Amount (€)</label>
          <input
            type="number"
            step="0.01"
            placeholder="12.40"
            className="w-full p-2 rounded text-black mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="block mb-2 text-sm text-gray-300">Category</label>
          <input
            type="text"
            placeholder="Fuel, Coffee, etc."
            className="w-full p-2 rounded text-black mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label className="block mb-2 text-sm text-gray-300">Notes</label>
          <input
            type="text"
            placeholder="Optional details..."
            className="w-full p-2 rounded text-black mb-3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-lg mt-2"
            onClick={handleAdd}
          >
            ➕ Add to Budget
          </button>
        </div>
      )}

         <p className="mt-4 text-gray-400 text-center">
        Tap and speak naturally — or add manually when needed.
      </p>

      {/* 🧾 Recent Entries */}
      {entries.length > 0 && (
        <div className="w-full max-w-md bg-gray-800 mt-6 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Recent Entries</h3>
          <ul>
            {entries.map((e, i) => (
              <li key={i} className="border-b border-gray-700 py-2">
                <p className="text-sm text-gray-300">
                  <strong>{e.type}</strong>: {e.text || e.category || "—"}
                </p>
                <p className="text-xs text-gray-500">{e.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}