import { motion, useReducedMotion } from 'framer-motion';

export type BuddyMood = 'idle' | 'wave' | 'jump' | 'kiss' | 'cheer' | 'think';

type Props = {
  mood?: BuddyMood;
  size?: number;
  className?: string;
  onClick?: () => void;
  decorative?: boolean;
};

export default function HeartBuddy({
  mood = 'idle',
  size = 120,
  className = '',
  onClick,
  decorative = false,
}: Props) {
  const reduce = useReducedMotion();

  const wrapper =
    reduce || mood === 'idle' || mood === 'wave' || mood === 'think'
      ? { y: 0, rotate: mood === 'think' ? -4 : 0, scale: 1 }
      : mood === 'jump'
        ? { y: [0, -24, 0, -12, 0], scale: [1, 1.06, 1, 1.03, 1] }
        : mood === 'kiss'
          ? { scale: [1, 1.07, 1], rotate: 0, y: 0 }
          : { y: [0, -10, 0], rotate: [-4, 4, -4] };

  return (
    <div
      className={`mascot mascot--heart mood--${mood} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      role={onClick ? 'button' : decorative ? undefined : 'img'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={
        onClick
          ? 'Heart Buddy — tap for a little love'
          : decorative
            ? undefined
            : 'Heart Buddy, a little pink heart character with big eyes'
      }
      aria-hidden={(decorative && !onClick) || undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <motion.div
        className="mascot__inner"
        animate={wrapper}
        transition={{
          duration: mood === 'jump' ? 1.1 : mood === 'cheer' ? 1.2 : 0.6,
          repeat: mood === 'cheer' && !reduce ? Infinity : 1,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 140 140" className="mascot__svg" aria-hidden="true">
          <defs>
            <radialGradient id="hbBody" cx="35%" cy="28%" r="82%">
              <stop offset="0%" stopColor="#FFF1F5" />
              <stop offset="45%" stopColor="#F9D3DF" />
              <stop offset="100%" stopColor="#E9A3BB" />
            </radialGradient>
            <linearGradient id="hbBow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2DDB0" />
              <stop offset="100%" stopColor="#D9B879" />
            </linearGradient>
            <filter id="hbGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="70" cy="130" rx="26" ry="5" fill="#C97896" opacity="0.16" />

          <g className="hb__body">
            <path
              d="M70 116C36 96 14 74 14 50C14 32 27 20 44 20C56 20 66 27 70 37C74 27 84 20 96 20C113 20 126 32 126 50C126 74 104 96 70 116Z"
              fill="url(#hbBody)"
              stroke="#D98BA6"
              strokeWidth="1.2"
            />
            <ellipse
              cx="47"
              cy="42"
              rx="13"
              ry="8"
              fill="#FFFFFF"
              opacity="0.55"
              transform="rotate(-28 47 42)"
            />

            <g className="hb__eyes">
              <ellipse cx="53" cy="62" rx="8" ry="9.5" fill="#FFFCFC" />
              <ellipse cx="87" cy="62" rx="8" ry="9.5" fill="#FFFCFC" />
              <g className={mood === 'think' ? 'hb__pupils hb__pupils--up' : 'hb__pupils'}>
                <circle cx="54" cy="63" r="5" fill="#71364F" />
                <circle cx="88" cy="63" r="5" fill="#71364F" />
                <circle cx="52.2" cy="60.8" r="1.9" fill="#FFFFFF" />
                <circle cx="86.2" cy="60.8" r="1.9" fill="#FFFFFF" />
              </g>
            </g>

            <ellipse cx="40" cy="77" rx="8" ry="5" fill="#EFA9BF" opacity="0.85" />
            <ellipse cx="100" cy="77" rx="8" ry="5" fill="#EFA9BF" opacity="0.85" />

            {mood === 'kiss' ? (
              <ellipse className="hb__mouth" cx="70" cy="82" rx="5" ry="6" fill="#C0607F" />
            ) : mood === 'think' ? (
              <path
                className="hb__mouth"
                d="M63 84q7 2 14-2"
                fill="none"
                stroke="#A9516F"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            ) : (
              <path
                className="hb__mouth"
                d="M60 79q10 10 20 0"
                fill="none"
                stroke="#A9516F"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            )}

            <g className="hb__arm hb__arm--l">
              <path
                d="M20 66q-12 4-9 16"
                fill="none"
                stroke="#E29CB3"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
            <g className="hb__arm hb__arm--r">
              <path
                d="M120 66q12 4 9 16"
                fill="none"
                stroke="#E29CB3"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            <ellipse cx="52" cy="121" rx="9" ry="6" fill="#E9A3BB" />
            <ellipse cx="88" cy="121" rx="9" ry="6" fill="#E9A3BB" />

            <g className="hb__bow" filter="url(#hbGlow)">
              <path d="M34 22c-7-6-14-2-12 5 1 5 8 6 12 3z" fill="url(#hbBow)" />
              <path d="M40 22c7-6 14-2 12 5-1 5-8 6-12 3z" fill="url(#hbBow)" />
              <circle cx="37" cy="25" r="3.4" fill="#C69A56" />
            </g>
          </g>

          {mood === 'cheer' && (
            <g className="hb__sparkles">
              <path
                d="M112 18l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"
                fill="#E7C98F"
              />
              <path d="M22 40l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5z" fill="#E7C98F" />
              <circle cx="118" cy="86" r="3" fill="#FFF0E8" />
              <circle cx="20" cy="96" r="2.4" fill="#FFF0E8" />
            </g>
          )}
        </svg>
      </motion.div>

      {mood === 'kiss' && !reduce && (
        <div className="mascot__kisses" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0], y: -60 - index * 16, x: 12 + index * 16, scale: 1 }}
              transition={{ duration: 1.6, delay: index * 0.22, ease: 'easeOut' }}
            >
              ♡
            </motion.span>
          ))}
        </div>
      )}
      {mood === 'think' && (
        <div className="mascot__thought" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
