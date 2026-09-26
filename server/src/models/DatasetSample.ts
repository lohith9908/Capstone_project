import mongoose, { Schema, Document, Types } from 'mongoose';
import { SampleLabel } from '../types/index.js';

export interface IDatasetSample extends Document {
  datasetId: Types.ObjectId;
  label: SampleLabel;
  features: Record<string, number>;
  createdAt: Date;
}

const DatasetSampleSchema = new Schema<IDatasetSample>(
  {
    datasetId: { type: Schema.Types.ObjectId, ref: 'Dataset', required: true, index: true },
    label: { type: String, enum: Object.values(SampleLabel), required: true, index: true },
    features: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

DatasetSampleSchema.index({ datasetId: 1, label: 1 });

export const DatasetSample = mongoose.model<IDatasetSample>('DatasetSample', DatasetSampleSchema);
