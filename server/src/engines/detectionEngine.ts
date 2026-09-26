import {
  IFeatureVector,
  IDetectionResult,
  SamplePrediction,
  RiskLevel,
  ContributionDirection,
  IFeatureContributionItem,
} from '../types/index.js';

export interface IDetectionModelConfig {
  threshold: number; // default 50
  weights: {
    entropy: number;
    suspiciousApiCount: number;
    packedIndicator: number;
    certificatePresent: number;
    importCount: number;
    stringCount: number;
    sectionCount: number;
    fileSize: number;
    dataToCodeRatio: number;
  };
}

export const DEFAULT_DETECTION_CONFIG: IDetectionModelConfig = {
  threshold: 50,
  weights: {
    entropy: 24,
    suspiciousApiCount: 26,
    packedIndicator: 22,
    certificatePresent: -18,
    importCount: -10,
    stringCount: -8,
    sectionCount: 6,
    fileSize: -6,
    dataToCodeRatio: 8,
  },
};

/**
 * Deterministic ARES Detection Engine
 * Calculates a malware risk score from 0 to 100 based on standard static PE feature vectors.
 */
export class DetectionEngine {
  private config: IDetectionModelConfig;

  constructor(customConfig?: Partial<IDetectionModelConfig>) {
    this.config = {
      threshold: customConfig?.threshold ?? DEFAULT_DETECTION_CONFIG.threshold,
      weights: {
        ...DEFAULT_DETECTION_CONFIG.weights,
        ...(customConfig?.weights || {}),
      },
    };
  }

