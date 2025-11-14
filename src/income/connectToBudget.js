// connectToBudget.js
// Connects the income system to the weekly budget view

import { incomeManager } from "./incomeManager.js";
import { calculateWeeklyIncome } from "./calculateWeeklyIncome.js";

export function getWeeklyIncome(weekStart, weekEnd) {
  const incomes = incomeManager.incomes;
  return calculateWeeklyIncome(incomes, weekStart, weekEnd);
}

