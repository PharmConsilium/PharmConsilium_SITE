// SECTION_CARDS — landing cards per section (marketing, hcp, sales, content).
// Shared by SectionPage grids and DetailPage «Вам могут понравиться» via getSectionRelatedCards.

const SECTION_CARDS = {
  marketing: [
    { title: 'CRM-PharmConsilium для медицинских представителей', sub: 'crm', size: 'huge',
      cardArt: 'assets/uploads/marketing-crm-card.png?v=20260529',
      cardArtAlt: 'CRM-PharmConsilium: база организаций и аптек',
      cardArtPhoto: 'contain',
      desc: 'Специализированная CRM для фармы: база HCP, ЛПУ и аптек, визиты медицинских представителей, CLM, 2CLM, digital-коммуникации и аналитика в одной системе.',
      tag: 'Pharma CRM, CRM для фармацевтических компаний, Контроль эффективности МП' },
    { title: 'CLM — ПО для работы МП F2F с промоконтентом', sub: 'clm',
      cardArt: 'assets/uploads/marketing-clm-card.png?v=20260527b',
      cardArtAlt: 'CLM-PharmConsilium: визит медицинского представителя с HCP и аналитикой на планшете',
      cardArtPhoto: 'contain',
      desc: 'Программное обеспечение для демонстрации CLM-презентаций медицинским представителем на F2F-визитах. Интерактивные сценарии, метрики взаимодействия, экспорт данных.',
      tag: 'CLM, CLM — презентации, Detailing CLM — ФармКонсилиум' },
    { title: '2CLM — ПО для увеличения эффективности визитов SF', sub: '2clm', art: 'ArtTablet',
      cardArt: 'assets/uploads/marketing-2clm-card.png?v=20260527b',
      cardArtAlt: '2CLM — врач с поствизитным контентом на смартфоне после визита медицинского представителя',
      cardArtPhoto: 'contain',
      desc: 'Один сценарий — два режима: тач-визит и удалённая работа. Контент адаптируется под формат коммуникации без переделки.',
      tag: 'Rep-Triggered Email, Post-Call Digital Content Push, Post-Call Follow-Up Materials Delivery' },
    { title: 'Чат-бот и ТелеАпп — цифровая экосистема для коммуникации с HCP', sub: 'chatbot', art: 'ArtChat',
      cardArt: 'assets/uploads/marketing-chatbot-card.png?v=20260527',
      cardArtAlt: 'Чат-бот и ТелеАпп ФармКонсилиум: Telegram-бот и мини-приложение для HCP',
      cardArtPhoto: 'contain',
      desc: 'Для долгосрочной коммуникации с вашими клиентами создаем уникальную цифровую архитектуру в мессенджере Телеграм, где в списке личных чатов пользователя находится чат-бот с встроенными функциями мобильного приложения.',
      tag: 'TelegramBot, TeleApp, ChatBot' },
    { title: 'Веб-разработка: сайты, лендинги, лонгриды, платформы для онлайн-конгрессов и вебинаров', sub: 'web', art: 'ArtBrowser', size: 'wide',
      cardArt: 'assets/uploads/marketing-web-card.png?v=20260527',
      cardArtAlt: 'Веб-разработка ФармКонсилиум: лендинги, лонгриды и платформы онлайн-конгрессов на мониторе',
      cardArtPhoto: 'contain',
      desc: 'Веб-решения ФармКонсилиум для фармацевтических брендов: HCP-порталы, лендинги препаратов, лонгриды и платформы онлайн-конгрессов под ключ.',
      tag: 'WebDevelopment, PharmaWeb, PharmaMarketing' },
    { title: 'Разработка мобильных приложений', sub: 'mobile', art: 'ArtPhone', size: 'wide',
      cardArt: 'assets/uploads/marketing-mobile-card.png?v=20260527',
      cardArtAlt: 'Разработка мобильных приложений ФармКонсилиум: App Store, Google Play и макет mHealth-приложения',
      cardArtPhoto: 'contain',
      desc: 'Мы создаём mHealth-приложения для фармбрендов «под ключ» — от идеи и UX-концепции до дизайна, разработки и публикации в App Store и Google Play.',
      tag: 'iOS, Android, PharmaApp' },
    { title: 'Цифровая поддержка мероприятий', sub: 'events', art: 'ArtRadar',
      cardArt: 'assets/uploads/marketing-events-card.png?v=20260528',
      cardArtAlt: 'Цифровая поддержка мероприятий: 3D-иллюстрация конференц-зала с интерактивом через смартфоны',
      cardArtPhoto: 'contain',
      desc: 'Цифровое сопровождение медицинских эвентов: регистрационные лендинги, эвент-боты, ИИ-помощники, интерактивы и коммуникация с HCP до и после события.',
      tag: 'PharmaEvents, OnlineCongress, WebinarPlatform' },
    { title: 'Тренинги для медицинских представителей', sub: 'ai', art: 'ArtAI',
      cardArt: 'assets/uploads/marketing-ai-card.png?v=20260527',
      cardArtAlt: 'Тренинги для медицинских представителей: 3D-иллюстрация занятия по продукту и комплаенсу',
      cardArtPhoto: 'contain',
      desc: 'Более 30 тренинговых тем для медицинских представителей, реализованных за несколько десятилетий. Тренинги для МП от ФармКонсилиум с 2005 года: виртуальный видеозал, квиз-тренажёры и 10 готовых ролевых игр с геймификацией под бренд клиента.',
      tag: 'FieldForceTraining, Gamification, DistanceLearning' },
  ],
  hcp: [
    { title: 'Цифровые платформы для образовательных медицинских программ', sub: 'ai-recom', size: 'huge', art: 'ArtAI',
      cardArt: 'assets/uploads/hcp-learning-card.png?v=20260527',
      cardArtAlt: 'Платформа медицинского обучения: врач за планшетом и тест на смартфоне',
      cardArtPhoto: 'cover',
      desc: 'Вебинары, онлайн-курсы, тренинги и аттестация для врачей и провизоров — на собственных LMS-платформах.',
      tag: 'CME, MedicalEducation, ePharma' },
    { title: 'Программы поддержки пациентов', sub: 'education', art: 'ArtBooks',
      cardArt: 'assets/uploads/hcp-psp-card.png?v=20260527',
      cardArtAlt: 'Программы поддержки пациентов: робот помогает пациенту в уходе и сопровождении терапии',
      cardArtPhoto: 'cover',
      desc: 'LMS-платформы для HCP и пациентов: вебинары, онлайн-курсы, аттестация, баллы CME, прогресс и сертификаты — всё в одной цифровой среде.',
      tag: 'PatientSupport, DigitalHealth, PSP' },
    { title: 'Чат-боты и ИИ-ассистенты для медицины', sub: 'chatbot', art: 'ArtChat',
      cardArt: 'assets/uploads/hcp-med-chatbot-card.png?v=20260527',
      cardArtAlt: 'Чат-боты и ИИ-ассистенты для медицины: робот за столом с планшетом и чек-листом',
      cardArtPhoto: 'cover',
      desc: 'ИИ-ассистенты для врачей, провизоров и пациентов: медицинские боты, поддержка терапии, навигация по вопросам терапии, фармаконадзор — 24/7 в регуляторных рамках.',
      tag: 'MedicalAI, HealthcareBot, PharmaBot' },
    { title: 'Цифровые платформы для научных исследований', sub: 'ai-healthcare', art: 'ArtDashboard',
      cardArt: 'assets/uploads/hcp-research-card.png?v=20260527',
      cardArtAlt: 'Цифровые платформы для научных исследований: лаборатория и аналитика клинических данных на мониторе',
      cardArtPhoto: 'cover',
      desc: 'Панели сбора клинических данных, ИИ-ассистент врача, ePRO-боты и AI-аналитика — создаем цифровые инструменты для научных исследований с учетом регуляторных требований клиента.',
      tag: 'ClinicalResearch, ClinicalData, AIinPharma' },
    { title: 'Создание систем анализа и обработки данных RWE', sub: 'psp', art: 'ArtPulse', size: 'wide',
      cardArt: 'assets/uploads/hcp-rwe-card.png?v=20260527',
      cardArtAlt: 'Системы анализа данных RWE: дашборды, облачное хранилище и аналитика клинических данных',
      cardArtPhoto: 'cover',
      desc: 'Платформы для сбора и анализа реальных клинических данных для медицинской отрасли, производителей лекарственных препаратов и медицинских изделий: когортная аналитика, обработка данных с применением ИИ, формирование доказательств эффективности терапии и модели контрактов, основанные на клинических результатах.',
      tag: 'RWE, RealWorldEvidence, PharmaStrategy' },
  ],
  sales: [
    { title: 'Аутсорсинг медицинских представителей и цифровая альтернатива для фармкомпаний', sub: 'digital-rep', size: 'huge', art: 'ArtTablet',
      cardArt: 'assets/uploads/sales-digital-rep-card.png?v=20260528',
      cardArtAlt: 'Аутсорсинг медицинских представителей: 3D-иллюстрация человека и робота — цифровая альтернатива field force',
      cardArtPhoto: 'contain',
      desc: 'Создаем цифровые омниканальные кампании продвижения, которые берут на себя функции аутсорсинговой команды медицинских представителей: персональная архитектура коммуникации с врачами, провизорами и фармацевтами на базе собственной платформы и технологического стека ФармКонсилиум.',
      tag: 'Покрытие РБ, Аутсорс' },
    { title: 'Цифровой медицинский представитель в гибридном продвижении фармбрендов', sub: 'omnichannel', art: 'ArtNodes',
      cardArt: 'assets/uploads/sales-omnichannel-card.png?v=20260528',
      cardArtAlt: 'Цифровой медицинский представитель: 3D-иллюстрация гибридного промо с цифровым двойником и голограммой',
      cardArtPhoto: 'contain',
      desc: 'Цифровые двойники (цифровые аватары) медицинских представителей встраиваются в омниканальную цифровую систему продвижения: визит МП F2F, затем просмотр видео, где его цифровой аватар комментирует данные клинического исследования.',
      tag: 'DigitalRep, Omnichannel, HCPengagement' },
    { title: 'Лонч-аутсорсинг', sub: 'launch', art: 'ArtLaunch',
      cardArt: 'assets/uploads/sales-launch-card.png?v=20260529',
      cardArtAlt: 'Лонч-аутсорсинг: 3D-иллюстрация эксперта с журналом медицинского аутсорсинга и стратегии',
      cardArtPhoto: 'contain',
      desc: 'Лонч-аутсорсинг с ФармКонсилиум: от стратегии и софт-лонча до цифрового лонча и полного комплекса сервисов вывода бренда на рынок Беларуси.',
      tag: 'PharmaLaunch, SoftLaunch, LaunchOutsourcing' },
  ],
  content: [
    { title: 'CLM-презентации, детейлеры, слайдбоксы для медицинского представителя', sub: 'medical', size: 'huge', art: 'ArtDoc',
      desc: 'CLM-детейлеры и визуальные материалы для F2F-визитов МП: клинически точный нарратив, доказательный дизайн, compliance и аналитика каждого визита — всё под контролем продакт-менеджера.',
      tag: 'CLM, eDetailing, VisualAid' },
    { title: 'Видео HCP - от сценария до спецэффектов в выступлении OL', sub: 'video', art: 'ArtVideo', size: 'wide',
      desc: 'Видеовизиты, интерактивные видео и вертикальные форматы для смартфонов. От линейного текинга до сложной архитектуры с клинической точностью и продакшн уровнем топ студии.',
      tag: 'PharmaVideo, VideoMarketing, KOLvideo' },
    { title: 'Игры, квизы и клинические детективы для HCP', sub: 'gamification', art: 'ArtGame', size: 'wide',
      desc: 'Клинические детективы, квизы и кейс-игры для врачей и провизоров — геймификация в фармацевтическом маркетинге, которая обучает, вовлекает и формирует лояльность к бренду.',
      tag: 'MedicalGamification, SeriousGames, HCPengagement' },
    { title: 'Визуальные концепты, упаковка, рекламные баннера, брендбук ЛС', sub: 'presentations', art: 'ArtSlides',
      desc: 'Визуальная идентичность фармацевтического бренда: от концепта и брендбука до упаковки, баннеров и промоматериалов — дизайн, которому доверяют медицинские специалисты и пациенты.',
      tag: 'PharmaBranding, PackagingDesign, BrandBook' },
    { title: 'ИИ-контент: аватары, аудио-подкасты, медицинский копирайтинг', sub: 'advertising', art: 'ArtBrowser',
      desc: 'ИИ-аватары, аудиоподкасты для HCP и AI-копирайтинг — контент-фабрика нового поколения: вертикальные видеовизиты, голос бренда и тексты для всех каналов из одного брифа.',
      tag: 'AIcontent, DigitalAvatar, MedPodcast' },
  ],
};

