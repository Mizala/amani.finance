// src/domain/expense/controller/ExpenseController.ts
import cloudinary from '../../../config/cloudinary';
import GPT4Service from '../../../services/gpt4Service';
import UserService from '../../user/services/UserService';
import Expense from '../models/Expense';
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

      // Include sarcastic/fun response for the user
      const sarcasticResponse = await GPT4Service.sarcasticResponse(formattedResults);
      
      // Save results to the database
      const expense = new Expense({
        userId: user._id,
        bankStatementUrl,
        bankStatementAnalysis,
        formattedResults,
        sarcasticResponse
      });
      await expense.save();
      
      // Send email to user
      await this.sendEmail(user.email, expense._id);

      return expense;
    } catch (error) {
      throw error;
    }
  } 

  async getExpense(id: string) {
    try {
      const expense = await Expense.findById(id);
      return expense;
    } catch (error) {
      throw error;
    }
  }
  
  async sendEmail(email: string, expense: any): Promise<boolean> {
    const emailUrl = process.env.EMAIL_BASE_URL;
    try {
      const resultUrl = process.env.APP_URL + '/expense/' + expense;
      const sendEmail = await axios.post(`${emailUrl}/v1/emails/template`, {
        "template": "default",
        "subject": "Your ChatGPT Expense Analysis Result Is Here",
        "from": "noreply@amani.finance",
        "recipients": [
          email
        ],
        "data": {
          "salutation": "Hey there 🎉,",
          "message": [    
            `<p style="font-size: 16px;">Your bank statement has been successfully analyzed by ChatGPT. The insights from your statement are now ready for you to view.</p> <br/>`,
            `<p style="font-size: 16px;">Please click the button below to view the results:</p> <br/>`,
            `<div style="display: flex; margin:auto; justify-content: center;"><a href="${resultUrl}" style="display: inline-block; padding: 10px 20px; font-size: 20px; cursor: pointer; text-align: center; text-decoration: none; outline: none; color: #fff; background-color: #322074; border: none; border-radius: 10px; box-shadow: 0 5px #999;">View Results</a></div> <br/>`,
            `<p style="font-size: 16px;">you can copy the link to access it directly: ${resultUrl}</p> <br/>`,
            `<p style="font-size: 16px;">Best regards,</p> <br/>`,
            `<p style="font-size: 16px;">Mizala Team</p>`,
          ]
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
