import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as activityTypeController from '../controllers/activityTypeController.js'

const router = express.Router();

router.get('/activityType', authMiddleware, activityTypeController.getAllActivityType);
router.post('/activityType', authMiddleware, activityTypeController.createActivityType);
router.put('/activityType/:id', authMiddleware, activityTypeController.updateactivityType);
router.delete('/activityType/:id', authMiddleware, activityTypeController.deleteActivityType);
router.get('/activityType/search', authMiddleware, activityTypeController.searchactivityType); 
router.get('/activityType/:id', authMiddleware, activityTypeController.getactivityTypeById); 

export default router;