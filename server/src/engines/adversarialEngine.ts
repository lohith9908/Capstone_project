import {
  IFeatureVector,
  AttackType,
  IAdversarialResult,
  SamplePrediction,
} from '../types/index.js';
import { DetectionEngine, defaultDetector } from './detectionEngine.js';

export interface IPaddingAttackOptions {
  paddingSizeBytes?: number; // default 5 MB
  entropyReductionFactor?: number; // 0.1 to 0.5 (e.g. 0.25)
  dataExpansionRatio?: number;
}

export interface IGammaAttackOptions {
  injectedImports?: number; // default 60
  injectedStrings?: number; // default 800
  injectedSections?: number; // default 2
  targetEntropy?: number; // default 5.8
  certificateInjection?: boolean; // default false
}

export class AdversarialEngine {
  private detector: DetectionEngine;

  constructor(detector?: DetectionEngine) {
    this.detector = detector || defaultDetector;
  }

  /**
   * Safe Feature-Level Padding Attack Simulation
   * Simulates binary overlay / slack-space padding by inflating size and reducing overall entropy.
   */
  public simulatePadding(
    original: IFeatureVector,
    options?: IPaddingAttackOptions,
    sampleId?: string
  ): IAdversarialResult {
    const paddingSize = options?.paddingSizeBytes ?? 6 * 1024 * 1024; // 6 MB padding
    const reduction = options?.entropyReductionFactor ?? 0.28;

    const modified: IFeatureVector = { ...original };

    // 1. File size inflation
    modified.fileSize = original.fileSize + paddingSize;

    // 2. Data size expansion
    const dataExpansion = options?.dataExpansionRatio ?? 3.5;
    modified.dataSize = Math.round(original.dataSize * dataExpansion + (paddingSize * 0.8));

    // 3. Entropy dilution (adding zero/repetitive padding lowers whole-file Shannon entropy)
    const currentEntropy = original.entropy;
    const dilutedEntropy = Math.max(3.5, currentEntropy * (1 - reduction));
    modified.entropy = Math.round(dilutedEntropy * 100) / 100;

    // Evaluate before and after
    return this.evaluatePerturbation(original, modified, AttackType.PADDING, sampleId);
  }

  /**
   * Safe Feature-Level GAMMA-inspired Simulation
   * Simulates injection of benign sections, benign APIs, and benign strings.
   */
  public simulateGamma(
    original: IFeatureVector,
    options?: IGammaAttackOptions,
    sampleId?: string
  ): IAdversarialResult {
    const injectedImports = options?.injectedImports ?? 95;
    const injectedStrings = options?.injectedStrings ?? 1200;
    const injectedSections = options?.injectedSections ?? 2;
    const targetEntropy = options?.targetEntropy ?? 5.9;

    const modified: IFeatureVector = { ...original };

    // 1. Benign imports injection
    modified.importCount = original.importCount + injectedImports;
    modified.apiCount = original.apiCount + injectedImports + 40;

    // 2. Benign strings injection
    modified.stringCount = original.stringCount + injectedStrings;

    // 3. Section injection
    modified.sectionCount = Math.min(12, original.sectionCount + injectedSections);

    // 4. Entropy normalization toward benign baseline (~5.9)
    // Pulls high entropy down, or very low entropy up toward average code entropy
    const entropyShift = (targetEntropy - original.entropy) * 0.55;
    modified.entropy = Math.round((original.entropy + entropyShift) * 100) / 100;

    // 5. File size moderate growth
    modified.fileSize = original.fileSize + (800 * 1024); // +800KB benign content
    modified.dataSize = original.dataSize + (450 * 1024);

    if (options?.certificateInjection) {
      modified.certificatePresent = 1;
    }

    return this.evaluatePerturbation(original, modified, AttackType.GAMMA_INSPIRED, sampleId);
  }

  /**
   * Evaluates original vs perturbed feature vector
   */
  private evaluatePerturbation(
    original: IFeatureVector,
    modified: IFeatureVector,
    attackType: AttackType,
    sampleId?: string
  ): IAdversarialResult {
    const originalDetection = this.detector.analyze(original);
    const adversarialDetection = this.detector.analyze(modified);

    // Attack is successful if originally detected as MALWARE, but now classifies as BENIGN (evasion)
    // OR if malware score drops by >= 25 points.
    const scoreDelta = Math.round((adversarialDetection.score - originalDetection.score) * 10) / 10;
    const evaded = originalDetection.prediction === SamplePrediction.MALWARE &&
                   adversarialDetection.prediction === SamplePrediction.BENIGN;
    const attackSuccessful = evaded || (originalDetection.prediction === SamplePrediction.MALWARE && scoreDelta <= -25);

    // Map changed features
    const changedFeatures: Record<string, { original: number; modified: number; delta: number }> = {};
    for (const key of Object.keys(modified)) {
      if (original[key] !== modified[key]) {
        changedFeatures[key] = {
          original: original[key],
          modified: modified[key],
          delta: Math.round((modified[key] - original[key]) * 100) / 100,
        };
      }
    }

    return {
      sampleId,
      originalFeatures: original,
      perturbedFeatures: modified,
      attackType,
      originalDetection,
      adversarialDetection,
      attackSuccessful,
      evaded,
      scoreDelta,
      changedFeatures,
    };
  }
}

export const defaultAdversarialEngine = new AdversarialEngine();
