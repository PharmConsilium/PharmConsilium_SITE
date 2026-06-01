/**
 * Production deploy: dist/ + pharmconsilium-site-YYYYMMDD.zip
 * Run: npm run build
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DATE = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const CACHE_BUST = DATE;
const ZIP_NAME = `pharmconsilium-site-${DATE}.zip`;

const ROOT_FILES = [
  'index.html',
  'print.html',
  'pharmconsilium.html',
  'pharmconsilium-print.html',
  '.htaccess',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'web.config',
  '_redirects',
];

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function patchIndexCacheBust(file) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/window\.PHARM_CACHE_BUST\s*=\s*'[^']*'/, `window.PHARM_CACHE_BUST = '${CACHE_BUST}'`);
  html = html.replace(/(\?v=)[^"'&\s]+/g, `$1${CACHE_BUST}`);
  fs.writeFileSync(file, html);
}

function main() {
  console.log('→ npm run build:js');
  execSync('npm run build:js', { cwd: ROOT, stdio: 'inherit' });

  console.log('→ generate sitemap');
  execSync('node scripts/generate-sitemap.js', { cwd: ROOT, stdio: 'inherit' });

  console.log('→ clean dist/');
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  for (const name of ROOT_FILES) {
    const src = path.join(ROOT, name);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(DIST, name));
  }

  console.log('→ copy css/, assets/, js/');
  copyRecursive(path.join(ROOT, 'css'), path.join(DIST, 'css'));
  copyRecursive(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  copyRecursive(path.join(ROOT, 'js'), path.join(DIST, 'js'));

  patchIndexCacheBust(path.join(DIST, 'index.html'));
  patchIndexCacheBust(path.join(ROOT, 'index.html'));

  const readme = `ФармКонсилиум — production-сборка ${DATE}
=====================================

1. На хостинге удалите файлы старого сайта (или очистите public_html).
   Обязательно удалите index.php и папки tool/, training/, stm/, outsourcings/ если остались — иначе главная или старые URL могут вести себя непредсказуемо.
2. Распакуйте этот архив в корень домена (рядом должны быть index.html и .htaccess).
3. Apache: нужен mod_rewrite; .htaccess уже в архиве (301 со старого сайта + SPA).
4. nginx: см. deploy/nginx-spa.conf и deploy/redirects-old-site.conf в репозитории.
5. Проверьте:
   - https://pharmconsilium.com/ (должен быть 200, не цикл редиректов)
   - https://pharmconsilium.com/marketing/crm
   - https://pharmconsilium.com/contact.php → 301 на /team
   - https://pharmconsilium.com/team/contacts → 301 на /team (страница снята)
   - https://pharmconsilium.com/index.php → 301 на /
   - https://pharmconsilium.com/sitemap.xml
6. Google Search Console: sitemap https://pharmconsilium.com/sitemap.xml

Канон: https://pharmconsilium.com
Почта: pharmconsilium@gmail.com
`;
  fs.writeFileSync(path.join(DIST, 'DEPLOY-README.txt'), readme, 'utf8');

  const zipPath = path.join(ROOT, ZIP_NAME);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log('→ zip', ZIP_NAME);
  execSync(`cd "${DIST}" && zip -rq "${zipPath}" . -x "*.DS_Store"`, {
    cwd: ROOT,
    stdio: 'inherit',
  });

  const zipMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
  console.log('');
  console.log('Done.');
  console.log('  dist/     →', DIST);
  console.log('  archive   →', zipPath, `(${zipMb} MB)`);
  console.log('  cache     →', CACHE_BUST);
}

main();
