import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService.js';

export class ReportController {
  public async getReports(_req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await reportService.getReports();
      res.json({ success: true, data: reports });
    } catch (err) {
      next(err);
    }
  }

  public async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.getReportById(req.params.id);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }

  public async getReportByExperimentId(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.getReportByExperimentId(req.params.experimentId);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }

  public async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { experimentId, title } = req.body;
      const report = await reportService.generateReport(experimentId, title);
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();
