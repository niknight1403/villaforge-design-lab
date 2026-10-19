const http = require('http');
const app = require('./server.js');

const appInstance = app();
const server = http.createServer((req, res) => {
  // Da app() einen mock server oder ein app-Objekt liefert, starten wir hier direkt
});
server.close();

// Korrekter Teststart mit createApp
const testApp = app();
// Wir binden an einen Testport
const s = testApp.listen(0, async () => {
  const port = s.address().port;
  console.log(`Test-Server gestartet auf Port ${port}`);
  try {
    const res = await fetch(`http://localhost:${port}/api/themes`);
    const data = await res.json();
    console.log('API Themes Response:', data);
    
    const syncRes = await fetch(`http://localhost:${port}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: 'cyber-glass' })
    });
    const syncData = await syncRes.json();
    console.log('API Sync Response:', syncData);

    if (data && syncData.success) {
      console.log('Alle Tests erfolgreich bestanden!');
      s.close();
      process.exit(0);
    } else {
      console.error('Test fehlgeschlagen: Unerwartete Antwort');
      s.close();
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Fehler:', err);
    s.close();
    process.exit(1);
  }
});
server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test-Server gestartet auf Port ${port}`);
  
  try {
    const res = await fetch(`http://localhost:${port}/api/themes`);
    const data = await res.json();
    console.log('API Themes Response:', data);
    
    const syncRes = await fetch(`http://localhost:${port}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: 'cyber-glass' })
    });
    const syncData = await syncRes.json();
    console.log('API Sync Response:', syncData);

    if (data && syncData.success) {
      console.log('Alle Tests erfolgreich bestanden!');
      process.exit(0);
    } else {
      console.error('Test fehlgeschlagen: Unerwartete Antwort');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Fehler:', err);
    process.exit(1);
  }
});
