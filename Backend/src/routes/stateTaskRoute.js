import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as stateTaskController from '../controllers/stateTaskController.js'

const router = express.Router();

router.get('/stateTask', authMiddleware, stateTaskController.getAllStateTask);
router.post('/stateTask', authMiddleware, stateTaskController.createStateTask);
router.put('/stateTask/:id', authMiddleware, stateTaskController.updateStateTask);
router.delete('/stateTask/:id', authMiddleware, stateTaskController.deleteStateTask);
router.get('/stateTask/search', authMiddleware, stateTaskController.searchStateTask); 
router.get('/stateTask/:id', authMiddleware, stateTaskController.getStateTaskById); 

export default router;