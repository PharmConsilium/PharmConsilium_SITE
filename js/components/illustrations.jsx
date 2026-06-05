// Geometric SVG illustrations — molecules, nodes, graphs, screens.
// All accept {className} and use currentColor so they pick up theme.

const ART_PALETTE = {
  bg: 'var(--bg-2)',
  surface: 'var(--surface)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  ink: 'var(--ink)',
  muted: 'var(--muted)',
  border: 'var(--border-2)',
};

function ArtFrame({ children, viewBox = '0 0 280 200', className, style }) {
  return (
    <svg viewBox={viewBox} className={className} style={style} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

/* network of nodes — CRM / omnichannel */
function ArtNodes({ className }) {
  const nodes = [
    [50, 60], [140, 40], [220, 70],
    [40, 140], [120, 110], [200, 150],
    [260, 110], [90, 170]
  ];
  const links = [[0,1],[1,2],[1,4],[4,3],[4,5],[5,6],[4,7],[3,7],[2,6]];
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      {links.map(([a,b],i)=>(
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={ART_PALETTE.accent} strokeWidth="1" opacity=".35"/>
      ))}
      {nodes.map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r={i===4?9:6} fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent} strokeWidth={i===4?2:1.2}/>
          {i===4 && <circle cx={x} cy={y} r="3.4" fill={ART_PALETTE.accent}/>}
        </g>
      ))}
      <circle cx="140" cy="110" r="32" fill="none" stroke={ART_PALETTE.accent} strokeWidth="0.6" opacity=".25"/>
      <circle cx="140" cy="110" r="50" fill="none" stroke={ART_PALETTE.accent} strokeWidth="0.6" opacity=".15"/>
    </ArtFrame>
  );
}

/* layered presentation cards — CLM */
function ArtLayers({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      {[0,1,2,3].map(i=>(
        <g key={i} transform={`translate(${50+i*12} ${50+i*8})`}>
          <rect width="160" height="100" rx="8" fill={ART_PALETTE.surface}
            stroke={ART_PALETTE.border} strokeWidth="1"/>
          <rect x="12" y="14" width="60" height="6" rx="3" fill={i===3?ART_PALETTE.accent:ART_PALETTE.muted} opacity={i===3?1:.3}/>
          <rect x="12" y="28" width="100" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".25"/>
          <rect x="12" y="38" width="80" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".25"/>
          {i===3 && <rect x="12" y="60" width="40" height="20" rx="5" fill={ART_PALETTE.accent}/>}
        </g>
      ))}
    </ArtFrame>
  );
}

/* two speech bubbles — chat */
function ArtChat({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g>
        <path d="M40 60 Q40 48 52 48 L150 48 Q162 48 162 60 L162 100 Q162 112 150 112 L72 112 L52 128 L52 112 Q40 112 40 100 Z"
          fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
        <rect x="56" y="64" width="80" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".4"/>
        <rect x="56" y="76" width="60" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".3"/>
        <rect x="56" y="88" width="40" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".3"/>
      </g>
      <g>
        <path d="M118 100 Q118 88 130 88 L240 88 Q252 88 252 100 L252 152 Q252 164 240 164 L220 164 L240 180 L210 164 L130 164 Q118 164 118 152 Z"
          fill={ART_PALETTE.accent}/>
        <rect x="134" y="106" width="92" height="4" rx="2" fill="white" opacity=".9"/>
        <rect x="134" y="118" width="76" height="4" rx="2" fill="white" opacity=".7"/>
        <rect x="134" y="130" width="56" height="4" rx="2" fill="white" opacity=".5"/>
        <circle cx="134" cy="148" r="3" fill="white"/>
        <circle cx="146" cy="148" r="3" fill="white" opacity=".6"/>
        <circle cx="158" cy="148" r="3" fill="white" opacity=".3"/>
      </g>
    </ArtFrame>
  );
}

