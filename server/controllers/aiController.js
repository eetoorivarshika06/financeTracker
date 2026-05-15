import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { generateAIInsights, predictExpense } from "../services/aiService.js";

export const generateInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId });

    const result = await generateAIInsights({ transactions, budget });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrediction = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId });

    const result = predictExpense({ transactions, budget });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};