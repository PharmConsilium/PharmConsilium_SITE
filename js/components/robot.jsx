// RobotCompanion — image-based companion that drifts very smoothly across
// the viewport in response to scroll. Position is held in a ref so it
// persists across page navigation — no jumping.

function RobotCompanion() {
  const wrapRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const posRef = React.useRef(null);   // current actual position { x, y, ry, s }
  const targetRef = React.useRef(null); // target derived from scroll
  const hasInit = React.useRef(false);

  // Compute waypoints in pixels from the current viewport size.
  const buildWaypoints = React.useCallback(() => {
    const halfW = Math.max(180, window.innerWidth / 2 - 140);
    const halfH = Math.max(180, window.innerHeight / 2 - 140);
    // Each waypoint: x, y in pixels from screen center, rotation deg, scale.
    return [
      { x:  0.85 * halfW, y: -0.45 * halfH, ry: -10, s: 0.95 }, // 0: top-right (hero)
      { x:  0.92 * halfW, y:  0.20 * halfH, ry:  -5, s: 0.90 }, // 0.14
      { x: -0.85 * halfW, y: -0.10 * halfH, ry:   8, s: 1.05 }, // 0.28: left
      { x:  0.00 * halfW, y: -0.60 * halfH, ry:   0, s: 1.20 }, // 0.42: top-center big
      { x: -0.80 * halfW, y:  0.45 * halfH, ry:   6, s: 0.95 }, // 0.57
      { x:  0.80 * halfW, y:  0.40 * halfH, ry:  -6, s: 0.95 }, // 0.71
      { x: -0.40 * halfW, y:  0.55 * halfH, ry:   3, s: 0.95 }, // 0.85
      { x:  0.55 * halfW, y: -0.20 * halfH, ry:  -4, s: 1.00 }, // 1.0
    ];
  }, []);

  const computeTarget = React.useCallback(() => {
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const sp = Math.max(0, Math.min(1, window.scrollY / max));
    const wps = buildWaypoints();
    const seg = sp * (wps.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    const ease = 0.5 - 0.5 * Math.cos(Math.PI * f);
    const a = wps[i];
    const b = wps[Math.min(wps.length - 1, i + 1)];
    return {
      x:  a.x  + (b.x  - a.x)  * ease,
      y:  a.y  + (b.y  - a.y)  * ease,
      ry: a.ry + (b.ry - a.ry) * ease,
      s:  a.s  + (b.s  - a.s)  * ease,
    };
  }, [buildWaypoints]);

  React.useEffect(() => {
    // Initialize current position to first computed target on first mount.
    if (!hasInit.current) {
      const t = computeTarget();
      posRef.current = { ...t };
      targetRef.current = { ...t };
      hasInit.current = true;
    }

    const onScroll = () => {
      targetRef.current = computeTarget();
    };
    const onResize = () => {
      targetRef.current = computeTarget();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    let raf;
    let t0 = performance.now();

    const animate = (now) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      // Very slow exponential approach — half-life ~1.2s for buttery drift.
      const k = 0.55;
      const alpha = 1 - Math.exp(-k * dt);

      const p = posRef.current;
      const t = targetRef.current;
      p.x  += (t.x  - p.x)  * alpha;
      p.y  += (t.y  - p.y)  * alpha;
      p.ry += (t.ry - p.ry) * alpha;
      p.s  += (t.s  - p.s)  * alpha;

      const el = wrapRef.current;
      const body = bodyRef.current;
      if (el) {
        el.style.transform =
          `translate(calc(-50% + ${p.x}px),` +
          ` calc(-50% + ${p.y}px))` +
          ` rotate(${p.ry}deg)`;
        el.style.opacity = '1';
      }
      if (body) body.style.transform = `scale(${p.s})`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeTarget]);

  // Цикл лиц Robby_1…10 — только у плавающего робота; карточка «Команда» — отдельные team-robbie*.png
  const RobbieFaceCycle = window.RobbieFaceCycle;

  const baseSrc = window.ROBBY_FRAME_SRC
    ? window.ROBBY_FRAME_SRC(window.ROBBY_BLANK_FRAME || 1)
    : 'assets/uploads/Robby_1.png';
  const outlineSrc = window.ROBBY_OUTLINE_SRC || 'assets/uploads/Robby_11.png?v=4';

  return (
    <div ref={wrapRef} className="robot-img" aria-hidden="true">
      <div ref={bodyRef} className="robot-img-body">
        <img
          className="robot-img-base"
          src={baseSrc}
          alt=""
          aria-hidden="true"
          draggable="false"
          decoding="async"
        />
        {RobbieFaceCycle ?
          <RobbieFaceCycle
            alt=""
            className="robot-face-cycle robot-face-cycle--lighten"
          /> :
          null}
        <img
          className="robot-img-glow"
          src={outlineSrc}
          alt=""
          aria-hidden="true"
          draggable="false"
          decoding="async"
        />
      </div>
    </div>
  );
}

window.RobotCompanion = RobotCompanion;
