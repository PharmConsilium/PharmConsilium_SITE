/**
 * Проверка редиректов на проде (без зацикливания).
 * node scripts/check-redirects.mjs [baseUrl]
 */
const BASE = (process.argv[2] || 'https://pharmconsilium.com').replace(/\/$/, '');

const CASES = [
  { path: '/', expect: [200] },
  { path: '/index.html', expect: [200] },
  { path: '/marketing/crm', expect: [200] },
  { path: '/index.php', expect: [301], location: '/' },
  { path: '/contact.php', expect: [301], location: '/team/contacts' },
  { path: '/trainings.php', expect: [301], location: '/hcp/education' },
  { path: '/tool/PharmInfo', expect: [301], location: '/directory' },
  { path: '/politics.php', expect: [301], location: '/privacy' },
];

async function checkOne({ path, expect, location }) {
  const url = BASE + path;
  const res = await fetch(url, { redirect: 'manual' });
  const code = res.status;
  const loc = res.headers.get('location') || '';
  const okCode = expect.includes(code);
  let okLoc = true;
  if (location && code >= 300 && code < 400) {
    const norm = (u) => {
      try {
        return new URL(u, BASE).pathname.replace(/\/$/, '') || '/';
      } catch {
        return u;
      }
    };
    okLoc = norm(loc) === norm(location);
  }
  const chain = await fetch(url, { redirect: 'follow' }).then(
    (r) => ({ final: r.url, ok: r.ok }),
    (e) => ({ final: e.message, ok: false })
  );
  const loop = chain.final === url && code === 301;
  return { path, code, loc, okCode, okLoc, loop, chainFinal: chain.final };
}

async function main() {
  console.log('Base:', BASE, '\n');
  let fail = 0;
  for (const c of CASES) {
    const r = await checkOne(c);
    const status = r.okCode && r.okLoc && !r.loop ? 'OK' : 'FAIL';
    if (status === 'FAIL') fail++;
    console.log(
      status,
      c.path,
      '→',
      r.code,
      r.loc ? `Location: ${r.loc}` : '',
      r.loop ? '*** LOOP ***' : '',
    );
  }
  console.log(fail ? `\n${fail} failed` : '\nAll checks passed');
  process.exit(fail ? 1 : 0);
}

main();
