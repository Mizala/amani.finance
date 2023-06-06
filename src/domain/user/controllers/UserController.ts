// src/domain/user/controllers/UserController.ts
import UserService from '../services/UserService';
import { Request, Response } from 'express';

class UserController {
  async getRecords(req: Request, res: Response) {
    try {
      const user = await UserService.getUserByEmail(req.body.email);
      if (user) {
        res.json(user.records);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
}

export default new UserController();
