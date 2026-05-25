// DetailPage — renders any subpage from SUBPAGES dictionary.

function DetailArtSlides({ slides }) {
  const items = slides || [];
  const [idx, setIdx] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(null);
  const n = items.length;

  const prev = React.useCallback(() => {
    setIdx((i) => (i - 1 + n) % n);
  }, [n]);

  const next = React.useCallback(() => {
    setIdx((i) => (i + 1) % n);
  }, [n]);

  const closeLightbox = React.useCallback(() => setLightbox(null), []);

  React.useEffect(() => {
    if (n <= 1 || lightbox != null) return undefined;
    const timer = setInterval(() => setIdx((i) => (i + 1) % n), 6000);
    return () => clearInterval(timer);
  }, [n, lightbox]);

  React.useEffect(() => {
    if (lightbox == null) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('is-detail-slide-lightbox-open');
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('is-detail-slide-lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox]);

  if (!n) return null;

  const cur = items[idx];
  const zoomed = lightbox != null ? items[lightbox] : null;

  const lightboxLayer = zoomed ? (
    <div
      className="detail-art-lightbox-backdrop"
      role="presentation"
      onClick={closeLightbox}
    >
      <div
        className="detail-art-lightbox-shell"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="detail-art-lightbox-close"
          onClick={closeLightbox}
          aria-label="Закрыть"
        >
          ×
        </button>
        <div
          className="detail-art-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.alt || zoomed.label || 'Увеличенный слайд'}
        >
          {zoomed.label ? <div className="detail-art-lightbox-caption">{zoomed.label}</div> : null}
          <img
            className="detail-art-lightbox-img"
            src={zoomed.src}
            alt={zoomed.alt || zoomed.label || ''}
            decoding="async"
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
    <div className="detail-art-slider">
      <div className="detail-art-slider-stage proj-slider-stage proj-slider-stage--image">
        {items.map((s, i) =>
          <div key={i} className={`proj-slide ${i === idx ? 'on' : ''}`}>
            <button
              type="button"
              className="detail-art-slide-zoom"
              onClick={() => i === idx && setLightbox(i)}
              aria-label={s.alt ? `Увеличить: ${s.alt}` : 'Увеличить слайд'}
              tabIndex={i === idx ? 0 : -1}
            >
              <img
                className="proj-slide-img detail-art-slide-img"
                src={s.src}
                alt={s.alt || s.label || ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </button>
          </div>
        )}
        {n > 1 &&
          <>
            <div className="proj-slider-meta">
              <span>{String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
              {cur.label ? <span>· {cur.label}</span> : null}
            </div>
            <button type="button" className="proj-slider-nav prev" onClick={prev} aria-label="Предыдущий слайд">←</button>
            <button type="button" className="proj-slider-nav next" onClick={next} aria-label="Следующий слайд">→</button>
          </>
        }
      </div>
      {n > 1 &&
        <div className="proj-slider-dots detail-art-slider-dots">
          {items.map((_, i) =>
            <button
              key={i}
              type="button"
              className={`dot ${i === idx ? 'on' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Слайд ${i + 1}`}
            />
          )}
        </div>
      }
    </div>
    {lightboxLayer && ReactDOM.createPortal(lightboxLayer, document.body)}
    </>
  );
}

function DetailPage({ routeId, navigate, lang }) {
  const data = window.SUBPAGES[routeId];
  const MidContactStrip = window.MidContactStrip;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);

  if (!data) {
    return (
      <main className="page-route">
        <section className="page-hero">
          <div className="container">
            <div className="crumbs">
              <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
              <span className="sep">/</span>
              <span style={{ color: 'var(--ink)' }}>{t('notFoundCrumb')}</span>
            </div>
            <h1>{t('notFoundH1')}</h1>
            <p className="lede">{t('notFoundLede')}</p>
            <button className="btn btn-primary" onClick={() => navigate('home')}>{t('notFoundBtn')} →</button>
          </div>
        </section>
        {MidContactStrip ? <MidContactStrip lang={lang} /> : null}
      </main>);

  }

  const Art = window[data.art] || window.ArtConstellation;
  const PageHeroH1 = window.PageHeroH1;
  const splitPageTitle = window.splitPageTitle;
  const titleParts = data.h1Line1 != null ?
    { line1: data.h1Line1, accent: data.h1Accent, accent2: data.h1Accent2 } :
    (splitPageTitle ? splitPageTitle(data.title) : { line1: data.title, accent: null, accent2: null });

  return (
    <main className="page-route">
      <section className="detail-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span onClick={() => navigate(data.sectionId)} style={{ cursor: 'pointer' }}>{data.section}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{data.title}</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 18 }}>{data.section}</div>
          <PageHeroH1 line1={titleParts.line1} accent={titleParts.accent} accent2={titleParts.accent2} />
          <p className="lede">{data.lede}</p>
          <div className="tags">
            {(data.tags || []).map((tag, i) =>
            <span key={i} className="chip" style={{
              background: 'var(--surface)',
              border: 'none',
              color: 'var(--ink-2)'
            }}>{tag}</span>
            )}
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section className="container">
        <div className="detail-grid">
          <div className="detail-body">
            <h2>{data.aboutTitle || t('detailAbout')}</h2>
            {(data.about || []).map((p, i) => <p key={i}>{p}</p>)}

            <h2>{t('detailFeatures')}</h2>
            <ul className="feat-list">
              {(data.features || []).map((f, i) =>
              <li key={i}>
                  <div className="ic">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ft">
                    <b>{f.t}</b>
                    <span>{f.d}</span>
                  </div>
                </li>
              )}
            </ul>

            <h2>{data.deliverablesTitle || t('detailDeliverables')}</h2>
            <ul className="deliver-list">
              {(data.deliverables || []).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className={`detail-art${data.artSlides?.length ? ' detail-art--slides' : ''}`}>
            {data.artSlides?.length
              ? <DetailArtSlides slides={data.artSlides} />
              : Art ? <Art /> : null}
          </div>
        </div>

        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(28px, 3.4vw, 42px)',
            letterSpacing: '-.025em', margin: '0 0 24px'
          }}>{data.stepsTitle || t('detailSteps')}</h2>
          <div className="steps">
            {(data.steps || []).map((s, i) =>
            <div key={i} className="step">
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-cta">
          <div>
            <h3>{t('detailCtaH3')}</h3>
            {t('detailCtaP') ? <p>{t('detailCtaP')}</p> : null}
          </div>
          <div className="detail-cta-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.openPharmContact?.()}>{t('contacts')} <span className="arrow">→</span></button>
          </div>
        </div>

        {data.related && data.related.length > 0 &&
        <div>
            <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(24px, 3vw, 36px)',
            letterSpacing: '-.025em', margin: '40px 0 20px'
          }}>{t('detailRelated')}</h2>
            <div className="related">
              {data.related.map((rid, i) => {
              const r = window.SUBPAGES[rid];
              if (!r) return null;
              const RA = window[r.art] || window.ArtConstellation;
              return (
                <div key={i} className="rel-card" onClick={() => navigate(rid)}>
                    <div className="rel-art"><RA /></div>
                    <div>
                      <h4>{r.title}</h4>
                      <p>{r.section}</p>
                    </div>
                  </div>);

            })}
            </div>
          </div>
        }
      </section>
    </main>);

}

window.DetailPage = DetailPage;