/* browser window — web / digital */
function ArtBrowser({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="40" y="40" width="200" height="130" rx="10" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <rect x="40" y="40" width="200" height="22" rx="10" fill={ART_PALETTE.bg}/>
      <rect x="40" y="56" width="200" height="6" fill={ART_PALETTE.bg}/>
      <circle cx="52" cy="51" r="3" fill={ART_PALETTE.muted} opacity=".4"/>
      <circle cx="62" cy="51" r="3" fill={ART_PALETTE.muted} opacity=".4"/>
      <circle cx="72" cy="51" r="3" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="90" y="46" width="120" height="10" rx="5" fill={ART_PALETTE.bg}/>
      <rect x="52" y="72" width="60" height="50" rx="6" fill={ART_PALETTE.accent}/>
      <rect x="120" y="72" width="110" height="6" rx="3" fill={ART_PALETTE.muted} opacity=".5"/>
      <rect x="120" y="84" width="80" height="6" rx="3" fill={ART_PALETTE.muted} opacity=".3"/>
      <rect x="120" y="98" width="100" height="24" rx="6" fill={ART_PALETTE.accentSoft}/>
      <rect x="52" y="132" width="178" height="6" rx="3" fill={ART_PALETTE.muted} opacity=".3"/>
      <rect x="52" y="144" width="120" height="6" rx="3" fill={ART_PALETTE.muted} opacity=".25"/>
    </ArtFrame>
  );
}

/* phone outline — mobile apps */
function ArtPhone({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g transform="translate(105 28)">
        <rect width="70" height="150" rx="11" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border} strokeWidth="1.5"/>
        <rect x="6" y="14" width="58" height="120" rx="6" fill={ART_PALETTE.bg}/>
        <rect x="30" y="8" width="10" height="2" rx="1" fill={ART_PALETTE.muted} opacity=".4"/>
        <rect x="10" y="20" width="34" height="4" rx="2" fill={ART_PALETTE.accent}/>
        <rect x="10" y="30" width="50" height="22" rx="4" fill={ART_PALETTE.accent} opacity=".15"/>
        <rect x="10" y="56" width="50" height="22" rx="4" fill={ART_PALETTE.muted} opacity=".15"/>
        <rect x="10" y="82" width="50" height="22" rx="4" fill={ART_PALETTE.muted} opacity=".1"/>
        <rect x="14" y="36" width="24" height="3" rx="1.5" fill={ART_PALETTE.accent}/>
        <rect x="14" y="44" width="16" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".5"/>
        <rect x="28" y="140" width="14" height="2" rx="1" fill={ART_PALETTE.muted} opacity=".4"/>
      </g>
      <circle cx="60" cy="100" r="20" fill="none" stroke={ART_PALETTE.accent} strokeWidth="1" opacity=".25"/>
      <circle cx="60" cy="100" r="32" fill="none" stroke={ART_PALETTE.accent} strokeWidth="0.6" opacity=".15"/>
      <circle cx="220" cy="100" r="20" fill="none" stroke={ART_PALETTE.accent} strokeWidth="1" opacity=".25"/>
    </ArtFrame>
  );
}

/* radiating arcs — events */
function ArtRadar({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g transform="translate(140 110)">
        {[20,40,60,80].map((r,i)=>(
          <circle key={i} r={r} fill="none" stroke={ART_PALETTE.accent} strokeWidth={i===0?2:0.8} opacity={1-i*0.2}/>
        ))}
        <circle r="6" fill={ART_PALETTE.accent}/>
        <line x1="0" y1="0" x2="60" y2="-50" stroke={ART_PALETTE.accent} strokeWidth="1.4"/>
        <line x1="0" y1="0" x2="-70" y2="-20" stroke={ART_PALETTE.accent} strokeWidth="1" opacity=".5"/>
        <line x1="0" y1="0" x2="40" y2="60" stroke={ART_PALETTE.accent} strokeWidth="1" opacity=".5"/>
        <circle cx="60" cy="-50" r="5" fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent} strokeWidth="2"/>
        <circle cx="-70" cy="-20" r="3.5" fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent}/>
        <circle cx="40" cy="60" r="3.5" fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent}/>
      </g>
    </ArtFrame>
  );
}

/* neural net dots — AI */
function ArtAI({ className }) {
  const cols = [
    [40, [50, 100, 150]],
    [110, [40, 80, 120, 160]],
    [180, [50, 100, 150]],
    [250, [100]]
  ];
  const allPts = cols.flatMap(([x, ys]) => ys.map(y => [x, y]));
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      {cols.slice(0, -1).map((c, ci) => {
        const next = cols[ci + 1];
        return c[1].flatMap((y) =>
          next[1].map((y2, j) => (
            <line key={`${ci}-${y}-${j}`} x1={c[0]} y1={y} x2={next[0]} y2={y2}
              stroke={ART_PALETTE.accent} strokeWidth="0.5" opacity={Math.random() * 0.4 + 0.1}/>
          ))
        );
      })}
      {allPts.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4.5" fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent} strokeWidth="1.4"/>
      ))}
      <circle cx="250" cy="100" r="9" fill={ART_PALETTE.accent}/>
    </ArtFrame>
  );
}

