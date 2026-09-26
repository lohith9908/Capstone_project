import { Types } from 'mongoose';
import {
  Experiment,
  AttackResult,
  DefenseResult,
  FeatureContribution,
  Recommendation,
  Report,
  Dataset,
  DatasetSample,
} from '../models/index.js';
import {
  ExperimentStatus,
  AttackType,
  DefenseType,
  SamplePrediction,
  IFeatureVector,
  IAdversarialResult,
  SampleLabel,
} from '../types/index.js';
import {
  defaultDetector,
  defaultAdversarialEngine,
  defaultRobustnessEngine,
  defaultDefenseEngine,
  defaultFeatureContributionEngine,
  defaultRecommendationEngine,
} from '../engines/index.js';
import { AppError } from '../middleware/errorHandler.js';

export class ExperimentService {
  /**
   * Orchestrates an end-to-end evaluation experiment across a dataset
   */
  public async runExperiment(
    userId: string,
    data: {
      name: string;
      datasetId: string;
      attackType: AttackType;
      options?: Record<string, any>;
    }
  ) {
    const dataset = await Dataset.findById(data.datasetId);
    if (!dataset) {
      throw new AppError('Dataset not found', 404, 'DATASET_NOT_FOUND');
    }

    // 1. Create Experiment record in RUNNING status
    const experiment = await Experiment.create({
      name: data.name,
      status: ExperimentStatus.RUNNING,
      datasetId: dataset._id,
      userId: new Types.ObjectId(userId),
      attackType: data.attackType,
      configuration: data.options || {},
    });

    try {
      // 2. Fetch dataset samples
      const samples = await DatasetSample.find({ datasetId: dataset._id });
      if (samples.length === 0) {
        throw new AppError('Dataset contains no samples to evaluate', 400, 'EMPTY_DATASET');
      }

      // 3. Run Adversarial Simulation on each sample
      const adversarialResults: IAdversarialResult[] = [];
      const attackDocs: any[] = [];

      for (const sample of samples) {
        const features = sample.features as IFeatureVector;
        let advResult: IAdversarialResult;

        if (data.attackType === AttackType.GAMMA_INSPIRED) {
          advResult = defaultAdversarialEngine.simulateGamma(features, data.options, sample._id.toString());
        } else {
          advResult = defaultAdversarialEngine.simulatePadding(features, data.options, sample._id.toString());
        }

        adversarialResults.push(advResult);

        attackDocs.push({
          experimentId: experiment._id,
          attackType: data.attackType,
          sampleId: sample._id.toString(),
          originalPrediction: advResult.originalDetection.prediction,
          adversarialPrediction: advResult.adversarialDetection.prediction,
          originalScore: advResult.originalDetection.score,
          adversarialScore: advResult.adversarialDetection.score,
          attackSuccessful: advResult.attackSuccessful,
          changedFeatures: advResult.changedFeatures,
        });
      }

      // Insert all attack results
      await AttackResult.insertMany(attackDocs);

      // 4. Compute Robustness Metrics
      const robustness = defaultRobustnessEngine.evaluate(adversarialResults);

      // 5. Evaluate Defenses
      const advTrainDefense = defaultDefenseEngine.evaluateAdversarialTraining(adversarialResults);
      const monotonicDefense = defaultDefenseEngine.evaluateMonotonicConstraints(adversarialResults);

      // Baseline pseudo-defense entry for comparative visualization
      const baselineDefense = {
        defenseType: DefenseType.BASELINE,
        cleanDetectionRate: robustness.cleanDetectionRate,
        adversarialDetectionRate: robustness.adversarialDetectionRate,
        attackSuccessRate: robustness.attackSuccessRate,
        robustnessScore: robustness.robustnessScore,
        processingTimeMs: 4,
        estimatedCost: 1,
        improvementPercentage: 0,
        metrics: {
          detectionRetention: robustness.detectionRetention,
          stabilityScore: robustness.stabilityScore,
        },
      };

      await DefenseResult.insertMany([
        { ...baselineDefense, experimentId: experiment._id },
        { ...advTrainDefense, experimentId: experiment._id },
        { ...monotonicDefense, experimentId: experiment._id },
      ]);

      // 6. Compute Feature Contributions and Instability
      // Sample representative malware instance for explainability
      const sampleToExplain = adversarialResults.find(
        (r) => r.originalDetection.prediction === SamplePrediction.MALWARE
      ) || adversarialResults[0];

      const explainability = defaultFeatureContributionEngine.analyzeInstability(
        sampleToExplain.originalFeatures,
        sampleToExplain.perturbedFeatures
      );

      const contributionDocs = explainability.unstableFeatures.map((f) => ({
        experimentId: experiment._id,
        featureName: f.featureName,
        originalValue: f.cleanValue,
        modifiedValue: f.adversarialValue,
        contribution: f.cleanContribution,
        importance: f.relativeInstability * 10,
        direction: f.direction,
      }));

      await FeatureContribution.insertMany(contributionDocs);

      // 7. Generate Dynamic Recommendations
      const recommendation = defaultRecommendationEngine.generateRecommendation(
        robustness,
        [baselineDefense, advTrainDefense, monotonicDefense],
        data.attackType
      );

      await Recommendation.create({
        experimentId: experiment._id,
        recommendedDefense: recommendation.recommendedDefense,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        observedWeaknesses: recommendation.observedWeaknesses,
        ranking: recommendation.ranking,
      });

      // 8. Generate Audit Report
      await Report.create({
        experimentId: experiment._id,
        title: `Robustness Audit Report: ${experiment.name}`,
        reportData: {
          experimentName: experiment.name,
          datasetName: dataset.name,
          sampleCount: samples.length,
          attackType: data.attackType,
          robustnessScore: robustness.robustnessScore,
          robustnessTier: robustness.robustnessTier,
          cleanDetectionRate: robustness.cleanDetectionRate,
          adversarialDetectionRate: robustness.adversarialDetectionRate,
          attackSuccessRate: robustness.attackSuccessRate,
          detectionRetention: robustness.detectionRetention,
          stabilityScore: robustness.stabilityScore,
          recommendedDefense: recommendation.recommendedDefense,
          recommendationConfidence: recommendation.confidence,
          reasoning: recommendation.reasoning,
          observedWeaknesses: recommendation.observedWeaknesses,
          defenses: [baselineDefense, advTrainDefense, monotonicDefense],
          primaryEvasionDriver: explainability.primaryEvasionDriver,
        },
      });

      // 9. Update Experiment record to COMPLETED
      experiment.status = ExperimentStatus.COMPLETED;
      experiment.robustnessScore = robustness.robustnessScore;
      experiment.attackSuccessRate = robustness.attackSuccessRate;
      experiment.detectionRetention = robustness.detectionRetention;
      experiment.summary = {
        cleanDetectionRate: robustness.cleanDetectionRate,
        adversarialDetectionRate: robustness.adversarialDetectionRate,
        stabilityScore: robustness.stabilityScore,
        robustnessTier: robustness.robustnessTier,
        recommendedDefense: recommendation.recommendedDefense,
      };
      await experiment.save();

      return experiment;
    } catch (err: any) {
      experiment.status = ExperimentStatus.FAILED;
      experiment.summary = { error: err.message };
      await experiment.save();
      throw err;
    }
  }

