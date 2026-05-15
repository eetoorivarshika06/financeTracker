import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { summarizeTransactions } from "../services/financeAnalyzer.js";

export const getMonthlyReport = async (req, res) => {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      userId: req.userId,
      transactionDate: { $gte: start, $lt: end },
    }).sort({ transactionDate: -1 });

    const budget = await Budget.findOne({ userId: req.userId });
    const summary = summarizeTransactions(transactions, budget);

    res.status(200).json({
      success: true,
      year,
      month,
      ...summary,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};