import express from "express";
import { setBudget, getBudget, updateBudget } from "../controllers/budgetController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudget);
router.put("/", protect, updateBudget);

export default router;