import { motion, useReducedMotion } from 'framer-motion';

export type BunnyMood = 'idle' | 'peek' | 'cheer';

type Props = {
  mood?: BunnyMood;
  size?: number;
  className?: string;
  decorative?: boolean;
};

export default function BunnyBuddy({
  mood = 'idle',
  size = 110,
  className = '',
  decorative = false,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`mascot mascot--bunny mood--${mood} ${className}`}
      style={{ width: size, height: size }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label="Bunny Buddy, a little pink bunny with long ears"
    >
      <motion.div
        className="mascot__inner"
        animate={
          reduce
            ? { y: 0 }
            : mood === 'cheer'
              ? { y: [0, -12, 0], rotate: [-3, 3, -3] }
              : mood === 'peek'
                ? { y: [6, -4, 6], rotate: 0 }
                : { y: [0, -4, 0] }
        }
        transition={{
          duration: mood === 'cheer' ? 1 : mood === 'peek' ? 1.6 : 3,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 140 150" className="mascot__svg" aria-hidden="true">
          <defs>
            <radialGradient id="bunBody" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#FFF5F8" />
              <stop offset="55%" stopColor="#FAD9E5" />
              <stop offset="100%" stopColor="#F0B5CA" />
            </radialGradient>
            <linearGradient id="bunEar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7C9D9" />
              <stop offset="100%" stopColor="#EFAFC6" />
            </linearGradient>
          </defs>

          <ellipse cx="70" cy="142" rx="28" ry="5" fill="#C97896" opacity="0.14" />

          <g className="bun__ears">
            <g className="bun__ear bun__ear--l">
              <ellipse cx="52" cy="40" rx="12" ry="34" fill="url(#bunBody)" stroke="#E6A6BE" strokeWidth="1.2" transform="rotate(-9 52 40)" />
              <ellipse cx="52" cy="42" rx="5.5" ry="24" fill="url(#bunEar)" transform="rotate(-9 52 42)" />
            </g>
            <g className="bun__ear bun__ear--r">
              <ellipse cx="88" cy="40" rx="12" ry="34" fill="url(#bunBody)" stroke="#E6A6BE" strokeWidth="1.2" transform="rotate(9 88 40)" />
              <ellipse cx="88" cy="42" rx="5.5" ry="24" fill="url(#bunEar)" transform="rotate(9 88 42)" />
            </g>
          </g>

          <ellipse cx="70" cy="120" rx="27" ry="22" fill="url(#bunBody)" stroke="#E6A6BE" strokeWidth="1.2" />
          <ellipse cx="70" cy="88" rx="33" ry="30" fill="url(#bunBody)" stroke="#E6A6BE" strokeWidth="1.2" />

          <g className="bun__eyes">
            <ellipse cx="58" cy="86" rx="6.5" ry="8" fill="#FFFCFC" />
            <ellipse cx="82" cy="86" rx="6.5" ry="8" fill="#FFFCFC" />
            <circle cx="59" cy="87" r="4.2" fill="#71364F" />
            <circle cx="83" cy="87" r="4.2" fill="#71364F" />
            <circle cx="57.5" cy="85" r="1.6" fill="#FFFFFF" />
            <circle cx="81.5" cy="85" r="1.6" fill="#FFFFFF" />
          </g>

          <ellipse cx="46" cy="97" rx="7" ry="4.5" fill="#F2AEC4" opacity="0.9" />
          <ellipse cx="94" cy="97" rx="7" ry="4.5" fill="#F2AEC4" opacity="0.9" />

          <path d="M66 95q4 5 8 0" fill="none" stroke="#B25E7C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M70 96v4" stroke="#B25E7C" strokeWidth="1.6" strokeLinecap="round" />

          <g className="bun__whiskers" stroke="#D89CB2" strokeWidth="1.2" strokeLinecap="round">
            <path d="M40 99h-14M40 104h-12M100 99h14M100 104h12" />
          </g>

          <g className="bun__paws">
            <ellipse cx="56" cy="130" rx="9" ry="6" fill="#FAD9E5" stroke="#E6A6BE" strokeWidth="1" />
            <ellipse cx="84" cy="130" rx="9" ry="6" fill="#FAD9E5" stroke="#E6A6BE" strokeWidth="1" />
          </g>

          <g className="bun__arms">
            <path d="M45 112q-8 6-4 14" fill="none" stroke="#F0B5CA" strokeWidth="6" strokeLinecap="round" />
            <path d="M95 112q8 6 4 14" fill="none" stroke="#F0B5CA" strokeWidth="6" strokeLinecap="round" />
          </g>

          {mood === 'cheer' && (
            <g className="bun__sparkles">
              <path d="M112 52l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#E7C98F" />
              <path d="M26 66l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" fill="#E7C98F" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
