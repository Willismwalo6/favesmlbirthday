import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  text: string | null;
  side?: 'left' | 'right' | 'top';
  className?: string;
  live?: boolean;
};

export default function SpeechBubble({ text, side = 'left', className = '', live = true }: Props) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          className={`bubble bubble--${side} ${className}`}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          aria-live={live ? 'polite' : undefined}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