/* book stack — education */
function ArtBooks({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      {[
        {x:60, y:130, w:160, h:14, fill: ART_PALETTE.accent},
        {x:50, y:112, w:180, h:14, fill: ART_PALETTE.surface},
        {x:70, y:94, w:140, h:14, fill: ART_PALETTE.surface},
        {x:55, y:76, w:170, h:14, fill: ART_PALETTE.accent, op:.5},
        {x:65, y:58, w:150, h:14, fill: ART_PALETTE.surface},
        {x:80, y:40, w:120, h:14, fill: ART_PALETTE.accent, op:.7},
      ].map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill={b.fill} opacity={b.op||1}
            stroke={ART_PALETTE.border} strokeWidth=".8"/>
          <circle cx={b.x+8} cy={b.y+b.h/2} r="2" fill={ART_PALETTE.muted} opacity=".5"/>
        </g>
      ))}
    </ArtFrame>
  );
}

/* dashboard panels — clinical research */
function ArtDashboard({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="30" y="30" width="100" height="60" rx="8" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <rect x="40" y="40" width="40" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".5"/>
      <text x="40" y="72" fontFamily="monospace" fontSize="22" fontWeight="600" fill={ART_PALETTE.accent}>87%</text>
      <rect x="140" y="30" width="110" height="60" rx="8" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <polyline points="150,76 165,60 180,68 195,48 210,56 225,40 240,46"
        fill="none" stroke={ART_PALETTE.accent} strokeWidth="2"/>
      <rect x="30" y="100" width="220" height="70" rx="8" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      {[42,72,102,132,162,192,222].map((x,i)=>{
        const h = [22, 36, 28, 44, 30, 50, 38][i];
        return <rect key={i} x={x} y={160-h} width="18" height={h} rx="3"
          fill={i===5?ART_PALETTE.accent:ART_PALETTE.muted} opacity={i===5?1:.3}/>
      })}
    </ArtFrame>
  );
}

/* heart-pulse */
function ArtPulse({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g transform="translate(0 100)">
        <line x1="20" y1="0" x2="80" y2="0" stroke={ART_PALETTE.muted} strokeWidth="1" opacity=".3"/>
        <polyline points="80,0 95,0 105,-30 115,30 125,-50 135,40 145,0 165,0"
          fill="none" stroke={ART_PALETTE.accent} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"/>
        <line x1="165" y1="0" x2="260" y2="0" stroke={ART_PALETTE.muted} strokeWidth="1" opacity=".3"/>
        <circle cx="260" cy="0" r="5" fill={ART_PALETTE.accent}/>
        <circle cx="260" cy="0" r="11" fill="none" stroke={ART_PALETTE.accent} opacity=".4"/>
      </g>
      <circle cx="20" cy="100" r="6" fill={ART_PALETTE.accent}/>
    </ArtFrame>
  );
}

/* video play */
function ArtVideo({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="40" y="40" width="200" height="120" rx="12" fill={ART_PALETTE.ink} opacity=".92"/>
      <g transform="translate(140 100)">
        <circle r="34" fill="none" stroke={ART_PALETTE.accent} strokeWidth="2" opacity=".6"/>
        <circle r="26" fill={ART_PALETTE.accent}/>
        <polygon points="-8,-12 14,0 -8,12" fill="white"/>
      </g>
      <rect x="40" y="170" width="200" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="40" y="170" width="70" height="3" rx="1.5" fill={ART_PALETTE.accent}/>
    </ArtFrame>
  );
}

/* presentations */
function ArtSlides({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="50" y="50" width="180" height="110" rx="10" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <rect x="62" y="64" width="80" height="8" rx="3" fill={ART_PALETTE.ink}/>
      <rect x="62" y="80" width="120" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".3"/>
      <rect x="62" y="98" width="60" height="44" rx="5" fill={ART_PALETTE.accent}/>
      <rect x="130" y="98" width="90" height="20" rx="3" fill={ART_PALETTE.muted} opacity=".2"/>
      <rect x="130" y="122" width="70" height="20" rx="3" fill={ART_PALETTE.muted} opacity=".15"/>
      <g transform="translate(140 170)">
        {[-22,-11,0,11,22].map((x,i)=>(
          <circle key={i} cx={x} cy="0" r="3" fill={i===2?ART_PALETTE.accent:ART_PALETTE.muted} opacity={i===2?1:.3}/>
        ))}
      </g>
    </ArtFrame>
  );
}

