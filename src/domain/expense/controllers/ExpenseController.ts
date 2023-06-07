// src/domain/expense/controller/ExpenseController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import ExpenseService from '../services/ExpenseService';

class ExpenseController {
  async upload(req: Request, res: Response) {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const expense = await ExpenseService.analyzeBankStatement(uploadedFile.path, req.body.email);

      fs.unlink(uploadedFile.path, (err) => {
        if (err) throw err;
        console.log('Temporary file deleted');
      });

      res.status(200).json(expense);
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
}

export default new ExpenseController();
