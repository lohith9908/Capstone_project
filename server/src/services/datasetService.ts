import { Types } from 'mongoose';
import { Dataset, IDataset } from '../models/Dataset.js';
import { DatasetSample, IDatasetSample } from '../models/DatasetSample.js';
import { SampleLabel, IFeatureVector } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class DatasetService {
  public async getDatasets() {
    const datasets = await Dataset.find().sort({ createdAt: -1 });
    return datasets;
  }

  public async getDatasetById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Dataset ID', 400, 'INVALID_ID');
    }
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      throw new AppError('Dataset not found', 404, 'NOT_FOUND');
    }

    // Compute live stats from DatasetSample
    const totalSamples = await DatasetSample.countDocuments({ datasetId: dataset._id });
    const malwareCount = await DatasetSample.countDocuments({ datasetId: dataset._id, label: SampleLabel.MALWARE });
    const benignCount = await DatasetSample.countDocuments({ datasetId: dataset._id, label: SampleLabel.BENIGN });

    return {
      dataset,
      statistics: {
        totalSamples,
        malwareCount,
        benignCount,
        malwareRatio: totalSamples > 0 ? Math.round((malwareCount / totalSamples) * 100) : 0,
      },
    };
  }

  public async getDatasetSamples(
    datasetId: string,
    page = 1,
    limit = 20,
    label?: SampleLabel
  ) {
    if (!Types.ObjectId.isValid(datasetId)) {
      throw new AppError('Invalid Dataset ID', 400, 'INVALID_ID');
    }

    const query: any = { datasetId: new Types.ObjectId(datasetId) };
    if (label) query.label = label;

    const skip = (page - 1) * limit;
    const [samples, total] = await Promise.all([
      DatasetSample.find(query).skip(skip).limit(limit),
      DatasetSample.countDocuments(query),
    ]);

    return {
      samples,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async createDataset(
    ownerId: string,
    data: {
      name: string;
      description?: string;
      source?: string;
      samples: Array<{ label: SampleLabel; features: IFeatureVector }>;
    }
  ) {
    const dataset = await Dataset.create({
      name: data.name,
      description: data.description || '',
      source: data.source || 'User Upload',
      sampleCount: data.samples.length,
      featureCount: 15,
      isDemo: false,
      ownerId: new Types.ObjectId(ownerId),
    });

    const sampleDocs = data.samples.map((s) => ({
      datasetId: dataset._id,
      label: s.label,
      features: s.features,
    }));

    await DatasetSample.insertMany(sampleDocs);

    return dataset;
  }

  /**
   * Parses CSV string safely into feature vectors
   */
  public parseCsvFeatures(csvContent: string): Array<{ label: SampleLabel; features: IFeatureVector }> {
    const lines = csvContent.trim().split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new AppError('CSV must contain a header row and at least one data row', 400, 'INVALID_CSV');
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const samples: Array<{ label: SampleLabel; features: IFeatureVector }> = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/"/g, ''));
      if (values.length < headers.length) continue;

      const rawObj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        rawObj[h] = values[idx];
      });

      const label = (rawObj['label'] || 'MALWARE').toUpperCase() === 'BENIGN' ? SampleLabel.BENIGN : SampleLabel.MALWARE;

      const features: IFeatureVector = {
        fileSize: Number(rawObj['fileSize']) || 102400,
        entropy: Math.min(8.0, Math.max(0, Number(rawObj['entropy']) || 6.0)),
        sectionCount: Number(rawObj['sectionCount']) || 4,
        importCount: Number(rawObj['importCount']) || 25,
        exportCount: Number(rawObj['exportCount']) || 0,
        resourceCount: Number(rawObj['resourceCount']) || 2,
        stringCount: Number(rawObj['stringCount']) || 200,
        apiCount: Number(rawObj['apiCount']) || 40,
        headerSize: Number(rawObj['headerSize']) || 1024,
        codeSize: Number(rawObj['codeSize']) || 20480,
        dataSize: Number(rawObj['dataSize']) || 10240,
        imageCount: Number(rawObj['imageCount']) || 0,
        certificatePresent: Number(rawObj['certificatePresent']) ? 1 : 0,
        suspiciousApiCount: Number(rawObj['suspiciousApiCount']) || 0,
        packedIndicator: Number(rawObj['packedIndicator']) ? 1 : 0,
      };

      samples.push({ label, features });
    }

    return samples;
  }
}

export const datasetService = new DatasetService();
