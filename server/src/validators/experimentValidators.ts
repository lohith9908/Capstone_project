import { z } from 'zod';
import { AttackType } from '../types/index.js';

export const runExperimentSchema = z.object({
  name: z.string().min(2).max(100),
  datasetId: z.string().min(1, 'Dataset ID is required'),
  attackType: z.nativeEnum(AttackType).default(AttackType.PADDING),
  options: z.object({
    paddingSizeBytes: z.number().optional(),
    entropyReductionFactor: z.number().min(0.01).max(0.99).optional(),
    injectedImports: z.number().optional(),
    injectedStrings: z.number().optional(),
    injectedSections: z.number().optional(),
    targetEntropy: z.number().optional(),
  }).optional(),
});

export const runSingleAttackSchema = z.object({
  features: z.record(z.string(), z.number()),
  attackType: z.nativeEnum(AttackType),
  options: z.record(z.string(), z.any()).optional(),
});
