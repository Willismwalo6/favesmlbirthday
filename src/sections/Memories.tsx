import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../config/site';
import { photosBySection } from '../config/photos';
import PhotoSlot from '../components/PhotoSlot';
import Ambience from '../components/Ambience';
import Reveal from '../components/Reveal';
import { usePhotos } from '../context/PhotoContext';
import { useMood } from '../context/MoodContext';

const memories = photosBySection('memories');

const ratios: Record<string, string> = {
  sm: '1 / 1',
  md: '4 / 5',
  lg: '4 / 3',
  tall: '2 / 3',
};

export default function Memories() {
  const { photos, openStudio } = usePhotos();
  const { react } = useMood();
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const explored = useRef(false);

  const close = () => setIndex(null);
  const show = (next: number) => setIndex((next + memories.length) % memories.length);

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    document.body.classList.add('is-locked');
    if (!explored.current) {
      explored.current = true;
      react('cheer', 'That smile! I remember that day ♡', 5000);
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIndex(null);
      if (event.key === 'ArrowRight') setIndex((current) => (current === null ? current : (current + 1) % memories.length));
      if (event.key === 'ArrowLeft')
        setIndex((current) =>
          current === null ? current : (current - 1 + memories.length) % memories.length
        );
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [index, react]);

  useEffect(() => {
    if (index === null) return;
    [index - 1, index + 1].forEach((i) => {
      const slot = memories[(i + memories.length) % memories.length];
      const src = photos[slot.id]?.full;
      if (src) new Image().src = src;
    });
  }, [index, photos]);

  const current = index !== null ? memories[index] : null;
  const currentPhoto = current ? photos[current.id] : undefined;

  useEffect(() => {
    if (current && !currentPhoto) setIndex(null);
  }, [current, currentPhoto]);

  return (
    <section id="memories" className="section memories">
      <Ambience variant="mixed" count={14} seed={31} />

      <div className="section__inner">
        <Reveal className="section__head">
          <p className="eyebrow">our scrapbook</p>
          <h2 className="section__title">{site.memories.heading}</h2>
          <p className="section__lede">{site.memories.text}</p>
        </Reveal>

        <div className="gallery">
          {memories.map((slot, position) => (
            <div
              key={slot.id}
              className={`gallery__item gallery__item--${slot.size ?? 'md'} gallery__item--n${position % 6}`}
              style={{ ['--rotate' as string]: `${slot.rotate ?? 0}deg` }}
            >
              <span className="gallery__pin" aria-hidden="true" />
              <PhotoSlot
                id={slot.id}
                variant="scrapbook"
                ratio={ratios[slot.size ?? 'md']}
                caption={slot.caption}
                date={slot.date}
                showMeta
                onClick={() => {
                  if (photos[slot.id]) setIndex(position);
                  else openStudio(slot.id);
                }}
              />
              {position % 4 === 0 && <span className="gallery__ribbon" aria-hidden="true" />}
              {position % 5 === 3 && <span className="gallery__flower" aria-hidden="true">❀</span>}
            </div>
          ))}
        </div>

        <Reveal className="gallery__note">
          <p>
            <span aria-hidden="true">♡</span> Tap any photograph to see it properly, then swipe or use
            the arrow keys to wander through.
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {current && currentPhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Photograph ${current.id}`}
          >
            <button
              type="button"
              className="lightbox__close"
              onClick={close}
              aria-label="Close photograph"
              ref={closeRef}
            >
              ✕
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              onClick={(event) => {
                event.stopPropagation();
                if (index !== null) show(index - 1);
              }}
              aria-label="Previous photograph"
            >
              ‹
            </button>

            <motion.figure
              className="lightbox__frame"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              drag="x"
              dragSnapToOrigin
              dragElastic={0.35}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (index === null) return;
                if (info.offset.x < -70) show(index + 1);
                else if (info.offset.x > 70) show(index - 1);
              }}
            >
              <div className="lightbox__media">
                <img
                  src={currentPhoto.full ?? currentPhoto.url}
                  decoding="async"
                  alt={current.caption ?? current.location}
                  style={{
                    objectPosition: `${currentPhoto.x}% ${currentPhoto.y}%`,
                    transform: `scale(${currentPhoto.zoom})`,
                  }}
                />
              </div>
              <figcaption>
                <span className="lightbox__caption">{current.caption ?? 'A moment worth keeping ♡'}</span>
                {current.date && <span className="lightbox__date">{current.date}</span>}
                <span className="lightbox__meta">
                  {current.id} · {index !== null ? index + 1 : 0} of {memories.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              onClick={(event) => {
                event.stopPropagation();
                if (index !== null) show(index + 1);
              }}
              aria-label="Next photograph"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
