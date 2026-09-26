export enum Role {
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
  USER = 'USER',
}

export enum SampleLabel {
  MALWARE = 'MALWARE',
  BENIGN = 'BENIGN',
}

export enum ExperimentStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum AttackType {
  PADDING = 'PADDING',
  GAMMA_INSPIRED = 'GAMMA_INSPIRED',
}

export enum SamplePrediction {
  MALWARE = 'MALWARE',
  BENIGN = 'BENIGN',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum DefenseType {
  BASELINE = 'BASELINE',
  ADVERSARIAL_TRAINING_SIMULATION = 'ADVERSARIAL_TRAINING_SIMULATION',
  MONOTONIC_CONSTRAINT_SIMULATION = 'MONOTONIC_CONSTRAINT_SIMULATION',
}

export enum ContributionDirection {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
}

export interface IFeatureVector {
  fileSize: number;
  entropy: number;
  sectionCount: number;
  importCount: number;
  exportCount: number;
  resourceCount: number;
  stringCount: number;
  apiCount: number;
  headerSize: number;
  codeSize: number;
  dataSize: number;
  imageCount: number;
  certificatePresent: number;
  suspiciousApiCount: number;
  packedIndicator: number;
  [key: string]: number;
}

export interface IFeatureContributionItem {
  featureName: string;
  originalValue?: number;
  modifiedValue?: number;
  contribution: number;
  importance: number;
  direction: ContributionDirection;
}

export interface IDetectionResult {
  score: number;
  prediction: SamplePrediction;
  confidence: number;
  riskLevel: RiskLevel;
  featureContributions: IFeatureContributionItem[];
}

export interface IAdversarialResult {
  sampleId?: string;
  originalFeatures: IFeatureVector;
  perturbedFeatures: IFeatureVector;
  attackType: AttackType;
  originalDetection: IDetectionResult;
  adversarialDetection: IDetectionResult;
  attackSuccessful: boolean;
  evaded: boolean;
  scoreDelta: number;
  changedFeatures: Record<string, { original: number; modified: number; delta: number }>;
}

export interface IRobustnessEvaluationResult {
  totalMalwareSamples: number;
  cleanDetections: number;
  adversarialDetections: number;
  cleanDetectionRate: number;
  adversarialDetectionRate: number;
  detectionRetention: number;
  attackSuccessRate: number;
  stabilityScore: number;
  performanceDegradation: number;
  robustnessScore: number;
  robustnessTier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface IDefenseEvaluationResult {
  defenseType: DefenseType;
  cleanDetectionRate: number;
  adversarialDetectionRate: number;
  attackSuccessRate: number;
  robustnessScore: number;
  processingTimeMs: number;
  estimatedCost: number;
  improvementPercentage: number;
  metrics: Record<string, any>;
}

export interface IDefenseRankingItem {
  defense: DefenseType;
  score: number;
  rank: number;
  tradeOffScore: number;
}

export interface IRecommendationResult {
  recommendedDefense: DefenseType;
  confidence: number;
  reasoning: string;
  observedWeaknesses: string[];
  ranking: IDefenseRankingItem[];
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface IDataset {
  _id: string;
  name: string;
  description?: string;
  source?: string;
  sampleCount: number;
  featureCount: number;
  isDemo: boolean;
  createdAt: string;
}

export interface IDatasetSample {
  _id: string;
  datasetId: string;
  label: SampleLabel;
  features: IFeatureVector;
}

export interface IExperiment {
  _id: string;
  name: string;
  status: ExperimentStatus;
  datasetId: { _id: string; name: string; sampleCount: number } | string;
  attackType?: AttackType;
  robustnessScore?: number;
  attackSuccessRate?: number;
  detectionRetention?: number;
  summary?: Record<string, any>;
  createdAt: string;
}

export interface IReport {
  _id: string;
  experimentId: IExperiment;
  title: string;
  reportData: Record<string, any>;
  createdAt: string;
}
