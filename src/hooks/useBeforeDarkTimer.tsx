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
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + duration - 0.1);
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
