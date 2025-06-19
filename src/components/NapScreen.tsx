
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import DebugTimer from './DebugTimer';

interface NapScreenProps {
  isAlarmRinging: boolean;
  onStopAlarm: () => void;
  onStopNap: () => void;
  napMode?: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
  actualDuration?: number;
  isTransitioning?: boolean;
}

const NapScreen = ({ 
  isAlarmRinging, 
  onStopAlarm, 
  onStopNap, 
  napMode = 'quick-nap', 
  startTime, 
  actualDuration,
  isTransitioning = false 
}: NapScreenProps) => {
  const phrases = [
    "Let the world keep spinning without you",
    "You're resting. That's enough",
    "There's nowhere else to be"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTransitioningPhrase, setIsTransitioningPhrase] = useState(false);

  useEffect(() => {
    if (isTransitioning) return; // Don't start phrase rotation during initial transition
    
    const interval = setInterval(() => {
      setIsTransitioningPhrase(true);
      
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setIsTransitioningPhrase(false);
      }, 300);
    }, 30000);

    return () => clearInterval(interval);
  }, [phrases.length, isTransitioning]);

  return (
    <div className={`min-h-screen flex flex-col px-8 relative overflow-hidden ${
      isTransitioning ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Debug Timer */}
      {!isTransitioning && (
        <DebugTimer 
          isNapping={true}
          napMode={napMode}
          startTime={startTime}
          actualDuration={actualDuration}
        />
      )}

      {/* Background Image with transition */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1500 ${
          isTransitioning ? 'opacity-0 animate-fade-in' : 'opacity-100'
        }`}
        style={{
          backgroundImage: `url('/lovable-uploads/6a346e15-a6cd-4cbb-b120-f11f4fa549cf.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Main Content - Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Rotating Nap Text with staggered animation */}
        <h1 
          className={`text-3xl md:text-4xl font-light text-white leading-relaxed max-w-md transition-all duration-1000 ${
            isTransitioning 
              ? 'opacity-0 transform translate-y-8 animate-fade-in animation-delay-500' 
              : isTransitioningPhrase 
                ? 'opacity-0' 
                : 'opacity-100'
          }`}
          style={{
            animationDelay: isTransitioning ? '500ms' : '0ms'
          }}
        >
          {phrases[currentPhraseIndex]}
        </h1>

        {/* Stop Button - Only show when alarm is ringing */}
        {isAlarmRinging && !isTransitioning && (
          <div className="mt-16 animate-fade-in">
            <Button
              onClick={onStopAlarm}
              className="bg-white/90 text-gray-800 px-12 py-4 text-lg font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm animate-pulse"
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      {/* Stop the nap button at bottom */}
      {!isTransitioning && (
        <div className="relative z-10 pb-16 flex justify-center animate-fade-in animation-delay-700">
          <Button
            onClick={onStopNap}
            className="bg-white/20 text-white border border-white/30 px-8 py-3 text-base font-light rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            Stop the nap
          </Button>
        </div>
      )}

      {/* Subtle floating particles effect */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NapScreen;
