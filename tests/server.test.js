const test = require('node:test');
const assert = require('node:assert');
const app = require('../server.js');
const http = require('node:http');

test('API Health Check', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/health`);
  const data = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(data.service, 'VillaForge Design Lab');

  await new Promise((resolve) => server.close(resolve));
});

test('API Themes Abrufen', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/themes`);
  const data = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(data.themes));
  assert.ok(data.themes.length >= 3);

  await new Promise((resolve) => server.close(resolve));
});

test('API CCC Audit Abrufen', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const res = await fetch(`http://localhost:${port}/api/audit/ccc`);
  const data = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(data.score > 90);
  assert.ok(Array.isArray(data.recommendations));

  await new Promise((resolve) => server.close(resolve));
});