const SECTION_CRUMBS = {
  marketing: 'Фармацевтический маркетинг',
  hcp: 'Здравоохранение',
  sales: 'Аутсорсинг',
  content: 'Дизайн',
};

const SECTION_THUMB_POSITION = {
  marketing: {
    crm: '52% center',
    clm: '50% center',
    '2clm': '70% center',
    chatbot: '48% center',
    web: '38% center',
    mobile: '60% center',
  },
};

function mergeSectionCardsLang(ruCards, sectionId, lang) {
  if (lang !== 'en' || !window.I18N_EN?.sections?.[sectionId]?.cards) return ruCards;
  const enCards = window.I18N_EN.sections[sectionId].cards;
  return ruCards.map((c) => {
    const patch = enCards.find((e) => e.sub === c.sub);
    if (!patch) return c;
    return {
      ...c,
      title: patch.title != null ? patch.title : c.title,
      desc: patch.desc != null ? patch.desc : c.desc,
      tag: patch.tag != null ? patch.tag : c.tag,
      cardArtAlt: patch.cardArtAlt || c.cardArtAlt,
    };
  });
}

function getSectionRelatedCards(sectionId, routeId, lang) {
  const ru = SECTION_CARDS[sectionId];
  if (!ru) return [];
  const cards = mergeSectionCardsLang(ru, sectionId, lang);
  const sectionLabel = lang === 'en' && window.I18N_EN?.sections?.[sectionId]?.crumb
    ? window.I18N_EN.sections[sectionId].crumb
    : (SECTION_CRUMBS[sectionId] || '');
  const withSub = cards.filter((c) => c.sub);
  if (withSub.length <= 1) return [];

  const currentIdx = withSub.findIndex((c) => `${sectionId}/${c.sub}` === routeId);
  const start = currentIdx >= 0 ? (currentIdx + 1) % withSub.length : 0;
  const count = Math.min(3, withSub.length - 1);
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    picked.push(withSub[(start + i) % withSub.length]);
  }

  return picked.map((c) => ({
      routeId: `${sectionId}/${c.sub}`,
      title: c.title,
      section: sectionLabel,
      cardArt: c.cardArt,
      cardArtAlt: c.cardArtAlt,
      cardArtThumbPosition: (SECTION_THUMB_POSITION[sectionId] && SECTION_THUMB_POSITION[sectionId][c.sub]) || 'center center',
      art: c.art,
    }));
}

window.SECTION_CARDS = SECTION_CARDS;
window.getSectionRelatedCards = getSectionRelatedCards;
