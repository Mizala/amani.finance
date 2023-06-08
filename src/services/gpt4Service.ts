// src/services/gpt4Service.ts
import axios, {AxiosError} from 'axios';

class GPT4Service {
  private static endpoint = 'https://api.openai.com/v1/chat/completions';
  
  private static systemPrompt = {
    role: 'user',
    content: `You are my financial virtual assitant, and here's your workflow
    1. request for the content of my bank statement via text 
    2. analyzes expenses off bank statements that i provide you via text, 
    3. categorize my expenses and show how much & percentage of my income consumed per category,
    4. anaylze my spending behavior/pattern using the categorized data
    5. Based on your analysis, you would score my finances/my financial efficiency/literacy out of 100
    6. and then you would offer personalized financial advice on how to improve my savings`, 
  };

  private static resultFormatPrompt = {
    role: 'user',
    content: `you would restructure your answer like the following example, but ensure to use figures from previous response and tailor your advice to their finances based on the available data:  
    "Hey there! 🎉 Thanks for sharing your statement with us here at Mizala. We've crunched the numbers, and here's the scoop on your spending habits.
    We see you're a big fan of digital services like Amazon and Netflix – they make up a considerable chunk of your expenses. We also noticed some expenses on food & dining (Walmart, Uber, Starbucks) and a significant payment for your rent.
    Now, let's talk about the elephant in the room 🐘 Your expenses are somewhat outpacing your income right now. But it's something we need to address to get you on a sound financial footing.
    So, we've done a bit of math and we've got your Financial Literacy & Efficiency Score: 60 out of 100. Here's a breakdown:
    Income management: Your income from XYZ Corp is impressive, but it's currently being overtaken by your expenses.
    Expense management: You're spending significantly on digital services and rent. Maybe we can find you some deals or negotiate better rates?
    Savings and investment: We're not seeing any savings or investments. Don't worry, we can help you get started.
    Here are our recommendations:
    Boost your income: Can you expand your income sources or negotiate a better contract?
    Trim those expenses: Let's examine your spending and find areas to cut back.
    Kickstart your savings: Balance your income and expenses to start a savings plan. Let's aim for saving 20% of your income.
    Maximize your moolah: Let's see how we can make your money work harder for you.
    Also, you could save more by allocating [***your recommendation for a savings goal based on their disposable income***] towards a fixed savings target by Mizala and earn free health insurance. Or save ₦350 monthly to get our personal bundle which provides insurance for your health and device, alongside saving your money, and allowing you to withdraw without penalties. Click on the button below to get started."`
  }
  
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
        console.log(response.data.choices[0].message);
        console.log('====================================');
        return response.data.choices[0].message;
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

  async initiateChat() : Promise <object> {
    // Send a request to the API to initiate a chat
    return this.sendRequest([GPT4Service.systemPrompt]);
  }

  async chunkText(input: string, limit: number = 4000) {
    const charLimit = limit; // ~30000 tokens, if we assume 1 token ~ 4 characters
    let chunks: string[] = [];

    while (input.length > 0) {
      let chunk = input.slice(0, charLimit);

      // Find the last space within charLimit
      let lastSpaceIndex = chunk.lastIndexOf(" ");

      // If we found a space then break the chunk there.
      if (lastSpaceIndex != -1) {
          chunk = chunk.substring(0, lastSpaceIndex);
      } 
      // If we didn't find a space it means a single word is longer than charLimit.
      // In this case, we must cut off the word after charLimit
      else if (input.length > charLimit) {
          chunk = chunk.substring(0, charLimit);
      }

      chunks.push(chunk);
      input = input.slice(chunk.length).trim(); // update the input
    }

    return chunks[0];
  }


  async analyzeBankStatement(text: string, prevResponse: object) : Promise <object> {
    const chunkedText = await this.chunkText(text)
    const message = [GPT4Service.systemPrompt, prevResponse, 
        {
          role: 'user',
          content: chunkedText.trim(),
        }
    ]
    // Send a request to the API for analysis
    return this.sendRequest(message);
  }

  async formatResults(prevResponse: object) : Promise<object> {
    const message = [GPT4Service.systemPrompt, prevResponse, GPT4Service.resultFormatPrompt]
    // Send a request to the API for analysis
    return this.sendRequest(message);
  }
}

export default new GPT4Service();
