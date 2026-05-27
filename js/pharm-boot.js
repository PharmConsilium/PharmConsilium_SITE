// Sequential Babel loader — scripts run in order (fixes portfolio ProjectPage).
(function () {
  var scrollLockCount = 0;

  window.lockPageScroll = function lockPageScroll() {
    scrollLockCount += 1;
    if (scrollLockCount > 1) return;
    document.body.classList.add('is-scroll-locked');
  };

  window.unlockPageScroll = function unlockPageScroll() {
    if (scrollLockCount <= 0) return;
    scrollLockCount -= 1;
    if (scrollLockCount > 0) return;
    document.body.classList.remove('is-scroll-locked');
  };

  var CACHE_BUST = '20260526c';

  var BABEL_SCRIPTS = [
    'js/components/tweaks-panel.jsx',
    'js/components/illustrations.jsx',
    'js/components/forecast-chart.jsx',
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
    'js/components/robbie-face-cycle.jsx',
    'js/components/robot.jsx',
    'js/components/contact-modal.jsx',
    'js/components/contact-strip.jsx',
    'js/core/app.jsx',
  ];

  function scriptUrl(path) {
    return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'v=' + CACHE_BUST;
  }

  function runScript(url) {
    return fetch(scriptUrl(url)).then(function (res) {
      if (!res.ok) throw new Error(url + ' HTTP ' + res.status);
      return res.text();
    }).then(function (code) {
      var out = Babel.transform(code, {
        presets: ['env', 'react'],
        filename: url,
      }).code;
      var tag = document.createElement('script');
      tag.text = out;
      document.body.appendChild(tag);
    });
  }

  function runAll(i, done) {
    if (i >= BABEL_SCRIPTS.length) {
      done();
      return;
    }
    runScript(BABEL_SCRIPTS[i])
      .then(function () { runAll(i + 1, done); })
      .catch(function (err) {
        console.error('[pharm-boot]', BABEL_SCRIPTS[i], err);
        runAll(i + 1, done);
      });
  }

  function start() {
    if (!window.Babel || !window.React || !window.ReactDOM) {
      console.error('[pharm-boot] React or Babel missing');
      return;
    }
    runAll(0, function () {
      if (window.mountPharmApp) {
        window.mountPharmApp();
      } else {
        console.error('[pharm-boot] mountPharmApp not found');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
