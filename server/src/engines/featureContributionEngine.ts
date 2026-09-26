import {
  IFeatureVector,
  ContributionDirection,
  IFeatureContributionItem,
} from '../types/index.js';
import { defaultDetector } from './detectionEngine.js';

export interface IFeatureInstabilityAnalysis {
  featureName: string;
  cleanValue: number;
  adversarialValue: number;
  cleanContribution: number;
  adversarialContribution: number;
  contributionShift: number; // cleanContribution - advContribution
  relativeInstability: number; // 0 to 1
  direction: ContributionDirection;
  vulnerabilityReason: string;
}

export class FeatureContributionEngine {
  /**
   * Explains how feature values contributed to clean vs adversarial scores.
   * Compares the shifts in deterministic contributions to highlight detector blind spots.
   */
  public analyzeInstability(
    cleanFeatures: IFeatureVector,
    adversarialFeatures: IFeatureVector
  ): {
    cleanContributions: IFeatureContributionItem[];
    adversarialContributions: IFeatureContributionItem[];
    unstableFeatures: IFeatureInstabilityAnalysis[];
    primaryEvasionDriver: string;
  } {
    const cleanDetection = defaultDetector.analyze(cleanFeatures);
    const advDetection = defaultDetector.analyze(adversarialFeatures);

    const cleanMap = new Map(cleanDetection.featureContributions.map((c) => [c.featureName, c]));
    const advMap = new Map(advDetection.featureContributions.map((c) => [c.featureName, c]));

    const allKeys = Array.from(new Set([...cleanMap.keys(), ...advMap.keys()]));
    const unstableFeatures: IFeatureInstabilityAnalysis[] = [];

    for (const key of allKeys) {
      const c = cleanMap.get(key) || { contribution: 0, direction: ContributionDirection.NEUTRAL };
      const a = advMap.get(key) || { contribution: 0, direction: ContributionDirection.NEUTRAL };

      const cleanVal = cleanFeatures[key] ?? 0;
      const advVal = adversarialFeatures[key] ?? 0;
      const shift = Math.round((c.contribution - a.contribution) * 10) / 10;

      let reason = 'Stable across transformation';
      if (key === 'entropy' && Math.abs(shift) >= 10) {
        reason = 'Entropy dilution: Benign padding reduced overall byte variance, neutralizing packing detection.';
      } else if (key === 'fileSize' && Math.abs(shift) >= 5) {
        reason = 'File size inflation: Massive overlay byte insertion caused size-based score penalty attenuation.';
      } else if (key === 'importCount' && Math.abs(shift) >= 8) {
        reason = 'Benign API injection: High volume of legitimate imports falsely biased the classifier toward benign profile.';
      } else if (key === 'stringCount' && Math.abs(shift) >= 6) {
        reason = 'String flooding: Large corpus of benign English strings diluted malicious signature density.';
      } else if (Math.abs(shift) >= 5) {
        reason = `Value shifted by ${advVal - cleanVal}, altering risk contribution by ${shift} points.`;
      }

      unstableFeatures.push({
        featureName: key,
        cleanValue: cleanVal,
        adversarialValue: advVal,
        cleanContribution: c.contribution,
        adversarialContribution: a.contribution,
        contributionShift: shift,
        relativeInstability: Math.min(1.0, Math.abs(shift) / 30),
        direction: shift > 0 ? ContributionDirection.NEGATIVE : ContributionDirection.POSITIVE,
        vulnerabilityReason: reason,
      });
    }

    // Sort by absolute contribution shift descending (largest blind spots first)
    unstableFeatures.sort((a, b) => Math.abs(b.contributionShift) - Math.abs(a.contributionShift));

    const primaryEvasionDriver = unstableFeatures.length > 0 && Math.abs(unstableFeatures[0].contributionShift) > 5
      ? `${unstableFeatures[0].featureName} shift (${unstableFeatures[0].contributionShift > 0 ? '-' : '+'}${Math.abs(unstableFeatures[0].contributionShift)} pts)`
      : 'Distributed multi-feature perturbation';

    return {
      cleanContributions: cleanDetection.featureContributions,
      adversarialContributions: advDetection.featureContributions,
      unstableFeatures,
      primaryEvasionDriver,
    };
  }
}

export const defaultFeatureContributionEngine = new FeatureContributionEngine();
