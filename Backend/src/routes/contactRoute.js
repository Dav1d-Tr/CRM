import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as contactController from '../controllers/contactController.js';

const router = express.Router();

router.get('/contact', authMiddleware, contactController.getAllContact);
router.get('/contact/:id', authMiddleware, contactController.getContactById);
router.get("/contact/customer/:customerId/all", authMiddleware, contactController.getContactsByCustomerId);
router.get("/contact/customer/:customerId", authMiddleware, contactController.getContactByCustomerId);
router.post('/contact', authMiddleware, contactController.createContact);
router.put('/contact/:id', authMiddleware, contactController.updateContact);
router.patch('/contact/:id', authMiddleware, contactController.patchContact);
router.delete('/contact/:id', authMiddleware, contactController.deleteContact);
router.get('/contact/search', authMiddleware, contactController.searchContact);

export default router;
