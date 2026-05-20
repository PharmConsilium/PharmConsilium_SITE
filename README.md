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

Старые имена `ФармКонсилиум.html` и `ФармКонсилиум-print.html` перенаправляют на новые файлы.

## SEO перед продакшеном

1. Указать реальный домен в `js/data/seo-meta.jsx`, `robots.txt`, `sitemap.xml`, `index.html`.
2. Перейти с hash-URL на обычные пути (рекомендация в `.cursor/rules/02-seo-launch.mdc`).
3. Подключить Метрику, Вебмастер, GA4, Search Console.

Чек-лист: [Seologic — SEO перед запуском](https://www.seologic.by/blog/chek-list-po-seo-chto-nuzhno-proverit-pered-zapuskom-novogo-sajta).

## Дизайн-твики

Панель Tweaks (EDITMODE) — смена темы, акцента, шрифтов. Дефолты в `js/core/app.jsx` между `/*EDITMODE-BEGIN*/` и `/*EDITMODE-END*/`.
