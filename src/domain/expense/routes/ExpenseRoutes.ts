// src/domain/expense/routes/ExpenseRoutes.ts
import express from 'express';
import multer from 'multer';
import ExpenseController from '../controllers/ExpenseController';
import { authenticateJWT } from '../../../middleware/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), authenticateJWT, ExpenseController.upload);
router.get('/fetch/:id', authenticateJWT, ExpenseController.fetch);

export default router;

