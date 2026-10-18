const express = require('express');
const path = require('path');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const themes = {
    'cyber-glass': { primary: '#00FFD1', accent: '#FF3DDB', background: '#050816', font: 'Orbitron' },
    'matrix-minimal': { primary: '#00FF66', accent: '#003311', background: '#000000', font: 'Courier New' },
    'holographic-quantum': { primary: '#7928CA', accent: '#FF0080', background: '#0B0F19', font: 'Inter' }
  };

  app.get('/api/themes', (req, res) => {
    res.json(themes);
  });

  app.post('/api/sync', (req, res) => {
    const { theme } = req.body;
    if (themes[theme]) {
      res.json({ success: true, syncedTheme: themes[theme], message: `Theme ${theme} erfolgreich an alle Villen synchronisiert.` });
    } else {
      res.status(400).json({ success: false, error: 'Unbekanntes Theme' });
    }
  });

  app.get('/api/audit', (req, res) => {
    res.json({
      score: 94,
      recommendations: [
        'Cyber Glass Glow-Effekte auf CTA-Buttonsverstaerken fuer +18% Conversion',
        'Neon-Border-Cards mit Mikro-Interaktionen ausstatten',
        'Holographic Quantum Kontrast auf mobilen Screens erhoehen'
      ]
    });
  });

  return app;
}

module.exports = createApp;
