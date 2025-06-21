
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import DebugTimer from './DebugTimer';

interface NapScreenProps {
  onStopNap: () => void;
  napMode?: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
  actualDuration?: number;
  isTransitioning?: boolean;
}

const NapScreen = ({ 
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
    if (isTransitioning) return;
    
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
    <div className="min-h-screen flex flex-col px-8 relative overflow-hidden">
      {/* Animated Liquid Gradient Background for Nap */}
      <div className="nap-liquid-gradient-container">
        <div className="nap-liquid-gradient-bg">
          <div className="nap-gradient-blob nap-blob-single"></div>
        </div>
      </div>

      {/* Debug Timer */}
      {!isTransitioning && (
        <DebugTimer 
          isNapping={true}
          napMode={napMode}
          startTime={startTime}
          actualDuration={actualDuration}
        />
      )}

      {/* Background Image - now with lower opacity to blend with animated background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/lovable-uploads/6a346e15-a6cd-4cbb-b120-f11f4fa549cf.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Main Content - Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Rotating Nap Text */}
        <h1 
          className={`text-3xl md:text-4xl font-light text-white leading-relaxed max-w-md transition-all duration-1000 ${
            isTransitioning 
              ? 'opacity-0' 
              : isTransitioningPhrase 
                ? 'opacity-0' 
                : 'opacity-100 animate-fade-in'
          }`}
        >
          {phrases[currentPhraseIndex]}
        </h1>
      </div>

      {/* Stop the nap button at bottom */}
      {!isTransitioning && (
        <div className="relative z-10 pb-16 flex justify-center">
          <Button
            onClick={onStopNap}
            className="bg-white/20 text-white border border-white/30 px-8 py-3 text-base font-light rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm animate-fade-in"
          >
            I'm awake
          </Button>
        </div>
      )}
    </div>
  );
};

export default NapScreen;
