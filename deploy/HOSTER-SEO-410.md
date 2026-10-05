# Hoster.by — 410 для SEO-мусора (GSC)

На проде `Server: nginx`. Часть правил уже работает (`/?p=`, `/ctg/` → 410).  
Остальные мусорные пути сейчас отдают **200 + главную** — из‑за этого Google пишет «просканирована, не проиндексирована».

## Что закрыть 410

| Префикс | Пример |
|---------|--------|
| `/?p=` | уже есть |
| `/ctg/` | уже есть |
| `/guide/` | `/guide/policy/browser/accessibility.html` |
| `/f/` | `/f/thermometer/thermometer00/` |
| `/c=` | `/c=1929047` |
| `/p=` (путь, без `?`) | `/p=2075383` |
| `/index.php/` | `/index.php/iqr/inquiryInputView` |
| `/wp-*` | типичный WP-спам |

Ваши нормальные URL (`/`, `/pharma-marketing/crm`, `/portfolio/...`) **не трогаем**.

## Что сделать на Hoster

### Вариант A — есть Apache / `.htaccess` в корне
1. Залить обновлённый корневой `.htaccess` из репозитория (FTP / файловый менеджер).
2. Проверить (см. ниже).

### Вариант B — чистый nginx (как сейчас по заголовку Server)
1. В панели Hoster: настройки сайта / nginx / «доп. директивы»  
   **или** тикет в поддержку: «добавьте в server {} для pharmconsilium.com».
2. Вставить фрагмент из `deploy/nginx-spa.conf` (блок `# SEO-spam`) **перед** `location / { try_files ... index.html }`.
3. Перезагрузка nginx (поддержка).

Готовый фрагмент для вставки:

```nginx
if ($args ~* "(^|&)(p|page_id|attachment_id)=") { return 410; }
location ^~ /ctg/ { return 410; }
location ^~ /guide/ { return 410; }
location ^~ /f/ { return 410; }
location ~ ^/c= { return 410; }
location ~ ^/p= { return 410; }
location ~ ^/index\.php/ { return 410; }
location ^~ /wp-admin { return 410; }
location ^~ /wp-content { return 410; }
location ^~ /wp-includes { return 410; }
location = /xmlrpc.php { return 410; }
```

## Проверка после выкладки

В PowerShell:

```powershell
curl.exe -sI "https://pharmconsilium.com/guide/policy/browser/accessibility.html"
curl.exe -sI "https://pharmconsilium.com/f/thermometer/thermometer00/"
curl.exe -sI "https://pharmconsilium.com/c=1929047"
curl.exe -sI "https://pharmconsilium.com/index.php/iqr/inquiryInputView"
curl.exe -sI "https://pharmconsilium.com/pharma-marketing/crm"
```

Ожидание: мусор → **410**, CRM → **200**.

## После успеха — в GSC

1. Страницы → «Просканирована, но пока не проиндексирована» → **Проверить исправление**.
2. Removals (префикс, без «весь сайт»):  
   `https://pharmconsilium.com/guide/`  
   `https://pharmconsilium.com/f/`  
   (для `/ctg/` уже делали)
