// src/domain/expense/controller/ExpenseController.ts
import cloudinary from '../../../config/cloudinary';
import GPT4Service from '../../../services/gpt4Service';
import UserService from '../../user/services/UserService';
import Expense from '../models/Expense';
import Statement from '../models/Statement';
import axios from 'axios';
import PdfParse from 'pdf-parse';
import fs from 'fs';

class ExpenseService {
  async analyzeBankStatement(file: any, userId: string) {
    try {
      // fetch user from database
      const user = await UserService.getUserByEmail(userId);
      
      // if user is not found, throw an error
      if (!user) {
        throw new Error("User not found");
      }
      // Upload file to Cloudinary and get the URL
      const result = await cloudinary.v2.uploader.upload(file);
      const bankStatementUrl = result.url;
      // Delete the file from the uploads folder
      fs.unlink(file, (err) => {
        if (err) throw err;
        console.log('Temporary file deleted');
      });
      // Parse the PDF document
      const bankStatementText = await this.parsePdf(bankStatementUrl);
      
      // initiate a chat with GPT-4 API
      const chat = await GPT4Service.initiateChat();
      // Send bankStatementText to GPT-4 API for analysis, financial advice and scoring
      const bankStatementAnalysis = await GPT4Service.analyzeBankStatement(bankStatementText, chat);
      
      // Send financialAdviceAndScoring to GPT-4 API for formatting
      const formattedResults = await GPT4Service.formatResults(bankStatementAnalysis);
      
      // Save results to the database
      const expense = new Expense({
        userId: user._id,
        bankStatementUrl,
        bankStatementAnalysis,
        formattedResults
      });
      await expense.save();
      
      // Send email to user
      await this.sendEmail(user.email, expense.formattedResults.content);

      return expense;
    } catch (error) {
      throw error;
    }
  }
  
  async sendEmail(email: string, content: string): Promise<boolean> {
    const emailUrl = process.env.EMAIL_BASE_URL;
    try {
      const sendEmail = await axios.post(`${emailUrl}/v1/emails/template`, {
        "template": "default",
        "subject": "Your ChatGPT Expense Analysis Result Is Here",
        "from": "noreply@amani.finance",
        "recipients": [
          email
        ],
        "data": {
          "salutation": "Hello,",
          "message": [content]
        }
      }, { headers: {'source': 'internal'}})
      // check if the response has data and that it isn't an error object
      if (sendEmail.data && sendEmail.data.error) {
        console.log(sendEmail.data.error);
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  async parsePdf(pdfUrl: string) {
    const pdf = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const data = await PdfParse(pdf.data);
    return data.text;
  }
}

export default new ExpenseService();
