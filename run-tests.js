import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

// Start the server
const server = spawn('node', ['server.js'], {
  stdio: 'ignore'
});

// Wait for server to start
await setTimeout(2000);

// Run tests
const test = spawn('node', ['--test', 'server.test.js'], {
  stdio: 'inherit'
});

test.on('close', (code) => {
  server.kill();
  process.exit(code);
});
