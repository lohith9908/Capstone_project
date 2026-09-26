import mongoose, { Schema, Document, Types } from 'mongoose';
import { ExperimentStatus, AttackType } from '../types/index.js';

export interface IExperiment extends Document {
  name: string;
  status: ExperimentStatus;
  datasetId: Types.ObjectId;
  userId: Types.ObjectId;
  attackType?: AttackType;
  robustnessScore?: number;
  attackSuccessRate?: number;
  detectionRetention?: number;
  configuration?: Record<string, any>;
  summary?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ExperimentSchema = new Schema<IExperiment>(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(ExperimentStatus), default: ExperimentStatus.PENDING, index: true },
    datasetId: { type: Schema.Types.ObjectId, ref: 'Dataset', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attackType: { type: String, enum: Object.values(AttackType) },
    robustnessScore: { type: Number },
    attackSuccessRate: { type: Number },
    detectionRetention: { type: Number },
    configuration: { type: Schema.Types.Mixed },
    summary: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Experiment = mongoose.model<IExperiment>('Experiment', ExperimentSchema);
