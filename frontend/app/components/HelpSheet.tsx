"use client";

interface HelpSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpSheet({ open, onClose }: HelpSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-[#0f172a] w-full p-6 rounded-t-2xl border-t border-gray-700 animate-slideUp">
        
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4" />

        <h2 className="text-xl font-bold mb-4 text-indigo-300 text-center">
          Help & Tips
        </h2>

        <div className="text-gray-300 space-y-4 text-sm">

          <div>
            <h3 className="font-semibold text-indigo-400">🎙 Voice Input</h3>
            <p>Say: <strong>income/expense + amount + category</strong></p>
            <p className="mt-1 text-gray-400 text-xs">
              Example: “Expense 12 coffee” • “Income 50 street cash”
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-400">✏️ Text Input</h3>
            <p>Type the same format as voice.</p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-400">🏷 Categories</h3>
            <p>Add/edit categories any time. They control filtering and graphs.</p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-400">📊 Weekly Graphs</h3>
            <p>Bars show total income/expense for each day of the week.</p>
          </div>

          <div>
            <h3 className="font-semibold text-indigo-400">🔄 Refresh App</h3>
            <p>Use “Refresh App” in the menu to get new updates.</p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        >
          Got it
        </button>

      </div>
    </div>
  );
}
