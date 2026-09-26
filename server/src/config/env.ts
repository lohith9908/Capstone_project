import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();
// In case server is run from workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ares_db',
  JWT_SECRET: process.env.JWT_SECRET || 'ares_super_secure_jwt_secret_key_2026_robustness_eval_sys',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 500,
};
