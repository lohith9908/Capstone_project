import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDataset extends Document {
  name: string;
  description?: string;
  source?: string;
  sampleCount: number;
  featureCount: number;
  isDemo: boolean;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DatasetSchema = new Schema<IDataset>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    source: { type: String, default: '' },
    sampleCount: { type: Number, default: 0 },
    featureCount: { type: Number, default: 15 },
    isDemo: { type: Boolean, default: false, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

export const Dataset = mongoose.model<IDataset>('Dataset', DatasetSchema);
