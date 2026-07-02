// PortfolioVideoPlayer — HTML5 video for project slides (lazy src, pause when hidden).

function isPortfolioSlideVideo(slide) {
  if (!slide) return false;
  if (slide.type === 'video' || slide.video) return true;
  const src = slide.src || slide.video;
  return Boolean(src && /\.(mp4|webm|ogg)(\?|#|$)/i.test(src));
}

function PortfolioVideoPlayer({ src, poster, posterFromVideo, alt, active, className, onAspect }) {
  const videoRef = React.useRef(null);
  const [armed, setArmed] = React.useState(false);
  const [framePoster, setFramePoster] = React.useState(null);
  const useFirstFrame = Boolean(posterFromVideo) || !poster;

  React.useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  React.useEffect(() => {
    setFramePoster(null);
  }, [src]);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!active) el.pause();
  }, [active]);

  const publishAspect = React.useCallback(() => {
    const el = videoRef.current;
    if (!el || !el.videoWidth || !el.videoHeight || !onAspect) return;
    onAspect(`${el.videoWidth} / ${el.videoHeight}`);
  }, [onAspect]);

  const captureFirstFrame = React.useCallback(() => {
    const el = videoRef.current;
    if (!el || el.videoWidth < 1 || el.videoHeight < 1) return;
    const canvas = document.createElement('canvas');
    canvas.width = el.videoWidth;
    canvas.height = el.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      ctx.drawImage(el, 0, 0);
      setFramePoster(canvas.toDataURL('image/jpeg', 0.9));
    } catch (e) { /* ignore */ }
  }, []);

  React.useEffect(() => {
    if (!armed || !active || !useFirstFrame || framePoster) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;

    const seekToStart = () => {
      if (el.currentTime === 0) {
        captureFirstFrame();
        return;
      }
      const onSeeked = () => {
        captureFirstFrame();
        el.removeEventListener('seeked', onSeeked);
      };
      el.addEventListener('seeked', onSeeked);
      try {
        el.currentTime = 0;
      } catch (e) {
        el.removeEventListener('seeked', onSeeked);
      }
    };

    if (el.readyState >= 2) seekToStart();
    else el.addEventListener('loadeddata', seekToStart, { once: true });

    return () => el.removeEventListener('loadeddata', seekToStart);
  }, [armed, active, useFirstFrame, framePoster, captureFirstFrame]);

  if (!src) return null;

  const effectivePoster = framePoster || (posterFromVideo ? undefined : poster) || undefined;

  return (
    <video
      ref={videoRef}
      className={className ? `proj-slide-video ${className}` : 'proj-slide-video'}
      controls
      playsInline
      preload={active ? (useFirstFrame ? 'auto' : 'metadata') : 'none'}
      poster={effectivePoster}
      src={armed ? src : undefined}
      aria-label={alt || undefined}
      onLoadedData={useFirstFrame && !framePoster ? captureFirstFrame : undefined}
      onLoadedMetadata={publishAspect}
    />
  );
}

window.isPortfolioSlideVideo = isPortfolioSlideVideo;
window.PortfolioVideoPlayer = PortfolioVideoPlayer;
