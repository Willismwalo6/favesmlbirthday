import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import BunnyBuddy, { type BunnyMood } from '../components/mascots/BunnyBuddy';
import HeartBuddy from '../components/mascots/HeartBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Ambience from '../components/Ambience';
import Confetti from '../components/Confetti';
import Reveal from '../components/Reveal';
import { useProgress } from '../context/ProgressContext';
import { useMood } from '../context/MoodContext';

const bunnyLines: Record<number, string> = {
  1: 'This one’s my favourite! ♡',
  2: 'Ooh, open the next one!',
  3: 'You deserve all of it, Faves!',
};

export default function GiftRoom() {
  const { progress, openGift } = useProgress();
  const { react } = useMood();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [bunnyMood, setBunnyMood] = useState<BunnyMood>('idle');
  const [bunnyLine, setBunnyLine] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const [closed, setClosed] = useState<number[]>([]);
  const celebrated = useRef(false);

  const openedCount = progress.openedGifts.length;

  useEffect(() => {
    if (!inView) return;
    setBunnyMood('peek');
    setBunnyLine('Psst... I’m hiding behind the presents!');
    const timer = window.setTimeout(() => {
      setBunnyMood('idle');
      setBunnyLine(null);
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    if (openedCount === 3 && !celebrated.current) {
      celebrated.current = true;
      setBurst((current) => current + 1);
      react('cheer', 'All three! You deserve a thousand more ♡', 6000);
      setBunnyMood('cheer');
      setBunnyLine('We did it — happy birthday! ♡');
    }
    if (openedCount < 3) celebrated.current = false;
  }, [openedCount, react]);

  const revealIntoView = (id: number) => {
    window.setTimeout(() => {
      const reveal = document.getElementById(`gift-reveal-${id}`);
      if (!reveal) return;
      const rect = reveal.getBoundingClientRect();
      if (rect.top < 90 || rect.bottom > window.innerHeight - 30) {
        reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);
  };

  const handleOpen = (id: number) => {
    setClosed((current) => current.filter((gift) => gift !== id));
    revealIntoView(id);
    if (!progress.openedGifts.includes(id)) {
      openGift(id);
      setBurst((current) => current + 1);
    }
    setBunnyMood('cheer');
    setBunnyLine(bunnyLines[id]);
    window.setTimeout(() => {
      setBunnyMood('idle');
      setBunnyLine(null);
    }, 4200);
  };

  const handleClose = (id: number) => {
    setClosed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <section id="surprises" className="section gifts" ref={ref}>
      <Ambience variant="mixed" count={12} seed={17} />
      <Confetti burst={burst} pieces={45} />

      <div className="section__inner">
        <Reveal className="section__head">
          <p className="eyebrow">the gift room</p>
          <h2 className="section__title">{site.gifts.heading}</h2>
          <p className="section__lede">{site.gifts.instruction}</p>
        </Reveal>

        <div className="gifts__stage">
          <div className="gifts__bunny" data-scene-mascot>
            <SpeechBubble text={bunnyLine} side="right" />
            <BunnyBuddy mood={bunnyMood} size={104} decorative />
            <span className="gifts__bunny-label" aria-hidden="true">Bunny Buddy</span>
          </div>

          <div className="gifts__grid">
            {site.gifts.items.map((gift, index) => {
              const isOpen =
                progress.openedGifts.includes(gift.id) && !closed.includes(gift.id);
              return (
                <Reveal key={gift.id} delay={index * 0.08} className="gift-slot">
                  <article className={`gift gift--${gift.id} ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="gift__box"
                      onClick={() => (isOpen ? handleClose(gift.id) : handleOpen(gift.id))}
                      aria-expanded={isOpen}
                      aria-controls={`gift-reveal-${gift.id}`}
                      aria-label={
                        isOpen
                          ? `Close ${gift.label}`
                          : `Open ${gift.label} — ${gift.title}`
                      }
                    >
                      <span className="gift__lid" aria-hidden="true">
                        <span className="gift__bow">
                          <span className="gift__bow-loop gift__bow-loop--left" />
                          <span className="gift__bow-loop gift__bow-loop--right" />
                          <span className="gift__bow-knot" />
                        </span>
                      </span>
                      <span className="gift__body" aria-hidden="true">
                        <span className="gift__ribbon" />
                        <span className="gift__shine" />
                        <span className="gift__monogram">
                          {String(gift.id).padStart(2, '0')}
                        </span>
                      </span>
                      <span className="gift__tag">
                        <span>{gift.label}</span>
                        <em>{gift.ribbon}</em>
                      </span>
                      <span className="gift__hint" aria-hidden="true">
                        {isOpen ? 'close ♡' : 'open ♡'}
                      </span>
                    </button>

                    <div
                      className={`gift__reveal ${isOpen ? 'is-open' : ''}`}
                      id={`gift-reveal-${gift.id}`}
                      hidden={!isOpen}
                    >
                      <div className="gift__photo">
                        <PhotoSlot
                          id={`faves-photo-${9 + gift.id}`}
                          variant="polaroid"
                          ratio="3 / 4"
                          caption="With all my love ♡"
                          showMeta
                        />
                      </div>
                      <div className="gift__copy">
                        <p className="eyebrow">opened with love</p>
                        <h3>{gift.title}</h3>
                        <p>{gift.message}</p>
                        <button
                          type="button"
                          className="btn btn--ghost btn--small"
                          onClick={() => handleClose(gift.id)}
                        >
                          Close the box ♡
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal className="gifts__progress">
          {openedCount === 3 && (
            <div className="gifts__done-buddy" data-scene-mascot>
              <SpeechBubble text="All three! You deserve a thousand more ♡" side="left" />
              <HeartBuddy mood="cheer" size={80} decorative />
            </div>
          )}
          <div className="gifts__progress-track" aria-hidden="true">
            {[1, 2, 3].map((id) => (
              <span key={id} className={progress.openedGifts.includes(id) ? 'is-done' : ''}>
                ♡
              </span>
            ))}
          </div>
          <p aria-live="polite">
            {openedCount === 3
              ? site.gifts.completeLine
              : `${openedCount} of 3 opened — ${3 - openedCount} little surprise${3 - openedCount === 1 ? '' : 's'} waiting.`}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
