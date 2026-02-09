import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as activityController from '../controllers/activityController.js';

const router = express.Router();

router.get("/activity", authMiddleware, activityController.getAllActivity);
router.get("/activity/:id", authMiddleware, activityController.getActivityById);
router.post("/activity", authMiddleware, activityController.createActivity);
router.post("/activityCreate", authMiddleware, activityController.create);
router.delete("/activity/:id", authMiddleware, activityController.deleteActivity); 
router.post("/activity/by-code", authMiddleware, activityController.createActivityByCode);

export default router;
