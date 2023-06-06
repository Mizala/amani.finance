// src/application/auth/AuthRoutes.ts
import express from 'express';
import AuthController from './AuthController';

const router = express.Router();

router.post('/magiclink', AuthController.sendMagicLink);
router.get('/:token', AuthController.verifyMagicLink);

export default router;
