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
  POSITIVE = 'POSITIVE', // Pushes score toward MALWARE
  NEGATIVE = 'NEGATIVE', // Pushes score toward BENIGN
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
  contribution: number; // Raw numerical contribution to score
  importance: number;   // Absolute magnitude or relative weight
  direction: ContributionDirection;
}

export interface IDetectionResult {
  score: number; // 0 to 100
  prediction: SamplePrediction;
  confidence: number; // 0 to 1
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
  cleanDetectionRate: number;       // e.g. 0.95
  adversarialDetectionRate: number; // e.g. 0.35
  detectionRetention: number;       // e.g. 0.368 (adversarial / clean)
  attackSuccessRate: number;        // e.g. 0.632 (evasion rate)
  stabilityScore: number;           // e.g. 0.85
  performanceDegradation: number;   // clean - adversarial
  robustnessScore: number;          // 0 to 100
  robustnessTier: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface IDefenseEvaluationResult {
  defenseType: DefenseType;
  cleanDetectionRate: number;
  adversarialDetectionRate: number;
  attackSuccessRate: number;
  robustnessScore: number;
  processingTimeMs: number;
  estimatedCost: number; // relative unit (1 to 10)
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}
