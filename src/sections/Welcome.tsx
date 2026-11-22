import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import HeartBuddy from '../components/mascots/HeartBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Ambience from '../components/Ambience';
import Confetti from '../components/Confetti';
import { useProgress } from '../context/ProgressContext';
import { useMood } from '../context/MoodContext';
import { scrollToId } from '../lib/scroll';

type Stage = 'closed' | 'opening' | 'open';

export default function Welcome() {
  const { progress, openEnvelope } = useProgress();
  const { react } = useMood();
  const [stage, setStage] = useState<Stage>(progress.envelopeOpened ? 'open' : 'closed');
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (progress.envelopeOpened) setStage('open');
  }, [progress.envelopeOpened]);

  const handleOpen = () => {
    if (stage !== 'closed') return;
    setStage('opening');
    setBurst((current) => current + 1);
    react('jump', 'Heyyy Faves! ♡ I have something special for you!', 5600);
    window.setTimeout(() => {
      setStage('open');
      openEnvelope();
    }, 950);
    window.setTimeout(() => scrollToId('birthday'), 2500);
  };

  const replay = () => {
    setStage('closed');
    window.setTimeout(() => {
      setStage('opening');
      setBurst((current) => current + 1);
      react('jump', 'Here it is again, my favourite girl! ♡', 4600);
      window.setTimeout(() => setStage('open'), 950);
    }, 350);
  };

  const opened = stage !== 'closed';

  return (
    <section id="home" className={`welcome ${opened ? 'is-open' : ''}`}>
      <h1 className="visually-hidden">
        Faves, my love — a birthday surprise made for Favour Kioko
      </h1>
      <Ambience variant="mixed" count={20} seed={4} />
      <Confetti burst={burst} pieces={70} fromTop={false} />

      <div className="welcome__inner">
        <motion.p
          className="welcome__overline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          {site.welcome.overline}
        </motion.p>

        <div className="welcome__scene">
          <motion.div
            className="welcome__portrait"
            initial={{ opacity: 0, scale: 0.92, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="welcome__portrait-halo" aria-hidden="true" />
            <PhotoSlot
              id="faves-photo-01"
              variant="oval"
              ratio="1 / 1"
              caption="Favour Kioko ♡"
              showMeta
              eager
            />
            <span className="welcome__portrait-ribbon" aria-hidden="true">the birthday girl</span>
          </motion.div>

          <motion.div
            className={`welcome__envelope envelope stage-${stage}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleOpen}
            role="button"
            tabIndex={stage === 'closed' ? 0 : -1}
            aria-label="Open the sealed birthday envelope"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpen();
              }
            }}
          >
            <div className="envelope__shadow" aria-hidden="true" />
            <div className="envelope__back" aria-hidden="true" />
            <div className="envelope__letter" aria-hidden="true">
              <div className="envelope__letter-inner">
                <span className="envelope__letter-to">For Faves</span>
                <span className="envelope__letter-line">Happy birthday, my love ♡</span>
                <span className="envelope__letter-heart">♡</span>
              </div>
            </div>
            <div className="envelope__pocket" aria-hidden="true" />
            <div className="envelope__flap" aria-hidden="true">
              <span className="envelope__flap-lining" />
            </div>
            <div className="envelope__seal" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path
                  d="M16 27C9 22 4.5 17.5 4.5 12.5 4.5 8.6 7.6 6 11 6c2 0 3.9 1 5 2.7C17.1 7 19 6 21 6c3.4 0 6.5 2.6 6.5 6.5 0 5-4.5 9.5-11.5 14.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="envelope__sparkle envelope__sparkle--one" aria-hidden="true">✦</span>
            <span className="envelope__sparkle envelope__sparkle--two" aria-hidden="true">✦</span>
            <span className="envelope__sparkle envelope__sparkle--three" aria-hidden="true">✦</span>

          </motion.div>

          <motion.div
            className="welcome__side"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="welcome__buddy" data-scene-mascot>
              <HeartBuddy mood={opened ? 'cheer' : 'wave'} size={104} decorative />
              <SpeechBubble
                text={opened ? 'There’s another surprise waiting!' : 'Heyyy Faves! ♡'}
                side="top"
              />
            </div>
            <PhotoSlot
              id="faves-photo-02"
              variant="polaroid"
              ratio="4 / 3"
              caption="Hello, beautiful."
              showMeta
            />
          </motion.div>
        </div>

        <motion.div
          className="welcome__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {stage === 'closed' ? (
            <button type="button" className="btn btn--primary" onClick={handleOpen}>
              {site.welcome.button}
            </button>
          ) : (
            <>
              <button type="button" className="btn btn--primary" onClick={() => scrollToId('birthday')}>
                KEEP GOING, BEAUTIFUL ♡
              </button>
              <button type="button" className="btn btn--ghost" onClick={replay}>
                Replay the opening ♡
              </button>
            </>
          )}
          <p className="welcome__sub">{site.welcome.sub}</p>
          <p className="welcome__note">{site.welcome.sealedNote}</p>
        </motion.div>
      </div>

      <div className="welcome__scroll" aria-hidden="true">
        <span>scroll</span>
        <span className="welcome__scroll-line" />
      </div>
    </section>
  );
}
