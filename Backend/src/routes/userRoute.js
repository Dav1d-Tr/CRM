import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, userController.getAllUser);

// === PUBLICA REGISTRO ===
router.post('/', userController.createUser);
// =====================

router.put('/:id', authMiddleware, userController.updateUser);
router.put("/auth/reset-password", userController.resetPassword);
router.delete('/:id', authMiddleware, userController.deleteUser);

// === PUBLICA LOGIN ===
router.post("/auth/login", userController.login);
// =====================

router.get('/search', authMiddleware, userController.searchUser); 
router.get('/:id', authMiddleware, userController.getUserById);

export default router;
