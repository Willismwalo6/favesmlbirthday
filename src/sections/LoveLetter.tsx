import { useState } from 'react';
import { site } from '../config/site';
import PhotoSlot from '../components/PhotoSlot';
import HeartBuddy from '../components/mascots/HeartBuddy';
import SpeechBubble from '../components/SpeechBubble';
import Ambience from '../components/Ambience';
import Reveal from '../components/Reveal';
import { useProgress } from '../context/ProgressContext';
import { useMood } from '../context/MoodContext';

export default function LoveLetter() {
  const { markLetter } = useProgress();
  const { react } = useMood();
  const [unfolded, setUnfolded] = useState(false);
  const [line, setLine] = useState<string | null>(null);

  const toggle = () => {
    const next = !unfolded;
    setUnfolded(next);
    if (next) {
      markLetter();
      react('jump', 'I meant every single word ♡', 5000);
      setLine('Read it slowly, beautiful.');
      window.setTimeout(() => setLine(null), 6000);
    } else {
      setLine(null);
    }
  };

  return (
    <section id="letter" className="section letter">
      <Ambience variant="sparkles" count={16} seed={29} />
      <div className="letter__inner section__inner">
        <Reveal className="section__head">
          <p className="eyebrow">sealed with love</p>
          <h2 className="section__title">{site.letter.heading}</h2>
        </Reveal>

        <div className="letter__stage">
          <Reveal className="letter__photos" delay={0.05}>
            <div className="letter__photo-main">
              <PhotoSlot
                id="faves-photo-13"
                variant="frame"
                ratio="4 / 5"
                caption="To my favourite girl."
                showMeta
              />
              <span className="letter__photo-flower" aria-hidden="true">❀</span>
            </div>
            <div className="letter__photo-small">
              <PhotoSlot
                id="faves-photo-14"
                variant="tape"
                ratio="4 / 3"
                caption="P.S. you are so loved."
                showMeta
              />
            </div>
            <div className="letter__buddy" data-scene-mascot>
              <HeartBuddy mood={unfolded ? 'cheer' : 'idle'} size={86} decorative />
              <SpeechBubble text={line} side="top" />
            </div>
          </Reveal>

          <Reveal className="letter__reader" delay={0.12}>
            <div className={`letter__stationery ${unfolded ? 'is-unfolded' : ''}`}>
              <div className="letter__envelope-flap" aria-hidden="true" />
              <article className="letter__paper">
                <span className="letter__border" aria-hidden="true" />
                <span className="letter__wax" aria-hidden="true">
                  <svg viewBox="0 0 32 32">
                    <path
                      d="M16 27C9 22 4.5 17.5 4.5 12.5 4.5 8.6 7.6 6 11 6c2 0 3.9 1 5 2.7C17.1 7 19 6 21 6c3.4 0 6.5 2.6 6.5 6.5 0 5-4.5 9.5-11.5 14.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <p className="letter__hand letter__salutation">{site.letter.salutation}</p>
                <div className="letter__body">
                  {site.letter.paragraphs.map((paragraph, index) =>
                    index === 0 ? (
                      <p key={index} className="letter__greeting">
                        {paragraph}
                      </p>
                    ) : (
                      <p key={index}>{paragraph}</p>
                    )
                  )}
                  <p className="letter__hand letter__signoff">{site.letter.close}</p>
                </div>
                <span className="letter__paper-rose" aria-hidden="true">❀</span>
              </article>
              <div className="letter__closed-note" aria-hidden={unfolded}>
                <span className="letter__closed-flower">❀</span>
                <p className="letter__hand">For Faves, with all my love</p>
                <span className="letter__closed-hint">press to unfold ♡</span>
              </div>
            </div>

            <div className="letter__actions">
              <button type="button" className="btn btn--primary" onClick={toggle} aria-expanded={unfolded}>
                {unfolded ? 'FOLD THE LETTER ♡' : 'UNFOLD THE LETTER ♡'}
              </button>
              <p className="letter__actions-note">
                {unfolded
                  ? 'You can fold it and read it again whenever you like.'
                  : 'A little something I wrote just for you.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
