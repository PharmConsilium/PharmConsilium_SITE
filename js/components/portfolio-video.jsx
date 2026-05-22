// PortfolioVideoPlayer — HTML5 video for project slides (lazy src, pause when hidden).

function isPortfolioSlideVideo(slide) {
  if (!slide) return false;
  if (slide.type === 'video' || slide.video) return true;
  const src = slide.src || slide.video;
  return Boolean(src && /\.(mp4|webm|ogg)(\?|#|$)/i.test(src));
}

function PortfolioVideoPlayer({ src, poster, alt, active, className, onAspect }) {
  const videoRef = React.useRef(null);
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

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

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      className={className ? `proj-slide-video ${className}` : 'proj-slide-video'}
      controls
      playsInline
      preload={active ? 'metadata' : 'none'}
      poster={poster || undefined}
      src={armed ? src : undefined}
      aria-label={alt || undefined}
      onLoadedMetadata={publishAspect}
    />
  );
}

window.isPortfolioSlideVideo = isPortfolioSlideVideo;
window.PortfolioVideoPlayer = PortfolioVideoPlayer;
