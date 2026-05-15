import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  monthlyBudget: { type: Number, default: 0 },
  categoryBudgets: [
    {
      category: String,
      limit: Number
    }
  ]
}, { timestamps: true });

export default mongoose.model("Budget", budgetSchema);