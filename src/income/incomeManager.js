// incomeManager.js
// Core logic for HeiyuBudget: multi-income system

export const incomeManager = {
  incomes: [],

  addIncome(income) {
    this.incomes.push({
      id: crypto.randomUUID(),
      label: income.label,
      amount: income.amount,
      frequency: income.frequency, // weekly | fortnightly | monthly
      nextPayDate: income.nextPayDate,
      createdAt: new Date(),
    });
  },

  getIncomeForWeek(weekStart, weekEnd) {
    return this.incomes.filter((item) => {
      const payDate = new Date(item.nextPayDate);
      return payDate >= weekStart && payDate <= weekEnd;
    });
  },
};
