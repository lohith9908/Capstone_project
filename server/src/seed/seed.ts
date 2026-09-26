import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import {
  User,
  Dataset,
  DatasetSample,
  Experiment,
  AttackResult,
  DefenseResult,
  FeatureContribution,
  Recommendation,
  Report,
} from '../models/index.js';
import {
  Role,
  SampleLabel,
  AttackType,
  IFeatureVector,
} from '../types/index.js';
import { experimentService } from '../services/experimentService.js';

// Deterministic Pseudo-Random Generator with fixed seed
let s = 123456789;
const seededRandom = () => {
  s = (1103515245 * s + 12345) % 2147483648;
  return s / 2147483648;
};

const generateSyntheticSamples = (): Array<{ label: SampleLabel; features: IFeatureVector }> => {
  const samples: Array<{ label: SampleLabel; features: IFeatureVector }> = [];

  // Generate 50 Malware Samples
  for (let i = 0; i < 50; i++) {
    const isPacked = seededRandom() > 0.35 ? 1 : 0;
    const entropy = Math.round((6.8 + seededRandom() * 0.95) * 100) / 100;
    const suspiciousApis = Math.floor(2 + seededRandom() * 6);
    const imports = Math.floor(5 + seededRandom() * 25);
    const strings = Math.floor(40 + seededRandom() * 120);
    const sections = Math.floor(3 + seededRandom() * 5);
    const fileSize = Math.floor(250 * 1024 + seededRandom() * 800 * 1024);
    const codeSize = Math.floor(fileSize * 0.4);
    const dataSize = Math.floor(fileSize * (isPacked ? 1.8 : 0.8));

    samples.push({
      label: SampleLabel.MALWARE,
      features: {
        fileSize,
        entropy,
        sectionCount: sections,
        importCount: imports,
        exportCount: Math.floor(seededRandom() * 2),
        resourceCount: Math.floor(1 + seededRandom() * 4),
        stringCount: strings,
        apiCount: imports + Math.floor(seededRandom() * 20),
        headerSize: 1024,
        codeSize,
        dataSize,
        imageCount: 0,
        certificatePresent: seededRandom() > 0.9 ? 1 : 0,
        suspiciousApiCount: suspiciousApis,
        packedIndicator: isPacked,
      },
    });
  }

  // Generate 50 Benign Samples
  for (let i = 0; i < 50; i++) {
    const entropy = Math.round((5.2 + seededRandom() * 1.1) * 100) / 100;
    const imports = Math.floor(70 + seededRandom() * 180);
    const strings = Math.floor(600 + seededRandom() * 2500);
    const sections = Math.floor(4 + seededRandom() * 3);
    const fileSize = Math.floor(1.2 * 1024 * 1024 + seededRandom() * 5 * 1024 * 1024);
    const codeSize = Math.floor(fileSize * 0.45);
    const dataSize = Math.floor(fileSize * 0.35);

    samples.push({
      label: SampleLabel.BENIGN,
      features: {
        fileSize,
        entropy,
        sectionCount: sections,
        importCount: imports,
        exportCount: Math.floor(seededRandom() * 10),
        resourceCount: Math.floor(2 + seededRandom() * 8),
        stringCount: strings,
        apiCount: imports + Math.floor(seededRandom() * 80),
        headerSize: 1024,
        codeSize,
        dataSize,
        imageCount: Math.floor(seededRandom() * 4),
        certificatePresent: seededRandom() > 0.25 ? 1 : 0,
        suspiciousApiCount: 0,
        packedIndicator: 0,
      },
    });
  }

  return samples;
};

export const seedDatabase = async () => {
  console.log('[ARES Seeder] Initializing database connection...');
  await connectDB();

  console.log('[ARES Seeder] Clearing existing records for clean initialization...');
  await Promise.all([
    User.deleteMany({}),
    Dataset.deleteMany({}),
    DatasetSample.deleteMany({}),
    Experiment.deleteMany({}),
    AttackResult.deleteMany({}),
    DefenseResult.deleteMany({}),
    FeatureContribution.deleteMany({}),
    Recommendation.deleteMany({}),
    Report.deleteMany({}),
  ]);

  console.log('[ARES Seeder] Seeding default users...');
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AresAdmin2026!', salt);
  const analystPasswordHash = await bcrypt.hash('AresAnalyst2026!', salt);

  const adminUser = await User.create({
    name: 'ARES System Administrator',
    email: 'admin@ares.security',
    passwordHash: adminPasswordHash,
    role: Role.ADMIN,
  });

  await User.create({
    name: 'Security Research Analyst',
    email: 'analyst@ares.security',
    passwordHash: analystPasswordHash,
    role: Role.ANALYST,
  });

  console.log('[ARES Seeder] Seeding ARES Demonstration Dataset...');
  const samples = generateSyntheticSamples();

  const dataset = await Dataset.create({
    name: 'ARES Demonstration Dataset (Static PE Benchmarks)',
    description: '100 balanced synthetic static feature vectors (50 Malware, 50 Benign) representing Portable Executable (PE) binaries with extracted structural metrics.',
    source: 'ARES Cyber Defense Laboratory Synthetic Generator',
    sampleCount: samples.length,
    featureCount: 15,
    isDemo: true,
    ownerId: adminUser._id,
  });

  const sampleDocs = samples.map((s) => ({
    datasetId: dataset._id,
    label: s.label,
    features: s.features,
  }));
  await DatasetSample.insertMany(sampleDocs);
  console.log(`[ARES Seeder] Created ${sampleDocs.length} dataset samples.`);

  // Seed initial demo experiments
  console.log('[ARES Seeder] Running baseline Demo Experiment 1: Padding Attack...');
  const exp1 = await experimentService.runExperiment(adminUser._id.toString(), {
    name: 'Baseline Evaluation vs Padding Attack',
    datasetId: dataset._id.toString(),
    attackType: AttackType.PADDING,
    options: {
      paddingSizeBytes: 6 * 1024 * 1024,
      entropyReductionFactor: 0.28,
    },
  });

  console.log('[ARES Seeder] Running baseline Demo Experiment 2: GAMMA-inspired Attack...');
  const exp2 = await experimentService.runExperiment(adminUser._id.toString(), {
    name: 'Robustness Benchmark vs GAMMA-inspired Feature Injection',
    datasetId: dataset._id.toString(),
    attackType: AttackType.GAMMA_INSPIRED,
    options: {
      injectedImports: 95,
      injectedStrings: 1200,
      injectedSections: 2,
    },
  });

  console.log(`[ARES Seeder] Successfully executed 2 demo experiments: ${exp1.name}, ${exp2.name}`);
  console.log('[ARES Seeder] Database seeded successfully!');
};

// If run directly via tsx
if (process.argv[1]?.includes('seed')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[ARES Seeder Error]', err);
      await disconnectDB();
      process.exit(1);
    });
}
