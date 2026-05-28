// Shared «Discuss your project» form — header Contacts, mid strip, end strip.
// Submit: mailto:pharmconsilium@gmail.com (static hosting; user completes send in mail client).

const CONTACT_MAIL = 'pharmconsilium@gmail.com';

const EXTRA_CHANNELS_RU = [
  { id: 'phone', label: 'Телефон', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'telegram', label: 'Telegram', placeholder: '@username или +375 …', inputType: 'text', autoComplete: 'off' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'viber', label: 'Viber', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'signal', label: 'Signal', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
];

function contactStrings(lang) {
  const en = lang === 'en' && window.getContactCopy ? window.getContactCopy(lang) : null;
  if (en) {
    return {
      ...en,
      channels: en.channels || EXTRA_CHANNELS_RU,
      mailSubject: (name) => en.mailSubject.replace('{name}', name),
      errExtra: (label) => en.errExtra.replace('{label}', label),
    };
  }
  return {
    close: 'Закрыть',
    title: 'Давайте обсудим, что вам интересно',
    note: 'Письмо откроется в вашей почтовой программе на адрес',
    noteSuffix: '— проверьте поля и нажмите «Отправить» в клиенте.',
    errRequired: 'Заполните обязательные поля: имя, компания / бренд, текст обращения.',
    errConsent: 'Нужно согласие на обработку персональных данных.',
    errEmail: 'Укажите e-mail — поле обязательно.',
    errExtra: (label) => `Укажите ${label} — выбран этот способ связи.`,
    mailSubject: (name) => `ФармКонсилиум: обращение от ${name}`,
    mailBodyIntro: 'Имя:',
    mailCompany: 'Компания / бренд:',
    mailEmail: 'E-mail:',
    mailExtra: (label, val) => `Доп. связь (${label}): ${val}`,
    mailExtraNone: 'Доп. связь: —',
    mailMessage: 'Тема, вопрос или задание:',
    nameLabel: 'Ваше имя *',
    companyLabel: 'Название компании, бренд *',
    channelsLegend: 'Укажите предпочтительный способ коммуникации *',
    emailLabel: 'E-mail *',
    messageLabel: 'Тема, вопрос или задание, с которым вы хотите обратиться *',
    messagePlaceholder: 'Опишите запрос — с вами свяжется релевантный специалист.',
    consentBefore: 'Я даю согласие на обработку персональных данных в соответствии с',
    consentLink: 'политикой конфиденциальности',
    consentAfter: 'ЧП «ФармКонсилиум» при обработке персональных данных пользователей.',
    submit: 'Отправить',
    cancel: 'Отмена',
    channels: EXTRA_CHANNELS_RU,
  };
}

function ContactFormModal({ open, onClose, lang }) {
  const l = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const s = contactStrings(l);
  const channels = s.channels;

  const [fullName, setFullName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [emailVal, setEmailVal] = React.useState('');
  const [extraPref, setExtraPref] = React.useState('phone');
  const [extraDetail, setExtraDetail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return undefined;
    if (window.lockPageScroll) window.lockPageScroll();
    return () => {
      if (window.unlockPageScroll) window.unlockPageScroll();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setFullName('');
      setCompany('');
      setEmailVal('');
      setExtraPref('phone');
      setExtraDetail('');
      setMessage('');
      setConsent(false);
      setError('');
    }
  }, [open]);

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
    if (!fullName.trim() || !company.trim() || !message.trim()) {
      setError(s.errRequired);
      return;
    }
    if (!consent) {
      setError(s.errConsent);
      return;
    }
    if (!emailVal.trim()) {
      setError(s.errEmail);
      return;
    }
    const extra = channels.find((c) => c.id === extraPref);
    if (extraPref && extra && !extraDetail.trim()) {
      setError(typeof s.errExtra === 'function' ? s.errExtra(extra.label) : s.errExtra);
      return;
    }

    const subj = s.mailSubject(fullName.trim());
    const body = [
      `${s.mailBodyIntro} ${fullName.trim()}`,
      `${s.mailCompany} ${company.trim()}`,
      `${s.mailEmail} ${emailVal.trim()}`,
      extra ?
        (l === 'en' ?
          `${s.mailExtra.replace('{label}', extra.label)} ${extraDetail.trim()}` :
          `${s.mailExtra(extra.label, extraDetail.trim())}`) :
        s.mailExtraNone,
      '',
      s.mailMessage,
      message.trim(),
    ].join('\n');

    window.location.href = `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    onClose();
  }

  if (!open) return null;

  const activeExtra = channels.find((c) => c.id === extraPref);

  function selectExtra(id) {
    setExtraPref(id);
    setExtraDetail('');
    setError('');
  }

  return (
    <div className="contact-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(ev) => ev.stopPropagation()}>
        <button type="button" className="contact-modal-close btn-icon" aria-label={s.close} onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="contact-modal-title" className="contact-modal-title">{s.title}</h2>
        <p className="contact-modal-note">
          {s.note} <strong>{CONTACT_MAIL}</strong> {s.noteSuffix}
        </p>
        <form className="contact-modal-form" onSubmit={submit} noValidate>
          {error ? <div className="contact-modal-error" role="alert">{error}</div> : null}
          <div className="contact-modal-grid">
            <label className="contact-field">
              <span className="contact-label">{s.nameLabel}</span>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elon Musk"
                required
              />
            </label>
            <label className="contact-field">
              <span className="contact-label">{s.companyLabel}</span>
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Viagra, Pfizer"
                required
              />
            </label>
          </div>

          <fieldset className="contact-fieldset">
            <legend className="contact-label">{s.channelsLegend}</legend>
            <div className="contact-radio-row contact-radio-row--channels">
              {channels.map((ch) =>
              <label key={ch.id} className="contact-radio">
                  <input
                    type="radio"
                    name="extraPref"
                    checked={extraPref === ch.id}
                    onChange={() => selectExtra(ch.id)}
                  />
                  <span>{ch.label}</span>
                </label>
              )}
            </div>
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
            {activeExtra ?
            <label className="contact-field contact-channel-field">
              <span className="contact-label contact-label-muted">{activeExtra.label}</span>
              <input
                type={activeExtra.inputType}
                name={`contact-${activeExtra.id}`}
                autoComplete={activeExtra.autoComplete}
                value={extraDetail}
                onChange={(e) => setExtraDetail(e.target.value)}
                placeholder={activeExtra.placeholder}
              />
            </label> :
            null}
          </fieldset>

          <label className="contact-field contact-field-block">
            <span className="contact-label">{s.messageLabel}</span>
            <textarea
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={s.messagePlaceholder}
              required
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
              disabled={!consent || !fullName.trim() || !company.trim() || !emailVal.trim() || !message.trim()}
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

window.ContactFormModal = ContactFormModal;
