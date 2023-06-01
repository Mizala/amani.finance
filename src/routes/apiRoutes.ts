import { Router } from 'express';
import { uploadPdf } from '../controllers/uploadController';
import { validateTokens, analyzeStatement } from '../controllers/statementController';
import { register, login, val } from '../controllers/authController';

const router = Router();

router.post('/upload', uploadPdf);
router.post('/validate', validateTokens);

export default router;
