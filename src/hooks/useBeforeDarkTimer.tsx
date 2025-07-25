import { useState, useEffect, useRef } from 'react';

interface UseBeforeDarkTimerProps {
  onAlarmRing: () => void;
  onAlarmStop: () => void;
}

const getSunsetTime = async (latitude: number, longitude: number): Promise<Date> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${today}&formatted=0`
    );
    const data = await response.json();
    return new Date(data.results.sunset);
  } catch (error) {
    console.error('Failed to get sunset time:', error);
    const fallbackSunset = new Date();
    fallbackSunset.setHours(18, 0, 0, 0);
    return fallbackSunset;
  }
};

export const useBeforeDarkTimer = ({ onAlarmRing, onAlarmStop }: UseBeforeDarkTimerProps) => {
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

  const startNap = async () => {
    console.log('Starting before-dark nap...');
    const napStartTime = Date.now();
    setStartTime(napStartTime);
    setIsNapping(true);
    setHasRetried(false);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });
      
      const { latitude, longitude } = position.coords;
      const sunsetTime = await getSunsetTime(latitude, longitude);
      
      const minutesBeforeSunset = 10 + Math.random() * 5;
      const wakeUpTime = new Date(sunsetTime.getTime() - minutesBeforeSunset * 60 * 1000);
      const now = new Date();
      
      const napDuration = wakeUpTime.getTime() - now.getTime();
      
      if (napDuration > 0) {
        setActualDuration(napDuration);
        console.log(`Nap duration until sunset: ${napDuration / 60000} minutes`);
        
        napTimerRef.current = setTimeout(() => {
          console.log('Time to wake up before sunset...');
          triggerAlarm();
        }, napDuration);
      } else {
        console.log('Sunset already passed, setting short nap');
        const shortNapDuration = 20 * 60 * 1000;
        setActualDuration(shortNapDuration);
        napTimerRef.current = setTimeout(() => {
          triggerAlarm();
        }, shortNapDuration);
      }
      
    } catch (error) {
      console.error('Location or sunset calculation failed:', error);
      const fallbackDuration = 30 * 60 * 1000;
      setActualDuration(fallbackDuration);
      napTimerRef.current = setTimeout(() => {
        triggerAlarm();
      }, fallbackDuration);
    }
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
    console.log('User stopped nap manually');
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
