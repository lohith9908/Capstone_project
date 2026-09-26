import mongoose, { Schema, Document, Types } from 'mongoose';
import { DefenseType } from '../types/index.js';

export interface IDefenseResult extends Document {
  experimentId: Types.ObjectId;
  defenseType: DefenseType;
  cleanDetectionRate: number;
  adversarialDetectionRate: number;
  attackSuccessRate: number;
  robustnessScore: number;
  processingTimeMs?: number;
  estimatedCost?: number;
  configuration?: Record<string, any>;
  metrics?: Record<string, any>;
  createdAt: Date;
}

const DefenseResultSchema = new Schema<IDefenseResult>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    defenseType: { type: String, enum: Object.values(DefenseType), required: true, index: true },
    cleanDetectionRate: { type: Number, required: true },
    adversarialDetectionRate: { type: Number, required: true },
    attackSuccessRate: { type: Number, required: true },
    robustnessScore: { type: Number, required: true },
    processingTimeMs: { type: Number, default: 0 },
    estimatedCost: { type: Number, default: 1 },
    configuration: { type: Schema.Types.Mixed },
    metrics: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DefenseResult = mongoose.model<IDefenseResult>('DefenseResult', DefenseResultSchema);
