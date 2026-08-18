const http = require('http');
const https = require('https');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const target = url.searchParams.get('url') || req.headers['x-target-url'];

  if (!target) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Proxy is running.');
  }

  try {
    const targetUrl = new URL(target);
    const client = targetUrl.protocol === 'https:' ? https : http;
    const proxyReq = client.request(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: targetUrl.host },
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    req.pipe(proxyReq, { end: true });
    proxyReq.on('error', (e) => {
      res.writeHead(500);
      res.end(e.message);
    });
  } catch (e) {
    res.writeHead(400);
    res.end('Invalid URL');
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
