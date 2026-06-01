// node scripts/seo-audit-build.js && node scripts/seo-audit-md.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const { summary, rows } = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'deploy/seo-audit-data.json'), 'utf8')
);

const lines = [
  '# SEO-аудит страниц · ФармКонсилиум',
  '',
  'Дата сборки: 2026-06-01. Канон: `https://pharmconsilium.com`. **EN в UI выключен** (`SITE_EN_ENABLED = false`) — в индексе один URL на страницу, язык **RU**.',
  '',
  '## Сводка',
  '',
  `| Метрика | Значение |`,
  `|---------|----------|`,
  `| Всего URL (публичных) | ${summary.total} |`,
  `| SUBPAGES | ${summary.subpages} |`,
  `| PORTFOLIO (без draft) | ${summary.portfolioPublic} |`,
  `| PORTFOLIO draft (не в sitemap) | ${summary.portfolioDraft} |`,
  `| Дубли title | ${summary.titleDuplicates.length ? summary.titleDuplicates.join(', ') : 'нет'} |`,
  `| Description > 160 симв. | ${summary.descOver160.length} (норма для lede; при необходимости укоротить meta после Вордстата) |`,
  `| Title > 60 симв. | ${summary.titleOver60.length} |`,
  '',
  '## Согласованные правки title/lede',
  '',
  '**0 правок в коде на этом этапе** — ждём подтверждения семантики в Яндекс.Вордстате (`deploy/semantic-core.csv`, `deploy/WORDSTAT.md`).',
  '',
  'После согласования: только `seo-meta.jsx` (разделы) и `subpages-data.jsx` / `portfolio-data.jsx` (точечно title/lede), без правок card-art и CSS.',
  '',
  '## Таблица страниц',
  '',
  '| URL | H1 | title (симв.) | description (симв.) | alt ключевых img | related | Источник |',
  '|---|---|---|---|---|---|---|',
];

for (const r of rows) {
  const descNote = r.descLen > 160 ? `${r.descLen} ⚠` : String(r.descLen);
  const titleNote = r.titleLen > 60 ? `${r.titleLen} ⚠` : String(r.titleLen);
  const shortUrl = r.url.replace('https://pharmconsilium.com', '');
  const h1 = (r.h1 || '').replace(/\|/g, '\\|').slice(0, 80);
  const title = (r.title || '').replace(/\|/g, '\\|').slice(0, 70);
  const desc = (r.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 90);
  lines.push(
    `| \`${shortUrl || '/'}\` | ${h1} | ${title} (${titleNote}) | ${desc}… (${descNote}) | ${r.alt} | ${r.related} | ${r.source} |`
  );
}

lines.push(
  '',
  '## Страницы без artSlides alt (SUBPAGES)',
  '',
  'Проверить при необходимости: `sales/analytics`, `hcp/mobile`, `hcp/education`, `content/edetailing`, `content/patient`, `content/psp`, `team/events`, `team/career`, `team/contacts` — контент без слайдера; alt не критичен, если нет `<img>` в данных.',
  '',
  '## EN',
  '',
  'Отдельных EN-URL нет. `SEO_STATIC_EN` и i18n-патчи **не индексируются**, пока `SITE_EN_ENABLED = false`. После включения EN — не вводить hreflang без отдельных URL; при одном URL оставить canonical RU.',
  ''
);

fs.writeFileSync(path.join(ROOT, 'deploy/SEO-PAGES-AUDIT.md'), lines.join('\n'), 'utf8');
console.log('Wrote deploy/SEO-PAGES-AUDIT.md');
