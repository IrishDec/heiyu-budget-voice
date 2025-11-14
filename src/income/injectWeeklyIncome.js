// injectWeeklyIncome.js
// Adds weekly income into the Weekly Budget Page data flow

import { useWeeklyIncome } from "./useWeeklyIncome.js";

export function injectWeeklyIncome(weekStart, weekEnd, budgetData) {
  const { totalIncome } = useWeeklyIncome(weekStart, weekEnd);

  return {
    ...budgetData,
    income: totalIncome,
  };
}
