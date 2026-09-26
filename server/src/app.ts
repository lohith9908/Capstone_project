import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this client, please try again later.',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Body parser (reject huge payloads)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      system: 'ARES — Automated Robustness Evaluation System',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/datasets', datasetRoutes);
  app.use('/api/experiments', experimentRoutes);
  app.use('/api', detectionRoutes); // /api/detection, /api/attacks, /api/explainability, /api/defenses
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
