import { z } from 'zod';
import { SampleLabel } from '../types/index.js';

export const featureVectorSchema = z.object({
  fileSize: z.number().nonnegative(),
  entropy: z.number().min(0).max(8),
  sectionCount: z.number().nonnegative(),
  importCount: z.number().nonnegative(),
  exportCount: z.number().nonnegative().default(0),
  resourceCount: z.number().nonnegative().default(0),
  stringCount: z.number().nonnegative().default(0),
  apiCount: z.number().nonnegative().default(0),
  headerSize: z.number().nonnegative().default(1024),
  codeSize: z.number().nonnegative().default(4096),
  dataSize: z.number().nonnegative().default(4096),
  imageCount: z.number().nonnegative().default(0),
  certificatePresent: z.number().min(0).max(1).default(0),
  suspiciousApiCount: z.number().nonnegative().default(0),
  packedIndicator: z.number().min(0).max(1).default(0),
}).passthrough();

export const createDatasetSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  source: z.string().max(200).optional(),
  samples: z.array(
    z.object({
      label: z.nativeEnum(SampleLabel),
      features: featureVectorSchema,
    })
  ).min(1, 'Dataset must contain at least one sample'),
});

export const analyzeFeatureVectorSchema = z.object({
  features: featureVectorSchema,
});
