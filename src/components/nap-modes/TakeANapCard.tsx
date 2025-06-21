
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
        <h1 className={`text-4xl md:text-5xl font-normal mb-12 text-center text-slate-50 ${
          isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
        }`}>
          Take a quick nap
        </h1>

        <Button 
          onClick={onStartNap} 
          className={`bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm ${
            isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}
        >
          Start sleeping →
        </Button>
      </div>

      {/* Description at bottom */}
      <div className="pb-10 flex justify-center relative z-10 px-8">
        <p className={`font-light text-black text-center max-w-lg leading-relaxed ${
          isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
        }`} style={{ fontSize: '14px' }}>
          {"A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day."}
        </p>
      </div>
    </div>
  );
};

export default TakeANapCard;
