// DetailPage — renders any subpage from SUBPAGES dictionary.

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
          <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
            <button className="btn btn-ghost">{t('detailDownload')}</button>
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section className="container">
        <div className="detail-grid">
          <div className="detail-body">
            <h2>{t('detailAbout')}</h2>
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

            <h2>{t('detailDeliverables')}</h2>
            <ul className="deliver-list">
              {(data.deliverables || []).map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className="detail-art">
            <Art />
          </div>
        </div>

        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(28px, 3.4vw, 42px)',
            letterSpacing: '-.025em', margin: '0 0 24px'
          }}>{t('detailSteps')}</h2>
          <div className="steps">
            {(data.steps || []).map((s, i) =>
            <div key={i} className="step">
                <div className="step-n">— {s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-cta">
          <div>
            <h3>{t('detailCtaH3')}</h3>
            <p>{t('detailCtaP')}</p>
          </div>
          <div className="detail-cta-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.openPharmContact?.()}>{t('contacts')} <span className="arrow">→</span></button>
            <button type="button" className="btn btn-ghost">{t('detailCases')}</button>
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
