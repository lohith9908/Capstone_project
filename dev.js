import { spawn } from 'child_process';

console.log('====================================================');
console.log('  ARES — Automated Robustness Evaluation System     ');
console.log('  Launching Backend API (:5000) & Vite Client (:5173)');
console.log('====================================================\n');

// 1. Launch Backend Express API Server
const server = spawn('npm', ['run', 'dev', '--workspace=server'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Launch Frontend Vite Client Server
const client = spawn('npm', ['run', 'dev', '--workspace=client'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n[ARES Launcher] Shutting down services...');
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('error', (err) => {
  console.error('[ARES Launcher] Server error:', err);
});

client.on('error', (err) => {
  console.error('[ARES Launcher] Client error:', err);
});
