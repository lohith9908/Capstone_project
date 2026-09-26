import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/', (req, res, next) => dashboardController.getDashboardData(req, res, next));

export default router;