  public analyze(features: IFeatureVector): IDetectionResult {
    // 1. Calculate individual feature risk components
    const contributions: IFeatureContributionItem[] = [];

    // Base prior score (baseline prior probability centered around 20)
    let score = 20;

    // Feature 1: Entropy (0 to 8). Higher entropy (> 6.8) is strongly associated with packing/encryption
    const entropy = Number(features.entropy) || 0;
    let entropyScore = 0;
    if (entropy > 7.2) {
      entropyScore = this.config.weights.entropy * 1.0;
    } else if (entropy > 6.5) {
      entropyScore = this.config.weights.entropy * 0.7;
    } else if (entropy < 4.0) {
      entropyScore = -this.config.weights.entropy * 0.4;
    }
    score += entropyScore;
    contributions.push({
      featureName: 'entropy',
      originalValue: entropy,
      contribution: Math.round(entropyScore * 10) / 10,
      importance: Math.abs(this.config.weights.entropy),
      direction: entropyScore > 0 ? ContributionDirection.POSITIVE : entropyScore < 0 ? ContributionDirection.NEGATIVE : ContributionDirection.NEUTRAL,
    });

    // Feature 2: Suspicious API Count (e.g., VirtualAllocEx, WriteProcessMemory)
    const suspiciousApis = Number(features.suspiciousApiCount) || 0;
    let apiScore = 0;
    if (suspiciousApis >= 5) {
      apiScore = this.config.weights.suspiciousApiCount * 1.0;
    } else if (suspiciousApis >= 2) {
      apiScore = this.config.weights.suspiciousApiCount * 0.65;
    } else if (suspiciousApis === 1) {
      apiScore = this.config.weights.suspiciousApiCount * 0.3;
    } else {
      apiScore = -5; // 0 suspicious APIs slightly reduces malware score
    }
    score += apiScore;
    contributions.push({
      featureName: 'suspiciousApiCount',
      originalValue: suspiciousApis,
      contribution: Math.round(apiScore * 10) / 10,
      importance: Math.abs(this.config.weights.suspiciousApiCount),
      direction: apiScore > 0 ? ContributionDirection.POSITIVE : ContributionDirection.NEGATIVE,
    });

    // Feature 3: Packed Indicator (1 or 0)
    const packed = Number(features.packedIndicator) || 0;
    const packedScore = packed > 0 ? this.config.weights.packedIndicator : -4;
    score += packedScore;
    contributions.push({
      featureName: 'packedIndicator',
      originalValue: packed,
      contribution: Math.round(packedScore * 10) / 10,
      importance: Math.abs(this.config.weights.packedIndicator),
      direction: packedScore > 0 ? ContributionDirection.POSITIVE : ContributionDirection.NEGATIVE,
    });

    // Feature 4: Digital Certificate Present (Valid cert reduces risk)
    const certPresent = Number(features.certificatePresent) || 0;
    const certScore = certPresent > 0 ? this.config.weights.certificatePresent : 8;
    score += certScore;
    contributions.push({
      featureName: 'certificatePresent',
      originalValue: certPresent,
      contribution: Math.round(certScore * 10) / 10,
      importance: Math.abs(this.config.weights.certificatePresent),
      direction: certScore > 0 ? ContributionDirection.POSITIVE : ContributionDirection.NEGATIVE,
    });

    // Feature 5: Import Count (Very low import count often indicates packed/staged payload)
    const imports = Number(features.importCount) || 0;
    let importScore = 0;
    if (imports < 15) {
      importScore = 12; // High risk
    } else if (imports > 100) {
      importScore = this.config.weights.importCount; // Rich standard benign imports
    } else {
      importScore = 0;
    }
    score += importScore;
    contributions.push({
      featureName: 'importCount',
      originalValue: imports,
      contribution: Math.round(importScore * 10) / 10,
      importance: Math.abs(this.config.weights.importCount),
      direction: importScore > 0 ? ContributionDirection.POSITIVE : importScore < 0 ? ContributionDirection.NEGATIVE : ContributionDirection.NEUTRAL,
    });

    // Feature 6: String Count (Sparse strings imply obfuscation/packing)
    const strings = Number(features.stringCount) || 0;
    let stringScore = 0;
    if (strings < 80) {
      stringScore = 10;
    } else if (strings > 800) {
      stringScore = this.config.weights.stringCount;
    }
    score += stringScore;
    contributions.push({
      featureName: 'stringCount',
      originalValue: strings,
      contribution: Math.round(stringScore * 10) / 10,
      importance: Math.abs(this.config.weights.stringCount),
      direction: stringScore > 0 ? ContributionDirection.POSITIVE : stringScore < 0 ? ContributionDirection.NEGATIVE : ContributionDirection.NEUTRAL,
    });

    // Feature 7: Section Count anomalies
    const sections = Number(features.sectionCount) || 0;
    let sectionScore = 0;
    if (sections > 8 || sections < 3) {
      sectionScore = this.config.weights.sectionCount;
    }
    score += sectionScore;
    contributions.push({
      featureName: 'sectionCount',
      originalValue: sections,
      contribution: Math.round(sectionScore * 10) / 10,
      importance: Math.abs(this.config.weights.sectionCount),
      direction: sectionScore > 0 ? ContributionDirection.POSITIVE : ContributionDirection.NEUTRAL,
    });

    // Feature 8: Data to Code ratio anomaly
    const codeSize = Math.max(Number(features.codeSize) || 1, 1024);
    const dataSize = Number(features.dataSize) || 0;
    const ratio = dataSize / codeSize;
    let ratioScore = 0;
    if (ratio > 5.0) {
      ratioScore = this.config.weights.dataToCodeRatio;
    }
    score += ratioScore;
    contributions.push({
      featureName: 'dataSize',
      originalValue: dataSize,
      contribution: Math.round(ratioScore * 10) / 10,
      importance: Math.abs(this.config.weights.dataToCodeRatio),
      direction: ratioScore > 0 ? ContributionDirection.POSITIVE : ContributionDirection.NEUTRAL,
    });

    // Feature 9: File Size (Massive files sometimes dilute density of indicators)
    const fileSize = Number(features.fileSize) || 0;
    let sizeScore = 0;
    if (fileSize > 10 * 1024 * 1024) { // > 10MB
      sizeScore = this.config.weights.fileSize;
    }
    score += sizeScore;
    contributions.push({
      featureName: 'fileSize',
      originalValue: fileSize,
      contribution: Math.round(sizeScore * 10) / 10,
      importance: Math.abs(this.config.weights.fileSize),
      direction: sizeScore > 0 ? ContributionDirection.POSITIVE : sizeScore < 0 ? ContributionDirection.NEGATIVE : ContributionDirection.NEUTRAL,
    });

    // Clamp score strictly between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score * 10) / 10));

    // Determine Prediction
    const prediction = finalScore >= this.config.threshold ? SamplePrediction.MALWARE : SamplePrediction.BENIGN;

    // Confidence is distance from threshold normalized
    const dist = Math.abs(finalScore - this.config.threshold);
    const confidence = Math.round(Math.min(1.0, 0.5 + (dist / 100)) * 100) / 100;

    // Risk Level
    let riskLevel = RiskLevel.LOW;
    if (finalScore >= 80) riskLevel = RiskLevel.CRITICAL;
    else if (finalScore >= 60) riskLevel = RiskLevel.HIGH;
    else if (finalScore >= 40) riskLevel = RiskLevel.MEDIUM;

    // Sort contributions by absolute impact descending
    contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    return {
      score: finalScore,
      prediction,
      confidence,
      riskLevel,
      featureContributions: contributions,
    };
  }
}

export const defaultDetector = new DetectionEngine();
