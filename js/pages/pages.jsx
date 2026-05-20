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

function HomePage({ navigate, scenario, setScenario }) {
  const [heroQuery, setHeroQuery] = React.useState('');
  const MidContactStrip = window.MidContactStrip;

  const heroQueryReady = heroQuery.trim().length > 0;

  function runHeroForecast() {
    if (!heroQuery.trim()) return;
    window.openPharmContact?.();
  }
  const heroTiles = [
  { id: 'marketing', num: '01', title: 'Фармацевтический маркетинг.',
    desc: 'Цифровые инструменты для работы медицинских представителей.', art: 'ArtNodes' },
  { id: 'hcp', num: '02', title: 'Цифровые решения для здравоохранения.',
    desc: 'Мобильные приложения, образовательные платформы, сайты, боты, ИИ-ассистенты.', art: 'ArtPulse' },
  { id: 'sales', num: '03', title: 'Аутсорсинг.',
    desc: 'Комплексные цифровые программы продвижения. Цифровой медицинский представитель.', art: 'ArtLaunch' },
  { id: 'content', num: '04', title: 'Контент.',
    desc: 'Медицинскую науку переводим в CLM-презентации, дейтейлеры, видео, игры, квизы. Нравится врачам и провизорам.', art: 'ArtVideo', wide: true },
  { id: 'directory', num: '05', title: 'Справочник ЛС ФармКонсилиум.',
    desc: 'Инструкции по применению, примеры выписки рецептов, калькуляторы.', art: 'ArtDirectory', wide: true }];


  return (
    <main className="page-route">
      {/* HERO ─────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Команда внедрения цифровых технологий в сфере фармацевтики и здравоохранения. Работаем с 2015 года.</div>
            <h1>
              IT-решения<br />
              <span className="accent">для лечения доверия</span>
            </h1>
            <p className="hero-lede">
              Узнайте прогноз Вашего бренда на фармацевтическом рынке СНГ, наш искусственный интеллект
              «Робби» представит вам основные показатели рынка и возможности для роста. Просто введите название
              вашего бренда и страны, через несколько секунд узнаете прогноз.
            </p>
            <div className="hero-cta">
              <button
                type="button"
                className="btn btn-primary btn-sm hero-cta-submit"
                disabled={!heroQueryReady}
                onClick={runHeroForecast}>
                Прогноз
              </button>
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
                  placeholder="Укажите название бренда и страну СНГ"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="hero-trust">
              <div><div className="stat-num">2015</div><div className="stat-lbl">год основания</div></div>
              <div><div className="stat-num">22 000</div><div className="stat-lbl">в активной базе HCP</div></div>
              <div><div className="stat-num">7</div><div className="stat-lbl">стран с нашими Клиентами</div></div>
            </div>
          </div>

          {/* Forecast card */}
          <div className="forecast-card">
            <div className="fc-head">
              <div>
                <div className="fc-title">ИИ Робби рассчитает прогноз Вашего бренда на фармацевтическом рынке СНГ</div>
              </div>
              <div className="fc-pill"><span className="dot"></span>LIVE</div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="fc-scenarios">
                {[
                ['organic', 'Инерционный'],
                ['comms', 'Базовый'],
                ['launch', 'Максимальный']].
                map(([k, l]) =>
                <button key={k}
                className={scenario === k ? 'on' : ''}
                onClick={() => setScenario(k)}>{l}</button>
                )}
              </div>
              <ForecastChart scenario={scenario} key={scenario} />
            </div>

            <div className="fc-legend">
              <span className="li"><span className="sw"></span>факт</span>
              <span className="li"><span className="sw dashed"></span>прогноз ИИ</span>
              <span className="li"><span className="sw band"></span>границы нормы</span>
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
              <div className="eyebrow">Что мы делаем</div>
              <h2>5 цифровых<br />направлений</h2>
            </div>
            <div className="right">
              От стратегической архитектуры омниканальной коммуникации с HCP до пациентского сериала на YouTube.
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
                    <span className="num">— {t.num}</span>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <span className="tile-cta">Открыть раздел <span className="arrow">→</span></span>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </section>

      {MidContactStrip ?
      <div className="home-tiles-cta" role="region" aria-label="Обсудить проект">
        <div className="container">
          <MidContactStrip inline />
        </div>
      </div> :
      null}

      {/* Feature row: AI-trener — */}
      <section className="section section--feature-after-cta">
        <div className="container">
          <div className="feature-row">
            <div>
              <span className="chip">Хит продаж 2026</span>
              <h3>CRM-PharmConsilium для работы медицинских представителей.</h3>
              <p>
                Специализированная CRM для фармацевтических компаний и омниканальной работы с HCP.
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
            <div className="feature-row-art">
              <ArtCrmFeature />
            </div>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="section section--know-now" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="section-head section-head--title-sync section-head--insights">
            <div className="eyebrow">Инсайты ФармКонсилиум</div>
            <h2>Вам лучше это<br />узнать сейчас.</h2>
            <div className="right">
              3 в 1: маркетинговая экспертиза, разработка цифровых решений, студия контент дейлинга.
            </div>
          </div>

          <div className="cards-grid cards-grid--2x2">
            {[
            { n: '01', t: 'Портфолио и проекты.', d: 'Проекты, портфолио, события.', to: 'portfolio' },
            { n: '02', t: 'Цифровой медицинский представитель.', d: 'Диджитальная экосистема с клиентской базой HCP, которая работает в KPI медицинского представителя.', to: 'sales' },
            { n: '03', t: 'Справочник ЛС ФармКонсилиум.', d: 'Собственный профессиональный ресурс для врачей, провизоров, фармацевтов.', href: 'https://farmconsilium.com/' },
            { n: '04', t: 'Разработка мобильных приложений.', d: 'Для операционных систем iOS и Android под ключ.', to: 'hcp/mobile' }].
            map((s) => {
              const clickable = Boolean(s.to || s.href);
              return (
            <div
              key={s.n}
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
                <div className="card-num">— {s.n}</div>
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

function PageShell({ crumb, title, lede, cards, navigate, section }) {
  const MidContactStrip = window.MidContactStrip;
  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{crumb}</span>
          </div>
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip /> : null}

      <section className="container">
        <div className="cards-grid">
          {cards.map((c, i) => {
            const Art = window[c.art];
            const target = c.sub ? `${section}/${c.sub}` : null;
            return (
              <div key={i} className={`card ${c.size || ''}`}
              onClick={() => target && navigate(target)}
              style={{ cursor: target ? 'pointer' : 'default' }}>
                <div className="card-art">{Art ? <Art /> : null}</div>
                <div className="card-num">— {String(i + 1).padStart(2, '0')}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                {c.tag && <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.tag.split(',').map((t, j) => <span key={j} className="chip" style={{
                    background: 'transparent', border: 'none', color: 'var(--muted)'
                  }}>{t.trim()}</span>)}
                </div>}
                {target && <a className="read">Подробнее <span className="arrow">→</span></a>}
              </div>);

          })}
        </div>
      </section>
    </main>);

}

function MarketingPage({ navigate }) {
  return <PageShell navigate={navigate}
  section="marketing"
  crumb="Фармацевтический маркетинг"
  title="Цифровые инструменты для фармацевтического маркетинга"
  lede="От CRM медицинского представителя до AI-тренера и платформы омниканального взаимодействия с HCP. Берём на себя всю архитектуру и контент."
  cards={[
  { title: 'CRM', sub: 'crm', size: 'huge', art: 'ArtNodes',
    desc: 'Для медицинских представителей и омниканального цифрового взаимодействия с HCP. Сегментация, сценарии визита, оркестрация каналов, отчётность для бренд-команды.',
    tag: 'Veeva, IQVIA, Pitcher' },
  { title: 'CLM', sub: 'clm', art: 'ArtLayers',
    desc: 'Интерактивные презентации визита. Загружаем в Veeva, IQVIA, Agnitio, Pitcher.',
    tag: 'визит, контент' },
  { title: '2CLM', sub: '2clm', art: 'ArtTablet',
    desc: 'Двухканальная презентация: тач-визит и удалённая работа с одним сценарием контента.',
    tag: 'remote eDetailing' },
  { title: 'Чат-боты и ТелеАпп', sub: 'chatbot', art: 'ArtChat',
    desc: 'Сценарные боты для HCP и пациентов: рассылки, опросники, навигация, NPS, поддержка терапии.',
    tag: 'Telegram, WhatsApp' },
  { title: 'Веб и цифровые продукты', sub: 'web', art: 'ArtBrowser', size: 'wide',
    desc: 'Сайты, лендинги, лонгриды, порталы, онлайн-конгрессы, вебинары, интерактивные игры. Полный цикл — от UX до релиза.',
    tag: 'портал, лонгрид' },
  { title: 'Мобильные приложения', sub: 'mobile', art: 'ArtPhone', size: 'wide',
    desc: 'iOS и Android для HCP-сообществ и программ поддержки пациентов. Доступы, push, аналитика, маркетплейс.',
    tag: 'iOS, Android' },
  { title: 'Цифровая поддержка эвентов', sub: 'events', art: 'ArtRadar',
    desc: 'Регистрационные лендинги, ИИ-помощник на конференции, эвент-боты, навигация по программе, опросы до и после события.',
    tag: 'конгрессы' },
  { title: 'ИИ-решения', sub: 'ai', art: 'ArtAI',
    desc: 'AI-тренер для медпредов, ИИ-ассистенты, платформы опросов и бизнес-анализа, ИИ-консалтинг.',
    tag: 'AI · 2026' }]
  } />;
}

function HcpPage({ navigate }) {
  return <PageShell navigate={navigate}
  section="hcp"
  crumb="Здравоохранение"
  title="Разработка цифровых решений для здравоохранения"
  lede="Платформы, рекомендательные системы, ИИ-ассистенты и программы поддержки пациентов — в регуляторных рамках, с заботой о практической пользе."
  cards={[
  { title: 'ИИ-ассистенты и рекомендательные системы', sub: 'ai-recom', size: 'huge', art: 'ArtAI',
    desc: 'Чат-боты, голосовые-боты, навигация по контенту, подбор релевантных материалов для врача или пациента. Персональный контентный путь, который перестраивается по поведению.',
    tag: 'recsys, NLP' },
  { title: 'Образовательные платформы', sub: 'education', art: 'ArtBooks',
    desc: 'Вебинары, онлайн-курсы, тренинги, аттестация и сертификация. LMS под HCP-аудиторию.',
    tag: 'LMS, сертификация' },
  { title: 'Чат-бот и ТелеАпп', sub: 'chatbot', art: 'ArtChat',
    desc: 'Каналы коммуникации без рекламного шума. Доступ к материалам, обновления, навигация.',
    tag: 'без рекламы' },
  { title: 'Мобильные приложения', sub: 'mobile', art: 'ArtPhone',
    desc: 'iOS и Android для HCP и программ поддержки пациентов. Push, оффлайн, аналитика, сторы.',
    tag: 'iOS · Android' },
  { title: 'ИИ-решения для здравоохранения', sub: 'ai-healthcare', art: 'ArtDashboard',
    desc: 'Панели для сбора данных в клинических исследованиях, ИИ-помощник врача, ИИ-консультант пациента.',
    tag: 'клинические данные' },
  { title: 'Программы поддержки пациентов', sub: 'psp', art: 'ArtPulse', size: 'wide',
    desc: 'Цифровые материалы: напоминания, мотивационные материалы, навигация по терапии, персонализированные рекомендации — в рамках регуляторных ограничений.',
    tag: 'PSP, adherence' },
  { title: 'Готовый стартовый набор для бренда', art: 'ArtMolecule', size: 'wide',
    desc: 'Связка лендинг + бот + материалы для HCP + базовая CRM — за 4 недели от подписания брифа.',
    tag: '4 недели · фикс' }]
  } />;
}

function SalesPage({ navigate }) {
  return <PageShell navigate={navigate}
  section="sales"
  crumb="Аутсорсинг"
  title="Комплексное продвижение и аутсорсинг продаж"
  lede="Если у вас нет своего отдела продаж в РБ — соберём его за вас. Если есть — добавим цифровой слой и омниканальный охват."
  cards={[
  { title: 'Цифровой медицинский представитель', sub: 'digital-rep', size: 'huge', art: 'ArtTablet',
    desc: 'Удалённый медпред нашей команды работает по вашему бренду: визиты remote eDetailing, follow-up по контенту, аналитика по контактам. Покрытие — все области РБ.',
    tag: 'remote eDetail, покрытие РБ' },
  { title: 'Омниканальные кампании', sub: 'omnichannel', art: 'ArtNodes',
    desc: 'Создадим персональную архитектуру и контент для долгосрочной коммуникации с врачами, провизорами, целевыми группами. Email + push + бот + визит — в одном плане.',
    tag: 'архитектура коммуникаций' },
  { title: 'Лонч-аутсорсинг', sub: 'launch', art: 'ArtLaunch',
    desc: 'Используйте наши инструменты и клиентскую базу медспециалистов для быстрого старта нового бренда на рынке РБ. От 90 дней до первой коммуникации.',
    tag: 'launch · 90 дней' },
  { title: 'Аналитика продаж и доли голоса', sub: 'analytics', art: 'ArtDashboard',
    desc: 'Дашборд: визиты, контакты, отклик, метрики кампании. Связка с IQVIA / закупочными данными.',
    tag: 'IQVIA' }]
  } />;
}

function ContentPage({ navigate }) {
  return <PageShell navigate={navigate}
  section="content"
  crumb="Контент и игры"
  title="HCP-контент на языке медицинской науки для врачей и фармацевтов"
  lede="Сценарии, презентации, видео, статьи, игры и квизы. Делаем сложное понятным — для врача, провизора и пациента."
  cards={[
  { title: 'Медицинские презентации и научные статьи', sub: 'medical', size: 'huge', art: 'ArtDoc',
    desc: 'Экспертные материалы, инфографика, сценарии презентаций, доказательная база, KOL-контент. Литературные обзоры и сводки публикаций под ваш бренд.',
    tag: 'KOL, доказательная база' },
  { title: 'CLM и eDetailing', sub: 'edetailing', art: 'ArtTablet',
    desc: 'Интерактивные CLM-презентации, сценарии визитов, presentations для face-to-face и remote eDetailing, surveys, геймификация.',
    tag: 'Veeva, Pitcher, Agnitio' },
  { title: 'Пациентский образовательный контент', sub: 'patient', art: 'ArtChat',
    desc: 'Расскажем и нарисуем сложное так, что поймёт ребёнок: статьи, видео, анимация, памятки, объяснение заболеваний, терапии, приверженности и образа жизни.',
    tag: 'просвещение' },
  { title: 'Видео — от идеи до создания', sub: 'video', art: 'ArtVideo', size: 'wide',
    desc: 'Видеовизит медпредставителя, 3D-визуализация механизма действия, AI-анимация, видеоаватары, ИИ-говорящая голова, игровое видео (сериалы).',
    tag: '3D, AI-аватары, сериалы' },
  { title: 'Геймификация и квизы', sub: 'gamification', art: 'ArtGame', size: 'wide',
    desc: 'Игры для серьёзных знаний: квизы на конференциях, образовательные челленджи, баллы за обучение, рейтинги — всё, что повышает вовлечённость HCP.',
    tag: 'gamified learning' },
  { title: 'Презентации', sub: 'presentations', art: 'ArtSlides',
    desc: 'Корпоративные, инвесторские, продуктовые, бренд-команда. Делаем красиво и понятно.',
    tag: 'design' },
  { title: 'Реклама', sub: 'advertising', art: 'ArtBrowser',
    desc: 'Креативы для digital-кампаний — в рамках законодательства РБ о рекламе ЛС.',
    tag: 'digital · РБ' },
  { title: 'Программы поддержки пациентов', sub: 'psp', art: 'ArtPulse',
    desc: 'Цифровые платформы и материалы: напоминания, мотивация, навигация по терапии.',
    tag: 'PSP' }]
  } />;
}

function DirectoryPage({ navigate }) {
  const cats = ['Кардиология', 'Эндокринология', 'Онкология', 'Неврология', 'Пульмонология', 'Педиатрия', 'Терапия', 'Психиатрия'];
  const [activeCat, setActiveCat] = React.useState(cats[0]);
  const MidContactStrip = window.MidContactStrip;
  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>Справочник ЛС</span>
          </div>
          <h1>Справочник ЛС<br /><span style={{ color: 'var(--muted-2)' }}>ФармКонсилиум</span></h1>
          <p className="lede">
            Профессиональный цифровой ресурс для врачей и фармацевтов. Сегодня его используют
            более 1 000 специалистов ежедневно для поиска экспертного справочного контента.
            Доверительная атмосфера ординаторской — без рекламного шума.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            {MidContactStrip ? <MidContactStrip inline /> : null}
            <button className="btn btn-ghost">Открыть справочник →</button>
            <button className="btn btn-ghost">Получить демо-доступ</button>
          </div>
        </div>
      </section>

      {/* Mocked search UI */}
      <section className="container" style={{ margin: '48px auto' }}>
        <div>
          <div className="section-head">
            <div>
              <div className="eyebrow">Преимущества</div>
              <h2>Почему врачи и провизоры<br />возвращаются.</h2>
            </div>
            <div className="right">
              Доверительная атмосфера ординаторской: только экспертный контент,
              никакого рекламного шума, прозрачные источники.
            </div>
          </div>
          <div className="cards-grid">
            {[
              { t: 'Поиск по МНН и торговым наименованиям', d: 'Быстрый ввод МНН, торгового или АТХ-кода. Подсказки по мере набора, история запросов.', art: 'ArtDirectory' },
              { t: 'Профессиональные карточки препаратов',   d: 'Показания, режимы дозирования, противопоказания, лекарственные взаимодействия — собрано в одну карточку.', art: 'ArtDoc' },
              { t: 'Доказательная база и публикации',          d: 'У каждой карточки — ссылки на публикации, мета-анализы и клинические протоколы.', art: 'ArtBooks' },
              { t: 'Доверительная среда без рекламного шума', d: 'Никакого продакт-плейсмента и баннеров. Монетизация — через подписку для аптек и клиник.', art: 'ArtPulse' },
            ].map((a, i) => {
              const A = window[a.art];
              return (
                <div key={i} className="card" style={{ gridColumn: 'span 6' }}>
                  <div className="card-art">{A && <A />}</div>
                  <div className="card-num">— {String(i + 1).padStart(2, '0')}</div>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          marginTop: 56,
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {cats.map((c) => {
              const on = c === activeCat;
              return (
                <button key={c}
                  onClick={() => setActiveCat(c)}
                  className="chip"
                  style={{
                    cursor: 'pointer',
                    background: on ? 'var(--accent)' : 'transparent',
                    border: 'none',
                    color: on ? 'white' : 'var(--ink-2)',
                    fontFamily: 'inherit', fontSize: 13,
                    transition: 'background 180ms, color 180ms'
                  }}>{c}</button>
              );
            })}
          </div>

          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
            { name: 'Препарат-альфа', mnn: 'rosuvastatinum', atc: 'C10AA07', cls: 'Гиполипидемическое' },
            { name: 'Препарат-бета', mnn: 'metformin', atc: 'A10BA02', cls: 'Антидиабетическое' },
            { name: 'Препарат-гамма', mnn: 'amlodipinum', atc: 'C08CA01', cls: 'Антагонист кальция' },
            { name: 'Препарат-дельта', mnn: 'omeprazolum', atc: 'A02BC01', cls: 'Ингибитор протонного насоса' },
            { name: 'Препарат-эпсилон', mnn: 'azithromycinum', atc: 'J01FA10', cls: 'Макролид' },
            { name: 'Препарат-зета', mnn: 'levothyroxinum', atc: 'H03AA01', cls: 'Тиреоидный гормон' }].
            map((p, i) =>
            <div key={i} style={{
              border: 'none', borderRadius: 'var(--radius)',
              padding: 18,
              background: 'var(--surface-2)'
            }}>
                <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)',
                letterSpacing: '.08em', textTransform: 'uppercase'
              }}>{p.atc} · ATC</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, marginTop: 6, letterSpacing: '-.015em' }}>{p.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2, fontStyle: 'italic' }}>{p.mnn}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 10 }}>{p.cls}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
                  <span>14 публикаций</span>·<span>3 клин. протокола</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cards-grid" style={{ marginTop: 32 }}>
          {[
          { n: '01', t: '1 000+ специалистов', d: 'врачей и провизоров используют справочник ежедневно' },
          { n: '02', t: 'Без рекламного шума', d: 'Атмосфера ординаторской: только экспертный контент' },
          { n: '03', t: 'Доказательная база', d: 'Каждая карточка — со ссылками на публикации и протоколы' },
          { n: '04', t: 'API для интеграций', d: 'Подключайте справочник в свои продукты и системы' }].
          map((s) =>
          <div key={s.n} className="card" style={{ gridColumn: 'span 6', minHeight: 'auto', paddingBottom: 18 }}>
              <div className="card-num">— {s.n}</div>
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

function TeamPage({ navigate }) {
  const MidContactStrip = window.MidContactStrip;

  React.useEffect(() => {
    ['assets/uploads/team-robbie.png', 'assets/uploads/team-robbie-hover.png'].forEach((src) => {
      const img = new Image();
      img.src = `${src}?v=2`;
    });
  }, []);

  return (
    <main className="page-route">
      <section className="page-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>Главная</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>Команда</span>
          </div>
          <h1>Наша миссия<br />в этой Вселенной:</h1>
          <div className="team-lede-stack">
            <p>
              Каждое утро, перед началом работы мы говорим: <strong>СДЕЛАЕМ МИР ЛУЧШЕ!</strong>
            </p>
            <p>
              Мы объединяем фармацевтические компании медицинских специалистов и людей, заботящихся о своём здоровье,
              в информационных пространствах.
            </p>
            <p>
              Мы работаем, чтобы содействовать скорейшей доступности самых инновационных и эффективных фармацевтических
              продуктов для врачей и их пациентов в Беларуси.
            </p>
            <p>
              Мы мечтаем, что у нас получится улучшить взаимодействие в области медицинских технологий и этим быть
              полезными людям с проблемами здоровья.
            </p>
            <p>
              Мы гордимся тем, что наши партнёры — мировые лидеры в фармацевтике, которые создают продукты и услуги для
              улучшения жизни людей!
            </p>
            <p>… и мы знаем — всё зависит от людей!</p>
            <p>
              Наш подход основан на цифровых технологиях и глубоком понимании потребностей рынка здравоохранения. Мы
              помогаем вам наладить эффективную коммуникацию с ключевыми аудиториями через персонализированные кампании,
              интегрированные цифровые платформы и инновационные решения с применением искусственного интеллекта.
            </p>
            <p>
              Благодаря нашей работе пациенты и врачи получают лучший доступ к медицинским знаниям, производители
              лекарств — возможность эффективно продвигать продукцию, а общество — улучшение здоровья и повышение
              качества жизни.
            </p>
            <p>
              Доверьтесь нам — и мы вместе откроем новые возможности для вашего бренда в сфере здравоохранения.
            </p>
          </div>
        </div>
      </section>

      {MidContactStrip ? <MidContactStrip /> : null}

      <section className="container">
        <div className="team-grid">
          {TEAM.map((m, i) =>
          <div key={i} className="tm">
              <div className={`tm-portrait${m.n === 'Робби' ? ' tm-portrait--robbie' : ''}`}>
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
              <div className="eyebrow">Портфолио</div>
              <h2>Проекты последних<br />двенадцати месяцев.</h2>
            </div>
            <div className="right">8 запусков, 3 ИИ-продукта, 2 справочника, 1 победа на премии. Подробное портфолио — по запросу.</div>
          </div>
          <div className="cards-grid">
            {[
            { t: 'Лонч кардиопрепарата · 90 дней', d: 'Полный пакет: лендинг, CRM, e-detailing, омниканальная кампания.', art: 'ArtLaunch', slug: 'cardio-lonch' },
            { t: 'AI-тренер для медпредов', d: 'Внутренний продукт, развёрнут для трёх международных фармкомпаний.', art: 'ArtAI', slug: 'ai-trener' },
            { t: 'Сериал для пациентов · 6 серий', d: 'Образовательный сериал с AI-аватарами на трёх языках.', art: 'ArtVideo', slug: 'patient-series' },
            { t: 'Конференция «ФармКонсилиум-2025»', d: '1 500 участников, эвент-бот, ИИ-помощник на программе.', art: 'ArtRadar', slug: 'conference-pk25' },
            { t: 'Программа поддержки пациентов', d: '24 месяца сопровождения, +38% к удержанию терапии.', art: 'ArtPulse', slug: 'psp-platform' },
            { t: 'CLM-обновление под Veeva', d: '12 модулей, перенос на 2CLM, тренинг команды.', art: 'ArtLayers', slug: 'clm-veeva' }].
            map((p, i) => {
              const A = window[p.art];
              return (
                <div key={i} className="card" style={{ gridColumn: 'span 4' }}
                onClick={() => navigate(`portfolio/${p.slug}`)}>
                  <div className="card-art"><A /></div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                  <a className="read">Открыть кейс <span className="arrow">→</span></a>
                </div>);

            })}
          </div>
        </div>

        {/* Contacts */}
        <div data-contacts style={{
          margin: '64px 0',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 48,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center'
        }}>
          <div>
            <div className="eyebrow">Контакты</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 500,
              fontSize: 'clamp(28px, 3.4vw, 44px)', letterSpacing: '-.025em',
              margin: '12px 0 24px', lineHeight: 1.05
            }}>Напишите —<br />придумаем вместе.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 600 }}>☎</div>
                <div><div style={{ color: 'var(--muted)', fontSize: 12 }}>Телефон</div><div style={{ fontWeight: 600 }}>+375 (29) 000 — 00 — 00</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 600 }}>@</div>
                <div><div style={{ color: 'var(--muted)', fontSize: 12 }}>Почта</div><div style={{ fontWeight: 600 }}>hello@pharmconsilium.by</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 600 }}>◎</div>
                <div><div style={{ color: 'var(--muted)', fontSize: 12 }}>Адрес</div><div style={{ fontWeight: 600 }}>Минск, пр-т Независимости, 00</div></div>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', height: 280 }}>
            <ArtConstellation />
          </div>
        </div>
      </section>
    </main>);

}

Object.assign(window, {
  HomePage, MarketingPage, HcpPage, SalesPage, ContentPage, DirectoryPage, TeamPage
});