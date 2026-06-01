// Pages: Home, Marketing, HCP, Sales, Content, Directory, Team
// Each page is a self-contained section. Home is most detailed.

const MARQUEE_TICKERS = [
  'AI-Powered Chatbot',
  'Approved Email',
  'Automated Medication Reminders',
  'Brand Scientific Platform',
  'Bot',
  'Call Planning',
  'Chatbot',
  'CLM Presentation',
  'Closed-Loop Marketing',
  'Closed-Loop Marketing Presentation',
  'Compliant Messaging Platform',
  'Conversational Agent',
  'Conversational AI',
  'Conversational Discovery',
  'Detailing',
  'Detailing Aid',
  'Digital Detailing',
  'Digital Marketing',
  'Digital Therapeutics',
  'Direct-to-Patient Marketing',
  'eDetail',
  'eDetailing',
  'eVisual Aid',
  'F2F',
  'Field Force',
  'Field Force CRM',
  'Field Force Training',
  'Follow-up Mailing',
  'Generative AI Chatbot',
  'Generative AI in Pharma Marketing',
  'HCP Mobile App',
  'HCP Porta',
  'HCP Segmentation & Targeting',
  'HCP-Dedicated Website',
  'HCP-Facing App',
  'Health Equity & Localization Strategy',
  'Healthcare Marketing',
  'Healthcare Professional',
  'Hyper-Personalization',
  'Interactive Visual Aid',
  'Key Account Manager',
  'Leave-Behind Literature',
  'Marketing Mix Modeling',
  'Medical Legal Regulatory Review',
  'Medical Marketing',
  'Medical Representative',
  'Medical Science Liaison',
  'MedRep',
  'mHealth App',
  'mHealth Patient App',
  'MLR-Compliant Conversational AI',
  'Next Best Action',
  'Omnichannel HCP Engagement',
  'Opt-In Messaging',
  'Optichannel Strategy',
  'Patient Journey Mapping',
  'Patient Support App',
  'Patient Support Program',
  'Pharma CRM',
  'Pharma Professional Portal',
  'Post-Call Digital Content Push',
  'Post-Call Follow-Up Materials Delivery',
  'Post-Visit Promotional Content Distribution',
  'Predictive Analytics for HCP Engagement',
  'Real-World Evidence',
  'Remote Detailing',
  'Rep CRM',
  'Rep-Triggered Email',
  'Rich Messaging',
  'Rule-Based Chatbot',
  'Sales Force Training',
  'Scientific Narrative',
  'Telegram Bot for Pharma',
  'Territory Management',
  'Virtual Assistant',
  'Visual Aid',
  'WhatsApp for Pharma',
];

