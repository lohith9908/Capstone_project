import mongoose, { Schema, Document, Types } from 'mongoose';
import { AttackType, SamplePrediction } from '../types/index.js';

export interface IAttackResult extends Document {
  experimentId: Types.ObjectId;
  attackType: AttackType;
  sampleId?: string;
  originalPrediction: SamplePrediction;
  adversarialPrediction: SamplePrediction;
  originalScore: number;
  adversarialScore: number;
  attackSuccessful: boolean;
  changedFeatures: Record<string, { original: number; modified: number; delta?: number }>;
  createdAt: Date;
}

const AttackResultSchema = new Schema<IAttackResult>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    attackType: { type: String, enum: Object.values(AttackType), required: true, index: true },
    sampleId: { type: String },
    originalPrediction: { type: String, enum: Object.values(SamplePrediction), required: true },
    adversarialPrediction: { type: String, enum: Object.values(SamplePrediction), required: true },
    originalScore: { type: Number, required: true },
    adversarialScore: { type: Number, required: true },
    attackSuccessful: { type: Boolean, required: true },
    changedFeatures: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AttackResult = mongoose.model<IAttackResult>('AttackResult', AttackResultSchema);
