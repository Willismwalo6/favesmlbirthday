import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import CupidBuddy from '../components/mascots/CupidBuddy';
import SpeechBubble from '../components/SpeechBubble';
import HeartBuddy from '../components/mascots/HeartBuddy';
import BunnyBuddy from '../components/mascots/BunnyBuddy';
import StrawberryBuddy from '../components/mascots/StrawberryBuddy';
import Ambience from '../components/Ambience';
import Confetti from '../components/Confetti';
import Reveal from '../components/Reveal';
import { useProgress } from '../context/ProgressContext';
import { useMood } from '../context/MoodContext';
import { scrollToId } from '../lib/scroll';

export default function Finale() {
  const { progress, answer, reset, askAgain } = useProgress();
  const { react } = useMood();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const [delivered, setDelivered] = useState(false);
  const [burst, setBurst] = useState(0);
  const celebrated = useRef(false);

  useEffect(() => {
    if (progress.answer) setDelivered(true);
  }, [progress.answer]);

  useEffect(() => {
    if (!inView || delivered) return;
    const timer = window.setTimeout(() => {
      setDelivered(true);
      react('kiss', 'One last surprise, beautiful! ♡', 6000);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [inView, delivered, react]);

  useEffect(() => {
    if (progress.answer === 'yes' && !celebrated.current) {
      celebrated.current = true;
      setBurst((current) => current + 1);
      react('cheer', 'You just made me the happiest ♡', 7000);
    }
    if (progress.answer !== 'yes') celebrated.current = false;
  }, [progress.answer, react]);

  const chooseYes = () => {
    answer('yes');
    setBurst((current) => current + 1);
  };

  return (
    <section
      id="question"
      className={`section finale ${progress.answer === 'yes' ? 'has-yes' : ''}`}
      ref={ref}
      aria-labelledby="finale-title"
    >
      <Ambience variant="petals" count={26} seed={41} />
      <div className="finale__glow" aria-hidden="true" />
      <Confetti burst={burst} pieces={120} fromTop />

      <div className="finale__balloons" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className={`balloon balloon--rose-${(index % 4) + 1}`}>
            <span className="balloon__string" />
          </span>
        ))}
      </div>

      <div className="section__inner finale__inner">
        <Reveal className="finale__head">
          <p className="eyebrow eyebrow--gold">{site.finale.overline}</p>
          <h2 className="section__title section__title--light" id="finale-title">
            For my favourite person, on her day
          </h2>
          <p className="finale__lede">
            Five little frames, one very big feeling. Every one of them is you.
          </p>
        </Reveal>

        <div className="finale__photos">
          <Reveal className="finale__photo finale__photo--main">
            <PhotoSlot
              id="faves-photo-34"
              variant="hero"
              ratio="4 / 5"
              caption="My favourite person ♡"
              showMeta
            />
          </Reveal>
          <Reveal className="finale__photo finale__photo--cupid" delay={0.08}>
            <PhotoSlot
              id="faves-photo-35"
              variant="frame"
              ratio="3 / 4"
              caption="Love, delivered."
              showMeta
            />
          </Reveal>
          <Reveal className="finale__photo finale__photo--polaroid" delay={0.16}>
            <PhotoSlot
              id="faves-photo-36"
              variant="polaroid"
              ratio="1 / 1"
              caption="One of my favourites."
              showMeta
            />
          </Reveal>
          <Reveal className="finale__photo finale__photo--wide" delay={0.24}>
            <PhotoSlot
              id="faves-photo-37"
              variant="tape"
              ratio="4 / 3"
              caption="Always you."
              showMeta
            />
          </Reveal>
          <Reveal className="finale__photo finale__photo--last" delay={0.32}>
            <PhotoSlot
              id="faves-photo-38"
              variant="frame"
              ratio="4 / 3"
              caption="The best is still ahead ♡"
              showMeta
            />
            <span className="finale__photo-glow" aria-hidden="true" />
          </Reveal>
        </div>

        <div className="finale__stage" data-scene-mascot>
          <div className={`finale__cupid ${delivered ? 'is-arrived' : ''}`}>
            <CupidBuddy
              mood={progress.answer === 'yes' ? 'cheer' : delivered ? 'deliver' : 'fly'}
              size={124}
              decorative
            />
            <span className="finale__cupid-envelope" aria-hidden="true">
              <span>♡</span>
            </span>
          </div>

          <div className={`finale__card ${delivered ? 'is-delivered' : ''}`}>
            <span className="finale__card-corner finale__card-corner--tl" aria-hidden="true" />
            <span className="finale__card-corner finale__card-corner--br" aria-hidden="true" />

            {!delivered && (
              <p className="finale__waiting">
                Cupid is on his way with something for you<span className="finale__dots" aria-hidden="true">…</span>
              </p>
            )}

            <AnimatePresence mode="wait">
              {!progress.answer && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: delivered ? 1 : 0.15, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="finale__question-overline">ONE LAST QUESTION, FAVES...</p>
                  <h3 className="finale__question">{site.finale.question}</h3>
                  <div className="finale__choices">
                    <button type="button" className="btn btn--yes" onClick={chooseYes}>
                      {site.finale.yes}
                    </button>
                    <button
                      type="button"
                      className="btn btn--think"
                      onClick={() => answer('think')}
                    >
                      {site.finale.think}
                    </button>
                  </div>
                </motion.div>
              )}

              {progress.answer === 'yes' && (
                <motion.div
                  key="yes"
                  className="finale__celebration"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="finale__celebration-hearts" aria-hidden="true">♡ ♡ ♡</p>
                  <h3>{site.finale.yesHeading}</h3>
                  <p>{site.finale.yesText}</p>
                  <div className="finale__mascots" data-scene-mascot aria-label="All four mascots celebrating">
                    <HeartBuddy mood="cheer" size={86} decorative />
                    <BunnyBuddy mood="cheer" size={86} decorative />
                    <StrawberryBuddy mood="cheer" size={86} decorative />
                    <CupidBuddy mood="cheer" size={86} decorative />
                  </div>
                  <p className="finale__mascot-note">Heart Buddy, Bunny Buddy, Strawberry Buddy and Cupid Buddy are all cheering for you ♡</p>
                  <button type="button" className="btn btn--ghost" onClick={() => { reset(); setDelivered(false); scrollToId('home'); }}>
                    {site.finale.replay}
                  </button>
                </motion.div>
              )}

              {progress.answer === 'think' && (
                <motion.div
                  key="think"
                  className="finale__gentle"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <HeartBuddy mood="think" size={96} decorative />
                  <p className="finale__gentle-text">{site.finale.thinkText}</p>
                  <button type="button" className="btn btn--ghost" onClick={askAgain}>
                    I&rsquo;m ready now ♡
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {delivered && !progress.answer && (
            <div className="finale__ask-buddy">
              <SpeechBubble text="One last question, beautiful ♡" side="left" />
              <HeartBuddy mood="kiss" size={74} decorative />
            </div>
          )}

          <p className="finale__signoff">happy birthday, Favour Kioko · 05 · 12 · with all my love ♡</p>
        </div>
      </div>
    </section>
  );
}