/* gamification — controller cross */
function ArtGame({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g transform="translate(140 100)">
        <rect x="-50" y="-12" width="100" height="24" rx="6" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
        <rect x="-12" y="-50" width="24" height="100" rx="6" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
        <rect x="-46" y="-8" width="16" height="16" rx="3" fill={ART_PALETTE.accent}/>
        <rect x="30" y="-8" width="16" height="16" rx="3" fill={ART_PALETTE.muted} opacity=".4"/>
        <rect x="-8" y="-46" width="16" height="16" rx="3" fill={ART_PALETTE.muted} opacity=".4"/>
        <rect x="-8" y="30" width="16" height="16" rx="3" fill={ART_PALETTE.muted} opacity=".4"/>
      </g>
      <g transform="translate(220 50)">
        <polygon points="0,-12 4,-4 12,-4 6,2 8,10 0,5 -8,10 -6,2 -12,-4 -4,-4" fill={ART_PALETTE.accent}/>
      </g>
      <g transform="translate(50 160)">
        <polygon points="0,-8 3,-3 8,-3 4,1 6,7 0,4 -6,7 -4,1 -8,-3 -3,-3" fill={ART_PALETTE.accent} opacity=".4"/>
      </g>
    </ArtFrame>
  );
}

/* digital banners — three portrait variants (Bepanthen-style) */
function ArtBanner({ className }) {
  const BANNER_TOP = '#B8DFF5';
  const BANNER_MID = '#7EC8E8';
  const BANNER_BAR = '#1B6B9A';
  const frames = [
    { x: 38, accent: 0.95 },
    { x: 108, accent: 0.78 },
    { x: 178, accent: 0.62 },
  ];
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <defs>
        <linearGradient id="artBannerSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BANNER_TOP}/>
          <stop offset="100%" stopColor={BANNER_MID}/>
        </linearGradient>
      </defs>
      {frames.map(({ x, accent }, i) => (
        <g key={i} opacity={accent}>
          <rect x={x} y="36" width="64" height="118" rx="7"
            fill={ART_PALETTE.surface} stroke={ART_PALETTE.border} strokeWidth="1"/>
          <rect x={x + 4} y="40" width="56" height="52" rx="5" fill="url(#artBannerSky)"/>
          <circle cx={x + 32} cy="58" r="11" fill={ART_PALETTE.surface} opacity=".85"/>
          <rect x={x + 10} y="98" width="44" height="5" rx="2.5" fill={BANNER_BAR} opacity=".55"/>
          <rect x={x + 10} y="108" width="32" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".35"/>
          <rect x={x + 28} y="118" width="28" height="22" rx="4"
            fill={ART_PALETTE.surface} stroke={BANNER_BAR} strokeWidth=".8" opacity=".9"/>
          <rect x={x + 46} y="124" width="14" height="14" rx="7"
            fill={ART_PALETTE.accent} opacity=".35"/>
        </g>
      ))}
      <g>
        <rect x="18" y="148" width="92" height="36" rx="10"
          fill={ART_PALETTE.surface} stroke={ART_PALETTE.border} strokeWidth="1"/>
        <text x="34" y="174" fontFamily="var(--font-display), system-ui, sans-serif"
          fontSize="28" fontWeight="600" fill={ART_PALETTE.accent}>3</text>
        <text x="58" y="172" fontFamily="var(--font-mono), monospace"
          fontSize="9" fill={ART_PALETTE.muted} fontWeight="600" letterSpacing=".06em">КОНЦЕПЦИИ</text>
      </g>
      <g>
        <rect x="196" y="42" width="66" height="26" rx="13"
          fill={ART_PALETTE.accent} opacity=".92"/>
        <text x="229" y="59" textAnchor="middle" fontFamily="var(--font-mono), monospace"
          fontSize="10" fill="#fff" fontWeight="700">7 ДН</text>
      </g>
      <g>
        <rect x="196" y="76" width="66" height="26" rx="13"
          fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent} strokeWidth="1.2"/>
        <text x="229" y="93" textAnchor="middle" fontFamily="var(--font-mono), monospace"
          fontSize="10" fill={ART_PALETTE.accent} fontWeight="700">100%</text>
      </g>
      <circle cx="248" cy="168" r="18" fill={ART_PALETTE.accentSoft}/>
      <text x="248" y="173" textAnchor="middle" fontFamily="var(--font-mono), monospace"
        fontSize="8" fill={ART_PALETTE.accent} fontWeight="600">BAYER</text>
    </ArtFrame>
  );
}

