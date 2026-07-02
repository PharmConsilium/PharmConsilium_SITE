// PortfolioPage — gallery of cases.
// ProjectPage — single case study.

function isProjSlideImage(s, isSlideVideo) {
  return Boolean(s && s.src && !isSlideVideo(s));
}

function projSlideImageSrc(s) {
  return s.srcFull || s.src;
}

function projAspectIsPortrait(ratio) {
  if (!ratio) return false;
  const m = String(ratio).match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (!m) return false;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return h > w;
}

function portfolioMetaChips(p) {
  if (p.draft) return p.cardChips || ['Скоро'];
  if (Array.isArray(p.cardChips) && p.cardChips.length) return p.cardChips;
  return [p.category, p.sector, p.year].filter(Boolean);
}

function portfolioFilterChips(portfolio) {
  const seen = new Set();
  const chips = [];
  portfolio.forEach((p) => {
    portfolioMetaChips(p).forEach((chip) => {
      if (chip && !seen.has(chip)) {
        seen.add(chip);
        chips.push(chip);
      }
    });
  });
  return chips;
}

function portfolioHasChip(p, chip) {
  return portfolioMetaChips(p).includes(chip);
}

function PortfolioRelCard({ item, navigate, lang, showReadLink, variant }) {
  const ui = lang === 'en' && window.getPortfolioUi ? window.getPortfolioUi(lang) : null;
  const Art = window[item.art] || window.ArtConstellation;
  const isCase = variant === 'case';
  const relThumb = isCase && item.thumbDetail ? item.thumbDetail : item.thumb;
  const relChips = portfolioMetaChips(item);
  const readLabel = ui ? (ui.viewCase || ui.openCase) : 'Смотреть кейс';
  const thumbLayout = isCase && item.thumbDetail
    ? (item.thumbDetailLayout || item.thumbLayout)
    : item.thumbLayout;
  const thumbFit = isCase && item.thumbDetail
    ? (item.thumbDetailFit != null ? item.thumbDetailFit : item.thumbFit)
    : item.thumbFit;
  const thumbWide = relThumb && thumbLayout === 'wide';
  const thumbSquare = relThumb && thumbLayout === 'square';
  const thumbFitContain = relThumb && thumbFit === 'contain';
  const thumbFitCover = relThumb && thumbFit === 'cover';
  const thumbAlt = isCase && item.thumbDetailAlt ? item.thumbDetailAlt : (item.thumbAlt || item.name);
  const useDetailThumb = isCase && item.thumbDetail;
  const detailIcon = useDetailThumb && item.thumbDetailIcon;
  const detailPhoto = useDetailThumb && !detailIcon;
  const thumbTone = item.thumbPalette || item.palette;
  const thumbMix = item.thumbArtMix ?? (relThumb ? 22 : 28);
  const artStyle = detailIcon
    ? undefined
    : detailPhoto && relThumb
      ? {
        '--thumb-detail-aspect': item.thumbDetailAspect || '4 / 3',
        backgroundColor: item.thumbDetailBg || 'var(--bg-2)',
        backgroundImage: `url(${relThumb})`,
        backgroundPosition: item.thumbDetailPosition || 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }
      : !relThumb && item.palette
        ? { background: `linear-gradient(140deg, var(--bg-2), ${item.palette}33)` }
        : relThumb && thumbTone
          ? { background: `linear-gradient(145deg, var(--bg-2), color-mix(in srgb, ${thumbTone} ${thumbMix}%, var(--accent-soft)))` }
          : undefined;

  if (isCase) {
    return (
      <div
        className="rel-card rel-card--portfolio-case"
        onClick={() => navigate(`portfolio/${item.slug}`)}
      >
        <div
          className={`rel-art rel-art--portfolio-case${useDetailThumb ? ' rel-art--photo-detail' : ''}${detailIcon ? ' rel-art--photo-detail-icon' : ''}${detailPhoto ? ' rel-art--photo-detail-photo' : ''}${!useDetailThumb && relThumb ? ' rel-art--photo' : ''}${!useDetailThumb && thumbWide ? ' rel-art--photo-wide' : ''}${!useDetailThumb && thumbSquare ? ' rel-art--photo-square' : ''}${!useDetailThumb && thumbFitContain ? ' rel-art--photo-fit-contain' : ''}${!useDetailThumb && thumbFitCover ? ' rel-art--photo-fit-cover' : ''}`}
          style={artStyle}
        >
          {detailIcon && relThumb
            ? <img className="rel-art-detail-img" src={relThumb} alt={thumbAlt} loading="lazy" decoding="async" />
            : !useDetailThumb && relThumb
              ? <img src={relThumb} alt={thumbAlt} loading="lazy" decoding="async" />
              : !useDetailThumb && !relThumb ? <Art /> : null}
        </div>
        <div className="rel-card-body">
          <h4>{item.name}</h4>
          {item.short ? <p className="rel-card-desc">{item.short}</p> : null}
          {showReadLink ?
            <span className="read">{readLabel} <span className="arrow">→</span></span> :
            null}
        </div>
      </div>
    );
  }

  return (
    <div className="rel-card" onClick={() => navigate(`portfolio/${item.slug}`)}>
      <div
        className={`rel-art${relThumb ? ' rel-art--photo' : ''}`}
        style={relThumb ? undefined : { background: `linear-gradient(140deg, var(--bg-2), ${item.palette}33)` }}>
        {relThumb
          ? <img src={relThumb} alt={item.thumbAlt || item.name} loading="lazy" decoding="async" />
          : <Art />}
      </div>
      <div className="rel-card-body">
        <h4>{item.name}</h4>
        {relChips.length > 0 &&
          <div className="rel-card-chips">
            {relChips.map((chip) => (
              <span key={chip} className="chip rel-card-chip">{chip}</span>
            ))}
          </div>
        }
        {showReadLink ?
          <span className="read">{readLabel} <span className="arrow">→</span></span> :
          null}
      </div>
    </div>
  );
}

