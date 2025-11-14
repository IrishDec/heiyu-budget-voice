// incomeTypes.js

// Standard income object shape for HeiyuBudget
export const IncomeFrequencies = {
  WEEKLY: "weekly",
  FORTNIGHTLY: "fortnightly",
  MONTHLY: "monthly",
};

// Template example
export function createIncome({
  label,
  amount,
  frequency,
  nextPayDate,
}) {
  return {
    id: crypto.randomUUID(),
    label,
    amount,
    frequency,
    nextPayDate,
    createdAt: new Date(),
  };
}
