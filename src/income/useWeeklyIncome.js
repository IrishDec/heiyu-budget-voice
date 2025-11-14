// useWeeklyIncome.js
// React-style hook to fetch weekly income for the UI

import { getWeeklyIncome } from "./connectToBudget.js";

export function useWeeklyIncome(weekStart, weekEnd) {
  const totalIncome = getWeeklyIncome(weekStart, weekEnd);

  return {
    totalIncome,
  };
}
