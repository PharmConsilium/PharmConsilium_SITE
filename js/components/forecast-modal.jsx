// Forecast request modal: POST /api/contact.php → Resend.

const FALLBACK_MAIL = 'pharmconsilium@gmail.com';

function forecastStrings(lang) {
  const l = lang || 'ru';
  if (l === 'en') {
    return {
      close: 'Close',
      title: 'AI Robby will calculate your brand forecast in CIS pharma market',
      note: 'Fill in the form — we will reply to your e-mail.',
      errEmail: 'Please provide a valid e-mail.',
      errConsent: 'Consent is required to proceed.',
      errSend: `Could not send. Try again later or e-mail ${FALLBACK_MAIL}.`,
      errByCode: {
        not_configured: `Form is not configured on the server yet. E-mail ${FALLBACK_MAIL}.`,
        rate_limit: 'Too many attempts. Wait an hour or e-mail us directly.',
        network: `Cannot reach the server. E-mail ${FALLBACK_MAIL}.`,
      },
      success: 'Thank you! Your request was sent — we will reply to your e-mail.',
      emailLabel: 'E-mail *',
      topicLabel: 'Topic',
      topicPlaceholder: 'Brand / country / details…',
      submit: 'Send',
      submitting: 'Sending…',
      cancel: 'Cancel',
      consentBefore: 'I consent to personal data processing under the',
      consentLink: 'privacy policy',
      consentAfter: 'of PharmConsilium.',
    };
  }
  return {
    close: 'Закрыть',
    title: 'Искусственный интеллект Робби рассчитает прогноз вашего бренда на фармацевтическом рынке СНГ',
    note: 'Заполните форму — мы ответим на ваш e-mail.',
    errEmail: 'Укажите e-mail — поле обязательно.',
    errConsent: 'Нужно согласие на обработку персональных данных.',
    errSend: `Не удалось отправить. Попробуйте позже или напишите на ${FALLBACK_MAIL}.`,
    errByCode: {
      not_configured: `Форма на сервере ещё не настроена. Напишите на ${FALLBACK_MAIL}.`,
      rate_limit: 'Слишком много попыток. Подождите час или напишите на почту.',
      network: `Нет связи с сервером. Напишите на ${FALLBACK_MAIL}.`,
    },
    success: 'Спасибо! Запрос отправлен — мы ответим на ваш e-mail.',
    emailLabel: 'E-mail *',
    topicLabel: 'Тема',
    topicPlaceholder: 'Бренд / страна / детали…',
    submit: 'Отправить',
    submitting: 'Отправка…',
    cancel: 'Отмена',
    consentBefore: 'Я даю согласие на обработку персональных данных в соответствии с',
    consentLink: 'политикой конфиденциальности',
    consentAfter: 'ЧП «ФармКонсилиум» при обработке персональных данных пользователей.',
  };
}

function ForecastRequestModal({ open, onClose, lang, presetTopic }) {
  const l = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const s = forecastStrings(l);

  const [emailVal, setEmailVal] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => { if (e.key === 'Escape' && !sending) onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose, sending]);

  React.useEffect(() => {
    if (!open) return undefined;
    if (window.lockPageScroll) window.lockPageScroll();
    return () => { if (window.unlockPageScroll) window.unlockPageScroll(); };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setEmailVal('');
      setTopic('');
      setHoneypot('');
      setConsent(false);
      setError('');
      setSending(false);
      setSuccess(false);
      return;
    }
    setTopic(String(presetTopic || '').trim());
    setConsent(false);
    setError('');
    setSuccess(false);
  }, [open, presetTopic]);

  function goPrivacy(e) {
    e.preventDefault();
    onClose();
    window.setTimeout(() => {
      const nav = window.pharmNavigate;
      const current = String(window.location.pathname || '/').replace(/^\/+/, '').replace(/\/+$/, '') || 'home';
      if (current !== 'privacy') {
        if (typeof nav === 'function') nav('privacy');
        else window.history.pushState(null, '', '/privacy');
      } else {
        const el = document.getElementById('privacy-policy');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }

  async function submit(e) {
    e.preventDefault();
    if (sending || success) return;
    setError('');
    if (!emailVal.trim()) {
      setError(s.errEmail);
      return;
    }
    if (!consent) {
      setError(s.errConsent);
      return;
    }
    if (!window.submitPharmForm) {
      setError(s.errByCode.network);
      return;
    }

    setSending(true);
    try {
      await window.submitPharmForm({
        type: 'forecast',
        lang: l,
        website: honeypot,
        consent: true,
        email: emailVal.trim(),
        topic: String(topic || '').trim(),
      });
      if (window.pharmTrackEvent) {
        window.pharmTrackEvent('forecast_form_submit', { event_category: 'engagement' });
      }
      setSuccess(true);
      window.setTimeout(() => onClose(), 2600);
    } catch (err) {
      const code = err && err.code ? err.code : 'send_failed';
      const msg = window.pharmFormErrorMessage
        ? window.pharmFormErrorMessage(code, s)
        : s.errSend;
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="contact-modal-backdrop" role="presentation" onClick={sending ? undefined : onClose}>
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forecast-modal-title"
        onClick={(ev) => ev.stopPropagation()}>
        <button type="button" className="contact-modal-close btn-icon" aria-label={s.close} onClick={onClose} disabled={sending}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="forecast-modal-title" className="contact-modal-title">{s.title}</h2>
        <p className="contact-modal-note">{s.note}</p>
        {success ?
        <div className="contact-modal-success" role="status">{s.success}</div> :
        <form className="contact-modal-form" onSubmit={submit} noValidate>
          {error ? <div className="contact-modal-error" role="alert">{error}</div> : null}
          <label className="contact-honeypot" aria-hidden="true">
            <span>Website</span>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>

          <label className="contact-field contact-channel-field">
            <span className="contact-label contact-label-muted">{s.emailLabel}</span>
            <input
              type="email"
              name="replyEmail"
              autoComplete="email"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              placeholder="example@email.com"
              required
              disabled={sending}
            />
          </label>

          <label className="contact-field contact-field-block">
            <span className="contact-label">{s.topicLabel}</span>
            <textarea
              name="topic"
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={s.topicPlaceholder}
              disabled={sending}
            />
          </label>

          <label className="contact-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={sending} />
            <span>
              {s.consentBefore}{' '}
              <a href="/privacy" className="contact-inline-link" onClick={goPrivacy}>
                {s.consentLink}
              </a>{' '}
              {s.consentAfter}
            </span>
          </label>

          <div className="contact-modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !consent || !emailVal.trim()}
            >
              {sending ? s.submitting : s.submit}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={sending}>{s.cancel}</button>
          </div>
        </form>}
      </div>
    </div>
  );
}

window.ForecastRequestModal = ForecastRequestModal;
