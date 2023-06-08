// src/domain/expense/models/Expense.ts
import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bankStatementUrl: {
    type: String,
    required: true
  },
  bankStatementAnalysis: Object,
  financialAdviceAndScoring: Object,
  formattedResults: Object
});

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;
