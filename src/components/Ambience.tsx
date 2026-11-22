import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

type Variant = 'hearts' | 'petals' | 'sparkles' | 'mixed';

type Props = {
  variant?: Variant;
  count?: number;
  className?: string;
  seed?: number;
};

const rand = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export default function Ambience({ variant = 'hearts', count = 12, className = '', seed = 1 }: Props) {
  const reduce = useReducedMotion();

  const items = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const s = index + seed * 13;
      const roll = rand(s + 2);
      const kind =
        variant === 'mixed'
          ? roll > 0.7
            ? 'sparkle'
            : roll > 0.45
              ? 'petal'
              : 'heart'
          : variant === 'hearts'
            ? 'heart'
            : variant === 'petals'
              ? 'petal'
              : 'sparkle';

      return {
        id: `${variant}-${index}`,
        kind,
        left: `${rand(s) * 100}%`,
        top: `${rand(s + 4) * 100}%`,
        size: 8 + rand(s + 7) * 18,
        delay: rand(s + 9) * 8,
        duration: 9 + rand(s + 11) * 12,
        drift: `${(rand(s + 15) - 0.5) * 160}px`,
        opacity: 0.28 + rand(s + 19) * 0.5,
      };
    });
  }, [variant, count, seed]);

  return (
    <div className={`ambience ambience--${variant} ${className}`} aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className={`ambience__item ambience__item--${item.kind} ${reduce ? 'ambience__item--still' : ''}`}
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            opacity: item.opacity,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            ['--drift' as string]: item.drift,
            ['--spin' as string]: `${rand(Number(item.size) + 3) * 220 - 110}deg`,
          }}
        >
          {item.kind === 'heart' ? '♡' : item.kind === 'petal' ? '❀' : '✦'}
        </span>
      ))}
    </div>
  );
}
