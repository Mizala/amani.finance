// src/domain/user/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  records: [
    {
      date: Date,
      bankStatementAnalysis: Object,
      financialAdviceAndScoring: Object,
      formattedResults: Object,
    },
  ],
});

const User = mongoose.model('User', UserSchema);

export default User;
