import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { env } from '../config/env';
import { AuthRequest } from '../types';

const signToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user.id);
  
  const isProduction = process.env.NODE_ENV === 'production' || env.CLIENT_URL.includes('vercel');

  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
  };

  console.log('[Auth Controller] Setting Cookie:', cookieOptions);

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  createSendToken(user, 201, res);
});

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production' || env.CLIENT_URL.includes('vercel');
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
