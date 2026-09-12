const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

async function waitForServer(url, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok || res.status === 404) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Server never responded at ${url}`);
}

test('POST /api/chat should respond with medical guidance and context handling', async () => {
  const server = spawn(process.execPath, ['server.js'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: '5174' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await waitForServer('http://127.0.0.1:5174/');

    const response = await fetch('http://127.0.0.1:5174/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I have a cough and mild fever. What should I do?',
        conversation: [
          { sender: 'user', text: 'I have a cough and mild fever.' },
          { sender: 'smriti', text: 'I can help with that.' }
        ],
        includeContext: false,
      })
    });

    assert.equal(response.status, 200, `Expected HTTP 200 but got ${response.status}`);
    const payload = await response.json();
    assert.equal(typeof payload.reply, 'string');
    assert.ok(payload.reply.length > 0);
    assert.ok(/medical|symptom|care|doctor|urgent|emergency/i.test(payload.reply));
  } finally {
    server.kill('SIGTERM');
  }
});
