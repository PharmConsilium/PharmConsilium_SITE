// Forecast request modal (static hosting): opens a prefilled mailto draft.

const FORECAST_MAIL = 'pharmconsilium@gmail.com';

function forecastStrings(lang) {
  const l = lang || 'ru';
  if (l === 'en') {
    return {
      close: 'Close',
      title: 'AI Robby will calculate your brand forecast in CIS pharma market',
      note: 'Your message will be sent to',
      noteSuffix: '— review fields and press “Send” in your client.',
      errEmail: 'Please provide a valid e-mail.',
      errConsent: 'Consent is required to proceed.',
      emailLabel: 'E-mail *',
      topicLabel: 'Topic',
      topicPlaceholder: 'Brand / country / details…',
      submit: 'Send',
      cancel: 'Cancel',
      mailSubject: 'PharmConsilium: AI forecast request',
      mailBodyEmail: 'E-mail:',
      mailBodyTopic: 'Topic:',
      consentBefore: 'I consent to personal data processing under the',
      consentLink: 'privacy policy',
      consentAfter: 'of PharmConsilium.',
    };
  }
  return {
    close: 'Закрыть',
    title: 'Искусственный интеллект Робби рассчитает прогноз вашего бренда на фармацевтическом рынке СНГ',
    note: 'Письмо отправится на адрес',
    noteSuffix: '— проверьте поля и нажмите «Отправить» в клиенте.',
    errEmail: 'Укажите e-mail — поле обязательно.',
    errConsent: 'Нужно согласие на обработку персональных данных.',
    emailLabel: 'E-mail *',
    topicLabel: 'Тема',
    topicPlaceholder: 'Бренд / страна / детали…',
    submit: 'Отправить',
    cancel: 'Отмена',
    mailSubject: 'ФармКонсилиум: запрос прогноза ИИ',
    mailBodyEmail: 'E-mail:',
    mailBodyTopic: 'Тема:',
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
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return undefined;
    if (window.lockPageScroll) window.lockPageScroll();
    return () => { if (window.unlockPageScroll) window.unlockPageScroll(); };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setEmailVal('');
      setTopic('');
      setConsent(false);
      setError('');
      return;
    }
    setTopic(String(presetTopic || '').trim());
    setConsent(false);
    setError('');
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

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!emailVal.trim()) {
      setError(s.errEmail);
      return;
    }
    if (!consent) {
      setError(s.errConsent);
      return;
    }
    const subj = s.mailSubject;
    const body = [
      `${s.mailBodyEmail} ${emailVal.trim()}`,
      `${s.mailBodyTopic} ${String(topic || '').trim()}`,
    ].join('\n');

    window.location.href = `mailto:${FORECAST_MAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    onClose();
  }

  if (!open) return null;

  return (
    <div className="contact-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forecast-modal-title"
        onClick={(ev) => ev.stopPropagation()}>
        <button type="button" className="contact-modal-close btn-icon" aria-label={s.close} onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="forecast-modal-title" className="contact-modal-title">{s.title}</h2>
        <p className="contact-modal-note">
          {s.note} <strong>{FORECAST_MAIL}</strong> {s.noteSuffix}
        </p>
        <form className="contact-modal-form" onSubmit={submit} noValidate>
          {error ? <div className="contact-modal-error" role="alert">{error}</div> : null}

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
            />
          </label>

          <label className="contact-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              {s.consentBefore}{' '}
              <a href="#privacy" className="contact-inline-link" onClick={goPrivacy}>
                {s.consentLink}
              </a>{' '}
              {s.consentAfter}
            </span>
          </label>

          <div className="contact-modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!consent || !emailVal.trim()}
            >
              {s.submit}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>{s.cancel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.ForecastRequestModal = ForecastRequestModal;

