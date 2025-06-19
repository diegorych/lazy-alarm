
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
    // Fallback: assume sunset at 6 PM
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

  const startNap = async () => {
    console.log('Starting before-dark nap...');
    const napStartTime = Date.now();
    setStartTime(napStartTime);
    setIsNapping(true);
    setHasRetried(false);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });
      
      const { latitude, longitude } = position.coords;
      const sunsetTime = await getSunsetTime(latitude, longitude);
      
      // Calculate wake-up time (10-15 minutes before sunset)
      const minutesBeforeSunset = 10 + Math.random() * 5; // Random between 10-15 minutes
      const wakeUpTime = new Date(sunsetTime.getTime() - minutesBeforeSunset * 60 * 1000);
      const now = new Date();
      
      const napDuration = wakeUpTime.getTime() - now.getTime();
      
      if (napDuration > 0) {
        setActualDuration(napDuration); // Store the actual calculated duration
        console.log(`Nap duration until sunset: ${napDuration / 60000} minutes`);
        
        napTimerRef.current = setTimeout(() => {
          console.log('Time to wake up before sunset...');
          triggerAlarm();
        }, napDuration);
      } else {
        // If sunset already passed, set a short nap
        console.log('Sunset already passed, setting short nap');
        const shortNapDuration = 20 * 60 * 1000; // 20 minutes
        setActualDuration(shortNapDuration);
        napTimerRef.current = setTimeout(() => {
          triggerAlarm();
        }, shortNapDuration);
      }
      
    } catch (error) {
      console.error('Location or sunset calculation failed:', error);
      // Fallback to a standard nap duration
      const fallbackDuration = 30 * 60 * 1000; // 30 minutes
      setActualDuration(fallbackDuration);
      napTimerRef.current = setTimeout(() => {
        triggerAlarm();
      }, fallbackDuration);
    }
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
    console.log('User stopped nap manually');
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
    isNapping,
    isAlarmRinging,
    startTime,
    actualDuration
  };
};
