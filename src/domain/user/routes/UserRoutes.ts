// src/domain/user/routes/UserRoutes.ts
import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/records', UserController.getRecords);

export default router;
