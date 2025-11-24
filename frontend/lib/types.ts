export type EntryType = "Income" | "Expense";

export type Entry = {
  type: EntryType;
  amount: string;
  category: string;
  text?: string;
  created_at: string;
};

export type CategoryState = {
  incomeCategories: string[];
  expenseCategories: string[];
};