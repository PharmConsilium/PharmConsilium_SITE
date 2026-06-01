// Post-mount lazy scripts (forecast chart, robot). Used after bundle or pharm-boot core.
(function () {
  var CACHE_BUST = window.PHARM_CACHE_BUST || '20260531c';
  var isDevHost = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname)
    || location.protocol === 'file:'
    || /(?:\?|&)nocache(?:=|&|$)/.test(location.search);

  var DEFERRED = [
    'js/components/forecast-chart.jsx',
    'js/components/robot.jsx',
  ];

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

  window.pharmBootDeferred = function pharmBootDeferred(opts) {
    opts = opts || {};
    var robotIdle = opts.robotIdle !== false;
    var paths = DEFERRED.slice();

    function runPaths(list) {
      return Promise.all(list.map(fetchOne)).then(function (sources) {
        for (var i = 0; i < list.length; i++) {
          compileAndRun(list[i], sources[i]);
          if (list[i].indexOf('forecast-chart') >= 0) dispatchReady('forecast-chart');
          if (list[i].indexOf('robot.jsx') >= 0) dispatchReady('robot');
        }
      });
    }

    function loadForecast() {
      return runPaths(['js/components/forecast-chart.jsx']);
    }

    function loadRobot() {
      return runPaths(['js/components/robot.jsx']);
    }

    if (window.ForecastChart && window.RobotCompanion) return Promise.resolve();

    var forecastP = window.ForecastChart
      ? Promise.resolve()
      : loadForecast();

    return forecastP.then(function () {
      if (window.RobotCompanion) return;
      if (!robotIdle) return loadRobot();
      var start = function () { loadRobot(); };
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(start, { timeout: 2800 });
      } else {
        setTimeout(start, 600);
      }
    });
  };

  window.pharmLoadScript = function pharmLoadScript(path) {
    return fetchOne(path).then(function (code) {
      compileAndRun(path, code);
    });
  };
})();
