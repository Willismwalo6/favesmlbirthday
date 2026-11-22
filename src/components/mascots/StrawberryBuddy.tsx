import { motion, useReducedMotion } from 'framer-motion';

export type StrawberryMood = 'idle' | 'encourage' | 'cheer';

type Props = {
  mood?: StrawberryMood;
  size?: number;
  className?: string;
  decorative?: boolean;
};

export default function StrawberryBuddy({
  mood = 'idle',
  size = 115,
  className = '',
  decorative = false,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`mascot mascot--strawberry mood--${mood} ${className}`}
      style={{ width: size, height: size }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label="Strawberry Buddy, a little strawberry character with green leaves"
    >
      <motion.div
        className="mascot__inner"
        animate={
          reduce
            ? { y: 0 }
            : mood === 'cheer'
              ? { y: [0, -14, 0], rotate: [-4, 4, -4] }
              : mood === 'encourage'
                ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
                : { y: [0, -3, 0], rotate: 0 }
        }
        transition={{
          duration: mood === 'cheer' ? 0.95 : 2.6,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 140 150" className="mascot__svg" aria-hidden="true">
          <defs>
            <radialGradient id="sBody" cx="35%" cy="26%" r="82%">
              <stop offset="0%" stopColor="#FFC9D8" />
              <stop offset="45%" stopColor="#F28DA8" />
              <stop offset="100%" stopColor="#D96A8B" />
            </radialGradient>
            <linearGradient id="sLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BFD9A8" />
              <stop offset="100%" stopColor="#8EB576" />
            </linearGradient>
          </defs>

          <ellipse cx="70" cy="140" rx="26" ry="5" fill="#C97896" opacity="0.14" />

          <g className="sb__body">
            <path
              d="M70 134C38 122 26 82 34 58C41 37 99 37 106 58C114 82 102 122 70 134Z"
              fill="url(#sBody)"
              stroke="#CE6484"
              strokeWidth="1.4"
            />
            <ellipse cx="48" cy="66" rx="8" ry="14" fill="#FFFFFF" opacity="0.28" transform="rotate(-18 48 66)" />

            <g className="sb__seeds" fill="#FFE7C8" opacity="0.95">
              <ellipse cx="52" cy="72" rx="1.8" ry="2.6" transform="rotate(-16 52 72)" />
              <ellipse cx="70" cy="66" rx="1.8" ry="2.6" />
              <ellipse cx="88" cy="72" rx="1.8" ry="2.6" transform="rotate(16 88 72)" />
              <ellipse cx="44" cy="90" rx="1.8" ry="2.6" transform="rotate(-18 44 90)" />
              <ellipse cx="96" cy="90" rx="1.8" ry="2.6" transform="rotate(18 96 90)" />
              <ellipse cx="56" cy="100" rx="1.8" ry="2.6" transform="rotate(-10 56 100)" />
              <ellipse cx="84" cy="100" rx="1.8" ry="2.6" transform="rotate(10 84 100)" />
              <ellipse cx="70" cy="108" rx="1.8" ry="2.6" />
              <ellipse cx="36" cy="104" rx="1.6" ry="2.4" />
              <ellipse cx="104" cy="104" rx="1.6" ry="2.4" />
            </g>

            <g className="sb__eyes">
              <ellipse cx="57" cy="82" rx="6.5" ry="8" fill="#FFFCFC" />
              <ellipse cx="83" cy="82" rx="6.5" ry="8" fill="#FFFCFC" />
              <circle cx="58" cy="83" r="4" fill="#5C2B3D" />
              <circle cx="84" cy="83" r="4" fill="#5C2B3D" />
              <circle cx="56.6" cy="81" r="1.5" fill="#FFFFFF" />
              <circle cx="82.6" cy="81" r="1.5" fill="#FFFFFF" />
            </g>

            <ellipse cx="46" cy="93" rx="6.5" ry="4" fill="#E5668A" opacity="0.55" />
            <ellipse cx="94" cy="93" rx="6.5" ry="4" fill="#E5668A" opacity="0.55" />

            <path
              d="M64 94q6 6 12 0"
              fill="none"
              stroke="#8C3550"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            <g className="sb__arms">
              <path d="M34 88q-14 4-12 16" fill="none" stroke="#E87A99" strokeWidth="5.5" strokeLinecap="round" />
              {mood === 'encourage' ? (
                <path d="M106 84q16-2 16-16" fill="none" stroke="#E87A99" strokeWidth="5.5" strokeLinecap="round" />
              ) : (
                <path d="M106 88q14 4 12 16" fill="none" stroke="#E87A99" strokeWidth="5.5" strokeLinecap="round" />
              )}
            </g>

            <g className="sb__leaf sb__leaf--c">
              <path d="M70 40c0-14 6-22 14-26-2 12-4 20-14 26z" fill="url(#sLeaf)" stroke="#7DA365" strokeWidth="1" />
              <path d="M70 40c0-14-6-22-14-26 2 12 4 20 14 26z" fill="url(#sLeaf)" stroke="#7DA365" strokeWidth="1" />
              <path d="M70 42c-8-8-18-8-24-4 8 6 16 8 24 4z" fill="url(#sLeaf)" stroke="#7DA365" strokeWidth="1" />
              <path d="M70 42c8-8 18-8 24-4-8 6-16 8-24 4z" fill="url(#sLeaf)" stroke="#7DA365" strokeWidth="1" />
              <path d="M70 40v-16" stroke="#7DA365" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          {mood === 'cheer' && (
            <g className="sb__sparkles">
              <path d="M114 44l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#E7C98F" />
              <path d="M24 54l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" fill="#E7C98F" />
              <circle cx="118" cy="100" r="2.6" fill="#FFF0E8" />
              <circle cx="20" cy="112" r="2.2" fill="#FFF0E8" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