function HomePage({ navigate, scenario, setScenario, lang }) {
  const [heroQuery, setHeroQuery] = React.useState('');
  const [chartReady, setChartReady] = React.useState(() => Boolean(window.ForecastChart));
  const insightsGridRef = React.useRef(null);
  const MidContactStrip = window.MidContactStrip;
  const en = lang === 'en' && window.getHomeCopy ? window.getHomeCopy('en') : null;
  const ForecastChart = chartReady ? window.ForecastChart : null;

  const heroQueryReady = heroQuery.trim().length > 0;

  React.useEffect(() => {
    if (window.ForecastChart) {
      setChartReady(true);
      return undefined;
    }
    function onDeferred(ev) {
      if (ev.detail && ev.detail.name === 'forecast-chart') setChartReady(true);
    }
    window.addEventListener('pharm:deferred-ready', onDeferred);
    return () => window.removeEventListener('pharm:deferred-ready', onDeferred);
  }, []);

  const insightCards = en ? en.insightCards : [
  { n: '01', t: 'Портфолио, проекты и фичи ФармКонсилиум', d: 'Портфолио реализованных проектов, которыми мы гордимся.', to: 'portfolio' },
  { n: '02', t: 'Цифровой медицинский представитель', d: 'Цифровые омниканальные кампании продвижения, которые берут на себя функции аутсорсинговой команды медицинских представителей.', to: 'sales/digital-rep' },
  { n: '03', t: 'Справочник ЛС ФармКонсилиум', d: 'Цифровой медицинский ресурс для врачей, провизоров и фармацевтов, созданный для профессиональной работы с информацией о лекарственных препаратах.', href: 'https://farmconsilium.com/' },
  { n: '04', t: 'Разработка мобильных приложений', d: 'mHealth-приложения для фармбрендов «под ключ» — от идеи и UX-концепции до дизайна, разработки и публикации в App Store и Google Play.', to: 'marketing/mobile' }];

  React.useEffect(() => {
    const grid = insightsGridRef.current;
    if (!grid) return undefined;
    const getCards = () => Array.from(grid.querySelectorAll('.card'));
    const equalize = () => {
      const cards = getCards();
      if (!cards.length) return;
      cards.forEach((el) => { el.style.minHeight = ''; });
      const maxH = Math.max(...cards.map((el) => el.getBoundingClientRect().height));
      if (!maxH) return;
      const h = `${Math.ceil(maxH)}px`;
      cards.forEach((el) => { el.style.minHeight = h; });
    };
    equalize();
    const ro = new ResizeObserver(equalize);
    ro.observe(grid);
    getCards().forEach((el) => ro.observe(el));
    window.addEventListener('resize', equalize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', equalize);
      getCards().forEach((el) => { el.style.minHeight = ''; });
    };
  }, [lang, en]);

  React.useEffect(() => {
    const section = document.querySelector('.hero');
    if (!section) return undefined;
    const accent = section.querySelector('h1 .accent');
    const cta = section.querySelector('.hero-cta');
    if (!accent || !cta) return undefined;

    const col = accent.closest('.hero-grid > div') || section;
    const apply = () => {
      if (window.innerWidth <= 1024) {
        cta.style.width = '';
        return;
      }
      const accentW = Math.ceil(accent.getBoundingClientRect().width);
      const cap = col ? col.clientWidth : accentW;
      cta.style.width = `${Math.min(accentW, cap)}px`;
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(accent);
    if (col) ro.observe(col);
    window.addEventListener('resize', apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      cta.style.width = '';
    };
  }, [lang, en]);

  function runHeroForecast() {
    if (!heroQuery.trim()) return;
    window.openPharmForecast?.(heroQuery.trim());
  }
  const heroTilesBase = [
  { id: 'marketing', num: '01', title: 'Фармацевтический маркетинг',
    desc: 'Цифровые инструменты для работы медицинских представителей.', art: 'ArtTileMarketing' },
  { id: 'hcp', num: '02', title: 'Цифровые решения для здравоохранения',
    desc: 'Мобильные приложения, образовательные платформы, сайты, боты, ИИ-ассистенты.', art: 'ArtTileHcp' },
  { id: 'sales', num: '03', title: 'Аутсорсинг',
    desc: 'Комплексные цифровые программы продвижения. Цифровой медицинский представитель.', art: 'ArtTileSales' },
  { id: 'content', num: '04', title: 'Дизайн',
    desc: 'CLM-презентации, дейтейлеры, видео, игры, квизы. То что нравится врачам и провизорам.', art: 'ArtTileContent', wide: true },
  { id: 'directory', num: '05', title: 'Справочник ЛС ФармКонсилиум',
    desc: 'Инструкции по применению, примеры выписки рецептов, калькуляторы.', art: 'ArtTileDirectory', wide: true }];
  const heroTiles = en ?
    en.tiles.map((t) => {
      const base = heroTilesBase.find((b) => b.id === t.id) || {};
      return { ...base, ...t, art: t.art || base.art };
    }) :
    heroTilesBase;

  const scenarios = en ?
    [['organic', en.scenarioOrganic], ['comms', en.scenarioComms], ['launch', en.scenarioLaunch]] :
    [['organic', 'Инерционный'], ['comms', 'Базовый'], ['launch', 'Максимальный']];

  const CrmFeatureArt = window.ArtCrmFeature;

  return (
    <main className="page-route">
      {/* HERO ─────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{en ? en.heroEyebrow : 'Команда внедрения цифровых технологий в сфере фармацевтики и здравоохранения. Работаем с 2015 года.'}</div>
            <PageHeroH1
              line1={en ? en.heroH1Line1 : 'IT-решения'}
              accent={en ? en.heroH1Accent : 'для лечения доверия'}
            />
            <p className="hero-lede">
              {en ? en.heroLede : 'Узнайте прогноз вашего бренда на фармацевтическом рынке СНГ. Наш искусственный интеллект «Робби» представит вам основные показатели рынка и возможности для роста. Просто введите название вашего бренда и страны, через несколько секунд узнаете прогноз.'}
            </p>
            <div className="hero-cta">
              <label className="hero-cta-field hero-cta-field--combined">
                <input
                  type="text"
                  name="heroQuery"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && heroQuery.trim()) {
                      e.preventDefault();
                      runHeroForecast();
                    }
                  }}
                  placeholder={en ? en.heroPlaceholder : 'Укажите название бренда и страну СНГ'}
                  autoComplete="off"
                />
              </label>
              <button
                type="button"
                className="btn btn-primary btn-sm hero-cta-submit"
                disabled={!heroQueryReady}
                onClick={runHeroForecast}>
                {en ? en.heroForecast : 'Прогноз'}
              </button>
            </div>
            <div className="hero-trust">
              <div><div className="stat-num">2015</div><div className="stat-lbl">{en ? en.statFounded : 'год основания'}</div></div>
              <div><div className="stat-num">22 000</div><div className="stat-lbl">{en ? en.statHcp : 'в активной базе HCP'}</div></div>
              <div><div className="stat-num">7</div><div className="stat-lbl">{en ? en.statCountries : 'стран с нашими Клиентами'}</div></div>
            </div>
          </div>

          {/* Forecast card */}
          <div className="forecast-card">
            <div className="fc-head">
              <div>
                <div className="fc-title">{en ? en.forecastTitle : 'ИИ Робби рассчитает прогноз вашего бренда на фармацевтическом рынке СНГ'}</div>
              </div>
              <div className="fc-pill"><span className="dot"></span>LIVE</div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="fc-scenarios">
                {scenarios.map(([k, l]) =>
                <button key={k}
                className={scenario === k ? 'on' : ''}
                onClick={() => setScenario(k)}>{l}</button>
                )}
              </div>
              {ForecastChart
                ? <ForecastChart scenario={scenario} key={scenario} />
                : <div className="fc-chart-skeleton" aria-hidden="true" />}
            </div>

            <div className="fc-legend">
              <span className="li"><span className="sw"></span>{en ? en.legendFact : 'факт'}</span>
              <span className="li"><span className="sw dashed"></span>{en ? en.legendForecast : 'прогноз ИИ'}</span>
              <span className="li"><span className="sw band"></span>{en ? en.legendBand : 'границы нормы'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-track">
          {[...Array(2)].flatMap((_, k) =>
          MARQUEE_TICKERS.
          map((t, i) =>
          <React.Fragment key={`${k}-${i}`}>
                <span>{t}</span><span className="dot"></span>
              </React.Fragment>
          )
          )}
        </div>
      </div>

      {/* HOME TILES ─────────────────────────── */}
      <section className="section section--tiles">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{en ? en.tilesEyebrow : 'IT-решения'}</div>
              <h2>{en ? <>5 digital<br />directions</> : <>5 цифровых<br />направлений</>}</h2>
            </div>
            <div className="right">
              {en ? en.tilesRight : 'От стратегической архитектуры омниканальной коммуникации с HCP до пациентского сериала на YouTube.'}
            </div>
          </div>

          <div className="tiles-grid">
            {heroTiles.map((t) => {
              const Art = window[t.art];
              return (
                <div key={t.id} className={`tile ${t.big ? 'big' : ''} ${t.wide ? 'wide' : ''}`}
                onClick={() => navigate(t.id)}>
                  <div className="tile-art">{Art && <Art />}</div>
                  <div className="tile-cap">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <span className="tile-cta">{en ? en.tileOpen : 'Открыть раздел'} <span className="arrow">→</span></span>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </section>

      {MidContactStrip ?
      <div className="home-tiles-cta" role="region" aria-label={en ? en.discussAria : 'Обсудить проект'}>
        <div className="container">
          <MidContactStrip inline lang={lang} hide />
        </div>
      </div> :
      null}

      {/* Feature row: AI-trener — */}
      <section className="section section--feature-after-cta">
        <div className="container">
          <div className="feature-row">
            <div>
              <span className="chip">{en ? en.featureChip : 'Хит продаж 2026'}</span>
              <h3>{en ? en.featureH3 : 'CRM-PharmConsilium для работы медицинских представителей'}</h3>
              <p>
                {en ? en.featureP : 'Специализированная CRM для фармацевтических компаний и омниканальной работы с HCP.'}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('marketing/crm')}>
                  CRM <span className="arrow">→</span>
                </button>
              </div>
            </div>
            <div className="feature-row-art feature-row-art--crm">
              {CrmFeatureArt ? <CrmFeatureArt /> : null}
            </div>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="section section--know-now" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="section-head section-head--title-sync section-head--insights">
            <div className="eyebrow">{en ? en.insightsEyebrow : 'Инсайты ФармКонсилиум'}</div>
            <h2>{en ? <>Better to know<br />this now</> : <>Вам лучше это<br />узнать сейчас</>}</h2>
            <div className="right">
              {en ? en.insightsRight : '3 в 1: маркетинговая экспертиза, разработка цифровых решений, студия контент-дейлинга.'}
            </div>
          </div>

          <div className="cards-grid cards-grid--2x2" ref={insightsGridRef}>
            {insightCards.map((s) => {
              const clickable = Boolean(s.to || s.href);
              return (
            <div
              key={s.to || s.href || s.t}
              className="card"
              role={clickable ? 'link' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => {
                if (s.href) window.open(s.href, '_blank', 'noopener,noreferrer');
                else if (s.to) navigate(s.to);
              } : undefined}
              onKeyDown={clickable ? (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                if (s.href) window.open(s.href, '_blank', 'noopener,noreferrer');
                else if (s.to) navigate(s.to);
              } : undefined}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>);

}

/* ────────────────────────────── INNER PAGES ────────────────────────────── */

function splitPageTitle(title) {
  if (!title || typeof title !== 'string') return { line1: title, accent: null, accent2: null };
  const seps = [' — ', ' - ', ' · ', ' для '];
  for (let i = 0; i < seps.length; i += 1) {
    const sep = seps[i];
    const idx = title.indexOf(sep);
    if (idx > 0) {
      const accent = sep === ' для ' ? title.slice(idx + 1) : title.slice(idx + sep.length);
      return { line1: title.slice(0, idx), accent, accent2: null };
    }
  }
  const colon = title.indexOf(': ');
  if (colon > 0 && colon < 48) {
    return { line1: title.slice(0, colon), accent: title.slice(colon + 2), accent2: null };
  }
  return { line1: title, accent: null, accent2: null };
}

function PageHeroH1({ line1, accent, accent2 }) {
  if (!accent && !accent2) return <h1><span className="h1-primary">{line1}</span></h1>;
  const shouldNowrap = (s) => typeof s === 'string' && s.length <= 28;
  return (
    <h1>
      <span className="h1-primary">{line1}</span>
      {accent ? <><br /><span className={`accent${shouldNowrap(accent) ? ' accent--nowrap' : ''}`}>{accent}</span></> : null}
      {accent2 ? <><br /><span className={`accent${shouldNowrap(accent2) ? ' accent--nowrap' : ''}`}>{accent2}</span></> : null}
    </h1>
  );
}

function PageShell({ crumb, title, h1Line1, h1Accent, h1Accent2, lede, cards, navigate, section, lang }) {
  const MidContactStrip = window.MidContactStrip;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{crumb}</span>
          </div>
          <PageHeroH1
            line1={h1Line1 || title}
            accent={h1Accent}
            accent2={h1Accent2}
          />
          {lede && <p className="lede">{lede}</p>}
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section className="container">
        <div className="cards-grid cards-grid--section">
          {cards.map((c, i) => {
            const Art = window[c.art];
            const cardArt = c.cardArt;
            const target = c.sub ? `${section}/${c.sub}` : null;
            return (
              <div key={i} className={`card ${c.size || ''}`}
              onClick={() => target && navigate(target)}
              style={{ cursor: target ? 'pointer' : 'default' }}>
                <div className={`card-art${cardArt ? ` card-art--photo${c.cardArtPhoto === 'contain' ? ' card-art--photo-contain' : ''}` : ''}`}>
                  {cardArt
                    ? <img src={cardArt} alt={c.cardArtAlt || c.title} loading="lazy" decoding="async" />
                    : Art ? <Art /> : null}
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                {c.tag && <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.tag.split(',').map((t, j) => <span key={j} className="chip" style={{
                    background: 'transparent', border: 'none', color: 'var(--muted)'
                  }}>{t.trim()}</span>)}
                </div>}
                {target && <a className="read">{t('readMore')} <span className="arrow">→</span></a>}
              </div>);

          })}
        </div>
      </section>
    </main>);

}

function SectionPage({ id, navigate, lang, ru }) {
  const en = lang === 'en' && window.getSectionCopy ? window.getSectionCopy(id, lang) : null;
  const cards = en && window.mergeSectionCardsLang
    ? window.mergeSectionCardsLang(ru.cards, id, lang)
    : ru.cards;
  const copy = en ? { ...en, cards } : ru;
  return <PageShell navigate={navigate} section={id} lang={lang} {...copy} />;
}

function MarketingPage({ navigate, lang }) {
  return <SectionPage id="marketing" navigate={navigate} lang={lang} ru={{
  crumb: 'Фармацевтический маркетинг',
  h1Line1: 'Цифровые инструменты',
  h1Accent: 'для фармацевтического маркетинга',
  lede: 'От CRM медицинского представителя до ИИ-тренера и платформы омниканального взаимодействия с HCP. Всю архитектуру и контент берём на себя.',
  cards: window.SECTION_CARDS.marketing
  }} />;
}

function HcpPage({ navigate, lang }) {
  return <SectionPage id="hcp" navigate={navigate} lang={lang} ru={{
  crumb: 'Здравоохранение',
  h1Line1: 'Разработка цифровых решений',
  h1Accent: 'для здравоохранения',
  lede: 'Платформы, рекомендательные системы, ИИ-ассистенты и программы поддержки пациентов — в регуляторных рамках, с заботой о практической пользе.',
  cards: window.SECTION_CARDS.hcp
  }} />;
}

function SalesPage({ navigate, lang }) {
  return <SectionPage id="sales" navigate={navigate} lang={lang} ru={{
  crumb: 'Аутсорсинг',
  h1Line1: 'Комплексное продвижение',
  h1Accent: 'и аутсорсинг продаж',
  lede: 'Усилим вашу команду продаж, добавим цифровые инструменты',
  cards: window.SECTION_CARDS.sales
  }} />;
}

function ContentPage({ navigate, lang }) {
  return <SectionPage id="content" navigate={navigate} lang={lang} ru={{
  crumb: 'Дизайн',
  h1Line1: 'HCP-контент на языке медицинской науки',
  h1Accent: 'для врачей, провизоров и фармацевтов',
  lede: 'Создаем презентации лекарств, медицинские видео, квизы, викторины, клинические детективы. Игры и геймификацию в медицине.',
  cards: window.SECTION_CARDS.content
  }} />;
}

const DIRECTORY_SITE_URL = 'https://farmconsilium.com/';

function openExternalLinkDeduped(href, e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }
  const now = Date.now();
  const key = `__pharm_last_ext_open_ms__:${href}`;
  const last = Number(window[key] || 0);
  if (now - last < 1200) return;
  window[key] = String(now);
  window.open(href, '_blank', 'noopener,noreferrer');
}

function DirectoryFeatureText({ item }) {
  const renderParts = (parts) =>
    parts.map((part, j) => (part.b ? <strong key={j}>{part.s}</strong> : part.s));
  if (item.dTable) {
    return (
      <>
        {item.dIntroParts
          ? <p>{renderParts(item.dIntroParts)}</p>
          : item.dIntro ? <p>{item.dIntro}</p> : null}
        <div className="directory-spec-table-wrap">
          <table className="directory-spec-table">
            <thead>
              <tr>
                {item.dTable.head.map((cell, i) => <th key={i} scope="col">{cell}</th>)}
              </tr>
            </thead>
            <tbody>
              {item.dTable.rows.map((row, ri) =>
                <tr key={ri}>
                  {row.map((cell, ci) =>
                    <td key={ci}>{ci === 0 ? <strong>{cell}</strong> : cell}</td>
                  )}
                </tr>
                  )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  if (item.dParagraphs) {
    return item.dParagraphs.map((para, pi) =>
      <p key={pi} style={pi > 0 ? { marginTop: 2 } : undefined}>{renderParts(para)}</p>
    );
  }
  if (item.dParts) return <p>{renderParts(item.dParts)}</p>;
  return <p>{item.d}</p>;
}

const DIRECTORY_FEATURES_RU = [
  {
    t: 'Справочник ЛС ФармКонсилиум',
    art: 'ArtDirectory',
    artImg: 'assets/uploads/directory-benefit-title.png',
    artImgAlt: 'Справочник ЛС ФармКонсилиум — ключевые преимущества',
    dParagraphs: [
      [
        { s: 'Цифровой профессиональный ресурс для врачей, провизоров и фармацевтов. Он создан как удобный инструмент для ежедневной практической работы с лекарственными средствами: от быстрого поиска официальной информации до применения клинических калькуляторов, медицинских шкал и цифровых сервисов поддержки принятия решений.' },
      ],
      [
        { s: 'Проект начал работу 1 сентября 2025 года с миссией сформировать единое пространство проверенной, структурированной и практически применимой медицинской информации. Мы объединили фундаментальные знания с IT-технологиями, чтобы процесс принятия клинических решений стал быстрее и безопаснее. Базовой единицей наших данных является официальная инструкция по медицинскому применению (ОХЛП) — документ, на который специалисты опираются при назначении, отпуске и консультировании. В Справочнике ЛС интегрированы актуальные примеры оформления рецептов, материалы по фармакологии и обширный пакет медицинских калькуляторов. Флагманское направление нашей работы — сервис «ИИ-фармаколог». Интеллектуальный ассистент быстро оценивает риски межлекарственных взаимодействий на основе международных баз данных, страхуя врача от ошибок полипрагмазии и экономя время на поиске информации.' },
      ],
    ],
  },
  {
    t: 'Приглашаем к сотрудничеству врачей',
    art: 'ArtDoc',
    artImg: 'assets/uploads/directory-collab-doctors.png',
    artImgAlt: 'Приглашаем к сотрудничеству врачей',
    dParagraphs: [
      [
        { s: 'Мы открыты к сотрудничеству с врачами, которые хотят делиться профессиональным опытом и создавать полезные цифровые инструменты для коллег.' },
      ],
      [
        { s: 'Если у вас есть идеи для публикаций, авторские материалы, клинические разборы, мастер-классы, образовательные модули или практические рекомендации, мы готовы обсудить их размещение на платформе. Нам интересны материалы, которые помогают врачу быстро ориентироваться в клинической ситуации, принимать обоснованные решения и использовать лекарственные средства рационально.' },
      ],
      [
        { s: 'Приглашаем к сотрудничеству авторов медицинских шкал, клинических алгоритмов, расчетных моделей и разработок, созданных в рамках научной, диссертационной или практической работы. Наши ИТ-специалисты превратят такие материалы в удобные цифровые калькуляторы или интерактивные инструменты с обязательным указанием вашего авторства.' },
      ],
      [
        { s: 'Если вы видите, какие разделы стоит добавить, какие калькуляторы внедрить, понимаете чего не хватает в вашей специальности — напишите нам. Мы хотим, чтобы Справочник ЛС ФармКонсилиум развивался вместе с медицинским сообществом и отражал реальные потребности практикующих врачей.' },
      ],
    ],
  },
  {
    t: 'Приглашаем к сотрудничеству провизоров и фармацевтов',
    art: 'ArtBooks',
    artImg: 'assets/uploads/directory-collab-pharmacists.png',
    artImgAlt: 'Приглашаем к сотрудничеству провизоров и фармацевтов',
    dParagraphs: [
      [
        { s: 'Провизоры и фармацевты ежедневно работают с большим объемом лекарственной информации: проверяют инструкции, консультируют посетителей аптек, уточняют режимы применения, особенности отпуска, противопоказания, взаимодействия и возможные риски терапии. Поэтому для нас принципиально важно, чтобы Справочник ЛС ФармКонсилиум был полезен не только врачам, но и специалистам аптечного звена.' },
      ],
      [
        { s: 'Уже сейчас большое число провизоров и фармацевтов используют Справочник в своей работе. Но сделать его по-настоящему удобным можно только вместе с профессиональным сообществом. Мы приглашаем вас делиться предложениями по улучшению карточек лекарственных средств, наполнению разделов, формату рецептов и другим аспектам, важным для вашей работы.' },
      ],
      [
        { s: 'Нам особенно интересны темы, которые важны для аптечной практики: консультирование пациентов, частые вопросы в аптеке, замена препаратов, особенности применения безрецептурных средств, лекарственные взаимодействия, отпуск по рецепту, безопасность и рациональное использование лекарств.' },
      ],
      [
        { s: 'Если у вас есть материалы, профессиональные комментарии, идеи для статей или предложения по улучшению Справочника ЛС — мы готовы к диалогу. Наша задача — создать ресурс, который помогает провизору и фармацевту быстро находить точную информацию и уверенно применять её в ежедневной работе.' },
      ],
    ],
  },
  {
    t: 'Приглашаем к сотрудничеству производителей лекарственных препаратов',
    art: 'ArtPulse',
    artImg: 'assets/uploads/directory-collab-manufacturers.png',
    artImgAlt: 'Приглашаем к сотрудничеству производителей лекарственных препаратов',
    dParagraphs: [
      [
        { s: 'Для производителей лекарственных средств Справочник ЛС ФармКонсилиум — это экспертная площадка, где ваш портфель интегрирован в интерфейс, адаптированный под ежедневную рутину врача, провизора и фармацевта. В нашей системе приоритет отдается не рекламным лозунгам, а клинической ценности, точности данных и их удобному представлению в момент принятия решения о назначении или отпуске препарата. Мы предлагаем партнерам структуризацию данных: от размещения ОХЛП и базовой фармакологической информации до разработки корректных шаблонов медицинских рецептов.' },
      ],
      [
        { s: 'Для компаний, работающих на нескольких рынках, реализован уникальный мультирыночный формат. Он позволяет представлять локальные версии инструкций для разных стран, учитывая все регуляторные различия и поддерживая актуальность портфеля для каждого региона присутствия. Весь контент проходит верификацию редакционной коллегией, состоящей из врачей и клинических фармакологов. В карточках препаратов может фиксироваться дата последнего обновления данных, что обеспечивает прозрачность и формирует высокий уровень доверия профессионального сообщества к вашему бренду. Мы приглашаем к сотрудничеству производителей, нацеленных на ответственное и качественное представление своих лекарственных средств в цифровой среде.' },
      ],
    ],
  },
];

function mergeDirectoryFeatures(ruFeatures, enFeatures) {
  if (!enFeatures) return ruFeatures;
  return ruFeatures.map((ru, i) => {
    const patch = enFeatures[i];
    if (!patch) return ru;
    return {
      ...ru,
      t: patch.t != null ? patch.t : ru.t,
      dParagraphs: patch.dParagraphs != null ? patch.dParagraphs : ru.dParagraphs,
      dParts: patch.dParts != null ? patch.dParts : ru.dParts,
      dIntroParts: patch.dIntroParts != null ? patch.dIntroParts : ru.dIntroParts,
      dTable: patch.dTable != null ? patch.dTable : ru.dTable,
      d: patch.d != null ? patch.d : ru.d,
      dIntro: patch.dIntro != null ? patch.dIntro : ru.dIntro,
    };
  });
}

function DirectoryPage({ navigate, lang }) {
  const en = lang === 'en' && window.getDirectoryCopy ? window.getDirectoryCopy(lang) : null;
  React.useEffect(() => {
    const key = window.DIRECTORY_SCROLL_KEY || 'pharmconsilium-directory-scroll';
    let scrollId;
    try {
      scrollId = sessionStorage.getItem(key);
      if (scrollId) sessionStorage.removeItem(key);
    } catch (e) { /* ignore */ }
    if (!scrollId || !window.scrollToDirectoryCard) return undefined;
    const t = window.setTimeout(() => window.scrollToDirectoryCard(scrollId), 80);
    return () => window.clearTimeout(t);
  }, [lang]);
  const MidContactStrip = window.MidContactStrip;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const features = mergeDirectoryFeatures(DIRECTORY_FEATURES_RU, en?.features);
  const mockDrugs = en ? en.mockDrugs : [
    {
      name: 'Пример ОХЛП (BY, KZ), инструкция по медицинскому применению (листок-вкладыш)',
      desc: 'Структурированная карточка ЛС с официальной инструкцией, дозировками и примером рецепта на конкретный препарат',
      href: 'https://farmconsilium.com/ls/medicines/835-depakin-hronosfera',
      tags: ['ОХЛП', 'ИнструкцииЛС', 'Листок-вкладыш'],
    },
    {
      name: 'Клинические калькуляторы, оценка функции почек',
      desc: 'Калькулятор Cockcroft–Gault, CKD‑EPI, Schwartz и CKiD U25 с автоматическим расчётом клиренса и стадий ХБП.',
      href: 'https://farmconsilium.com/calculator/kalkulyator-diagnostiki-funkcii-pochek-cockcroft-gault-ckd-epi-schwartz-ckid-u25',
      hashTags: ['Клинические калькуляторы', 'Медицинские шкалы', 'Медицинские калькуляторы'],
    },
    {
      name: 'Умный поиск по ТН, МНН, АТХ и производителю',
      desc: 'Единый поиск приводит к карточке ЛС с инструкцией, аналогами и оценками врачей.',
      href: 'https://farmconsilium.com/ls?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hashTags: ['Аналоги ЛС', 'АТХ аналоги', 'СправочникЛС'],
    },
    {
      name: 'Оценки ЛС практикующими врачами',
      desc: 'К официальным данным добавляются отзывы и рейтинги от врачей с реальным опытом применения. Только для зарегистрированных пользователей, подтвердивших свою квалификацию.',
      href: 'https://farmconsilium.com/ls/medicines/konkor-rp',
      hashTags: ['Отзывы врачей', 'Оценки практикующих врачей', 'Рейтинги ЛС'],
    },
    {
      name: 'Общая и клиническая фармакология',
      desc: 'Ключевые таблицы, инфографика и статьи по фармакодинамике, фармакокинетике и рациональной фармакотерапии.',
      href: 'https://farmconsilium.com/lib?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hashTags: ['Медицинские гайды', 'КлиническиеПротоколы', 'Протоколы и стандарты лечения'],
    },
    {
      name: 'Примеры выписки медицинских рецептов',
      desc: 'Готовые образцы льготных рецептов с корректным заполнением для конкретных препаратов.',
      href: 'https://farmconsilium.com/ls/medicines/1645-mirena',
      hashTags: ['Рецепт на лекарство', 'Медицинский рецепт', 'Пример оформления медицинского рецепта'],
    },
  ];
  const stats = en ? en.stats : [
    { n: '01', t: '1 000+ специалистов', d: 'Врачей, провизоров, фармацевтов используют ежедневно' },
    { n: '02', t: 'Без рекламного шума', d: 'Доверительная атмосфера ординаторской и экспертный контент' },
    { n: '03', t: 'ОХЛП разных стран СНГ', d: 'Только официальные инструкции по медицинскому применению' },
    { n: '04', t: 'API', d: 'Подключайте справочник в свои продукты и системы' },
  ];
  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{en ? en.crumb : 'Справочник ЛС'}</span>
          </div>
          <PageHeroH1
            line1={en ? en.h1 : 'Справочник ЛС'}
            accent={en ? en.h1Brand : 'ФармКонсилиум'}
          />
          <p className="lede">
            {en ? en.lede : 'Цифровой медицинский портал для врачей, провизоров и фармацевтов, созданный для профессиональной работы с информацией о лекарственных препаратах. Ресурс доступен в удобных форматах: десктопная версия для использования в ординаторских, кабинетах врачей и аптеках, а также мобильная версия для смартфонов через Telegram-бот и TeleApp.'}
          </p>
        </div>
      </section>

      <section className="container" style={{ margin: '48px auto' }}>
        <div>
          <div className="section-head">
            <div>
              <div className="eyebrow">{en ? en.benefitsEyebrow : 'Официальные инструкции по применению лекарственных средств'}</div>
              <h2>{en ? en.benefitsH2 : 'Нам доверяют профессионалы'}</h2>
            </div>
            <div className="right">
              {en ? en.benefitsRight : 'Экспертные руководства по лекарственным препаратам, база знаний по ЛС, собственные методологии, чек-листы, таблицы принятия решений, схемы.'}
            </div>
          </div>
          <div className="cards-grid cards-grid--directory-benefits">
            {features.map((a, i) => {
              const A = window[a.art];
              const benefitHref = a.href || DIRECTORY_SITE_URL;
              const openBenefitSite = (e) => openExternalLinkDeduped(benefitHref, e);
              return (
                <div
                  key={i}
                  id={`directory-benefit-${i}`}
                  className="card directory-benefit-card"
                  role="link"
                  tabIndex={0}
                  aria-label={`${a.t} — ${en ? 'open PharmConsilium Drug Directory' : 'открыть Справочник ЛС на farmconsilium.com'}`}
                  onClick={openBenefitSite}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    openBenefitSite(e);
                  }}
                >
                  {a.artImg ? (
                    <div className="card-art card-art--photo card-art--photo-contain directory-benefit-art">
                      <img src={a.artImg} alt={a.artImgAlt || a.t} decoding="async" loading="lazy" />
                    </div>
                  ) : (
                    <div className="card-art">{A && <A />}</div>
                  )}
                  <h3>{a.t}</h3>
                  <DirectoryFeatureText item={a} />
                </div>
              );
            })}
            {MidContactStrip ?
              <div className="directory-benefit-cta">
                <div className="directory-benefit-cta-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => window.openPharmContact?.()}
                  >
                    {en ? 'Suggest material' : 'Предложить материал'} <span className="arrow">↑</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => window.openPharmContact?.()}
                  >
                    {en ? 'Suggest directory improvement' : 'Предложить улучшение справочника'} <span className="arrow">↑</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => window.openPharmContact?.()}
                  >
                    {en ? 'Discuss drug listing' : 'Обсудить размещение препарата'} <span className="arrow">↑</span>
                  </button>
                </div>
              </div> :
              null}
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 'clamp(22px, 2.4vw, 28px)',
          letterSpacing: '-.02em',
          margin: '56px 0 18px'
        }}>
          {en ? 'Reference sections of PharmConsilium Drug Directory' : 'Информационные разделы Справочника ЛС ФармКонсилиум'}
        </h2>
        <div style={{
          marginTop: 56,
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          boxShadow: 'var(--shadow-md)'
        }}>
          <div className="directory-drug-samples">
            {mockDrugs.map((p, i) =>
            <div key={i} className="directory-drug-sample">
                {p.atc ?
                  <div className="directory-drug-sample-kicker">{p.atc} · ATC</div> :
                  null}
                <div className="directory-drug-sample-title">{p.name}</div>
                {p.mnn && !p.href ?
                  <div className="directory-drug-sample-mnn">{p.mnn}</div> :
                  null}
                {p.desc || p.cls ?
                  (p.href ?
                    <a
                      className="directory-drug-sample-desc directory-drug-sample-desc-link"
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        // Mobile browsers / WebViews may fire pointer/touch + click for one tap.
                        // Deduplicate to avoid opening several tabs/windows per one user action.
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
                        const now = Date.now();
                        const key = `__pharm_last_ext_open_ms__:${p.href}`;
                        const last = Number(window[key] || 0);
                        if (now - last < 1200) return;
                        window[key] = String(now);
                        window.open(p.href, '_blank', 'noopener,noreferrer');
                      }}
                      onPointerUp={(e) => {
                        // Some environments open external links on pointer/touch end.
                        // Keep the same dedupe key as onClick.
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
                        const now = Date.now();
                        const key = `__pharm_last_ext_open_ms__:${p.href}`;
                        const last = Number(window[key] || 0);
                        if (now - last < 1200) return;
                        window[key] = String(now);
                        window.open(p.href, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      {(() => {
                        const raw = p.desc || p.cls;
                        if (typeof raw !== 'string') return raw;
                        const parts = raw.split(' — ');
                        if (parts.length < 2) return raw;
                        const head = parts.shift();
                        const rest = parts.join(' — ');
                        return (
                          <>
                            <strong>{head}</strong>
                            <br />
                            {rest}
                          </>
                        );
                      })()}
                    </a> :
                    <div className="directory-drug-sample-desc">
                      {(() => {
                        const raw = p.desc || p.cls;
                        if (typeof raw !== 'string') return raw;
                        const parts = raw.split(' — ');
                        if (parts.length < 2) return raw;
                        const head = parts.shift();
                        const rest = parts.join(' — ');
                        return (
                          <>
                            <strong>{head}</strong>
                            <br />
                            {rest}
                          </>
                        );
                      })()}
                      {(p.href && p.hrefInline === true && (p.desc || p.cls)) ? (
                        <>
                          {' '}
                          <a
                            className="directory-drug-sample-link directory-drug-sample-link--inline"
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {en ? 'link' : 'ссылка'}
                          </a>
                        </>
                      ) : null}
                    </div>
                  ) :
                  null}
                <div className="directory-drug-sample-meta">
                  {p.hashTags ?
                    p.hashTags.map((tag, j) =>
                      <React.Fragment key={typeof tag === 'string' ? tag : tag.label}>
                        {j > 0 ? <span aria-hidden="true">·</span> : null}
                        <span>{typeof tag === 'string' ? tag : tag.label}</span>
                      </React.Fragment>
                    ) :
                    p.tags ?
                      p.tags.map((tag, j) =>
                        <React.Fragment key={tag}>
                          {j > 0 ? <span aria-hidden="true">·</span> : null}
                          <span>{tag}</span>
                        </React.Fragment>
                      ) :
                      <>
                        <span>{en ? en.pubCount : '14 публикаций'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{en ? en.protocolCount : '3 клин. протокола'}</span>
                      </>
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cards-grid cards-grid--directory-stats" style={{ marginTop: 32 }}>
          {stats.map((s) =>
          <div key={s.n} className="card directory-stat-card">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          )}
        </div>
      </section>
    </main>);

}

const TEAM = [
{ n: 'Робби', r: 'Корпоративный искусственный интеллект', photo: 'assets/uploads/team-robbie-hover.png' },
{ n: 'Катарина', r: 'Экономист, контент-мейкер', photo: 'assets/uploads/team-katarina.png' },
{ n: 'Даниил', r: 'Инженер-программист', photo: 'assets/uploads/team-daniil.png' },
{ n: 'Вадим', r: 'Инженер-программист', photo: 'assets/uploads/team-vadim.png' },
{ n: 'Валерия', r: 'Менеджер медицинского маркетинга', photo: 'assets/uploads/team-valeria.png' },
{ n: 'Николай', r: 'Маркетолог цифровых экосистем', photo: 'assets/uploads/team-nikolay.png' },
{ n: 'Сергей', r: 'Инженер-программист', photo: 'assets/uploads/team-sergey.png' },
{ n: 'Илья', r: 'Дизайн ИИ-видео, анимация', photo: 'assets/uploads/team-ilya.png' },
{ n: 'Артём', r: 'Дизайн кросс-платформенных систем', photo: 'assets/uploads/team-artem.png' },
{ n: 'Владислав', r: 'Начальник отдела IT-разработки', photo: 'assets/uploads/team-vladislav.png' },
{ n: 'Оксана', r: 'Финансы', photo: 'assets/uploads/team-oksana.png' },
{ n: 'Владимир', r: 'Оптимист', photo: 'assets/uploads/team-vladimir.png' }];


function PortraitPlaceholder({ seed }) {
  // Generative geometric portrait — 2 overlapping shapes
  const h = seed * 137 % 360;
  const colors = [`oklch(0.72 0.14 ${h})`, `oklch(0.62 0.16 ${(h + 60) % 360})`];
  return (
    <svg viewBox="0 0 120 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="120" height="150" fill={`oklch(0.95 0.02 ${h})`} />
      <circle cx="60" cy="60" r="34" fill={colors[0]} />
      <ellipse cx="60" cy="160" rx="55" ry="60" fill={colors[1]} />
      <circle cx="60" cy="60" r="34" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
    </svg>);

}

function teamRobbyPhotoSrc(path) {
  if (!path || !path.includes('team-robbie')) return path;
  return `${path}?v=3`;
}

function TeamMemberPortrait({ member, seed, eager }) {
  if (member.photo) {
    const raw = member.photo;
    const src = teamRobbyPhotoSrc(raw);
    return (
      <img src={src} alt={member.n} decoding="async" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} />);
  }
  return <PortraitPlaceholder seed={seed} />;
}

function teamLedePart(text, key, opts) {
  if (!text || !text.includes('**')) return <p key={key}>{text}</p>;
  const accentBold = opts?.accentBold;
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <p key={key}>
      {parts.map((part, i) => (i % 2 === 1 ?
      <strong key={i} className={accentBold ? 'team-lede-accent' : undefined}>{part}</strong> :
      part))}
    </p>
  );
}

function TeamPage({ navigate, lang }) {
  const en = lang === 'en' && window.getTeamCopy ? window.getTeamCopy(lang) : null;
  const team = en
    ? en.members.map((m, i) => ({ ...TEAM[i], ...m }))
    : TEAM;
  const MidContactStrip = window.MidContactStrip;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const TeamContactsArt = window.ArtTeamContacts;

  React.useEffect(() => {
    const img = new Image();
    img.src = teamRobbyPhotoSrc('assets/uploads/team-robbie-hover.png');
  }, []);

  React.useEffect(() => {
    const key = window.TEAM_SCROLL_KEY || 'pharmconsilium-team-scroll';
    let scrollId;
    try {
      scrollId = sessionStorage.getItem(key);
      if (scrollId) sessionStorage.removeItem(key);
    } catch (e) { /* ignore */ }
    if (!scrollId || !window.scrollToDirectoryCard) return undefined;
    const t = window.setTimeout(() => window.scrollToDirectoryCard(scrollId), 80);
    return () => window.clearTimeout(t);
  }, [lang]);

  return (
    <main className="page-route">
      <section id="team-mission" className="page-hero" style={{ scrollMarginTop: 96 }}>
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{en ? en.crumb : 'О нас'}</span>
          </div>
          <PageHeroH1
            line1={en ? (en.h1Line1 || 'PharmConsilium mission') : 'Миссия ФармКонсилиум'}
            accent={en ? (en.h1Accent || 'in this universe') : 'в этой Вселенной'}
          />
          <div className="team-lede-stack">
            {en ?
              en.lede.map((para, i) => teamLedePart(para, i, { accentBold: i === 0 })) :
              <>
                <p>Каждое утро перед началом работы мы говорим: <strong className="team-lede-accent">СДЕЛАЕМ МИР ЛУЧШЕ!</strong></p>
                <p><strong>Мы объединяем</strong> фармацевтические компании, медицинских специалистов и людей, заботящихся о своём здоровье, в информационных пространствах.</p>
                <p><strong>Мы работаем</strong>, чтобы содействовать скорейшей доступности самых инновационных и эффективных фармацевтических продуктов для врачей и их пациентов в Беларуси.</p>
                <p><strong>Мы мечтаем</strong>, что у нас получится улучшить взаимодействие в области медицинских технологий и быть полезными людям с проблемами со здоровьем.</p>
                <p><strong>Мы гордимся</strong> тем, что наши партнёры — мировые лидеры в фармацевтике, которые создают продукты и услуги для улучшения жизни людей.</p>
                <p>… и мы знаем — <strong>всё зависит от людей!</strong></p>
                <p>Наш подход основан на цифровых технологиях и глубоком понимании потребностей рынка здравоохранения. Мы помогаем наладить эффективную коммуникацию с ключевыми аудиториями через персонализированные кампании, интегрированные цифровые платформы и инновационные решения с применением искусственного интеллекта.</p>
              </>
            }
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section id="team-members" className="container team-members-section" style={{ scrollMarginTop: 96 }}>
        <h2 className="team-members-heading">{en ? en.teamHeading : 'Команда'}</h2>
        <div className="team-grid">
          {team.map((m, i) => {
            const isDraft = Boolean(m.draft);
            const isRobby = m.n === 'Робби' || m.n === 'Robbie';
            const hasPhoto = Boolean(m.photo);
            return (
          <div key={i} className={`tm${isDraft ? ' tm--draft' : ''}`}>
              <div className={`tm-portrait${isRobby ? ' tm-portrait--robbie' : ''}${hasPhoto ? ' tm-portrait--photo' : ' tm-portrait--dual'}${isDraft ? ' tm-portrait--empty' : ''}`}>
                {isDraft ? null : hasPhoto ? (
                  <div className="tm-portrait-img">
                    <TeamMemberPortrait member={m} seed={i + 1} eager={isRobby} />
                  </div>
                ) : (
                  <>
                    <div className="tm-portrait-img tm-portrait-default">
                      <TeamMemberPortrait member={m} seed={i + 1} eager={isRobby} />
                    </div>
                    <div className="tm-portrait-img tm-portrait-hover">
                      <TeamMemberPortrait member={m} seed={i + 1 + 97} />
                    </div>
                  </>
                )}
              </div>
              <div className="tm-name">{m.n}</div>
              <div className="tm-role">{m.r}</div>
            </div>
            );
          })}
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">{en ? en.portfolioEyebrow : 'Портфолио'}</div>
              <h2>
                <button
                  type="button"
                  className="section-h2-link"
                  onClick={() => navigate('portfolio')}
                  aria-label={en ? 'Go to portfolio' : 'Перейти в портфолио'}
                >
                  {en ? en.portfolioH2 : <>Проекты ФармКонсилиум,<br />которые в этом месяце смотрели больше всего</>}
                </button>
              </h2>
            </div>
            <div className="right">{en ? en.portfolioRight : 'Кейсы, продуктовые решения, use cases, solutions'}</div>
          </div>
          <div className="cards-grid cards-grid--portfolio">
            {(en ? en.portfolioCards : [
            { t: 'Рекламный баннер Бепантен крем', d: 'Создание рекламного баннера для рекламы безрецептурного препарата, согласование рекламы.', art: 'ArtBanner', slug: 'cardio-lonch' },
            { t: 'Брендбук БАД, нейминг, упаковка', d: 'Формирование фирменной айдентики БАД, интеграция продуктовых преимуществ в дизайн упаковки.', art: 'ArtAI', slug: 'ai-trener' },
            { t: 'Упаковка для препарата ГидроБаланс', d: 'Разработка упаковки для препарата ГидроБаланс.', art: 'ArtVideo', slug: 'patient-series' },
            { t: 'Вертикальное видео (видеодетейлер) для HCP', d: 'Мы превратили сценарий лучшего визита МП в вертикальное видео 9:16, где сложная медицинская информация подаётся через анимацию или голос коллеги — а врач смотрит без усилия, как любимый сериал!', art: 'ArtRadar', slug: 'conference-pk25' },
            { t: 'Разработка и дизайн CLM-презентации для лекарственного препарата', d: 'От стратегии и сценарной архитектуры до интерактивного дизайна, технической вёрстки и комплаенс-согласования — полный цикл CLM-презентации.', art: 'ArtPulse', slug: 'psp-platform' },
            { t: 'Цифровая платформа для обучения медицинских специалистов', d: 'Создать закрытую веб-платформу с регистрацией для HCP, обеспечивающую доступ к видеолекциям, обучающим материалам и квизам для контроля знаний. Организовать полный цикл производства образовательного контента: создание, съемку и монтаж видеолекций, а также разработку интерактивных видео-квизов.', art: 'ArtLayers', slug: 'clm-veeva' },
            ]).map((p, i) => {
              const A = window[p.art];
              const pf = p.slug && window.PORTFOLIO
                ? window.PORTFOLIO.find((x) => x.slug === p.slug)
                : null;
              const thumb = pf?.thumb;
              const thumbAlt = pf?.thumbAlt || p.t;
              const thumbWide = pf?.thumbLayout === 'wide';
              const thumbPack = thumb && pf?.tag === 'упаковка';
              const thumbTone = pf?.thumbPalette || pf?.palette;
              const thumbMix = pf?.thumbArtMix ?? (thumb ? 22 : 28);
              const cardArtStyle = thumbTone
                ? { background: `linear-gradient(145deg, var(--bg-2), color-mix(in srgb, ${thumbTone} ${thumbMix}%, var(--accent-soft)))` }
                : thumb
                  ? { background: 'linear-gradient(145deg, var(--bg-2), var(--accent-soft))' }
                  : undefined;
              return (
                <div key={i} className="card"
                onClick={() => navigate(`portfolio/${p.slug}`)}>
                  <div className={`card-art${thumb ? ' card-art--photo' : ''}${thumbWide ? ' card-art--photo-wide' : ''}${thumbPack ? ' card-art--photo-pack' : ''}${pf?.thumbFit === 'contain' ? ' card-art--photo-fit-contain' : ''}`} style={cardArtStyle}>
                    {thumb
                      ? <img src={thumb} alt={thumbAlt} loading="lazy" decoding="async" />
                      : A ? <A /> : null}
                  </div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                  <span className="read">{en ? en.openCase : 'Открыть кейс'} <span className="arrow">→</span></span>
                </div>);

            })}
          </div>
        </div>

        <div className="team-contacts" data-contacts>
          <div className="team-contacts-copy" data-contacts-copy>
            <div className="eyebrow">{en ? en.contactsEyebrow : 'Контактные данные ФармКонсилиум'}</div>
            <h2>{en ? en.contactsH2 : 'Координаты: 53.678705, 23.830682'}</h2>
            <div className="team-contacts-list">
              <div className="team-contacts-item">
                <div className="team-contacts-icon" aria-hidden="true">☎</div>
                <div>
                  <div className="team-contacts-label">{en ? en.phone : 'Телефон'}</div>
                  <div className="team-contacts-value">
                    <a href="tel:+375293220018">+375 (29) 322-00-18</a>
                    <a href="tel:+375152685050">+375 (15) 268-50-50</a>
                  </div>
                </div>
              </div>
              <div className="team-contacts-item">
                <div className="team-contacts-icon" aria-hidden="true">@</div>
                <div>
                  <div className="team-contacts-label">{en ? en.email : 'Почта'}</div>
                  <div className="team-contacts-value">
                    <a href="mailto:pharmconsilium@gmail.com">pharmconsilium@gmail.com</a>
                    <a href="mailto:pharmconsilium.office@gmail.com">pharmconsilium.office@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="team-contacts-item">
                <div className="team-contacts-icon" aria-hidden="true">◎</div>
                <div>
                  <div className="team-contacts-label">{en ? en.address : 'Адрес'}</div>
                  <div className="team-contacts-value team-contacts-value--address">
                    {en ? en.addressLines : <>Беларусь, 230025, г. Гродно,<br />площадь Советская 2А, офис 26</>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="team-contacts-art">
            {TeamContactsArt ? <TeamContactsArt alt={en ? en.contactsArtAlt : undefined} /> : null}
          </div>
        </div>
      </section>
    </main>);

}

Object.assign(window, {
  HomePage, MarketingPage, HcpPage, SalesPage, ContentPage, DirectoryPage, TeamPage,
  PageHeroH1, splitPageTitle,
});