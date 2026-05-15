import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, title, amount, category, paymentMethod, description, transactionDate } = req.body;

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      title,
      amount,
      category,
      paymentMethod,
      description,
      transactionDate
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ transactionDate: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};