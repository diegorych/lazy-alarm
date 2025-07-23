
import { Button } from '@/components/ui/button';

interface TakeANapCardProps {
  onStartNap: () => void;
  isTransitioning?: boolean;
}

const TakeANapCard = ({ onStartNap, isTransitioning = false }: TakeANapCardProps) => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        <h1 className={`font-wUltralight text-5xl md:text-5xl mb-8 text-center text-slate-50 ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}>
          Take a <br />quick <span className="font-wBold ">nap</span>
        </h1>

        <Button
          onClick={onStartNap}
          className={`bg-white/90 text-gray-800 px-10 pt-6 pb-5 text-base rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
            }`}
        >
          Start sleeping →
        </Button>
      </div>

      {/* Description at bottom */}
      <div className="absolute bottom-0 w-full pb-10 flex justify-center z-10 px-8">
        <p className={`font-tRegular font-light text-black text-center max-w-lg leading-relaxed ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}>
          {"A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day."}
        </p>
      </div>
    </div>
  );
};

export default TakeANapCard;
