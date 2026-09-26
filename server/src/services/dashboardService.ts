import { Dataset, DatasetSample, Experiment, Recommendation, AttackResult } from '../models/index.js';
import { ExperimentStatus, AttackType, DefenseType } from '../types/index.js';

export class DashboardService {
  public async getDashboardMetrics() {
    const [
      totalDatasets,
      totalSamples,
      totalExperiments,
      completedExperiments,
      recentExperiments,
      recommendations,
      paddingAttacks,
      gammaAttacks,
    ] = await Promise.all([
      Dataset.countDocuments(),
      DatasetSample.countDocuments(),
      Experiment.countDocuments(),
      Experiment.find({ status: ExperimentStatus.COMPLETED }).select('robustnessScore attackSuccessRate detectionRetention attackType'),
      Experiment.find().populate('datasetId', 'name').sort({ createdAt: -1 }).limit(5),
      Recommendation.find().select('recommendedDefense'),
      AttackResult.countDocuments({ attackType: AttackType.PADDING, attackSuccessful: true }),
      AttackResult.countDocuments({ attackType: AttackType.GAMMA_INSPIRED, attackSuccessful: true }),
    ]);

    // Average Robustness Score
    let avgRobustness = 0;
    let avgRetention = 0;
    let avgAttackSuccess = 0;

    if (completedExperiments.length > 0) {
      const sumRob = completedExperiments.reduce((acc, curr) => acc + (curr.robustnessScore || 0), 0);
      const sumRet = completedExperiments.reduce((acc, curr) => acc + (curr.detectionRetention || 0), 0);
      const sumAtk = completedExperiments.reduce((acc, curr) => acc + (curr.attackSuccessRate || 0), 0);

      avgRobustness = Math.round((sumRob / completedExperiments.length) * 10) / 10;
      avgRetention = Math.round((sumRet / completedExperiments.length) * 100);
      avgAttackSuccess = Math.round((sumAtk / completedExperiments.length) * 100);
    }

    // Defense recommendation counts
    const defenseCounts: Record<string, number> = {
      [DefenseType.MONOTONIC_CONSTRAINT_SIMULATION]: 0,
      [DefenseType.ADVERSARIAL_TRAINING_SIMULATION]: 0,
    };
    recommendations.forEach((r) => {
      if (defenseCounts[r.recommendedDefense] !== undefined) {
        defenseCounts[r.recommendedDefense]++;
      }
    });

    return {
      summary: {
        totalDatasets,
        totalSamples,
        totalExperiments,
        averageRobustnessScore: avgRobustness,
        averageDetectionRetention: avgRetention,
        averageAttackSuccessRate: avgAttackSuccess,
      },
      defenseDistribution: defenseCounts,
      attackStats: {
        successfulPaddingAttacks: paddingAttacks,
        successfulGammaAttacks: gammaAttacks,
      },
      recentExperiments,
    };
  }
}

export const dashboardService = new DashboardService();
