// applyIncomeToWeeklyPage.js
// Prepares weekly income to be injected into the weekly page component

import { injectWeeklyIncome } from "./injectWeeklyIncome.js";

export function applyIncomeToWeeklyPage(weekStart, weekEnd, pageState) {
  // pageState = whatever your Weekly Page currently uses (expenses, totals, etc.)
  return injectWeeklyIncome(weekStart, weekEnd, pageState);
}
