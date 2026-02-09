import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as countryController from '../controllers/countryController.js'

const router = express.Router();

router.get('/', authMiddleware, countryController.getAllCountrys);
router.get('/stats/customers', authMiddleware, countryController.getCountryStats);
router.post('/', authMiddleware, countryController.createCountry);
router.put('/:id', authMiddleware, countryController.updateCountry);
router.delete('/:id', authMiddleware, countryController.deleteCountry);
router.get('/search', authMiddleware, countryController.searchCountry); 
router.get('/:id', authMiddleware, countryController.getCountryById);
router.get("/stats/customers", authMiddleware, countryController.getCustomerCountByCountry);

export default router;