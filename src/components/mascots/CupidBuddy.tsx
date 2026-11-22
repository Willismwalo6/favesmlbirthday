import { motion, useReducedMotion } from 'framer-motion';

export type CupidMood = 'fly' | 'deliver' | 'cheer' | 'idle';

type Props = {
  mood?: CupidMood;
  size?: number;
  className?: string;
  decorative?: boolean;
};

export default function CupidBuddy({
  mood = 'fly',
  size = 130,
  className = '',
  decorative = false,
}: Props) {
  const reduce = useReducedMotion();
  const flying = mood === 'fly' && !reduce;

  return (
    <div
      className={`mascot mascot--cupid mood--${mood} ${className}`}
      style={{ width: size, height: size }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label="Cupid Buddy, a little winged cupid carrying a love letter"
    >
      <motion.div
        className="mascot__inner"
        animate={
          flying
            ? { y: [0, -12, 0], rotate: [-3, 3, -3] }
            : mood === 'cheer' && !reduce
              ? { y: [0, -10, 0], scale: [1, 1.05, 1] }
              : { y: 0, rotate: 0, scale: 1 }
        }
        transition={{
          duration: mood === 'cheer' ? 1 : 2.4,
          repeat: flying || mood === 'cheer' ? Infinity : 0,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 160 150" className="mascot__svg" aria-hidden="true">
          <defs>
            <radialGradient id="cbSkin" cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#FFF3F6" />
              <stop offset="60%" stopColor="#FAD9E4" />
              <stop offset="100%" stopColor="#EFB9CB" />
            </radialGradient>
            <linearGradient id="cbWing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F6D6E2" />
            </linearGradient>
            <linearGradient id="cbGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F0DBAF" />
              <stop offset="100%" stopColor="#D0A75F" />
            </linearGradient>
          </defs>

          <g className="cb__wing cb__wing--l">
            <path
              d="M64 70C48 52 30 48 20 58c-8 8 0 22 12 26 8 3 18 2 26-2z"
              fill="url(#cbWing)"
              stroke="#E2B7C7"
              strokeWidth="1.2"
            />
            <path d="M58 70c-10-6-20-8-28-4" stroke="#EBC7D4" strokeWidth="1.4" fill="none" />
          </g>
          <g className="cb__wing cb__wing--r">
            <path
              d="M96 70c16-18 34-22 44-12 8 8 0 22-12 26-8 3-18 2-26-2z"
              fill="url(#cbWing)"
              stroke="#E2B7C7"
              strokeWidth="1.2"
            />
            <path d="M102 70c10-6 20-8 28-4" stroke="#EBC7D4" strokeWidth="1.4" fill="none" />
          </g>

          <ellipse cx="80" cy="142" rx="30" ry="5" fill="#C97896" opacity="0.12" />

          <g className="cb__body">
            <path d="M80 122c-9 0-14 4-14 10" stroke="#EFB9CB" strokeWidth="7" strokeLinecap="round" fill="none" />
            <ellipse cx="80" cy="112" rx="20" ry="17" fill="url(#cbSkin)" stroke="#E4AEC0" strokeWidth="1.2" />
            <ellipse cx="80" cy="78" rx="31" ry="29" fill="url(#cbSkin)" stroke="#E4AEC0" strokeWidth="1.2" />

            <g className="cb__eyes">
              <ellipse cx="68" cy="76" rx="6.4" ry="8" fill="#FFFCFC" />
              <ellipse cx="92" cy="76" rx="6.4" ry="8" fill="#FFFCFC" />
              <circle cx="69" cy="77" r="4" fill="#71364F" />
              <circle cx="93" cy="77" r="4" fill="#71364F" />
              <circle cx="67.6" cy="75" r="1.5" fill="#FFFFFF" />
              <circle cx="91.6" cy="75" r="1.5" fill="#FFFFFF" />
            </g>

            <ellipse cx="56" cy="88" rx="6.5" ry="4" fill="#F3A8BF" opacity="0.9" />
            <ellipse cx="104" cy="88" rx="6.5" ry="4" fill="#F3A8BF" opacity="0.9" />

            <path d="M75 88q5 5 10 0" fill="none" stroke="#B25E7C" strokeWidth="2.2" strokeLinecap="round" />

            <path d="M62 92C50 82 56 62 70 58" stroke="#E7C98F" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M98 92c12-10 6-30-8-34" stroke="#E7C98F" strokeWidth="3" fill="none" strokeLinecap="round" />

            <g className="cb__envelope">
              <rect x="62" y="104" width="36" height="26" rx="4" fill="#FFF6EF" stroke="#D9B879" strokeWidth="1.4" />
              <path d="M62 108l18 13 18-13" fill="none" stroke="#E2BE8E" strokeWidth="1.6" />
              <path
                d="M80 118c-3-2-6-4-6-6.5 0-2 1.6-3.2 3.2-3.2 1.1 0 2.2.6 2.8 1.6.6-1 1.7-1.6 2.8-1.6 1.6 0 3.2 1.3 3.2 3.2 0 2.5-3 4.5-6 6.5z"
                fill="#DD7C99"
              />
            </g>

            <g className="cb__bow">
              <path d="M106 100c-6-5-12-2-10 4 1 5 7 5 10 2z" fill="url(#cbGold)" />
              <path d="M112 100c6-5 12-2 10 4-1 5-7 5-10 2z" fill="url(#cbGold)" />
              <circle cx="109" cy="102" r="2.8" fill="#C69A56" />
            </g>
          </g>

          {mood !== 'idle' && (
            <g className="cb__sparkles">
              <path d="M22 26l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#E7C98F" />
              <path d="M136 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#E7C98F" />
              <circle cx="128" cy="20" r="2.4" fill="#FFF0E8" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
