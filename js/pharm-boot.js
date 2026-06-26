// Boot: parallel fetch + optional Babel cache; core scripts then mount; forecast chart via pharm-deferred.js
(function () {
  window.PHARM_CACHE_BUST = window.PHARM_CACHE_BUST || '20260602';
  var CACHE_BUST = window.PHARM_CACHE_BUST;
  var CACHE_PREFIX = 'pharm:jsx:' + CACHE_BUST + ':';
  var isDevHost = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname)
    || location.protocol === 'file:'
    || /(?:\?|&)nocache(?:=|&|$)/.test(location.search);

  var CORE_SCRIPTS = [
    'js/components/tweaks-panel.jsx',
    'js/components/illustrations.jsx',
    'js/components/header-footer.jsx',
    'js/pages/pages.jsx',
    'js/pages/privacy-page.jsx',
    'js/data/digital-rep-sections.js',
    'js/data/subpages-data.jsx',
    'js/data/section-cards.jsx',
    'js/data/portfolio-data.jsx',
    'js/data/i18n.jsx',
    'js/data/seo-meta.jsx',
    'js/components/portfolio-video.jsx',
    'js/components/detail-page.jsx',
    'js/pages/portfolio-pages.jsx',
    'js/data/robot-hints.js',
    'js/components/robbie-face-cycle.jsx',
    'js/components/robot.jsx',
    'js/pharm-form-api.js',
    'js/components/contact-modal.jsx',
    'js/components/forecast-modal.jsx',
    'js/components/contact-strip.jsx',
    'js/core/app.jsx',
  ];

  function scriptUrl(path) {
    return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'v=' + CACHE_BUST;
  }

  function readCache(path) {
    if (isDevHost) return null;
    try {
      return sessionStorage.getItem(CACHE_PREFIX + path);
    } catch (e) {
      return null;
    }
  }

  function writeCache(path, code) {
    if (isDevHost) return;
    try {
      sessionStorage.setItem(CACHE_PREFIX + path, code);
    } catch (e) { /* quota */ }
  }

  function compile(path, source) {
    if (!path.endsWith('.jsx')) return source;
    var cached = readCache(path);
    if (cached) return cached;
    if (!window.Babel) throw new Error('Babel missing');
    var out = window.Babel.transform(source, {
      presets: ['env', 'react'],
      filename: path,
    }).code;
    writeCache(path, out);
    return out;
  }

  function runCode(code) {
    var tag = document.createElement('script');
    tag.text = code;
    document.body.appendChild(tag);
  }

  function fetchOne(path) {
    var opts = isDevHost ? { cache: 'no-store' } : undefined;
    return fetch(scriptUrl(path), opts).then(function (res) {
      if (!res.ok) throw new Error(path + ' HTTP ' + res.status);
      return res.text();
    });
  }

  function loadCore() {
    return Promise.all(CORE_SCRIPTS.map(fetchOne)).then(function (sources) {
      for (var i = 0; i < CORE_SCRIPTS.length; i++) {
        runCode(compile(CORE_SCRIPTS[i], sources[i]));
      }
    });
  }

  function afterMount() {
    if (window.pharmBootDeferred) {
      window.pharmBootDeferred();
    }
  }

  function start() {
    if (!window.React || !window.ReactDOM) {
      console.error('[pharm-boot] React missing');
      return;
    }
    if (!window.Babel) {
      console.error('[pharm-boot] Babel missing (use bundle or load babel standalone)');
      return;
    }
    loadCore()
      .then(function () {
        if (window.mountPharmApp) window.mountPharmApp();
        else console.error('[pharm-boot] mountPharmApp not found');
        afterMount();
      })
      .catch(function (err) {
        console.error('[pharm-boot]', err);
        if (window.pharmShowBootError) {
          window.pharmShowBootError('Ошибка загрузки скриптов: ' + (err && err.message ? err.message : err));
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
