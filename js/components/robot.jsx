// RobotCompanion — image-based companion that drifts very smoothly across
// the viewport in response to scroll. Position is held in a ref so it
// persists across page navigation — no jumping.

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/** Настроение по разделу: data-robot-mood + кадр лица при смене route */
const ROBOT_MOODS = {
  home: { mood: 'home', face: 2 },
  marketing: { mood: 'marketing', face: 4 },
  hcp: { mood: 'hcp', face: 6 },
  sales: { mood: 'sales', face: 8 },
  content: { mood: 'content', face: 3 },
  directory: { mood: 'directory', face: 9 },
  team: { mood: 'team', face: 5 },
  portfolio: { mood: 'portfolio', face: 7 },
  privacy: { mood: 'default', face: 2 },
};

function robotSectionFromRoute(route) {
  const r = String(route || 'home').split('/')[0] || 'home';
  return ROBOT_MOODS[r] ? r : 'home';
}

function fireRobotFace(frame, duration) {
  if (window.pharmRobotFace) window.pharmRobotFace(frame, duration);
  else {
    window.dispatchEvent(new CustomEvent('pharm:robot-face', {
      detail: { frame, duration },
    }));
  }
}

function robotRadiusPx() {
  const vw = window.innerWidth;
  if (vw <= 720) return 52;
  if (vw <= 1024) return 60;
  return 72;
}

function robotBounds(radius) {
  const pad = 10;
  const maxX = Math.max(40, window.innerWidth / 2 - radius - pad);
  const maxY = Math.max(40, window.innerHeight / 2 - radius - pad);
  return { minX: -maxX, maxX, minY: -maxY, maxY };
}

function clientToOffset(clientX, clientY, radius) {
  const b = robotBounds(radius);
  return {
    x: clamp(clientX - window.innerWidth / 2, b.minX, b.maxX),
    y: clamp(clientY - window.innerHeight / 2, b.minY, b.maxY),
  };
}

function bounceVelocity(vx, vy, nx, ny, restitution) {
  const dot = vx * nx + vy * ny;
  if (dot >= 0) return { vx, vy };
  const e = restitution;
  return {
    vx: vx - (1 + e) * dot * nx,
    vy: vy - (1 + e) * dot * ny,
  };
}

function resolveCircleRect(cx, cy, radius, rect) {
  const closestX = clamp(cx, rect.left, rect.right);
  const closestY = clamp(cy, rect.top, rect.bottom);
  let nx = cx - closestX;
  let ny = cy - closestY;
  const distSq = nx * nx + ny * ny;
  if (distSq >= radius * radius) return null;
  const dist = Math.sqrt(distSq) || 0.0001;
  nx /= dist;
  ny /= dist;
  return { nx, ny, overlap: radius - dist };
}

function refreshRobotObstacles(store) {
  const now = performance.now();
  if (now - store.obstaclesAt < 450) return store.obstacles;
  store.obstaclesAt = now;
  const pad = 6;
  const sel = 'a[href], button, .btn, input:not([type="hidden"]), textarea, select, [role="button"]';
  const out = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (el.closest('.robot-img, .contact-modal-backdrop, .twk-panel')) return;
    const st = window.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) < 0.05) return;
    if (st.pointerEvents === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 28 || r.height < 18) return;
    if (r.bottom < -24 || r.top > window.innerHeight + 24) return;
    out.push({
      left: r.left - pad,
      right: r.right + pad,
      top: r.top - pad,
      bottom: r.bottom + pad,
    });
  });
  store.obstacles = out;
  return out;
}

