import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, required: true, default: false },
  otp: { type: String },
  otpExpiry: { type: Number },
  isPremium: { type: Boolean, required: true, default: false },
});

export const User = mongoose.model('User', userSchema);
