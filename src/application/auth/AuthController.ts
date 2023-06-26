// src/application/auth/AuthController.ts
import jwt from 'jsonwebtoken';
import UserService from '../../domain/user/services/UserService';
import { Request, Response } from 'express';
import validator from 'validator';
import axios from 'axios';

class AuthController {
  async sendMagicLink(req: Request, res: Response) {
    const { email } = req.body;
    const emailUrl = process.env.EMAIL_BASE_URL;
    // Validate the email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    try {
      let user = await UserService.getUserByEmail(email);

      if (!user) {
        user = await UserService.createUserByEmail(email);
      }

      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'undefined', { expiresIn: '24h' });
      const loginUrl = process.env.FRONT_END_URL + '/verify-user?token=' + token;
      const sendEmail = await axios.post(`${emailUrl}/v1/emails/template`, {
        "template": "default",
        "subject": "Your ChatGPT Financial Advisor Magic Link",
        "from": "noreply@amani.finance",
        "recipients": [
           email
        ],
        "data": {
            "salutation": "Hello,",
            "message": [
                `<p style="font-size: 16px;">As requested, here is your magic link to sign in to Amani.Finance, yout GPT based financial advisors. </p> <br/>`,
                `<p style="font-size: 16px;">Please click the button below to login:</p> <br/>`,
                `<div style="display: flex; margin:auto; justify-content: center;"><a href='${loginUrl}' style="display: inline-block; padding: 10px 20px; font-size: 20px; cursor: pointer; text-align: center; text-decoration: none; outline: none; color: #fff; background-color: #322074; border: none; border-radius: 10px; box-shadow: 0 5px #999;">Login<a></div><br/>`,
                `<p style="font-size: 16px;">you can copy the link here to access it directly: ${loginUrl}</p> <br/>`,
                `<p style="font-size: 16px;">Please note that this magic link will expire in 1 hour. </p><br/>`,
                `<p style="font-size: 16px;"> If you did not request this magic link, please ignore this email. </p><br/>`,
            ]
        }
      }, { headers: {'source': 'internal'}})
      // check if the response has data and that it isn't an error object
      if (sendEmail.data && sendEmail.data.error) {
        console.log(sendEmail.data.error);
        return res.status(500).send('Server error');
      }
      res.json({ message: 'Magic link sent!' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }

  async verifyMagicLink(req: Request, res: Response) {
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'undefined');

      if (!decoded || typeof decoded === "string") {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      return res.status(200).json({ message: 'User authenticated successfully', token: token, user: decoded });

    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  }


}

export default new AuthController();
