import { summarizeTransactions } from "./financeAnalyzer.js";

export const generateAIInsights = async ({ transactions, budget }) => {
  const analysis = summarizeTransactions(transactions, budget);

  // Try OpenAI if key exists
  const key = process.env.OPENAI_API_KEY;
  const hasKey = key && key !== "your_openai_api_key_here" && key.startsWith("sk-");

  if (hasKey) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: key });

      const prompt = `You are a personal finance advisor. Based on this data:
- Total Income: ₹${analysis.totalIncome}
- Total Expense: ₹${analysis.totalExpense}
- Savings: ₹${analysis.savings}
- Monthly Budget: ₹${analysis.monthlyBudget}
- Top category: ${analysis.categoryBreakdown[0]?.category || "N/A"} (₹${analysis.categoryBreakdown[0]?.amount || 0})

Return ONLY a JSON array of 4 short insight strings. No extra text.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 300,
      });

      const text = response.choices[0].message.content.trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      return {
        insights: parsed,
        provider: "openai",
        analysis,
      };
    } catch (err) {
      // Fall through to heuristic
    }
  }

  // Heuristic fallback (always works)
  return {
    insights: analysis.insights,
    provider: "heuristic",
    analysis,
  };
};

export const predictExpense = ({ transactions, budget }) => {
  const analysis = summarizeTransactions(transactions, budget);

  const confidence = Math.min(95, Math.max(55, 60 + transactions.length * 3));
  const budgetRisk = analysis.monthlyBudget > 0 &&
    analysis.predictedExpense > analysis.monthlyBudget;

  return {
    predictedExpense: analysis.predictedExpense,
    confidence,
    budgetRisk,
    monthlyBudget: analysis.monthlyBudget,
  };
};