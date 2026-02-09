import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/category", authMiddleware, categoryController.getAllCategories);
router.post("/category", authMiddleware, categoryController.createCategory);
router.put("/category/:id", authMiddleware, categoryController.updateCategory);
router.delete("/category/:id", authMiddleware, categoryController.deleteCategory);
router.get("/category/search", authMiddleware, categoryController.searchCategory);
router.get("/category/:id", authMiddleware, categoryController.getCategoryById);

export default router;
