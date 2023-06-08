// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './domain/user/routes/UserRoutes';
import authRoutes from './application/auth/AuthRoutes';
import expenseRoutes from './domain/expense/routes/ExpenseRoutes';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
// import { router } from 'bull-board'
import {analysisWorker, analysisQueue} from './services/queueService';

require('dotenv').config();

const app = express();

// setup queue server & board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(analysisQueue)],
  serverAdapter: serverAdapter,
});
// end queue server & board setup

app.use(cors());
app.use(express.json());
app.use('/admin/queues', serverAdapter.getRouter());

// Validate that JWT_SECRET is set
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not set in the environment variables.');
}

mongoose.connect('mongodb://localhost:27017/amani')
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/expense', expenseRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
