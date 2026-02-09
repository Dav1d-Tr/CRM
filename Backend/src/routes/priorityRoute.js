import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as priorityController from '../controllers/priorityController.js'

const router = express.Router();

router.get('/priority', authMiddleware, priorityController.getAllPriority);
router.post('/priority', authMiddleware, priorityController.createpriority);
router.put('/priority/:id', authMiddleware, priorityController.updatepriority);
router.delete('/priority/:id', authMiddleware, priorityController.deletepriority);
router.get('/priority/search', authMiddleware, priorityController.searchpriority); 
router.get('/priority/:id', authMiddleware, priorityController.getPriorityById); 

export default router;