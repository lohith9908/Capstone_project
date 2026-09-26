import {
  DefenseType,
  IRecommendationResult,
  IDefenseEvaluationResult,
  IRobustnessEvaluationResult,
  AttackType,
} from '../types/index.js';

export class RecommendationEngine {
  /**
   * Generates dynamic, multi-factor defense recommendations based on actual benchmark results.
   */
  public generateRecommendation(
    baselineRobustness: IRobustnessEvaluationResult,
    defenses: IDefenseEvaluationResult[],
    attackType: AttackType = AttackType.PADDING
  ): IRecommendationResult {
    const weaknesses: string[] = [];

    // Analyze vulnerability patterns
    if (baselineRobustness.attackSuccessRate > 0.40) {
      weaknesses.push(`High evasion vulnerability (${Math.round(baselineRobustness.attackSuccessRate * 100)}% attack success rate) under ${attackType} perturbation.`);
    }
    if (baselineRobustness.detectionRetention < 0.60) {
      weaknesses.push(`Severe detection retention decay: Classifier retained only ${Math.round(baselineRobustness.detectionRetention * 100)}% of baseline malware detections.`);
    }
    if (baselineRobustness.stabilityScore < 0.70) {
      weaknesses.push('High prediction variance: Feature drift causes wide swings in confidence across perturbed samples.');
    }
    if (attackType === AttackType.PADDING) {
      weaknesses.push('Entropy dilution susceptibility: Appended overlay bytes suppress whole-file Shannon entropy detection.');
    } else {
      weaknesses.push('Benign section mimicry: Injected benign imports and string tables deceive static heuristic boundaries.');
    }

    // Rank defenses using multi-objective scoring:
    // Trade-off = (Robustness * 0.55) + (Retention * 0.25) - (Cost * 3) + (100 - AttackSuccessRate * 100) * 0.2
    const rankedList = defenses.map((def) => {
      const robScore = def.robustnessScore;
      const retentionScore = (def.metrics?.detectionRetention ?? 0.8) * 100;
      const costPenalty = (def.estimatedCost ?? 3) * 2.5;
      const evasionReduction = (1 - def.attackSuccessRate) * 100;

      const tradeOffScore = Math.round(
        (robScore * 0.50) +
        (retentionScore * 0.25) +
        (evasionReduction * 0.25) -
        costPenalty
      );

      return {
        defense: def.defenseType,
        score: def.robustnessScore,
        tradeOffScore,
        cost: def.estimatedCost ?? 1,
        retention: retentionScore,
      };
    });

    // Sort descending by trade-off score
    rankedList.sort((a, b) => b.tradeOffScore - a.tradeOffScore);

    const ranking = rankedList.map((item, idx) => ({
      defense: item.defense,
      score: item.score,
      rank: idx + 1,
      tradeOffScore: item.tradeOffScore,
    }));

    const topChoice = ranking[0]?.defense || DefenseType.MONOTONIC_CONSTRAINT_SIMULATION;

    // Build reasoning
    let reasoning = '';
    let confidence = 0.88;

    if (topChoice === DefenseType.MONOTONIC_CONSTRAINT_SIMULATION) {
      reasoning = `Monotonic Constraint Simulation is recommended for the evaluated scenario. It enforces structural non-decreasing penalties on critical malicious indicators (such as suspicious API calls and packing signatures), neutralizing ${attackType} evasion while preserving minimal inference overhead (${rankedList[0]?.cost ?? 3}/10 cost factor).`;
      confidence = 0.91;
    } else if (topChoice === DefenseType.ADVERSARIAL_TRAINING_SIMULATION) {
      reasoning = `Adversarial Training Simulation is recommended. By calibrating decision boundaries with perturbed sample distributions, it delivered the highest raw robustness score (${rankedList[0]?.score ?? 85}/100) and maximized detection retention despite moderate offline retraining overhead.`;
      confidence = 0.86;
    } else {
      reasoning = 'Baseline detection remains operational, but hardening is strongly recommended due to high evasion susceptibility.';
      confidence = 0.70;
    }

    return {
      recommendedDefense: topChoice,
      confidence,
      reasoning,
      observedWeaknesses: weaknesses,
      ranking,
    };
  }
}

export const defaultRecommendationEngine = new RecommendationEngine();
