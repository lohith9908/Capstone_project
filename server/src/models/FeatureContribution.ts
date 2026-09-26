import mongoose, { Schema, Document, Types } from 'mongoose';
import { ContributionDirection } from '../types/index.js';

export interface IFeatureContribution extends Document {
  experimentId: Types.ObjectId;
  featureName: string;
  originalValue?: any;
  modifiedValue?: any;
  contribution: number;
  importance: number;
  direction: ContributionDirection;
  createdAt: Date;
}

const FeatureContributionSchema = new Schema<IFeatureContribution>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    featureName: { type: String, required: true, index: true },
    originalValue: { type: Schema.Types.Mixed },
    modifiedValue: { type: Schema.Types.Mixed },
    contribution: { type: Number, required: true },
    importance: { type: Number, required: true },
    direction: { type: String, enum: Object.values(ContributionDirection), required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const FeatureContribution = mongoose.model<IFeatureContribution>('FeatureContribution', FeatureContributionSchema);
