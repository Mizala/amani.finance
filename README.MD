# Amani.Finance

A ChatGPT based financial assistant and expense manager

## Application Structure

This application is built with TypeScript and uses Express.js as its server. It connects to a MongoDB database and includes a variety of routes and services. The application is deployed to an AWS EC2 container.

## Setup

- Express.js server with TypeScript
- MongoDB database

## Routes

- `POST /expense/upload`:
  1. Accept customer email and PDF of bank statement, then upload to Cloudinary
  2. Retrieve and parse the text from the uploaded PDF
  3. Initiate chatgpt with prompt
  4. Make second prompt to analyze statement by sending the parsed text to GPT API with specific prompt for bank statement analysis, financial advice & scoring
  5. Receive and process GPT response, update users & expense records in MongoDB
  6. Use the results from the financial advice & scoring step to formulate a 3rd GPT API query prompt
  7. Send the third prompt to GPT API for formatting the results
  8. Receive and process GPT response, update user's records in MongoDB
  9. Email the final results to the user
- `POST /auth/magiclink`:
  1. Authenticate user with magic link
- `POST /auth/{token}`:
  1. Verify auth token and allow access to gpt service

## Directory Structure

```bash
|src/
|-- config/
|   |-- cloudinary.ts
|   |-- mailgun.ts
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
|   |-- queueService.ts
|
|-- index.ts
```