Application Structure:
1. Setup Express.js server with Typescript.
2. Connect MongoDB database to the server.
3. Setup routes:
    a. POST /expense/upload:
        i. Accept customer email and PDF of bank statement, then upload to Cloudinary.
        ii. Retrieve and parse the text from the uploaded PDF.
        iii. intiate chatgpt with prompt
        iv. Make second prompt to analyze statement by sending the parsed text to GPT API with specific prompt for bank statement analysis,financial advice & scoring.
        v. Receive and process GPT response, update users & expense records in MongoDB.
        vi. Use the results from the financial advice & scoring step to formulate a 3rd GPT API query prompt.
        vii. Send the third prompt to GPT API for formatting the results.
        viii. Receive and process GPT response, update user's records in MongoDB.
        ix. Email the final results to the user.
    b. POST /auth/magiclink:
        i. Authenticate user with magic link.
    c. POST /auth/{token}:
        i. Verify auth token and allow access to gpt service.
4. Deploy application to AWS EC2 container.

Directory Structure:
src/
|-- config/
|   |-- cloudinary.ts
|   |-- mailgun.ts
|
|-- domain/
|   |-- user/
|       |-- models/
|           |-- User.ts
|       |-- services/
|           |-- UserService.ts
|       |-- controllers/
|           |-- UserController.ts
|       |-- routes/
|           |-- UserRoutes.ts
|
|-- application/
|   |-- auth/
|       |-- AuthController.ts
|       |-- AuthRoutes.ts
|
|-- config/
|   |-- cloudinary.ts
|   |-- mailgun.ts
|   |-- nodemailer.ts
|
|-- domain/
|   |-- expense/
|       |-- controllers/
|           |-- ExpenseController.ts
|       |-- models/
|           |-- Expense.ts
|           |-- Statement.ts
|       |-- routes/
|           |-- ExpenseRoutes.ts
|       |-- services/
|           |-- ExpenseService.ts
|   |-- user/
|       |-- controllers/
|           |-- UserController.ts
|       |-- models/
|           |-- User.ts
|       |-- routes/
|           |-- UserRoutes.ts
|       |-- services/
|           |-- UserService.ts
|
|-- middleware/
|   |-- auth.ts
|
|-- services/
|   |-- gpt4Service.ts
|   |-- pdfService.ts
|
|-- services/
|
|-- index.ts

