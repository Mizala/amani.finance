// src/domain/expense/models/Expense.ts
import mongoose from 'mongoose';

const StatementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bankStatementUrl: {
    type: String,
    required: true
  },
});

const Statement = mongoose.model('Statement', StatementSchema);

export default Statement;
