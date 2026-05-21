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

function getRouteFromHash() {
  const h = window.location.hash.replace(/^#/, '').trim();
  return h || 'home';
}

function hashForRoute(route) {
  return `#${route || 'home'}`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(getRouteFromHash);
  const [lang, setLangState] = React.useState('ru');
  const [langTick, setLangTick] = React.useState(0);
  const [scenario, setScenario] = React.useState('comms');
  const [contactOpen, setContactOpen] = React.useState(false);
  const ContactFormModal = window.ContactFormModal;
  const EndContactStrip = window.EndContactStrip;
  const scrollByRoute = React.useRef({});
  const navKind = React.useRef('push');
  const ignoreHashChange = React.useRef(false);
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
    window.openPharmContact = () => setContactOpen(true);
    return () => {
      delete window.openPharmContact;
    };
  }, []);

  // Apply theme + tweaks to :root
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = t.dark ? 'dark' : 'light';
    root.style.setProperty('--accent', t.accent);
    const soft = `${t.accent}26`;
    root.style.setProperty('--accent-soft', soft);
    root.style.setProperty('--accent-glow', `${t.accent}40`);
    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS['unbounded-manrope'];
    root.style.setProperty('--font-display', fp.display);
    root.style.setProperty('--font-body', fp.body);
  }, [t]);

  React.useLayoutEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', hashForRoute('home'));
    }
  }, []);

  React.useEffect(() => {
    const onHashChange = () => {
      const next = getRouteFromHash();
      if (ignoreHashChange.current) {
        ignoreHashChange.current = false;
        if (next !== routeRef.current) setRoute(next);
        return;
      }
      navKind.current = 'pop';
      setRoute(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      navKind.current = 'push';
    }

    if (window.updatePageSeo) window.updatePageSeo(route, lang);

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
    const r = nextRoute || 'home';
    scrollByRoute.current[routeRef.current] = window.scrollY;
    navKind.current = 'push';
    setRoute(r);
    const target = hashForRoute(r);
    if (window.location.hash !== target) {
      ignoreHashChange.current = true;
      window.location.hash = r;
    }
  }, []);
  const pageKey = `${route}-${lang}-${langTick}`;

  let page;
  if (route === 'portfolio') {
    page = <PortfolioPage key={pageKey} navigate={navigate} lang={lang}/>;
  } else if (route.startsWith('portfolio/')) {
    page = <ProjectPage key={pageKey} slug={route.split('/')[1]} navigate={navigate} lang={lang}/>;
  } else if (route.includes('/')) {
    page = <DetailPage key={pageKey} routeId={route} navigate={navigate} lang={lang}/>;
  } else {
    switch (route) {
      case 'marketing': page = <MarketingPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'hcp':       page = <HcpPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'sales':     page = <SalesPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'content':   page = <ContentPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'directory': page = <DirectoryPage key={pageKey} navigate={navigate} lang={lang}/>; break;
      case 'team':      page = <TeamPage key={pageKey} navigate={navigate} lang={lang}/>; break;
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
        theme={t.dark ? 'dark' : 'light'}
        setTheme={(v) => setTweak('dark', v === 'dark')}
      />

      {ContactFormModal && <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />}

      {page}

      {EndContactStrip ? <EndContactStrip lang={lang} /> : null}

      {t.robot !== false && <RobotCompanion/>}

      <Footer navigate={navigate} lang={lang}/>

      <TweaksPanel title="Tweaks · ФармКонсилиум">
        <TweakSection label="Тема"/>
        <TweakToggle  label="Тёмная тема" value={t.dark} onChange={(v)=>setTweak('dark', v)}/>
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
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
