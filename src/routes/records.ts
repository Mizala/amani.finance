// src/routes/records.ts
import express from 'express';
import User from '../domain/user/models/User';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.json(user.records);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

export default router;
