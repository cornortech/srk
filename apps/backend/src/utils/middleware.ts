import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

/**
 * JWT Authentication Middleware
 * Verifies the JWT token from cookies and adds user info to request
 */
export const JwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get access token from cookies
    const token = req.cookies?.['access_token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided',
      });
    }

    // Verify token
    const decoded = await AuthService.verifyJwtToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token',
      });
    }

    // Add user info to request
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('JWT Auth Middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Token verification failed',
    });
  }
};

export default JwtAuthMiddleware;
