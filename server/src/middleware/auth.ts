import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Role } from '../types/index.js';
import { AppError } from './errorHandler.js';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new AppError('Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token', 401, 'INVALID_TOKEN'));
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access forbidden: insufficient permissions', 403, 'FORBIDDEN'));
    }

    next();
  };
};
