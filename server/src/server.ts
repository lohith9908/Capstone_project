import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  // Connect to persistent MongoDB
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`[ARES Server] Running on http://localhost:${env.PORT}`);
    console.log(`[ARES Server] Environment: ${env.NODE_ENV}`);
  });
};

startServer().catch((err) => {
  console.error('[ARES Server Fatal Error]', err);
  process.exit(1);
});
