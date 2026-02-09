import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as taskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/task', authMiddleware, taskController.getAllTask);
router.get('/task/lead/:leadId', authMiddleware, taskController.getTasksByLeadId);
router.patch("/task/:id/state", authMiddleware, taskController.toggleTaskState);
router.get('/task/:id', authMiddleware, taskController.getTaskById);
router.post('/task', authMiddleware, taskController.createTask);
router.put('/task/:id', authMiddleware, taskController.updateTask);
router.delete('/task/:id', authMiddleware, taskController.deleteTask);
router.get('/task/search', authMiddleware, taskController.searchTask);

export default router;
