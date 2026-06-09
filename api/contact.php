<?php
// PHP 5.6+ (Hoster shared hosting). POST JSON → Resend API.

header('Content-Type: application/json; charset=utf-8');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowedOrigins = array(
    'https://pharmconsilium.com',
    'https://www.pharmconsilium.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
);
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
if ($method === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

function pharm_respond($code, $body)
{
    http_response_code($code);
    $flags = defined('JSON_UNESCAPED_UNICODE') ? JSON_UNESCAPED_UNICODE : 0;
    echo json_encode($body, $flags);
    exit;
}

if ($method !== 'POST') {
    pharm_respond(405, array('ok' => false, 'error' => 'method_not_allowed'));
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    pharm_respond(503, array('ok' => false, 'error' => 'not_configured'));
}

$config = require $configPath;
if (empty($config['resend_api_key']) || empty($config['from_email']) || empty($config['to_email'])) {
    pharm_respond(503, array('ok' => false, 'error' => 'not_configured'));
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ? $raw : '', true);
if (!is_array($data)) {
    pharm_respond(400, array('ok' => false, 'error' => 'invalid_json'));
}

if (!empty($data['website'])) {
    pharm_respond(200, array('ok' => true));
}

$lang = (isset($data['lang']) && $data['lang'] === 'en') ? 'en' : 'ru';
$type = isset($data['type']) ? (string) $data['type'] : '';

if (empty($data['consent'])) {
    pharm_respond(400, array('ok' => false, 'error' => 'consent_required'));
}

function pharm_sanitize_text($value, $max)
{
    $value = trim(strip_tags((string) $value));
    if (function_exists('mb_substr')) {
        if (mb_strlen($value, 'UTF-8') > $max) {
            $value = mb_substr($value, 0, $max, 'UTF-8');
        }
    } elseif (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function pharm_is_valid_email($email)
{
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function pharm_rate_limit_ok($ip, $max, $windowSec)
{
    $file = sys_get_temp_dir() . '/pharm_form_rate_' . md5($ip);
    $now = time();
    $entries = array();
    if (is_readable($file)) {
        $rawEntries = explode("\n", (string) file_get_contents($file));
        foreach ($rawEntries as $line) {
            $t = (int) $line;
            if ($t > $now - $windowSec) {
                $entries[] = $t;
            }
        }
    }
    if (count($entries) >= $max) {
        return false;
    }
    $entries[] = $now;
    file_put_contents($file, implode("\n", $entries));
    return true;
}

$ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
if (!pharm_rate_limit_ok($ip, 10, 3600)) {
    pharm_respond(429, array('ok' => false, 'error' => 'rate_limit'));
}

$extraLabels = array(
    'phone' => $lang === 'en' ? 'Phone' : 'Телефон',
    'telegram' => 'Telegram',
    'whatsapp' => 'WhatsApp',
    'viber' => 'Viber',
    'signal' => 'Signal',
);

$replyEmail = '';
$subject = '';
$text = '';

if ($type === 'contact') {
    $name = pharm_sanitize_text(isset($data['fullName']) ? $data['fullName'] : '', 200);
    $company = pharm_sanitize_text(isset($data['company']) ? $data['company'] : '', 200);
    $replyEmail = pharm_sanitize_text(isset($data['email']) ? $data['email'] : '', 320);
    $message = pharm_sanitize_text(isset($data['message']) ? $data['message'] : '', 8000);
    $extraPref = pharm_sanitize_text(isset($data['extraPref']) ? $data['extraPref'] : '', 32);
    $extraDetail = pharm_sanitize_text(isset($data['extraDetail']) ? $data['extraDetail'] : '', 200);

    if ($name === '' || $company === '' || $replyEmail === '' || $message === '') {
        pharm_respond(400, array('ok' => false, 'error' => 'required'));
    }
    if (!pharm_is_valid_email($replyEmail)) {
        pharm_respond(400, array('ok' => false, 'error' => 'invalid_email'));
    }
    if ($extraPref !== '' && $extraDetail === '') {
        pharm_respond(400, array('ok' => false, 'error' => 'extra_required'));
    }

    $subject = $lang === 'en'
        ? 'PharmConsilium: inquiry from ' . $name
        : 'ФармКонсилиум: обращение от ' . $name;

    $extraLine = $lang === 'en' ? 'Additional contact: —' : 'Доп. связь: —';
    if ($extraPref !== '' && $extraDetail !== '') {
        $label = isset($extraLabels[$extraPref]) ? $extraLabels[$extraPref] : $extraPref;
        $extraLine = $lang === 'en'
            ? 'Additional contact (' . $label . '): ' . $extraDetail
            : 'Доп. связь (' . $label . '): ' . $extraDetail;
    }

    $text = implode("\n", array(
        ($lang === 'en' ? 'Name: ' : 'Имя: ') . $name,
        ($lang === 'en' ? 'Company / brand: ' : 'Компания / бренд: ') . $company,
        'E-mail: ' . $replyEmail,
        $extraLine,
        '',
        ($lang === 'en' ? 'Topic, question, or brief:' : 'Тема, вопрос или задание:'),
        $message,
        '',
        '—',
        'pharmconsilium.com',
        'IP: ' . $ip,
    ));
} elseif ($type === 'forecast') {
    $replyEmail = pharm_sanitize_text(isset($data['email']) ? $data['email'] : '', 320);
    $topic = pharm_sanitize_text(isset($data['topic']) ? $data['topic'] : '', 2000);

    if ($replyEmail === '') {
        pharm_respond(400, array('ok' => false, 'error' => 'required'));
    }
    if (!pharm_is_valid_email($replyEmail)) {
        pharm_respond(400, array('ok' => false, 'error' => 'invalid_email'));
    }

    $subject = $lang === 'en'
        ? 'PharmConsilium: AI forecast request'
        : 'ФармКонсилиум: запрос прогноза ИИ';

    $text = implode("\n", array(
        'E-mail: ' . $replyEmail,
        ($lang === 'en' ? 'Topic: ' : 'Тема: ') . ($topic !== '' ? $topic : '—'),
        '',
        '—',
        'pharmconsilium.com',
        'IP: ' . $ip,
    ));
} else {
    pharm_respond(400, array('ok' => false, 'error' => 'invalid_type'));
}

$flags = defined('JSON_UNESCAPED_UNICODE') ? JSON_UNESCAPED_UNICODE : 0;
$payload = json_encode(array(
    'from' => $config['from_email'],
    'to' => array($config['to_email']),
    'reply_to' => $replyEmail,
    'subject' => $subject,
    'text' => $text,
), $flags);

if ($payload === false) {
    pharm_respond(500, array('ok' => false, 'error' => 'encode_failed'));
}

if (!function_exists('curl_init')) {
    pharm_respond(500, array('ok' => false, 'error' => 'curl_missing'));
}

$ch = curl_init('https://api.resend.com/emails');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Bearer ' . $config['resend_api_key'],
    'Content-Type: application/json',
));
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$responseBody = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($responseBody === false || $httpCode < 200 || $httpCode >= 300) {
    error_log('[pharm contact] Resend HTTP ' . $httpCode . ' curl=' . $curlError . ' body=' . (string) $responseBody);
    pharm_respond(502, array('ok' => false, 'error' => 'send_failed'));
}

pharm_respond(200, array('ok' => true));
