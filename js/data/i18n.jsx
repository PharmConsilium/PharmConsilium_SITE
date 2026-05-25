// i18n core: RU snapshots, EN merge for SUBPAGES/PORTFOLIO, UI strings.

const LANG_STORAGE_KEY = 'pharmconsilium-lang';

const UI_RU = {
  home: 'Главная',
  contacts: 'Контакты',
  brandAlt: 'ФармКонсилиум — IT-решения для фарм-маркетинга',
  openMenu: 'Открыть меню разделов',
  closeMenu: 'Закрыть меню разделов',
  navAria: 'Разделы сайта',
  themeLight: 'Светлая тема',
  themeDark: 'Тёмная тема',
  socialAria: 'Социальные сети ФармКонсилиума',
  notFoundCrumb: 'Страница в разработке',
  notFoundH1: 'Страница в разработке.',
  notFoundLede: 'Запрошенный подраздел скоро появится. Возвращайтесь на главную или напишите нам — расскажем подробнее.',
  notFoundBtn: 'На главную',
  detailDownload: 'Скачать описание · PDF',
  detailAbout: 'О чём это',
  detailFeatures: 'Что внутри',
  detailDeliverables: 'Что вы получаете',
  detailSteps: 'Как мы работаем',
  detailCtaH3: 'Начнём обсуждение сейчас, воспользуйтесь формой быстрой связи — кнопка «Контакты»',
  detailCtaP: '',
  detailCases: 'Кейсы · PDF',
  detailRelated: 'Вам могут понравиться эти проекты',
  siteName: 'ФармКонсилиум',
  readMore: 'Подробнее',
  discussProject: 'Обсудить проект',
  moreInfo: 'Больше информации',
  midStripAria: 'Обсудить проект',
  endStripAria: 'Дополнительная информация',
};

