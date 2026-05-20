// Header with Apple-style mega-menu drawer, brand, lang toggle, theme switch.

const NAV_ITEMS = [
{ id: 'marketing', label: 'Фармацевтический маркетинг' },
{ id: 'hcp', label: 'Здравоохранения' },
{ id: 'sales', label: 'Аутсорсинг' },
{ id: 'content', label: 'Контент' },
{ id: 'directory', label: 'Справочник ЛС' },
{ id: 'team', label: 'Команда' }];


// per-page mega-menu config: sublinks + featured tile
const MEGA = {
  marketing: {
    title: 'Цифровые инструменты для фарм-маркетинга',
    links: [
    { label: 'CRM — омниканальная работа с HCP', to: 'marketing/crm' },
    { label: 'CLM',                                        to: 'marketing/clm' },
    { label: '2CLM',                                       to: 'marketing/clm' },
    { label: 'Чат-боты и ТелеАпп',                       to: 'marketing/chatbot' },
    { label: 'Веб и цифровые продукты',                 to: 'marketing/web' },
    { label: 'Мобильные приложения',                      to: 'marketing/mobile' },
    { label: 'Цифровая поддержка эвентов',                  to: 'marketing/events' },
    { label: 'ИИ-решения',                                to: 'marketing/ai' }],

    featured: {
      tag: 'Инструмент',
      title: 'AI-тренер для медпредставителей',
      desc: 'Гибридная среда тренировок на реальных сценариях визита: симулятор HCP, ИИ-обратная связь, метрики прогресса.',
      art: 'ArtAI'
    }
  },
  hcp: {
    title: 'Цифровые решения для здравоохранения',
    links: [
    { label: 'ИИ-ассистенты и рекомендательные системы', to: 'hcp/ai-recom' },
    { label: 'Образовательные платформы',                  to: 'hcp/education' },
    { label: 'Чат-бот и ТелеАпп',                       to: 'hcp/chatbot' },
    { label: 'ИИ-решения для здравоохранения',          to: 'hcp/ai-healthcare' },
    { label: 'Программы поддержки пациентов',             to: 'hcp/psp' }],

    featured: {
      tag: 'Платформа',
      title: 'Персональный контентный путь для врача',
      desc: 'Рекомендательная система собирает релевантные публикации, видео и обновления под профиль специалиста.',
      art: 'ArtPulse'
    }
  },
  sales: {
    title: 'Комплексное продвижение и аутсорсинг',
    links: [
    { label: 'Цифровой медицинский представитель', to: 'sales/digital-rep' },
    { label: 'Омниканальные кампании',         to: 'sales/omnichannel' },
    { label: 'Лонч-аутсорсинг под ключ',         to: 'sales/launch' },
    { label: 'Аналитика продаж',                  to: 'sales/analytics' }],

    featured: {
      tag: 'Сервис',
      title: 'Лонч нового бренда за 90 дней',
      desc: 'Используйте нашу клиентскую базу медспециалистов и инструменты для быстрого старта на рынке РБ.',
      art: 'ArtLaunch'
    }
  },
  content: {
    title: 'HCP-контент на языке медицинской науки',
    links: [
    { label: 'Медицинские презентации и статьи', to: 'content/medical' },
    { label: 'CLM и eDetailing для визитов',     to: 'content/edetailing' },
    { label: 'Пациентский образовательный контент', to: 'content/patient' },
    { label: 'Видео — от идеи до создания',    to: 'content/video' },
    { label: 'Презентации',                       to: 'content/presentations' },
    { label: 'Реклама',                             to: 'content/advertising' },
    { label: 'Геймификация и квизы',              to: 'content/gamification' },
    { label: 'Программы поддержки пациентов',     to: 'content/psp' }],

    featured: {
      tag: 'Студия',
      title: 'AI-говорящая голова и видеоаватары',
      desc: 'Готовые видео и анимация: 3D-визуализация механизма действия, ИИ-аватары на 12 языках, серия сценариев.',
      art: 'ArtVideo'
    }
  },
  directory: {
    title: 'Справочник лекарственных средств',
    links: [
    { label: 'Поиск по МНН и торговым наименованиям',  to: 'directory' },
    { label: 'Профессиональные карточки препаратов',     to: 'directory' },
    { label: 'Доказательная база и публикации',           to: 'directory' },
    { label: 'Доверительная среда без рекламного шума', to: 'directory' }],

    featured: {
      tag: '1000+ специалистов · ежедневно',
      title: 'Архитектура ординаторской — без шума',
      desc: 'Контент, который реально помогает в принятии практических решений. Доступ для врачей и провизоров.',
      art: 'ArtDirectory'
    }
  },
  team: {
    title: 'Команда внедрения цифровых технологий',
    links: [
    { label: 'Наша миссия',           to: 'team' },
    { label: 'Проекты и портфолио', to: 'portfolio' },
    { label: 'События и публикации',    to: 'team/events' },
    { label: 'Контакты и адрес',        to: 'team/contacts' },
    { label: 'Карьера',                  to: 'team/career' }],

    featured: {
      tag: 'Команда',
      title: 'Лечение доверия — наша работа',
      desc: '15 лет в фарм-маркетинге, 80+ запусков, экспертиза по всей территории РБ и СНГ.',
      art: 'ArtConstellation'
    }
  },
  portfolio: {
    title: 'Проекты и портфолио',
    links: [
    { label: 'Все проекты',              to: 'portfolio' },
    { label: 'Лончи и кампании',           to: 'portfolio/cardio-lonch' },
    { label: 'AI и продукты',              to: 'portfolio/ai-trener' },
    { label: 'CLM и eDetailing',            to: 'portfolio/clm-veeva' },
    { label: 'Справочники и платформы',  to: 'portfolio/directory-launch' }],

    featured: {
      tag: '80+ запусков',
      title: 'Кейсы последних 24 месяцев',
      desc: 'От лонча кардиопрепарата за 90 дней до собственного справочника ЛС с тысячей DAU.',
      art: 'ArtLaunch'
    }
  }
};

