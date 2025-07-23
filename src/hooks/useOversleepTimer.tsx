
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlarmSound = () => {
    const audio = new Audio('/sounds/despertador.mp3');
    audio.play().catch((e) => {
      console.error("Error al reproducir el sonido de alarma:", e);
    });
    audioRef.current = audio;
  };

  const startAlarmLoop = () => {
    console.log('Playing alarm sound...');
    playAlarmSound();
  };

  const stopAlarmLoop = () => {
    console.log('Stopping alarm loop...');
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

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
    console.log('triggerAlarm called - setting alarm ringing state and starting alarm loop');
    setIsAlarmRinging(true);
    onAlarmRing();
    
    startAlarmLoop();
    
    alarmTimeoutRef.current = setTimeout(() => {
      console.log('No response, extending nap by 10 minutes...');
      extendNap();
    }, 30 * 1000);
  };

  const extendNap = () => {
    console.log('Extending nap by 10 minutes...');
    setIsAlarmRinging(false);
    stopAlarmLoop();
    
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
    stopAlarmLoop();
    resetAlarm();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
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
    
    stopAlarmLoop();
    
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
    startTime,
    actualDuration
  };
};
