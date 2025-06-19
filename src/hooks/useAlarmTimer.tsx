
import { useState, useEffect, useRef } from 'react';

interface UseAlarmTimerProps {
  onAlarmRing: () => void;
  onAlarmStop: () => void;
}

export const useAlarmTimer = ({ onAlarmRing, onAlarmStop }: UseAlarmTimerProps) => {
  const [isNapping, setIsNapping] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasRetried, setHasRetried] = useState(false);
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [actualDuration, setActualDuration] = useState<number | undefined>(undefined);
  
  const napTimerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize alarm sound
  useEffect(() => {
    const createAlarmSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    };

    audioRef.current = { play: createAlarmSound } as any;
  }, []);

  const startNap = () => {
    console.log('Starting nap...');
    const napStartTime = Date.now();
    setStartTime(napStartTime);
    setIsNapping(true);
    setHasRetried(false);
    
    // Changed to 1 minute for testing
    const napDuration = 1 * 60 * 1000; // 1 minute in milliseconds
    setActualDuration(napDuration);
    console.log(`Nap duration: ${napDuration / 60000} minutes`);
    
    setTimeRemaining(napDuration);
    
    napTimerRef.current = setTimeout(() => {
      console.log('Nap time over, showing wake up screen...');
      triggerAlarm();
    }, napDuration);
  };

  const triggerAlarm = () => {
    setIsAlarmRinging(true);
    onAlarmRing();
    
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    // Auto-extend after 30 seconds if no response
    alarmTimeoutRef.current = setTimeout(() => {
      console.log('No response, extending nap by 10 minutes...');
      extendNap();
    }, 30 * 1000);
  };

  const extendNap = () => {
    console.log('Extending nap by 10 minutes...');
    setIsAlarmRinging(false);
    
    // Clear the auto-extend timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    
    // Set new timer for 10 minutes
    napTimerRef.current = setTimeout(() => {
      console.log('Extended nap time over, showing wake up screen again...');
      triggerAlarm();
    }, 10 * 60 * 1000); // 10 minutes
  };

  const stopAlarm = () => {
    console.log('User stopped alarm');
    setIsAlarmRinging(false);
    resetAlarm();
  };

  const stopNap = () => {
    console.log('User stopped nap manually');
    resetAlarm();
  };

  const resetAlarm = () => {
    setIsNapping(false);
    setIsAlarmRinging(false);
    setTimeRemaining(0);
    setHasRetried(false);
    setStartTime(undefined);
    setActualDuration(undefined);
    
    // Clear all timers
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

  // Cleanup on unmount
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
    timeRemaining,
    startTime,
    actualDuration
  };
};
