
import { useState, useEffect, useRef } from 'react';

interface UseOversleepTimerProps {
  onAlarmRing: () => void;
  onAlarmStop: () => void;
}

export const useOversleepTimer = ({ onAlarmRing, onAlarmStop }: UseOversleepTimerProps) => {
  const [isNapping, setIsNapping] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  
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
    console.log('Starting oversleep-protection nap...');
    setIsNapping(true);
    setHasRetried(false);
    
    // Set timer for 2 hours
    const oversleepDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
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
      console.log('Alarm auto-stopping...');
      setIsAlarmRinging(false);
      
      if (!hasRetried) {
        console.log('Setting retry alarm for 10 minutes...');
        setHasRetried(true);
        
        retryTimeoutRef.current = setTimeout(() => {
          console.log('Retry alarm ringing...');
          triggerAlarm();
        }, 10 * 60 * 1000);
      } else {
        console.log('Second alarm finished, returning to main screen');
        resetAlarm();
      }
    }, 30 * 1000);
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
    stopNap,
    isNapping,
    isAlarmRinging
  };
};
