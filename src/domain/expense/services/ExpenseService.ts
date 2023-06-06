import cloudinary from '../../../config/cloudinary';
import GPT4Service from '../../../services/gpt4Service';
import pdfService from '../../../services/pdfService';
import Expense from '../models/Expense';



class ExpenseService {
  async analyzeBankStatement(file: any, userId: string) {
    // Upload file to Cloudinary and get the URL
    const result = await cloudinary.v2.uploader.upload(file);
    const bankStatementUrl = result.url;
    // Parse the PDF document
    const bankStatementText = await pdfService.parsePdf(bankStatementUrl);

    // initiate a chat with gpt-4-32k
    // const chat = await GPT4Service.initiateChat();
    // Send bankStatementText to GPT-4 API for analysis
    const bankStatementAnalysis = await GPT4Service.analyzeBankStatement(bankStatementText);

    return bankStatementAnalysis;

    // // Send bankStatementAnalysis to GPT-4 API for financial advice and scoring
    // const financialAdviceAndScoring = await GPT4Service.getFinancialAdvice(bankStatementAnalysis);

    // // Send financialAdviceAndScoring to GPT-4 API for formatting
    // const formattedResults = await GPT4Service.formatResults(financialAdviceAndScoring);

    // // Save results to the database
    // const expense = new Expense({
    //   userId,
    //   bankStatementAnalysis,
    //   financialAdviceAndScoring,
    //   formattedResults
    // });

    // await expense.save();
    // return expense;
  }
}

export default new ExpenseService();
