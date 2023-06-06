Application Structure:
1. Setup Express.js server with Typescript.
2. Connect MongoDB database to the server.
3. Setup routes:
    a. POST /upload:
        i. Authenticate user with magic link.
        ii. Accept PDF of bank statement and upload to Cloudinary.
        iii. Retrieve and parse the text from the uploaded PDF.
        iv. Send the parsed text to GPT API with specific prompt for bank statement analysis.
        v. Receive and process GPT response, save results in MongoDB under user's records.
        vi. Use the results from bank statement analysis to formulate a second GPT API query prompt.
        vii. Send the second prompt to GPT API for financial advice & scoring step.
        viii. Receive and process GPT response, update user's records in MongoDB.
        ix. Use the results from the financial advice & scoring step to formulate a third GPT API query prompt.
        x. Send the third prompt to GPT API for formatting the results.
        xi. Receive and process GPT response, update user's records in MongoDB.
        xii. Email the final results to the user.
    b. GET /records:
        i. Authenticate user with magic link.
        ii. Retrieve user's past analysis and advice records from MongoDB.
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
|-- middleware/
|   |-- auth.ts
|
|-- index.ts