function RobotCompanion() {
  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const faceRef = React.useRef(null);
  const posRef = React.useRef(null);   // current actual position { x, y, ry, s }
  const targetRef = React.useRef(null); // target derived from scroll
  const velRef = React.useRef({ vx: 0, vy: 0 });
  const lookRef = React.useRef({ x: 0, y: 0 });
  const busyRef = React.useRef(false);
  const hasInit = React.useRef(false);
  const dockCopyRef = React.useRef(false);
  const dockLatchRef = React.useRef(false);
  const interactRef = React.useRef({
    mode: 'scroll',
    vx: 0,
    vy: 0,
    still: 0,
    lastClientX: 0,
    lastClientY: 0,
    lastT: 0,
    obstacles: [],
    obstaclesAt: 0,
  });
  const [facePaused, setFacePaused] = React.useState(false);
  const reducedMotionRef = React.useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const computeDock = React.useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isPhone = vw <= 720;
    const inset = isPhone ? 52 : 68;
    const half = isPhone ? 65 : 75;
    return {
      x: vw / 2 - inset - half,
      y: -vh / 2 + inset + half,
      ry: -8,
      s: 0.88,
    };
  }, []);

  // Compute waypoints in pixels from the current viewport size.
  const buildWaypoints = React.useCallback(() => {
    const vw = window.innerWidth;
    const isTablet = vw <= 1024;
    const isPhone = vw <= 720;
    const edgeX = isPhone ? 72 : isTablet ? 96 : 140;
    const edgeY = isPhone ? 72 : isTablet ? 96 : 140;
    const travelX = isTablet ? 0.62 : 1;
    const travelY = isTablet ? 0.72 : 1;
    const halfW = Math.max(isPhone ? 48 : 100, window.innerWidth / 2 - edgeX) * travelX;
    const halfH = Math.max(isPhone ? 48 : 100, window.innerHeight / 2 - edgeY) * travelY;
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
      // Позиция — плавно; scale — ещё медленнее, без дёрганья при скролле.
      const alpha = 1 - Math.exp(-0.55 * dt);
      const alphaScale = 1 - Math.exp(-0.12 * dt);

      const p = posRef.current;
      const t = targetRef.current;
      const ix = interactRef.current;
      const radius = robotRadiusPx();
      const prevX = p.x;
      const prevY = p.y;

      if (ix.mode === 'free') {
        p.x += ix.vx * dt;
        p.y += ix.vy * dt;
        const damp = Math.exp(-1.15 * dt);
        ix.vx *= damp;
        ix.vy *= damp;

        const b = robotBounds(radius);
        const rest = 0.74;
        if (p.x < b.minX) {
          p.x = b.minX;
          const bounced = bounceVelocity(ix.vx, ix.vy, 1, 0, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        } else if (p.x > b.maxX) {
          p.x = b.maxX;
          const bounced = bounceVelocity(ix.vx, ix.vy, -1, 0, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        }
        if (p.y < b.minY) {
          p.y = b.minY;
          const bounced = bounceVelocity(ix.vx, ix.vy, 0, 1, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        } else if (p.y > b.maxY) {
          p.y = b.maxY;
          const bounced = bounceVelocity(ix.vx, ix.vy, 0, -1, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        }

        const cx = window.innerWidth / 2 + p.x;
        const cy = window.innerHeight / 2 + p.y;
        const obstacles = refreshRobotObstacles(ix);
        for (let n = 0; n < 3; n++) {
          let hit = false;
          for (let i = 0; i < obstacles.length; i++) {
            const res = resolveCircleRect(cx, cy, radius, obstacles[i]);
            if (!res) continue;
            hit = true;
            p.x += res.nx * res.overlap;
            p.y += res.ny * res.overlap;
            const bounced = bounceVelocity(ix.vx, ix.vy, res.nx, res.ny, 0.68);
            ix.vx = bounced.vx;
            ix.vy = bounced.vy;
          }
          if (!hit) break;
        }

        const speed = Math.hypot(ix.vx, ix.vy);
        if (speed < 55) ix.still += dt;
        else ix.still = 0;
        if (ix.still > 1.4) {
          ix.mode = 'scroll';
          ix.still = 0;
          ix.vx = 0;
          ix.vy = 0;
        }
      } else if (ix.mode !== 'drag') {
        const goal = dockCopyRef.current ? computeDock() : t;
        p.x  += (goal.x  - p.x)  * alpha;
        p.y  += (goal.y  - p.y)  * alpha;
        p.ry += (goal.ry - p.ry) * alpha;
        p.s  += (goal.s  - p.s)  * alphaScale;
      }

      const v = velRef.current;
      const invDt = dt > 0.0001 ? 1 / dt : 0;
      const rawVx = ix.mode === 'free' ? ix.vx : (p.x - prevX) * invDt;
      const rawVy = ix.mode === 'free' ? ix.vy : (p.y - prevY) * invDt;
      const vAlpha = 1 - Math.exp(-10 * dt);
      v.vx += (rawVx - v.vx) * vAlpha;
      v.vy += (rawVy - v.vy) * vAlpha;

      const reduced = reducedMotionRef.current;
      const bankY = reduced ? 0 : clamp(v.vx * 0.045, -14, 14);
      const bankX = reduced ? 0 : clamp(-v.vy * 0.032, -10, 10);
      const look = lookRef.current;
      const lookAlpha = reduced ? 0 : 1 - Math.exp(-6 * dt);
      const lookX = reduced ? 0 : look.x * lookAlpha;
      const lookY = reduced ? 0 : look.y * lookAlpha;
      const tiltY = p.ry + bankY + lookX;
      const tiltX = bankX + lookY;
      const faceShiftX = reduced ? 0 : clamp(v.vx * 0.018, -5, 5);
      const faceShiftY = reduced ? 0 : clamp(v.vy * 0.014, -4, 4);
      const displayScale = reduced ? p.s : clamp(p.s, 0.9, 1.2);
      const busy = busyRef.current;
      const busyX = busy ? (window.innerWidth <= 720 ? 88 : 128) : 0;
      const busyY = busy ? (window.innerWidth <= 720 ? -72 : -108) : 0;
      const busyOpacity = busy ? 0.36 : 1;
      const busyScale = busy ? 0.84 : 1;

      const el = wrapRef.current;
      const stage = stageRef.current;
      const body = bodyRef.current;
      const face = faceRef.current;
      if (el) {
        el.style.transform =
          `translate3d(calc(-50% + ${p.x + busyX}px), calc(-50% + ${p.y + busyY}px), 0)`;
        el.style.opacity = String(busyOpacity);
      }
      if (stage) {
        stage.style.transform =
          `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
      if (body) body.style.transform = `scale(${(displayScale * busyScale).toFixed(4)})`;
      if (face) {
        face.style.transform =
          `translate3d(${faceShiftX.toFixed(2)}px, ${faceShiftY.toFixed(2)}px, 16px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeTarget, computeDock]);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotionRef.current = mq.matches;
      wrapRef.current?.classList.toggle('robot-img--reduced-motion', mq.matches);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const canInteract = React.useCallback(() => {
    return !reducedMotionRef.current && !busyRef.current && !dockCopyRef.current;
  }, []);

  const onHitPointerDown = React.useCallback((e) => {
    if (!canInteract()) return;
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.preventDefault();
    e.stopPropagation();
    const p = posRef.current;
    const ix = interactRef.current;
    const off = clientToOffset(e.clientX, e.clientY, robotRadiusPx());
    p.x = off.x;
    p.y = off.y;
    ix.mode = 'drag';
    ix.vx = 0;
    ix.vy = 0;
    ix.still = 0;
    ix.lastClientX = e.clientX;
    ix.lastClientY = e.clientY;
    ix.lastT = performance.now();
    lookRef.current = { x: 0, y: 0 };
    wrapRef.current?.classList.add('robot-img--dragging');
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) { /* ignore */ }
  }, [canInteract]);

  const onHitPointerMove = React.useCallback((e) => {
    const ix = interactRef.current;
    if (ix.mode !== 'drag') return;
    e.preventDefault();
    const p = posRef.current;
    const now = performance.now();
    const dt = Math.max(0.001, (now - ix.lastT) / 1000);
    const off = clientToOffset(e.clientX, e.clientY, robotRadiusPx());
    const dx = off.x - p.x;
    const dy = off.y - p.y;
    ix.vx = dx / dt;
    ix.vy = dy / dt;
    p.x = off.x;
    p.y = off.y;
    ix.lastClientX = e.clientX;
    ix.lastClientY = e.clientY;
    ix.lastT = now;
  }, []);

  const onHitPointerUp = React.useCallback((e) => {
    const ix = interactRef.current;
    if (ix.mode !== 'drag') return;
    wrapRef.current?.classList.remove('robot-img--dragging');
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) { /* ignore */ }
    const speed = Math.hypot(ix.vx, ix.vy);
    const max = 2400;
    if (speed > max) {
      ix.vx = (ix.vx / speed) * max;
      ix.vy = (ix.vy / speed) * max;
    }
    if (speed > 180) fireRobotFace(3, 900);
    ix.mode = speed > 35 ? 'free' : 'scroll';
    ix.still = 0;
  }, []);

  // Лёгкий поворот «к курсору» на десктопе
  React.useEffect(() => {
    const onMove = (e) => {
      if (window.innerWidth <= 960 || reducedMotionRef.current || interactRef.current.mode !== 'scroll') {
        lookRef.current = { x: 0, y: 0 };
        return;
      }
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / Math.max(rect.width, 1);
      const dy = (e.clientY - cy) / Math.max(rect.height, 1);
      const dist = Math.hypot(dx, dy);
      if (dist > 1.65) {
        lookRef.current = { x: 0, y: 0 };
        return;
      }
      const falloff = 1 - dist / 1.65;
      lookRef.current = {
        x: clamp(dx * 14 * falloff, -14, 14),
        y: clamp(dy * 9 * falloff, -9, 9),
      };
    };
    const onLeave = () => { lookRef.current = { x: 0, y: 0 }; };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const applyRouteMood = React.useCallback((route) => {
    const section = robotSectionFromRoute(route);
    const cfg = ROBOT_MOODS[section] || ROBOT_MOODS.home;
    const wrap = wrapRef.current;
    if (wrap) wrap.setAttribute('data-robot-mood', cfg.mood);
    fireRobotFace(cfg.face, section === 'team' ? 4800 : 2600);
  }, []);

  React.useEffect(() => {
    const onRoute = (e) => {
      const route = e.detail?.route || 'home';
      applyRouteMood(route);
    };
    window.addEventListener('pharm:routechange', onRoute);
    applyRouteMood(window.location.pathname.replace(/^\//, '') || 'home');
    return () => window.removeEventListener('pharm:routechange', onRoute);
  }, [applyRouteMood]);

  React.useEffect(() => {
    if (reducedMotionRef.current) return undefined;
    let blinkTimer;
    const scheduleBlink = () => {
      const wait = 9000 + Math.random() * 11000;
      blinkTimer = window.setTimeout(() => {
        if (!busyRef.current && !document.hidden) {
          if (window.pharmRobotBlink) window.pharmRobotBlink();
          else fireRobotFace(1, 130);
        }
        scheduleBlink();
      }, wait);
    };
    scheduleBlink();
    return () => { if (blinkTimer) window.clearTimeout(blinkTimer); };
  }, []);

  React.useEffect(() => {
    const syncBusy = () => {
      const busy =
        document.body.classList.contains('is-detail-slide-lightbox-open') ||
        !!document.querySelector('.contact-modal-backdrop');
      busyRef.current = busy;
      const hidden = document.hidden;
      setFacePaused(busy || hidden);
      wrapRef.current?.classList.toggle('robot-img--busy', busy);
    };
    syncBusy();
    const mo = new MutationObserver(syncBusy);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
      childList: true,
    });
    const onVis = () => syncBusy();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  React.useEffect(() => {
    const onContact = () => {
      if (reducedMotionRef.current) return;
      fireRobotFace(7, 2800);
    };
    window.addEventListener('pharm:robot-contact', onContact);
    return () => window.removeEventListener('pharm:robot-contact', onContact);
  }, []);

  // На узком экране уводим робота в верхний угол над текстом контактов (не скрываем)
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let io = null;
    let target = null;

    const syncFromEntry = (entry) => {
      const narrow = window.innerWidth <= 960;
      if (!narrow) {
        dockLatchRef.current = false;
        dockCopyRef.current = false;
        return;
      }
      const ratio = entry ? entry.intersectionRatio : 0;
      const visible = entry ? entry.isIntersecting : false;
      if (!dockLatchRef.current && visible && ratio >= 0.1) {
        dockLatchRef.current = true;
      } else if (dockLatchRef.current && (!visible || ratio <= 0.02)) {
        dockLatchRef.current = false;
      }
      dockCopyRef.current = dockLatchRef.current;
    };

    const unbind = () => {
      if (io) io.disconnect();
      io = null;
      target = null;
      dockLatchRef.current = false;
      dockCopyRef.current = false;
    };

    const bind = () => {
      const contacts = document.querySelector('[data-contacts-copy]');
      if (contacts === target) return;
      unbind();
      if (!contacts) return;
      target = contacts;
      io = new IntersectionObserver(
        ([entry]) => syncFromEntry(entry),
        { threshold: [0, 0.02, 0.06, 0.1, 0.18, 0.3] }
      );
      io.observe(contacts);
      const rect = contacts.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
      const ratio = visible
        ? Math.min(1, Math.max(0, (Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / Math.max(rect.height, 1)))
        : 0;
      syncFromEntry({ isIntersecting: visible, intersectionRatio: ratio });
    };

    bind();
    const root = document.getElementById('root');
    const mo = root ? new MutationObserver(bind) : null;
    if (mo && root) mo.observe(root, { childList: true, subtree: true });

    const onResize = () => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
      const ratio = visible
        ? Math.min(1, Math.max(0, (Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / Math.max(rect.height, 1)))
        : 0;
      syncFromEntry({ isIntersecting: visible, intersectionRatio: ratio });
    };
    const onRoute = () => { window.setTimeout(bind, 0); };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pharm:routechange', onRoute);

    return () => {
      mo?.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pharm:routechange', onRoute);
      unbind();
    };
  }, []);

  // Цикл лиц Robby_1…10 — только у плавающего робота; карточка «Команда» — отдельные team-robbie*.png
  const RobbieFaceCycle = window.RobbieFaceCycle;

  const baseSrc = window.ROBBY_FRAME_SRC
    ? window.ROBBY_FRAME_SRC(window.ROBBY_BLANK_FRAME || 1)
    : 'assets/uploads/Robby_1.png';
  const outlineSrc = window.ROBBY_OUTLINE_SRC || 'assets/uploads/Robby_11.png?v=4';

  const robotNode = (
    <div ref={wrapRef} className="robot-img" data-robot-mood="home" aria-hidden="true">
      <div
        className="robot-img-hit"
        aria-hidden="true"
        onPointerDown={onHitPointerDown}
        onPointerMove={onHitPointerMove}
        onPointerUp={onHitPointerUp}
        onPointerCancel={onHitPointerUp}
      />
      <div ref={stageRef} className="robot-img-stage">
        <div ref={bodyRef} className="robot-img-body">
          <div className="robot-img-float">
            <div className="robot-img-layer robot-img-layer--base">
              <img
                className="robot-img-base"
                src={baseSrc}
                alt=""
                aria-hidden="true"
                draggable="false"
                decoding="async"
              />
            </div>
            <div ref={faceRef} className="robot-img-layer robot-img-layer--face">
              {RobbieFaceCycle ?
                <RobbieFaceCycle
                  alt=""
                  className="robot-face-cycle robot-face-cycle--lighten"
                  paused={facePaused}
                /> :
                null}
            </div>
            <div className="robot-img-layer robot-img-layer--glow">
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
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(robotNode, document.body)
    : robotNode;
}

window.RobotCompanion = RobotCompanion;
