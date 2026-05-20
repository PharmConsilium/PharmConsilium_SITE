// Shared «Обсудить проект» форма — из шапки «Контакты», середины страницы «Обсудить проект», нижней полосы «Больше информации».
// Submit: mailto:pharmconsilium@gmail.com (static hosting; user completes send in mail client).

const CONTACT_MAIL = 'pharmconsilium@gmail.com';

const EXTRA_CHANNELS = [
  { id: 'phone', label: 'Телефон', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'telegram', label: 'Telegram', placeholder: '@username или +375 …', inputType: 'text', autoComplete: 'off' },
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'viber', label: 'Viber', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
  { id: 'signal', label: 'Signal', placeholder: '+375 (__) ___-__-__', inputType: 'tel', autoComplete: 'tel' },
];

function ContactFormModal({ open, onClose }) {
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
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
      const el = document.getElementById('privacy-policy');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function submit(e) {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !company.trim() || !message.trim()) {
      setError('Заполните обязательные поля: имя, компания / бренд, текст обращения.');
      return;
    }
    if (!consent) {
      setError('Нужно согласие на обработку персональных данных.');
      return;
    }
    if (!emailVal.trim()) {
      setError('Укажите e-mail — поле обязательно.');
      return;
    }
    const extra = EXTRA_CHANNELS.find((c) => c.id === extraPref);
    if (extraPref && extra && !extraDetail.trim()) {
      setError(`Укажите ${extra.label} — выбран этот способ связи.`);
      return;
    }

    const subj = `ФармКонсилиум: обращение от ${fullName.trim()}`;
    const body = [
      `Имя: ${fullName.trim()}`,
      `Компания / бренд: ${company.trim()}`,
      `E-mail: ${emailVal.trim()}`,
      extra ?
        `Доп. связь (${extra.label}): ${extraDetail.trim()}` :
        'Доп. связь: —',
      '',
      'Тема, вопрос или задание:',
      message.trim(),
    ].join('\n');

    window.location.href = `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    onClose();
  }

  if (!open) return null;

  const activeExtra = EXTRA_CHANNELS.find((c) => c.id === extraPref);

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
        <button type="button" className="contact-modal-close btn-icon" aria-label="Закрыть" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="contact-modal-title" className="contact-modal-title">Давайте обсудим, что вам интересно</h2>
        <p className="contact-modal-note">
          Письмо откроется в вашей почтовой программе на адрес <strong>{CONTACT_MAIL}</strong> — проверьте поля и нажмите «Отправить» в клиенте.
        </p>
        <form className="contact-modal-form" onSubmit={submit} noValidate>
          {error ? <div className="contact-modal-error" role="alert">{error}</div> : null}
          <div className="contact-modal-grid">
            <label className="contact-field">
              <span className="contact-label">Ваше имя *</span>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
                required
              />
            </label>
            <label className="contact-field">
              <span className="contact-label">Название компании, бренд *</span>
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="ООО «…», бренд …"
                required
              />
            </label>
          </div>

          <fieldset className="contact-fieldset">
            <legend className="contact-label">Укажите предпочтительный способ коммуникации *</legend>
            <div className="contact-radio-row contact-radio-row--channels">
              {EXTRA_CHANNELS.map((ch) =>
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
              <span className="contact-label contact-label-muted">E-mail *</span>
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
            <span className="contact-label">Тема, вопрос или задание, с которым вы хотите обратиться *</span>
            <textarea
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите запрос — с вами свяжется релевантный специалист."
              required
            />
          </label>

          <label className="contact-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              Я даю согласие на обработку персональных данных в соответствии с{' '}
              <a href="#privacy-policy" className="contact-inline-link" onClick={goPrivacy}>
                политикой конфиденциальности
              </a>{' '}
              ЧП «ФармКонсилиум» при обработке персональных данных пользователей.
            </span>
          </label>

          <div className="contact-modal-actions">
            <button type="submit" className="btn btn-primary">Отправить</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.ContactFormModal = ContactFormModal;
