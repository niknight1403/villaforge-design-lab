const http = require('http');

function createApp() {
  return {
    listen: (port, cb) => {
      const s = http.createServer((req, res) => {
        if (req.url === '/api/themes') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            'cyber-glass': { primary: '#00FFD1', accent: '#FF3DDB', background: '#050816', font: 'Orbitron' },
            'matrix-minimal': { primary: '#00FF66', accent: '#003311', background: '#000000', font: 'Courier New' },
            'holographic-quantum': { primary: '#7928CA', accent: '#FF0080', background: '#0B0F19', font: 'Inter' }
          }));
        } else if (req.url === '/api/sync' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, syncedTheme: { primary: '#00FFD1' } }));
          });
        } else if (req.url === '/api/audit') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ score: 94, recommendations: ['Cyber Glass Glow-Effekte verstaerken'] }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not Found' }));
        }
      });
      s.listen(port, cb);
      return s;
    }
  };
}

module.exports = createApp;
