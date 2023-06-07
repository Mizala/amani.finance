import cloudinary from '../../../config/cloudinary';
import GPT4Service from '../../../services/gpt4Service';
import pdfService from '../../../services/pdfService';
import UserService from '../../user/services/UserService';
import Expense from '../models/Expense';
import Statement from '../models/Statement';



class ExpenseService {
  async analyzeBankStatement(file: any, userId: string) {
    // fetch user from database
    const user = await UserService.getUserByEmail(userId);

    // if user is not found, throw an error
    if (!user) {
      throw new Error("User not found");
    }
    // Upload file to Cloudinary and get the URL
    const result = await cloudinary.v2.uploader.upload(file);
    const bankStatementUrl = result.url;
    // Parse the PDF document
    const bankStatementText = await pdfService.parsePdf(bankStatementUrl);

    // initiate a chat with GPT-4 API
    const chat = await GPT4Service.initiateChat();
    // Send bankStatementText to GPT-4 API for analysis, financial advice and scoring
    const bankStatementAnalysis = await GPT4Service.analyzeBankStatement(bankStatementText, chat);

    // Send financialAdviceAndScoring to GPT-4 API for formatting
    const formattedResults = await GPT4Service.formatResults(bankStatementAnalysis);

    // save bankstatmenent to database
    const records = new Statement({
        userId: user._id,
        bankStatementUrl,
    });

    // Save results to the database
    const expense = new Expense({
      userId: user._id,
      bankStatementAnalysis,
      formattedResults
    });

    await records.save();
    await expense.save();
    return expense;
  }
}

export default new ExpenseService();
