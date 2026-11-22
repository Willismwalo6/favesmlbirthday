import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

type Props = {
  burst: number;
  pieces?: number;
  className?: string;
  /** Confetti falls from the top instead of bursting from the centre. */
  fromTop?: boolean;
};

const COLORS = ['#F5C6D5', '#E9A3BB', '#C97896', '#D9B879', '#FFF0E8', '#71364F'];

export default function Confetti({ burst, pieces = 60, className = '', fromTop = false }: Props) {
  const reduce = useReducedMotion();

  const items = useMemo(() => {
    const random = (seed: number) => {
      const value = Math.sin(seed * 9973 + burst * 31) * 10000;
      return value - Math.floor(value);
    };
    return Array.from({ length: reduce ? 0 : pieces }, (_, index) => {
      const color = COLORS[index % COLORS.length];
      const isHeart = index % 5 === 0;
      const size = 6 + random(index + 1) * 8;
      return {
        key: `${burst}-${index}`,
        left: `${random(index * 2 + 3) * 100}%`,
        delay: random(index * 3 + 7) * 0.9,
        duration: 2 + random(index * 5 + 2) * 2.4,
        drift: `${(random(index + 11) - 0.5) * 220}px`,
        rotate: `${random(index + 13) * 720 - 360}deg`,
        color,
        width: `${size}px`,
        height: isHeart ? `${size}px` : `${size * 1.7}px`,
        radius: isHeart || index % 3 === 0 ? '50%' : '2px',
        isHeart,
        opacity: 0.6 + random(index + 17) * 0.4,
      };
    });
  }, [burst, pieces, reduce]);

  if (reduce || !items.length || burst === 0) return null;

  return (
    <div
      className={`confetti ${fromTop ? 'confetti--top' : ''} ${className}`}
      key={burst}
      aria-hidden="true"
    >
      {items.map((item) => (
        <span
          key={item.key}
          className="confetti__piece"
          style={{
            left: item.left,
            width: item.width,
            height: item.height,
            borderRadius: item.radius,
            background: item.isHeart ? 'transparent' : item.color,
            color: item.color,
            opacity: item.opacity,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            ['--drift' as string]: item.drift,
            ['--rotate' as string]: item.rotate,
          }}
        >
          {item.isHeart ? '♥' : ''}
        </span>
      ))}
    </div>
  );
}