/* sales rocket — launch */
function ArtLaunch({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <g>
        <line x1="40" y1="160" x2="240" y2="40" stroke={ART_PALETTE.accent} strokeWidth="2"/>
        <polygon points="240,40 224,44 232,56" fill={ART_PALETTE.accent}/>
        {[60, 100, 140, 180, 220].map((x, i)=> {
          const t = (x - 40) / 200;
          const y = 160 - t * 120;
          return <circle key={i} cx={x} cy={y} r={3 + i*0.4} fill={ART_PALETTE.surface} stroke={ART_PALETTE.accent} strokeWidth="1.5"/>
        })}
        <line x1="40" y1="160" x2="240" y2="160" stroke={ART_PALETTE.muted} strokeWidth="0.6" opacity=".4"/>
      </g>
      <text x="200" y="80" fontFamily="monospace" fontSize="11" fill={ART_PALETTE.accent} fontWeight="600">+340%</text>
    </ArtFrame>
  );
}

/* medical doc with chart */
function ArtDoc({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="60" y="30" width="160" height="150" rx="10" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <rect x="72" y="44" width="90" height="6" rx="3" fill={ART_PALETTE.ink}/>
      <rect x="72" y="56" width="120" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="72" y="64" width="100" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="72" y="80" width="136" height="50" rx="5" fill={ART_PALETTE.accentSoft}/>
      <polyline points="78,120 90,108 102,114 114,96 126,104 138,90 150,98 162,80 174,90 186,72 198,84"
        fill="none" stroke={ART_PALETTE.accent} strokeWidth="2"/>
      <rect x="72" y="140" width="60" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="72" y="148" width="80" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
      <rect x="72" y="156" width="50" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".4"/>
    </ArtFrame>
  );
}

/* tablet for eDetailing */
function ArtTablet({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="50" y="34" width="180" height="132" rx="10" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border} strokeWidth="1.5"/>
      <rect x="58" y="42" width="164" height="116" rx="5" fill={ART_PALETTE.bg}/>
      <rect x="66" y="50" width="60" height="100" rx="4" fill={ART_PALETTE.accent}/>
      <rect x="134" y="50" width="80" height="6" rx="3" fill={ART_PALETTE.ink}/>
      <rect x="134" y="62" width="60" height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".5"/>
      <rect x="134" y="76" width="80" height="40" rx="4" fill={ART_PALETTE.accentSoft}/>
      <rect x="134" y="124" width="50" height="20" rx="4" fill={ART_PALETTE.accent}/>
      <circle cx="240" cy="100" r="2" fill={ART_PALETTE.muted}/>
    </ArtFrame>
  );
}

/* molecule */
function ArtMolecule({ className }) {
  const pts = [
    [80, 60], [140, 50], [200, 70],
    [60, 120], [120, 110], [180, 130],
    [220, 100], [100, 160]
  ];
  const bonds = [[0,1],[1,2],[2,6],[1,4],[4,3],[4,5],[5,7],[3,7]];
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      {bonds.map(([a,b],i)=>(
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
          stroke={ART_PALETTE.muted} strokeWidth="1.6" opacity=".5"/>
      ))}
      {pts.map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i===1||i===4?9:7}
          fill={i===1?ART_PALETTE.accent:ART_PALETTE.surface}
          stroke={ART_PALETTE.accent} strokeWidth={i===4?2:1.4}/>
      ))}
    </ArtFrame>
  );
}

/* Home tiles — 3D icons blended into .tile-art gradient (64×64) */
function createHomeTileArt(src) {
  return function HomeTileArt({ className }) {
    return (
      <span className={className ? `home-tile-art ${className}` : 'home-tile-art'} aria-hidden="true">
        <img src={src} alt="" loading="lazy" decoding="async" />
      </span>
    );
  };
}

const ArtTileMarketing = createHomeTileArt('assets/uploads/tile-marketing.png');
const ArtTileHcp = createHomeTileArt('assets/uploads/tile-hcp.png');
const ArtTileSales = createHomeTileArt('assets/uploads/tile-sales.png');
const ArtTileContent = createHomeTileArt('assets/uploads/tile-content.png');
const ArtTileDirectory = createHomeTileArt('assets/uploads/tile-directory.png');
const ArtDirectoryTile = ArtTileDirectory;

