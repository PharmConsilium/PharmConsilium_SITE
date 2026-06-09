<?php
/**
 * Скопируйте в config.php на сервере и заполните значения.
 * config.php не коммитится в git.
 */
return [
    // Resend → API Keys → Create API Key
    'resend_api_key' => 're_xxxxxxxxxxxxxxxxxxxxxxxx',

    // Домен должен быть верифицирован в Resend (pharmconsilium.com).
    'from_email' => 'ФармКонсилиум <noreply@pharmconsilium.com>',

    // Куда приходят заявки с сайта
    'to_email' => 'sergeiprogpharmconsilium@gmail.com',
];
