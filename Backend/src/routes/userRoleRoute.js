import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as userRoleController from '../controllers/userRoleController.js'

const router = express.Router();

// === PUBLICA LOGIN ===
router.get('/userRole', userRoleController.getAlluserRoles);
// =====================

router.post('/userRole', authMiddleware, userRoleController.createuserRole);
router.put('/userRole/:id', authMiddleware, userRoleController.updateuserRole);
router.delete('/userRole/:id', authMiddleware, userRoleController.deleteuserRole);
router.get('/userRole/search', authMiddleware, userRoleController.searchuserRoles); 
router.get('/userRole/:id', authMiddleware, userRoleController.getuserRoleById); 

export default router;