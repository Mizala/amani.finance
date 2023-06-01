import { Request, Response } from 'express';
import { User } from '../models/userModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendOtp } from '../services/emailService';
import mailgun from 'mailgun-js';

interface MyJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  expirationDate: Date;
}

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  });

export async function register(req: Request, res: Response) {
  const { email } = req.body;

  // Check if the email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Create a new user
  const user = new User({ email });
  await user.save();

  // Send OTP to the user's email
  const otp = await generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
  await user.save();

  await sendOtp(email, otp);

  res.status(201).json({ message: 'User created, OTP sent' });
}

export async function login(req: Request, res: Response) {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Generate a JWT for the user
  const token = jwt.sign({ userId: user._id, email: user.email, expirationDate: (new Date().getHours() + 1) }, 'your-secret-key');

  // Send magic link to the user's email
  const magicLink = `http://localhost:3000/account?token=${token}`;
  await sendOtp(email, magicLink);

  res.json({ message: 'Magic link sent' });
}

export async function verifyOtp(req: Request, res: Response) {
  const { email, otp } = req.body;

  // Check if the user exists and the OTP is valid
  const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Clear the OTP
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'OTP verified' });
}

export async function verifyToken(req: Request, res: Response) {
  const { token } = req.query;

  if (!token) {
    return res.status(403).json({ message: "Can't verify user." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token as string, 'your-secret-key') as MyJwtPayload;
  } catch {
    return res.status(403).json({ message: "Invalid auth credentials." });
  }

  if (!decoded.hasOwnProperty("userId") || !decoded.hasOwnProperty("expirationDate")) {
    return res.status(403).json({ message: "Invalid auth credentials." });
  }

  const { expirationDate } = decoded;
  if (expirationDate < new Date()) {
    return res.status(403).json({ message: "Token has expired." });
  }

  res.status(200).json({ message: "User has been validated." });
}

async function generateOtp(): Promise<string> {
  // Generate a 6 digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}
