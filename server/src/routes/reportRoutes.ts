import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';

const router = Router();

router.get('/', (req, res, next) => reportController.getReports(req, res, next));
router.post('/generate', (req, res, next) => reportController.generateReport(req, res, next));
router.get('/:id', (req, res, next) => reportController.getReportById(req, res, next));
router.get('/experiment/:experimentId', (req, res, next) => reportController.getReportByExperimentId(req, res, next));

export default router;
