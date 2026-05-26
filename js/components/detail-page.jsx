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

  const lightboxPrev = React.useCallback(() => {
    if (n <= 1) return;
    setLightbox((i) => {
      const next = (i - 1 + n) % n;
      setIdx(next);
      return next;
    });
  }, [n]);

  const lightboxNext = React.useCallback(() => {
    if (n <= 1) return;
    setLightbox((i) => {
      const next = (i + 1) % n;
      setIdx(next);
      return next;
    });
  }, [n]);

  React.useEffect(() => {
    if (lightbox == null) return undefined;
    const slide = items[lightbox];
    if (slide) {
      const preload = new Image();
      preload.src = slide.srcFull || slide.src;
    }
    if (window.lockPageScroll) window.lockPageScroll();
    document.body.classList.add('is-detail-slide-lightbox-open');
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') lightboxPrev();
      else if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (window.unlockPageScroll) window.unlockPageScroll();
      document.body.classList.remove('is-detail-slide-lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, lightboxPrev, lightboxNext, items]);

  if (!n) return null;

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
        <div className="detail-art-lightbox-toolbar">
          {n > 1 ? (
            <>
              <button
                type="button"
                className="detail-art-lightbox-nav"
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                aria-label="Предыдущий слайд"
              >
                ←
              </button>
              <button
                type="button"
                className="detail-art-lightbox-nav"
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                aria-label="Следующий слайд"
              >
                →
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="detail-art-lightbox-close"
            onClick={closeLightbox}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div
          className="detail-art-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.alt || zoomed.label || 'Увеличенный слайд'}
        >
          {zoomed.label ? <div className="detail-art-lightbox-caption">{zoomed.label}</div> : null}
          <img
            className="detail-art-lightbox-img"
            src={zoomed.srcFull || zoomed.src}
            alt={zoomed.alt || zoomed.label || ''}
            loading="eager"
            decoding="sync"
            draggable={false}
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
        {n > 1 ? (
          <>
            <button type="button" className="proj-slider-nav prev" onClick={prev} aria-label="Предыдущий слайд">←</button>
            <button type="button" className="proj-slider-nav next" onClick={next} aria-label="Следующий слайд">→</button>
          </>
        ) : null}
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
  const longformSections = data.detailLongform && window.getDigitalRepDetailSections
    ? window.getDigitalRepDetailSections(lang)
    : null;

  return (
    <main className="page-route">
      <section className={`detail-hero${data.h1Wide ? ' detail-hero--h1-wide' : ''}`}>
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span onClick={() => navigate(data.sectionId)} style={{ cursor: 'pointer' }}>{data.section}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{data.crumb || data.title}</span>
          </div>
          <div
            className={`eyebrow${data.eyebrowOneLine ? ' eyebrow--one-line' : ''}`}
            style={{ marginTop: 18 }}
          >
            {data.eyebrow || data.section}
          </div>
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

            {longformSections ? <DetailLongform sections={longformSections} /> : null}

            {!data.detailLongform ?
              <>
            <h2>{data.featuresTitle || t('detailFeatures')}</h2>
            <ul className="feat-list">
              {(data.features || []).map((f, i) =>
              <li key={i}>
                  <div className="ic">{String(i + 1).padStart(2, '0')}</div>
                  <div className="ft">
                    <b>{f.t}</b>
                    {f.d ? <span>{f.d}</span> : null}
                    {f.list?.length ? (
                      <ul className="feat-sublist">
                        {f.list.map((item, j) => (
                          <li key={j}>
                            <span className="feat-sublist-text">
                              <b>{item.t}</b>
                              {' — '}
                              {item.d}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              )}
            </ul>

            <h2>{data.deliverablesTitle || t('detailDeliverables')}</h2>
            <ul className="deliver-list">
              {(data.deliverables || []).map((d, i) => {
                const isObj = d && typeof d === 'object';
                const label = isObj ? d.t : null;
                const body = isObj ? d.d : d;
                return (
                  <li key={i}>
                    {label ? (
                      <span className="deliver-item-inner">
                        <b className="deliver-item-kicker">{label}</b>
                        <span className="deliver-item-body">{body}</span>
                      </span>
                    ) : body}
                  </li>
                );
              })}
            </ul>
              </> :
              null}
          </div>

          <div className={`detail-art${data.artSlides?.length ? ' detail-art--slides' : ''}`}>
            {data.artSlides?.length
              ? <DetailArtSlides slides={data.artSlides} />
              : Art ? <Art /> : null}
          </div>
        </div>

        {!data.detailLongform ?
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(28px, 3.4vw, 42px)',
            letterSpacing: '-.025em', margin: '0 0 24px'
          }}>{data.stepsTitle || t('detailSteps')}</h2>
          {(() => {
            const allSteps = data.steps || [];
            const reg = data.stepsRegulatory;
            const stepsGridClass = reg ? 'steps steps--2col' : 'steps';
            return (
              <>
                <div className={stepsGridClass}>
                  {allSteps.map((s, i) => (
                    <div key={i} className="step">
                      <h4>{s.t}</h4>
                      <p>{s.d}</p>
                    </div>
                  ))}
                </div>
                {reg ? (
                  <div className="detail-regulatory">
                    <h2 className="detail-regulatory-title">{reg.title}</h2>
                    {reg.intro ? <p className="detail-regulatory-intro">{reg.intro}</p> : null}
                    <ul className="detail-regulatory-list">
                      {(reg.items || []).map((item, i) => (
                        <li key={i}>
                          <b>{item.t}</b>
                          <span>{item.d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            );
          })()}
        </div> :
        null}

        <div className={`detail-cta${data.detailCtaTopics?.length ? ' detail-cta--scroll-list' : ''}`}>
          <div className="detail-cta-body">
            <h3>{data.detailCtaH3 || t('detailCtaH3')}</h3>
            {(data.detailCtaP || t('detailCtaP')) ? <p>{data.detailCtaP || t('detailCtaP')}</p> : null}
            {data.detailCtaTopics?.length ? (
              <ol className="detail-cta-topics">
                {data.detailCtaTopics.map((topic, i) => <li key={i}>{topic}</li>)}
              </ol>
            ) : null}
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

function DetailLongform({ sections }) {
  if (!sections?.length) return null;
  return (
    <div className="detail-longform">
      {sections.map((block, i) => {
        if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
        if (block.type === 'p') return <p key={i}>{block.text}</p>;
        if (block.type === 'ul') {
          return (
            <ul key={i} className="detail-longform-ul">
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        }
        if (block.type === 'cards') {
          return (
            <div key={i} className="detail-longform-cards">
              {block.items.map((c, j) => (
                <div key={j} className="detail-longform-card">
                  <h3>{c.t}</h3>
                  {c.d ? <p>{c.d}</p> : null}
                </div>
              ))}
            </div>
          );
        }
        if (block.type === 'faq') {
          return (
            <div key={i} className="detail-longform-faq">
              {block.items.map((f, j) => (
                <div key={j} className="detail-longform-faq-item">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

window.DetailPage = DetailPage;
