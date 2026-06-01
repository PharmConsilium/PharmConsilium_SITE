# Производительность · PharmConsilium

## Режимы загрузки

| Режим | Как включить | Что происходит |
|-------|----------------|----------------|
| **Production bundle** | `npm run build:js` → `js/pharm-bundle.min.js` | Без Babel в браузере; на **localhost** бандл не подключается (Live Server отдаёт index.html вместо 404) |
| **Локальная разработка** | `http://127.0.0.1:3000/` или `:8080` | Автоматически Babel + `pharm-boot.js` (оптимизированный) |
| **Fallback** | `?devjsx` или нет bundle на проде | Параллельная загрузка JSX + кэш в `sessionStorage` |
| **Tweaks** | убрать `PHARM_HIDE_TWEAKS` в `index.html` | Панель правок для дизайна |

## Перед деплоем

```bash
npm install
npm run build:js
```

Залить `js/pharm-bundle.min.js` вместе с остальными файлами.

## Что ускорено

- Параллельный fetch всех core-скриптов (fallback)
- Кэш скомпилированного JSX в `sessionStorage` (повторные визиты)
- Отложенные `forecast-chart` и `robot` при fallback (робот — после idle)
- Урезанный набор начертаний Google Fonts
- `PHARM_HIDE_TWEAKS = true` на проде
- Расширенный `<noscript>` со ссылками для SEO

## Локально не видны правки в JSX

1. **Кэш Babel** — на `localhost` / `127.0.0.1` кэш в `sessionStorage` отключён (с `pharm-boot.js` после обновления). Раньше ключи `pharm:jsx:…` отдавали старый скомпилированный код при том же `PHARM_CACHE_BUST`.
2. **Один раз вручную** — DevTools → Application → Session Storage → удалить ключи `pharm:jsx:*`, затем Ctrl+F5.
3. **Принудительно** — открыть `http://127.0.0.1:…/?nocache` (без кэша и на проде при проверке).
4. Убедиться, что открыт **`index.html` из корня репозитория**, не старый `pharmconsilium.html`.
5. На проде после правок: `npm run build:js` и залить новый `pharm-bundle.min.js`.

## Проверка

- PageSpeed Insights (Mobile + Desktop)
- DevTools → Network: первый визит без bundle — нет 20+ последовательных Babel-трансформаций
- `#home` — график прогноза появляется после skeleton
- Навигация по разделам без ошибок в консоли