  public async getExperiments() {
    return Experiment.find().populate('datasetId', 'name sampleCount').sort({ createdAt: -1 });
  }

  public async getExperimentById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid Experiment ID', 400, 'INVALID_ID');
    }
    const experiment = await Experiment.findById(id).populate('datasetId', 'name sampleCount');
    if (!experiment) {
      throw new AppError('Experiment not found', 404, 'NOT_FOUND');
    }
    return experiment;
  }

  public async getExperimentFullResults(id: string) {
    const experiment = await this.getExperimentById(id);

    const [attackResults, defenseResults, featureContributions, recommendation, report] =
      await Promise.all([
        AttackResult.find({ experimentId: experiment._id }).limit(100),
        DefenseResult.find({ experimentId: experiment._id }),
        FeatureContribution.find({ experimentId: experiment._id }),
        Recommendation.findOne({ experimentId: experiment._id }),
        Report.findOne({ experimentId: experiment._id }),
      ]);

    return {
      experiment,
      attackResults,
      defenseResults,
      featureContributions,
      recommendation,
      report,
    };
  }

  /**
   * Runs clean baseline evaluation against a dataset
   */
  public async runCleanEvaluation(datasetId: string) {
    const samples = await DatasetSample.find({ datasetId: new Types.ObjectId(datasetId) });
    if (samples.length === 0) {
      throw new AppError('No samples found in dataset', 400, 'EMPTY_DATASET');
    }

    let tp = 0;
    let tn = 0;
    let fp = 0;
    let fn = 0;
    const predictions: any[] = [];

    for (const s of samples) {
      const result = defaultDetector.analyze(s.features as IFeatureVector);
      const isMalware = s.label === SampleLabel.MALWARE;
      const predMalware = result.prediction === SamplePrediction.MALWARE;

      if (isMalware && predMalware) tp++;
      else if (!isMalware && !predMalware) tn++;
      else if (!isMalware && predMalware) fp++;
      else if (isMalware && !predMalware) fn++;

      predictions.push({
        sampleId: s._id,
        trueLabel: s.label,
        predictedLabel: result.prediction,
        score: result.score,
        riskLevel: result.riskLevel,
      });
    }

    const total = samples.length;
    const accuracy = total > 0 ? (tp + tn) / total : 0;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    const f1 = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
    const falsePositiveRate = (fp + tn) > 0 ? fp / (fp + tn) : 0;

    return {
      confusionMatrix: { tp, tn, fp, fn },
      metrics: {
        totalSamples: total,
        accuracy: Math.round(accuracy * 1000) / 1000,
        precision: Math.round(precision * 1000) / 1000,
        recall: Math.round(recall * 1000) / 1000,
        f1: Math.round(f1 * 1000) / 1000,
        detectionRate: Math.round(recall * 1000) / 1000,
        falsePositiveRate: Math.round(falsePositiveRate * 1000) / 1000,
      },
      predictions: predictions.slice(0, 50),
    };
  }
}

export const experimentService = new ExperimentService();
