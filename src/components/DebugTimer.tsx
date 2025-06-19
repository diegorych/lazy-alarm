
import { useState, useEffect } from 'react';

interface DebugTimerProps {
  isNapping: boolean;
  napMode: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
}

const DebugTimer = ({ isNapping, napMode, startTime }: DebugTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<string>('');

  useEffect(() => {
    if (!isNapping || !startTime) {
      setTimeRemaining('');
      setElapsedTime('');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      // Calculate elapsed time
      const elapsedMinutes = Math.floor(elapsed / 60000);
      const elapsedSeconds = Math.floor((elapsed % 60000) / 1000);
      setElapsedTime(`${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}`);

      // Calculate remaining time based on nap mode
      let totalDuration = 0;
      
      switch (napMode) {
        case 'quick-nap':
          // Random between 20-30 minutes (using average for display)
          totalDuration = 25 * 60 * 1000;
          break;
        case 'before-dark':
          // For display purposes, show as 60 minutes (actual varies by sunset)
          totalDuration = 60 * 60 * 1000;
          break;
        case 'if-oversleep':
          // 2 hours
          totalDuration = 2 * 60 * 60 * 1000;
          break;
      }

      const remaining = Math.max(0, totalDuration - elapsed);
      const remainingMinutes = Math.floor(remaining / 60000);
      const remainingSeconds = Math.floor((remaining % 60000) / 1000);
      
      if (remaining > 0) {
        if (remainingMinutes >= 60) {
          const hours = Math.floor(remainingMinutes / 60);
          const minutes = remainingMinutes % 60;
          setTimeRemaining(`${hours}h ${minutes}m ${remainingSeconds}s`);
        } else {
          setTimeRemaining(`${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`);
        }
      } else {
        setTimeRemaining('Alarm should ring!');
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(interval);
  }, [isNapping, startTime, napMode]);

  // Only show in development or when explicitly enabled
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment || !isNapping) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-3 rounded-lg font-mono text-sm z-50 backdrop-blur-sm">
      <div className="text-xs text-gray-300 mb-1">DEBUG TIMER</div>
      <div>Mode: {napMode}</div>
      <div>Elapsed: {elapsedTime}</div>
      <div>Remaining: {timeRemaining}</div>
    </div>
  );
};

export default DebugTimer;
