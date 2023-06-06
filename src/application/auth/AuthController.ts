// src/application/auth/AuthController.ts
import jwt from 'jsonwebtoken';
import UserService from '../../domain/user/services/UserService';
import mg from '../../config/mailgun';
import { Request, Response } from 'express';
import validator from 'validator';
import axios from 'axios';

class AuthController {
  async sendMagicLink(req: Request, res: Response) {
    const { email } = req.body;
    const emailUrl = process.env.EMAIL_BASE_URL;
    // Validate the email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    try {
      let user = await UserService.getUserByEmail(email);

      if (!user) {
        user = await UserService.createUserByEmail(email);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'undefined', { expiresIn: '24h' });
      const loginUrl = process.env.APP_URL + '/auth/' + token;
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
                `As requested, here is your magic link to sign in to Amani.Finance, yout GPT based financial advisors.<br/>`,
                `<a href='${loginUrl}' style='text-decoration:none; background-color: #322074; border: 0; border-radius: 7px; padding: 5px 15px; color: white; margin: auto; margin-top: 20px;'>Login<a> <br/>`,
                `you can click here to access link directly: ${loginUrl} <br/>`,
                `Please note that this magic link will expire in 1 hour. <br/>`,
                `If you did not request this magic link, please ignore this email. <br/>`,
            ]
        }
      }, { headers: {'source': 'internal'}})
      // check if the response has data and that it isn't an error object
      if (sendEmail.data && sendEmail.data.error) {
        console.log(sendEmail.data.error);
        return res.status(500).send('Server error');
      }
      res.json({ msg: 'Magic link sent!' });
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
        return res.status(401).json({ msg: 'Invalid or expired token' });
      }
  
      // If you want to return the decoded token
      return res.status(200).json({ message: 'User authenticated successfully', token: token });
  
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  }
  

}

export default new AuthController(); 
