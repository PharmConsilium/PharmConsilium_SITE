// GA4 + Yandex Metrika helpers (SPA pageviews, goals). Counters load from index.html.
(function () {
  var YM_ID = 109560584;
  var isLocal = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname || '');
  var force = /(?:\?|&)analytics(?:=|&|$)/.test(location.search);

  function enabled() {
    return !isLocal || force;
  }

  function pathForRoute(route) {
    var r = String(route || 'home').replace(/^#\/?/, '').replace(/^\/+/, '').replace(/\/+$/, '');
    if (!r || r === 'home' || /^index\.html$/i.test(r)) return '/';
    return '/' + r;
  }

  window.pharmTrackPageView = function pharmTrackPageView(route) {
    if (!enabled()) return;
    var path = pathForRoute(route);
    var title = document.title || '';
    var loc = location.origin + path;

    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: title,
        page_location: loc,
        page_path: path,
      });
    }

    if (typeof ym === 'function') {
      ym(YM_ID, 'hit', loc, { title: title });
    }
  };

  window.pharmTrackEvent = function pharmTrackEvent(name, params) {
    if (!enabled() || !name) return;
    var p = params || {};

    if (typeof gtag === 'function') {
      gtag('event', name, p);
    }

    if (typeof ym === 'function') {
      ym(YM_ID, 'reachGoal', name, p);
    }
  };
})();
