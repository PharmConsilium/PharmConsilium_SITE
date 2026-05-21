// PortfolioPage — gallery of cases.
// ProjectPage — single case study.

function PortfolioPage({ navigate, lang }) {
  const [filter, setFilter] = React.useState('all');
  const cats = ['all', ...Array.from(new Set(window.PORTFOLIO.map((p) => p.category)))];
  const visible = window.PORTFOLIO.filter((p) => filter === 'all' || p.category === filter);
  const MidContactStrip = window.MidContactStrip;
  const ui = lang === 'en' && window.getPortfolioUi ? window.getPortfolioUi(lang) : null;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const PageHeroH1 = window.PageHeroH1;

  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{ui ? ui.crumb : 'Портфолио, проекты, и фичи ФармКонсилиум'}</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 18 }}>{ui ? ui.eyebrow : 'Проекты последних 24 месяцев'}</div>
          <PageHeroH1
            line1={ui ? ui.h1Line1 : 'Портфолио, проекты,'}
            accent={ui ? ui.h1Accent : 'и фичи ФармКонсилиум'}
          />
          <p className="lede">
            {ui ? ui.lede : 'Восемь характерных проектов из портфолио ФармКонсилиума: от лонча кардиопрепарата за 90 дней до собственного справочника ЛС с тысячей DAU. Полное портфолио — по запросу.'}
          </p>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section className="container" style={{ padding: '40px 0 80px' }}>
        <div className="pf-filter">
          {cats.map((c) =>
          <button key={c}
          className={`pf-chip ${filter === c ? 'on' : ''}`}
          onClick={() => setFilter(c)}>
              {c === 'all' ? (ui ? ui.filterAll : 'Все') : c}
              {c !== 'all' && <span className="pf-chip-count">
                {window.PORTFOLIO.filter((p) => p.category === c).length}
              </span>}
            </button>
          )}
        </div>

        <div className="cards-grid">
          {visible.map((p, i) => {
            const Art = window[p.art] || window.ArtConstellation;
            const thumb = p.thumb;
            const thumbWide = p.thumbLayout === 'wide';
            return (
              <div key={p.slug} className="card"
                   onClick={() => navigate(`portfolio/${p.slug}`)}>
                <div
                  className={`card-art${thumb ? ' card-art--photo' : ''}${thumbWide ? ' card-art--photo-wide' : ''}`}
                  style={thumb ? undefined : { background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)` }}>
                  {thumb
                    ? <img src={thumb} alt={p.thumbAlt || p.name} loading="lazy" decoding="async" />
                    : <Art />}
                </div>
                <div className="card-num">— {String(i + 1).padStart(2, '0')}</div>
                <h3>{p.name}</h3>
                <p>{p.short}</p>
                <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip" style={{ background: 'transparent', border: 'none', color: 'var(--muted)' }}>{p.category}</span>
                  <span className="chip" style={{ background: 'transparent', border: 'none', color: 'var(--muted)' }}>{p.sector}</span>
                  <span className="chip" style={{ background: 'transparent', border: 'none', color: 'var(--muted)' }}>{p.year}</span>
                </div>
                <a className="read">{ui ? ui.openCase : 'Открыть кейс'} <span className="arrow">→</span></a>
              </div>);

          })}
        </div>

        <div className="detail-cta" style={{ marginTop: 64 }}>
          <div>
            <h3>{ui ? ui.ctaH3 : 'Не нашли свой кейс?'}</h3>
            <p>{ui ? ui.ctaP : 'У нас 80+ запусков и сотни проектов под NDA. Напишите, что нужно — пришлём подходящие материалы.'}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => window.openPharmContact?.()}>{t('contacts')} <span className="arrow">→</span></button>
            <button className="btn btn-ghost">{ui ? ui.downloadPdf : 'Скачать полное портфолио · PDF'}</button>
          </div>
        </div>
      </section>
    </main>);

}

function ProjectPage({ slug, navigate, lang }) {
  const MidContactStrip = window.MidContactStrip;
  const p = window.PORTFOLIO.find((x) => x.slug === slug);
  const ui = lang === 'en' && window.getPortfolioUi ? window.getPortfolioUi(lang) : null;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const PageHeroH1 = window.PageHeroH1;
  const splitPageTitle = window.splitPageTitle;
  const titleParts = splitPageTitle ? splitPageTitle(p.name) : { line1: p.name, accent: null };

  if (!p) {
    return (
      <main className="page-route">
        <section className="page-hero">
          <div className="container">
            <div className="crumbs">
              <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
              <span className="sep">/</span>
              <span onClick={() => navigate('portfolio')} style={{ cursor: 'pointer' }}>{ui ? ui.crumb : 'Портфолио'}</span>
              <span className="sep">/</span>
              <span style={{ color: 'var(--ink)' }}>{ui ? ui.notFoundCrumb : 'Проект не найден'}</span>
            </div>
            <h1>{ui ? ui.notFoundH1 : 'Проект не найден.'}</h1>
            <button className="btn btn-primary" onClick={() => navigate('portfolio')}>{ui ? ui.backToPortfolio : '← В портфолио'}</button>
          </div>
        </section>
        {MidContactStrip ? <MidContactStrip lang={lang} /> : null}
      </main>);

  }

  const Art = window[p.art] || window.ArtConstellation;
  const defaultArtSlides = [
    { art: Art, label: ui ? ui.slidePreview : 'Превью проекта' },
    { art: window.ArtNodes || Art, label: ui ? ui.slideArch : 'Архитектура' },
    { art: window.ArtDashboard || Art, label: ui ? ui.slideMetrics : 'Метрики' },
    { art: window.ArtLayers || Art, label: ui ? ui.slideMaterials : 'Материалы' },
  ];
  const slides = Array.isArray(p.slides) && p.slides.length ? p.slides : defaultArtSlides;
  const slideUsesImages = Boolean(slides[0] && slides[0].src);
  const slideAspect = p.slideAspect || '950 / 1024';

  const [slide, setSlide] = React.useState(0);
  const next = () => setSlide((slide + 1) % slides.length);
  const prev = () => setSlide((slide - 1 + slides.length) % slides.length);
  const slideAria = (n) => (ui ? ui.slideN.replace('{n}', n) : `Слайд ${n}`);

  return (
    <main className="page-route" style={{ '--accent-local': p.palette }}>
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span onClick={() => navigate('portfolio')} style={{ cursor: 'pointer' }}>{ui ? ui.crumb : 'Портфолио, проекты, и фичи ФармКонсилиум'}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{p.name}</span>
          </div>
          <PageHeroH1 line1={titleParts.line1} accent={titleParts.accent} accent2={titleParts.accent2} />
          <p className="lede">{p.hero}</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => navigate('portfolio')}>
              {ui ? ui.backAll : '← Все проекты'}
            </button>
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section className="container">
        <div className="proj-metrics" style={{ '--proj-accent': p.palette }}>
          {p.metrics.map((m, i) =>
          <div key={i} className="proj-metric">
              <div className="proj-metric-v">{m.value}</div>
              <div className="proj-metric-l">{m.label}</div>
            </div>
          )}
        </div>

        <div className="proj-split">
          <div className="proj-slider">
            <div
              className={`proj-slider-stage${slideUsesImages ? ' proj-slider-stage--image' : ''}`}
              style={slideUsesImages
                ? { aspectRatio: slideAspect, background: 'var(--bg-2)' }
                : { background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)` }}>
              {slides.map((s, i) => {
                const A = s.art;
                return (
                  <div key={i} className={`proj-slide ${i === slide ? 'on' : ''}`}>
                    {s.src
                      ? <img className="proj-slide-img" src={s.src} alt={s.alt || s.label} loading={i === 0 ? 'eager' : 'lazy'} />
                      : A ? <A /> : null}
                  </div>);

              })}
              <div className="proj-slider-meta">
                <span>{String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                <span>· {slides[slide].label}</span>
              </div>
              <button className="proj-slider-nav prev" onClick={prev} aria-label={ui ? ui.slidePrev : 'Назад'}>←</button>
              <button className="proj-slider-nav next" onClick={next} aria-label={ui ? ui.slideNext : 'Вперёд'}>→</button>
            </div>
            <div className="proj-slider-dots">
              {slides.map((_, i) =>
              <button key={i}
              className={`dot ${i === slide ? 'on' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={slideAria(i + 1)} />
              )}
            </div>
          </div>

          <div className="proj-desc">
            <div className="proj-desc-block">
              <div className="proj-section-label">— {ui ? ui.problem : 'Задача'}</div>
              <p className="proj-paragraph">{p.problem}</p>
            </div>

            <div className="proj-desc-block">
              <div className="proj-section-label">— {ui ? ui.solution : 'Решение'}</div>
              <ul className="proj-bullets">
                {p.approach.map((a, i) =>
                <li key={i}><b>{a.t}.</b> <span>{a.d}</span></li>
                )}
              </ul>
            </div>

            <div className="proj-desc-block">
              <div className="proj-section-label">— {ui ? ui.deliverables : 'Что получил клиент'}</div>
              <ul className="proj-bullets compact">
                {p.deliverables.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            <div className="proj-info" style={{ marginTop: 8 }}>
              <div className="proj-info-i"><div className="proj-info-l">{ui ? ui.client : 'Клиент'}</div><div className="proj-info-v">{p.client}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">{ui ? ui.sector : 'Сектор'}</div><div className="proj-info-v">{p.sector}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">{ui ? ui.duration : 'Срок'}</div><div className="proj-info-v">{p.duration}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">{ui ? ui.year : 'Год'}</div><div className="proj-info-v">{p.year}</div></div>
            </div>
          </div>
        </div>

        <div className="detail-cta" style={{ marginTop: 48 }}>
          <div>
            <h3>{ui ? ui.ctaProjectH3 : 'Похожий проект для вас?'}</h3>
            <p>{ui ? ui.ctaProjectP : 'Покажем кейсы по вашему сектору, разложим бюджет и сроки, дадим пилот за 2 недели.'}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => window.openPharmContact?.()}>{t('contacts')} <span className="arrow">→</span></button>
            <button className="btn btn-ghost" onClick={() => navigate('portfolio')}>{ui ? ui.backAll : '← Все кейсы'}</button>
          </div>
        </div>

        {p.related && p.related.length > 0 &&
        <div className="proj-section full">
            <div className="proj-section-label">— {ui ? ui.next : 'Дальше'}</div>
            <h2>{ui ? ui.related : 'Смотрите также'}</h2>
            <div className="related">
              {p.related.map((relSlug) => {
              const r = window.PORTFOLIO.find((x) => x.slug === relSlug);
              if (!r) return null;
              const RA = window[r.art] || window.ArtConstellation;
              const relThumb = r.thumb;
              return (
                <div key={relSlug} className="rel-card" onClick={() => navigate(`portfolio/${relSlug}`)}>
                    <div
                      className={`rel-art${relThumb ? ' rel-art--photo' : ''}`}
                      style={relThumb ? undefined : { background: `linear-gradient(140deg, var(--bg-2), ${r.palette}33)` }}>
                      {relThumb
                        ? <img src={relThumb} alt="" loading="lazy" decoding="async" />
                        : <RA />}
                    </div>
                    <div>
                      <h4>{r.name}</h4>
                      <p>{r.category} · {r.year}</p>
                    </div>
                  </div>);

            })}
            </div>
          </div>
        }
      </section>
    </main>);

}

Object.assign(window, { PortfolioPage, ProjectPage });
