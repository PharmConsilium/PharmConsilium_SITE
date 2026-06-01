# ФармКонсилиум — сайт

Корпоративный сайт IT-команды фарм-маркетинга (Беларусь). Прототип на React без сборки.

## Запуск локально

**Вариант 1 (рекомендуется):** двойной клик по `start-local.bat` или в терминале:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/serve.ps1
```

Сайт откроется на **http://127.0.0.1:3000/**

**Вариант 2:** расширение Live Server в VS Code/Cursor — «Open with Live Server» на `index.html`.

Не открывайте `index.html` напрямую (`file://`) — Babel не загрузит `.jsx` по CORS.

### Просмотр внутри Cursor (как в браузере)

Нужен тот же **HTTP**-адрес, что и снаружи, не превью файла.

1. Запустите сервер (команда выше или **Terminal → Run Task…** → **Serve PharmConsilium (local)**).
2. **Ctrl+Shift+P** → команда **Simple Browser: Show** (в палитре можно набрать `Simple Browser`).
3. В поле URL вставьте: **http://127.0.0.1:3000/** и Enter.

Откроется встроенная вкладка с полноценным JavaScript — меню и разделы должны совпадать с Chrome. После правок в коде обновите страницу (**F5** или кнопка обновления в Simple Browser).

Если ширина панели **уже ~960px**, горизонтальное меню в шапке скрывается (как на телефоне): нажмите **иконку «три полоски»** слева от языка — откроется список разделов. Расширьте панель или откройте внешний браузер на полный экран, если нужен вид «как на десктопе» без бургера.

Если Simple Browser недоступен, используйте расширение **Live Preview** (Microsoft) и снова укажите `http://127.0.0.1:3000/` — не открывайте только `index.html` как статический файл без сервера.

## Структура

| Путь | Назначение |
|------|------------|
| `index.html` | Главная точка входа |
| `print.html` | Версия для печати (noindex) |
| `css/styles.css` | Стили и дизайн-токены |
| `assets/` | Логотип и загрузки |
| `js/core/` | Приложение и print-режим |
| `js/components/` | UI-компоненты |
| `js/pages/` | Страницы разделов |
| `js/data/` | Контент, SEO |
| `.cursor/rules/` | Правила для AI в Cursor |

Legacy aliases `pharmconsilium.html` and `pharmconsilium-print.html` redirect to `index.html` and `print.html`.

## Скорость загрузки

1. **Продакшен (максимально быстро):** установите Node.js, затем `npm install` и `npm run build:js` — появится `js/pharm-bundle.min.js` (без Babel в браузере).
2. **Без сборки:** сайт сам перейдёт на оптимизированный `pharm-boot.js` (параллельная загрузка, кэш JSX, отложенный робот).
3. **Разработка JSX:** откройте `http://127.0.0.1:3000/?devjsx` — принудительно режим Babel.
4. Панель Tweaks на localhost или с `?tweaks` в URL; на проде скрыта.

Подробнее: `deploy/PERFORMANCE.md`.

## SEO перед продакшеном

1. Указать реальный домен в `js/data/seo-meta.jsx`, `robots.txt`, `sitemap.xml`, `index.html`.
2. Чистые пути `/marketing/crm` — на сервере нужен SPA fallback (`deploy/nginx-spa.conf`).
3. Подключить Метрику, Вебмастер, GA4, Search Console.

Чек-лист: [Seologic — SEO перед запуском](https://www.seologic.by/blog/chek-list-po-seo-chto-nuzhno-proverit-pered-zapuskom-novogo-sajta).

## Дизайн-твики

Панель Tweaks (EDITMODE) — смена темы, акцента, шрифтов. Дефолты в `js/core/app.jsx` между `/*EDITMODE-BEGIN*/` и `/*EDITMODE-END*/`.
