// RobotCompanion — image-based companion that drifts very smoothly across
// the viewport in response to scroll. Position is held in a ref so it
// persists across page navigation — no jumping.

function RobotCompanion() {
  const wrapRef = React.useRef(null);
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
      const time = now * 0.001;

      // Very slow exponential approach — half-life ~1.2s for buttery drift.
      // alpha = 1 - exp(-k*dt), with k ~= 0.6 → 45% of distance per second.
      const k = 0.55;
      const alpha = 1 - Math.exp(-k * dt);

      const p = posRef.current;
      const t = targetRef.current;
      p.x  += (t.x  - p.x)  * alpha;
      p.y  += (t.y  - p.y)  * alpha;
      p.ry += (t.ry - p.ry) * alpha;
      p.s  += (t.s  - p.s)  * alpha;

      // Subtle idle motion (slow + small)
      const bobY  = Math.sin(time * 0.50) * 9;
      const bobX  = Math.sin(time * 0.34) * 5;
      const tilt  = Math.sin(time * 0.45) * 1.6;
      const glow  = 0.85 + Math.sin(time * 0.8) * 0.15;

      const el = wrapRef.current;
      if (el) {
        el.style.transform =
          `translate(calc(-50% + ${p.x + bobX}px),` +
          ` calc(-50% + ${p.y + bobY}px))` +
          ` rotate(${p.ry + tilt}deg) scale(${p.s})`;
        el.style.opacity = String(glow);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeTarget]);

  return (
    <div ref={wrapRef} className="robot-img" aria-hidden="true">
      <img src="assets/uploads/Bot_1.png" alt="Виртуальный помощник ФармКонсилиум" draggable="false"/>
    </div>
  );
}

window.RobotCompanion = RobotCompanion;
