import { useEffect, useState } from 'react';
import { useMood } from '../context/MoodContext';
import { usePhotos } from '../context/PhotoContext';
import { useProgress } from '../context/ProgressContext';
import HeartBuddy from './mascots/HeartBuddy';
import SpeechBubble from './SpeechBubble';

const idleLines = [
  'You&rsquo;re so loved!',
  'Psst... keep going!',
  'Heyyy Faves! ♡',
  'I have something special for you!',
  'One last surprise, beautiful!',
];

export default function HeartCompanion() {
  const { mood, line, react } = useMood();
  const { progress } = useProgress();
  const { studioOpen } = usePhotos();
  const [sceneMascotVisible, setSceneMascotVisible] = useState(false);

  // Step aside while a section shows its own mascot, so there is never more
  // than one Heart Buddy (or a busy mascot cluster) on screen at once.
  useEffect(() => {
    if (!progress.envelopeOpened) return;
    const nodes = Array.from(document.querySelectorAll('[data-scene-mascot]'));
    if (!nodes.length) return;
    const seen = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target, entry.isIntersecting));
        setSceneMascotVisible(Array.from(seen.values()).some(Boolean));
      },
      { threshold: 0.25 }
    );
    nodes.forEach((node) => {
      seen.set(node, false);
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [progress.envelopeOpened]);

  if (!progress.envelopeOpened || studioOpen || sceneMascotVisible) return null;

  const speak = () => {
    const next = idleLines[Math.floor(Math.random() * idleLines.length)];
    react('cheer', next.replace(/&rsquo;/g, '’'), 3600);
  };

  return (
    <div className={`companion ${line ? 'is-speaking' : ''}`}>
      <SpeechBubble text={line ? line.replace(/&rsquo;/g, '’') : null} side="left" className="companion__bubble" />
      <HeartBuddy
        mood={mood}
        size={92}
        onClick={speak}
        className="companion__buddy"
        decorative
      />
      <span className="companion__hint" aria-hidden="true">tap me ♡</span>
    </div>
  );
}
