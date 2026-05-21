// Статичные CTA «Обсудить проект» / «Больше информации» — mid и end полосы.

function MidContactStrip({ compact, alignStart, inline, lang }) {
  const l = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const label = window.tUI ? window.tUI('discussProject', l) : 'Обсудить проект';
  const aria = window.tUI ? window.tUI('midStripAria', l) : 'Обсудить проект';
  const btn = (
    <button type="button" className="btn btn-primary btn-sm" onClick={() => window.openPharmContact?.()}>
      {label} <span className="arrow">→</span>
    </button>
  );
  if (inline) {
    return btn;
  }
  return (
    <div
      className={`contact-strip-mid${compact ? ' contact-strip-mid--compact' : ''}`}
      role="region"
      aria-label={aria}>
      <div
        className={compact ? '' : 'container'}
        style={
          compact
            ? {
              display: 'flex',
              justifyContent: alignStart ? 'flex-start' : 'center'
            }
            : undefined
        }
      >
        {btn}
      </div>
    </div>
  );
}

function EndContactStrip({ lang }) {
  const l = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const label = window.tUI ? window.tUI('moreInfo', l) : 'Больше информации';
  const aria = window.tUI ? window.tUI('endStripAria', l) : 'Дополнительная информация';
  return (
    <section className="contact-strip-end" aria-label={aria}>
      <div className="container">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => window.openPharmContact?.()}>
          {label} <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}

window.MidContactStrip = MidContactStrip;
window.EndContactStrip = EndContactStrip;
