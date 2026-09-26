import { Request, Response, NextFunction } from 'express';
import { datasetService } from '../services/datasetService.js';
import { SampleLabel } from '../types/index.js';

export class DatasetController {
  public async getDatasets(_req: Request, res: Response, next: NextFunction) {
    try {
      const datasets = await datasetService.getDatasets();
      res.json({ success: true, data: datasets });
    } catch (err) {
      next(err);
    }
  }

  public async getDatasetById(req: Request, res: Response, next: NextFunction) {
    try {
      const dataset = await datasetService.getDatasetById(req.params.id);
      res.json({ success: true, data: dataset });
    } catch (err) {
      next(err);
    }
  }

  public async getDatasetSamples(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const label = req.query.label as SampleLabel | undefined;

      const result = await datasetService.getDatasetSamples(req.params.id, page, limit, label);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async createDataset(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user?.userId || '000000000000000000000000';
      const dataset = await datasetService.createDataset(ownerId, req.body);
      res.status(201).json({ success: true, data: dataset });
    } catch (err) {
      next(err);
    }
  }

  public async uploadCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user?.userId || '000000000000000000000000';
      const { name, description, csvContent } = req.body;

      const samples = datasetService.parseCsvFeatures(csvContent);
      const dataset = await datasetService.createDataset(ownerId, {
        name,
        description,
        source: 'CSV Import',
        samples,
      });

      res.status(201).json({ success: true, data: dataset });
    } catch (err) {
      next(err);
    }
  }
}

export const datasetController = new DatasetController();
