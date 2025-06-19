
import { useState } from 'react';
import NapModeCarousel, { NapMode } from '@/components/NapModeCarousel';
import NapScreen from '@/components/NapScreen';
import ManifestoSection from '@/components/ManifestoSection';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';
import { useBeforeDarkTimer } from '@/hooks/useBeforeDarkTimer';
import { useOversleepTimer } from '@/hooks/useOversleepTimer';

export type AppState = 'main' | 'transitioning-to-nap' | 'napping' | 'alarm-ringing';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [currentNapMode, setCurrentNapMode] = useState<NapMode>('quick-nap');

  const quickNapTimer = useAlarmTimer({
    onAlarmRing: () => setAppState('alarm-ringing'),
    onAlarmStop: () => setAppState('main')
  });

  const beforeDarkTimer = useBeforeDarkTimer({
    onAlarmRing: () => setAppState('alarm-ringing'),
    onAlarmStop: () => setAppState('main')
  });

  const oversleepTimer = useOversleepTimer({
    onAlarmRing: () => setAppState('alarm-ringing'),
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
    
    // Start the transition, then begin nap after transition completes
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
    }, 2000); // Allow time for transition
  };

  const handleStopAlarm = () => {
    getCurrentTimer().stopAlarm();
    setAppState('main');
  };

  const handleStopNap = () => {
    getCurrentTimer().stopNap();
    setAppState('main');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Main screen - always rendered but with conditional visibility */}
      <div className={`relative ${
        appState === 'main' 
          ? 'animate-fade-in' 
          : appState === 'transitioning-to-nap' 
            ? 'animate-transition-out' 
            : 'opacity-0 pointer-events-none'
      }`}>
        <NapModeCarousel 
          onStartNap={handleStartNap} 
          isTransitioning={appState === 'transitioning-to-nap'} 
        />
        <ManifestoSection />
      </div>
      
      {/* Nap screen - show during transition and nap states */}
      {(appState === 'transitioning-to-nap' || appState === 'napping' || appState === 'alarm-ringing') && (
        <div className={`absolute inset-0 ${
          appState === 'transitioning-to-nap' 
            ? 'animate-transition-in' 
            : 'opacity-100'
        }`}>
          <NapScreen 
            isAlarmRinging={appState === 'alarm-ringing'}
            onStopAlarm={handleStopAlarm}
            onStopNap={handleStopNap}
            napMode={currentNapMode}
            startTime={getCurrentTimer().startTime}
            actualDuration={getCurrentTimer().actualDuration}
            isTransitioning={appState === 'transitioning-to-nap'}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
