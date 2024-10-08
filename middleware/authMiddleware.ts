import { NextFunction, Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { createHash, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
declare module 'express-serve-static-core' {
  interface Request {
      user?: any; // or use a more specific type for user
  }
}


export const checkUserAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
      // Check if header is present and starts with 'Bearer'
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];  // Get the token part

      // Replace 'your-secret-key' with your actual secret
      jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
          if (err) {
              return res.status(403).json({ message: 'Invalid token' });
          }

          // Store the decoded payload in the request object
          
          req.user = decoded;
          if(req.user.users[0].userTypeId==2){
            next();  // Proceed to the next middleware or route handler
          }
          else{
            return res.status(403).json({ message: 'Access Denied' });
          }
          
         
      });
  } else {
       res.status(401).json({ message: 'Authorization token missing or malformed' });
  }
};


export const checkAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
      // Check if header is present and starts with 'Bearer'
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];  // Get the token part

      // Replace 'your-secret-key' with your actual secret
      jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
          if (err) {
              return res.status(403).json({ message: 'Invalid token' });
          }

          // Store the decoded payload in the request object
          
          req.user = decoded;
          if(req.user.users[0].userTypeId==1){
            next();  // Proceed to the next middleware or route handler
          }
          else{
            return res.status(403).json({ message: 'Access Denied' });
          }
          
         
      });
  } else {
       res.status(401).json({ message: 'Authorization token missing or malformed' });
  }
};
