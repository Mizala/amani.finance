// src/config/mailgun.ts
import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || 'YOUR_MAILGUN_API_KEY',
  domain: process.env.MAILGUN_DOMAIN || 'YOUR_MAILGUN_DOMAIN',
});

export default mg;
