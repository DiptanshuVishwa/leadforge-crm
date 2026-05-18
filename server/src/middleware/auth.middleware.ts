import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import User from '../models/User';
import { env } from '../config/env';
import { AuthRequest } from '../types';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    console.log('[Auth Middleware] Checking for token... Headers:', !!req.headers.authorization, 'Cookies:', !!req.cookies?.jwt);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('[Auth Middleware] Found token in Bearer header');
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('[Auth Middleware] Found token in cookie');
    }

    if (!token) {
      console.log('[Auth Middleware] No token found! Denying access.');
      return next(new AppError('Not authorized, no token', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    console.log('[Auth Middleware] Token verified for user ID:', decoded.id);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('[Auth Middleware] User not found for ID:', decoded.id);
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = {
      id: user.id,
      role: user.role,
    };
    next();
  } catch (error: any) {
    console.log('[Auth Middleware] Token validation failed:', error.message);
    return next(new AppError('Not authorized, token failed', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
