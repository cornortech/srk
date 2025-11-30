// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
// import {getfirebase} from "@srk/shared/api"
import { IUser, UserModel } from '../model/userModel';
import { adminModel, IAdmin } from '../model/adminModel';
import admin from '../config/firebase';

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
      dbUser: IUser | null;
      adminDbUser: IAdmin | null;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    const adminUser = await adminModel.findOne({ email: decodedToken.email });
    if (adminUser) {
      req.adminDbUser = adminUser;
      return next();
    }

    const user = await UserModel.findOne({ email: decodedToken.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.dbUser = user;

    next();
  } catch (error) {
    console.log('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
