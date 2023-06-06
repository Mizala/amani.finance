import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Define a new interface that extends from express's Request
interface RequestWithUserId extends Request {
  user?: object | string;
}

export const authenticateJWT = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  // Get the auth header value
  const authHeader = req.headers.authorization;

  // Check if auth header is not null and starts with Bearer
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);
    if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_SECRET || 'undefined', (err, user) => {
      if (err) {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
      }

      // Store user in request for use in other routes
      req.user = user;
      next();
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });
  }
};
