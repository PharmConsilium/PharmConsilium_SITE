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
  const MidContactStrip = window.MidContactStrip;
  const en = lang === 'en' && window.getHomeCopy ? window.getHomeCopy('en') : null;

  const heroQueryReady = heroQuery.trim().length > 0;

  React.useEffect(() => {
    const section = document.querySelector('.hero');
    if (!section) return undefined;
    const accent = section.querySelector('h1 .accent');
    const cta = section.querySelector('.hero-cta');
    if (!accent || !cta) return undefined;

    const col = accent.closest('.hero-grid > div') || section;
    const apply = () => {
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
    window.openPharmContact?.();
  }
  const heroTilesBase = [
  { id: 'marketing', num: '01', title: 'Фармацевтический маркетинг',
    desc: 'Цифровые инструменты для работы медицинских представителей.', art: 'ArtTileMarketing' },
  { id: 'hcp', num: '02', title: 'Цифровые решения для здравоохранения',
    desc: 'Мобильные приложения, образовательные платформы, сайты, боты, ИИ-ассистенты.', art: 'ArtTileHcp' },
  { id: 'sales', num: '03', title: 'Аутсорсинг',
    desc: 'Комплексные цифровые программы продвижения. Цифровой медицинский представитель.', art: 'ArtTileSales' },
  { id: 'content', num: '04', title: 'Дизайн',
    desc: 'Медицинскую науку переводим в CLM-презентации, дейтейлеры, видео, игры, квизы. Нравится врачам и провизорам.', art: 'ArtTileContent', wide: true },
  { id: 'directory', num: '05', title: 'Справочник ЛС ФармКонсилиум',
    desc: 'Инструкции по применению, примеры выписки рецептов, калькуляторы.', art: 'ArtTileDirectory', wide: true }];
  const heroTiles = en ?
    en.tiles.map((t) => {
      const base = heroTilesBase.find((b) => b.id === t.id) || {};
      return { ...base, ...t, art: t.art || base.art };
    }) :
    heroTilesBase;

  const insightCards = en ? en.insightCards : [
  { n: '01', t: 'Портфолио и проекты', d: 'Проекты, портфолио, события.', to: 'portfolio' },
  { n: '02', t: 'Цифровой медицинский представитель', d: 'Диджитальная экосистема с клиентской базой HCP, которая работает в KPI медицинского представителя.', to: 'sales' },
  { n: '03', t: 'Справочник ЛС ФармКонсилиум', d: 'Собственный профессиональный ресурс для врачей, провизоров, фармацевтов.', href: 'https://farmconsilium.com/' },
  { n: '04', t: 'Разработка мобильных приложений', d: 'Для операционных систем iOS и Android под ключ.', to: 'marketing/mobile' }];

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
              {en ? en.heroLede : 'Узнайте прогноз вашего бренда на фармацевтическом рынке СНГ, наш искусственный интеллект «Робби» представит вам основные показатели рынка и возможности для роста. Просто введите название вашего бренда и страны, через несколько секунд узнаете прогноз.'}
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
              <ForecastChart scenario={scenario} key={scenario} />
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
              <div className="eyebrow">{en ? en.tilesEyebrow : 'Что мы делаем'}</div>
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
          <MidContactStrip inline lang={lang} />
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
              {en ? en.insightsRight : '3 в 1: маркетинговая экспертиза, разработка цифровых решений, студия контент дейлинга.'}
            </div>
          </div>

          <div className="cards-grid cards-grid--2x2">
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
  return (
    <h1>
      <span className="h1-primary">{line1}</span>
      {accent ? <><br /><span className="accent">{accent}</span></> : null}
      {accent2 ? <><br /><span className="accent">{accent2}</span></> : null}
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
        <div className="cards-grid">
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
  const copy = en || ru;
  return <PageShell navigate={navigate} section={id} lang={lang} {...copy} />;
}

function MarketingPage({ navigate, lang }) {
  return <SectionPage id="marketing" navigate={navigate} lang={lang} ru={{
  crumb: 'Фармацевтический маркетинг',
  h1Line1: 'Цифровые инструменты',
  h1Accent: 'для фармацевтического маркетинга',
  lede: 'От CRM медицинского представителя до AI-тренера и платформы омниканального взаимодействия с HCP. Берём на себя всю архитектуру и контент.',
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
  lede: 'Если у вас нет своего отдела продаж в РБ — соберём его за вас. Если есть — добавим цифровой слой и омниканальный охват.',
  cards: window.SECTION_CARDS.sales
  }} />;
}

function ContentPage({ navigate, lang }) {
  return <SectionPage id="content" navigate={navigate} lang={lang} ru={{
  crumb: 'Дизайн',
  h1Line1: 'HCP-контент на языке медицинской науки',
  h1Accent: 'для врачей и фармацевтов',
  lede: 'Сценарии, презентации, видео, статьи, игры и квизы. Делаем сложное понятным — для врача, провизора и пациента.',
  cards: window.SECTION_CARDS.content
  }} />;
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
      <p key={pi} style={pi > 0 ? { marginTop: 12 } : undefined}>{renderParts(para)}</p>
    );
  }
  if (item.dParts) return <p>{renderParts(item.dParts)}</p>;
  return <p>{item.d}</p>;
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
  const features = en ? en.features : [
    {
      t: 'Архитектура ординаторской без рекламного шума. Нам доверяют',
      art: 'ArtDirectory',
      dParagraphs: [
        [
          { s: 'ФармКонсилиум', b: true },
          { s: ' — это профессиональная среда для клинициста, а не рекламная витрина. Интерфейс построен по принципу «информация без отвлечений»: врач, провизор или медсестра попадает в пространство, где нет баннеров, нет рекламных блоков конкурентов, нет всплывающих окон. Это цифровой аналог ординаторской — место, где работают, а не листают рекламу.' },
        ],
        [
          { s: 'Именно такое окружение формирует доверие к контенту, размещённому на платформе. Для производителей лекарств принципиально: информация о вашем препарате воспринимается врачом ' },
          { s: 'в нейтральном профессиональном контексте', b: true },
          { s: ', а не на фоне продвижения прямых конкурентов. Проект молодой — основан в 2025 году — однако уже получил признание: производители лекарственных средств самостоятельно цитируют материалы справочника, а практикующие врачи регулярно обращаются к базе инструкций. Это органически сформированное доверие — не купленное охватами, а завоёванное точностью данных.' },
        ],
      ],
    },
    {
      t: 'Как выглядит информация о ЛС, описание карточки препарата',
      art: 'ArtDoc',
      dIntroParts: [
        { s: 'Карточка препарата в Справочнике ЛС ' },
        { s: 'ФармКонсилиум', b: true },
        { s: ' — это структурированный профессиональный документ, а не SEO-оптимизированный текст для неспециалиста. Архитектура карточки включает:' },
      ],
      dTable: {
        head: ['Блок карточки', 'Содержание'],
        rows: [
          ['Официальная инструкция', 'Полный текст, утверждённый регулятором, с указанием версии документа и даты обновления'],
          ['Пример рецепта', 'Готовый шаблон оформления рецепта на данный препарат — уникальная функция для практикующего врача'],
          ['МНН / АТХ / бренд', 'Все поисковые идентификаторы препарата присутствуют и индексируются'],
          ['Аналоги внутри класса', 'Подбор аналогов по логике «МНН → АТХ-класс», курируется клиническим фармакологом'],
          ['Инструкции из разных стран СНГ', 'На один препарат могут быть представлены версии инструкций из нескольких юрисдикций'],
          ['Базовая фармакология', 'Механизм действия, фармакокинетика — в клинически ориентированном формате'],
          ['Дата обновления', 'Фиксируется на каждой карточке; правки вносятся при выходе новых версий инструкций'],
          ['Ссылки на источники', 'Прозрачная атрибуция — врач видит, откуда взяты данные'],
        ],
      },
    },
    {
      t: 'Веб-версия и мобильная версия',
      art: 'ArtBooks',
      dParagraphs: [
        [
          { s: 'Справочник ЛС ' },
          { s: 'ФармКонсилиум', b: true },
          { s: ' реализован в двух форматах доступа — веб-сайт для десктопа и смартфон «Бот+ Telegram-приложение» (TeleАпп).' },
        ],
        [
          { s: 'Для десктопа', b: true },
          { s: ' — на компьютере в аптеке обеспечивает полный доступ к справочнику, разделам фармакологии и рейтингам препаратов. Интерфейс адаптирован под профессиональный сценарий: быстрый поиск по МНН, бренду, АТХ и показаниям, фильтрация результатов, навигация по разделам.' },
        ],
        [
          { s: 'Для смартфона', b: true },
          { s: ' — для СНГ-аудитории HCP, где Telegram является основным профессиональным мессенджером. Справочник доступен без установки отдельного приложения, прямо внутри привычной среды врача. ИТ-команда проекта поддерживает оба интерфейса в параллельном режиме, регулярно обновляя код, базы данных и UX.' },
        ],
      ],
    },
    {
      t: 'Приглашаем продакт-менеджеров фармкомпаний к сотрудничеству',
      art: 'ArtPulse',
      dParagraphs: [
        [
          { s: '«Справочник лекарственных средств ' },
          { s: 'ФармКонсилиум', b: true },
          { s: '» — это молодой, но уже авторитетный профессиональный ресурс, основанный 1 сентября 2025 года. За короткое время проект сформировал репутацию точного источника: производители ЛС его цитируют, практикующие врачи используют ежедневно. Команда Справочника ЛС ' },
          { s: 'ФармКонсилиум', b: true },
          { s: ' объединяет врачей-редакторов, ИТ-специалистов, дизайнеров и клинического фармаколога — это означает, что вы работаете с партнёром, который понимает и медицинскую сторону, и цифровые технологии одновременно.' },
        ],
        [
          { s: 'Что предлагает проект продакт-менеджеру фармкомпании:', b: true },
        ],
        [
          { s: 'Точные данные о вашем ЛС в правильном формате — официальные инструкции, примеры рецептов, базовая фармакология: контент, который HCP реально использует в работе.' },
        ],
        [
          { s: 'Один ресурс для СНГ — один препарат, несколько версий инструкций из разных стран СНГ: инструмент для мультирыночного портфеля.' },
        ],
        [
          { s: 'Редакционная верификация — тексты проверяют практикующие врачи-редакторы и клинический фармаколог; дата обновления фиксируется на карточке.' },
        ],
      ],
    },
  ];
  const mockDrugs = en ? en.mockDrugs : [
    {
      name: 'Пример ОХЛП (BY, KZ)',
      desc: 'Инструкция по медицинскому применению (листок-вкладыш) — структурированная карточка ЛС с официальной инструкцией, дозировками и примером рецепта на конкретный препарат',
      href: 'https://farmconsilium.com/ls/medicines/835-depakin-hronosfera',
      hrefLabel: 'Ссылка: https://farmconsilium.com/ls/medicines/835-depakin-hronosfera',
      tags: ['ОХЛП', 'ФармКонсилиум'],
    },
    {
      name: 'Клинические калькуляторы, оценка функции почек',
      desc: 'Калькулятор Cockcroft–Gault, CKD‑EPI, Schwartz и CKiD U25 с автоматическим расчётом клиренса и стадий ХБП.',
      href: 'https://farmconsilium.com/calculator/kalkulyator-diagnostiki-funkcii-pochek-cockcroft-gault-ckd-epi-schwartz-ckid-u25',
      hrefLabel: 'Ссылка: https://farmconsilium.com/calculator/kalkulyator-diagnostiki-funkcii-pochek-cockcroft-gault-ckd-epi-schwartz-ckid-u25',
      hashTags: ['клинические калькуляторы', 'нефрология'],
    },
    {
      name: 'Умный поиск по ТН, МНН, АТХ и производителю',
      desc: 'Единый поиск приводит к карточке ЛС с инструкцией, аналогами и оценками врачей.',
      href: 'https://farmconsilium.com/ls?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hrefLabel: 'Ссылка: https://farmconsilium.com/ls?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hashTags: ['поиск лекарств', 'для врачей'],
    },
    {
      name: 'Оценки ЛС практикующими врачами',
      desc: 'К официальным данным добавляются отзывы и рейтинги от врачей с реальным опытом применения. Только для зарегистрированных пользователей, подтвердивших свою квалификацию.',
      href: 'https://farmconsilium.com/ls/medicines/konkor-rp',
      hrefLabel: 'Ссылка: https://farmconsilium.com/ls/medicines/konkor-rp',
      hashTags: ['оценка врачей', 'карточка препарата'],
    },
    {
      name: 'Общая и клиническая фармакология',
      desc: 'Ключевые таблицы, инфографика и статьи по фармакодинамике, фармакокинетике и рациональной фармакотерапии.',
      href: 'https://farmconsilium.com/lib?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hrefLabel: 'Ссылка: https://farmconsilium.com/lib?utm_content=link_in_bio&utm_medium=search&utm_timestamp=1779193963&utm_source=google',
      hashTags: ['клиническая фармакология', 'образование врачей'],
    },
    {
      name: 'Примеры выписки медицинских рецептов',
      desc: 'Готовые образцы рецептов по льготам с корректным заполнением для конкретных препаратов.',
      href: 'https://farmconsilium.com/ls/medicines/1645-mirena',
      hrefLabel: 'Ссылка: https://farmconsilium.com/ls/medicines/1645-mirena',
      hashTags: ['медицинские рецепты', 'льготное лекарство'],
    },
  ];
  const stats = en ? en.stats : [
    { n: '01', t: '1 000+ специалистов', d: 'врачей и провизоров используют справочник ежедневно' },
    { n: '02', t: 'Без рекламного шума', d: 'Атмосфера ординаторской: только экспертный контент' },
    { n: '03', t: 'Доказательная база', d: 'Каждая карточка — со ссылками на публикации и протоколы' },
    { n: '04', t: 'API для интеграций', d: 'Подключайте справочник в свои продукты и системы' },
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
            {en ? en.lede : 'Профессиональный цифровой ресурс для врачей и фармацевтов. Сегодня его используют более 1 000 специалистов ежедневно для поиска экспертного справочного контента. Доверительная атмосфера ординаторской — без рекламного шума.'}
          </p>
        </div>
      </section>

      <section className="container" style={{ margin: '48px auto' }}>
        <div>
          <div className="section-head">
            <div>
              <div className="eyebrow">{en ? en.benefitsEyebrow : 'Справочник препаратов'}</div>
              <h2>{en ? en.benefitsH2 : <>Почему врачи и провизоры<br />возвращаются.</>}</h2>
            </div>
            <div className="right">
              {en ? en.benefitsRight : 'Доверительная атмосфера ординаторской: только экспертный контент, никакого рекламного шума, прозрачные источники.'}
            </div>
          </div>
          <div className="cards-grid">
            {features.map((a, i) => {
              const A = window[a.art];
              return (
                <div key={i} id={`directory-benefit-${i}`} className="card directory-benefit-card" style={{ gridColumn: 'span 6' }}>
                  <div className="card-art">{A && <A />}</div>
                  <h3>{a.t}</h3>
                  <DirectoryFeatureText item={a} />
                </div>
              );
            })}
            {MidContactStrip ?
              <div className="directory-benefit-cta">
                <MidContactStrip inline lang={lang} />
              </div> :
              null}
          </div>
        </div>

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
                  <div className="directory-drug-sample-desc">{p.desc || p.cls}</div> :
                  null}
                {p.href ?
                  <a
                    className="directory-drug-sample-link"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.hrefLabel || p.href}
                  </a> :
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

        <div className="cards-grid" style={{ marginTop: 32 }}>
          {stats.map((s) =>
          <div key={s.n} className="card" style={{ gridColumn: 'span 6', minHeight: 'auto', paddingBottom: 18 }}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          )}
        </div>
      </section>
    </main>);

}

