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
  const [napDuration, setNapDuration] = useState(25);
  const [autoStopAlarm, setAutoStopAlarm] = useState(true);

  const quickNapTimer = useAlarmTimer({
    onAlarmRing: () => setAppState('wake-up-screen'),
    onAlarmStop: () => setAppState('main'),
    napDurationMinutes: napDuration,
    autoStopAlarm,
  });

  const handleStartNap = () => {
    setAppState('transitioning-to-nap');
    
    setTimeout(() => {
      setAppState('napping');
      quickNapTimer.startNap();
    }, 1000);
  };

  const handleImAwake = () => {
    setAppState('transitioning-to-main');
    quickNapTimer.stopAlarm();
    
    setTimeout(() => {
      setAppState('main');
    }, 1000);
  };

  const handleLetMeBe = () => {
    setAppState('napping');
    quickNapTimer.extendNap();
  };

  const handleStopNap = () => {
    quickNapTimer.stopNap();
    setAppState('main');
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

          {/* Brand word */}
          <div className="absolute inset-x-0 top-16 flex justify-center z-20">
            <span className="text-sm md:text-base font-medium tracking-[0.35em] uppercase text-white/90">Lazy Alarm</span>
          </div>

          {/* Settings */}
          {appState === 'main' && (
            <NapSettings
              napDuration={napDuration}
              onNapDurationChange={setNapDuration}
              autoStopAlarm={autoStopAlarm}
              onAutoStopAlarmChange={setAutoStopAlarm}
            />
          )}

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

    </div>
  );
};

export default Index;
