// Theme: follow OS (default) or explicit light/dark in localStorage.
(function () {
  var KEY = 'pharm.themeMode';

  function getSystemDark() {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  }

  function getMode() {
    try {
      var m = localStorage.getItem(KEY);
      if (m === 'light' || m === 'dark' || m === 'system') return m;
    } catch (e) { /* ignore */ }
    return 'system';
  }

  function setMode(mode) {
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch (e) { /* ignore */ }
  }

  function resolveDark(mode) {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return getSystemDark();
  }

  function applyToDocument(mode) {
    document.documentElement.dataset.theme = resolveDark(mode) ? 'dark' : 'light';
  }

  function subscribeSystem(onChange) {
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var handler = function () { onChange(mq.matches); };
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else mq.addListener(handler);
      return function () {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else mq.removeListener(handler);
      };
    } catch (e) {
      return function () {};
    }
  }

  window.pharmTheme = {
    KEY: KEY,
    getMode: getMode,
    setMode: setMode,
    getSystemDark: getSystemDark,
    resolveDark: resolveDark,
    applyToDocument: applyToDocument,
    subscribeSystem: subscribeSystem,
  };
})();
