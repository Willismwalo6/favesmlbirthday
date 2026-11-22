import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type Mood = 'idle' | 'wave' | 'jump' | 'kiss' | 'cheer' | 'think';

type MoodContextValue = {
  mood: Mood;
  line: string | null;
  react: (mood: Mood, line?: string, duration?: number) => void;
  clear: () => void;
};

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>('idle');
  const [line, setLine] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    setMood('idle');
    setLine(null);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const react = useCallback((nextMood: Mood, nextLine?: string, duration = 4200) => {
    if (timer.current) window.clearTimeout(timer.current);
    setMood(nextMood);
    setLine(nextLine ?? null);
    timer.current = window.setTimeout(() => {
      setMood('idle');
      setLine(null);
      timer.current = null;
    }, duration);
  }, []);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ mood, line, react, clear }), [mood, line, react, clear]);
  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used inside MoodProvider');
  return context;
}
