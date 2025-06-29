
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    return () => {
      // Cleanup audio context on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }
    };
  }, []);

  const playAlarmSound = () => {
    console.log('Creating pleasant alarm sound...');
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
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
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Pleasant melody - C major chord progression
      const now = audioContext.currentTime;
      const noteDuration = 0.8;
      
      console.log('Playing alarm melody...');
      // Play a gentle ascending melody
      playNote(523.25, now, noteDuration); // C5
      playNote(659.25, now + 0.4, noteDuration); // E5
      playNote(783.99, now + 0.8, noteDuration); // G5
      playNote(1046.50, now + 1.2, noteDuration * 1.5); // C6 - longer final note
      
      console.log('Alarm sound should be playing now');
    } catch (error) {
      console.error('Error creating alarm sound:', error);
    }
  };

  const startAlarmLoop = () => {
    console.log('Starting alarm loop...');
    // Play immediately
    playAlarmSound();
    
    // Then repeat every 3 seconds
    alarmIntervalRef.current = setInterval(() => {
      if (isAlarmRinging) {
        playAlarmSound();
      }
    }, 3000);
  };

  const stopAlarmLoop = () => {
    console.log('Stopping alarm loop...');
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const startNap = () => {
    console.log('Starting nap...');
    const napStartTime = Date.now();
    setStartTime(napStartTime);
    setIsNapping(true);
    setHasRetried(false);
    
    // Random duration between 20-30 minutes
    const randomMinutes = Math.floor(Math.random() * 11) + 20; // 20 to 30 minutes
    const napDuration = randomMinutes * 60 * 1000; // convert to milliseconds
    setActualDuration(napDuration);
    console.log(`Nap duration: ${randomMinutes} minutes`);
    
    setTimeRemaining(napDuration);
    
    napTimerRef.current = setTimeout(() => {
      console.log('Nap time over, showing wake up screen...');
      triggerAlarm();
    }, napDuration);
  };

  const triggerAlarm = () => {
    console.log('triggerAlarm called - setting alarm ringing state and starting alarm loop');
    setIsAlarmRinging(true);
    onAlarmRing();
    
    startAlarmLoop();
    
    // Auto-extend after 30 seconds if no response
    alarmTimeoutRef.current = setTimeout(() => {
      console.log('No response, extending nap by 10 minutes...');
      extendNap();
    }, 30 * 1000);
  };

  const extendNap = () => {
    console.log('Extending nap by 10 minutes...');
    setIsAlarmRinging(false);
    stopAlarmLoop();
    
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
    stopAlarmLoop();
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
    
    stopAlarmLoop();
    
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
      stopAlarmLoop();
    };
  }, []);

  return {
    startNap,
    stopAlarm,
    stopNap: resetAlarm,
    extendNap,
    triggerAlarm,
    isNapping,
    isAlarmRinging,
    timeRemaining,
    startTime,
    actualDuration
  };
};
