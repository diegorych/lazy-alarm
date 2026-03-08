
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
          className="bg-white text-black border border-gray-300 px-12 py-4 text-lg font-normal rounded-full hover:bg-gray-50 transition-all duration-300 shadow-sm max-w-[200px] w-full"
        >
          I'm awake
        </Button>
        
        <Button
          onClick={onLetMeBe}
          className="bg-transparent text-black border border-black px-12 py-4 text-lg font-normal rounded-full hover:bg-black/5 transition-all duration-300 max-w-[200px] w-full"
        >
          Let me be
        </Button>
      </div>
    </div>
  );
};

export default WakeUpScreen;
