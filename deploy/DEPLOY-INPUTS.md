# Вводные для деплоя (заполнить заказчиком)

| Параметр | Значение |
|----------|----------|
| **Канон** | `https://pharmconsilium.by` |
| **Домен .com** | _______ |
| **Второй домен → 301 на .by** | да / нет |
| **Хостинг** | nginx / Apache / Cloudflare |
| **Яндекс.Метрика** | ID: _______ |
| **Google Analytics 4** | ID: _______ |
| **Старые URL для 301** | hash `#marketing/crm` → `/marketing/crm`; старый сайт: _______ |
| **Скрыть TweaksPanel на проде** | да / нет (см. `deploy/LAUNCH.md` § Tweaks) |
| **Доступ к Яндекс.Вордстат** | [ ] у заказчика  [ ] агент готовит ТЗ |

После заполнения — обновить `js/data/seo-meta.jsx` (`SITE.baseUrl`), `robots.txt`, `sitemap.xml`, счётчики в `index.html` или через GTM.
