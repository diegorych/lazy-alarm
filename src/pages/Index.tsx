
import { useState } from 'react';
import NapModeCarousel, { NapMode } from '@/components/NapModeCarousel';
import NapScreen from '@/components/NapScreen';
import ManifestoSection from '@/components/ManifestoSection';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';
import { useBeforeDarkTimer } from '@/hooks/useBeforeDarkTimer';
import { useOversleepTimer } from '@/hooks/useOversleepTimer';

export type AppState = 'main' | 'napping' | 'alarm-ringing';

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
        <div className="relative">
          <NapModeCarousel onStartNap={handleStartNap} />
          <ManifestoSection />
        </div>
      )}
      
      {(appState === 'napping' || appState === 'alarm-ringing') && (
        <NapScreen 
          isAlarmRinging={appState === 'alarm-ringing'}
          onStopAlarm={handleStopAlarm}
          onStopNap={handleStopNap}
        />
      )}
    </div>
  );
};

export default Index;
