// src/routes/upload.ts
import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import axios from 'axios';
import User from '../domain/user/models/User'
import cloudinary from '../config/cloudinary';
import transporter from '../config/nodemailer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// router.post('/', upload.single('file'), async (req, res) => {
//   try {
//     // File upload
//     const { originalname, path } = req.file;
//     const result = await cloudinary.v2.uploader.upload(path, { resource_type: 'raw' });

//     // PDF text extraction
//     const dataBuffer = fs.readFileSync(path);
//     const data = await pdfParse(dataBuffer);
//     fs.unlinkSync(path); // delete local file

//     // GPT-4 API
//     const gptResponse1 = await axios.post('https://api.openai.com/v4/completions', {
//       prompt: data.text, // prompt for bank statement analysis
//       // other necessary parameters
//     }, {
//       headers: {
//         'Authorization': 'Bearer YOUR_GPT_API_KEY',
//       },
//     });

//     const gptResponse2 = await axios.post('https://api.openai.com/v4/completions', {
//       prompt: gptResponse1.data.choices[0].text, // prompt for financial advice & scoring
//       // other necessary parameters
//     }, {
//       headers: {
//         'Authorization': 'Bearer YOUR_GPT_API_KEY',
//       },
//     });

//     const gptResponse3 = await axios.post('https://api.openai.com/v4/completions', {
//       prompt: gptResponse2.data.choices[0].text, // prompt for result formatting
//       // other necessary parameters
//     }, {
//       headers: {
//         'Authorization': 'Bearer YOUR_GPT_API_KEY',
//       },
//     });

//     // MongoDB update
//     const record = {
//       date: new Date(),
//       bankStatementAnalysis: gptResponse1.data.choices[0].text,
//       financialAdviceAndScoring: gptResponse2.data.choices[0].text,
//       formattedResults: gptResponse3.data.choices[0].text,
//     };

//     const user = await User.findOneAndUpdate(
//       { email: req.body.email },
//       { $push: { records: record } },
//       { new: true, upsert: true }
//     );

//     // Send email
//     const mailOptions = {
//       from: 'YOUR_EMAIL',
//       to: user.email,
//       subject: 'Expense Analysis and Financial Advice',
//       text: gptResponse3.data.choices[0].text
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });

//     res.json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Server error');
//   }
// });

export default router;
