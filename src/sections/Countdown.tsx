import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { site } from '../config/site';
import { useCountdown } from '../hooks/useCountdown';
import { pad } from '../lib/birthday';
import PhotoSlot from '../components/PhotoSlot';
import HeartBuddy from '../components/mascots/HeartBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Ambience from '../components/Ambience';
import Reveal from '../components/Reveal';
import Confetti from '../components/Confetti';
import { useMood } from '../context/MoodContext';

export default function Countdown() {
  const state = useCountdown();
  const { react } = useMood();
  const [greeted, setGreeted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.3 });
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (inView && !greeted) {
      setGreeted(true);
      react('cheer', 'The countdown to you is my favourite one! ♡', 5000);
    }
  }, [inView, greeted, react]);

  useEffect(() => {
    if (state.mode === 'birthday') setBurst((current) => current + 1);
  }, [state.mode]);

  const cells = [
    { key: 'days', value: state.days, label: site.countdown.labels.days },
    { key: 'hours', value: state.hours, label: site.countdown.labels.hours },
    { key: 'minutes', value: state.minutes, label: site.countdown.labels.minutes },
    { key: 'seconds', value: state.seconds, label: site.countdown.labels.seconds },
  ];

  return (
    <section id="birthday" className="section countdown" ref={stageRef}>
      <Ambience variant="hearts" count={12} seed={7} />
      <Confetti burst={burst} pieces={70} fromTop />

      <div className="section__inner countdown__grid">
        <Reveal className="countdown__copy">
          <p className="eyebrow">your special day</p>
          <p className="countdown__date">{site.birthday.display}</p>
          <h2 className="section__title">
            {state.mode === 'birthday' ? site.countdown.birthdayHeading : site.countdown.heading}
          </h2>

          {state.mode === 'birthday' ? (
            <div className="countdown__birthday">
              <p>{site.countdown.birthdayNote}</p>
              <p className="countdown__birthday-date">{site.birthday.display}</p>
            </div>
          ) : (
            <>
              <p className="section__lede">{site.countdown.subtitle}</p>
              <div
                className="timer"
                role="timer"
                aria-live="off"
                aria-label={`${state.days} days, ${state.hours} hours, ${state.minutes} minutes and ${state.seconds} seconds until Faves' birthday`}
              >
                {cells.map((cell) => (
                  <div className="timer__cell" key={cell.key}>
                    <span className="timer__value" key={`${cell.key}-${cell.value}`}>
                      {cell.key === 'days' ? String(cell.value) : pad(cell.value)}
                    </span>
                    <span className="timer__label">{cell.label}</span>
                  </div>
                ))}
              </div>
              <p className="countdown__meta">
                {state.isToday
                  ? 'It’s almost here — tomorrow is all yours ♡'
                  : `Until ${site.birthday.display.replace(' ♡', '')}, ${state.year}`}
                <span>Africa/Nairobi · live</span>
              </p>
            </>
          )}

          <div className="countdown__small-photo">
            <PhotoSlot
              id="faves-photo-04"
              variant="tape"
              ratio="4 / 3"
              caption="December 5th, always."
              showMeta
            />
          </div>
        </Reveal>

        <Reveal className="countdown__visual" delay={0.15}>
          <div className="countdown__portrait">
            <span className="countdown__frame-glow" aria-hidden="true" />
            <PhotoSlot
              id="faves-photo-03"
              variant="hero"
              ratio="4 / 5"
              caption="Counting down to you ♡"
              showMeta
            />
            <span className="countdown__ribbon" aria-hidden="true">
              <span>05 · 12</span>
            </span>
          </div>

          <div className="countdown__buddy" data-scene-mascot>
            <SpeechBubble
              text={inView ? 'Every second is worth it ♡' : null}
              side="left"
              className="countdown__bubble"
            />
            <HeartBuddy mood={inView ? 'jump' : 'idle'} size={96} decorative />
          </div>

          <motion.div
            className="countdown__ticket"
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <span className="countdown__ticket-top">Admit one</span>
            <span className="countdown__ticket-main">Faves&rsquo; Day</span>
            <span className="countdown__ticket-bottom">05 . 12 · with love</span>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
