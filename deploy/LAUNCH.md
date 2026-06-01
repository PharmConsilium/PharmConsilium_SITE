# Чеклист запуска · pharmconsilium.com

См. также: `DEPLOY-INPUTS.md`, `SEO-PAGES-AUDIT.md`, `WORDSTAT.md`, `AI-VISIBILITY.md`.

---

## B. Деплой и техника

### 1. Домен и canonical

- [ ] `SITE.baseUrl` в `js/data/seo-meta.jsx` = финальный канон
- [ ] `index.html`: canonical, og:url, JSON-LD `@id`
- [ ] Второй домен (.com) → **301** на `.by` (если да в DEPLOY-INPUTS)
- [ ] HTTPS, редирект HTTP→HTTPS

### 2. SPA на сервере

**nginx** — `deploy/nginx-spa.conf` (фрагмент `server`).

**Apache** — `deploy/apache-spa.htaccess`.

Проверка: `/directory`, `/marketing/crm`, `/portfolio/cardio-lonch` отдают `index.html`, не 404.

### 3. Sitemap и robots

- [ ] `sitemap.xml` — 46 URL (генерация: `node scripts/generate-sitemap.js`)
- [ ] `robots.txt`: `Sitemap: https://pharmconsilium.com/sitemap.xml`, `Disallow: /print.html`
- [ ] `deploy/redirects-old-site.htaccess` (или `.htaccess` в корне) — 301 со старого PHP-сайта
- [ ] Отправить sitemap в **Яндекс.Вебмастер** и **Google Search Console**

### 4. Редиректы 301

| От | К |
|----|---|
| `/#home`, `/#marketing/crm`, … | `/`, `/marketing/crm`, … |
| Старые URL старого сайта | _______ (заполнить) |
| `pharmconsilium.html` | `/` (уже есть редирект в репо) |

### 5. Open Graph

- [ ] Загрузить финальный **og-default** 1200×630 → обновить `SITE.ogImage` и `index.html`
- [ ] Сейчас временно: `assets/uploads/mega-marketing.png`

### 6. Аналитика (SPA)

Вставить счётчики после согласования ID (или GTM):

- **Яндекс.Метрика** — ID: _______
- **GA4** — ID: _______

Цели (события на `navigate` / клики):

- «Контакты» (header CTA, `openPharmContact`)
- Отправка формы (когда форма на бэкенде)

Проверка: смена route без перезагрузки — hit / virtual pageview.

### 7. TweaksPanel на проде

Варианты (выбрать в DEPLOY-INPUTS):

- **да** — перед `pharm-boot.js` добавить: `<script>window.PHARM_HIDE_TWEAKS=true;</script>` и в `app.jsx` не рендерить `TweaksPanel` при этом флаге (внедрить при деплое).
- **нет** — оставить для внутренних правок (не рекомендуется на публичном проде).

### 8. llms.txt и Schema

- [ ] `https://pharmconsilium.com/llms.txt` доступен
- [ ] JSON-LD Organization + LocalBusiness в `index.html` (NAP = футер)

### 9. EN

- `SITE_EN_ENABLED = false` — индекс только RU, один URL на страницу.
- После готовности EN: включить флаг, **не** плодить hreflang без отдельных URL.

---

## B++ — После деплоя (2–3 мес. SEO)

### Неделя 1

- [ ] Вебмастер + GSC: подтверждение домена, sitemap, «Переобход»
- [ ] **Яндекс.Бизнес** / **Google Business** — NAP как в футере (Гродно, телефоны, email)
- [ ] Screaming Frog **или** «Проверка URL» в Вебмастере/GSC — **20** URL из аудита

### Через 30 дней

- [ ] Отчёт **Вордстат** (обновлённый `semantic-core.csv`) vs запросы в **Метрике** / **GSC**
- [ ] Внести **согласованные** правки title/lede (см. SEO-PAGES-AUDIT)
- [ ] **3 теста ИИ** (ChatGPT / Perplexity / Yandex): «ФармКонсилиум», «CRM для медпредов Беларусь», «CLM фарма Беларусь» — зафиксировать цитаты и URL

### robots: AI-боты (решение записать здесь)

| Бот | Решение | Дата |
|-----|---------|------|
| GPTBot | Allow / Disallow: ___ | |
| Claude-Web | Allow / Disallow: ___ | |
| Google-Extended | Allow / Disallow: ___ | |
| YandexAdditional | Allow / Disallow: ___ | |

По умолчанию сейчас: `User-agent: *` **Allow** (все, включая AI). Для ограничения — отдельные блоки в `robots.txt` (см. `AI-VISIBILITY.md`).

---

## C. Проверка перед сдачей

| # | URL | 375px | Карточки |
|---|-----|-------|----------|
| 1 | `/` | | |
| 2 | `/marketing` | | |
| 3 | `/marketing/crm` | | |
| 4 | `/hcp/education` | | |
| 5 | `/sales/digital-rep` | | |
| 6 | `/content/edetailing` | | |
| 7 | `/directory` | | |
| 8 | `/team` | | |
| 9 | `/portfolio` | | |
| 10 | `/portfolio/cardio-lonch` | | |

- [ ] `print.html` — `noindex`, не в sitemap
- [ ] Консоль браузера без ошибок
- [ ] EN-кнопка disabled, сайт на RU

---

## Локальная разработка

```bash
node scripts/dev-server.js
# http://localhost:8080/
```

Регенерация SEO-артефактов:

```bash
node scripts/seo-audit-build.js
node scripts/seo-audit-md.js
node scripts/generate-sitemap.js
```
