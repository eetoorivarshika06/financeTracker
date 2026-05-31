import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { summarizeTransactions } from "./financeAnalyzer.js";

const DAYS_90 = 90;

export const fetchRecentTransactions = async (userId) => {
  const since = new Date();
  since.setDate(since.getDate() - DAYS_90);

  return Transaction.find({
    userId,
    transactionDate: { $gte: since },
  }).sort({ transactionDate: -1 });
};

const getMonthRange = (monthsAgo = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59);
  return { start, end };
};

const filterByRange = (transactions, start, end) =>
  transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return d >= start && d <= end;
  });

const sumByType = (transactions, type) =>
  transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

const categoryTotals = (expenses) => {
  const map = {};
  expenses.forEach((t) => {
    const cat = (t.category || "Uncategorized").trim();
    map[cat] = (map[cat] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const buildSpendingContext = async (userId) => {
  const transactions = await fetchRecentTransactions(userId);
  const budget = await Budget.findOne({ userId });
  const analysis = summarizeTransactions(transactions, budget);

  const expenses = transactions.filter((t) => t.type === "expense");
  const lastMonth = getMonthRange(1);
  const thisMonth = getMonthRange(0);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const lastMonthTx = filterByRange(transactions, lastMonth.start, lastMonth.end);
  const lastMonthExpenses = lastMonthTx.filter((t) => t.type === "expense");
  const lastMonthIncome = sumByType(lastMonthTx, "income");
  const lastMonthExpenseTotal = sumByType(lastMonthTx, "expense");

  const thisWeekExpenses = expenses.filter((t) => new Date(t.transactionDate) >= weekAgo);
  const foodThisWeek = thisWeekExpenses
    .filter((t) => /food|dining|restaurant|grocery/i.test(t.category || t.title || ""))
    .reduce((s, t) => s + t.amount, 0);

  const foodCategories = categoryTotals(
    expenses.filter((t) => /food|dining|restaurant|grocery/i.test(t.category || t.title || ""))
  );

  const context = {
    period: `Last ${DAYS_90} days`,
    transactionCount: transactions.length,
    currency: "INR",
    summary: {
      totalIncome: analysis.totalIncome,
      totalExpense: analysis.totalExpense,
      savings: analysis.savings,
      monthlyBudget: analysis.monthlyBudget,
      budgetRemaining: analysis.budgetRemaining,
      predictedExpense: analysis.predictedExpense,
    },
    topCategories: analysis.categoryBreakdown.slice(0, 10),
    monthlyTrend: analysis.monthlyTrend,
    lastMonth: {
      label: `${lastMonth.start.toLocaleString("default", { month: "long", year: "numeric" })}`,
      income: lastMonthIncome,
      expense: lastMonthExpenseTotal,
      savings: lastMonthIncome - lastMonthExpenseTotal,
      overspent: analysis.monthlyBudget > 0 && lastMonthExpenseTotal > analysis.monthlyBudget,
      amountOverBudget:
        analysis.monthlyBudget > 0
          ? Math.max(0, lastMonthExpenseTotal - analysis.monthlyBudget)
          : 0,
      topCategories: categoryTotals(lastMonthExpenses).slice(0, 5),
    },
    thisMonth: {
      income: sumByType(filterByRange(transactions, thisMonth.start, thisMonth.end), "income"),
      expense: sumByType(filterByRange(transactions, thisMonth.start, thisMonth.end), "expense"),
    },
    thisWeek: {
      foodSpend: foodThisWeek,
      totalExpense: thisWeekExpenses.reduce((s, t) => s + t.amount, 0),
    },
    foodSpending: {
      thisWeek: foodThisWeek,
      allTimeInPeriod: foodCategories.reduce((s, c) => s + c.amount, 0),
      byCategory: foodCategories.slice(0, 5),
    },
    recentTransactions: transactions.slice(0, 15).map((t) => ({
      title: t.title,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.transactionDate,
    })),
  };

  return { context, transactions, budget };
};

const formatINR = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const answerFromHeuristic = (question, context) => {
  const q = question.toLowerCase();
  const { summary, topCategories, lastMonth, thisWeek, foodSpending } = context;

  if (/top\s*3|three categor|highest categor|spending categor/.test(q)) {
    const top3 = topCategories.slice(0, 3);
    if (!top3.length) {
      return "I don't have enough expense data yet. Add some transactions and I'll break down your top categories.";
    }
    const list = top3.map((c, i) => `${i + 1}. **${c.category}** — ${formatINR(c.amount)}`).join("\n");
    return `Your top 3 spending categories (${context.period}):\n\n${list}`;
  }

  if (/food|dining|grocery|restaurant/.test(q) && /week|this week/.test(q)) {
    return `You spent **${formatINR(thisWeek.foodSpend)}** on food-related expenses this week. Total expenses this week: ${formatINR(thisWeek.totalExpense)}.`;
  }

  if (/food|dining|grocery/.test(q)) {
    const lines = foodSpending.byCategory.length
      ? foodSpending.byCategory.map((c) => `• ${c.category}: ${formatINR(c.amount)}`).join("\n")
      : "No food-related transactions found in this period.";
    return `Food spending in the last 90 days:\n\n${lines}\n\n**Total:** ${formatINR(foodSpending.allTimeInPeriod)}`;
  }

  if (/overspend|over budget|exceed/.test(q) && /last month|previous month/.test(q)) {
    if (lastMonth.overspent) {
      return `Yes — last month (**${lastMonth.label}**) you overspent by **${formatINR(lastMonth.amountOverBudget)}**. Expenses were ${formatINR(lastMonth.expense)} against a budget of ${formatINR(summary.monthlyBudget)}.`;
    }
    return `Last month (**${lastMonth.label}**) you stayed within budget. Expenses: ${formatINR(lastMonth.expense)}, budget: ${formatINR(summary.monthlyBudget)}.`;
  }

  if (/overspend|over budget/.test(q)) {
    if (summary.budgetRemaining < 0) {
      return `You're currently over budget by **${formatINR(Math.abs(summary.budgetRemaining))}** for this period. Consider reviewing your top category: **${topCategories[0]?.category || "N/A"}**.`;
    }
    return `You're within budget with **${formatINR(summary.budgetRemaining)}** remaining.`;
  }

  if (/savings|save/.test(q)) {
    return `Your savings for ${context.period}: **${formatINR(summary.savings)}** (Income ${formatINR(summary.totalIncome)} − Expenses ${formatINR(summary.totalExpense)}).`;
  }

  if (/income|earn/.test(q)) {
    return `Total income (${context.period}): **${formatINR(summary.totalIncome)}**. Last month: ${formatINR(lastMonth.income)}.`;
  }

  if (/expense|spend|spending/.test(q)) {
    const top = topCategories[0];
    return `Total expenses (${context.period}): **${formatINR(summary.totalExpense)}**. ${top ? `Largest category: **${top.category}** (${formatINR(top.amount)}).` : ""}`;
  }

  if (/budget/.test(q)) {
    return `Monthly budget: **${formatINR(summary.monthlyBudget)}**. Remaining: **${formatINR(summary.budgetRemaining)}**.`;
  }

  return `Here's a quick snapshot (${context.period}):\n\n• Income: ${formatINR(summary.totalIncome)}\n• Expenses: ${formatINR(summary.totalExpense)}\n• Savings: ${formatINR(summary.savings)}\n• Budget remaining: ${formatINR(summary.budgetRemaining)}\n\n${topCategories[0] ? `Top category: **${topCategories[0].category}** (${formatINR(topCategories[0].amount)})` : "Add transactions for detailed breakdowns."}\n\nAsk me about overspending, food costs, or your top categories!`;
};

const hasOpenAIKey = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && key !== "your_openai_key" && key !== "your_openai_api_key_here" && key.startsWith("sk-");
};

export const generateChatResponse = async (userId, message, history = []) => {
  const { context } = await buildSpendingContext(userId);
  const trimmedMessage = (message || "").trim();

  if (!trimmedMessage) {
    throw new Error("Message is required");
  }

  if (hasOpenAIKey()) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `You are FinanceAI, a helpful personal finance assistant. Answer questions using ONLY the user's spending data below. Be concise, friendly, and use INR (₹). If data is missing, say so clearly. Use bullet points when helpful.

USER SPENDING DATA (JSON):
${JSON.stringify(context, null, 2)}`;

      const historyMessages = (history || [])
        .filter((m) => m.role && m.content)
        .slice(-8)
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: trimmedMessage },
        ],
        temperature: 0.5,
        max_tokens: 600,
      });

      const reply = response.choices[0]?.message?.content?.trim();
      if (reply) {
        return { reply, provider: "openai", context };
      }
    } catch {
      // fall through to heuristic
    }
  }

  return {
    reply: answerFromHeuristic(trimmedMessage, context),
    provider: "heuristic",
    context,
  };
};
