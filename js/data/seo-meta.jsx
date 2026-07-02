// SEO: title, description, canonical — обновляется при смене History API-роута.

const SITE = {
  baseUrl: 'https://pharmconsilium.com',
  /** 1200×630 JPG/PNG — заменить на финальный og-default перед запуском */
  ogImage: 'https://pharmconsilium.com/assets/uploads/mega-marketing.png',
  siteName: 'ФармКонсилиум',
  siteNameEn: 'PharmConsilium',
  defaultDescription:
    'IT-решения для фармацевтического маркетинга в Беларуси: CRM, CLM, чат-боты, ИИ для медпредов, контент и справочник ЛС. 80+ запусков, внедрение под ключ.',
  defaultDescriptionEn:
    'IT solutions for pharmaceutical marketing in Belarus: CRM, CLM, chatbots, AI for medical reps, content, and drug directory. 80+ launches, turnkey delivery.',
};

const SEO_STATIC = {
  home: {
    title: 'ФармКонсилиум · IT-решения для фармацевтического маркетинга в Беларуси',
    description: SITE.defaultDescription,
  },
  'pharma-marketing': {
    title: 'Фармацевтический маркетинг · ФармКонсилиум',
    description: 'CRM, CLM, чат-боты, веб и мобильные продукты, ИИ для медпредов в Беларуси. Омниканальная работа с HCP и визитная аналитика — под ключ от ФармКонсилиум.',
  },
  healthcare: {
    title: 'Здравоохранение · ФармКонсилиум',
    description: 'ИИ-ассистенты, образовательные LMS-платформы, программы поддержки пациентов и мобильные приложения для врачей и провизоров в Беларуси. ФармКонсилиум.',
  },
  'outsourcing-medpredov': {
    title: 'Аутсорсинг · ФармКонсилиум',
    description: 'Цифровой медпред, омниканальные кампании, лонч-аутсорсинг и аналитика продаж на рынке РБ. Аутсорсинг продвижения фармбрендов от ФармКонсилиум.',
  },
  design: {
    title: 'Дизайн · ФармКонсилиум',
    description: 'CLM-презентации, видео, eDetailing, геймификация и квизы для фармбрендов в Беларуси. Медицинский дизайн и контент под ключ — ФармКонсилиум.',
  },
  'FarmConsilium-drug-reference-book': {
    title: 'Справочник лекарственных средств · ФармКонсилиум',
    description: 'Справочник лекарственных средств для врачей и провизоров Беларуси: актуальные данные о препаратах, противопоказаниях и дозировках. ФармКонсилиум.',
  },
  about: {
    title: 'Команда и контакты · ФармКонсилиум',
    description: 'Команда ФармКонсилиум: 80+ запусков, 15 лет в фарм-маркетинге Беларуси. Контакты, офис в Гродно, внедрение CRM, CLM и цифровых решений под ключ.',
  },
  privacy: {
    title: 'Политика конфиденциальности · ФармКонсилиум',
    description: 'Политика обработки персональных данных ЧП «ФармКонсилиум» на сайте pharmconsilium.com. Порядок сбора, хранения и защиты данных. Контакты DPO.',
  },
  portfolio: {
    title: 'Портфолио, проекты и фичи · ФармКонсилиум',
    description: 'Реализованные проекты ФармКонсилиум: CRM, CLM, лончи, образовательные платформы, видео и геймификация для фармбрендов в Беларуси. Кейсы и результаты.',
  },
};

const SEO_STATIC_EN = {
  home: {
    title: 'PharmConsilium · IT solutions for pharmaceutical marketing in Belarus',
    description: SITE.defaultDescriptionEn,
  },
  'pharma-marketing': {
    title: 'Pharmaceutical marketing · PharmConsilium',
    description: 'CRM, CLM, chatbots, web and mobile products, and AI for medical reps in Belarus. Omnichannel HCP engagement and visit analytics — turnkey from PharmConsilium.',
  },
  healthcare: {
    title: 'Healthcare · PharmConsilium',
    description: 'AI assistants, LMS education platforms, patient support programs, and mobile apps for physicians and pharmacists in Belarus. PharmConsilium.',
  },
  'outsourcing-medpredov': {
    title: 'Outsourcing · PharmConsilium',
    description: 'Digital medical rep, omnichannel campaigns, launch outsourcing, and sales analytics in Belarus. Pharma brand promotion outsourcing by PharmConsilium.',
  },
  design: {
    title: 'Design · PharmConsilium',
    description: 'CLM presentations, video, eDetailing, gamification, and quizzes for pharma brands in Belarus. Medical design and content — turnkey from PharmConsilium.',
  },
  'FarmConsilium-drug-reference-book': {
    title: 'Drug directory · PharmConsilium',
    description: 'Drug directory for physicians and pharmacists in Belarus: up-to-date data on medicines, contraindications, and dosing. PharmConsilium.',
  },
  about: {
    title: 'About us · PharmConsilium',
    description: 'PharmConsilium team: 80+ launches, 15 years in pharma marketing in Belarus. Contacts, Minsk office, CRM, CLM, and digital solutions delivered turnkey.',
  },
  privacy: {
    title: 'Privacy policy · PharmConsilium',
    description: 'Personal data processing policy of PharmConsilium on pharmconsilium.com. How we collect, store, and protect data. Data protection contact.',
  },
  portfolio: {
    title: 'Portfolio, projects, and features · PharmConsilium',
    description: 'PharmConsilium delivered projects: CRM, CLM, launches, education platforms, video, and gamification for pharma brands in Belarus. Cases and results.',
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
        description: p.metaDescription || p.short || p.hero || fallbackDesc,
      };
    }
  }

  if (route.includes('/') && window.SUBPAGES?.[route]) {
    const d = window.SUBPAGES[route];
    return {
      title: `${d.title} · ${brand}`,
      description: d.metaDescription || d.lede,
    };
  }

  return {
    title: l === 'en' ? `${brand} · IT for pharmaceutical marketing` : `${SITE.siteName} · IT для фармацевтического маркетинга`,
    description: fallbackDesc,
  };
}

window.updatePageSeo = function updatePageSeo(route, lang) {
  const enOn = window.isSiteEnEnabled ? window.isSiteEnEnabled() : false;
  const raw = lang || (window.getSiteLang ? window.getSiteLang() : 'ru');
  const l = enOn && raw === 'en' ? 'en' : 'ru';
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
  ensureMeta('og:url', 'property', canonical);
  if (SITE.ogImage) {
    ensureMeta('og:image', 'property', SITE.ogImage);
    ensureMeta('twitter:image', 'name', SITE.ogImage);
  }
};
