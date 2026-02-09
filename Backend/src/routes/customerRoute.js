import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

router.get('/', authMiddleware, customerController.getAllCustomer);
router.post('/', authMiddleware, customerController.createCustomer);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.patch('/:id', authMiddleware, customerController.patchCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);
router.get('/search', authMiddleware, customerController.searchCustomer); 
router.get('/:id', authMiddleware, customerController.getCustomerById);

export default router;
