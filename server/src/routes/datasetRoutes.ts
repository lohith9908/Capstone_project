import { Router } from 'express';
import { datasetController } from '../controllers/datasetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res, next) => datasetController.getDatasets(req, res, next));
router.get('/:id', (req, res, next) => datasetController.getDatasetById(req, res, next));
router.get('/:id/samples', (req, res, next) => datasetController.getDatasetSamples(req, res, next));

// Protected upload endpoints
router.post('/', authenticateToken, (req, res, next) => datasetController.createDataset(req, res, next));
router.post('/upload-csv', authenticateToken, (req, res, next) => datasetController.uploadCsv(req, res, next));

export default router;
