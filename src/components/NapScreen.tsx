
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import DebugTimer from './DebugTimer';
import CircularNapProgress from './CircularNapProgress';
import StarField from './StarField';

interface NapScreenProps {
  onStopNap: () => void;
  napMode?: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
  actualDuration?: number;
  isTransitioning?: boolean;
  onTestWakeUp?: () => void; // New prop for test button
}

const NapScreen = ({ 
  onStopNap, 
  napMode = 'quick-nap', 
  startTime, 
  actualDuration,
  isTransitioning = false,
  onTestWakeUp
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
    <div className="min-h-screen flex flex-col px-8 relative overflow-hidden animate-fade-in" style={{ animationDuration: '2s' }}>
      {/* Night sky background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/lovable-uploads/nap-bg-stars.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Animated star field */}
      <StarField />
      
      {/* Main Content - Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <CircularNapProgress
          startTime={startTime}
          actualDuration={actualDuration}
          isTransitioning={isTransitioning}
        >
          <h1 
            className={`text-lg md:text-xl font-wRegular text-white leading-relaxed transition-opacity duration-1000 ${
              isTransitioningPhrase ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {phrases[currentPhraseIndex]}
          </h1>
        </CircularNapProgress>
      </div>

      {/* I'm awake button at bottom */}
      {!isTransitioning && (
        <div className="relative z-10 pb-16 flex justify-center">
          <Button
            onClick={onStopNap}
            className="bg-white/20 text-white border border-white/30 px-8 py-3 text-base font-light rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm opacity-100"
          >
            I'm awake
          </Button>
        </div>
      )}
    </div>
  );
};

export default NapScreen;