function PortfolioPage({ navigate, lang }) {
  const [filter, setFilter] = React.useState('all');
  const portfolio = window.PORTFOLIO || [];
  const chips = ['all', ...portfolioFilterChips(portfolio)];
  const visible = portfolio.filter((p) => filter === 'all' || portfolioHasChip(p, filter));
  const MidContactStrip = window.MidContactStrip;
  const ui = lang === 'en' && window.getPortfolioUi ? window.getPortfolioUi(lang) : null;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const PageHeroH1 = window.PageHeroH1;

  React.useEffect(() => {
    setFilter('all');
  }, [lang]);

  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{ui ? ui.crumb : 'Портфолио, проекты и фичи ФармКонсилиум'}</span>
          </div>
          <div className="eyebrow" style={{ marginTop: 18 }}>{ui ? ui.eyebrow : 'Хайп ФармКонсилиум'}</div>
          <PageHeroH1
            line1={ui ? ui.h1Line1 : 'Портфолио, проекты'}
            accent={ui ? ui.h1Accent : 'и фичи ФармКонсилиум'}
          />
          <p className="lede">
            {ui ? ui.lede : 'В этом разделе мы поделились теми реализованными проектами, которыми мы гордимся, и за которые нас похвалили наши клиенты.'}
          </p>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} hide /> : null}

      <section className="container" style={{ padding: '40px 0 80px' }}>
        <div className="pf-filter">
          {chips.map((c) =>
          <button key={c}
          className={`pf-chip ${filter === c ? 'on' : ''}`}
          onClick={() => setFilter(c)}>
              {c === 'all' ? (ui ? ui.filterAll : 'Все') : c}
              {c !== 'all' && <span className="pf-chip-count">
                {portfolio.filter((p) => portfolioHasChip(p, c)).length}
              </span>}
            </button>
          )}
        </div>

        <div className="cards-grid cards-grid--portfolio">
          {visible.map((p, i) => {
            const isDraft = Boolean(p.draft);
            const Art = window[p.art] || window.ArtConstellation;
            const thumb = p.thumb;
            const thumbWide = p.thumbLayout === 'wide';
            const thumbPack = thumb && p.tag === 'упаковка';
            const thumbTone = p.thumbPalette || p.palette;
            const thumbMix = p.thumbArtMix ?? (thumb ? 22 : 28);
            const cardArtStyle = thumbTone
              ? { background: `linear-gradient(145deg, var(--bg-2), color-mix(in srgb, ${thumbTone} ${thumbMix}%, var(--accent-soft)))` }
              : thumb
                ? { background: 'linear-gradient(145deg, var(--bg-2), var(--accent-soft))' }
                : { background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)` };
              const chips = portfolioMetaChips(p);
            const openLabel = isDraft
              ? (ui ? ui.draftSoon : 'Скоро')
              : (ui ? ui.openCase : 'Открыть кейс');
            return (
              <div key={p.slug} className={`card${isDraft ? ' card--draft' : ''}`}
                   onClick={() => navigate(`portfolio/${p.slug}`)}>
                <div
                  className={`card-art${thumb ? ' card-art--photo' : ''}${thumbWide ? ' card-art--photo-wide' : ''}${thumbPack ? ' card-art--photo-pack' : ''}${p.thumbFit === 'contain' ? ' card-art--photo-fit-contain' : ''}`}
                  style={cardArtStyle}>
                  {thumb
                    ? <img src={thumb} alt={p.thumbAlt || p.name} loading="lazy" decoding="async" />
                    : <Art />}
                </div>
                <h3>{p.name}</h3>
                <p>{p.short}</p>
                <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="chip"
                      style={{ background: 'transparent', border: 'none', color: 'var(--muted)' }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <span className="read">{openLabel}{isDraft ? '' : <span className="arrow"> →</span>}</span>
              </div>);

          })}
        </div>

        <div className="detail-cta" style={{ marginTop: 64 }}>
          <div>
            <h3>{ui ? ui.ctaH3 : 'Не нашли свой кейс?'}</h3>
            <p>{ui ? ui.ctaP : 'У нас 80+ запусков и сотни проектов под NDA. Напишите, что нужно — пришлём подходящие материалы.'}</p>
          </div>
          <div className="detail-cta-actions">
            <button className="btn btn-primary" onClick={() => window.openPharmContact?.()}>{t('contacts')} <span className="arrow">→</span></button>
          </div>
        </div>
      </section>
    </main>);

}

function ProjectPage({ slug, navigate, lang }) {
  const MidContactStrip = window.MidContactStrip;
  const portfolio = window.PORTFOLIO || [];
  const p = slug ? portfolio.find((x) => x.slug === slug) : null;
  const ui = lang === 'en' && window.getPortfolioUi ? window.getPortfolioUi(lang) : null;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const HeroH1 = window.PageHeroH1;

  const [slide, setSlide] = React.useState(0);
  const [videoAspect, setVideoAspect] = React.useState(null);
  const [lightbox, setLightbox] = React.useState(null);
  const sliderRef = React.useRef(null);
  const isSlideVideo = window.isPortfolioSlideVideo || (() => false);

  const slides = React.useMemo(() => {
    if (!p) return [];
    const Art = window[p.art] || window.ArtConstellation;
    const defaultArtSlides = [
      { art: Art, label: ui ? ui.slidePreview : 'Превью проекта' },
      { art: window.ArtNodes || Art, label: ui ? ui.slideArch : 'Архитектура' },
      { art: window.ArtDashboard || Art, label: ui ? ui.slideMetrics : 'Метрики' },
      { art: window.ArtLayers || Art, label: ui ? ui.slideMaterials : 'Материалы' },
    ];
    return Array.isArray(p.slides) && p.slides.length ? p.slides : defaultArtSlides;
  }, [p, ui]);

  const imageSlideIndexes = React.useMemo(
    () => slides.map((s, i) => (isProjSlideImage(s, isSlideVideo) ? i : -1)).filter((i) => i >= 0),
    [slides, isSlideVideo]
  );

  const pauseVideos = React.useCallback(() => {
    sliderRef.current?.querySelectorAll('video').forEach((v) => { v.pause(); });
  }, []);

  const closeLightbox = React.useCallback(() => setLightbox(null), []);

  const lightboxPrev = React.useCallback(() => {
    if (lightbox == null || imageSlideIndexes.length <= 1) return;
    const pos = imageSlideIndexes.indexOf(lightbox);
    const nextIdx = imageSlideIndexes[(pos - 1 + imageSlideIndexes.length) % imageSlideIndexes.length];
    pauseVideos();
    setSlide(nextIdx);
    setLightbox(nextIdx);
  }, [lightbox, imageSlideIndexes, pauseVideos]);

  const lightboxNext = React.useCallback(() => {
    if (lightbox == null || imageSlideIndexes.length <= 1) return;
    const pos = imageSlideIndexes.indexOf(lightbox);
    const nextIdx = imageSlideIndexes[(pos + 1) % imageSlideIndexes.length];
    pauseVideos();
    setSlide(nextIdx);
    setLightbox(nextIdx);
  }, [lightbox, imageSlideIndexes, pauseVideos]);

  React.useEffect(() => {
    setSlide(0);
    setVideoAspect(null);
    setLightbox(null);
  }, [slug]);

  React.useEffect(() => {
    pauseVideos();
  }, [slide, pauseVideos]);

  React.useEffect(() => {
    setVideoAspect(null);
  }, [slide, slug]);

  React.useEffect(() => {
    if (lightbox == null) return undefined;
    const item = slides[lightbox];
    if (item && isProjSlideImage(item, isSlideVideo)) {
      const preload = new Image();
      preload.src = projSlideImageSrc(item);
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
  }, [lightbox, closeLightbox, lightboxPrev, lightboxNext, slides, isSlideVideo]);

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

  const splitPageTitle = window.splitPageTitle;
  const titleParts = splitPageTitle
    ? splitPageTitle(p.name)
    : { line1: p.name, accent: null, accent2: null };
  const VideoPlayer = window.PortfolioVideoPlayer;
  const slideUsesMedia = slides.some((s) => s.src || s.art || isSlideVideo(s));

  const activeSlide = slides[slide] || slides[0];
  const stageIsVideo = isSlideVideo(activeSlide);
  const stageAspect = (stageIsVideo && videoAspect)
    || activeSlide?.aspect
    || p.slideAspect
    || (stageIsVideo ? '16 / 9' : null)
    || '950 / 1024';
  const stageVideoPortrait = stageIsVideo && projAspectIsPortrait(stageAspect);

  const goSlide = (index) => {
    pauseVideos();
    setSlide(index);
  };
  const next = () => goSlide((slide + 1) % slides.length);
  const prev = () => goSlide((slide - 1 + slides.length) % slides.length);
  const slideAria = (n) => (ui ? ui.slideN.replace('{n}', n) : `Слайд ${n}`);
  const zoomAria = (alt) => (alt ? `Увеличить: ${alt}` : 'Увеличить слайд');
  const zoomed = lightbox != null ? slides[lightbox] : null;
  const canLightboxNav = imageSlideIndexes.length > 1;

  const lightboxLayer = zoomed && isProjSlideImage(zoomed, isSlideVideo) ? (
    <div
      className="detail-art-lightbox-backdrop"
      role="presentation"
      onClick={closeLightbox}
    >
      <div className="detail-art-lightbox-shell" onClick={(e) => e.stopPropagation()}>
        <div className="detail-art-lightbox-toolbar">
          {canLightboxNav ? (
            <>
              <button
                type="button"
                className="detail-art-lightbox-nav"
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                aria-label={ui ? ui.slidePrev : 'Предыдущий слайд'}
              >
                ←
              </button>
              <button
                type="button"
                className="detail-art-lightbox-nav"
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                aria-label={ui ? ui.slideNext : 'Следующий слайд'}
              >
                →
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="detail-art-lightbox-close"
            onClick={closeLightbox}
            aria-label={ui ? ui.lightboxClose : 'Закрыть'}
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
            src={projSlideImageSrc(zoomed)}
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
    <main className="page-route" style={{ '--accent-local': p.palette }}>
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span onClick={() => navigate('portfolio')} style={{ cursor: 'pointer' }}>{ui ? ui.crumb : 'Портфолио, проекты и фичи ФармКонсилиум'}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{p.name}</span>
          </div>
          {p.draft ? <div className="eyebrow" style={{ marginTop: 18 }}>{ui ? ui.draftSoon : 'Скоро'}</div> : null}
          {HeroH1
            ? <HeroH1 line1={titleParts.line1} accent={titleParts.accent} accent2={titleParts.accent2} />
            : <h1><span className="h1-primary">{titleParts.line1}</span></h1>}
          <p className="lede">{p.hero}</p>
          <div className="proj-hero-actions">
            <button className="btn btn-ghost" onClick={() => navigate('portfolio')}>
              {ui ? ui.backAll : '← Все проекты'}
            </button>
            {Array.isArray(p.storeLinks) && p.storeLinks.length > 0 ? (
              <div className="proj-store-links">
                <div className="proj-store-links-label">{ui ? ui.appStoreLinks : 'Ссылки на мобильное приложение'}</div>
                <div className="proj-store-links-row">
                  {p.storeLinks.map((link) => (
                    <a
                      key={link.label}
                      className="proj-store-link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            {p.serviceRoute ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(p.serviceRoute)}
              >
                {ui ? ui.learnService : 'Узнать больше об этой услуге'} <span className="arrow">→</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} hide={Boolean(p.serviceRoute)} /> : null}

      <section className="container">
        {Array.isArray(p.metrics) && p.metrics.length > 0 ? (
          <div className="proj-metrics" style={{ '--proj-accent': p.palette }}>
            {p.metrics.map((m, i) =>
            <div key={i} className="proj-metric">
                <div className="proj-metric-v">{m.value}</div>
                <div className="proj-metric-l">{m.label}</div>
              </div>
            )}
          </div>
        ) : null}

        <div className="proj-split">
          <div className="proj-slider">
            <div
              ref={sliderRef}
              className={`proj-slider-stage${slideUsesMedia ? ' proj-slider-stage--image' : ''}${stageVideoPortrait ? ' proj-slider-stage--video proj-slider-stage--video-portrait' : ''}`}
              style={slideUsesMedia
                ? { aspectRatio: stageAspect, background: 'var(--bg-2)' }
                : { background: `linear-gradient(140deg, var(--bg-2), ${p.palette}26)` }}>
              {slides.map((s, i) => {
                const A = typeof s.art === 'function' ? s.art : (s.art ? window[s.art] : null);
                const videoSrc = s.video || (isSlideVideo(s) ? s.src : null);
                const isActive = i === slide;
                return (
                  <div key={i} className={`proj-slide${videoSrc ? ' proj-slide--video' : ''} ${isActive ? 'on' : ''}`}>
                    {videoSrc && VideoPlayer
                      ? <VideoPlayer
                          src={videoSrc}
                          poster={s.poster || p.thumb}
                          posterFromVideo={s.posterFromVideo}
                          alt={s.alt || s.label}
                          active={isActive}
                          onAspect={isActive ? setVideoAspect : undefined}
                        />
                      : s.src && !isSlideVideo(s)
                        ? (
                          <button
                            type="button"
                            className="detail-art-slide-zoom proj-slide-zoom"
                            onClick={() => isActive && setLightbox(i)}
                            aria-label={zoomAria(s.alt || s.label)}
                            tabIndex={isActive ? 0 : -1}
                          >
                            <img
                              className="proj-slide-img"
                              src={s.src}
                              alt={s.alt || s.label}
                              loading={i === 0 ? 'eager' : 'lazy'}
                              decoding="async"
                            />
                            {slides.length > 1 ? (
                              <div className="proj-slider-meta">
                                <span>{String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                                <span>· {s.label}</span>
                              </div>
                            ) : null}
                          </button>
                        )
                        : A ? <A /> : null}
                  </div>);

              })}
              {slides.length > 1 ? (
                <>
                  <button className="proj-slider-nav prev" onClick={prev} aria-label={ui ? ui.slidePrev : 'Назад'}>←</button>
                  <button className="proj-slider-nav next" onClick={next} aria-label={ui ? ui.slideNext : 'Вперёд'}>→</button>
                </>
              ) : null}
            </div>
            {slides.length > 1 ?
              <div className="proj-slider-dots">
                {slides.map((_, i) =>
                <button key={i}
                className={`dot ${i === slide ? 'on' : ''}`}
                onClick={() => goSlide(i)}
                aria-label={slideAria(i + 1)} />
                )}
              </div> :
              null}
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

            {Array.isArray(p.extraBlocks) && p.extraBlocks.map((block, i) => (
              <div key={i} className="proj-desc-block">
                {block.title ? <h3 className="proj-extra-title">{block.title}</h3> : null}
                {(block.paragraphs || []).map((para, j) => (
                  <p key={j} className="proj-paragraph">{para}</p>
                ))}
              </div>
            ))}

            {(() => {
              const infoItems = [
                { l: p.infoClientLabel || (ui ? ui.client : 'Клиент'), v: p.infoClient || p.client },
                { l: p.infoSectorLabel || (ui ? ui.sector : 'Сектор'), v: p.infoSector || p.sector },
                !p.hideInfoDuration ? { l: p.infoDurationLabel || (ui ? ui.duration : 'Срок'), v: p.infoDuration || p.duration } : null,
                !p.hideInfoYear ? { l: p.infoYearLabel || (ui ? ui.year : 'Год'), v: p.infoYear || p.year } : null,
              ].filter(Boolean);
              const cols = Math.min(4, infoItems.length || 1);
              const metaChips = portfolioMetaChips(p);
              return (
                <div className="proj-meta-panel">
                  <div className="proj-info" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {infoItems.map((it) => (
                      <div key={`${it.l}-${it.v}`} className="proj-info-i">
                        <div className="proj-info-l">{it.l}</div>
                        <div className="proj-info-v">{it.v}</div>
                      </div>
                    ))}
                  </div>
                  {metaChips.length > 0 && (
                    <div className="proj-meta-chips">
                      {metaChips.map((chip) => (
                        <span key={chip} className="chip proj-meta-chip">{chip}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="detail-cta" style={{ marginTop: 48 }}>
          <div>
            <h3>{ui ? ui.ctaProjectH3 : 'Похожий проект для вас?'}</h3>
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
              return (
                <PortfolioRelCard key={relSlug} item={r} navigate={navigate} lang={lang} />
              );

            })}
            </div>
          </div>
        }
      </section>
      {lightboxLayer && ReactDOM.createPortal(lightboxLayer, document.body)}
    </main>);

}

window.PortfolioPage = PortfolioPage;
window.ProjectPage = ProjectPage;
window.PortfolioRelCard = PortfolioRelCard;
