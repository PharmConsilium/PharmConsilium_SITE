/**
 * Build js/pharm-bundle.min.js — no runtime Babel on production.
 * Run: npm install && npm run build:js
 */
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js', 'pharm-bundle.min.js');
const CACHE_BUST = process.env.PHARM_BUILD_ID || '20260603r2';

const SCRIPTS = [
  'js/components/tweaks-panel.jsx',
  'js/components/illustrations.jsx',
  'js/components/forecast-chart.jsx',
  'js/components/header-footer.jsx',
  'js/pages/pages.jsx',
  'js/pages/privacy-page.jsx',
  'js/data/digital-rep-sections.js',
  'js/data/subpages-data.jsx',
  'js/data/section-cards.jsx',
  'js/data/portfolio-data.jsx',
  'js/data/i18n.jsx',
  'js/data/seo-meta.jsx',
  'js/components/portfolio-video.jsx',
  'js/components/detail-page.jsx',
  'js/pages/portfolio-pages.jsx',
  'js/components/robbie-face-cycle.jsx',
  'js/components/robot.jsx',
  'js/components/contact-modal.jsx',
  'js/components/forecast-modal.jsx',
  'js/components/contact-strip.jsx',
  'js/core/app.jsx',
];

async function transformFile(rel) {
  const file = path.join(ROOT, rel);
  const src = fs.readFileSync(file, 'utf8');
  const loader = rel.endsWith('.jsx') ? 'jsx' : 'js';
  const result = await esbuild.transform(src, {
    loader,
    target: 'es2020',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    minify: true,
  });
  return result.code;
}

async function main() {
  const parts = [
    '/* PharmConsilium bundle — built, do not edit */',
    'window.PHARM_CACHE_BUST="' + CACHE_BUST + '";',
    'window.PHARM_BUNDLE=1;',
  ];
  for (const rel of SCRIPTS) {
    parts.push(';/* ' + rel + ' */');
    parts.push(await transformFile(rel));
  }
  parts.push('if(typeof mountPharmApp==="function"){mountPharmApp();}');
  fs.writeFileSync(OUT, parts.join('\n'));
  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log('Wrote', OUT, '(' + kb + ' KB)');
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
