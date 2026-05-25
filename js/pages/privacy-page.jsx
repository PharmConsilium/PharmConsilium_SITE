// Privacy policy page — #privacy

function PrivacyBlock({ block }) {
  if (!block) return null;
  if (block.type === 'h2') return <h2 className="privacy-doc-h2">{block.text}</h2>;
  if (block.type === 'h3') return <h3 className="privacy-doc-h3">{block.text}</h3>;
  if (block.type === 'p') return <p>{block.text}</p>;
  if (block.type === 'ul') {
    return (
      <ul>
        {(block.items || []).map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }
  return null;
}

function PrivacyPage({ navigate, lang }) {
  const t = (key) => (window.tUI ? window.tUI(key, lang) : key);
  const isEn = lang === 'en';
  const doc = window.PRIVACY_POLICY_RU;
  const enLead = window.PRIVACY_POLICY_EN_LEAD;

  if (!doc) {
    return (
      <main className="page-route">
        <section className="container" style={{ padding: '48px 0' }}>
          <p>{isEn ? 'Privacy policy content is loading…' : 'Загрузка политики конфиденциальности…'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-route privacy-route">
      <section className="page-hero privacy-hero">
        <div className="container">
          <div className="crumbs">
            <span onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>{t('home')}</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--ink)' }}>{isEn ? 'Privacy policy' : doc.title}</span>
          </div>
          <h1 className="privacy-doc-title">{isEn ? 'Privacy policy' : doc.title}</h1>
          <p className="privacy-doc-lead">{isEn && enLead ? enLead : doc.lead}</p>
          {isEn ? (
            <p className="privacy-doc-note">
              The legally binding version of this policy is in Russian (Republic of Belarus). Below is the full Russian text.
            </p>
          ) : null}
        </div>
      </section>

      <section className="container privacy-doc-wrap">
        <article className="privacy-doc" id="privacy-policy">
          {(doc.parts || []).map((block, i) => <PrivacyBlock key={i} block={block} />)}
          {doc.revision ? <p className="privacy-doc-revision">{doc.revision}</p> : null}
        </article>
      </section>
    </main>
  );
}

window.PrivacyPage = PrivacyPage;
