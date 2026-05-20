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

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('home');
  const [lang, setLang] = React.useState('ru');
  const [scenario, setScenario] = React.useState('comms');
  const [contactOpen, setContactOpen] = React.useState(false);
  const ContactFormModal = window.ContactFormModal;
  const EndContactStrip = window.EndContactStrip;

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
    // softer accent derived from accent
    const soft = `${t.accent}26`;
    root.style.setProperty('--accent-soft', soft);
    root.style.setProperty('--accent-glow', `${t.accent}40`);
    const fp = FONT_PAIRS[t.fontPair] || FONT_PAIRS['unbounded-manrope'];
    root.style.setProperty('--font-display', fp.display);
    root.style.setProperty('--font-body', fp.body);
  }, [t]);

  // Track route in hash so reloads land back
  React.useEffect(() => {
    const h = location.hash.replace('#', '');
    if (h) setRoute(h);
  }, []);
  React.useEffect(() => {
    location.hash = route;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.updatePageSeo) window.updatePageSeo(route);
  }, [route]);

  const navigate = (r) => setRoute(r);

  // Route can be "section" or "section/sub". Detail page for the latter.
  let page;
  if (route === 'portfolio') {
    page = <PortfolioPage navigate={navigate}/>;
  } else if (route.startsWith('portfolio/')) {
    page = <ProjectPage slug={route.split('/')[1]} navigate={navigate}/>;
  } else if (route.includes('/')) {
    page = <DetailPage routeId={route} navigate={navigate}/>;
  } else {
    switch (route) {
      case 'marketing': page = <MarketingPage navigate={navigate}/>; break;
      case 'hcp':       page = <HcpPage navigate={navigate}/>; break;
      case 'sales':     page = <SalesPage navigate={navigate}/>; break;
      case 'content':   page = <ContentPage navigate={navigate}/>; break;
      case 'directory': page = <DirectoryPage navigate={navigate}/>; break;
      case 'team':      page = <TeamPage navigate={navigate}/>; break;
      default:          page = <HomePage navigate={navigate} scenario={scenario} setScenario={setScenario}/>;
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

      {ContactFormModal && <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />}

      {page}

      {EndContactStrip ? <EndContactStrip /> : null}

      {t.robot !== false && <RobotCompanion/>}

      <Footer navigate={navigate}/>

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
