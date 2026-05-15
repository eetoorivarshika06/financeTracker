import express from "express";
import { generateInsights, getPrediction } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/insights", protect, generateInsights);
router.post("/predict", protect, getPrediction);

export default router;