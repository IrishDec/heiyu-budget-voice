// calculateWeeklyIncome.js

export function calculateWeeklyIncome(incomes, weekStart, weekEnd) {
  if (!Array.isArray(incomes)) return 0;

  return incomes
    .filter((inc) => {
      const payDate = new Date(inc.date);
      return payDate >= weekStart && payDate <= weekEnd;
    })
    .reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
}

