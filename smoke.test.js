const http = require('http');
const { createApp } = require('./server.js');

async function runSmokeTests() {
  const { server, port } = await createApp(0);
  console.log('Smoke-Test-Server gestartet auf Port ' + port);

  try {
    // 1. Test GET /api/themes
    const themesRes = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/api/themes`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      }).on('error', reject);
    });

    if (themesRes.status !== 200 || !themesRes.data['cyber-glass']) {
      throw new Error('Smoke Fehler: /api/themes liefert unerwartetes Ergebnis');
    }
    console.log('OK: /api/themes erfolgreich.');

    // 2. Test POST /api/sync
    const syncData = JSON.stringify({ theme: 'cyber-glass' });
    const syncRes = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/api/sync',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(syncData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      });
      req.on('error', reject);
      req.write(syncData);
      req.end();
    });

    if (syncRes.status !== 200 || !syncRes.data.success) {
      throw new Error('Smoke Fehler: /api/sync liefert unerwartetes Ergebnis');
    }
    console.log('OK: /api/sync erfolgreich.');

    // 3. Test Error Case: 404 Not Found
    const notFoundRes = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/api/unknown-endpoint`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }).on('error', reject);
    });

    if (notFoundRes.status !== 404) {
      throw new Error('Smoke Fehler: Fehlerfall (404) wurde nicht korrekt behandelt');
    }
    console.log('OK: Fehlerfall (404) erfolgreich geprüft.');

    console.log('Alle Smoke-Tests erfolgreich bestanden!');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Smoke-Test fehlgeschlagen:', err.message);
    server.close();
    process.exit(1);
  }
}

runSmokeTests();
