import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as cityController from '../controllers/cityController.js'

const router = express.Router();

router.get('/city', authMiddleware, cityController.getAllCitys);
router.post('/city', authMiddleware, cityController.createCity);
router.put('/city/:id', authMiddleware, cityController.updateCity);
router.delete('/city/:id', authMiddleware, cityController.deleteCity);
router.get('/city/search', authMiddleware, cityController.searchCity); 
router.get('/city/:id', authMiddleware, cityController.getCityById);

export default router;