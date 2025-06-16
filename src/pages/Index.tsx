
import { useState, useEffect } from 'react';
import MainScreen from '@/components/MainScreen';
import NapScreen from '@/components/NapScreen';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';

export type AppState = 'main' | 'napping' | 'alarm-ringing';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const { startNap, stopAlarm, isAlarmRinging, timeRemaining } = useAlarmTimer({
    onAlarmRing: () => setAppState('alarm-ringing'),
    onAlarmStop: () => setAppState('main')
  });

  const handleStartNap = () => {
    setAppState('napping');
    startNap();
  };

  const handleStopAlarm = () => {
    stopAlarm();
    setAppState('main');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {appState === 'main' && (
        <MainScreen onStartNap={handleStartNap} />
      )}
      
      {(appState === 'napping' || appState === 'alarm-ringing') && (
        <NapScreen 
          isAlarmRinging={appState === 'alarm-ringing'}
          onStopAlarm={handleStopAlarm}
        />
      )}
    </div>
  );
};

export default Index;
