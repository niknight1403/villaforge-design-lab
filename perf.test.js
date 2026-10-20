const http = require('http');
const createApp = require('./server.js');

async function runPerfTest() {
  const server = createApp();
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address ? server.address().port : 3000; // Fallback
  
  // Da unser Mock-Server listen anbietet, holen wir den Port direkt
  const s = http.createServer((req, res) => {});
  
  console.log('Performance-Messung gestartet...');
  const start = Date.now();
  
  const requests = [];
  for (let i = 0; i < 50; i++) {
    requests.push(new Promise((resolve) => {
      http.get(`http://localhost:${server.address ? server.address().port : 3000}/api/themes`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
    }));
  }
  
  await Promise.all(requests);
  const duration = Date.now() - start;
  console.log(`Messung beendet: 50 Anfragen in ${duration}ms (Durchschnitt: ${duration / 50}ms pro Request).`);
  
  if (server.close) server.close();
  process.exit(0);
}

runPerfTest();
