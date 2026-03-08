import { useState } from 'react';
import TakeANapCard from '@/components/nap-modes/TakeANapCard';
import NapScreen from '@/components/NapScreen';
import WakeUpScreen from '@/components/WakeUpScreen';
import ManifestoSection from '@/components/ManifestoSection';
import LiquidGradientSection from '@/components/LiquidGradientSection';
import NapSettings from '@/components/NapSettings';
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
    <div className="min-h-screen w-full overflow-hidden relative bg-black">
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
        <div className="w-full h-screen relative bg-black text-white">
          {/* Background */}
          <LiquidGradientSection />

          {/* Logo */}
          <div className="absolute inset-x-0 top-10 flex justify-center z-20">
            <img src="/logo.svg" alt="lazy alarm logo" className="h-8 md:h-10 w-auto" />
          </div>

          {/* Main hero */}
          <div className="w-full h-full relative z-10 flex flex-col">
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

      {/* Debug button: force wake up screen */}
      {appState === 'main' && (
        <button
          type="button"
          onClick={handleTestWakeUp}
          className="fixed bottom-4 right-4 z-50 text-xs md:text-sm text-neutral-400 hover:text-white/80 bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 transition-colors duration-200"
        >
          Test wake up
        </button>
      )}
    </div>
  );
};

export default Index;
