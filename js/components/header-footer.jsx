// Header with Apple-style mega-menu drawer, brand, lang toggle, theme switch.

const NAV_ITEMS = [
{ id: 'marketing', label: 'Фармацевтический маркетинг' },
{ id: 'hcp', label: 'Здравоохранение' },
{ id: 'sales', label: 'Аутсорсинг' },
{ id: 'content', label: 'Контент' },
{ id: 'directory', label: 'Справочник ЛС' },
{ id: 'team', label: 'О нас' }];


// per-page mega-menu config: sublinks + featured tile
const MEGA = {
  marketing: {
    title: 'Цифровые инструменты фармацевтического маркетинга',
    links: [
    { label: 'CRM для медицинских представителей', to: 'marketing/crm' },
    { label: 'CLM — ПО для работы МП F2F с промоконтентом', to: 'marketing/clm' },
    { label: '2CLM — ПО для увеличения эффективности визитов SF', to: 'marketing/2clm' },
    { label: 'Чат-бот и ТелеАпп — цифровая экосистема для коммуникации с HCP', to: 'marketing/chatbot' },
    { label: 'Веб-разработка: сайты, лендинги, лонгриды, платформы для онлайн-конгрессов и вебинаров', to: 'marketing/web' },
    { label: 'Разработка мобильных приложений', to: 'marketing/mobile' },
    { label: 'Цифровая поддержка мероприятий', to: 'marketing/events' },
    { label: 'Тренинги для медицинских представителей', to: 'marketing/ai' }],

    featured: {
      tag: 'Closed-Loop Marketing',
      title: 'CLM — презентации для медицинских представителей',
      desc: 'Нет дорогой разработки контента! Загружаете PowerPoint или PDF, и система готова к работе.',
      artImg: 'assets/uploads/mega-marketing.png',
      artAlt: 'Фармацевтический маркетинг — CRM и аналитика',
    }
  },
  hcp: {
    title: 'Цифровые решения для здравоохранения',
    links: [
    { label: 'Цифровые платформы для обучения и видеотренингов', to: 'hcp/ai-recom' },
    { label: 'Программы поддержки пациентов', to: 'hcp/education' },
    { label: 'Чат-боты и ИИ-ассистенты для медицины', to: 'hcp/chatbot' },
    { label: 'Цифровые платформы для научных исследований', to: 'hcp/ai-healthcare' },
    { label: 'Создание систем анализа и обработки данных RWE', to: 'hcp/psp' }],

    featured: {
      tag: 'Online learning platform',
      title: 'Кабинет видеотренингов для врачей и провизоров',
      desc: 'Видеолекция, методические материалы и квизы любой сложности в одном онлайн кабинете.',
      artImg: 'assets/uploads/mega-hcp.png',
      artAlt: 'Здравоохранение — видеотренинги для HCP',
    }
  },
  sales: {
    title: 'Комплексное продвижение, аутсорсинг продаж',
    links: [
    { label: 'Цифровой медицинский представитель', to: 'sales/digital-rep' },
    { label: 'Лонч - аутсорсинг', to: 'sales/launch' },
    { label: 'Омниканальные кампании для продвижения', to: 'sales/omnichannel' }],

    featured: {
      tag: 'D2F, Digital to Face',
      title: 'Digital MedRep: цифровой SF продвигает ваш бренд',
      desc: 'Увеличение охвата и частоты контактов с НСP. Понятные метрики эффективности FTE/продажи.',
      artImg: 'assets/uploads/mega-sales.png',
      artAlt: 'Аутсорсинг — цифровой медицинский представитель',
    }
  },
  content: {
    title: 'HCP-контент на языке медицинской науки для врачей, провизоров и фармацевтов в формате Experience Design',
    links: [
    { label: 'CLM-презентации, детейлеры, слайдбоксы для медицинского представителя', to: 'content/medical' },
    { label: 'Видео HCP - от сценария до спецэффектов в выступлении OL', to: 'content/video' },
    { label: 'Игры, квизы, клинические детективы', to: 'content/gamification' },
    { label: 'ИИ-контент: аватары, аудио-подкасты, медицинский копирайтинг', to: 'content/advertising' },
    { label: 'Визуальные концепты, упаковка, рекламные баннера, брендбук ЛС', to: 'content/presentations' }],

    featured: {
      tag: 'Experience Design',
      title: 'AI-«говорящая голова» и видеоаватары',
      desc: ' Цифровой аватар, который говорит через с аудиторией про ваши бренды. Скопируем ваш SF и переметим в цифровой формат. ',
      artImg: 'assets/uploads/mega-content.png',
      artAlt: 'Контент — цифровые интерфейсы и AI',
    }
  },
  directory: {
    title: 'Профессиональный цифровой ресурс для врачей, провизоров и фармацевтов',
    links: [
    { label: 'Удобство для профессионалов на рабочем месте', to: 'directory' },
    { label: 'Актуальные данные в формате инструкций для специалистов', to: 'directory' },
    { label: 'Клинические калькуляторы и медицинские шкалы', to: 'directory' },
    { label: 'Доверительная среда без рекламного шума', to: 'directory' }],

    featured: {
      tag: 'Drug reference guide ',
      title: 'Архитектура ординаторской без рекламного шума',
      desc: 'Данные для принятия решений на рабочем месте, актуальные.',
      artImg: 'assets/uploads/mega-directory.png',
      artAlt: 'Справочник лекарственных средств',
    }
  },
  team: {
    title: 'Сделайте мир лучше!',
    links: [
    { label: 'Наша миссия в этой Вселенной', to: 'team' },
    { label: 'Команда', to: 'team/career' },
    { label: 'Портфолио, проекты, и фичи ФармКонсилиум', to: 'portfolio' }],

    featured: {
      tag: 'PharmConsilium news',
      title: 'Что про ФармКонсилиум говорят и что у нас подсматривают',
      desc: 'Все новости ФармКонсилиум, которые мы забыли опубликовать в Instagram/Telegram/Pinterest.',
      artImg: 'assets/uploads/mega-team.png',
      artAlt: 'О нас — ФармКонсилиум',
    }
  },
  portfolio: {
    title: 'Портфолио, проекты, и фичи ФармКонсилиум',
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
  const [mobileExpanded, setMobileExpanded] = React.useState(null);
  const closeTimer = React.useRef(null);

  function closeMobileNav() {
    setMobileNavOpen(false);
    setMobileExpanded(null);
    setOpenMenu(null);
  }

  function goMobile(to) {
    navigate(to);
    closeMobileNav();
  }

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
    setMobileExpanded(null);
    setOpenMenu(null);
  }, [route]);

  const navItems = window.getSiteNav ? window.getSiteNav(lang) : NAV_ITEMS;
  const megaConfig = window.getSiteMega ? window.getSiteMega(lang) : MEGA;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const featured = openMenu && megaConfig[openMenu] ? megaConfig[openMenu].featured : null;
  const ArtTag = featured?.art && !featured.artImg ? window[featured.art] : null;

  return (
    <header className="header">
      <div className="container header-inner">
        {/* LEFT: brand */}
        <div className="header-left">
          <div className="brand" onClick={() => {navigate('home');setOpenMenu(null);}}>
            <img src="assets/logo.svg" alt={t('brandAlt')} className="brand-logo" />
          </div>
        </div>

        {/* CENTER: nav */}
        <nav className="nav" onMouseLeave={scheduleClose}>
          {navItems.map((item) =>
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
            aria-label={mobileNavOpen ? t('closeMenu') : t('openMenu')}
            onClick={() => {
              setMobileNavOpen((o) => {
                if (o) setMobileExpanded(null);
                return !o;
              });
              setOpenMenu(null);
            }}>
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
          title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}>
            {theme === 'dark' ?
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> :

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            }
          </button>
            <button className="btn btn-primary btn-sm" onClick={() => { window.openPharmContact?.(); setOpenMenu(null); }}>
            {t('contacts')} <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <div className={`mega-overlay ${openMenu ? 'open' : ''}`}
      onMouseEnter={() => open(openMenu)}
      onMouseLeave={scheduleClose}>
        {openMenu && megaConfig[openMenu] &&
        <div className="container mega-inner">
            <div className="mega-left">
              <h3>{megaConfig[openMenu].title}</h3>
              <ul className="mega-links">
                {megaConfig[openMenu].links.map((l, i) => {
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
                <div className="mf-tag">{megaConfig[openMenu].featured.tag}</div>
                <div className="mf-title">{megaConfig[openMenu].featured.title}</div>
                <div className="mf-desc">{megaConfig[openMenu].featured.desc}</div>
              </div>
              <div className={`mf-art${featured?.artImg ? ' mf-art--photo' : ''}`}>
                {featured?.artImg
                  ? <img src={featured.artImg} alt={featured.artAlt || ''} className="mf-art-img" decoding="async" />
                  : ArtTag ? <ArtTag /> : null}
              </div>
            </div>
          </div>
        }
      </div>

      <div
        className={`mobile-nav-backdrop ${mobileNavOpen ? 'open' : ''}`}
        aria-hidden="true"
        onClick={closeMobileNav}
      />
      <nav id="mobile-nav"
        className={`mobile-nav-sheet ${mobileNavOpen ? 'open' : ''}`}
        role="navigation"
        aria-label={t('navAria')}>
        {navItems.map((item) => {
          const mega = megaConfig[item.id];
          const expanded = mobileExpanded === item.id;
          return (
            <div key={item.id} className={`mobile-nav-group${expanded ? ' is-expanded' : ''}`}>
              <div className={`mobile-nav-row${expanded ? ' is-expanded' : ''}`}>
                <button
                  type="button"
                  className="mobile-nav-link"
                  onClick={() => goMobile(item.id)}>
                  <span className="mobile-nav-link-label">{item.label}</span>
                </button>
                {mega ?
                  <button
                    type="button"
                    className={`mobile-nav-expand${expanded ? ' expanded' : ''}`}
                    aria-expanded={expanded}
                    aria-label={expanded ? `${item.label}: свернуть подразделы` : `${item.label}: подразделы`}
                    onClick={() => setMobileExpanded(expanded ? null : item.id)}>
                    <span className="mobile-nav-chevron" aria-hidden="true">›</span>
                  </button> :
                  null}
              </div>
              {expanded && mega &&
                <div className="mobile-nav-panel">
                  <p className="mobile-nav-panel-title">{mega.title}</p>
                  <ul className="mobile-nav-sublinks">
                    {mega.links.map((l, i) => {
                      const label = typeof l === 'string' ? l : l.label;
                      const to = typeof l === 'string' ? item.id : l.to;
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            className="mobile-nav-sublink"
                            onClick={() => goMobile(to)}>
                            {label}
                          </button>
                        </li>);
                    })}
                  </ul>
                </div>
              }
            </div>);
        })}
      </nav>
    </header>);

}

function FooterSocialLinks({ lang }) {
  const c = 'footer-social-link';
  const socialAria = window.tUI ? window.tUI('socialAria', lang) : 'Социальные сети ФармКонсилиума';
  return (
    <div className="footer-social" role="navigation" aria-label={socialAria}>
      <a href="https://t.me/PharmConsilium"
        className={c}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ФармКонсилиум в Telegram">
        <img src="assets/icon-telegram.svg" width="28" height="28" decoding="async" alt="" aria-hidden="true" />
      </a>
      <a href="https://www.pinterest.com/pharmconsilium/"
        className={c}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ФармКонсилиум на Pinterest">
        <img src="assets/icon-pinterest.png" width="28" height="28" decoding="async" alt="" aria-hidden="true" />
      </a>
      <a href="https://www.instagram.com/pharmconsilium/"
        className={c}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ФармКонсилиум в Instagram">
        <img src="assets/icon-instagram.svg" width="28" height="28" decoding="async" alt="" aria-hidden="true" />
      </a>
      <a href="https://www.youtube.com/channel/UCLjkMonolXAtMYPOAi1dlGQ"
        className={c}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ФармКонсилиум на YouTube">
        <img src="assets/icon-youtube.svg" width="28" height="28" decoding="async" alt="" aria-hidden="true" />
      </a>
    </div>
  );

}

function Footer({ navigate, lang }) {
  const navItems = window.getSiteNav ? window.getSiteNav(lang) : NAV_ITEMS;
  const fc = window.getFooterCopy ? window.getFooterCopy(lang) : null;
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const isEn = lang === 'en' && fc;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand" style={{ cursor: 'default' }}>
              <img src="assets/logo.svg" alt={t('brandAlt')} className="brand-logo" />
            </div>
            <div className="footer-tag">
              {isEn ? fc.tagline : 'IT-решения'}<br />
              <span className="accent">{isEn ? fc.taglineAccent : 'для лечения доверия'}</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{isEn ? fc.copyright : '© 2026 ФармКонсилиум · РБ'}</div>
            <FooterSocialLinks lang={lang} />
          </div>
          <div className="footer-col">
            <h4>{isEn ? fc.sections : 'Разделы'}</h4>
            <ul>
              {navItems.slice(0, 5).map((n) =>
              <li key={n.id} onClick={() => navigate(n.id)}>{n.label}</li>
              )}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{isEn ? fc.company : 'Компания'}</h4>
            <ul>
              {isEn ?
                fc.companyLinks.map((item, i) =>
                  <li key={i} onClick={item.to ? () => navigate(item.to) : undefined} style={item.to ? undefined : { cursor: 'default' }}>{item.label}</li>
                ) :
                <>
                  <li onClick={() => navigate('team')}>Команда</li>
                  <li>Проекты</li>
                  <li>События</li>
                  <li>Карьера</li>
                  <li>Пресс-кит</li>
                </>
              }
            </ul>
          </div>
          <div className="footer-col">
            <h4>{isEn ? fc.contacts : 'Контакты'}</h4>
            <ul>
              <li style={{ color: 'var(--ink)' }}>
                <a href="tel:+375293220018" style={{ color: 'inherit', textDecoration: 'none' }}>+375 (29) 322-00-18</a>
              </li>
              <li style={{ color: 'var(--ink)' }}>
                <a href="tel:+375152685050" style={{ color: 'inherit', textDecoration: 'none' }}>+375 (15) 268-50-50</a>
              </li>
              <li>
                <a href="mailto:pharmconsilium@gmail.com" style={{ color: 'inherit' }}>pharmconsilium@gmail.com</a>
              </li>
              <li>
                <a href="mailto:pharmconsilium.office@gmail.com" style={{ color: 'inherit' }}>pharmconsilium.office@gmail.com</a>
              </li>
              <li style={{ lineHeight: 1.45, cursor: 'default' }}>Беларусь, 230025, г. Гродно,<br />площадь Советская 2А, офис 26</li>
              <li style={{ cursor: 'default' }}>{isEn ? fc.hours : 'пн - пт , 09:00 - 19:00'}</li>
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <div>{isEn ? fc.unp : 'УНП 591019395'}</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <span
              role="link"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('privacy')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('privacy'); } }}
            >
              {isEn ? fc.privacy : 'Политика конфиденциальности'}
            </span>
            <span>{isEn ? fc.terms : 'Соглашение'}</span>
          </div>
        </div>
      </div>
    </footer>);

}

window.Header = Header;
window.Footer = Footer;
window.NAV_ITEMS = NAV_ITEMS;
window.MEGA = MEGA;