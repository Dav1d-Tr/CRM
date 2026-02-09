import express from "express";
import * as commentController from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/comment/lead/:leadId", authMiddleware, commentController.getCommentsByLeadId);
router.post("/comment", authMiddleware, commentController.createComment);
router.put("/comment/:id", authMiddleware, commentController.updateComment);
router.delete("/comment/:id", authMiddleware, commentController.deleteComment);

export default router;
