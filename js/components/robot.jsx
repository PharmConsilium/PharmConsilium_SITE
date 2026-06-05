// RobotCompanion — image-based companion that drifts very smoothly across
// the viewport in response to scroll. Position is held in a ref so it
// persists across page navigation — no jumping.

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/** Настроение по разделу: data-robot-mood + кадр лица при смене route */
const ROBOT_MOODS = {
  home: { mood: 'home', face: 2 },
  'pharma-marketing': { mood: 'pharma-marketing', face: 4 },
  healthcare: { mood: 'healthcare', face: 6 },
  outsourcing: { mood: 'outsourcing', face: 8 },
  design: { mood: 'design', face: 3 },
  'drug-directory': { mood: 'drug-directory', face: 9 },
  about: { mood: 'about', face: 5 },
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

/** Позиция центра робота: палец/курсор минус точка захвата на спрайте */
function pointerToRobotPos(clientX, clientY, grabDx, grabDy, radius) {
  const b = robotBounds(radius);
  return {
    x: clamp(clientX - window.innerWidth / 2 - grabDx, b.minX, b.maxX),
    y: clamp(clientY - window.innerHeight / 2 - grabDy, b.minY, b.maxY),
  };
}

const ROBOT_ANGRY_MS = 3000;
const ROBOT_BLANK_AFTER_ANGRY_MS = 950;
const ROBOT_HELD_SCALE = 1.09;
const ROBOT_THROW_MIN_SPEED = 35;
const ROBOT_THROW_ANGRY_MIN_SPEED = 120;

function robbieAssetSrc(file) {
  const v = window.ROBBY_ASSET_V || '4';
  return `assets/uploads/${file}?v=${v}`;
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
    grabDx: 0,
    grabDy: 0,
    pendingAngry: false,
    bounces: 0,
    bounceCooldown: 0,
  });
  const poseRef = React.useRef('normal');
  const angryUntilRef = React.useRef(0);
  const blankUntilRef = React.useRef(0);
  const [pose, setPose] = React.useState('normal');
  const [surprisePop, setSurprisePop] = React.useState(null);
  const surpriseTimerRef = React.useRef(null);
  const [facePaused, setFacePaused] = React.useState(false);
  const reducedMotionRef = React.useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const setRobotPose = React.useCallback((next) => {
    if (poseRef.current === next) return;
    poseRef.current = next;
    setPose(next);
    const wrap = wrapRef.current;
    if (wrap) wrap.setAttribute('data-robot-pose', next);
    const pauseFace = next === 'held' || next === 'angry' || next === 'blank';
    setFacePaused(pauseFace || busyRef.current || document.hidden);
  }, []);

  const startBlankAfterAngry = React.useCallback(() => {
    angryUntilRef.current = 0;
    blankUntilRef.current = performance.now() + ROBOT_BLANK_AFTER_ANGRY_MS;
    setRobotPose('blank');
    fireRobotFace(window.ROBBY_BLANK_FRAME || 1, ROBOT_BLANK_AFTER_ANGRY_MS + 120);
  }, [setRobotPose]);

  const triggerAngry = React.useCallback(() => {
    if (poseRef.current !== 'held') return;
    blankUntilRef.current = 0;
    angryUntilRef.current = performance.now() + ROBOT_ANGRY_MS;
    setRobotPose('angry');
  }, [setRobotPose]);

  const registerWallBounce = React.useCallback((now) => {
    const ix = interactRef.current;
    if (ix.mode !== 'free' || !ix.pendingAngry) return;
    if (now < ix.bounceCooldown) return;
    ix.bounceCooldown = now + 140;
    ix.bounces += 1;
    if (ix.bounces >= 1) {
      ix.pendingAngry = false;
      triggerAngry();
    }
  }, [triggerAngry]);

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
          if (ix.vx < -40) registerWallBounce(now);
          p.x = b.minX;
          const bounced = bounceVelocity(ix.vx, ix.vy, 1, 0, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        } else if (p.x > b.maxX) {
          if (ix.vx > 40) registerWallBounce(now);
          p.x = b.maxX;
          const bounced = bounceVelocity(ix.vx, ix.vy, -1, 0, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        }
        if (p.y < b.minY) {
          if (ix.vy < -40) registerWallBounce(now);
          p.y = b.minY;
          const bounced = bounceVelocity(ix.vx, ix.vy, 0, 1, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        } else if (p.y > b.maxY) {
          if (ix.vy > 40) registerWallBounce(now);
          p.y = b.maxY;
          const bounced = bounceVelocity(ix.vx, ix.vy, 0, -1, rest);
          ix.vx = bounced.vx;
          ix.vy = bounced.vy;
        }

        const speed = Math.hypot(ix.vx, ix.vy);
        if (speed < 55) ix.still += dt;
        else ix.still = 0;
        if (ix.still > 1.4) {
          ix.mode = 'scroll';
          ix.still = 0;
          ix.vx = 0;
          ix.vy = 0;
          ix.pendingAngry = false;
          if (poseRef.current === 'held') setRobotPose('normal');
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
      const moveSpeed = Math.hypot(v.vx, v.vy);
      const moveLean = reduced ? 0 : clamp(moveSpeed / 200, 0, 1);
      const isMoving = !reduced && moveSpeed > 65;
      const leanZ = moveLean * clamp(v.vx * 0.055, -12, 12);
      const look = lookRef.current;
      const lookAlpha = reduced || isMoving ? 0 : 1 - Math.exp(-6 * dt);
      const lookX = reduced || isMoving ? 0 : look.x * lookAlpha;
      const lookY = reduced || isMoving ? 0 : look.y * lookAlpha;
      const tiltY = p.ry + lookX;
      const tiltX = lookY;
      const displayScale = reduced ? p.s : clamp(p.s, 0.9, 1.2);
      const busy = busyRef.current;
      const busyX = busy ? (window.innerWidth <= 720 ? 88 : 128) : 0;
      const busyY = busy ? (window.innerWidth <= 720 ? -72 : -108) : 0;
      const busyOpacity = busy ? 0.36 : 1;
      const busyScale = busy ? 0.84 : 1;
      const holdScale = ix.mode === 'drag' ? ROBOT_HELD_SCALE : 1;

      const nowMs = performance.now();
      if (poseRef.current === 'angry' && angryUntilRef.current > 0 && nowMs >= angryUntilRef.current) {
        startBlankAfterAngry();
      } else if (poseRef.current === 'blank' && blankUntilRef.current > 0 && nowMs >= blankUntilRef.current) {
        blankUntilRef.current = 0;
        setRobotPose('normal');
      }

      const el = wrapRef.current;
      const stage = stageRef.current;
      const body = bodyRef.current;
      const face = faceRef.current;
      if (el) {
        el.style.transform =
          `translate3d(calc(-50% + ${p.x + busyX}px), calc(-50% + ${p.y + busyY}px), 0)`;
        el.style.opacity = String(busyOpacity);
        el.classList.toggle('robot-img--moving', isMoving);
      }
      if (stage) {
        const ry = tiltY.toFixed(2);
        const rz = leanZ.toFixed(2);
        stage.style.transform = isMoving
          ? `rotateY(${ry}deg) rotateZ(${rz}deg)`
          : `rotateX(${tiltX.toFixed(2)}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }
      if (body) {
        const s = (displayScale * busyScale * holdScale).toFixed(4);
        body.style.transform = `scale(${s})`;
      }
      if (face) face.style.transform = '';
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [computeTarget, computeDock, setRobotPose, registerWallBounce, startBlankAfterAngry]);

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

  const spawnSurprisePop = React.useCallback(() => {
    if (reducedMotionRef.current) return;
    const id = performance.now();
    setSurprisePop(id);
    if (surpriseTimerRef.current) window.clearTimeout(surpriseTimerRef.current);
    surpriseTimerRef.current = window.setTimeout(() => {
      setSurprisePop(null);
      surpriseTimerRef.current = null;
    }, 720);
  }, []);

  React.useEffect(() => () => {
    if (surpriseTimerRef.current) window.clearTimeout(surpriseTimerRef.current);
  }, []);

  const onHitPointerDown = React.useCallback((e) => {
    if (!canInteract()) return;
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.preventDefault();
    e.stopPropagation();
    const p = posRef.current;
    const ix = interactRef.current;
    const cx = window.innerWidth / 2 + p.x;
    const cy = window.innerHeight / 2 + p.y;
    ix.grabDx = e.clientX - cx;
    ix.grabDy = e.clientY - cy;
    ix.mode = 'drag';
    ix.vx = 0;
    ix.vy = 0;
    ix.still = 0;
    ix.lastClientX = e.clientX;
    ix.lastClientY = e.clientY;
    ix.lastT = performance.now();
    ix.pendingAngry = false;
    ix.bounces = 0;
    lookRef.current = { x: 0, y: 0 };
    setRobotPose('held');
    spawnSurprisePop();
    wrapRef.current?.classList.add('robot-img--dragging');
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) { /* ignore */ }
  }, [canInteract, setRobotPose, spawnSurprisePop]);

  const onHitPointerMove = React.useCallback((e) => {
    const ix = interactRef.current;
    if (ix.mode !== 'drag') return;
    e.preventDefault();
    const p = posRef.current;
    const now = performance.now();
    const dt = Math.max(0.001, (now - ix.lastT) / 1000);
    const next = pointerToRobotPos(
      e.clientX, e.clientY, ix.grabDx, ix.grabDy, robotRadiusPx()
    );
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    ix.vx = dx / dt;
    ix.vy = dy / dt;
    p.x = next.x;
    p.y = next.y;
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
    const isThrow = speed > ROBOT_THROW_MIN_SPEED;
    ix.mode = isThrow ? 'free' : 'scroll';
    ix.bounces = 0;
    ix.bounceCooldown = 0;
    ix.still = 0;
    ix.pendingAngry = isThrow && speed >= ROBOT_THROW_ANGRY_MIN_SPEED;
    if (isThrow && ix.pendingAngry) {
      setRobotPose('held');
    } else {
      ix.pendingAngry = false;
      setRobotPose('normal');
    }
  }, [setRobotPose]);

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
    if (poseRef.current !== 'normal') return;
    const section = robotSectionFromRoute(route);
    const cfg = ROBOT_MOODS[section] || ROBOT_MOODS.home;
    const wrap = wrapRef.current;
    if (wrap) wrap.setAttribute('data-robot-mood', cfg.mood);
    fireRobotFace(cfg.face, section === 'about' ? 4800 : 2600);
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
        if (!busyRef.current && !document.hidden && poseRef.current === 'normal') {
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
      setFacePaused(
        busy || hidden ||
        poseRef.current === 'held' ||
        poseRef.current === 'angry' ||
        poseRef.current === 'blank'
      );
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
  const heldSrc = window.ROBBY_HELD_SRC || robbieAssetSrc('Robby_12.png');
  const angrySrc = window.ROBBY_ANGRY_SRC || robbieAssetSrc('Robby_13.png');
  const showPose = pose === 'held' || pose === 'angry';

  const robotNode = (
    <div
      ref={wrapRef}
      className="robot-img"
      data-robot-mood="home"
      data-robot-pose={pose}
      aria-hidden="true"
    >
      {surprisePop != null ?
        <div key={surprisePop} className="robot-surprise" aria-hidden="true">
          <span className="robot-surprise__text">!?</span>
        </div> :
        null}
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
            <div
              className="robot-img-stack robot-img-stack--default"
              aria-hidden={showPose ? 'true' : undefined}
            >
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
            </div>
            <div
              className="robot-img-stack robot-img-stack--pose"
              aria-hidden={showPose ? undefined : 'true'}
            >
              <div className="robot-img-layer robot-img-layer--pose">
                <img
                  className="robot-img-pose"
                  src={pose === 'held' ? heldSrc : angrySrc}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  decoding="async"
                />
              </div>
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
