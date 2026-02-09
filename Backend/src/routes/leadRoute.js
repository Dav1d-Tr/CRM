import express from "express";
import * as leadController from "../controllers/leadController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, leadController.getAllLead);
router.get("/:id/created-date", authMiddleware, leadController.getLeadCreatedDate);
router.get("/:id/stats", authMiddleware, leadController.getLeadStatsController);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.get("/:id/activity9-date", authMiddleware, leadController.getLeadActivity9DateController);
router.get("/:id/activity11-date", authMiddleware, leadController.getLeadActivity11DateController);
router.get("/stats/monthly", authMiddleware, leadController.getMonthlyLeadsController);
router.get("/metrics/time", authMiddleware, leadController.getLeadTimeMetricsController);
router.post("/", authMiddleware, leadController.createLead);
router.post("/import", leadController.importLeads);
router.put("/:id", authMiddleware, leadController.updateLead);
router.patch("/:id", authMiddleware, leadController.patchLead);
router.patch("/:id/state", authMiddleware, leadController.updateLeadState);
router.delete("/:id", authMiddleware, leadController.deleteLead);
router.get("/search", authMiddleware, leadController.searchLead);
router.get("/stats/revenue", authMiddleware, leadController.getRevenueStatsController);

export default router;
