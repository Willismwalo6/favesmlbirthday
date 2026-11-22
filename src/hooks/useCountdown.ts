import { useEffect, useState } from 'react';
import { getCountdownState, type CountdownState } from '../lib/birthday';

/** Live countdown in Africa/Nairobi, re-computed every second. */
export function useCountdown(): CountdownState {
  const [state, setState] = useState<CountdownState>(() => getCountdownState());

  useEffect(() => {
    const tick = () => setState(getCountdownState());
    tick();
    const interval = window.setInterval(tick, 1000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', tick);
    };
  }, []);

  return state;
}
