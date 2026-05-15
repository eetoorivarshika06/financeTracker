import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  title: String,
  amount: Number,
  category: String,
  paymentMethod: String,
  description: String,
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);