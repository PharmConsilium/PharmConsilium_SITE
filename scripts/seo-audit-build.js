// One-off: node scripts/seo-audit-build.js → deploy/seo-audit-data.json
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const sub = fs.readFileSync(path.join(ROOT, 'js/data/subpages-data.jsx'), 'utf8');
const port = fs.readFileSync(path.join(ROOT, 'js/data/portfolio-data.jsx'), 'utf8');
const seo = fs.readFileSync(path.join(ROOT, 'js/data/seo-meta.jsx'), 'utf8');

const BRAND = 'ФармКонсилиум';
const BASE = 'https://pharmconsilium.com';

function parseSubpages() {
  const keys = [...sub.matchAll(/'([^']+)':\s*\{/g)].map((m) => m[1]);
  const out = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const start = sub.indexOf(`'${k}':`);
    const end =
      i + 1 < keys.length ? sub.indexOf(`'${keys[i + 1]}':`, start + 1) : sub.indexOf('};', start);
    const slice = sub.slice(start, end > start ? end : sub.length);
    const title = (slice.match(/title:\s*'([^']*)'/) || [])[1] || '';
    const lede = (slice.match(/lede:\s*'([^']*)'/) || [])[1] || '';
    const related = !!(slice.match(/related:\s*\[/));
    const altCount = (slice.match(/alt:\s*'/g) || []).length;
    const artSlides = (slice.match(/artSlides/g) || []).length;
    out.push({ route: k, title, lede, related, alt: altCount > 0 || artSlides > 0 });
  }
  return out;
}

function parsePortfolio() {
  const out = [];
  const re = /slug:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(port))) {
    const slug = m[1];
    const start = m.index;
    const next = port.indexOf("slug:", start + 6);
    const slice = port.slice(start, next > 0 ? next : port.length);
    const name = (slice.match(/name:\s*'([^']*)'/) || [])[1] || '';
    const short = (slice.match(/short:\s*'([^']*)'/) || [])[1] || '';
    const hero = (slice.match(/hero:\s*'([^']*)'/) || [])[1] || '';
    const draft = /draft:\s*true/.test(slice) || slug.includes('draft');
    const related = !!(slice.match(/related:\s*\[/));
    const altCount = (slice.match(/alt:\s*'/g) || []).length;
    out.push({ slug, name, short, hero, draft, related, alt: altCount > 0 });
  }
  return out;
}

function parseStatic() {
  const block = seo.match(/const SEO_STATIC = \{([\s\S]*?)\};\s*const SEO_STATIC_EN/);
  if (!block) return [];
  const b = block[1];
  const keys = [...b.matchAll(/^\s+(\w+):\s*\{/gm)].map((x) => x[1]);
  return keys.map((k) => {
    const chunk = b.match(new RegExp(`${k}:\\s*\\{([\\s\\S]*?)\\n\\s+\\},`));
    const title = chunk ? (chunk[1].match(/title:\s*'([^']*)'/) || [])[1] : '';
    let desc = chunk ? (chunk[1].match(/description:\s*([^,\n]+)/) || [])[1] : '';
    desc = desc ? desc.replace(/SITE\.defaultDescription/, '(defaultDescription)').replace(/'/g, '').trim() : '';
    return { route: k, title, lede: desc };
  });
}

const staticPages = parseStatic();
const subpages = parseSubpages();
const portfolio = parsePortfolio().filter((p) => !p.draft);

const rows = [];

for (const s of staticPages) {
  const url = s.route === 'home' ? '/' : `/${s.route}`;
  rows.push({
    url: BASE + (url === '/' ? '/' : url),
    route: s.route,
    h1: s.route,
    title: s.title,
    titleLen: s.title.length,
    description: s.lede,
    descLen: s.lede.length,
    alt: '—',
    related: '—',
    source: 'SEO_STATIC',
    indexLang: 'RU (EN выкл.)',
  });
}

for (const p of subpages) {
  const title = `${p.title} · ${BRAND}`;
  rows.push({
    url: `${BASE}/${p.route}`,
    route: p.route,
    h1: p.title,
    title,
    titleLen: title.length,
    description: p.lede,
    descLen: p.lede.length,
    alt: p.alt ? 'да' : 'нет',
    related: p.related ? 'да' : 'нет',
    source: 'SUBPAGES',
    indexLang: 'RU (EN выкл.)',
  });
}

for (const p of portfolio) {
  const title = `${p.name} · ${BRAND}`;
  const desc = p.short || p.hero || '';
  rows.push({
    url: `${BASE}/portfolio/${p.slug}`,
    route: `portfolio/${p.slug}`,
    h1: p.name,
    title,
    titleLen: title.length,
    description: desc,
    descLen: desc.length,
    alt: p.alt ? 'да' : 'нет',
    related: p.related ? 'да' : 'нет',
    source: 'PORTFOLIO',
    indexLang: 'RU (EN выкл.)',
  });
}

const titleDupes = rows
  .map((r) => r.title)
  .filter((t, i, a) => a.indexOf(t) !== i);
const longDesc = rows.filter((r) => r.descLen > 160);
const shortDesc = rows.filter((r) => r.descLen < 50);
const longTitle = rows.filter((r) => r.titleLen > 60);

const summary = {
  total: rows.length,
  subpages: subpages.length,
  portfolioPublic: portfolio.length,
  portfolioDraft: parsePortfolio().filter((p) => p.draft).length,
  titleDuplicates: [...new Set(titleDupes)],
  descOver160: longDesc.map((r) => r.url),
  descUnder50: shortDesc.map((r) => r.url),
  titleOver60: longTitle.map((r) => ({ url: r.url, len: r.titleLen })),
};

fs.mkdirSync(path.join(ROOT, 'deploy'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'deploy/seo-audit-data.json'),
  JSON.stringify({ summary, rows }, null, 2),
  'utf8'
);
console.log(JSON.stringify(summary, null, 2));
