const express = require('express');
const http = require('http');
const app = express();

const PORT = 3001;
const TARGET_URL = 'http://localhost:8000/contacts.php';

app.use(express.json());

// CORS for React dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'Proxy alive' });
});


app.all('/api/contacts', (req, res) => {
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
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  });

  if (req.method === 'POST' || req.method === 'DELETE') {
    req.pipe(proxy);
  } else {
    proxy.end();
  }
});

app.listen(PORT, () => {
  console.log(`🧩 Proxy running at http://localhost:${PORT}`);
});
