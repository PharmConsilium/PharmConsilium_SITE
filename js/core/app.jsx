// Main app: routing, theme, tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "#6E4BFF",
  "fontPair": "unbounded-manrope",
  "density": "regular",
  "robot": true
}/*EDITMODE-END*/;

const FONT_PAIRS = {
  'unbounded-manrope': { display: "'Unbounded', system-ui, sans-serif",   body: "'Manrope', system-ui, sans-serif" },
  'geist-inter':       { display: "'Geist', system-ui, sans-serif",        body: "'Inter Tight', system-ui, sans-serif" },
  'space-mono':        { display: "'Space Grotesk', system-ui, sans-serif", body: "'IBM Plex Sans', system-ui, sans-serif" },
  'serif-mod':         { display: "'Fraunces', Georgia, serif",             body: "'Manrope', system-ui, sans-serif" },
};

function normalizeRoute(raw) {
  const h = String(raw || '').replace(/^#\/?/, '').trim();
  const noLeading = h.replace(/^\/+/, '');
  const noTrailing = noLeading.replace(/\/+$/, '');
  // Avoid treating the file itself as a route.
  const r = noTrailing.replace(/^index\.html$/i, '');
  return r || 'home';
}

/** Legacy pathname/hash → canonical route id (SUBPAGES key).
 *  SUBPAGES keys are authoritative; aliases only map inbound legacy URLs.
 *  healthcare/patient-mobileapps and outsourcing/share-of-voice stay separate pages (not aliased). */
const ROUTE_ALIASES = {
  marketing: 'pharma-marketing',
  hcp: 'healthcare',
  sales: 'outsourcing-medpredov',
  content: 'design',
  directory: 'FarmConsilium-drug-reference-book',
  'drug-directory': 'FarmConsilium-drug-reference-book',
  team: 'about',
  // Final top-level slugs
  // Canonical outsourcing section slug
  outsourcing: 'outsourcing-medpredov',
  'outsourcing-medpredov': 'outsourcing-medpredov',
  'FarmConsilium-drug-reference-book': 'FarmConsilium-drug-reference-book',
  'marketing/crm': 'pharma-marketing/crm',
  'marketing/clm': 'pharma-marketing/clm',
  'marketing/2clm': 'pharma-marketing/2clm',
  'marketing/chatbot': 'pharma-marketing/chatbot-teleapp-Telegram',
  'marketing/web': 'pharma-marketing/web-development',
  'marketing/mobile': 'pharma-marketing/mobileapps-development',
  'marketing/events': 'pharma-marketing/event-support',
  'marketing/ai': 'pharma-marketing/temy-treningov-dlya-medpredov',
  'hcp/ai-recom': 'healthcare/hcp-education-platforms',
  // Accept user-provided mixed/cyrillic variant
  'healthcare/НCP-education-platforms': 'healthcare/hcp-education-platforms',
  'hcp/education': 'healthcare/patient-support',
  'hcp/chatbot': 'healthcare/medical-chatbots',
  'hcp/mobile': 'pharma-marketing/mobileapps-development',
  'hcp/ai-healthcare': 'healthcare/research-platforms',
  'hcp/psp': 'healthcare/rwe-analytics',
  'sales/digital-rep': 'outsourcing/digitalmedrep',
  'sales/omnichannel': 'outsourcing/medrep-omnichannel',
  'sales/launch': 'outsourcing/launch-outsourcing',
  'sales/analytics': 'outsourcing/medrep-omnichannel',
  'content/medical': 'design/clm-presentations',
  'content/edetailing': 'design/clm-presentations',
  'design/edetailing': 'design/clm-presentations',
  'content/patient': 'healthcare/patient-support',
  'design/patient-content': 'healthcare/patient-support',
  'content/video': 'design/hcp-video',
  'design/healthcare-video': 'design/hcp-video',
  'content/presentations': 'design/brand-packaging',
  'content/advertising': 'design/ai-content',
  'content/gamification': 'design/games-quizzes',
  'content/psp': 'healthcare/rwe-analytics',
  'design/psp-content': 'healthcare/rwe-analytics',
  // Final service slugs
  'pharma-marketing/chatbot-teleapp': 'pharma-marketing/chatbot-teleapp-Telegram',
  'pharma-marketing/mobile-apps': 'pharma-marketing/mobileapps-development',
  'pharma-marketing/rep-training': 'pharma-marketing/temy-treningov-dlya-medpredov',
  'healthcare/education-platforms': 'healthcare/hcp-education-platforms',
  'healthcare/mobile-apps': 'pharma-marketing/mobileapps-development',
  'outsourcing/digital-rep': 'outsourcing/digitalmedrep',
  'outsourcing/omnichannel': 'outsourcing/medrep-omnichannel',
  'design/clm-presentations-making': 'design/clm-presentations',
  'design/brandbook-desingpackaging': 'design/brand-packaging',
  'design/ai-medcontent': 'design/ai-content',
  'design/medgames-clinicalsquizzes': 'design/games-quizzes',
  // Team pages (final)
  'team/events': 'pharma-marketing/event-support',
  'about/events': 'pharma-marketing/event-support',
  'team/career': 'about',
  'about/careers': 'about',
  'portfolio/cardio-lonch': 'portfolio/OTCadvertising-banner',
  'portfolio/ai-trener': 'portfolio/brandbook-pharma',
  'portfolio/patient-series': 'portfolio/supplement-packaging',
  'portfolio/directory-launch': 'portfolio/Case-infographic-drug',
  'portfolio/portfolio-draft-1': 'portfolio/CLMpresentations-for-medreps',
  'portfolio/portfolio-draft-2': 'portfolio/clinical-training-neurology',
  'portfolio/portfolio-draft-3': 'portfolio/gamification-education-HCP',
  'portfolio/portfolio-draft-4': 'portfolio/hcp-reels-avatar',
  'portfolio/portfolio-draft-5': 'portfolio/OTCadvertising-banner-How-to-make',
  'portfolio/portfolio-draft-6': 'portfolio/bot-pharma-digitalmarketing',
  'portfolio/portfolio-draft-7': 'portfolio/How-to-make-a-game-for-HCP',
  // Portfolio: legacy → final slugs
  'portfolio/bepanten-banner': 'portfolio/OTCadvertising-banner',
  'portfolio/meditatio-night-brand': 'portfolio/brandbook-pharma',
  'portfolio/conference-pk25': 'portfolio/HCP-videoreels',
  'portfolio/omni-rebranding': 'portfolio/OL-medical-video',
  'portfolio/psp-platform': 'portfolio/CLM-presentacii-eto',
  'portfolio/clm-veeva': 'portfolio/clinical-training-HCP',
  'portfolio/drug-directory-launch': 'portfolio/Case-infographic-drug',
  'portfolio/clm-mobile-app': 'portfolio/CLMpresentations-for-medreps',
  'portfolio/stroke-exam': 'portfolio/clinical-training-neurology',
  'portfolio/hcp-tic-tac-toe': 'portfolio/gamification-education-HCP',
  'portfolio/hcp-videovisit': 'portfolio/hcp-reels-avatar',
  'portfolio/bepanten-ad-layouts': 'portfolio/OTCadvertising-banner-How-to-make',
  'portfolio/bayer-club-teleapp': 'portfolio/bot-pharma-digitalmarketing',
  'portfolio/grandaxin-game': 'portfolio/How-to-make-a-game-for-HCP',
};

function resolveCanonicalRoute(raw) {
  const r = normalizeRoute(raw);
  return ROUTE_ALIASES[r] || r;
}

function syncCanonicalUrl(route) {
  const canonical = resolveCanonicalRoute(route);
  const path = pathForRoute(canonical);
  if (window.location.pathname !== path) {
    window.history.replaceState(null, '', path + window.location.search);
  }
  return canonical;
}

function getHashRoute() {
  const raw = String(window.location.hash || '').trim();
  const norm = normalizeRoute(raw);
  return raw ? norm : null;
}

function routeFromPathname(pathname) {
  const raw = String(pathname || '/');
  const clean = raw.split('?')[0].split('#')[0];
  return normalizeRoute(clean.replace(/^\//, ''));
}

function pathForRoute(route) {
  const r = normalizeRoute(route);
  return r === 'home' ? '/' : `/${r}`;
}

function dispatchRouteChange(route, kind) {
  window.dispatchEvent(new CustomEvent('pharm:routechange', { detail: { route, kind: kind || 'push' } }));
}

function portfolioSlugFromRoute(route) {
  const r = normalizeRoute(route);
  if (!r.startsWith('portfolio/')) return null;
  return r.slice('portfolio/'.length).split('/')[0] || null;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [themeMode, setThemeMode] = React.useState(() => (
    window.pharmTheme ? window.pharmTheme.getMode() : 'system'
  ));
  const [systemDark, setSystemDark] = React.useState(() => (
    window.pharmTheme ? window.pharmTheme.getSystemDark() : false
  ));
  const isDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
  const [route, setRoute] = React.useState(() => {
    const h = getHashRoute();
    const raw = h || routeFromPathname(window.location.pathname);
    return resolveCanonicalRoute(raw);
  });
  const [lang, setLangState] = React.useState('ru');
  const [langTick, setLangTick] = React.useState(0);
  const [scenario, setScenario] = React.useState('comms');
  const [contactOpen, setContactOpen] = React.useState(false);
  const [forecastOpen, setForecastOpen] = React.useState(false);
  const [forecastTopic, setForecastTopic] = React.useState('');
  const ContactFormModal = window.ContactFormModal;
  const ForecastRequestModal = window.ForecastRequestModal;
  const EndContactStrip = window.EndContactStrip;
  const hideTweaks = Boolean(window.PHARM_HIDE_TWEAKS);
  const [robotReady, setRobotReady] = React.useState(() => Boolean(window.RobotCompanion));

  React.useEffect(() => {
    if (window.RobotCompanion) {
      setRobotReady(true);
      return undefined;
    }
    function onDeferred(ev) {
      if (ev.detail && ev.detail.name === 'robot') setRobotReady(true);
    }
    window.addEventListener('pharm:deferred-ready', onDeferred);
    return () => window.removeEventListener('pharm:deferred-ready', onDeferred);
  }, []);
  const scrollByRoute = React.useRef({});
  const navKind = React.useRef('push');
  const routeRef = React.useRef(route);
  const prevRouteRef = React.useRef(route);
  routeRef.current = route;

  const setLang = React.useCallback((next) => {
    const applied = window.applySiteLang ? window.applySiteLang(next) : next;
    setLangState(applied);
    setLangTick((n) => n + 1);
  }, []);

  React.useLayoutEffect(() => {
    const initial = window.getSiteLang ? window.getSiteLang() : 'ru';
    const applied = window.applySiteLang ? window.applySiteLang(initial) : initial;
    setLangState(applied);
    setLangTick((n) => n + 1);
  }, []);

  React.useLayoutEffect(() => {
    window.openPharmContact = () => {
      if (window.pharmTrackEvent) window.pharmTrackEvent('contacts_click', { event_category: 'engagement' });
      try {
        window.dispatchEvent(new CustomEvent('pharm:robot-contact'));
      } catch (e) { /* ignore */ }
      setContactOpen(true);
    };
    return () => {
      delete window.openPharmContact;
    };
  }, []);

  React.useLayoutEffect(() => {
    window.openPharmForecast = (topic) => {
      setForecastTopic(String(topic || '').trim());
      setForecastOpen(true);
    };
    return () => {
      delete window.openPharmForecast;
    };
  }, []);

  React.useEffect(() => {
    if (!window.pharmTheme || !window.pharmTheme.subscribeSystem) return undefined;
    return window.pharmTheme.subscribeSystem(setSystemDark);
  }, []);

  const applyThemeMode = React.useCallback((mode) => {
    setThemeMode(mode);
    if (window.pharmTheme) window.pharmTheme.setMode(mode);
  }, []);

  // Apply theme + tweaks to :root
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDark ? 'dark' : 'light';
    root.style.setProperty('--accent', t.accent);
    const soft = `${t.accent}26`;
    root.style.setProperty('--accent-soft', soft);
    root.style.setProperty('--accent-glow', `${t.accent}40`);
    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS['unbounded-manrope'];
    root.style.setProperty('--font-display', fp.display);
    root.style.setProperty('--font-body', fp.body);
  }, [t, isDark]);

  React.useLayoutEffect(() => {
    const h = getHashRoute();
    const raw = h || routeFromPathname(window.location.pathname);
    const canonical = syncCanonicalUrl(raw);
    navKind.current = 'pop';
    if (canonical !== routeRef.current) setRoute(canonical);
    dispatchRouteChange(canonical, 'replace');
  }, []);

  React.useEffect(() => {
    const onPopState = () => {
      const next = syncCanonicalUrl(routeFromPathname(window.location.pathname));
      navKind.current = 'pop';
      setRoute(next);
      dispatchRouteChange(next, 'pop');
    };
    const onHashChange = () => {
      const h = getHashRoute();
      if (!h) return;
      const canonical = syncCanonicalUrl(h);
      navKind.current = 'pop';
      setRoute(canonical);
      dispatchRouteChange(canonical, 'replace');
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  React.useEffect(() => {
    let tick;
    const routeChanged = prevRouteRef.current !== route;
    prevRouteRef.current = route;

    if (routeChanged) {
      if (navKind.current === 'pop') {
        const y = scrollByRoute.current[route];
        tick = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: typeof y === 'number' ? y : 0, left: 0, behavior: 'instant' });
          });
        });
      } else {
        let pendingAnchorScroll = false;
        try {
          pendingAnchorScroll = !!(
            (window.DIRECTORY_SCROLL_KEY && sessionStorage.getItem(window.DIRECTORY_SCROLL_KEY)) ||
            (window.TEAM_SCROLL_KEY && sessionStorage.getItem(window.TEAM_SCROLL_KEY))
          );
        } catch (e) { /* ignore */ }
        if (!pendingAnchorScroll) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }
      navKind.current = 'push';
    }

    if (window.updatePageSeo) window.updatePageSeo(route, lang);
    if (routeChanged && window.pharmTrackPageView) window.pharmTrackPageView(route);

    return () => {
      if (tick) cancelAnimationFrame(tick);
    };
  }, [route, lang, langTick]);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scrollByRoute.current[routeRef.current] = window.scrollY;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [route]);

  const navigate = React.useCallback((nextRoute) => {
    const r = resolveCanonicalRoute(nextRoute);
    scrollByRoute.current[routeRef.current] = window.scrollY;
    navKind.current = 'push';
    setRoute(r);
    const nextPath = pathForRoute(r);
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath + window.location.search);
    }
    dispatchRouteChange(r, 'push');
  }, []);
  React.useEffect(() => {
    // Allow deep components (e.g. modal) to navigate without props.
    window.pharmNavigate = navigate;
    return () => { delete window.pharmNavigate; };
  }, [navigate]);
  const pageKey = `${route}-${lang}-${langTick}`;

  const PortfolioPageCmp = window.PortfolioPage;
  const ProjectPageCmp = window.ProjectPage;
  const PrivacyPageCmp = window.PrivacyPage;

  let page;
  if (route === 'portfolio') {
    page = PortfolioPageCmp
      ? <PortfolioPageCmp key={pageKey} navigate={navigate} lang={lang}/>
      : null;
  } else if (route.startsWith('portfolio/')) {
    const slug = portfolioSlugFromRoute(route);
    page = ProjectPageCmp
      ? <ProjectPageCmp key={pageKey} slug={slug} navigate={navigate} lang={lang}/>
      : null;
  } else if (route.includes('/')) {
    page = <DetailPage key={pageKey} routeId={route} navigate={navigate} lang={lang}/>;
  } else {
    switch (route) {
      case 'pharma-marketing': page = <MarketingPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'healthcare':       page = <HcpPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'outsourcing':     page = <SalesPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'outsourcing-medpredov': page = <SalesPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'design':          page = <ContentPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'drug-directory':  page = <DirectoryPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'FarmConsilium-drug-reference-book': page = <DirectoryPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'about':           page = <TeamPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'privacy':
        page = PrivacyPageCmp
          ? <PrivacyPageCmp key={pageKey} navigate={navigate} lang={lang}/>
          : null;
        break;
      default:          page = <HomePage key={pageKey} navigate={navigate} scenario={scenario} setScenario={setScenario} lang={lang}/>;
    }
  }

  return (
    <div data-screen-label={`ФармКонсилиум · ${route}`}>
      <Header
        route={route}
        navigate={navigate}
        lang={lang}
        setLang={setLang}
        theme={isDark ? 'dark' : 'light'}
        themeMode={themeMode}
        setTheme={(v) => applyThemeMode(v === 'dark' ? 'dark' : 'light')}
        onThemeFollowSystem={() => applyThemeMode('system')}
      />

      {ContactFormModal && <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />}
      {ForecastRequestModal && (
        <ForecastRequestModal
          open={forecastOpen}
          onClose={() => setForecastOpen(false)}
          lang={lang}
          presetTopic={forecastTopic}
        />
      )}

      {page}

      {EndContactStrip && route !== 'FarmConsilium-drug-reference-book' && route !== 'about' ? <EndContactStrip lang={lang} /> : null}

      {t.robot !== false && robotReady && window.RobotCompanion ? <RobotCompanion/> : null}

      <Footer navigate={navigate} lang={lang}/>

      {!hideTweaks ? <TweaksPanel title="Tweaks · ФармКонсилиум">
        <TweakSection label="Тема"/>
        <TweakSelect  label="Режим темы" value={themeMode}
                      options={[
                        { value: 'system', label: 'Как в системе' },
                        { value: 'light', label: 'Светлая' },
                        { value: 'dark', label: 'Тёмная' },
                      ]}
                      onChange={(v) => applyThemeMode(v)}/>
        <TweakColor   label="Акцент"      value={t.accent}
                      options={['#6E4BFF', '#00B4D8', '#2A4FE3', '#0A6CFF', '#1F8A5B']}
                      onChange={(v)=>setTweak('accent', v)}/>
        <TweakSection label="Типографика"/>
        <TweakSelect  label="Шрифтовая пара" value={t.fontPair}
                      options={[
                        { value:'unbounded-manrope', label:'Unbounded · Manrope' },
                        { value:'geist-inter',       label:'Geist · Inter Tight' },
                        { value:'space-mono',        label:'Space Grotesk · IBM Plex' },
                        { value:'serif-mod',         label:'Fraunces · Manrope'      },
                      ]}
                      onChange={(v)=>setTweak('fontPair', v)}/>
        <TweakSection label="Сцена прогноза"/>
        <TweakRadio   label="Сценарий" value={scenario}
                      options={[
                        { value:'organic', label:'Органика' },
                        { value:'comms',   label:'Комм.'    },
                        { value:'launch',  label:'Лонч'     },
                      ]}
                      onChange={(v)=>setScenario(v)}/>
        <TweakSection label="Компаньон"/>
        <TweakToggle  label="3D-робот" value={t.robot !== false} onChange={(v)=>setTweak('robot', v)}/>
      </TweaksPanel> : null}
    </div>
  );
}

window.App = App;
window.mountPharmApp = function mountPharmApp() {
  const el = document.getElementById('root');
  if (!el) return;
  if (!window.__pharmReactRoot) {
    window.__pharmReactRoot = ReactDOM.createRoot(el);
  }
  window.__pharmReactRoot.render(<App />);
};
