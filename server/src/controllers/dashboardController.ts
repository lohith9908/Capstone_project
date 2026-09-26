import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService.js';

export class DashboardController {
  public async getDashboardData(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getDashboardMetrics();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
