import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateBody(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => authController.getMe(req, res, next));

export default router;
