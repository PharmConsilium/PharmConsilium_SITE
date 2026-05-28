// SEO: title, description, canonical — обновляется при смене hash-роута.
// Перед продакшеном: заменить SITE.baseUrl и перейти на чистые URL (см. .cursor/rules).

const SITE = {
  baseUrl: 'https://pharmconsilium.by', // TODO: финальный домен перед запуском
  siteName: 'ФармКонсилиум',
  siteNameEn: 'PharmConsilium',
  defaultDescription:
    'IT-решения для фарм-маркетинга в Беларуси: CRM, CLM, AI для медпредов, контент, справочник ЛС. Команда внедрения цифровых технологий.',
  defaultDescriptionEn:
    'IT solutions for pharmaceutical marketing in Belarus: CRM, CLM, AI for medical reps, content, and drug directory. Digital implementation team.',
};

const SEO_STATIC = {
  home: {
    title: 'ФармКонсилиум · IT-решения для фарм-маркетинга в Беларуси',
    description: SITE.defaultDescription,
  },
  marketing: {
    title: 'Фармацевтический маркетинг · ФармКонсилиум',
    description: 'CRM, CLM, чат-боты, веб и мобильные продукты, ИИ для медпредставителей. Омниканальная работа с HCP в РБ.',
  },
  hcp: {
    title: 'Здравоохранение · ФармКонсилиум',
    description: 'ИИ-ассистенты, образовательные платформы, рекомендательные системы и программы поддержки пациентов.',
  },
  sales: {
    title: 'Аутсорсинг · ФармКонсилиум',
    description: 'Цифровой медпред, омниканальные кампании, лонч-аутсорсинг и аналитика продаж на рынке РБ.',
  },
  content: {
    title: 'Дизайн · ФармКонсилиум',
    description: 'Медицинские презентации, видео, eDetailing, геймификация и квизы для фарм-брендов.',
  },
  directory: {
    title: 'Справочник лекарственных средств · ФармКонсилиум',
    description: 'Доверительная ординаторская: справочник ЛС для врачей и провизоров Беларуси.',
  },
  team: {
    title: 'Команда и контакты · ФармКонсилиум',
    description: 'Связаться с командой ФармКонсилиум: 80+ запусков, 15 лет в фарм-маркетинге, внедрение под ключ.',
  },
  privacy: {
    title: 'Политика конфиденциальности · ФармКонсилиум',
    description: 'Политика обработки и защиты персональных данных ЧП «ФармКонсилиум» на цифровых ресурсах. Контакты ответственного лица.',
  },
  portfolio: {
    title: 'Портфолио, проекты и фичи · ФармКонсилиум',
    description: 'Реализованные проекты: CRM, CLM, лончи, образовательные платформы и цифровые кампании в РБ.',
  },
};

const SEO_STATIC_EN = {
  home: {
    title: 'PharmConsilium · IT solutions for pharmaceutical marketing in Belarus',
    description: SITE.defaultDescriptionEn,
  },
  marketing: {
    title: 'Pharmaceutical marketing · PharmConsilium',
    description: 'CRM, CLM, chatbots, web and mobile products, AI for medical representatives. Omnichannel HCP engagement in Belarus.',
  },
  hcp: {
    title: 'Healthcare · PharmConsilium',
    description: 'AI assistants, education platforms, recommender systems, and patient support programs.',
  },
  sales: {
    title: 'Outsourcing · PharmConsilium',
    description: 'Digital medical representative, omnichannel campaigns, launch outsourcing, and sales analytics in Belarus.',
  },
  content: {
    title: 'Design · PharmConsilium',
    description: 'Medical presentations, video, eDetailing, gamification, and quizzes for pharma brands.',
  },
  directory: {
    title: 'Drug directory · PharmConsilium',
    description: 'Trusted professional drug directory for physicians and pharmacists in Belarus.',
  },
  team: {
    title: 'About us · PharmConsilium',
    description: 'Contact the PharmConsilium team: 80+ launches, 15 years in pharma marketing, turnkey implementation.',
  },
  privacy: {
    title: 'Privacy policy · PharmConsilium',
    description: 'Personal data processing and protection policy of PharmConsilium on digital resources. Data protection contact.',
  },
  portfolio: {
    title: 'Portfolio, projects, and features · PharmConsilium',
    description: 'Delivered projects: CRM, CLM, launches, education platforms, and digital campaigns in Belarus.',
  },
};

function siteNameForLang(lang) {
  return lang === 'en' ? SITE.siteNameEn : SITE.siteName;
}

function ensureMeta(name, attr, value) {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function ensureCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function resolveSeo(route, lang) {
  const l = lang === 'en' ? 'en' : 'ru';
  const staticMap = l === 'en' ? SEO_STATIC_EN : SEO_STATIC;
  const brand = siteNameForLang(l);
  const fallbackDesc = l === 'en' ? SITE.defaultDescriptionEn : SITE.defaultDescription;

  if (staticMap[route]) return staticMap[route];

  const normRoute = String(route || '').replace(/^\/+/, '');
  if (normRoute.startsWith('portfolio/') && window.PORTFOLIO) {
    const slug = normRoute.slice('portfolio/'.length).split('/')[0];
    const p = window.PORTFOLIO.find((x) => x.slug === slug);
    if (p) {
      return {
        title: `${p.name} · ${brand}`,
        description: p.short || p.hero || fallbackDesc,
      };
    }
  }

  if (route.includes('/') && window.SUBPAGES?.[route]) {
    const d = window.SUBPAGES[route];
    return {
      title: `${d.title} · ${brand}`,
      description: d.lede,
    };
  }

  return {
    title: l === 'en' ? `${brand} · IT for pharmaceutical marketing` : `${SITE.siteName} · IT для фарм-маркетинга`,
    description: fallbackDesc,
  };
}

window.updatePageSeo = function updatePageSeo(route, lang) {
  const l = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const meta = resolveSeo(route, l);
  const brand = siteNameForLang(l);
  document.title = meta.title;
  ensureMeta('description', 'name', meta.description);
  ensureMeta('og:title', 'property', meta.title);
  ensureMeta('og:description', 'property', meta.description);
  ensureMeta('og:site_name', 'property', brand);
  ensureMeta('og:locale', 'property', l === 'en' ? 'en_BY' : 'ru_BY');
  ensureMeta('twitter:card', 'name', 'summary_large_image');
  const base = SITE.baseUrl.replace(/\/$/, '');
  const r = String(route || 'home').replace(/^\/+/, '').replace(/\/+$/, '');
  const canonical = r === 'home' ? `${base}/` : `${base}/${r}`;
  ensureCanonical(canonical);
};
