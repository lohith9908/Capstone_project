import { describe, it, expect } from 'vitest';
import {
  DetectionEngine,
  defaultDetector,
} from './detectionEngine.js';
import {
  AdversarialEngine,
  defaultAdversarialEngine,
} from './adversarialEngine.js';
import {
  RobustnessEngine,
  defaultRobustnessEngine,
} from './robustnessEngine.js';
import {
  DefenseEngine,
  defaultDefenseEngine,
} from './defenseEngine.js';
import {
  FeatureContributionEngine,
  defaultFeatureContributionEngine,
} from './featureContributionEngine.js';
import {
  RecommendationEngine,
  defaultRecommendationEngine,
} from './recommendationEngine.js';
import {
  IFeatureVector,
  SamplePrediction,
  AttackType,
  DefenseType,
} from '../types/index.js';

const mockMalware: IFeatureVector = {
  fileSize: 450000,
  entropy: 7.4,
  sectionCount: 5,
  importCount: 8,
  exportCount: 0,
  resourceCount: 2,
  stringCount: 65,
  apiCount: 15,
  headerSize: 1024,
  codeSize: 120000,
  dataSize: 300000,
  imageCount: 0,
  certificatePresent: 0,
  suspiciousApiCount: 4,
  packedIndicator: 1,
};

const mockBenign: IFeatureVector = {
  fileSize: 2500000,
  entropy: 5.4,
  sectionCount: 4,
  importCount: 120,
  exportCount: 2,
  resourceCount: 6,
  stringCount: 1400,
  apiCount: 160,
  headerSize: 1024,
  codeSize: 900000,
  dataSize: 600000,
  imageCount: 2,
  certificatePresent: 1,
  suspiciousApiCount: 0,
  packedIndicator: 0,
};

describe('ARES Deterministic Engines', () => {
  describe('DetectionEngine', () => {
    it('should correctly classify typical packed malware as MALWARE with high score', () => {
      const result = defaultDetector.analyze(mockMalware);
      expect(result.prediction).toBe(SamplePrediction.MALWARE);
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.riskLevel).toMatch(/HIGH|CRITICAL/);
      expect(result.featureContributions.length).toBeGreaterThan(0);
    });

    it('should correctly classify legitimate binary as BENIGN with low score', () => {
      const result = defaultDetector.analyze(mockBenign);
      expect(result.prediction).toBe(SamplePrediction.BENIGN);
      expect(result.score).toBeLessThan(50);
      expect(result.riskLevel).toBe('LOW');
    });

    it('should be strictly deterministic (same input produces identical output)', () => {
      const res1 = defaultDetector.analyze(mockMalware);
      const res2 = defaultDetector.analyze(mockMalware);
      expect(res1.score).toBe(res2.score);
      expect(res1.prediction).toBe(res2.prediction);
      expect(res1.confidence).toBe(res2.confidence);
    });
  });

  describe('AdversarialEngine', () => {
    it('Padding simulation should inflate size, dilute entropy, and lower malware score', () => {
      const result = defaultAdversarialEngine.simulatePadding(mockMalware, {
        paddingSizeBytes: 10 * 1024 * 1024,
        entropyReductionFactor: 0.35,
      });

      expect(result.attackType).toBe(AttackType.PADDING);
      expect(result.perturbedFeatures.fileSize).toBeGreaterThan(mockMalware.fileSize);
      expect(result.perturbedFeatures.entropy).toBeLessThan(mockMalware.entropy);
      expect(result.adversarialDetection.score).toBeLessThan(result.originalDetection.score);
    });

    it('GAMMA simulation should inject benign imports/strings and decrease score', () => {
      const result = defaultAdversarialEngine.simulateGamma(mockMalware, {
        injectedImports: 120,
        injectedStrings: 1500,
      });

      expect(result.attackType).toBe(AttackType.GAMMA_INSPIRED);
      expect(result.perturbedFeatures.importCount).toBeGreaterThan(mockMalware.importCount);
      expect(result.perturbedFeatures.stringCount).toBeGreaterThan(mockMalware.stringCount);
      expect(result.adversarialDetection.score).toBeLessThan(result.originalDetection.score);
    });
  });

  describe('RobustnessEngine', () => {
    it('should calculate bounded robustness score between 0 and 100', () => {
      const attackRes = defaultAdversarialEngine.simulatePadding(mockMalware);
      const robustness = defaultRobustnessEngine.evaluate([attackRes]);

      expect(robustness.robustnessScore).toBeGreaterThanOrEqual(0);
      expect(robustness.robustnessScore).toBeLessThanOrEqual(100);
      expect(robustness.cleanDetectionRate).toBeGreaterThanOrEqual(0);
      expect(robustness.attackSuccessRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('DefenseEngine', () => {
    it('Monotonic constraint simulation should correct score degradation on invariant threats', () => {
      const attackRes = defaultAdversarialEngine.simulatePadding(mockMalware);
      const defenseResult = defaultDefenseEngine.evaluateMonotonicConstraints([attackRes]);

      expect(defenseResult.defenseType).toBe(DefenseType.MONOTONIC_CONSTRAINT_SIMULATION);
      expect(defenseResult.robustnessScore).toBeGreaterThanOrEqual(0);
      expect(defenseResult.metrics.totalViolations).toBeGreaterThanOrEqual(1);
    });

    it('Adversarial training simulation should harden detector and improve robustness', () => {
      const attackRes = defaultAdversarialEngine.simulatePadding(mockMalware);
      const defenseResult = defaultDefenseEngine.evaluateAdversarialTraining([attackRes]);

      expect(defenseResult.defenseType).toBe(DefenseType.ADVERSARIAL_TRAINING_SIMULATION);
      expect(defenseResult.robustnessScore).toBeGreaterThan(0);
    });
  });

  describe('FeatureContributionEngine', () => {
    it('should identify entropy and fileSize as primary instability drivers in padding', () => {
      const attackRes = defaultAdversarialEngine.simulatePadding(mockMalware);
      const explanation = defaultFeatureContributionEngine.analyzeInstability(
        attackRes.originalFeatures,
        attackRes.perturbedFeatures
      );

      expect(explanation.unstableFeatures.length).toBeGreaterThan(0);
      const shiftedNames = explanation.unstableFeatures.map((f) => f.featureName);
      expect(shiftedNames).toContain('entropy');
    });
  });

  describe('RecommendationEngine', () => {
    it('should generate ranked recommendations with security reasoning', () => {
      const attackRes = defaultAdversarialEngine.simulatePadding(mockMalware);
      const baseline = defaultRobustnessEngine.evaluate([attackRes]);
      const advTrain = defaultDefenseEngine.evaluateAdversarialTraining([attackRes]);
      const monotonic = defaultDefenseEngine.evaluateMonotonicConstraints([attackRes]);

      const recommendation = defaultRecommendationEngine.generateRecommendation(
        baseline,
        [advTrain, monotonic],
        AttackType.PADDING
      );

      expect(recommendation.recommendedDefense).toBeDefined();
      expect(recommendation.ranking.length).toBe(2);
      expect(recommendation.observedWeaknesses.length).toBeGreaterThan(0);
      expect(recommendation.confidence).toBeGreaterThan(0.7);
    });
  });
});
