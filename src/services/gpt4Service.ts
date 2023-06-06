// src/services/gpt3Service.ts
import axios, {AxiosError} from 'axios';
const tectalicOpenai = require('@tectalic/openai').default;

class GPT4Service {
  private static endpoint = 'https://api.openai.com/v1/chat/completions';
  
  private static systemPrompt = [{
    role: 'assistant',
    content: `Hello! Hope you're doing well, I am your financial virtual assistant. Can you share your bank statement or a summary of your past 2 months income and expenses?
    With your bank statement, I'll do the following:
    1. Analyze your income and expenses.
    2. Categorize your expenses to see how you're spending.
    3. Determine the percentage of income used in each category.
    4. Study your spending patterns based on the categorized data.
    5. After the analysis, I'll score your financial efficiency/literacy out of 100. This score shows how effectively you're managing your money.
    6. Based on the analysis and your score, I'll offer tailored advice to help boost your savings. I'll also include a custom savings plan from Amani.finance, designed just for you.
    7. If you meet your savings goals with the Amani.finance plan, you can earn free health or device insurance. It's an extra perk to help you secure your financial future.
    Could you please share your bank statement or financial details so we can start the analysis?`, 
  }];
  
  private async sendRequest(messages: any[]) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
      };
      const response = await axios.post(GPT4Service.endpoint, {
        model: 'gpt-4',
        messages: messages,
      }, {
        headers: headers
      });

      if (response.data.choices.length > 0) {
        console.log('====================================');
        console.log(response.data.choices[0].message.content.trim());
        console.log('====================================');
        return response.data.choices[0].message.content.trim();
      } else {
        throw new Error('No choices received from the GPT-4 engine');
      }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError;
        if (serverError && serverError.response) {
          throw new Error(`Server responded with status code ${serverError.response.status}`);
        }
      }
      throw error;
    }
  }

  async initiateChat() : Promise <string> {
    // Send a request to the API to initiate a chat
    return this.sendRequest(GPT4Service.systemPrompt);
  }

  async chunkText(input: string) {
    const charLimit = 30000; // ~30000 tokens, if we assume 1 token ~ 4 characters
    let chunks: string[] = [];
    let i = 0;

    while (i < input.length) {
      let chunk = input.substring(i, i + charLimit);
      if (i + charLimit < input.length) {
          let lastSpaceIndex = chunk.lastIndexOf(" ");
          chunk = chunk.substring(0, lastSpaceIndex);
      }

      chunks.push(chunk);
      i += chunk.length;
    }

    return chunks;
  }


  async analyzeBankStatement(text: string)  {
    const chunkedText = await this.chunkText(text)
    // process message
    console.log('====================================');
    console.log(chunkedText);
    console.log('====================================');
    // Send a request to the API for analysis
    // return this.sendRequest(chunkedText);
  }

  async getFinancialAdvice(text: string) : Promise<string> {
    // Send a request to the API for financial advice
    return tectalicOpenai(process.env.OPENAI_API_KEY)
          .chatCompletions.create({
              model: 'gpt-4',
              messages: [{
                  role: 'user',
                  content: text,
              }
              ]
          })
          .then((response: { data: { choices: { message: { content: string; }; }[]; }; }) => {
              return response.data.choices[0].message.content.trim();
          });
  }

  async formatResults(text: string) : Promise<string> {
    // Send a request to the API for formatting
    return tectalicOpenai(process.env.OPENAI_API_KEY)
          .chatCompletions.create({
              model: 'gpt-4',
              messages: [{
                  role: 'user',
                  content: text,
              }
              ]
          })
          .then((response: { data: { choices: { message: { content: string; }; }[]; }; }) => {
              return response.data.choices[0].message.content.trim();
          });
  }
}

export default new GPT4Service();
