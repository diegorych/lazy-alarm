
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
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4c830c87-26a3-4c4c-ae40-be159d362028.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Logo at top */}
      <div className={`relative z-10 pt-16 flex justify-center transition-all duration-1000 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <h1 
          className={`text-4xl md:text-5xl font-normal text-black leading-relaxed max-w-md transition-all duration-1000 ${
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
