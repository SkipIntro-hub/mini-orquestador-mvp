// Servidor estático mínimo, sin dependencias.
// Uso: node scripts/serve.mjs <directorio> <puerto> [sha]
// Expone /__build con el SHA servido, para verificar que cada URL sirve el checkout correcto.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'app');
const port = Number(process.argv[3] ?? 4000);
const sha = process.argv[4] ?? process.env.SERVE_SHA ?? 'local';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__build') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    return res.end(JSON.stringify({ sha, root }));
  }
  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const file = path.resolve(root, rel);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} (sha=${sha}) on http://127.0.0.1:${port}`));
