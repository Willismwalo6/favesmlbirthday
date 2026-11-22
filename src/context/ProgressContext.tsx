import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearProgress,
  emptyProgress,
  loadProgress,
  saveProgress,
  type Progress,
} from '../lib/storage';

type ProgressContextValue = {
  progress: Progress;
  openEnvelope: () => void;
  openGift: (id: number) => void;
  closeGift: (id: number) => void;
  markLetter: () => void;
  blowCandles: () => void;
  relightCandles: () => void;
  answer: (choice: 'yes' | 'think') => void;
  askAgain: () => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const openEnvelope = useCallback(() => {
    setProgress((current) => ({ ...current, envelopeOpened: true }));
  }, []);

  const openGift = useCallback((id: number) => {
    setProgress((current) =>
      current.openedGifts.includes(id)
        ? current
        : { ...current, openedGifts: [...current.openedGifts, id] }
    );
  }, []);

  const closeGift = useCallback((id: number) => {
    setProgress((current) => ({
      ...current,
      openedGifts: current.openedGifts.filter((gift) => gift !== id),
    }));
  }, []);

  const markLetter = useCallback(() => {
    setProgress((current) => ({ ...current, letterOpened: true }));
  }, []);

  const blowCandles = useCallback(() => {
    setProgress((current) => ({ ...current, candlesBlown: true }));
  }, []);

  const relightCandles = useCallback(() => {
    setProgress((current) => ({ ...current, candlesBlown: false }));
  }, []);

  const answer = useCallback((choice: 'yes' | 'think') => {
    setProgress((current) => ({ ...current, answer: choice }));
  }, []);

  const askAgain = useCallback(() => {
    setProgress((current) => ({ ...current, answer: null }));
  }, []);

  const reset = useCallback(() => {
    clearProgress();
    setProgress({ ...emptyProgress, visits: 1 });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      openEnvelope,
      openGift,
      closeGift,
      markLetter,
      blowCandles,
      relightCandles,
      answer,
      askAgain,
      reset,
    }),
    [progress, openEnvelope, openGift, closeGift, markLetter, blowCandles, relightCandles, answer, askAgain, reset]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used inside ProgressProvider');
  return context;
}
