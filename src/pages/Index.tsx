
import { useState, useEffect } from 'react';
import MainScreen from '@/components/MainScreen';
import NapScreen from '@/components/NapScreen';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';

export type AppState = 'main' | 'napping' | 'alarm-ringing';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { startNap, stopAlarm, stopNap, isAlarmRinging, timeRemaining } = useAlarmTimer({
    onAlarmRing: () => setAppState('alarm-ringing'),
    onAlarmStop: () => setAppState('main')
  });

  const handleStartNap = () => {
    setIsTransitioning(true);
    // Wait for fade out to complete before changing state
    setTimeout(() => {
      setAppState('napping');
      startNap();
      // Give a moment for state change, then fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 600); // Match fade out duration
  };

  const handleStopAlarm = () => {
    setIsTransitioning(true);
    stopAlarm();
    setTimeout(() => {
      setAppState('main');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 600);
  };

  const handleStopNap = () => {
    setIsTransitioning(true);
    stopNap();
    setTimeout(() => {
      setAppState('main');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Main Screen */}
      <div className={`absolute inset-0 transition-opacity duration-600 ease-out ${
        appState === 'main' 
          ? (isTransitioning ? 'opacity-0' : 'opacity-100') 
          : 'opacity-0 pointer-events-none'
      }`}>
        <MainScreen onStartNap={handleStartNap} />
      </div>
      
      {/* Nap Screen */}
      <div className={`absolute inset-0 transition-opacity duration-600 ease-out ${
        (appState === 'napping' || appState === 'alarm-ringing') 
          ? (isTransitioning ? 'opacity-0' : 'opacity-100') 
          : 'opacity-0 pointer-events-none'
      }`}>
        <NapScreen 
          isAlarmRinging={appState === 'alarm-ringing'}
          onStopAlarm={handleStopAlarm}
          onStopNap={handleStopNap}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  );
};

export default Index;
