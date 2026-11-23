import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { nairobiEpoch } from '../lib/birthday';

/** Opens 5 December 2026, 00:00 Africa/Nairobi, and stays open afterwards. */
const UNLOCK_AT = nairobiEpoch(2026, 12, 5, 0, 0, 0);
const IMAGE = `${import.meta.env.BASE_URL}surprise.webp`;
const ease = [0.22, 1, 0.36, 1] as const;

const daysLeft = () => Math.max(1, Math.ceil((UNLOCK_AT - Date.now()) / 86_400_000));

export default function FooterSurprise() {
  const reduce = useReducedMotion();
  const shake = useAnimationControls();
  const [unlocked, setUnlocked] = useState(() => Date.now() >= UNLOCK_AT);
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [missing, setMissing] = useState(false);

  // Flip to unlocked on its own if the page is open at midnight.
  useEffect(() => {
    if (unlocked) return;
    const id = window.setInterval(() => {
      if (Date.now() >= UNLOCK_AT) setUnlocked(true);
    }, 15_000);
    return () => window.clearInterval(id);
  }, [unlocked]);

  useEffect(() => {
    if (!hint) return;
    const id = window.setTimeout(() => setHint(false), 2800);
    return () => window.clearTimeout(id);
  }, [hint]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const tap = () => {
    if (unlocked) return setOpen(true);
    setHint(true);
    if (!reduce) shake.start({ x: [0, -7, 7, -5, 5, -2, 0], transition: { duration: 0.45, ease: 'easeOut' } });
  };

  return (
    <>
      <div className="soon-wrap">
        <motion.button
          type="button"
          className={`soon ${unlocked ? 'is-open' : ''}`}
          animate={shake}
          whileHover={reduce ? undefined : { y: -3 }}
          onClick={tap}
          aria-haspopup={unlocked ? 'dialog' : undefined}
          aria-describedby="soon-hint"
        >
          <span className="soon__lock" aria-hidden="true">{unlocked ? '🎁' : '🔒'}</span>
          <span className="soon__label">{unlocked ? 'Ready for you' : 'Coming soon'}</span>
          <span className="soon__date">{unlocked ? 'Tap to open ♡' : 'December 5th'}</span>
        </motion.button>
        <AnimatePresence>
          {hint && !unlocked && (
            <motion.p
              id="soon-hint"
              className="soon__hint"
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease }}
            >
              Not yet, love ♡ It opens on December 5th ({daysLeft()} {daysLeft() === 1 ? 'day' : 'days'} to go)
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="legal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="soon__card"
              role="dialog"
              aria-modal="true"
              aria-label="Your birthday surprise"
              initial={{ opacity: 0, scale: 0.9, y: 24, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.5, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              {missing ? (
                <p className="soon__empty">Your surprise is on its way ♡</p>
              ) : (
                <img src={IMAGE} alt="A birthday surprise for Favour" decoding="async" onError={() => setMissing(true)} />
              )}
              <button type="button" className="legal__close soon__close" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