const TEAM = [
{ n: 'Робби', r: 'Цифровой ассистент', photo: 'assets/uploads/team-robbie.png', photoHover: 'assets/uploads/team-robbie-hover.png' },
{ n: 'Дмитрий Качан', r: 'Head of AI' },
{ n: 'Елена Грицук', r: 'Head of HCP-marketing' },
{ n: 'Сергей Лазько', r: 'Head of Sales' },
{ n: 'Мария Окулич', r: 'Head of Content' },
{ n: 'Артём Гордей', r: 'Lead Engineer' },
{ n: 'Наталья Ясько', r: 'Medical Director' },
{ n: 'Виктор Климов', r: 'Creative Director' }];


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
  return `${path}?v=2`;
}

function TeamMemberPortrait({ member, seed, layer }) {
  const isHover = layer === 'hover';

  if (member.photo) {
    const raw = isHover && member.photoHover ? member.photoHover : member.photo;
    const src = teamRobbyPhotoSrc(raw);
    return (
      <img src={src} alt={member.n} decoding="async" loading="lazy" />);
  }
  return <PortraitPlaceholder seed={seed} />;
}

function teamLedePart(text, key) {
  if (!text || !text.includes('**')) return <p key={key}>{text}</p>;
  const parts = text.split(/\*\*(.+?)\*\*/);
  return (
    <p key={key}>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </p>
  );
}

