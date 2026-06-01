// Цикл «лица» Робби: 10 кадров, перед каждым лицом — Robby_1 (экран без лица)

const ROBBY_ASSET_V = '4';
const ROBBY_FRAME_SRC = (n) => `assets/uploads/Robby_${n}.png?v=${ROBBY_ASSET_V}`;
const ROBBY_BLANK_FRAME = 1;
const ROBBY_FADE_MS = 750;

/** Перед лицами 2…10 всегда кадр 1 (тёмный экран), затем само лицо */
function buildRobbyFaceSequence() {
  const seq = [];
  for (let f = 2; f <= 10; f++) {
    seq.push({ frame: ROBBY_BLANK_FRAME, duration: 2000 });
    seq.push({ frame: f, duration: 3200 });
  }
  return seq;
}

const ROBBY_FACE_SEQUENCE = buildRobbyFaceSequence();
/** Неоновая подсветка Robby_11 — отдельный слой, не в цикле */
const ROBBY_OUTLINE_SRC = `assets/uploads/Robby_11.png?v=${ROBBY_ASSET_V}`;

function preloadRobbyFrames() {
  for (let n = 1; n <= 10; n++) {
    const img = new Image();
    img.src = ROBBY_FRAME_SRC(n);
  }
  const outline = new Image();
  outline.src = ROBBY_OUTLINE_SRC;
}

function RobbieFaceCycle({ alt = 'Робби', className, paused }) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [frame, setFrame] = React.useState(ROBBY_BLANK_FRAME);
  const [overlayFrame, setOverlayFrame] = React.useState(null);
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const stepIndexRef = React.useRef(0);
  const frameRef = React.useRef(ROBBY_BLANK_FRAME);
  const timerRef = React.useRef(null);
  const overrideTimerRef = React.useRef(null);
  const overrideActiveRef = React.useRef(false);
  const pausedRef = React.useRef(!!paused);
  const reducedRef = React.useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  pausedRef.current = !!paused;

  const crossfadeTo = React.useCallback((nextFrame, onDone) => {
    if (nextFrame === frameRef.current) {
      onDone?.();
      return;
    }
    if (reducedRef.current) {
      frameRef.current = nextFrame;
      setFrame(nextFrame);
      onDone?.();
      return;
    }
    setOverlayFrame(nextFrame);
    setOverlayVisible(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOverlayVisible(true));
    });
    window.setTimeout(() => {
      frameRef.current = nextFrame;
      setFrame(nextFrame);
      setOverlayFrame(null);
      setOverlayVisible(false);
      onDone?.();
    }, ROBBY_FADE_MS);
  }, []);

  const clearOverride = React.useCallback(() => {
    if (overrideTimerRef.current) window.clearTimeout(overrideTimerRef.current);
    overrideTimerRef.current = null;
    overrideActiveRef.current = false;
  }, []);

  const scheduleNext = React.useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (reducedRef.current || pausedRef.current || overrideActiveRef.current) return;

    const step = ROBBY_FACE_SEQUENCE[stepIndexRef.current];
    timerRef.current = window.setTimeout(() => {
      if (overrideActiveRef.current) return;
      const nextIdx = (stepIndexRef.current + 1) % ROBBY_FACE_SEQUENCE.length;
      const target = ROBBY_FACE_SEQUENCE[nextIdx].frame;
      crossfadeTo(target, () => {
        stepIndexRef.current = nextIdx;
        setStepIndex(nextIdx);
      });
    }, step.duration);
  }, [crossfadeTo]);

  const showFaceOverride = React.useCallback((nextFrame, duration) => {
    const ms = Math.max(80, Number(duration) || 2000);
    clearOverride();
    overrideActiveRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    crossfadeTo(nextFrame, () => {
      overrideTimerRef.current = window.setTimeout(() => {
        clearOverride();
        scheduleNext();
      }, ms);
    });
  }, [clearOverride, crossfadeTo, scheduleNext]);

  React.useEffect(() => {
    preloadRobbyFrames();
  }, []);

  React.useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      clearOverride();
    };
  }, [stepIndex, paused, scheduleNext, clearOverride]);

  React.useEffect(() => {
    const onFace = (e) => {
      const d = e.detail || {};
      const f = Number(d.frame);
      if (!f || f < 1 || f > 10) return;
      if (reducedRef.current) return;
      showFaceOverride(f, d.duration);
    };
    window.addEventListener('pharm:robot-face', onFace);
    return () => window.removeEventListener('pharm:robot-face', onFace);
  }, [showFaceOverride]);

  React.useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      } else {
        scheduleNext();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [scheduleNext]);

  const rootClass = ['robbie-face-cycle', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <img
        src={ROBBY_FRAME_SRC(frame)}
        alt={alt}
        className="robbie-face-layer robbie-face-layer--base"
        decoding="async"
        draggable="false"
      />
      {overlayFrame != null ?
      <img
        src={ROBBY_FRAME_SRC(overlayFrame)}
        alt=""
        aria-hidden="true"
        className={`robbie-face-layer robbie-face-layer--overlay${overlayVisible ? ' is-visible' : ''}`}
        decoding="async"
        draggable="false"
      /> :
      null}
    </div>
  );
}

function pharmRobotFace(frame, duration) {
  window.dispatchEvent(new CustomEvent('pharm:robot-face', {
    detail: { frame: Number(frame), duration: duration != null ? Number(duration) : 2200 },
  }));
}

function pharmRobotBlink() {
  pharmRobotFace(ROBBY_BLANK_FRAME, 130);
}

Object.assign(window, {
  RobbieFaceCycle,
  ROBBY_FACE_SEQUENCE,
  ROBBY_FRAME_SRC,
  ROBBY_ASSET_V,
  ROBBY_OUTLINE_SRC,
  ROBBY_BLANK_FRAME,
  ROBBY_FADE_MS,
  pharmRobotFace,
  pharmRobotBlink,
});
