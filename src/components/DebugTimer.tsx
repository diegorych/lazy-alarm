
import { useState, useEffect } from 'react';

interface DebugTimerProps {
  isNapping: boolean;
  napMode: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
  actualDuration?: number; // Add this to pass the real duration from hooks
}

const DebugTimer = ({ isNapping, napMode, startTime, actualDuration }: DebugTimerProps) => {
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

      // Use actual duration if provided, otherwise fallback to previous logic
      let totalDuration = actualDuration || 0;
      
      if (!actualDuration) {
        // Fallback logic (shouldn't be used now)
        switch (napMode) {
          case 'quick-nap':
            totalDuration = 25 * 60 * 1000;
            break;
          case 'before-dark':
            totalDuration = 60 * 60 * 1000;
            break;
          case 'if-oversleep':
            totalDuration = 2 * 60 * 60 * 1000;
            break;
        }
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
  }, [isNapping, startTime, napMode, actualDuration]);

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
      {actualDuration && (
        <div className="text-xs text-gray-400 mt-1">
          Total: {Math.round(actualDuration / 60000)}min
        </div>
      )}
    </div>
  );
};

export default DebugTimer;
