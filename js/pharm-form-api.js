// POST form payloads to /api/contact.php (PHP + Resend on production hosting).

(function () {
  var DEFAULT_URL = '/api/contact.php';

  var ERROR_CODES = {
    not_configured: 'not_configured',
    send_failed: 'send_failed',
    rate_limit: 'rate_limit',
    network: 'network',
  };

  function getApiUrl() {
    return window.PHARM_FORM_API_URL || DEFAULT_URL;
  }

  function submitPharmForm(payload) {
    if (!window.fetch) {
      return Promise.reject(makeError('network'));
    }
    return fetch(getApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        if (!res.ok || !data || !data.ok) {
          var code = (data && data.error) || (res.status === 503 ? 'not_configured' : 'send_failed');
          throw makeError(code);
        }
        return data;
      });
    }).catch(function (err) {
      if (err && err.pharmFormError) throw err;
      throw makeError('network');
    });
  }

  function makeError(code) {
    var err = new Error(code);
    err.pharmFormError = true;
    err.code = code;
    return err;
  }

  function formErrorMessage(code, strings) {
    var map = strings && strings.errByCode;
    if (map && map[code]) return map[code];
    if (strings && strings.errSend) return strings.errSend;
    return 'Не удалось отправить форму.';
  }

  window.submitPharmForm = submitPharmForm;
  window.pharmFormErrorMessage = formErrorMessage;
  window.PHARM_FORM_ERROR_CODES = ERROR_CODES;
})();
