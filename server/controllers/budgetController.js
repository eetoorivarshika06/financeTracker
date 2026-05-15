import Budget from "../models/Budget.js";

export const setBudget = async (req, res) => {
  try {
    const { monthlyBudget, categoryBudgets } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId },
      { monthlyBudget, categoryBudgets },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.userId });

    if (!budget) {
      return res.json({ success: true, budget: { monthlyBudget: 0, categoryBudgets: [] } });
    }

    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};