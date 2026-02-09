import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as originController from '../controllers/originController.js'

const router = express.Router();

router.get('/origin', authMiddleware, originController.getAllOrigin);
router.post('/origin', authMiddleware, originController.createorigin);
router.put('/origin/:id', authMiddleware, originController.updateorigin);
router.delete('/origin/:id', authMiddleware, originController.deleteorigin);
router.get('/origin/search', authMiddleware, originController.searchorigin); 
router.get('/origin/:id', authMiddleware, originController.getOriginById); 

export default router;