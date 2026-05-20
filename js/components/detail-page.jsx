// DetailPage — renders any subpage from SUBPAGES dictionary.

function DetailPage({ routeId, navigate }) {
  const data = window.SUBPAGES[routeId];
  const MidContactStrip = window.MidContactStrip;

  if (!data) {
    return (
      <main className="page-route">
        <section className="page-hero">
          <div className="container">
            <div className="crumbs">
              <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
              <span className="sep">/</span>
              <span style={{ color: 'var(--ink)' }}>Страница в разработке</span>
            </div>
            <h1>Страница<br />в разработке.</h1>
            <p className="lede">Запрошенный подраздел скоро появится. Возвращайтесь на главную или напишите нам — расскажем подробнее.</p>
            <button className="btn btn-primary" onClick={() => navigate('home')}>На главную →</button>
          </div>
        </section>
        {MidContactStrip ? <MidContactStrip /> : null}
      </main>);

  }

  const Art = window[data.art] || window.ArtConstellation;

  return (
    <main className="page-route">
      <section className="detail-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span onClick={() => navigate(data.sectionId)} style={{ cursor: 'pointer' }}>{data.section}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{data.title}</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 18 }}>{data.section}</div>
          <h1>{data.title}</h1>
          <p className="lede">{data.lede}</p>
          <div className="tags">
            {(data.tags || []).map((t, i) =>
            <span key={i} className="chip" style={{
              background: 'var(--surface)',
              border: 'none',
              color: 'var(--ink-2)'
            }}>{t}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
            <button className="btn btn-ghost">Скачать описание · PDF</button>
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip /> : null}

      <section className="container">
        <div className="detail-grid">
          <div className="detail-body">
            <h2>О чём это</h2>
            {(data.about || []).map((p, i) => <p key={i}>{p}</p>)}

            <h2>Что внутри</h2>
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

            <h2>Что вы получаете</h2>
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
          }}>Как мы работаем</h2>
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
            <h3>Готовы обсудить?</h3>
            <p>Покажем кейсы, разложим бюджет и сроки, дадим пилот за 2 недели.</p>
          </div>
          <div className="detail-cta-actions">
            <button type="button" className="btn btn-primary" onClick={() => window.openPharmContact?.()}>Контакты <span className="arrow">→</span></button>
            <button type="button" className="btn btn-ghost">Кейсы · PDF</button>
          </div>
        </div>

        {data.related && data.related.length > 0 &&
        <div>
            <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(24px, 3vw, 36px)',
            letterSpacing: '-.025em', margin: '40px 0 20px'
          }}>Смотрите также</h2>
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