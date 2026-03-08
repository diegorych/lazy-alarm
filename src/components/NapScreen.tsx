
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

import DebugTimer from './DebugTimer';
import CircularNapProgress from './CircularNapProgress';
import useWhiteNoise from '@/hooks/useWhiteNoise';
import { Volume2, VolumeX } from 'lucide-react';

const SCENES = [
  { id: 'campfire', type: 'video', src: '/videos/campfire.mp4', nextThumb: '/images/scene-stars.png' },
  { id: 'stars', type: 'video', src: '/videos/stars.mp4', nextThumb: '/images/scene-room.png' },
  { id: 'room', type: 'video', src: '/videos/room.mp4', nextThumb: '/images/scene-bonfire.png' },
] as const;

type NapScene = typeof SCENES[number]['id'];

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
  const isMobile = useIsMobile();
  const { isPlaying: isWhiteNoise, toggle: toggleWhiteNoise, stop: stopWhiteNoise } = useWhiteNoise();
  const [scene, setScene] = useState<NapScene>('campfire');

  // On desktop, always force night-sky scene
  const activeScene = isMobile ? scene : 'night-sky' as NapScene;

  useEffect(() => {
    // Bloquear scroll mientras está la pantalla de siesta
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      stopWhiteNoise();
    };
  }, [stopWhiteNoise]);

  const cycleScene = () => {
    const currentIndex = SCENES.findIndex(s => s.id === scene);
    const nextIndex = (currentIndex + 1) % SCENES.length;
    setScene(SCENES[nextIndex].id);
  };

  const currentScene = SCENES.find(s => s.id === activeScene)!;

  return (
    <div className="h-screen flex flex-col px-8 relative overflow-hidden animate-transition-in">
      {/* Video backgrounds */}
      {SCENES.map((s) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${activeScene === s.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <video
            autoPlay
            loop
            muted
            playsInline
            ref={(el) => { if (el) el.playbackRate = 0.8; }}
            className="absolute inset-0 w-full h-full object-cover"
            src={s.src}
          />
        </div>
      ))}

      {/* Dark overlay with vignette */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Top controls */}
      {!isTransitioning && (
        <>
          {/* Scene toggle - top left (mobile only) */}
          {isMobile && (
            <div className="absolute top-6 left-6 z-20">
              <button
                onClick={cycleScene}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 shadow-lg shadow-black/30 transition-all duration-300 hover:border-white/60 hover:scale-105"
              >
                <img src={currentScene.nextThumb} alt="Next scene" className="w-full h-full object-cover" />
              </button>
            </div>
          )}

          {/* White noise button - top right */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={toggleWhiteNoise}
              className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
                isWhiteNoise 
                  ? 'bg-white/25 text-white border border-white/40' 
                  : 'bg-white/10 text-white/60 border border-white/20'
              }`}
            >
              {isWhiteNoise ? <Volume2 size={16} /> : <VolumeX size={16} />}
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
        />
      </div>

      {/* I'm awake button at bottom */}
      {!isTransitioning && (
        <div className="relative z-10 pb-16 flex justify-center">
          <Button
            onClick={onStopNap}
            className="bg-white/[0.06] text-white/90 border border-white/[0.12] px-14 py-5 text-lg font-light rounded-full hover:bg-white/[0.1] transition-all duration-300 shadow-[inset_0_0.5px_0.5px_rgba(255,255,255,0.15),0_2px_12px_rgba(0,0,0,0.2)]"
            style={{ WebkitBackdropFilter: 'blur(40px)', backdropFilter: 'blur(40px) saturate(1.4)' }}
          >
            I'm awake
          </Button>
        </div>
      )}
    </div>
  );
};

export default NapScreen;
