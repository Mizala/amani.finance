// src/config/nodemailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL',
    pass: 'YOUR_PASSWORD'
  }
});

export default transporter;
