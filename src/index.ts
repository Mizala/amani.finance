// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './domain/user/routes/UserRoutes';
import authRoutes from './application/auth/AuthRoutes';
import expenseRoutes from './domain/expense/routes/ExpenseRoutes';
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

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
