import { Router } from 'express';
import { detectionController } from '../controllers/detectionController.js';
import { experimentController } from '../controllers/experimentController.js';

const router = Router();

// Detection endpoint
router.post('/detection/analyze', (req, res, next) => detectionController.analyzeFeatureVector(req, res, next));

// Attack endpoints
router.post('/attacks/padding', (req, res, next) => detectionController.simulatePaddingAttack(req, res, next));
router.post('/attacks/gamma', (req, res, next) => detectionController.simulateGammaAttack(req, res, next));

// Explainability endpoint
router.post('/explainability/analyze', (req, res, next) => detectionController.explainInstability(req, res, next));

// Robustness endpoints
router.post('/robustness/evaluate', (req, res, next) => detectionController.evaluateRobustness(req, res, next));
router.get('/robustness/:experimentId', (req, res, next) => detectionController.getRobustnessByExperimentId(req, res, next));

// Defenses & recommendation
router.post('/defenses/adversarial-training', (req, res, next) => detectionController.evaluateAdversarialTrainingDefense(req, res, next));
router.post('/defenses/monotonic', (req, res, next) => detectionController.evaluateMonotonicDefense(req, res, next));
router.get('/defenses/compare', (req, res, next) => detectionController.compareDefenses(req, res, next));
router.post('/defenses/compare', (req, res, next) => detectionController.compareDefenses(req, res, next));
router.post('/recommendation', (req, res, next) => detectionController.getRecommendation(req, res, next));

// Evaluation endpoint
router.post('/evaluation/clean', (req, res, next) => experimentController.runCleanEvaluation(req, res, next));

// Demo endpoint
router.post('/demo/run', (req, res, next) => detectionController.runDemo(req, res, next));

export default router;
