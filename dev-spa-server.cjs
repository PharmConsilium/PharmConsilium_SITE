/**
 * Minimal static server for SPA History API:
 * - Serves real files as-is
 * - Falls back to `index.html` for unknown routes like `/marketing/crm`
 *
 * Usage:
 *   node dev-spa-server.cjs 13000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = Number(process.argv[2] || process.env.PORT || 13000);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function safeFsPath(urlPath) {
  const decoded = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  const clean = decoded.replace(/\0/g, '').replace(/^\/+/, '');
  const joined = path.join(root, clean);
  const rel = path.relative(root, joined);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return joined;
}

function sendFile(res, absPath) {
  const ext = path.extname(absPath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(absPath).pipe(res);
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';
  const resolved = urlPath === '/' ? 'index.html' : urlPath;
  const abs = safeFsPath(resolved);
  if (!abs) {
    res.writeHead(400);
    res.end('Bad path');
    return;
  }

  fs.stat(abs, (err, st) => {
    if (!err && st && st.isFile()) {
      sendFile(res, abs);
      return;
    }

    // History API fallback: only for GET-like navigations
    const indexAbs = path.join(root, 'index.html');
    fs.stat(indexAbs, (e2, st2) => {
      if (e2 || !st2 || !st2.isFile()) {
        res.writeHead(500);
        res.end('index.html missing');
        return;
      }
      res.writeHead(200, { 'Content-Type': mime['.html'] });
      fs.createReadStream(indexAbs).pipe(res);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`[spa] READY http://127.0.0.1:${port}`);
  console.log(`[spa] Try: /directory, /content/presentations, /marketing/crm, /privacy`);
});

