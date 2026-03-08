
import { Button } from '@/components/ui/button';

interface WakeUpScreenProps {
  onImAwake: () => void;
  onLetMeBe: () => void;
  isTransitioning?: boolean;
}

const WakeUpScreen = ({ 
  onImAwake, 
  onLetMeBe, 
  isTransitioning = false 
}: WakeUpScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-[#f8f0ea]">
        <div className="wakeup-blob wakeup-blob-1" />
        <div className="wakeup-blob wakeup-blob-2" />
        <div className="wakeup-blob wakeup-blob-3" />
        <div className="wakeup-blob wakeup-blob-4" />
      </div>
      
      {/* Logo at top */}
      <div className={`relative z-10 pt-16 flex justify-center transition-all duration-1000 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        <img src="/logo.svg" alt="lazy alarm logo" className="h-10 w-auto" />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <h1 
          className={`text-2xl md:text-3xl font-normal text-black leading-relaxed max-w-sm transition-all duration-1000 ${
            isTransitioning 
              ? 'opacity-0 transform translate-y-8' 
              : 'opacity-100'
          }`}
        >
          Time to wake up... maybe.
        </h1>
      </div>

      {/* Buttons at bottom */}
      <div className={`relative z-10 pb-16 flex flex-col space-y-4 items-center transition-all duration-1000 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        <Button
          onClick={onImAwake}
          className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 text-black/80 border-none px-16 py-6 text-lg font-normal rounded-full hover:bg-white/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.05)] w-full md:max-w-[260px]"
        >
          I'm awake
        </Button>
        
        <Button
          onClick={onLetMeBe}
          className="bg-white/5 backdrop-blur-xl backdrop-saturate-150 text-black/60 border-none px-16 py-6 text-lg font-normal rounded-full hover:bg-white/15 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.03)] w-full md:max-w-[260px]"
        >
          Let me be
        </Button>
      </div>
    </div>
  );
};

export default WakeUpScreen;
