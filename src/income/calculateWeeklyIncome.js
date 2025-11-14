// calculateWeeklyIncome.js
// Returns total income for the selected week (Mon → Sun)

export function calculateWeeklyIncome(incomes, weekStart, weekEnd) {
  return incomes
    .filter((income) => {
      const payDate = new Date(income.nextPayDate);
      return payDate >= weekStart && payDate <= weekEnd;
    })
    .reduce((sum, income) => sum + income.amount, 0);
}
