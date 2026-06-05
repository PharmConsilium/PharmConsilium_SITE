// Print-mode app: stacks all main pages and detail subpages sequentially,
// with break-before: page between each, so the browser print dialog
// produces one document.

function PrintApp() {
  // Apply light theme + default accent for print
  React.useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.setProperty('--accent', '#6E4BFF');
    document.documentElement.style.setProperty('--accent-soft', '#EEE9FF');
    document.documentElement.style.setProperty('--accent-glow', 'rgba(110,75,255,.18)');
    document.documentElement.style.setProperty('--font-display', "'Unbounded', system-ui, sans-serif");
    document.documentElement.style.setProperty('--font-body', "'Manrope', system-ui, sans-serif");
  }, []);

  const noop = () => {};
  const pages = [
    { id: 'home',      el: <HomePage navigate={noop} scenario="comms" setScenario={noop}/> },
    { id: 'pharma-marketing', el: <MarketingPage navigate={noop}/> },
    { id: 'healthcare',       el: <HcpPage navigate={noop}/> },
    { id: 'outsourcing-medpredov', el: <SalesPage navigate={noop}/> },
    { id: 'design',   el: <ContentPage navigate={noop}/> },
    { id: 'FarmConsilium-drug-reference-book', el: <DirectoryPage navigate={noop}/> },
    { id: 'about',      el: <TeamPage navigate={noop}/> },
  ];

  const subIds = Object.keys(window.SUBPAGES || {});

  return (
    <div className="print-doc">
      <Header route="home" navigate={noop}
              lang="ru" setLang={noop}
              theme="light" setTheme={noop}/>
      {pages.map(p => (
        <div key={p.id} className="print-page" data-page={p.id}>
          {p.el}
        </div>
      ))}
      {subIds.map(rid => (
        <div key={rid} className="print-page" data-page={rid}>
          <DetailPage routeId={rid} navigate={noop}/>
        </div>
      ))}
      <Footer navigate={noop}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp/>);

// Trigger print once fonts are ready + a short grace period for canvases / layout.
(async () => {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  await new Promise(r => setTimeout(r, 1200));
  window.print();
})();
