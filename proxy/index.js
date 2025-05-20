const express = require('express');
const http = require('http');
const app = express();

const PORT = 3001;
const TARGET_URL = 'http://localhost:8000/contacts.php';

app.use(express.json());

// Improved CORS Middleware with OPTIONS support
app.use((req, res, next) => {
  const origin = req.headers.origin || 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight success
  }

  next();
});

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ status: 'Proxy alive', timestamp: Date.now() });
});

// Proxy route for contacts API
app.all('/api/contacts', (req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} → /api/contacts`);

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/contacts.php',
    method: req.method,
    headers: {
      'Content-Type': req.get('Content-Type') || 'application/json'
    }
  };

  const proxy = http.request(options, proxyRes => {
    let data = '';
    proxyRes.on('data', chunk => (data += chunk));
    proxyRes.on('end', () => {
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxy.on('error', err => {
    console.error(`❌ Proxy error: ${err.message}`);
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  });

  if (req.method === 'POST' || req.method === 'DELETE') {
    req.pipe(proxy);
  } else {
    proxy.end();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
