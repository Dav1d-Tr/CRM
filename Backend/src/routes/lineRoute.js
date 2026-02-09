import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as lineController from '../controllers/lineController.js'

const router = express.Router();

router.get('/line', authMiddleware, lineController.getAllLine);
router.post('/line', authMiddleware, lineController.createline);
router.put('/line/:id', authMiddleware, lineController.updateline);
router.delete('/line/:id', authMiddleware, lineController.deleteline);
router.get('/line/search', authMiddleware, lineController.searchline); 
router.get('/line/:id', authMiddleware, lineController.getLineById); 

export default router;