/* directory — search list */
function ArtDirectory({ className }) {
  return (
    <ArtFrame className={className}>
      <rect width="280" height="200" fill={ART_PALETTE.bg} rx="14"/>
      <rect x="40" y="30" width="200" height="32" rx="8" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
      <circle cx="58" cy="46" r="5" fill="none" stroke={ART_PALETTE.muted} strokeWidth="1.4"/>
      <line x1="62" y1="50" x2="67" y2="55" stroke={ART_PALETTE.muted} strokeWidth="1.4"/>
      <rect x="74" y="44" width="100" height="4" rx="2" fill={ART_PALETTE.muted} opacity=".5"/>
      {[0,1,2].map(i=>(
        <g key={i} transform={`translate(40 ${74 + i*36})`}>
          <rect width="200" height="30" rx="7" fill={ART_PALETTE.surface} stroke={ART_PALETTE.border}/>
          <rect x="10" y="10" width={70 + i*10} height="4" rx="2" fill={i===0?ART_PALETTE.accent:ART_PALETTE.ink}/>
          <rect x="10" y="18" width={90 - i*8} height="3" rx="1.5" fill={ART_PALETTE.muted} opacity=".5"/>
          <circle cx="186" cy="15" r="3" fill={ART_PALETTE.accent} opacity={1-i*0.3}/>
        </g>
      ))}
    </ArtFrame>
  );
}

/* Team contacts — омниканальный хаб (телефон, почта, чат) */
function ArtTeamContacts({ className, alt }) {
  const altText = alt || 'Омниканальные каналы связи — телефон, почта и чат';
  return (
    <div className={className ? `team-contacts-art-wrap ${className}` : 'team-contacts-art-wrap'} aria-hidden="true">
      <img
        src="assets/uploads/team-contacts-art.png"
        alt={altText}
        className="team-contacts-art-img team-contacts-art-img--theme-light"
        width={1024}
        height={851}
        loading="lazy"
        decoding="async"
      />
      <img
        src="assets/uploads/team-contacts-art-dark.png"
        alt=""
        className="team-contacts-art-img team-contacts-art-img--theme-dark"
        width={1024}
        height={851}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* CRM feature block — 3D-иллюстрация омниканальной CRM */
function ArtCrmFeature({ className, alt }) {
  const altText = alt || 'CRM PharmConsilium — дашборд, HCP и омниканальные каналы связи';
  return (
    <div className={className ? `feature-crm-art-wrap ${className}` : 'feature-crm-art-wrap'} aria-hidden="true">
      <img
        src="assets/uploads/crm-feature.png"
        alt={altText}
        className="feature-crm-art feature-crm-art--theme-light"
        width={1024}
        height={764}
        loading="lazy"
        decoding="async"
      />
      <img
        src="assets/uploads/crm-feature-dark.png"
        alt=""
        className="feature-crm-art feature-crm-art--theme-dark"
        width={1024}
        height={764}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* big abstract for hero/feature */
function ArtConstellation({ className }) {
  return (
    <ArtFrame viewBox="0 0 400 320" className={className}>
      <defs>
        <radialGradient id="cglow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={ART_PALETTE.accent} stopOpacity=".25"/>
          <stop offset="100%" stopColor={ART_PALETTE.accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="140" r="120" fill="url(#cglow)"/>
      {Array.from({length: 30}).map((_, i) => {
        const a = (i / 30) * Math.PI * 2;
        const r = 30 + (i % 5) * 22;
        const x = 200 + Math.cos(a) * r;
        const y = 140 + Math.sin(a) * r * 0.6;
        return <circle key={i} cx={x} cy={y} r={1.5 + (i % 4) * 0.5}
          fill={ART_PALETTE.accent} opacity={0.3 + (i % 5) * 0.12}/>
      })}
      <circle cx="200" cy="140" r="8" fill={ART_PALETTE.accent}/>
      <circle cx="200" cy="140" r="16" fill="none" stroke={ART_PALETTE.accent} opacity=".5"/>
    </ArtFrame>
  );
}

Object.assign(window, {
  ArtNodes, ArtLayers, ArtChat, ArtBrowser, ArtPhone, ArtRadar, ArtAI, ArtBooks,
  ArtDashboard, ArtPulse, ArtVideo, ArtSlides, ArtGame, ArtBanner, ArtLaunch, ArtDoc,
  ArtTablet, ArtMolecule, ArtDirectory,
  ArtTileMarketing, ArtTileHcp, ArtTileSales, ArtTileContent, ArtTileDirectory, ArtDirectoryTile,
  ArtConstellation, ArtCrmFeature, ArtTeamContacts,
});
