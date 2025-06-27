
import { useState, useEffect, useRef } from 'react';

interface UseOversleepTimerProps {
  onAlarmRing: () => void;
  onAlarmStop: () => void;
}

export const useOversleepTimer = ({ onAlarmRing, onAlarmStop }: UseOversleepTimerProps) => {
  const [isNapping, setIsNapping] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [actualDuration, setActualDuration] = useState<number | undefined>(undefined);
  
  const napTimerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize pleasant alarm sound
  useEffect(() => {
    const createPleasantAlarm = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant melodic sequence
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        // Gentle fade in and out
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Pleasant melody - C major chord progression
      const now = audioContext.currentTime;
      const noteDuration = 0.8;
      
      // Play a gentle ascending melody
      playNote(523.25, now, noteDuration); // C5
      playNote(659.25, now + 0.4, noteDuration); // E5
      playNote(783.99, now + 0.8, noteDuration); // G5
      playNote(1046.50, now + 1.2, noteDuration * 1.5); // C6 - longer final note
    };

    audioRef.current = { play: createPleasantAlarm } as any;
  }, []);

  const startNap = () => {
    console.log('Starting oversleep-protection nap...');
    const napStartTime = Date.now();
    setStartTime(napStartTime);
    setIsNapping(true);
    setHasRetried(false);
    
    const oversleepDuration = 2 * 60 * 60 * 1000;
    setActualDuration(oversleepDuration);
    console.log(`Oversleep protection set for: ${oversleepDuration / 3600000} hours`);
    
    napTimerRef.current = setTimeout(() => {
      console.log('Oversleep detected, triggering gentle alarm...');
      triggerAlarm();
    }, oversleepDuration);
  };

  const triggerAlarm = () => {
    setIsAlarmRinging(true);
    onAlarmRing();
    
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    alarmTimeoutRef.current = setTimeout(() => {
      console.log('No response, extending nap by 10 minutes...');
      extendNap();
    }, 30 * 1000);
  };

  const extendNap = () => {
    console.log('Extending nap by 10 minutes...');
    setIsAlarmRinging(false);
    
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    
    napTimerRef.current = setTimeout(() => {
      console.log('Extended nap time over, showing wake up screen again...');
      triggerAlarm();
    }, 10 * 60 * 1000);
  };

  const stopAlarm = () => {
    console.log('User stopped alarm');
    setIsAlarmRinging(false);
    resetAlarm();
  };

  const stopNap = () => {
    console.log('User stopped nap manually (no oversleep detected)');
    resetAlarm();
  };

  const resetAlarm = () => {
    setIsNapping(false);
    setIsAlarmRinging(false);
    setHasRetried(false);
    setStartTime(undefined);
    setActualDuration(undefined);
    
    if (napTimerRef.current) {
      clearTimeout(napTimerRef.current);
      napTimerRef.current = null;
    }
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    onAlarmStop();
  };

  useEffect(() => {
    return () => {
      if (napTimerRef.current) clearTimeout(napTimerRef.current);
      if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return {
    startNap,
    stopAlarm,
    stopNap: resetAlarm,
    extendNap,
    isNapping,
    isAlarmRinging,
    startTime,
    actualDuration
  };
};
