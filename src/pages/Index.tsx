
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
    }, 1500); // Allow time for transition
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
    <div className="min-h-screen w-full overflow-hidden">
      {appState === 'main' && (
        <div className="relative animate-fade-in">
          <NapModeCarousel onStartNap={handleStartNap} />
          <ManifestoSection />
        </div>
      )}
      
      {appState === 'transitioning-to-nap' && (
        <div className="relative">
          <div className="animate-fade-out">
            <NapModeCarousel onStartNap={handleStartNap} />
            <ManifestoSection />
          </div>
          <NapScreen 
            isAlarmRinging={false}
            onStopAlarm={handleStopAlarm}
            onStopNap={handleStopNap}
            napMode={currentNapMode}
            startTime={getCurrentTimer().startTime}
            actualDuration={getCurrentTimer().actualDuration}
            isTransitioning={true}
          />
        </div>
      )}
      
      {(appState === 'napping' || appState === 'alarm-ringing') && (
        <NapScreen 
          isAlarmRinging={appState === 'alarm-ringing'}
          onStopAlarm={handleStopAlarm}
          onStopNap={handleStopNap}
          napMode={currentNapMode}
          startTime={getCurrentTimer().startTime}
          actualDuration={getCurrentTimer().actualDuration}
          isTransitioning={false}
        />
      )}
    </div>
  );
};

export default Index;
