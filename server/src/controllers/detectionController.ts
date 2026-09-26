import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import {
  defaultDetector,
  defaultAdversarialEngine,
  defaultFeatureContributionEngine,
  defaultDefenseEngine,
  defaultRobustnessEngine,
  defaultRecommendationEngine,
} from '../engines/index.js';
import { IFeatureVector, AttackType, DefenseType, SampleLabel, Role } from '../types/index.js';
import { Dataset, DatasetSample, Experiment, User } from '../models/index.js';
import { experimentService } from '../services/experimentService.js';
import { AppError } from '../middleware/errorHandler.js';

const DEFAULT_SAMPLE_MALWARE: IFeatureVector = {
  fileSize: 450000,
  entropy: 7.45,
  sectionCount: 5,
  importCount: 8,
  exportCount: 0,
  resourceCount: 2,
  stringCount: 65,
  apiCount: 16,
  headerSize: 1024,
  codeSize: 130000,
  dataSize: 310000,
  imageCount: 0,
  certificatePresent: 0,
  suspiciousApiCount: 4,
  packedIndicator: 1,
};

export class DetectionController {
  public async analyzeFeatureVector(req: Request, res: Response, next: NextFunction) {
    try {
      const features = (req.body.features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const result = defaultDetector.analyze(features);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async simulatePaddingAttack(req: Request, res: Response, next: NextFunction) {
    try {
      const { features, options } = req.body;
      const vector = (features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const result = defaultAdversarialEngine.simulatePadding(vector, options);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async simulateGammaAttack(req: Request, res: Response, next: NextFunction) {
    try {
      const { features, options } = req.body;
      const vector = (features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const result = defaultAdversarialEngine.simulateGamma(vector, options);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async explainInstability(req: Request, res: Response, next: NextFunction) {
    try {
      const { cleanFeatures, adversarialFeatures } = req.body;
      const cVector = (cleanFeatures || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const aVector = (adversarialFeatures || {
        ...DEFAULT_SAMPLE_MALWARE,
        fileSize: 6800000,
        entropy: 5.25,
      }) as IFeatureVector;
      const analysis = defaultFeatureContributionEngine.analyzeInstability(cVector, aVector);
      res.json({ success: true, data: analysis });
    } catch (err) {
      next(err);
    }
  }

  public async evaluateRobustness(req: Request, res: Response, next: NextFunction) {
    try {
      const { experimentId, datasetId, features, attackType, options } = req.body;

      if (experimentId) {
        const experiment = await experimentService.getExperimentById(experimentId);
        return res.json({
          success: true,
          data: {
            experimentId: experiment._id,
            robustnessScore: experiment.robustnessScore,
            attackSuccessRate: experiment.attackSuccessRate,
            detectionRetention: experiment.detectionRetention,
            summary: experiment.summary,
          },
        });
      }

      if (datasetId) {
        const samples = await DatasetSample.find({ datasetId: new Types.ObjectId(datasetId) });
        if (samples.length > 0) {
          const type = attackType || AttackType.PADDING;
          const advResults = samples.map((s) =>
            type === AttackType.GAMMA_INSPIRED
              ? defaultAdversarialEngine.simulateGamma(s.features as IFeatureVector, options, s._id.toString())
              : defaultAdversarialEngine.simulatePadding(s.features as IFeatureVector, options, s._id.toString())
          );
          const robustness = defaultRobustnessEngine.evaluate(advResults);
          return res.json({ success: true, data: robustness });
        }
      }

      const vector = (features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const type = attackType || AttackType.PADDING;
      const advResult =
        type === AttackType.GAMMA_INSPIRED
          ? defaultAdversarialEngine.simulateGamma(vector, options)
          : defaultAdversarialEngine.simulatePadding(vector, options);
      const robustness = defaultRobustnessEngine.evaluate([advResult]);

      res.json({ success: true, data: robustness });
    } catch (err) {
      next(err);
    }
  }

  public async getRobustnessByExperimentId(req: Request, res: Response, next: NextFunction) {
    try {
      const { experimentId } = req.params;
      const experiment = await experimentService.getExperimentById(experimentId);
      res.json({
        success: true,
        data: {
          experimentId: experiment._id,
          name: experiment.name,
          attackType: experiment.attackType,
          robustnessScore: experiment.robustnessScore,
          attackSuccessRate: experiment.attackSuccessRate,
          detectionRetention: experiment.detectionRetention,
          summary: experiment.summary,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async evaluateAdversarialTrainingDefense(req: Request, res: Response, next: NextFunction) {
    try {
      const { features, attackType, options } = req.body;
      const vector = (features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const type = attackType || AttackType.PADDING;
      const advResult =
        type === AttackType.GAMMA_INSPIRED
          ? defaultAdversarialEngine.simulateGamma(vector, options)
          : defaultAdversarialEngine.simulatePadding(vector, options);

      const defense = defaultDefenseEngine.evaluateAdversarialTraining([advResult]);
      res.json({ success: true, data: defense });
    } catch (err) {
      next(err);
    }
  }

  public async evaluateMonotonicDefense(req: Request, res: Response, next: NextFunction) {
    try {
      const { features, attackType, options } = req.body;
      const vector = (features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const type = attackType || AttackType.PADDING;
      const advResult =
        type === AttackType.GAMMA_INSPIRED
          ? defaultAdversarialEngine.simulateGamma(vector, options)
          : defaultAdversarialEngine.simulatePadding(vector, options);

      const defense = defaultDefenseEngine.evaluateMonotonicConstraints([advResult]);
      res.json({ success: true, data: defense });
    } catch (err) {
      next(err);
    }
  }

  public async compareDefenses(req: Request, res: Response, next: NextFunction) {
    try {
      const features = (req.body?.features || req.query?.features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const attackType = (req.body?.attackType || req.query?.attackType || AttackType.PADDING) as AttackType;

      // Generate simulation sample
      const advResult =
        attackType === AttackType.GAMMA_INSPIRED
          ? defaultAdversarialEngine.simulateGamma(features)
          : defaultAdversarialEngine.simulatePadding(features);

      const baselineRobustness = defaultRobustnessEngine.evaluate([advResult]);
      const advTrainDefense = defaultDefenseEngine.evaluateAdversarialTraining([advResult]);
      const monotonicDefense = defaultDefenseEngine.evaluateMonotonicConstraints([advResult]);

      const baselineDefense = {
        defenseType: DefenseType.BASELINE,
        cleanDetectionRate: baselineRobustness.cleanDetectionRate,
        adversarialDetectionRate: baselineRobustness.adversarialDetectionRate,
        attackSuccessRate: baselineRobustness.attackSuccessRate,
        robustnessScore: baselineRobustness.robustnessScore,
        processingTimeMs: 3,
        estimatedCost: 1,
        improvementPercentage: 0,
        metrics: {
          detectionRetention: baselineRobustness.detectionRetention,
          stabilityScore: baselineRobustness.stabilityScore,
        },
      };

      const recommendation = defaultRecommendationEngine.generateRecommendation(
        baselineRobustness,
        [baselineDefense, advTrainDefense, monotonicDefense],
        attackType
      );

      res.json({
        success: true,
        data: {
          defenses: [baselineDefense, advTrainDefense, monotonicDefense],
          recommendation,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async getRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const features = (req.body?.features || DEFAULT_SAMPLE_MALWARE) as IFeatureVector;
      const attackType = (req.body?.attackType || AttackType.PADDING) as AttackType;

      const advResult =
        attackType === AttackType.GAMMA_INSPIRED
          ? defaultAdversarialEngine.simulateGamma(features)
          : defaultAdversarialEngine.simulatePadding(features);

      const baselineRobustness = defaultRobustnessEngine.evaluate([advResult]);
      const advTrainDefense = defaultDefenseEngine.evaluateAdversarialTraining([advResult]);
      const monotonicDefense = defaultDefenseEngine.evaluateMonotonicConstraints([advResult]);

      const baselineDefense = {
        defenseType: DefenseType.BASELINE,
        cleanDetectionRate: baselineRobustness.cleanDetectionRate,
        adversarialDetectionRate: baselineRobustness.adversarialDetectionRate,
        attackSuccessRate: baselineRobustness.attackSuccessRate,
        robustnessScore: baselineRobustness.robustnessScore,
        processingTimeMs: 3,
        estimatedCost: 1,
        improvementPercentage: 0,
        metrics: {
          detectionRetention: baselineRobustness.detectionRetention,
          stabilityScore: baselineRobustness.stabilityScore,
        },
      };

      const recommendation = defaultRecommendationEngine.generateRecommendation(
        baselineRobustness,
        [baselineDefense, advTrainDefense, monotonicDefense],
        attackType
      );

      res.json({ success: true, data: recommendation });
    } catch (err) {
      next(err);
    }
  }

  public async runDemo(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Find or create an owner user
      let user = await User.findOne({ role: Role.ADMIN });
      if (!user) {
        user = await User.findOne();
      }
      if (!user) {
        user = await User.create({
          name: 'ARES System Administrator',
          email: 'admin@ares.security',
          passwordHash: 'dummy-hash',
          role: Role.ADMIN,
        });
      }

      // 2. Find or create Demo Dataset
      let dataset = await Dataset.findOne({ isDemo: true });
      if (!dataset) {
        dataset = await Dataset.findOne();
      }

      if (!dataset) {
        // Create demo dataset with synthetic samples
        dataset = await Dataset.create({
          name: 'ARES PE Malware Robustness Benchmark (Demo)',
          description: 'Synthetic benchmark dataset of 50 malware and 50 benign Portable Executable feature vectors.',
          source: 'ARES Synthetic Generator',
          sampleCount: 10,
          featureCount: 15,
          isDemo: true,
          ownerId: user._id,
        });

        // Add balanced samples
        const demoSamples = [
          { datasetId: dataset._id, label: SampleLabel.MALWARE, features: DEFAULT_SAMPLE_MALWARE },
          {
            datasetId: dataset._id,
            label: SampleLabel.MALWARE,
            features: { ...DEFAULT_SAMPLE_MALWARE, entropy: 7.8, suspiciousApiCount: 6, packedIndicator: 1 },
          },
          {
            datasetId: dataset._id,
            label: SampleLabel.BENIGN,
            features: {
              ...DEFAULT_SAMPLE_MALWARE,
              fileSize: 3200000,
              entropy: 5.4,
              importCount: 140,
              stringCount: 1900,
              certificatePresent: 1,
              suspiciousApiCount: 0,
              packedIndicator: 0,
            },
          },
        ];
        await DatasetSample.insertMany(demoSamples);
      }

      // 3. Run Experiment
      const experiment = await experimentService.runExperiment(user._id.toString(), {
        name: `Automated Demonstration Run - ${new Date().toLocaleTimeString()}`,
        datasetId: dataset._id.toString(),
        attackType: req.body?.attackType || AttackType.PADDING,
        options: req.body?.options || {},
      });

      // 4. Retrieve full results
      const results = await experimentService.getExperimentFullResults(experiment._id.toString());
      res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }
}

export const detectionController = new DetectionController();