function TeamPage({ navigate, lang }) {
  const en = lang === 'en' && window.getTeamCopy ? window.getTeamCopy(lang) : null;
  const team = en ? en.members : TEAM;
  const MidContactStrip = window.MidContactStrip;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const TeamContactsArt = window.ArtTeamContacts;

  React.useEffect(() => {
    ['assets/uploads/team-robbie.png', 'assets/uploads/team-robbie-hover.png'].forEach((src) => {
      const img = new Image();
      img.src = `${src}?v=2`;
    });
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
            line1={en ? (en.h1Line1 || 'Our mission') : 'Наша миссия'}
            accent={en ? (en.h1Accent || 'in this universe:') : 'в этой Вселенной:'}
          />
          <div className="team-lede-stack">
            {en ?
              en.lede.map((para, i) => teamLedePart(para, i)) :
              <>
                <p>Каждое утро, перед началом работы мы говорим: <strong>СДЕЛАЕМ МИР ЛУЧШЕ!</strong></p>
                <p>Мы объединяем фармацевтические компании медицинских специалистов и людей, заботящихся о своём здоровье, в информационных пространствах.</p>
                <p>Мы работаем, чтобы содействовать скорейшей доступности самых инновационных и эффективных фармацевтических продуктов для врачей и их пациентов в Беларуси.</p>
                <p>Мы мечтаем, что у нас получится улучшить взаимодействие в области медицинских технологий и этим быть полезными людям с проблемами здоровья.</p>
                <p>Мы гордимся тем, что наши партнёры — мировые лидеры в фармацевтике, которые создают продукты и услуги для улучшения жизни людей!</p>
                <p>… и мы знаем — всё зависит от людей!</p>
                <p>Наш подход основан на цифровых технологиях и глубоком понимании потребностей рынка здравоохранения. Мы помогаем вам наладить эффективную коммуникацию с ключевыми аудиториями через персонализированные кампании, интегрированные цифровые платформы и инновационные решения с применением искусственного интеллекта.</p>
                <p>Благодаря нашей работе пациенты и врачи получают лучший доступ к медицинским знаниям, производители лекарств — возможность эффективно продвигать продукцию, а общество — улучшение здоровья и повышение качества жизни.</p>
                <p>Доверьтесь нам — и мы вместе откроем новые возможности для вашего бренда в сфере здравоохранения.</p>
              </>
            }
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip lang={lang} /> : null}

      <section id="team-members" className="container team-members-section" style={{ scrollMarginTop: 96 }}>
        <h2 className="team-members-heading">{en ? en.teamHeading : 'Команда'}</h2>
        <div className="team-grid">
          {team.map((m, i) =>
          <div key={i} className="tm">
              <div className={`tm-portrait${m.n === 'Робби' || m.n === 'Robbie' ? ' tm-portrait--robbie' : ''}`}>
                <div className="tm-portrait-img tm-portrait-default">
                  <TeamMemberPortrait member={m} seed={i + 1} layer="default" />
                </div>
                <div className="tm-portrait-img tm-portrait-hover">
                  <TeamMemberPortrait member={m} seed={i + 1 + 97} layer="hover" />
                </div>
              </div>
              <div className="tm-name">{m.n}</div>
              <div className="tm-role">{m.r}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">{en ? en.portfolioEyebrow : 'Портфолио'}</div>
              <h2>{en ? en.portfolioH2 : <>Проекты последних<br />двенадцати месяцев.</>}</h2>
            </div>
            <div className="right">{en ? en.portfolioRight : '8 запусков, 3 ИИ-продукта, 2 справочника, 1 победа на премии. Подробное портфолио — по запросу.'}</div>
          </div>
          <div className="cards-grid">
            {(en ? en.portfolioCards : [
            { t: 'Цифровой баннер для Бепантен (Bayer)', d: 'Три варианта digital-баннера: разные героини, локальные сценарии, брендбук Bayer.', art: 'ArtBanner', slug: 'cardio-lonch' },
            { t: 'Упаковка для препарата АйТи-табс', d: 'Три формата — единая линейка препарата АйТи-табс.', art: 'ArtAI', slug: 'ai-trener' },
            { t: 'Упаковка для препарата ГидроБаланс', d: 'Разработка упаковки для препарата ГидроБаланс.', art: 'ArtVideo', slug: 'patient-series' },
            { t: 'Конференция «ФармКонсилиум-2025»', d: '1 500 участников, эвент-бот, ИИ-помощник на программе.', art: 'ArtRadar', slug: 'conference-pk25' },
            { t: 'Программа поддержки пациентов', d: '24 месяца сопровождения, +38% к удержанию терапии.', art: 'ArtPulse', slug: 'psp-platform' },
            { t: 'CLM-обновление под Veeva', d: '12 модулей, перенос на 2CLM, тренинг команды.', art: 'ArtLayers', slug: 'clm-veeva' },
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
              const cardArtStyle = thumbTone
                ? { background: `linear-gradient(145deg, var(--bg-2), color-mix(in srgb, ${thumbTone} ${thumb ? 22 : 28}%, var(--accent-soft)))` }
                : thumb
                  ? { background: 'linear-gradient(145deg, var(--bg-2), var(--accent-soft))' }
                  : undefined;
              return (
                <div key={i} className="card"
                onClick={() => navigate(`portfolio/${p.slug}`)}>
                  <div className={`card-art${thumb ? ' card-art--photo' : ''}${thumbWide ? ' card-art--photo-wide' : ''}${thumbPack ? ' card-art--photo-pack' : ''}`} style={cardArtStyle}>
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
          <div className="team-contacts-copy">
            <div className="eyebrow">{en ? en.contactsEyebrow : 'Контакты'}</div>
            <h2>{en ? en.contactsH2 : <>Напишите —<br />придумаем вместе.</>}</h2>
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