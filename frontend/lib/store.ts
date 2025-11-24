import { supabase } from "./supabaseClient";
import { Entry, CategoryState } from "./types";

// 🌍 GLOBAL SETTINGS
export const WEEK_START_DAY = 1; // 1 = Monday

// --- Date Logic ---
export const getWeekBounds = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const currentDay = start.getDay();
  const diff = (currentDay - WEEK_START_DAY + 7) % 7;
  start.setDate(start.getDate() - diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// --- Database Logic (Supabase) ---

export const fetchEntries = async (): Promise<Entry[]> => {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
  return data as Entry[];
};

export const addEntry = async (entry: Omit<Entry, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("entries")
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error("Error adding entry:", error);
    return null;
  }
  return data;
};

export const updateEntry = async (entry: Entry) => {
  if (!entry.id) return null;
  const { data, error } = await supabase
    .from("entries")
    .update({
      amount: entry.amount,
      category: entry.category,
      type: entry.type,
      text: entry.text,
      created_at: entry.created_at
    })
    .eq("id", entry.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating entry:", error);
    return null;
  }
  return data;
};

export const deleteEntry = async (id: string) => {
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) console.error("Error deleting entry:", error);
};

// --- Settings (Categories) ---

export const fetchCategories = async (): Promise<CategoryState> => {
  const { data, error } = await supabase.from("settings").select("*").single();
  
  if (error || !data) {
    return {
        incomeCategories: ["Salary", "Freelance", "Gift", "Other"],
        expenseCategories: ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Health", "Other"],
    };
  }
  
  return {
    incomeCategories: data.income_categories || [],
    expenseCategories: data.expense_categories || []
  };
};

export const updateCategories = async (categories: CategoryState) => {
  // First check if a settings row exists for this user
  const { data: existing } = await supabase.from("settings").select("user_id").single();

  let error;
  if (!existing) {
    // Create row if missing
    const { error: insertError } = await supabase.from("settings").insert([{
      income_categories: categories.incomeCategories,
      expense_categories: categories.expenseCategories
    }]);
    error = insertError;
  } else {
    // Update existing row
    const { error: updateError } = await supabase.from("settings").update({
      income_categories: categories.incomeCategories,
      expense_categories: categories.expenseCategories
    }).eq("user_id", existing.user_id);
    error = updateError;
  }

  if (error) console.error("Error updating categories:", error);
};