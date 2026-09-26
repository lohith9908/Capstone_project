import mongoose, { Schema, Document, Types } from 'mongoose';
import { DefenseType } from '../types/index.js';

export interface IRecommendation extends Document {
  experimentId: Types.ObjectId;
  recommendedDefense: DefenseType;
  confidence: number;
  reasoning: string;
  observedWeaknesses: string[];
  ranking?: Array<{ defense: DefenseType; score: number; rank: number; tradeOffScore?: number }>;
  createdAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, unique: true, index: true },
    recommendedDefense: { type: String, enum: Object.values(DefenseType), required: true },
    confidence: { type: Number, required: true },
    reasoning: { type: String, required: true },
    observedWeaknesses: { type: Schema.Types.Mixed, default: [] },
    ranking: { type: Schema.Types.Mixed }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
