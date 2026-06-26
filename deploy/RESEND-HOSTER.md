# Формы сайта → Resend → Gmail (Hoster.by)

Письма с форм «Контакты» и «Прогноз ИИ» уходят через [Resend](https://resend.com) на **sergeiprogpharmconsilium@gmail.com**.

На сервере нужен **PHP 5.6+** (на Hoster.by обычно есть; в панели лучше включить **PHP 7.4** или **8.x** для `/api/`).

---

## Шаг 1. Resend

1. Зарегистрируйтесь на [resend.com](https://resend.com).
2. **Domains** → Add Domain → `pharmconsilium.com`.
3. Добавьте DNS-записи, которые покажет Resend (SPF, DKIM — в панели Hoster → DNS домена).
4. Дождитесь статуса **Verified**.
5. **API Keys** → Create API Key → скопируйте ключ (`re_…`).

---

## Шаг 2. Файлы на Hoster

После `npm run build` в архиве есть папка `api/`:

```
api/
  contact.php          ← обработчик форм (публичный)
  config.example.php   ← образец
  .htaccess            ← блокирует скачивание config через браузер
```

На сервере в `public_html/api/` (рядом с `index.html`):

1. Загрузите `contact.php`, `.htaccess`, `config.example.php`.
2. Скопируйте образец в **`config.php`** (этот файл **не** в git):

```php
<?php
return [
    'resend_api_key' => 're_ВАШ_КЛЮЧ',
    'from_email' => 'ФармКонсилиум <noreply@pharmconsilium.com>',
    'to_email' => 'sergeiprogpharmconsilium@gmail.com',
];
```

3. Права: `config.php` — только чтение для веб-сервера (обычно 640 или 600).

---

## Шаг 3. Проверка API

В терминале (или Postman):

```bash
curl -s -X POST https://pharmconsilium.com/api/contact.php \
  -H 'Content-Type: application/json' \
  -d '{"type":"forecast","lang":"ru","consent":true,"email":"test@example.com","topic":"тест"}'
```

Ожидается: `{"ok":true}` и письмо в Gmail.

Ошибки:

| Ответ | Причина |
|-------|---------|
| `not_configured` | Нет `api/config.php` или пустой ключ |
| `send_failed` | Неверный ключ, домен не верифицирован, лимит Resend |
| `rate_limit` | Больше 10 заявок с одного IP за час |

---

## Шаг 4. Проверка форм на сайте

1. Откройте сайт → «Контакты» → заполните форму → «Отправить».
2. Должно появиться: «Спасибо! Сообщение отправлено…»
3. Проверьте входящие на **sergeiprogpharmconsilium@gmail.com** (и «Спам»).

То же для главной → поле бренда → «Прогноз».

---

## Локальная разработка

`node scripts/dev-server.js` **не выполняет PHP**. Формы на `localhost:8080` вернут ошибку сети — это нормально.

Тестируйте отправку на staging/проде или поднимите PHP локально (MAMP, `php -S` с роутером).

---

## Безопасность

- Ключ Resend **только** в `api/config.php` на сервере.
- В репозитории — только `config.example.php`.
- Honeypot-поле `website` отсекает простых ботов.
- Лимит: 10 POST с IP в час.

При росте спама добавьте Cloudflare Turnstile (отдельная задача).

---

## Что менять при смене почты

Только `to_email` в `api/config.php` на сервере.
