import { useState } from 'react';
import TakeANapCard from '@/components/nap-modes/TakeANapCard';
import NapScreen from '@/components/NapScreen';
import WakeUpScreen from '@/components/WakeUpScreen';
import ManifestoSection from '@/components/ManifestoSection';
import LiquidGradientSection from '@/components/LiquidGradientSection';
import { useAlarmTimer } from '@/hooks/useAlarmTimer';

export type AppState = 'main' | 'transitioning-to-nap' | 'napping' | 'wake-up-screen' | 'transitioning-to-main';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main');

  const quickNapTimer = useAlarmTimer({
    onAlarmRing: () => setAppState('wake-up-screen'),
    onAlarmStop: () => setAppState('main')
  });

  const handleStartNap = () => {
    setAppState('transitioning-to-nap');
    
    setTimeout(() => {
      setAppState('napping');
      quickNapTimer.startNap();
    }, 2000);
  };

  const handleImAwake = () => {
    setAppState('transitioning-to-main');
    quickNapTimer.stopAlarm();
    
    setTimeout(() => {
      setAppState('main');
    }, 2000);
  };

  const handleLetMeBe = () => {
    setAppState('napping');
    quickNapTimer.extendNap();
  };

  const handleStopNap = () => {
    quickNapTimer.stopNap();
    setAppState('main');
  };

  const handleTestWakeUp = () => {
    console.log('Test wake up button pressed');
    // Trigger the alarm sound before showing wake up screen
    if (quickNapTimer.triggerAlarm) {
      console.log('Calling triggerAlarm for test');
      quickNapTimer.triggerAlarm();
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
        <div className="w-full h-screen relative">
          {/* Animated Liquid Gradient Background */}
          <LiquidGradientSection />
          
          {/* Fixed Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20" style={{ top: '40px' }}>
            <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
          </div>

          <div className="w-full h-screen relative z-10">
            <TakeANapCard onStartNap={handleStartNap} isTransitioning={appState === 'transitioning-to-nap'} />
          </div>
        </div>
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
            napMode="quick-nap"
            startTime={quickNapTimer.startTime}
            actualDuration={quickNapTimer.actualDuration}
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
