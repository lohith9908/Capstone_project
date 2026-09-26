import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const result = await authService.register(name, email, password, role);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user!.userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
