import { Request, Response, NextFunction } from 'express';
import { experimentService } from '../services/experimentService.js';

export class ExperimentController {
  public async runExperiment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '000000000000000000000000';
      const experiment = await experimentService.runExperiment(userId, req.body);
      res.status(201).json({ success: true, data: experiment });
    } catch (err) {
      next(err);
    }
  }

  public async getExperiments(_req: Request, res: Response, next: NextFunction) {
    try {
      const experiments = await experimentService.getExperiments();
      res.json({ success: true, data: experiments });
    } catch (err) {
      next(err);
    }
  }

  public async getExperimentById(req: Request, res: Response, next: NextFunction) {
    try {
      const experiment = await experimentService.getExperimentById(req.params.id);
      res.json({ success: true, data: experiment });
    } catch (err) {
      next(err);
    }
  }

  public async getExperimentResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await experimentService.getExperimentFullResults(req.params.id);
      res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  public async runCleanEvaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const { datasetId } = req.body;
      const evaluation = await experimentService.runCleanEvaluation(datasetId);
      res.json({ success: true, data: evaluation });
    } catch (err) {
      next(err);
    }
  }
}

export const experimentController = new ExperimentController();
