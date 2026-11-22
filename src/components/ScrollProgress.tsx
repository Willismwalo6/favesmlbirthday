import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="scroll-heart"
      role="progressbar"
      aria-label="Page progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <span className="scroll-heart__track" aria-hidden="true" />
      <span
        className="scroll-heart__marker"
        style={{ top: `calc(${progress * 100}% - 10px)` }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M12 21C6.5 17 2.5 13.5 2.5 9.6 2.5 6.6 5 4.5 7.7 4.5c1.7 0 3.2.9 4.3 2.4 1.1-1.5 2.6-2.4 4.3-2.4 2.7 0 5.2 2.1 5.2 5.1 0 3.9-4 7.4-9.5 11.4Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}
