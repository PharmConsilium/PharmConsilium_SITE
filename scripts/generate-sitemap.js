// node scripts/generate-sitemap.js → sitemap.xml
const fs = require('fs');
const path = require('path');

require('./seo-audit-build.js');

const ROOT = path.resolve(__dirname, '..');
const { rows } = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'deploy/seo-audit-data.json'), 'utf8')
);

const BASE = 'https://pharmconsilium.com';
const priority = (route) => {
  if (route === 'home') return '1.0';
  if (['pharma-marketing', 'healthcare', 'outsourcing', 'design', 'drug-directory'].includes(route)) return '0.9';
  if (route === 'privacy') return '0.5';
  if (route.startsWith('portfolio/')) return '0.7';
  if (route.includes('/')) return '0.8';
  return '0.85';
};

const changefreq = (route) => (route === 'privacy' ? 'yearly' : 'monthly');

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const r of rows) {
  const loc = r.url.endsWith('/') && r.url !== `${BASE}/` ? r.url : r.url;
  const route = r.route || 'home';
  xml += `  <url>\n`;
  xml += `    <loc>${loc}</loc>\n`;
  xml += `    <changefreq>${changefreq(route)}</changefreq>\n`;
  xml += `    <priority>${priority(route)}</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml: ${rows.length} URLs`);
