import express from "express";
import {
  generateInsights,
  getPrediction,
  chatWithAssistant,
  categorizeTransaction,
  batchCategorizeTransactions,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/insights", protect, generateInsights);
router.post("/predict", protect, getPrediction);
router.post("/chat", protect, chatWithAssistant);
router.post("/categorize/batch", protect, batchCategorizeTransactions);
router.post("/categorize", protect, categorizeTransaction);

export default router;