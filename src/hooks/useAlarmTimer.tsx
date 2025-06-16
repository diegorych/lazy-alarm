
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
  
  const napTimerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize alarm sound
  useEffect(() => {
    // Create a simple tone using Web Audio API for the alarm sound
    const createAlarmSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A note
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
    setIsNapping(true);
    setHasRetried(false);
    
    // Randomize nap duration between 20-30 minutes (in milliseconds)
    const napDuration = (20 + Math.random() * 10) * 60 * 1000;
    console.log(`Nap duration: ${napDuration / 60000} minutes`);
    
    setTimeRemaining(napDuration);
    
    napTimerRef.current = setTimeout(() => {
      console.log('Nap time over, ringing alarm...');
      triggerAlarm();
    }, napDuration);
  };

  const triggerAlarm = () => {
    setIsAlarmRinging(true);
    onAlarmRing();
    
    // Play alarm sound
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    // Auto-stop alarm after 30 seconds
    alarmTimeoutRef.current = setTimeout(() => {
      console.log('Alarm auto-stopping...');
      setIsAlarmRinging(false);
      
      // If this is the first time, set retry for 10 minutes later
      if (!hasRetried) {
        console.log('Setting retry alarm for 10 minutes...');
        setHasRetried(true);
        
        retryTimeoutRef.current = setTimeout(() => {
          console.log('Retry alarm ringing...');
          triggerAlarm();
        }, 10 * 60 * 1000); // 10 minutes
      } else {
        // Second alarm finished, go back to main screen
        console.log('Second alarm finished, returning to main screen');
        resetAlarm();
      }
    }, 30 * 1000); // 30 seconds
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
    stopNap,
    isNapping,
    isAlarmRinging,
    timeRemaining
  };
};
