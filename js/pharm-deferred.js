// Post-mount lazy scripts (forecast chart). Used after bundle or pharm-boot core.
(function () {
  var CACHE_BUST = window.PHARM_CACHE_BUST || '20260602';
  var isDevHost = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname)
    || location.protocol === 'file:'
    || /(?:\?|&)nocache(?:=|&|$)/.test(location.search);

  function scriptUrl(path) {
    return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'v=' + CACHE_BUST;
  }

  function compileAndRun(path, code) {
    if (path.endsWith('.jsx')) {
      if (!window.Babel) throw new Error('Babel missing for ' + path);
      code = window.Babel.transform(code, {
        presets: ['env', 'react'],
        filename: path,
      }).code;
    }
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

  function dispatchReady(name) {
    try {
      window.dispatchEvent(new CustomEvent('pharm:deferred-ready', { detail: { name: name } }));
    } catch (e) { /* ignore */ }
  }

  window.pharmBootDeferred = function pharmBootDeferred() {
    if (window.ForecastChart) return Promise.resolve();

    return Promise.all([fetchOne('js/components/forecast-chart.jsx')]).then(function (sources) {
      compileAndRun('js/components/forecast-chart.jsx', sources[0]);
      dispatchReady('forecast-chart');
    });
  };

  window.pharmLoadScript = function pharmLoadScript(path) {
    return fetchOne(path).then(function (code) {
      compileAndRun(path, code);
    });
  };
})();
