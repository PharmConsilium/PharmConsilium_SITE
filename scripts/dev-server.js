// Local dev server with SPA fallback (History API routes like /directory, /team).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const rel = decoded.replace(/^\/+/, '').split('/').join(path.sep);
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) return null;
  return file;
}

function send(res, status, body, type) {
  const headers = { 'Content-Type': type || 'text/plain; charset=utf-8' };
  if (Buffer.isBuffer(body)) headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(body);
}

function tryFile(filePath, cb) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return cb(null);
    fs.readFile(filePath, cb);
  });
}

const server = http.createServer((req, res) => {
  let urlPath = new URL(req.url, `http://127.0.0.1:${PORT}`).pathname;
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const file = safePath(urlPath);
  if (!file) return send(res, 403, 'Forbidden');

  tryFile(file, (err, data) => {
    if (data) {
      const ext = path.extname(file).toLowerCase();
      return send(res, 200, data, MIME[ext] || 'application/octet-stream');
    }
    const index = path.join(ROOT, 'index.html');
    tryFile(index, (e2, html) => {
      if (e2 || !html) return send(res, 404, 'Not found');
      send(res, 200, html, MIME['.html']);
    });
  });
});

server.listen(PORT, () => {
  console.log(`PharmConsilium dev server: http://localhost:${PORT}/`);
  console.log('SPA routes: /directory, /team, /marketing/crm, etc.');
});
