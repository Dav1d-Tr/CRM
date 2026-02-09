import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as stateController from '../controllers/stateController.js'

const router = express.Router();

router.get('/state', authMiddleware, stateController.getAllState);
router.post('/state', authMiddleware, stateController.createState);
router.put('/state/:id', authMiddleware, stateController.updateState);
router.delete('/state/:id', authMiddleware, stateController.deleteState);
router.get('/state/search', authMiddleware, stateController.searchState); 
router.get('/state/:id', authMiddleware, stateController.getStateById); 

export default router;