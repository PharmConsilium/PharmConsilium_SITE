// SEO: title, description, canonical — обновляется при смене hash-роута.
// Перед продакшеном: заменить SITE.baseUrl и перейти на чистые URL (см. .cursor/rules).

const SITE = {
  baseUrl: 'https://pharmconsilium.by', // TODO: финальный домен перед запуском
  siteName: 'ФармКонсилиум',
  defaultDescription:
    'IT-решения для фарм-маркетинга в Беларуси: CRM, CLM, AI для медпредов, контент, справочник ЛС. Команда внедрения цифровых технологий.',
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
    title: 'Здравоохранения · ФармКонсилиум',
    description: 'ИИ-ассистенты, образовательные платформы, рекомендательные системы и программы поддержки пациентов.',
  },
  sales: {
    title: 'Аутсорсинг · ФармКонсилиум',
    description: 'Цифровой медпред, омниканальные кампании, лонч-аутсорсинг и аналитика продаж на рынке РБ.',
  },
  content: {
    title: 'Контент и игры · ФармКонсилиум',
    description: 'Медицинские презентации, видео, eDetailing, геймификация и квизы для фарм-брендов.',
  },
  directory: {
    title: 'Справочник лекарственных средств · ФармКонсилиум',
    description: 'Доверительная ординаторская: справочник ЛС для врачей и провизоров Беларуси.',
  },
  team: {
    title: 'Команда и консультация · ФармКонсилиум',
    description: 'Связаться с командой ФармКонсилиум: 80+ запусков, 15 лет в фарм-маркетинге, внедрение под ключ.',
  },
  portfolio: {
    title: 'Портфолио и кейсы · ФармКонсилиум',
    description: 'Реализованные проекты: CRM, CLM, лончи, образовательные платформы и цифровые кампании в РБ.',
  },
};

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

function resolveSeo(route) {
  if (SEO_STATIC[route]) return SEO_STATIC[route];

  if (route.startsWith('portfolio/') && window.PORTFOLIO) {
    const slug = route.split('/')[1];
    const p = window.PORTFOLIO.find((x) => x.slug === slug);
    if (p) {
      return {
        title: `${p.name} · ${SITE.siteName}`,
        description: p.short || p.hero || SITE.defaultDescription,
      };
    }
  }

  if (route.includes('/') && window.SUBPAGES?.[route]) {
    const d = window.SUBPAGES[route];
    return {
      title: `${d.title} · ${SITE.siteName}`,
      description: d.lede,
    };
  }

  return {
    title: `${SITE.siteName} · IT для фарм-маркетинга`,
    description: SITE.defaultDescription,
  };
}

window.updatePageSeo = function updatePageSeo(route) {
  const meta = resolveSeo(route);
  document.title = meta.title;
  ensureMeta('description', 'name', meta.description);
  ensureMeta('og:title', 'property', meta.title);
  ensureMeta('og:description', 'property', meta.description);
  ensureMeta('og:site_name', 'property', SITE.siteName);
  ensureMeta('twitter:card', 'name', 'summary_large_image');
  // До миграции с hash — canonical с якорем; после — path URL
  const canonical = `${SITE.baseUrl.replace(/\/$/, '')}/#${route === 'home' ? '' : route}`;
  ensureCanonical(canonical.replace(/\/#$/, '/'));
};
