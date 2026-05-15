import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { summarizeTransactions } from "../services/financeAnalyzer.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ transactionDate: -1 });
    const budget = await Budget.findOne({ userId: req.userId });

    const summary = summarizeTransactions(transactions, budget);

    const recentTransactions = transactions.slice(0, 5);

    res.status(200).json({
      success: true,
      ...summary,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};