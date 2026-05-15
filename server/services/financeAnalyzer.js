export const summarizeTransactions = (transactions = [], budget = null) => {
  const income = transactions.filter(t => t.type === "income");
  const expenses = transactions.filter(t => t.type === "expense");

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpense;

  const monthlyBudget = budget?.monthlyBudget || 0;
  const budgetRemaining = monthlyBudget - totalExpense;

  // Category breakdown
  const categoryMap = {};
  expenses.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly trend
  const monthlyMap = {};
  transactions.forEach(t => {
    const key = new Date(t.transactionDate).toISOString().slice(0, 7);
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    if (t.type === "income") monthlyMap[key].income += t.amount;
    else monthlyMap[key].expense += t.amount;
  });
  const monthlyTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // Predicted expense
  const expenseMonths = monthlyTrend.map(m => m.expense).filter(e => e > 0);
  const predictedExpense = expenseMonths.length
    ? expenseMonths.reduce((a, b) => a + b, 0) / expenseMonths.length
    : 0;

  // Heuristic insights
  const insights = [];
  if (totalExpense > totalIncome) {
    insights.push("⚠️ You are spending more than you earn. Review your expenses.");
  }
  if (categoryBreakdown[0]) {
    insights.push(`📊 Your highest spending category is ${categoryBreakdown[0].category} (₹${categoryBreakdown[0].amount}).`);
  }
  if (monthlyBudget > 0 && budgetRemaining < 0) {
    insights.push(`🚨 You have exceeded your monthly budget by ₹${Math.abs(budgetRemaining)}.`);
  }
  if (savings > 0) {
    insights.push(`✅ Great job! You have saved ₹${savings} this period.`);
  }
  if (transactions.length === 0) {
    insights.push("👋 Welcome! Start by adding your income and expenses to get insights.");
  }

  return {
    totalIncome,
    totalExpense,
    savings,
    monthlyBudget,
    budgetRemaining,
    categoryBreakdown,
    monthlyTrend,
    predictedExpense,
    insights,
  };
};