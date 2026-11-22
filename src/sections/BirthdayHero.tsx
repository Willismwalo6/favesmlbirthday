import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import HeartBuddy from '../components/mascots/HeartBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Cake from '../components/Cake';
import Ambience from '../components/Ambience';
import Confetti from '../components/Confetti';
import Reveal from '../components/Reveal';
import { useMood } from '../context/MoodContext';
import { scrollToId } from '../lib/scroll';

export default function BirthdayHero() {
  const { react } = useMood();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [burst, setBurst] = useState(0);
  const [kissed, setKissed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setBurst(1);
    react('kiss', 'You’re so loved, birthday girl! ♡', 5200);
  }, [inView, react]);

  const kiss = () => {
    setKissed(true);
    setBurst((current) => current + 1);
    react('kiss', 'Mwah! That one was just for you ♡', 4600);
  };

  return (
    <section className="section hero" ref={ref} aria-labelledby="hero-title">
      <Ambience variant="mixed" count={14} seed={11} />
      <Confetti burst={burst} pieces={55} fromTop />

      <div className="balloons" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <span key={index} className={`balloon balloon--${index + 1}`}>
            <span className="balloon__string" />
          </span>
        ))}
      </div>

      <div className="section__inner">
        <Reveal className="hero__head">
          <p className="eyebrow">For Favour Kioko · my favourite person</p>
          <h2 className="section__title section__title--hero" id="hero-title">
            {site.hero.heading}
          </h2>
          <p className="hero__text">{site.hero.text}</p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={() => scrollToId('surprises')}>
              OPEN YOUR GIFTS ♡
            </button>
            <button type="button" className="btn btn--ghost" onClick={kiss}>
              Blow me a kiss ♡
            </button>
          </div>
        </Reveal>

        <div className="hero__collage">
          <Reveal className="hero__photo hero__photo--main" delay={0.05}>
            <span className="hero__crown" aria-hidden="true">
              <svg viewBox="0 0 80 40">
                <path d="M6 34L12 8l14 14L40 4l14 18 14-14 6 26z" fill="#E4C58C" stroke="#C9A25E" strokeWidth="1.4" />
                <circle cx="12" cy="8" r="3" fill="#F6E3BE" />
                <circle cx="40" cy="4" r="3" fill="#F6E3BE" />
                <circle cx="68" cy="8" r="3" fill="#F6E3BE" />
              </svg>
            </span>
            <PhotoSlot
              id="faves-photo-05"
              variant="hero"
              ratio="4 / 5"
              caption="The birthday girl ♡"
              showMeta
              eager
            />
            <span className="hero__gold-corners" aria-hidden="true" />
            <span className="hero__name-tag" aria-hidden="true">Faves ♡</span>
          </Reveal>

          <Reveal className="hero__photo hero__photo--one" delay={0.15}>
            <PhotoSlot
              id="faves-photo-08"
              variant="tape"
              ratio="4 / 3"
              caption="A moment I replay."
              showMeta
            />
          </Reveal>

          <Reveal className="hero__photo hero__photo--two" delay={0.2}>
            <PhotoSlot
              id="faves-photo-06"
              variant="frame"
              ratio="3 / 4"
              caption="My favourite view."
              showMeta
            />
          </Reveal>

          <Reveal className="hero__photo hero__photo--three" delay={0.25}>
            <PhotoSlot
              id="faves-photo-09"
              variant="polaroid"
              ratio="4 / 3"
              caption="Simply you ♡"
              showMeta
            />
          </Reveal>

          <Reveal className="hero__photo hero__photo--four" delay={0.3}>
            <PhotoSlot
              id="faves-photo-07"
              variant="polaroid"
              ratio="1 / 1"
              caption="Sweetest smile."
              showMeta
            />
          </Reveal>

          <Reveal className="hero__cake-card" delay={0.35}>
            <div className="hero__cake-glow" aria-hidden="true" />
            <Cake lit className="cake--hero" candles={5} />
            <p className="hero__cake-note">Make a wish, my love ♡</p>
            <div className="hero__buddy" data-scene-mascot>
              <SpeechBubble
                text={kissed ? 'Happy birthday, Faves! ♡' : 'Psst... there are gifts too!'}
                side="top"
              />
              <HeartBuddy mood={kissed ? 'cheer' : 'kiss'} size={92} decorative />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="hero__marquee" aria-hidden="true">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 2 }, (_, copy) => (
            <span key={copy}>
              happy birthday faves ♡ twenty · five · twelve ♡ my favourite person ♡
              &nbsp;happy birthday faves ♡
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
