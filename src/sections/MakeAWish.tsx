import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import Cake from '../components/Cake';
import StrawberryBuddy from '../components/mascots/StrawberryBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Ambience from '../components/Ambience';
import Confetti from '../components/Confetti';
import Reveal from '../components/Reveal';
import { useProgress } from '../context/ProgressContext';

export default function MakeAWish() {
  const { progress, blowCandles, relightCandles } = useProgress();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [burst, setBurst] = useState(0);
  const lit = !progress.candlesBlown;

  useEffect(() => {
    if (progress.candlesBlown) setBurst((current) => (current === 0 ? 1 : current));
  }, [progress.candlesBlown]);

  const handleBlow = () => {
    if (!lit) return;
    blowCandles();
    setBurst((current) => current + 1);
  };

  return (
    <section
      className={`section wish ${lit ? 'is-lit' : 'is-out'}`}
      ref={ref}
      aria-labelledby="wish-title"
    >
      <Ambience variant="sparkles" count={22} seed={37} />
      <Confetti burst={burst} pieces={70} />

      <div className="section__inner">
        <Reveal className="section__head">
          <p className="eyebrow">close your eyes</p>
          <h2 className="section__title" id="wish-title">
            {site.wish.heading}
          </h2>
          <p className="section__lede">{site.wish.text}</p>
        </Reveal>

        <div className={`wish__stage ${lit ? 'is-lit' : 'is-out'}`}>
          <Reveal className="wish__photos wish__photos--left" delay={0.05}>
            <PhotoSlot
              id="faves-photo-31"
              variant="frame"
              ratio="4 / 5"
              caption="Make a wish ♡"
              showMeta
            />
            <span className="wish__star wish__star--one" aria-hidden="true">✦</span>
          </Reveal>

          <Reveal className="wish__cake-zone" delay={0.12}>
            <span className="wish__halo" aria-hidden="true" />
            <Cake lit={lit} blown={!lit} candles={5} />
            <div className="wish__strawberry" data-scene-mascot>
              <SpeechBubble
                text={
                  lit
                    ? inView
                      ? 'Make a wish, beautiful! ♡'
                      : null
                    : 'It’s already coming true, I just know it ♡'
                }
                side="left"
              />
              <StrawberryBuddy
                mood={lit ? (inView ? 'encourage' : 'idle') : 'cheer'}
                size={112}
                decorative
              />
              <span className="wish__strawberry-label" aria-hidden="true">Strawberry Buddy</span>
            </div>
          </Reveal>

          <Reveal className="wish__photos wish__photos--right" delay={0.18}>
            <PhotoSlot
              id="faves-photo-33"
              variant="scrapbook"
              ratio="1 / 1"
              caption="For all your dreams."
              showMeta
            />
            <PhotoSlot
              id="faves-photo-32"
              variant="tape"
              ratio="4 / 3"
              caption="Sweetest wishes."
              showMeta
            />
          </Reveal>
        </div>

        <Reveal className="wish__actions">
          {lit ? (
            <button type="button" className="btn btn--primary" onClick={handleBlow}>
              {site.wish.button}
            </button>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={relightCandles}>
              {site.wish.replay}
            </button>
          )}

          <AnimatePresence>
            {!lit && (
              <motion.div
                className="wish__reveal"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="wish__reveal-line">{site.wish.reveal}</p>
                <p className="wish__reveal-sign">happy birthday, my love ♡</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
