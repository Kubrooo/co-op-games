import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';

export function useTimer(initialSeconds, onTimeUp, autoStart = true) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const callbackRef = useRef(onTimeUp);

  useEffect(() => {
    callbackRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      if (callbackRef.current) callbackRef.current();
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 4 && prev > 1) {
          sound.playCountdown();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newTime = initialSeconds) => {
    setTimeLeft(newTime);
    setIsRunning(true);
  };

  return { timeLeft, isRunning, start, pause, reset };
}
