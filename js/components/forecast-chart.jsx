// ForecastChart — animated dots streaming L→R with norm bands & forecast tail.
// Three scenarios: organic, with-comms, full-launch.

function ForecastChart({ scenario = 'comms' }) {
  const canvasRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [hover, setHover] = React.useState(null);
  const stateRef = React.useRef({ t: 0, points: [], scenario, last: 0 });
  stateRef.current.scenario = scenario;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, running = true;

    const sizeCanvas = () => {
      const r = wrap.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();
    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(wrap);

    // Scenario shape functions (return target value 0..1 over normalized x 0..1)
    const shapes = {
      organic: (x) => 0.38 + Math.sin(x * 4.2) * 0.05 + x * 0.05,
      comms:   (x) => 0.32 + x * 0.34 + Math.sin(x * 3.2) * 0.06,
      launch:  (x) => 0.22 + Math.pow(x, 0.7) * 0.62 + Math.sin(x * 2.6) * 0.05,
    };

    // Seeded smooth noise
    const noise = (x) => {
      const a = Math.sin(x * 12.9898) * 43758.5453;
      return (a - Math.floor(a)) * 2 - 1;
    };

    const COLORS = () => {
      const cs = getComputedStyle(document.documentElement);
      return {
        accent: cs.getPropertyValue('--accent').trim() || '#6E4BFF',
        surface: cs.getPropertyValue('--surface').trim() || '#fff',
        ink: cs.getPropertyValue('--ink').trim() || '#0B0F19',
        muted: cs.getPropertyValue('--muted').trim() || '#5A6273',
        soft: cs.getPropertyValue('--accent-soft').trim() || '#EEE9FF',
        border: cs.getPropertyValue('--border').trim() || 'rgba(0,0,0,.1)',
      };
    };

    const draw = (now) => {
      if (!running) return;
      const C = COLORS();
      const r = wrap.getBoundingClientRect();
      const W = r.width, H = r.height;
      const padL = 40, padR = 18, padT = 18, padB = 30;
      const innerW = W - padL - padR;
      const innerH = H - padT - padB;

      const dt = Math.min((now - stateRef.current.last) / 1000 || 0.016, 0.05);
      stateRef.current.last = now;
      stateRef.current.t += dt * 0.06; // scrolling speed

      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padT + (innerH / 4) * i;
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      }

      // y-axis labels
      ctx.fillStyle = C.muted;
      ctx.font = '10px ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      ['100', '75', '50', '25', '0'].forEach((lbl, i) => {
        ctx.fillText(lbl, 8, padT + (innerH / 4) * i);
      });

      // x-axis labels (months)
      ctx.textBaseline = 'top';
      const months = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];
      for (let i = 0; i < 12; i++) {
        const x = padL + (innerW / 11) * i;
        ctx.fillText(months[i], x - 3, H - padB + 8);
      }

      // Compute envelope based on scenario
      const shape = shapes[stateRef.current.scenario] || shapes.comms;
      const t = stateRef.current.t;

      // Norm bands (upper / lower)
      const bandPts = [];
      for (let i = 0; i <= 80; i++) {
        const u = i / 80;
        const v = shape(u);
        bandPts.push({ u, hi: v + 0.10, lo: v - 0.10, mid: v });
      }
      // Draw band area
      ctx.fillStyle = C.soft;
      ctx.beginPath();
      bandPts.forEach((p, i) => {
        const x = padL + p.u * innerW;
        const y = padT + (1 - Math.min(1, Math.max(0, p.hi))) * innerH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      for (let i = bandPts.length - 1; i >= 0; i--) {
        const p = bandPts[i];
        const x = padL + p.u * innerW;
        const y = padT + (1 - Math.min(1, Math.max(0, p.lo))) * innerH;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Upper & lower lines
      ctx.lineWidth = 1;
      ['hi','lo'].forEach((k) => {
        ctx.strokeStyle = C.accent;
        ctx.globalAlpha = 0.32;
        ctx.beginPath();
        bandPts.forEach((p, i) => {
          const x = padL + p.u * innerW;
          const y = padT + (1 - Math.min(1, Math.max(0, p[k]))) * innerH;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // "Now" line at 0.6
      const nowX = padL + innerW * 0.6;
      ctx.strokeStyle = C.ink;
      ctx.globalAlpha = 0.22;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(nowX, padT); ctx.lineTo(nowX, H - padB); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      ctx.fillStyle = C.ink;
      ctx.globalAlpha = 0.55;
      ctx.font = '10px ui-monospace, monospace';
      ctx.fillText('сегодня', nowX + 5, padT + 4);
      ctx.globalAlpha = 1;

      // Streaming points: a moving phase shifts the points L→R
      const pointCount = 56;
      const past = [];
      const future = [];
      for (let i = 0; i < pointCount; i++) {
        const u0 = i / (pointCount - 1);
        const u = (u0 + t * 0.08) % 1;
        const v = shape(u) + noise(u * 60 + 7) * 0.04;
        const x = padL + u * innerW;
        const y = padT + (1 - Math.min(1, Math.max(0, v))) * innerH;
        const isFuture = x > nowX;
        (isFuture ? future : past).push({ x, y, u, v, i });
      }

      // Past — solid line
      past.sort((a, b) => a.x - b.x);
      ctx.lineWidth = 2;
      ctx.strokeStyle = C.accent;
      ctx.beginPath();
      past.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke();

      // Future — dashed
      future.sort((a, b) => a.x - b.x);
      ctx.setLineDash([4, 6]);
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      if (past.length) {
        const lp = past[past.length - 1];
        ctx.moveTo(lp.x, lp.y);
      }
      future.forEach((p) => { ctx.lineTo(p.x, p.y); });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Dots
      past.forEach((p, i) => {
        const fade = i / past.length;
        ctx.globalAlpha = 0.4 + fade * 0.6;
        ctx.fillStyle = C.accent;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      future.forEach((p, i) => {
        ctx.fillStyle = C.surface;
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });

      // Leading dot at end (pulsing)
      const lead = future[future.length - 1] || past[past.length - 1];
      if (lead) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 300);
        ctx.fillStyle = C.accent;
        ctx.globalAlpha = 0.3 + pulse * 0.3;
        ctx.beginPath(); ctx.arc(lead.x, lead.y, 9 + pulse * 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(lead.x, lead.y, 4, 0, Math.PI * 2); ctx.fill();
      }

      // Latest "now" big marker
      const nowPt = past[past.length - 1];
      if (nowPt) {
        ctx.fillStyle = C.surface;
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(nowPt.x, nowPt.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="fc-canvas-wrap">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

window.ForecastChart = ForecastChart;
