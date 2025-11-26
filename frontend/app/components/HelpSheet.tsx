"use client";

export default function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#0f172a] rounded-t-2xl p-6 text-gray-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">How to Use HeiyuBudget</h2>

        {/* VOICE INPUT */}
        <h3 className="text-indigo-200 font-bold mt-4 mb-2">📢 How to use voice input</h3>
        <p className="text-sm mb-2">
          Say entries like:
          <br />• <strong>“Income 20 point 60 salary”</strong>
          <br />• <strong>“Expense 3 point 60 coffee”</strong>
        </p>
        <p className="text-sm mb-4">
          Start with <strong>Income</strong> or <strong>Expense</strong>, then the amount, then the category.
          For decimals say: <strong>“point 60”</strong>.
          Finish with the category name.
        </p>

        {/* MANUAL */}
        <h3 className="text-indigo-200 font-bold mt-4 mb-2">📝 Manual Input</h3>
        <p className="text-sm mb-4">
          Tap <strong>Add / Manage</strong> → choose type → enter amount, category, notes → Save.
        </p>

        {/* HISTORY */}
        <h3 className="text-indigo-200 font-bold mt-4 mb-2">📊 History & Filters</h3>
        <p className="text-sm mb-4">
          Switch between <strong>Day / Week / Month / Year</strong>.  
          Tap any entry to <strong>edit or delete</strong>.  
          Tap <strong>Reset Filters</strong> to show all income and expenses again.
        </p>

        {/* PROFILE */}
        <h3 className="text-indigo-200 font-bold mt-4 mb-2">👤 Profile</h3>
        <p className="text-sm mb-4">
          Add your name for a personal greeting.  
          Change currency anytime.  
          Logout anytime.
        </p>

        {/* REFRESH */}
        <h3 className="text-indigo-200 font-bold mt-4 mb-2">🔄 Refresh & Updates</h3>
        <p className="text-sm mb-4">
          Tap <strong>Refresh</strong> in the menu to load the latest version of the app.  
          Check the <strong>Updates</strong> section in the footer to see new features.
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

