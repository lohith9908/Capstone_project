import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { Role } from '../types/index.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  public async register(name: string, email: string, password: string, role: Role = Role.USER) {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new AppError('Email address is already registered', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  public async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new AppError('Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  public async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }
}

export const authService = new AuthService();
