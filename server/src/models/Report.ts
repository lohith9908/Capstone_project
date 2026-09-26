import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  experimentId: Types.ObjectId;
  title: string;
  reportData: Record<string, any>;
  htmlContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment', required: true, index: true },
    title: { type: String, required: true, trim: true },
    reportData: { type: Schema.Types.Mixed, required: true },
    htmlContent: { type: String }
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
