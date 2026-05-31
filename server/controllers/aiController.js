import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { generateAIInsights, predictExpense } from "../services/aiService.js";
import { generateChatResponse } from "../services/chatService.js";
import {
  categorizeMerchant,
  batchCategorizeUserTransactions,
} from "../services/categorizeService.js";

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

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await generateChatResponse(req.userId, message, history);

    res.status(200).json({
      success: true,
      reply: result.reply,
      provider: result.provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const categorizeTransaction = async (req, res) => {
  try {
    const { merchantName, merchant, amount } = req.body;
    const name = merchantName ?? merchant ?? "";

    if (!String(name).trim()) {
      return res.status(400).json({ message: "merchantName is required" });
    }

    const result = await categorizeMerchant(name, Number(amount) || 0);

    res.status(200).json({
      success: true,
      category: result.category,
      provider: result.provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const batchCategorizeTransactions = async (req, res) => {
  try {
    const result = await batchCategorizeUserTransactions(req.userId);

    res.status(200).json({
      success: true,
      updated: result.updated,
      total: result.total,
      message: `Re-categorized ${result.updated} of ${result.total} transactions`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};