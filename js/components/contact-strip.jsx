// Статичные CTA «Обсудить проект» / «Больше информации» — mid и end полосы поменяны местами по смыслу.

function MidContactStrip({ compact, alignStart, inline }) {
  const btn = (
    <button type="button" className="btn btn-primary btn-sm" onClick={() => window.openPharmContact?.()}>
      Обсудить проект <span className="arrow">→</span>
    </button>
  );
  if (inline) {
    return btn;
  }
  return (
    <div
      className={`contact-strip-mid${compact ? ' contact-strip-mid--compact' : ''}`}
      role="region"
      aria-label="Обсудить проект">
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

function EndContactStrip() {
  return (
    <section className="contact-strip-end" aria-label="Дополнительная информация">
      <div className="container">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => window.openPharmContact?.()}>
          Больше информации <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}

window.MidContactStrip = MidContactStrip;
window.EndContactStrip = EndContactStrip;
