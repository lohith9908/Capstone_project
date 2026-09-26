import { Types } from 'mongoose';
import { Report, Experiment } from '../models/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class ReportService {
  public async getReports() {
    return Report.find().populate('experimentId', 'name attackType createdAt').sort({ createdAt: -1 });
  }

  public async getReportById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Report ID', 400, 'INVALID_ID');
    }
    const report = await Report.findById(id).populate('experimentId');
    if (!report) {
      throw new AppError('Report not found', 404, 'NOT_FOUND');
    }
    return report;
  }

  public async getReportByExperimentId(experimentId: string) {
    if (!Types.ObjectId.isValid(experimentId)) {
      throw new AppError('Invalid Experiment ID', 400, 'INVALID_ID');
    }
    const report = await Report.findOne({ experimentId: new Types.ObjectId(experimentId) }).populate('experimentId');
    if (!report) {
      throw new AppError('Report not found for this experiment', 404, 'NOT_FOUND');
    }
    return report;
  }

  public async generateReport(experimentId: string, title?: string) {
    if (!Types.ObjectId.isValid(experimentId)) {
      throw new AppError('Invalid Experiment ID', 400, 'INVALID_ID');
    }

    const existingReport = await Report.findOne({ experimentId: new Types.ObjectId(experimentId) }).populate('experimentId');
    if (existingReport) {
      return existingReport;
    }

    const experiment = await Experiment.findById(experimentId).populate('datasetId');
    if (!experiment) {
      throw new AppError('Experiment not found', 404, 'NOT_FOUND');
    }

    const newReport = await Report.create({
      experimentId: experiment._id,
      title: title || `Robustness Audit Report: ${experiment.name}`,
      reportData: {
        experimentName: experiment.name,
        datasetName: (experiment.datasetId as any)?.name || 'Dataset',
        attackType: experiment.attackType,
        robustnessScore: experiment.robustnessScore,
        cleanDetectionRate: experiment.summary?.cleanDetectionRate,
        adversarialDetectionRate: experiment.summary?.adversarialDetectionRate,
        attackSuccessRate: experiment.attackSuccessRate,
        detectionRetention: experiment.detectionRetention,
        stabilityScore: experiment.summary?.stabilityScore,
        robustnessTier: experiment.summary?.robustnessTier,
        recommendedDefense: experiment.summary?.recommendedDefense,
      },
    });

    return Report.findById(newReport._id).populate('experimentId');
  }
}

export const reportService = new ReportService();
