import express from "express";
import { getMonthlyReport } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/monthly", protect, getMonthlyReport);

export default router;