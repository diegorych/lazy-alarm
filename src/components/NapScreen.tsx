
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import DebugTimer from './DebugTimer';
import CircularNapProgress from './CircularNapProgress';
import StarField from './StarField';
import useWhiteNoise from '@/hooks/useWhiteNoise';
import { Volume2, VolumeX, Flame, Stars } from 'lucide-react';

type NapScene = 'campfire' | 'night-sky';

interface NapScreenProps {
  onStopNap: () => void;
  napMode?: 'quick-nap' | 'before-dark' | 'if-oversleep';
  startTime?: number;
  actualDuration?: number;
  isTransitioning?: boolean;
  onTestWakeUp?: () => void;
}

const NapScreen = ({ 
  onStopNap, 
  napMode = 'quick-nap', 
  startTime, 
  actualDuration,
  isTransitioning = false,
  onTestWakeUp
}: NapScreenProps) => {
  const { isPlaying: isWhiteNoise, toggle: toggleWhiteNoise, stop: stopWhiteNoise } = useWhiteNoise();
  const [scene, setScene] = useState<NapScene>('campfire');

  const phrases = [
    "Let the world keep spinning without you",
    "You're resting. That's enough",
    "There's nowhere else to be"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTransitioningPhrase, setIsTransitioningPhrase] = useState(false);

  useEffect(() => {
    return () => stopWhiteNoise();
  }, [stopWhiteNoise]);

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
    <div className="min-h-screen flex flex-col px-8 relative overflow-hidden animate-transition-in">
      {/* Campfire video background */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${scene === 'campfire' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/campfire.mp4"
        />
      </div>

      {/* Night sky background - duplicate mirrored in landscape */}
      <div className={`transition-opacity duration-1000 ${scene === 'night-sky' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <style>{`
          .nap-bg-left, .nap-bg-right {
            position: absolute;
            top: 0;
            bottom: 0;
            background-image: url('/lovable-uploads/nap-bg-stars.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .nap-bg-left {
            left: 0;
            right: 0;
          }
          .nap-bg-right {
            display: none;
          }
          @media (orientation: landscape) {
            .nap-bg-left {
              left: 0;
              right: 50%;
              background-position: right center;
            }
            .nap-bg-right {
              display: block;
              left: 50%;
              right: 0;
              transform: scaleX(-1);
              background-position: right center;
            }
          }
        `}</style>
        <div className="nap-bg-left" />
        <div className="nap-bg-right" />
      </div>

      {/* Animated star field (only for night-sky) */}
      {scene === 'night-sky' && <StarField />}

      {/* Dark overlay with vignette */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: scene === 'campfire'
            ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Top controls */}
      {!isTransitioning && (
        <>
          {/* Scene toggle - top left */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => setScene(s => s === 'campfire' ? 'night-sky' : 'campfire')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 text-sm font-wRegular bg-white/10 text-white/80 border border-white/20 hover:bg-white/20`}
            >
              {scene === 'campfire' ? <Stars size={16} /> : <Flame size={16} />}
              {scene === 'campfire' ? 'Night sky' : 'Campfire'}
            </button>
          </div>

          {/* White noise button - top right */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={toggleWhiteNoise}
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 text-sm font-wRegular ${
                isWhiteNoise 
                  ? 'bg-white/25 text-white border border-white/40' 
                  : 'bg-white/10 text-white/60 border border-white/20'
              }`}
            >
              {isWhiteNoise ? <Volume2 size={16} /> : <VolumeX size={16} />}
              White noise
            </button>
          </div>
        </>
      )}
      
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