const UI_EN = {
  home: 'Home',
  contacts: 'Contacts',
  brandAlt: 'PharmConsilium — IT solutions for pharmaceutical marketing',
  openMenu: 'Open section menu',
  closeMenu: 'Close section menu',
  navAria: 'Site sections',
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
  socialAria: 'PharmConsilium on social media',
  notFoundCrumb: 'Page in development',
  notFoundH1: 'Page in development.',
  notFoundLede: 'This section is coming soon. Return to the home page or contact us for details.',
  notFoundBtn: 'Back to home',
  detailDownload: 'Download overview · PDF',
  detailAbout: 'Overview',
  detailFeatures: 'What\'s included',
  detailDeliverables: 'What you get',
  detailSteps: 'How we work',
  detailCtaH3: 'Let\'s start the conversation now — use the quick contact form, the Contacts button',
  detailCtaP: '',
  detailCases: 'Cases · PDF',
  detailRelated: 'You may like these projects',
  siteName: 'PharmConsilium',
  readMore: 'Learn more',
  discussProject: 'Discuss your project',
  moreInfo: 'More information',
  midStripAria: 'Discuss your project',
  endStripAria: 'More information',
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target, patch) {
  if (!patch || typeof patch !== 'object') return target;
  Object.keys(patch).forEach((key) => {
    const pv = patch[key];
    const tv = target[key];
    if (Array.isArray(pv)) {
      target[key] = pv.slice();
    } else if (pv && typeof pv === 'object' && !Array.isArray(pv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      deepMerge(tv, pv);
    } else {
      target[key] = pv;
    }
  });
  return target;
}

let SUBPAGES_RU_SNAPSHOT = null;
let PORTFOLIO_RU_SNAPSHOT = null;
let currentLang = 'ru';

function captureRuSnapshots() {
  if (window.SUBPAGES && !SUBPAGES_RU_SNAPSHOT) {
    SUBPAGES_RU_SNAPSHOT = deepClone(window.SUBPAGES);
  }
  if (window.PORTFOLIO && !PORTFOLIO_RU_SNAPSHOT) {
    PORTFOLIO_RU_SNAPSHOT = deepClone(window.PORTFOLIO);
  }
}

function ensureSnapshots() {
  captureRuSnapshots();
}

function applySubpagesLang(lang) {
  ensureSnapshots();
  if (!SUBPAGES_RU_SNAPSHOT) return;
  if (lang === 'en' && window.SUBPAGES_EN_PATCHES) {
    const merged = deepClone(SUBPAGES_RU_SNAPSHOT);
    Object.keys(window.SUBPAGES_EN_PATCHES).forEach((id) => {
      if (merged[id]) deepMerge(merged[id], window.SUBPAGES_EN_PATCHES[id]);
    });
    window.SUBPAGES = merged;
  } else {
    window.SUBPAGES = deepClone(SUBPAGES_RU_SNAPSHOT);
  }
}

function applyPortfolioLang(lang) {
  ensureSnapshots();
  if (!PORTFOLIO_RU_SNAPSHOT) return;
  if (lang === 'en' && window.PORTFOLIO_EN_PATCHES) {
    window.PORTFOLIO = PORTFOLIO_RU_SNAPSHOT.map((item) => {
      const patch = window.PORTFOLIO_EN_PATCHES[item.slug];
      if (!patch) return deepClone(item);
      return deepMerge(deepClone(item), patch);
    });
  } else {
    window.PORTFOLIO = deepClone(PORTFOLIO_RU_SNAPSHOT);
  }
}

function applySiteLang(lang) {
  const next = lang === 'en' ? 'en' : 'ru';
  currentLang = next;
  applySubpagesLang(next);
  applyPortfolioLang(next);
  try {
    if (next === 'en') localStorage.setItem(LANG_STORAGE_KEY, 'en');
    else localStorage.removeItem(LANG_STORAGE_KEY);
  } catch (e) { /* ignore */ }
  document.documentElement.lang = next;
  return next;
}

function getSiteLang() {
  try {
    if (localStorage.getItem(LANG_STORAGE_KEY) === 'en') return 'en';
  } catch (e) { /* ignore */ }
  return 'ru';
}

function tUI(key, lang) {
  const l = lang || currentLang;
  const dict = l === 'en' ? UI_EN : UI_RU;
  return dict[key] != null ? dict[key] : (UI_RU[key] || key);
}

function getSiteNav(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.nav) return window.I18N_EN.nav;
  return window.NAV_ITEMS || [];
}

function getSiteMega(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.mega) return window.I18N_EN.mega;
  return window.MEGA || {};
}

function getHomeCopy(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.home) return window.I18N_EN.home;
  return window.I18N_RU_HOME || null;
}

function getFooterCopy(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.footer) return window.I18N_EN.footer;
  return window.I18N_RU_FOOTER || null;
}

function getSectionCopy(sectionId, lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.sections?.[sectionId]) {
    return window.I18N_EN.sections[sectionId];
  }
  return null;
}

function getDirectoryCopy(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.directory) return window.I18N_EN.directory;
  return null;
}

function getTeamCopy(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.team) return window.I18N_EN.team;
  return null;
}

function getContactCopy(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.contact) return window.I18N_EN.contact;
  return null;
}

function getPortfolioUi(lang) {
  const l = lang || currentLang;
  if (l === 'en' && window.I18N_EN?.portfolio) return window.I18N_EN.portfolio;
  return null;
}

// Snapshots only; language applied on App mount (default: ru)
ensureSnapshots();
currentLang = 'ru';
document.documentElement.lang = 'ru';

Object.assign(window, {
  applySiteLang,
  getSiteLang,
  tUI,
  getSiteNav,
  getSiteMega,
  getHomeCopy,
  getFooterCopy,
  getSectionCopy,
  getDirectoryCopy,
  getTeamCopy,
  getContactCopy,
  getPortfolioUi,
  UI_RU,
  UI_EN,
});
