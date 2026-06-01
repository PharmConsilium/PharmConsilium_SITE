# Deploy · ФармКонсилиум

| Файл | Назначение |
|------|------------|
| [DEPLOY-INPUTS.md](./DEPLOY-INPUTS.md) | Вводные от заказчика (домен, Метрика, 301) |
| [LAUNCH.md](./LAUNCH.md) | Чеклист деплоя и пост-запуска |
| [SEO-PAGES-AUDIT.md](./SEO-PAGES-AUDIT.md) | Аудит 46 URL: H1, title, description, alt, related |
| [WORDSTAT.md](./WORDSTAT.md) | Инструкция Яндекс.Вордстат (Беларусь) |
| [semantic-core.csv](./semantic-core.csv) | Семантическое ядро (частоты — подтвердить) |
| [semantic-keywords-filtered.md](./semantic-keywords-filtered.md) | Отбор запросов: да / LSI / нет |
| [AI-VISIBILITY.md](./AI-VISIBILITY.md) | llms.txt, Schema, AI-боты |
| [nginx-spa.conf](./nginx-spa.conf) | Пример nginx SPA |
| [apache-spa.htaccess](./apache-spa.htaccess) | Пример Apache |

Скрипты (из корня репо):

```bash
node scripts/seo-audit-build.js   # → deploy/seo-audit-data.json
node scripts/seo-audit-md.js      # → deploy/SEO-PAGES-AUDIT.md
node scripts/generate-sitemap.js  # → sitemap.xml
```
