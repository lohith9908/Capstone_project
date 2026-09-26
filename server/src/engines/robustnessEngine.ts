import {
  IAdversarialResult,
  IRobustnessEvaluationResult,
  SamplePrediction,
} from '../types/index.js';

export class RobustnessEngine {
  /**
   * Calculates overall detector robustness from a batch of adversarial results.
   */
  public evaluate(results: IAdversarialResult[]): IRobustnessEvaluationResult {
    if (results.length === 0) {
      return {
        totalMalwareSamples: 0,
        cleanDetections: 0,
        adversarialDetections: 0,
        cleanDetectionRate: 1.0,
        adversarialDetectionRate: 1.0,
        detectionRetention: 1.0,
        attackSuccessRate: 0.0,
        stabilityScore: 1.0,
        performanceDegradation: 0.0,
        robustnessScore: 100,
        robustnessTier: 'HIGH',
      };
    }

    // Filter malware samples (adversarial evaluation tests malware evasion)
    // If samples don't have label, consider those initially predicted as MALWARE
    const malwareResults = results.filter(
      (r) => r.originalDetection.prediction === SamplePrediction.MALWARE
    );

    const total = malwareResults.length > 0 ? malwareResults.length : results.length;
    const targets = malwareResults.length > 0 ? malwareResults : results;

    let cleanDetections = 0;
    let adversarialDetections = 0;
    let successfulAttacks = 0;
    let totalScoreVariance = 0;

    for (const r of targets) {
      if (r.originalDetection.prediction === SamplePrediction.MALWARE) {
        cleanDetections++;
      }
      if (r.adversarialDetection.prediction === SamplePrediction.MALWARE) {
        adversarialDetections++;
      }
      if (r.attackSuccessful || r.evaded) {
        successfulAttacks++;
      }

      // Stability: measure magnitude of score drift
      const delta = Math.abs(r.scoreDelta);
      totalScoreVariance += Math.min(100, delta);
    }

    const cleanDetectionRate = total > 0 ? cleanDetections / total : 0;
    const adversarialDetectionRate = total > 0 ? adversarialDetections / total : 0;
    const detectionRetention = cleanDetections > 0 ? adversarialDetections / cleanDetections : 0;
    const attackSuccessRate = total > 0 ? successfulAttacks / total : 0;

    // Stability score: 1.0 if scores rarely drifted, 0.0 if scores swung heavily
    const avgDelta = total > 0 ? totalScoreVariance / total : 0;
    const stabilityScore = Math.max(0, Math.min(1.0, 1 - (avgDelta / 100)));

    const performanceDegradation = Math.max(0, cleanDetectionRate - adversarialDetectionRate);

    // Specification formula:
    // robustnessScore = detectionRetention * 0.40 + (1 - attackSuccessRate) * 0.40 + stabilityScore * 0.20
    const rawScore = (detectionRetention * 0.40) + ((1 - attackSuccessRate) * 0.40) + (stabilityScore * 0.20);
    const robustnessScore = Math.round(Math.max(0, Math.min(100, rawScore * 100)) * 10) / 10;

    let robustnessTier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (robustnessScore >= 80) robustnessTier = 'HIGH';
    else if (robustnessScore >= 60) robustnessTier = 'MEDIUM';

    return {
      totalMalwareSamples: total,
      cleanDetections,
      adversarialDetections,
      cleanDetectionRate: Math.round(cleanDetectionRate * 1000) / 1000,
      adversarialDetectionRate: Math.round(adversarialDetectionRate * 1000) / 1000,
      detectionRetention: Math.round(detectionRetention * 1000) / 1000,
      attackSuccessRate: Math.round(attackSuccessRate * 1000) / 1000,
      stabilityScore: Math.round(stabilityScore * 1000) / 1000,
      performanceDegradation: Math.round(performanceDegradation * 1000) / 1000,
      robustnessScore,
      robustnessTier,
    };
  }
}

export const defaultRobustnessEngine = new RobustnessEngine();
