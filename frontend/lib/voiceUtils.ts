import { EntryType } from "./types";

export interface ParsedVoiceData {
  type: EntryType;
  amount: string;
  category: string;
  text: string;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedVoiceData;
  error?: string;
}

/**
 * Parses the spoken text into structured budget data.
 * CRITICAL: This logic matches the original regex requirements exactly.
 */
export function parseVoiceInput(spokenText: string): ParseResult {
  const lower = spokenText.toLowerCase();

  // 1️⃣ Must start with Income or Expense
  let type: EntryType | null = null;
  if (lower.startsWith("income")) type = "Income";
  if (lower.startsWith("expense")) type = "Expense";

  if (!type) {
    return {
      success: false,
      error: "Please start with 'Income' or 'Expense'.\nExample: Income 20 Street cash"
    };
  }

  // 2️⃣ Extract numeric amount (10, 10.50, 10,50)
  const amountMatch = spokenText.match(/(\d+([.,]\d{1,2})?)/);
  if (!amountMatch) {
    return {
      success: false,
      error: "No amount found. Say: Income 20 Street cash"
    };
  }

  const rawAmount = amountMatch[1];
  const parsedAmount = rawAmount.replace(",", ".");

  // 3️⃣ Category = everything after amount
  let cat = spokenText.split(rawAmount)[1]?.trim() ?? "";

  // Remove leading currency words
  cat = cat.replace(
    /^(dollar|dollars|euro|euros|pound|pounds|yen|yuan|peso|rupee|€|\$|£|¥)\s*/i,
    ""
  );

  if (!cat) cat = "Uncategorized";

  // 🆙 Auto-capitalize category
  cat = cat
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

  return {
    success: true,
    data: {
      type,
      amount: parsedAmount,
      category: cat,
      text: spokenText,
    }
  };
}