function Header({ route, navigate, lang, setLang, theme, setTheme }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const closeTimer = React.useRef(null);

  const open = (id) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(id);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  };

  React.useEffect(() => {
    const esc = (e) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileNavOpen(false);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [route]);

  const ArtTag = openMenu ? window[MEGA[openMenu].featured.art] : null;

  return (
    <header className="header">
      <div className="container header-inner">
        {/* LEFT: brand */}
        <div className="header-left">
          <div className="brand" onClick={() => {navigate('home');setOpenMenu(null);}}>
            <img src="assets/logo.svg" alt="ФармКонсилиум — IT-решения для фарм-маркетинга" className="brand-logo" />
          </div>
        </div>

        {/* CENTER: nav */}
        <nav className="nav" onMouseLeave={scheduleClose}>
          {NAV_ITEMS.map((item) =>
          <div key={item.id}
          className={`nav-item ${route === item.id ? 'active' : ''}`}
          onMouseEnter={() => open(item.id)}
          onClick={() => {navigate(item.id);setOpenMenu(null);}}>
              {item.label}
            </div>
          )}
        </nav>

        {/* RIGHT: actions */}
        <div className="header-right">
          <button
            type="button"
            className="nav-menu-btn btn-icon"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            aria-label={mobileNavOpen ? 'Закрыть меню разделов' : 'Открыть меню разделов'}
            onClick={() => { setMobileNavOpen((o) => !o); setOpenMenu(null); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <div className="lang-toggle">
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          aria-label="Сменить тему">
            {theme === 'dark' ?
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> :

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            }
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('team')}>
            Консультация <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <div className={`mega-overlay ${openMenu ? 'open' : ''}`}
      onMouseEnter={() => open(openMenu)}
      onMouseLeave={scheduleClose}>
        {openMenu &&
        <div className="container mega-inner">
            <div className="mega-left">
              <h3>{MEGA[openMenu].title}</h3>
              <ul className="mega-links">
                {MEGA[openMenu].links.map((l, i) => {
                const label = typeof l === 'string' ? l : l.label;
                const to = typeof l === 'string' ? openMenu : l.to;
                return (
                  <li key={i} onClick={() => {navigate(to);setOpenMenu(null);}}>
                      {label}<span className="arrow">→</span>
                    </li>);

              })}
              </ul>
            </div>
            <div className="mega-feature">
              <div>
                <div className="mf-tag">{MEGA[openMenu].featured.tag}</div>
                <div className="mf-title">{MEGA[openMenu].featured.title}</div>
                <div className="mf-desc">{MEGA[openMenu].featured.desc}</div>
              </div>
              <div className="mf-art">{ArtTag && <ArtTag />}</div>
            </div>
          </div>
        }
      </div>

      <div
        className={`mobile-nav-backdrop ${mobileNavOpen ? 'open' : ''}`}
        aria-hidden="true"
        onClick={() => setMobileNavOpen(false)}
      />
      <nav id="mobile-nav"
        className={`mobile-nav-sheet ${mobileNavOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Разделы сайта">
        {NAV_ITEMS.map((item) =>
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-link ${route === item.id ? 'active' : ''}`}
            onClick={() => { navigate(item.id); setMobileNavOpen(false); setOpenMenu(null); }}>
            {item.label}
          </button>
          )}
      </nav>
    </header>);

}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand" style={{ cursor: 'default' }}>
              <img src="assets/logo.svg" alt="ФармКонсилиум — IT-решения для фарм-маркетинга" className="brand-logo" />
            </div>
            <div className="footer-tag">IT-решение для лечения доверия в здравоохранении</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>© 2026 ФармКонсилиум · РБ</div>
          </div>
          <div className="footer-col">
            <h4>Разделы</h4>
            <ul>
              {NAV_ITEMS.slice(0, 5).map((n) =>
              <li key={n.id} onClick={() => navigate(n.id)}>{n.label}</li>
              )}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Компания</h4>
            <ul>
              <li onClick={() => navigate('team')}>Команда</li>
              <li>Проекты</li>
              <li>События</li>
              <li>Карьера</li>
              <li>Пресс-кит</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Контакты</h4>
            <ul>
              <li style={{ color: 'var(--ink)' }}>+375 (29) 000 — 00 — 00</li>
              <li>hello@pharmconsilium.by</li>
              <li>Минск, пр-т Независимости, 00</li>
              <li>пн — пт, 10:00 — 19:00</li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <div>УНП 000000000 · Лицензия Минздрава РБ № 00-00</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <span>Политика конфиденциальности</span>
            <span>Соглашение</span>
          </div>
        </div>
      </div>
    </footer>);

}

window.Header = Header;
window.Footer = Footer;
window.NAV_ITEMS = NAV_ITEMS;