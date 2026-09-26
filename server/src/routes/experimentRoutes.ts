import { Router } from 'express';
import { experimentController } from '../controllers/experimentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { runExperimentSchema } from '../validators/experimentValidators.js';

const router = Router();

router.get('/', (req, res, next) => experimentController.getExperiments(req, res, next));
router.get('/:id', (req, res, next) => experimentController.getExperimentById(req, res, next));
router.get('/:id/results', (req, res, next) => experimentController.getExperimentResults(req, res, next));

router.post('/run', authenticateToken, validateBody(runExperimentSchema), (req, res, next) =>
  experimentController.runExperiment(req, res, next)
);

router.post('/clean-eval', authenticateToken, (req, res, next) =>
  experimentController.runCleanEvaluation(req, res, next)
);

export default router;
