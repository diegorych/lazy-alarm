import { useState } from 'react';
import NapModeCarousel, { NapMode } from '@/components/NapModeCarousel';
import NapScreen from '@/components/NapScreen';
import WakeUpScreen from '@/components/WakeUpScreen';
import ManifestoSection from '@/components/ManifestoSection';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';
import { useBeforeDarkTimer } from '@/hooks/useBeforeDarkTimer';
import { useOversleepTimer } from '@/hooks/useOversleepTimer';

export type AppState = 'main' | 'transitioning-to-nap' | 'napping' | 'wake-up-screen' | 'transitioning-to-main';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [currentNapMode, setCurrentNapMode] = useState<NapMode>('quick-nap');

  const quickNapTimer = useAlarmTimer({
    onAlarmRing: () => setAppState('wake-up-screen'),
    onAlarmStop: () => setAppState('main')
  });

  const beforeDarkTimer = useBeforeDarkTimer({
    onAlarmRing: () => setAppState('wake-up-screen'),
    onAlarmStop: () => setAppState('main')
  });

  const oversleepTimer = useOversleepTimer({
    onAlarmRing: () => setAppState('wake-up-screen'),
    onAlarmStop: () => setAppState('main')
  });

  const getCurrentTimer = () => {
    switch (currentNapMode) {
      case 'quick-nap':
        return quickNapTimer;
      case 'before-dark':
        return beforeDarkTimer;
      case 'if-oversleep':
        return oversleepTimer;
      default:
        return quickNapTimer;
    }
  };

  const handleStartNap = (mode: NapMode) => {
    setCurrentNapMode(mode);
    setAppState('transitioning-to-nap');
    
    setTimeout(() => {
      setAppState('napping');
      
      switch (mode) {
        case 'quick-nap':
          quickNapTimer.startNap();
          break;
        case 'before-dark':
          beforeDarkTimer.startNap();
          break;
        case 'if-oversleep':
          oversleepTimer.startNap();
          break;
      }
    }, 2000);
  };

  const handleImAwake = () => {
    setAppState('transitioning-to-main');
    getCurrentTimer().stopAlarm();
    
    setTimeout(() => {
      setAppState('main');
    }, 2000);
  };

  const handleLetMeBe = () => {
    setAppState('napping');
    getCurrentTimer().extendNap();
  };

  const handleStopNap = () => {
    getCurrentTimer().stopNap();
    setAppState('main');
  };

  const handleTestWakeUp = () => {
    console.log('Test wake up button pressed');
    // Trigger the alarm sound before showing wake up screen
    const currentTimer = getCurrentTimer();
    if (currentTimer.triggerAlarm) {
      console.log('Calling triggerAlarm for test');
      currentTimer.triggerAlarm();
    }
    setAppState('wake-up-screen');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Main screen */}
      <div className={`relative ${
        appState === 'main' 
          ? 'animate-fade-in' 
          : appState === 'transitioning-to-nap' 
            ? 'animate-transition-out' 
            : appState === 'transitioning-to-main'
              ? 'animate-transition-in'
              : 'opacity-0 pointer-events-none'
      }`}>
        <NapModeCarousel 
          onStartNap={handleStartNap} 
          isTransitioning={appState === 'transitioning-to-nap'} 
        />
        <ManifestoSection />
      </div>
      
      {/* Nap screen */}
      {(appState === 'transitioning-to-nap' || appState === 'napping') && (
        <div className={`absolute inset-0 ${
          appState === 'transitioning-to-nap' 
            ? 'animate-transition-in' 
            : 'opacity-100'
        }`}>
          <NapScreen 
            onStopNap={handleStopNap}
            napMode={currentNapMode}
            startTime={getCurrentTimer().startTime}
            actualDuration={getCurrentTimer().actualDuration}
            isTransitioning={appState === 'transitioning-to-nap'}
            onTestWakeUp={handleTestWakeUp}
          />
        </div>
      )}

      {/* Wake up screen */}
      {(appState === 'wake-up-screen' || appState === 'transitioning-to-main') && (
        <div className={`absolute inset-0 ${
          appState === 'wake-up-screen' 
            ? 'animate-transition-in' 
            : 'animate-transition-out'
        }`}>
          <WakeUpScreen 
            onImAwake={handleImAwake}
            onLetMeBe={handleLetMeBe}
            isTransitioning={appState === 'transitioning-to-main'}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
