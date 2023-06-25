// src/domain/expense/controller/ExpenseController.ts
import { Request, Response } from 'express';
import { analysisQueue } from '../../../services/queueService';
import ExpenseService from '../services/ExpenseService';
import fs from 'fs';

class ExpenseController {
  async upload(req: Request, res: Response) {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Add a new job to the queue
      await analysisQueue.add('analysis', {
        filePath: uploadedFile.path,
        email: req.body.email
      });
      
      res.status(200).json({ message: 'Bank statement analysis in progress. You will receive an email with your results soon.' });

    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async fetch(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await ExpenseService.getExpense(id);
        res.status(200).json({
            message: 'Bank statement analysis fetched successfully',
            data: result
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
  
}

export default new ExpenseController();
