// categoryStore.js
import { incomeCategories, expenseCategories } from "./categories";

// Load categories from storage (fallback → defaults)
export function loadCategories() {
  if (typeof window === "undefined") {
    return { incomeCategories, expenseCategories };
  }

  try {
    const saved = localStorage.getItem("heiyu_budget_categories");
    if (!saved) return { incomeCategories, expenseCategories };

    const parsed = JSON.parse(saved);
    return {
      incomeCategories: parsed.incomeCategories || incomeCategories,
      expenseCategories: parsed.expenseCategories || expenseCategories,
    };
  } catch (e) {
    console.error("Failed to load categories:", e);
    return { incomeCategories, expenseCategories };
  }
}

// Save categories
export function saveCategories(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("heiyu_budget_categories", JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save categories:", e);
  }
}

