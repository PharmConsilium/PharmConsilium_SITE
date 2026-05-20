// PortfolioPage — gallery of cases.
// ProjectPage — single case study.

function PortfolioPage({ navigate }) {
  const [filter, setFilter] = React.useState('all');
  const cats = ['all', ...Array.from(new Set(window.PORTFOLIO.map((p) => p.category)))];
  const visible = window.PORTFOLIO.filter((p) => filter === 'all' || p.category === filter);

  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>Проекты и портфолио</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 18 }}>Проекты последних 24 месяцев</div>
          <h1>Проекты<br />и портфолио.</h1>
          <p className="lede">
            Восемь характерных проектов из портфолио ФармКонсилиума:
            от лонча кардиопрепарата за 90 дней до собственного справочника ЛС с тысячей DAU.
            Полное портфолио — по запросу.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('team')}>
              Получить консультацию <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 0 80px' }}>
        {/* Filter chips */}
        <div className="pf-filter">
          {cats.map((c) =>
          <button key={c}
          className={`pf-chip ${filter === c ? 'on' : ''}`}
          onClick={() => setFilter(c)}>
              {c === 'all' ? 'Все' : c}
              {c !== 'all' && <span className="pf-chip-count">
                {window.PORTFOLIO.filter((p) => p.category === c).length}
              </span>}
            </button>
          )}
        </div>

        <div className="cards-grid">
          {visible.map((p, i) => {
            const Art = window[p.art] || window.ArtConstellation;
            return (
              <div key={p.slug} className="card"
                   onClick={() => navigate(`portfolio/${p.slug}`)}>
                <div className="card-art" style={{background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)`}}>
                  <Art />
                </div>
                <div className="card-num">— {String(i + 1).padStart(2, '0')}</div>
                <h3>{p.name}</h3>
                <p>{p.short}</p>
                <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--muted)' }}>{p.category}</span>
                  <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--muted)' }}>{p.sector}</span>
                  <span className="chip" style={{ background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--muted)' }}>{p.year}</span>
                </div>
                <a className="read">Открыть кейс <span className="arrow">→</span></a>
              </div>);

          })}
        </div>

        {/* Soft CTA */}
        <div className="detail-cta" style={{ marginTop: 64 }}>
          <div>
            <h3>Не нашли свой кейс?</h3>
            <p>У нас 80+ запусков и сотни проектов под NDA. Напишите, что нужно — пришлём подходящие материалы.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('team')}>Получить консультацию</button>
            <button className="btn btn-ghost">Скачать полное портфолио · PDF</button>
          </div>
        </div>
      </section>
    </main>);

}

function ProjectPage({ slug, navigate }) {
  const p = window.PORTFOLIO.find((x) => x.slug === slug);

  if (!p) {
    return (
      <main className="page-route">
        <section className="page-hero">
          <div className="container">
            <div className="crumbs">
              <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
              <span className="sep">/</span>
              <span onClick={() => navigate('portfolio')} style={{ cursor: 'pointer' }}>Портфолио</span>
              <span className="sep">/</span>
              <span style={{ color: 'var(--ink)' }}>Проект не найден</span>
            </div>
            <h1>Проект не найден.</h1>
            <button className="btn btn-primary" onClick={() => navigate('portfolio')}>← В портфолио</button>
          </div>
        </section>
      </main>);

  }

  const Art = window[p.art] || window.ArtConstellation;

  // Slider images — main art + alternate visuals
  const slides = [
  { art: Art, label: 'Превью проекта' },
  { art: window.ArtNodes || Art, label: 'Архитектура' },
  { art: window.ArtDashboard || Art, label: 'Метрики' },
  { art: window.ArtLayers || Art, label: 'Материалы' }];

  const [slide, setSlide] = React.useState(0);
  const next = () => setSlide((slide + 1) % slides.length);
  const prev = () => setSlide((slide - 1 + slides.length) % slides.length);
  const CurArt = slides[slide].art;

  return (
    <main className="page-route" style={{ '--accent-local': p.palette }}>
      {/* Hero — структура как у страницы «Контент и игры» */}
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span onClick={() => navigate('portfolio')} style={{ cursor: 'pointer' }}>Проекты и портфолио</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{p.category}</span>
          </div>
          <h1>{p.name}</h1>
          <p className="lede">{p.hero}</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('team')}>
              Получить консультацию <span>→</span>
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('portfolio')}>
              ← Все проекты
            </button>
          </div>
        </div>
      </section>

      <section className="container">
        {/* Metrics strip */}
        <div className="proj-metrics" style={{ '--proj-accent': p.palette }}>
          {p.metrics.map((m, i) =>
          <div key={i} className="proj-metric">
              <div className="proj-metric-v">{m.value}</div>
              <div className="proj-metric-l">{m.label}</div>
            </div>
          )}
        </div>

        {/* Slider слева + описание проекта справа */}
        <div className="proj-split">
          <div className="proj-slider">
            <div className="proj-slider-stage" style={{ background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)` }}>
              {slides.map((s, i) => {
                const A = s.art;
                return (
                  <div key={i} className={`proj-slide ${i === slide ? 'on' : ''}`}>
                    <A />
                  </div>);

              })}
              <div className="proj-slider-meta">
                <span>{String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                <span>· {slides[slide].label}</span>
              </div>
              <button className="proj-slider-nav prev" onClick={prev} aria-label="Назад">←</button>
              <button className="proj-slider-nav next" onClick={next} aria-label="Вперёд">→</button>
            </div>
            <div className="proj-slider-dots">
              {slides.map((_, i) =>
              <button key={i}
              className={`dot ${i === slide ? 'on' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Слайд ${i + 1}`} />
              )}
            </div>
          </div>

          <div className="proj-desc">
            <div className="proj-desc-block">
              <div className="proj-section-label">— Задача</div>
              <p className="proj-paragraph">{p.problem}</p>
            </div>

            <div className="proj-desc-block">
              <div className="proj-section-label">— Решение</div>
              <ul className="proj-bullets">
                {p.approach.map((a, i) =>
                <li key={i}><b>{a.t}.</b> <span>{a.d}</span></li>
                )}
              </ul>
            </div>

            <div className="proj-desc-block">
              <div className="proj-section-label">— Что получил клиент</div>
              <ul className="proj-bullets compact">
                {p.deliverables.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            <div className="proj-info" style={{ marginTop: 8 }}>
              <div className="proj-info-i"><div className="proj-info-l">Клиент</div><div className="proj-info-v">{p.client}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">Сектор</div><div className="proj-info-v">{p.sector}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">Срок</div><div className="proj-info-v">{p.duration}</div></div>
              <div className="proj-info-i"><div className="proj-info-l">Год</div><div className="proj-info-v">{p.year}</div></div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="detail-cta" style={{ marginTop: 48 }}>
          <div>
            <h3>Похожий проект для вас?</h3>
            <p>Покажем кейсы по вашему сектору, разложим бюджет и сроки, дадим пилот за 2 недели.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('team')}>Получить консультацию</button>
            <button className="btn btn-ghost" onClick={() => navigate('portfolio')}>← Все кейсы</button>
          </div>
        </div>

        {/* Related */}
        {p.related && p.related.length > 0 &&
        <div className="proj-section full">
            <div className="proj-section-label">— Дальше</div>
            <h2>Смотрите также</h2>
            <div className="related">
              {p.related.map((slug) => {
              const r = window.PORTFOLIO.find((x) => x.slug === slug);
              if (!r) return null;
              const RA = window[r.art] || window.ArtConstellation;
              return (
                <div key={slug} className="rel-card" onClick={() => navigate(`portfolio/${slug}`)}>
                    <div className="rel-art" style={{ background: `linear-gradient(140deg, var(--bg-2), ${r.palette}33)` }}>
                      <RA />
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