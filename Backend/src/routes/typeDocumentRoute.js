import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as typeDocumentController from '../controllers/typeDocumentController.js'

const router = express.Router();

// === PUBLICA LOGIN ===
router.get('/typeDocument', typeDocumentController.getAllTypeDocuments);
// =====================

router.post('/typeDocument', authMiddleware, typeDocumentController.createTypeDocument);
router.put('/typeDocument/:id', authMiddleware, typeDocumentController.updateTypeDocument);
router.delete('/typeDocument/:id', authMiddleware, typeDocumentController.deleteTypeDocument);
router.get('/typeDocument/search', authMiddleware, typeDocumentController.searchTypeDocuments); 
router.get('/typeDocument/:id', authMiddleware, typeDocumentController.getTypeDocumentById); 

export default router;