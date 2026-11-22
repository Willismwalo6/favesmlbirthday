import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getPhoto } from '../config/photos';
import { usePhotos } from '../context/PhotoContext';

type Props = {
  id: string;
  variant?: 'frame' | 'polaroid' | 'tape' | 'oval' | 'plain' | 'scrapbook' | 'hero';
  className?: string;
  ratio?: string;
  caption?: string;
  date?: string;
  showMeta?: boolean;
  eager?: boolean;
  sizes?: string;
  onClick?: () => void;
  /** Hide the "add photo" affordance (used when the owner studio is open only). */
  quiet?: boolean;
};

export default function PhotoSlot({
  id,
  variant = 'frame',
  className = '',
  ratio,
  caption,
  date,
  showMeta = false,
  eager = false,
  sizes = '(max-width: 700px) 72vw, 460px',
  onClick,
  quiet = false,
}: Props) {
  const slot = getPhoto(id);
  const { photos, openStudio } = usePhotos();
  const photo = photos[id];
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [photo?.url]);

  const style: CSSProperties = ratio ? { aspectRatio: ratio } : {};

  const handlePlaceholder = () => {
    if (quiet) return;
    openStudio(id);
  };

  return (
    <figure className={`photo photo--${variant} ${className}`}>
      <div
        className="photo__media"
        style={{
          ...style,
          ...(photo?.blur ? { backgroundImage: `url(${photo.blur})` } : null),
        }}
        data-loaded={loaded || undefined}
      >
        {photo ? (
          <img
            ref={imgRef}
            className="photo__img"
            src={photo.url}
            srcSet={photo.srcSet}
            sizes={photo.srcSet ? sizes : undefined}
            width={photo.w}
            height={photo.h}
            fetchPriority={eager ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            alt={caption || slot.location}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            onClick={onClick}
            onKeyDown={
              onClick
                ? (event) => {
                    if (event.key === 'Enter') onClick();
                  }
                : undefined
            }
            tabIndex={onClick ? 0 : undefined}
            role={onClick ? 'button' : undefined}
            style={{
              opacity: photo.blur && !loaded ? 0 : 1,
              objectPosition: `${photo.x}% ${photo.y}%`,
              transform: `scale(${photo.zoom})`,
            }}
          />
        ) : (
          <button
            type="button"
            className="photo__placeholder"
            onClick={handlePlaceholder}
            aria-label={`Add photograph ${slot.id} — ${slot.location}`}
          >
            <svg className="photo__bloom" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id={`bloom-${slot.number}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9D8E2" />
                  <stop offset="100%" stopColor="#E9A3BB" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#D9B879" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.75" />
              <g opacity="0.95">
                <path d="M60 22c9 0 16 7 16 16 0 9-7 16-16 16-9 0-16-7-16-16 0-9 7-16 16-16z" fill={`url(#bloom-${slot.number})`} opacity="0.55" />
                <path d="M44 46c8 3 12 9 11 17-8-2-13-8-11-17z" fill="#F5C6D5" />
                <path d="M76 46c-8 3-12 9-11 17 8-2 13-8 11-17z" fill="#F5C6D5" />
                <path d="M47 70c7-4 13-4 20 0" fill="none" stroke="#C97896" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M60 70v18" stroke="#C97896" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M60 80c-6-1-9-5-9-10 6 0 10 4 9 10z" fill="#F0B7C8" />
              </g>
              <text x="60" y="104" textAnchor="middle" className="photo__bloom-number">
                {String(slot.number).padStart(2, '0')}
              </text>
            </svg>
            <span className="photo__slot-id">{slot.id}</span>
            <span className="photo__slot-note">
              {quiet ? 'Photo coming soon' : '+ Add photograph'}
            </span>
          </button>
        )}
      </div>

      {showMeta && (caption || date) && (
        <figcaption className="photo__caption">
          {caption && <span className="photo__caption-text">{caption}</span>}
          {date && <span className="photo__caption-date">{date}</span>}
        </figcaption>
      )}
      {photo && onClick && <span className="photo__zoom-hint" aria-hidden="true">View ♡</span>}
    </figure>
  );
}
